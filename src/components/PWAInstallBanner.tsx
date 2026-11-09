import { useEffect, useState } from "react";
import { IconDownload, IconX, IconShare } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Capacitor } from "@capacitor/core";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

export default function PWAInstallBanner() {
  const [androidPrompt, setAndroidPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOS, setShowIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform() || isInStandaloneMode() || localStorage.getItem("pwa-banner-dismissed") === "true") {
      return;
    }

    if (isIOS()) {
      setShowIOS(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setAndroidPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!androidPrompt) return;
    await androidPrompt.prompt();
    const { outcome } = await androidPrompt.userChoice;
    if (outcome === "accepted") setAndroidPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("pwa-banner-dismissed", "true");
  };

  if (dismissed || window.location.pathname === "/welcome") return null;

  const bottomStyle = { bottom: 'max(5.5rem, calc(env(safe-area-inset-bottom) + 5rem))' };

  // iOS Safari install instructions
  if (showIOS) {
    return (
      <div
        className="fixed left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 bg-card border border-border rounded-xl shadow-lg p-4 flex items-start gap-3"
        style={bottomStyle}
      >
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <IconShare size={20} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Install Motokah</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Tap the <strong>Share</strong> button <span className="inline-block">⎙</span> at the bottom of Safari, then tap <strong>"Add to Home Screen"</strong>
          </p>
        </div>
        <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5">
          <IconX size={16} />
        </button>
      </div>
    );
  }

  // Android / Chrome install prompt
  if (!androidPrompt) return null;

  return (
    <div
      className="fixed left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 bg-card border border-border rounded-xl shadow-lg p-4 flex items-start gap-3"
      style={bottomStyle}
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <IconDownload size={20} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">Install Motokah</p>
        <p className="text-xs text-muted-foreground mt-0.5">Add to your home screen for quick access</p>
        <div className="flex gap-2 mt-3">
          <Button size="sm" className="text-xs h-7 px-3" onClick={handleInstall}>Install</Button>
          <Button size="sm" variant="ghost" className="text-xs h-7 px-2 text-muted-foreground" onClick={handleDismiss}>Not now</Button>
        </div>
      </div>
      <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5">
        <IconX size={16} />
      </button>
    </div>
  );
}
