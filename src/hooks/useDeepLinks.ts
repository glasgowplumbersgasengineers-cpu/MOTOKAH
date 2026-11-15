import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { useNavigate } from "react-router-dom";

// motokah.com links (emails, WhatsApp shares, etc.) open the app via Universal Links;
// route them to the same page inside the app.
export function useDeepLinks() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const sub = App.addListener("appUrlOpen", ({ url }) => {
      try {
        const u = new URL(url);
        if (!/(^|\.)motokah\.com$/.test(u.hostname)) return;
        navigateRef.current(`${u.pathname}${u.search}${u.hash}` || "/");
      } catch {
        // not a URL we handle
      }
    });
    return () => { sub.then((s) => s.remove()); };
  }, []);
}
