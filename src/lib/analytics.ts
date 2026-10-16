import { supabase } from "@/integrations/supabase/client";

function getOrCreateSessionId(): string {
  const key = "motokah_sid";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

// Fire-and-forget funnel event. Never throws, never blocks the UI -- a broken
// analytics insert should not be able to break the actual feature it's measuring.
export function trackEvent(eventName: string, metadata: Record<string, unknown> = {}) {
  const sessionId = getOrCreateSessionId();
  const userId = metadata.userId as string | undefined;
  const { userId: _omit, ...rest } = metadata;
  supabase
    .from("analytics_events")
    .insert({
      session_id: sessionId,
      event_name: eventName,
      page: typeof window !== "undefined" ? window.location.pathname : null,
      user_id: userId ?? null,
      metadata: rest,
    })
    .then(({ error }) => {
      if (error) console.error(`[analytics] failed to track "${eventName}":`, error.message);
    });
}
