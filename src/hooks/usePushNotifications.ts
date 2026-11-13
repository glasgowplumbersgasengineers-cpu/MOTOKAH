import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function usePushNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const registered = useRef(false);

  useEffect(() => {
    if (!user || !Capacitor.isNativePlatform() || registered.current) return;

    async function setup() {
      const perm = await PushNotifications.checkPermissions();
      if (perm.receive === "prompt" || perm.receive === "prompt-with-rationale") {
        const result = await PushNotifications.requestPermissions();
        if (result.receive !== "granted") return;
      } else if (perm.receive !== "granted") {
        return;
      }

      await PushNotifications.register();
      registered.current = true;
    }

    PushNotifications.addListener("registration", async (token) => {
      const platform = Capacitor.getPlatform() as "ios" | "android";
      await supabase.from("device_tokens").upsert(
        { user_id: user.id, token: token.value, platform, updated_at: new Date().toISOString() },
        { onConflict: "user_id,token" }
      );
    });

    PushNotifications.addListener("registrationError", (err) => {
      console.warn("Push registration failed:", err.error);
    });

    PushNotifications.addListener("pushNotificationReceived", (_notification) => {
      // Foreground: the in-app NotificationBell already shows via realtime.
      // No need to show a duplicate OS banner.
    });

    PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
      const data = action.notification.data;
      if (data?.type === "new_message") {
        navigate("/messages");
      } else if (data?.type === "listing_approved") {
        navigate("/profile");
      }
    });

    setup();

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [user, navigate]);
}
