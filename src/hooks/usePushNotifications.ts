import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const ROUTES: Record<string, string> = {
  new_message: "/messages",
  listing_approved: "/profile",
  listing_rejected: "/profile",
  dealer_approved: "/dealer-dashboard",
  dealer_rejected: "/dealer-dashboard",
  new_listing: "/admin/listings",
};

export function usePushNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // useNavigate's identity changes on every route change; keep it out of the effect deps
  // so listeners aren't torn down on navigation.
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const userId = user?.id;

  useEffect(() => {
    if (!userId || userId.startsWith("demo-") || !Capacitor.isNativePlatform()) return;

    const handles = [
      PushNotifications.addListener("registration", async (token) => {
        await supabase.from("device_tokens").upsert(
          { user_id: userId, token: token.value, platform: Capacitor.getPlatform(), updated_at: new Date().toISOString() },
          { onConflict: "user_id,token" },
        );
      }),
      PushNotifications.addListener("registrationError", (err) => {
        console.warn("Push registration failed:", err.error);
      }),
      PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
        const route = ROUTES[action.notification.data?.type];
        if (route) navigateRef.current(route);
      }),
    ];

    (async () => {
      let perm = await PushNotifications.checkPermissions();
      if (perm.receive === "prompt" || perm.receive === "prompt-with-rationale") {
        perm = await PushNotifications.requestPermissions();
      }
      if (perm.receive === "granted") await PushNotifications.register();
    })().catch((e) => console.warn("Push setup failed:", e));

    return () => {
      handles.forEach((h) => h.then((l) => l.remove()));
    };
  }, [userId]);
}
