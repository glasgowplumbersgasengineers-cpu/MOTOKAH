import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconSend, IconMessageCircle, IconArrowLeft, IconSearch } from "@tabler/icons-react";
import { createNotification } from "@/lib/notifications";
import { useIsMobile } from "@/hooks/use-mobile";
import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { toast } from "sonner";

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
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [convoLoading, setConvoLoading] = useState(true);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

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
        if (convos.length > 0 && !active) setActive(convos[0].id);
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
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
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
        setMessages(prev => prev.some(m => m.id === newMsg.id) ? prev : [...prev, newMsg]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

        // Mark as read if it's from the other user
        if (newMsg.sender_id !== user?.id) {
          supabase.from("messages").update({ read: true }).eq("id", newMsg.id).then(() => {});
        }

        // Update last message in convo list
        setConversations(prev =>
          prev.map(c => c.id === active ? { ...c, last_message: newMsg.content, last_message_at: newMsg.created_at } : c)
        );
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [active, user]);

  // Native keyboard: scroll the active message into view once the keyboard
  // finishes animating open, so the input/last message isn't left hidden
  // behind it (body-resize alone doesn't guarantee scroll position).
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    });
    return () => { showSub.then(s => s.remove()); };
  }, []);

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
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", active);

    const convo = conversations.find(c => c.id === active);
    if (convo) {
      const recipientId = convo.participant1_id === user.id ? convo.participant2_id : convo.participant1_id;
      await createNotification(recipientId, "new_message", "New message", `You have a new message from ${convo.other_name}.`);
    }
  };

  const filteredConvos = conversations.filter(c =>
    !search || c.other_name?.toLowerCase().includes(search.toLowerCase())
  );

  const activeConvo = conversations.find(c => c.id === active);

  return (
    <div className="min-h-screen bg-background">
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
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                  <div ref={bottomRef} />
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
