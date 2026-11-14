import { useState } from "react";
import { Capacitor } from "@capacitor/core";
import { IconBell } from "@tabler/icons-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { getMarketingOptIn, setMarketingOptIn } from "@/lib/pushPrefs";

export default function PushSettingsCard() {
  const { user } = useAuth();
  const [on, setOn] = useState(getMarketingOptIn);
  if (!Capacitor.isNativePlatform() || !user) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-xs">
      <h2 className="text-base md:text-lg font-bold text-foreground flex items-center gap-2">
        <IconBell size={18} className="text-primary" /> Notifications
      </h2>
      <div className="flex items-center justify-between gap-4 mt-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Deals, tips and fun</p>
          <p className="text-xs text-muted-foreground">New cars, fuel price changes and the odd laugh, a few times a week. Messages and listing updates always come through.</p>
        </div>
        <Switch
          checked={on}
          aria-label="Deals, tips and fun notifications"
          onCheckedChange={(v) => { setOn(v); setMarketingOptIn(user.id, v); }}
        />
      </div>
    </div>
  );
}
