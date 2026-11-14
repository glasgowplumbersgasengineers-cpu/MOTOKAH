import { supabase } from "@/integrations/supabase/client";

const OPT_IN_KEY = "motokah_marketing_push";
const ASKED_KEY = "motokah_marketing_asked";
export const ASK_MARKETING_EVENT = "motokah-ask-marketing";

export const getMarketingOptIn = () => localStorage.getItem(OPT_IN_KEY) === "true";
export const wasMarketingAsked = () => localStorage.getItem(ASKED_KEY) === "true";

// Language/country/opt-in travel with each device token so the campaign sender can target them.
export function deviceTokenPrefs() {
  return {
    marketing_opt_in: getMarketingOptIn(),
    language: localStorage.getItem("motokah_lang") === "sw" ? "sw" : "en",
    country: localStorage.getItem("motokah_country") || null,
  };
}

export async function setMarketingOptIn(userId: string, optIn: boolean) {
  localStorage.setItem(OPT_IN_KEY, String(optIn));
  localStorage.setItem(ASKED_KEY, "true");
  await supabase.from("device_tokens").update({ ...deviceTokenPrefs(), updated_at: new Date().toISOString() }).eq("user_id", userId);
}
