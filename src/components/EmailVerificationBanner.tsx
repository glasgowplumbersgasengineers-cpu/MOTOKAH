import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { IconAlertTriangle, IconX } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  if (!user || dismissed) return null;

  const isVerified = user.email_confirmed_at || user.confirmed_at;
  if (isVerified) return null;

  const resend = async () => {
    setSending(true);
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email: user.email! });
      if (error) throw error;
      toast({ title: "Verification email sent!", description: "Check your inbox." });
    } catch {
      toast({ title: "Could not send email", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-accent/10 border-b border-accent/30 px-4 py-2.5 flex items-center justify-center gap-3 text-sm">
      <IconAlertTriangle size={16} className="text-accent shrink-0" />
      <span className="text-foreground">
        Please verify your email address.
      </span>
      <Button variant="link" size="sm" className="text-primary p-0 h-auto" onClick={resend} disabled={sending}>
        {sending ? "Sending..." : "Resend verification email"}
      </Button>
      <button onClick={() => setDismissed(true)} className="ml-2 text-muted-foreground hover:text-foreground">
        <IconX size={14} />
      </button>
    </div>
  );
}
