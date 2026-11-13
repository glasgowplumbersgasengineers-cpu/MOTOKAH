import { supabase } from "@/integrations/supabase/client";

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body?: string
) {
  await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    body: body ?? null,
    read: false,
  });

  // Fire-and-forget push notification to the user's registered devices.
  // The edge function handles token lookup and APNs delivery; failures here
  // are silent because the in-app bell is the primary notification channel.
  supabase.functions.invoke("send-push", {
    body: { user_id: userId, title, body: body ?? "", data: { type } },
  }).catch(() => {});
}
