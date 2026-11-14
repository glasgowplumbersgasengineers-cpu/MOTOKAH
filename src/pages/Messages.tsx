import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconSend, IconMessageCircle, IconArrowLeft, IconSearch, IconCheck, IconChecks } from "@tabler/icons-react";
import { createNotification } from "@/lib/notifications";
import { useIsMobile } from "@/hooks/use-mobile";
import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { toast } from "sonner";
import ChatSafetyMenu from "@/components/ChatSafetyMenu";
import { blockSeller, getBlockedSellerKeys } from "@/lib/blockedSellers";

interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  listing_id: string | null;
  last_message_at: string | null;
  other_name?: string;
  last_message?: string;
  unread_count?: number;
  listing_title?: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

const MAX_CHARS = 500;

export default function Messages() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // The open conversation lives in the URL so the system back gesture closes the chat
  // (back to the list) instead of leaving Messages, like WhatsApp.
  const active = searchParams.get("c");
  const setActive = (id: string | null) => {
    if (id) {
      const push = window.innerWidth < 768;
      setSearchParams({ c: id }, { replace: !push, state: push ? { chatPushed: true } : undefined });
    } else if (window.history.state?.usr?.chatPushed) {
      navigate(-1);
    } else {
      setSearchParams({}, { replace: true });
    }
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [convoLoading, setConvoLoading] = useState(true);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Scroll only the message list. scrollIntoView also scrolls ancestors (the page itself on iOS).
  const scrollToBottom = (smooth = false) => {
    requestAnimationFrame(() => {
      const el = messagesScrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    });
  };

  // Was the user already near the newest message before this scroll-triggering
  // event (keyboard open, new message)? Used to avoid yanking someone reading
  // older messages down to the bottom.
  const isNearBottom = () => {
    const el = messagesScrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  // On mobile, show the list or the chat — not both
  const showList = isMobile ? active === null : true;
  const showChat = isMobile ? active !== null : true;

  useEffect(() => {
    if (!user) return;
    setConvoLoading(true);

    supabase
      .from("conversations")
      .select("*")
      .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false })
      .then(async ({ data, error }) => {
        if (error || !data) { setConversations([]); setConvoLoading(false); return; }

        const convos = await Promise.all(data.map(async (c) => {
          const otherId = c.participant1_id === user.id ? c.participant2_id : c.participant1_id;

          // maybeSingle(), not single(): a brand-new conversation legitimately has
          // zero messages until the first one is sent (SellerCard.tsx creates the
          // conversation row before any message exists), and a listing can be
          // deleted while its conversation remains — single() 406s noisily on
          // these valid zero-row cases. Found live via a real two-account send test.
          const [profileRes, lastMsgRes, unreadRes, listingRes] = await Promise.all([
            supabase.from("profiles").select("display_name").eq("user_id", otherId).maybeSingle(),
            supabase.from("messages").select("content").eq("conversation_id", c.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
            supabase.from("messages").select("id", { count: "exact" }).eq("conversation_id", c.id).eq("read", false).neq("sender_id", user.id),
            c.listing_id
              ? supabase.from("listings").select("title").eq("id", c.listing_id).maybeSingle()
              : Promise.resolve({ data: null }),
          ]);

          return {
            ...c,
            other_name: profileRes.data?.display_name || "User",
            last_message: lastMsgRes.data?.content || "",
            unread_count: unreadRes.count || 0,
            listing_title: listingRes.data?.title || null,
          };
        }));

        setConversations(convos);
        // Desktop shows list and chat side by side, so preselect one; phones open on the list.
        if (convos.length > 0 && !active && window.innerWidth >= 768) setActive(convos[0].id);
        setConvoLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!active) return;
    setMessagesLoading(true);

    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", active)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages(data || []);
        setMessagesLoading(false);
        scrollToBottom();
      });

    // Mark as read
    if (user) {
      supabase
        .from("messages")
        .update({ read: true })
        .eq("conversation_id", active)
        .neq("sender_id", user.id)
        .then(() => {
          // Reset unread count locally
          setConversations(prev =>
            prev.map(c => c.id === active ? { ...c, unread_count: 0 } : c)
          );
        });
    }

    // Realtime subscription
    const channel = supabase
      .channel(`messages-${active}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${active}` }, (payload) => {
        const newMsg = payload.new as Message;
        const wasNearBottom = isNearBottom();
        setMessages(prev => prev.some(m => m.id === newMsg.id) ? prev : [...prev, newMsg]);
        if (wasNearBottom) scrollToBottom(true);

        // Mark as read if it's from the other user
        if (newMsg.sender_id !== user?.id) {
          supabase.from("messages").update({ read: true }).eq("id", newMsg.id).then(() => {});
        }

        // Update last message in convo list
        setConversations(prev =>
          prev.map(c => c.id === active ? { ...c, last_message: newMsg.content, last_message_at: newMsg.created_at } : c)
        );
      })
      // Read receipts: the recipient marking a message read turns the sender's ticks blue live.
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages", filter: `conversation_id=eq.${active}` }, (payload) => {
        const updated = payload.new as Message;
        setMessages(prev => prev.map(m => m.id === updated.id ? { ...m, read: updated.read } : m));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [active, user]);

  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!text.trim() || !active || !user || sending) return;
    const content = text.trim().slice(0, MAX_CHARS);
    setSending(true);

    const { data: inserted, error } = await supabase
      .from("messages")
      .insert({ conversation_id: active, sender_id: user.id, content })
      .select()
      .single();
    if (error || !inserted) {
      setSending(false);
      toast.error("Message didn't send. Check your connection and try again.");
      return;
    }
    setText("");
    setSending(false);
    // Optimistic append — don't rely solely on the realtime subscription to
    // show the sender their own message (dedupe by id if realtime also delivers it).
    setMessages(prev => prev.some(m => m.id === inserted.id) ? prev : [...prev, inserted as Message]);
    scrollToBottom(true);

    await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", active);

    const convo = conversations.find(c => c.id === active);
    if (convo) {
      const recipientId = convo.participant1_id === user.id ? convo.participant2_id : convo.participant1_id;
      const senderName = user.user_metadata?.display_name || user.user_metadata?.full_name || "a buyer or seller";
      await createNotification(recipientId, "new_message", "New message", `You have a new message from ${senderName}.`);
    }
  };

  const otherIdOf = (c: Conversation) => (c.participant1_id === user?.id ? c.participant2_id : c.participant1_id);
  const filteredConvos = conversations.filter(c =>
    !getBlockedSellerKeys().has(otherIdOf(c).toLowerCase()) &&
    (!search || c.other_name?.toLowerCase().includes(search.toLowerCase()))
  );

  const reportChatUser = async (c: Conversation, reason: string) => {
    if (!user) return;
    const { error } = await supabase.from("reports").insert({
      reporter_id: user.id, reason, reported_user_id: otherIdOf(c), listing_id: c.listing_id,
      context: `Chat with ${c.other_name || "user"} (conversation ${c.id})`,
    });
    if (error) toast.error("Report could not be submitted. Please try again.");
    else toast.success("Report submitted. Our team reviews reports within 24 hours.");
  };

  const blockChatUser = (c: Conversation) => {
    if (!user) return;
    blockSeller({ sellerId: otherIdOf(c), sellerName: c.other_name || "" }, user.id);
    setConversations(prev => prev.filter(x => x.id !== c.id));
    setActive(null);
    toast.success(`${c.other_name || "User"} has been blocked.`);
  };

  const activeConvo = conversations.find(c => c.id === active);
  const isFullScreenChat = isMobile && showChat && !convoLoading && conversations.length > 0;

  // Toggle a body attribute (not a prop) so BottomNav — a sibling rendered
  // outside this component's own subtree — can hide itself via plain CSS
  // with no cross-component state plumbing, and no coupling to the
  // keyboard's own open/close timing (it just tracks "a conversation is
  // open full-screen on mobile", never overlapping the composer).
  useEffect(() => {
    document.body.dataset.chatOpen = isFullScreenChat ? "true" : "false";
    return () => { delete document.body.dataset.chatOpen; };
  }, [isFullScreenChat]);

  // Pin the chat between the top of the screen and the top of the keyboard.
  // iOS: the keyboard overlays the WebView, so track its height from the plugin and stop the
  // WebView's own scroll so iOS can't shove the page up when the input focuses.
  // Android: the WebView itself resizes, so no offset is needed.
  // Mobile web: derive the keyboard from visualViewport.
  useEffect(() => {
    if (!isFullScreenChat) return;
    const platform = Capacitor.getPlatform();
    const keepBottom = () => { if (isNearBottom()) scrollToBottom(); };

    if (platform === "ios") {
      Keyboard.setScroll({ isDisabled: true }).catch(() => {});
      const subs = [
        Keyboard.addListener("keyboardWillShow", (info) => { setKeyboardHeight(info.keyboardHeight); keepBottom(); }),
        Keyboard.addListener("keyboardDidShow", keepBottom),
        Keyboard.addListener("keyboardWillHide", () => setKeyboardHeight(0)),
      ];
      return () => {
        subs.forEach(s => s.then(l => l.remove()));
        Keyboard.setScroll({ isDisabled: false }).catch(() => {});
        setKeyboardHeight(0);
      };
    }
    if (platform === "android") {
      const sub = Keyboard.addListener("keyboardDidShow", keepBottom);
      return () => { sub.then(l => l.remove()); };
    }
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => {
      setKeyboardHeight(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
      keepBottom();
    };
    vv.addEventListener("resize", onResize);
    return () => { vv.removeEventListener("resize", onResize); setKeyboardHeight(0); };
  }, [isFullScreenChat]);

  // Mobile, inside an open conversation: a dedicated full-height flex layout
  // instead of the normal scrolling page. Header sizes itself normally and
  // the chat panel takes the rest via flex-1/min-h-0, so it (not the whole
  // page) is what shrinks when the keyboard opens — the body itself already
  // resizes via capacitor.config.ts's Keyboard.resize:"body", and h-dvh here
  // tracks that resize live instead of a stale/static 100vh.
  if (isFullScreenChat) {
    const grouped: { date: string; msgs: Message[] }[] = [];
    for (const m of messages) {
      const d = new Date(m.created_at).toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
      const last = grouped[grouped.length - 1];
      if (last && last.date === d) last.msgs.push(m);
      else grouped.push({ date: d, msgs: [m] });
    }
    const today = new Date().toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });

    return (
      <div className="fixed inset-x-0 top-0 z-40 flex flex-col bg-background" style={{ bottom: keyboardHeight }}>
        {/* Chat header with safe-area-inset-top for Dynamic Island */}
        <div className="shrink-0 bg-card border-b border-border" style={{ paddingTop: "env(safe-area-inset-top)" }}>
          <div className="flex items-center gap-3 px-4 py-2.5">
            <button onClick={() => setActive(null)} className="flex items-center justify-center w-9 h-9 -ml-1 rounded-full active:bg-muted transition-colors">
              <IconArrowLeft size={22} className="text-primary" />
            </button>
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
              {activeConvo?.other_name?.[0] ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[15px] text-foreground leading-tight">{activeConvo?.other_name}</p>
              {activeConvo?.listing_title && (
                <p className="text-[11px] text-primary truncate leading-tight">Re: {activeConvo.listing_title}</p>
              )}
            </div>
            {activeConvo && <ChatSafetyMenu name={activeConvo.other_name || "user"} onReport={(reason) => reportChatUser(activeConvo, reason)} onBlock={() => blockChatUser(activeConvo)} />}
          </div>
        </div>

        {/* Messages area with chat wallpaper */}
        <div
          ref={messagesScrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.02) 0%, transparent 40%)",
            backgroundColor: "hsl(var(--background))",
          }}
        >
          {messagesLoading ? (
            [1,2,3].map(i => (
              <div key={i} className={`flex mb-2 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                <div className="h-9 rounded-2xl bg-muted animate-pulse" style={{ width: `${40 + i * 15}%` }} />
              </div>
            ))
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <div className="bg-card/80 backdrop-blur rounded-2xl px-6 py-5 text-center shadow-sm">
                <IconMessageCircle size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs opacity-60 mt-1">Say hello to start the conversation</p>
              </div>
            </div>
          ) : (
            grouped.map(g => (
              <div key={g.date}>
                {/* Day separator chip */}
                <div className="flex justify-center my-3">
                  <span className="bg-card/90 backdrop-blur text-muted-foreground text-[11px] font-medium px-3 py-1 rounded-full shadow-sm">
                    {g.date === today ? "Today" : g.date === yesterday ? "Yesterday" : g.date}
                  </span>
                </div>
                {g.msgs.map((m, i) => {
                  const mine = m.sender_id === user?.id;
                  const nextSame = i < g.msgs.length - 1 && g.msgs[i + 1].sender_id === m.sender_id;
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"} ${nextSame ? "mb-0.5" : "mb-2"}`}>
                      <div className={`max-w-[78%] px-3 py-1.5 text-[15px] leading-relaxed shadow-sm break-words [overflow-wrap:anywhere] ${
                        mine
                          ? `bg-primary text-primary-foreground ${nextSame ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-br-sm"}`
                          : `bg-card text-foreground border border-border/50 ${nextSame ? "rounded-2xl rounded-bl-md" : "rounded-2xl rounded-bl-sm"}`
                      }`}>
                        <span>{m.content}</span>
                        <span className={`inline-flex items-center gap-0.5 float-right ml-2 mt-1 text-[10px] leading-none ${mine ? "opacity-70" : "text-muted-foreground"}`}>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {mine && (m.read
                            ? <IconChecks size={13} className="text-sky-300" />
                            : <IconCheck size={13} />
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Composer: home-indicator padding only while the keyboard is down */}
        <div className="shrink-0 bg-card/95 backdrop-blur px-2 py-2" style={{ paddingBottom: keyboardHeight > 0 ? "0.5rem" : "max(0.5rem, env(safe-area-inset-bottom))" }}>
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <input
                value={text}
                onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Message"
                enterKeyHint="send"
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                className="w-full rounded-full bg-background border border-border px-4 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={send}
              // Keep focus in the input so the keyboard stays up between messages.
              onPointerDown={e => e.preventDefault()}
              aria-label="Send message"
              disabled={!text.trim() || sending}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground disabled:opacity-40 transition-opacity active:scale-95"
            >
              <IconSend size={18} />
            </button>
          </div>
          {text.length > MAX_CHARS * 0.8 && (
            <p className="text-[10px] text-muted-foreground text-right mt-1 mr-12">{text.length}/{MAX_CHARS}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <IconMessageCircle size={24} className="text-primary" /> Messages
        </h1>

        {convoLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px]">
            <div className="border border-border rounded-xl overflow-hidden space-y-px">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-muted animate-pulse" />)}
            </div>
            <div className="md:col-span-2 border border-border rounded-xl bg-muted animate-pulse" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <IconMessageCircle size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No messages yet.</p>
            <p className="text-sm mt-1">Start a conversation from any listing page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
            {/* Conversation list */}
            {showList && (
              <div className="border border-border rounded-xl flex flex-col overflow-hidden">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <IconSearch size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search conversations..."
                      className="pl-7 h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredConvos.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-6">No conversations found.</p>
                  ) : (
                    filteredConvos.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setActive(c.id)}
                        className={`w-full text-left px-4 py-3 border-b border-border hover:bg-secondary transition-colors ${active === c.id ? "bg-secondary" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-foreground truncate">{c.other_name}</p>
                            {c.listing_title && (
                              <p className="text-[10px] text-primary truncate mb-0.5">{c.listing_title}</p>
                            )}
                            {c.last_message && (
                              <p className="text-xs text-muted-foreground truncate">{c.last_message}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {c.last_message_at && (
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                {new Date(c.last_message_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                              </span>
                            )}
                            {(c.unread_count ?? 0) > 0 && (
                              <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                {c.unread_count}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Chat window */}
            {showChat && (
              <div className="md:col-span-2 border border-border rounded-xl flex flex-col overflow-hidden">
                {/* Chat header */}
                {activeConvo && (
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
                    {isMobile && (
                      <button onClick={() => setActive(null)} className="text-muted-foreground hover:text-foreground">
                        <IconArrowLeft size={20} />
                      </button>
                    )}
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {activeConvo.other_name?.[0] ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground">{activeConvo.other_name}</p>
                      {activeConvo.listing_title && (
                        <p className="text-[10px] text-primary truncate">Re: {activeConvo.listing_title}</p>
                      )}
                    </div>
                    <div className="ml-auto"><ChatSafetyMenu name={activeConvo.other_name || "user"} onReport={(reason) => reportChatUser(activeConvo, reason)} onBlock={() => blockChatUser(activeConvo)} /></div>
                  </div>
                )}

                {/* Messages */}
                <div ref={messagesScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messagesLoading ? (
                    <>
                      {[1,2,3].map(i => (
                        <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                          <div className="h-9 rounded-xl bg-muted animate-pulse" style={{ width: `${40 + i * 15}%` }} />
                        </div>
                      ))}
                    </>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <IconMessageCircle size={36} className="mb-2 opacity-30" />
                      <p className="text-sm">No messages yet — say hello!</p>
                    </div>
                  ) : (
                    messages.map(m => (
                      <div key={m.id} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${m.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                          {m.content}
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <p className="text-[10px] opacity-60">{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                            {m.sender_id === user?.id && (
                              <span className="text-[10px] opacity-60">{m.read ? "✓✓" : "✓"}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-border p-3 space-y-1">
                  <div className="flex gap-2">
                    <Input
                      value={text}
                      onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
                      placeholder="Type a message..."
                      onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                      className="flex-1"
                    />
                    <Button onClick={send} size="icon" disabled={!text.trim() || sending}>
                      <IconSend size={18} />
                    </Button>
                  </div>
                  {text.length > MAX_CHARS * 0.8 && (
                    <p className="text-[10px] text-muted-foreground text-right">{text.length}/{MAX_CHARS}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
