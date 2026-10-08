import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { SiteLink } from "./SiteLink";
import {
  analyticsEnabled,
  browserStorage,
  clearConsent,
  decideConsent,
  privacySignal,
  readConsent,
  subscribeConsent,
  type ConsentDecision,
} from "../lib/analytics";

export function useAnalyticsConsent() {
  const [decision, setDecision] = useState<ConsentDecision | null>(() =>
    readConsent(browserStorage()),
  );
  useEffect(
    () => subscribeConsent(() => setDecision(readConsent(browserStorage()))),
    [],
  );
  return {
    decision,
    /** False when measurement is switched off or when a privacy signal forbids it. */
    available: analyticsEnabled() && !privacySignal(),
    decide: (next: ConsentDecision) => decideConsent(browserStorage(), next),
    clear: () => clearConsent(browserStorage()),
  };
}

/**
 * Explicit opt-in banner. Rendered only on the public site, only when measurement is
 * available, and never on a draft preview. Nothing is recorded until "accept".
 */
export default function AnalyticsConsent() {
  const { t } = useTranslation();
  const { decision, available, decide } = useAnalyticsConsent();
  const { search } = useLocation();
  if (!available || decision !== null) return null;
  if (new URLSearchParams(search).get("preview") === "draft") return null;
  return (
    <div
      role="region"
      aria-label={t("analytics_consent_title")}
      className="fixed start-4 end-4 bottom-24 sm:end-auto sm:bottom-5 sm:max-w-[440px] z-[110]"
    >
      <div
        className="p-5 rounded-2xl shadow-2xl space-y-4"
        style={{
          background: "var(--header-bg)",
          border: "1px solid var(--border)",
          color: "var(--text)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck size={16} className="text-accent shrink-0" />
          {t("analytics_consent_title")}
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--text3)" }}
        >
          {t("analytics_consent_text")}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn-gold text-xs"
            onClick={() => decide("granted")}
          >
            {t("analytics_consent_accept")}
          </button>
          <button
            type="button"
            className="btn-outline text-xs"
            onClick={() => decide("denied")}
          >
            {t("analytics_consent_decline")}
          </button>
          <SiteLink
            to="/privacy"
            className="text-[11px] underline"
            style={{ color: "var(--text3)" }}
          >
            {t("analytics_consent_details")}
          </SiteLink>
        </div>
      </div>
    </div>
  );
}

/** Consent status and controls, shown on the privacy page. */
export function AnalyticsChoice() {
  const { t } = useTranslation();
  const { decision, available, decide, clear } = useAnalyticsConsent();
  return (
    <div
      className="my-10 p-6 rounded-2xl space-y-4"
      style={{
        border: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      <p className="text-sm font-semibold flex items-center gap-2">
        <ShieldCheck size={16} className="text-accent shrink-0" />
        {t("analytics_settings_title")}
      </p>
      <p className="text-xs leading-relaxed" style={{ color: "var(--text3)" }}>
        {!available
          ? t("analytics_settings_denied")
          : decision === "granted"
            ? t("analytics_settings_granted")
            : decision === "denied"
              ? t("analytics_settings_denied")
              : t("analytics_settings_none")}
      </p>
      {available && (
        <div className="flex flex-wrap gap-3">
          {decision !== "granted" && (
            <button
              type="button"
              className="btn-gold text-xs"
              onClick={() => decide("granted")}
            >
              {t("analytics_settings_allow")}
            </button>
          )}
          {decision === "granted" && (
            <button
              type="button"
              className="btn-gold text-xs"
              onClick={() => decide("denied")}
            >
              {t("analytics_settings_deny")}
            </button>
          )}
          {decision !== null && (
            <button
              type="button"
              className="btn-outline text-xs"
              onClick={clear}
            >
              {t("analytics_settings_reset")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
