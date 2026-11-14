import { supabase } from "@/integrations/supabase/client";

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body?: string
) {
  // The id is generated here because the sender can't read back a row addressed to someone else.
  const id = crypto.randomUUID();
  const { error } = await supabase.from("notifications").insert({
    id,
    user_id: userId,
    type,
    title,
    body: body ?? null,
    read: false,
  });
  if (error) return;

  // send-push only delivers an existing, just-created notification row, so the push can never
  // say anything the database's insert rules didn't allow.
  supabase.functions.invoke("send-push", { body: { notification_id: id } }).catch(() => {});
}
