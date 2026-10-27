import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLocation as useLocationCtx } from "@/contexts/LocationContext";
import { trackEvent } from "@/lib/analytics";

export function usePageTracking() {
  const location = useLocation();
  const { country } = useLocationCtx();
  const countryRef = useRef(country);
  countryRef.current = country;

  useEffect(() => {
    if (location.pathname.startsWith("/admin") || location.pathname === "/reset-password") return;
    const routeKey = location.pathname;
    const previous = sessionStorage.getItem("motokah_last_page_view");
    const now = Date.now();
    if (previous) {
      const [previousRoute, previousTime] = previous.split("|");
      if (previousRoute === routeKey && now - Number(previousTime) < 2000) return;
    }
    sessionStorage.setItem("motokah_last_page_view", `${routeKey}|${now}`);
    trackEvent("page_view", {
      country: countryRef.current && countryRef.current !== "All" ? countryRef.current : null,
      referrer: document.referrer ? new URL(document.referrer).hostname : null,
    });
  }, [location.pathname]);
}
