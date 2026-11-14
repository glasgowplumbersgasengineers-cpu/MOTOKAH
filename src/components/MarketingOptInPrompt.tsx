import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { ASK_MARKETING_EVENT, setMarketingOptIn, wasMarketingAsked } from "@/lib/pushPrefs";

const COPY = {
  en: {
    title: "Want car deals and road news?",
    body: "A few times a week: new cars, fuel price changes and the odd laugh from the road. You can turn this off anytime in Settings.",
    yes: "Yes please",
    no: "No thanks",
  },
  sw: {
    title: "Tukutumie dili na habari za magari?",
    body: "Mara chache kwa wiki: magari mapya, mabadiliko ya bei ya mafuta na vichekesho vya barabarani. Unaweza kuzima wakati wowote kwenye Mipangilio.",
    yes: "Ndiyo, tuma",
    no: "Hapana, asante",
  },
};

export default function MarketingOptInPrompt() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const t = lang === "sw" ? COPY.sw : COPY.en;

  useEffect(() => {
    const show = () => { if (!wasMarketingAsked()) setOpen(true); };
    window.addEventListener(ASK_MARKETING_EVENT, show);
    return () => window.removeEventListener(ASK_MARKETING_EVENT, show);
  }, []);

  const choose = (optIn: boolean) => {
    setOpen(false);
    if (user) setMarketingOptIn(user.id, optIn);
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => { if (!o) choose(false); }}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{t.title}</AlertDialogTitle>
          <AlertDialogDescription>{t.body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => choose(false)}>{t.no}</AlertDialogCancel>
          <AlertDialogAction onClick={() => choose(true)}>{t.yes}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
