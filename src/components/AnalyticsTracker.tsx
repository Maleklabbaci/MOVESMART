import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { tracker } from "../lib/analytics";
import { useAnalyticsConsent } from "./AnalyticsConsent";

/**
 * Records one pageview per navigation, and only when the visitor opted in.
 * Renders nothing and never appears in the markup.
 */
export default function AnalyticsTracker() {
  const { pathname, search } = useLocation();
  const { decision, available } = useAnalyticsConsent();
  useEffect(() => {
    if (!available || decision !== "granted") return;
    if (new URLSearchParams(search).get("preview") === "draft") return;
    void tracker.record(pathname);
  }, [available, decision, pathname, search]);
  return null;
}
