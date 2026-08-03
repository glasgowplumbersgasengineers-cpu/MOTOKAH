import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { IconBell } from "@tabler/icons-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user) return;
    if (user.id.startsWith("demo-")) {
      setNotifications([]);
      return;
    }
    supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20).then(({ data }) => {
      if (data) setNotifications(data);
    });

    const channel = supabase.channel("notifications").on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, (payload) => {
      setNotifications((prev) => [payload.new as Notification, ...prev]);
    }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const markRead = async (id: string) => {
    if (user?.id.startsWith("demo-")) {
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
      return;
    }
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative flex items-center justify-center w-8 h-8 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
        <IconBell size={18} stroke={2.5} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-border">
              <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
            </div>
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground text-center">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <button key={n.id} onClick={() => markRead(n.id)} className={`w-full text-left px-4 py-3 border-b border-border hover:bg-secondary transition-colors ${!n.read ? "bg-primary/5" : ""}`}>
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
