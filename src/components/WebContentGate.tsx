import { useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { IconLoader2 } from "@/components/icons";

// Wraps content that changes often (new cars, the brand catalog, a future
// blog) so adding a model, a brand or a longer description never needs an
// App Store or Play Store review. On the website this renders the real page
// normally. In the native app it instead loads the same path on
// www.motokah.com inside an iframe, filling the content area under the
// app's own header/bottom nav, no separate browser chrome, no URL bar, so
// it reads as a native screen even though every future change here is just
// a website deploy. This wrapper itself is the one native change that ships
// once; nothing behind it needs another app update.
export default function WebContentGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isNative] = useState(Capacitor.isNativePlatform());
  const [loaded, setLoaded] = useState(false);

  if (isNative) {
    const url = `https://www.motokah.com${location.pathname}${location.search}`;
    return (
      <div className="min-h-screen relative">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <IconLoader2 size={28} className="animate-spin text-primary" />
          </div>
        )}
        <iframe
          key={url}
          src={url}
          title="Motokah"
          onLoad={() => setLoaded(true)}
          className="w-full min-h-screen border-0"
          style={{ height: "100vh" }}
        />
      </div>
    );
  }

  return <>{children}</>;
}
