import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { IconLoader2 } from "@/components/icons";

// Wraps content that changes often (new cars, the brand catalog, a future
// blog) so adding a model, a brand or a longer description never needs an
// App Store or Play Store review. On the website this renders the real page
// normally. In the native app it instead opens the same path on
// www.motokah.com in an in-app browser, a separate browser context that
// always loads whatever is live, so every future change here is just a
// website deploy. This wrapper itself is the one native change that ships
// once; nothing behind it needs another app update.
export default function WebContentGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNative] = useState(Capacitor.isNativePlatform());

  useEffect(() => {
    if (!isNative) return;
    let cancelled = false;
    let handle: { remove: () => void } | null = null;

    (async () => {
      handle = await Browser.addListener("browserFinished", () => {
        if (!cancelled) navigate(-1);
      });
      await Browser.open({ url: `https://www.motokah.com${location.pathname}${location.search}` });
    })();

    return () => {
      cancelled = true;
      handle?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNative, location.pathname, location.search]);

  if (isNative) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <IconLoader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
