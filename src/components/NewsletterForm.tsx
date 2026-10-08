import { useRef, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSiteContent } from "../content/SiteContentProvider";
import { subscribeNewsletter } from "../lib/submissions";
import { SiteLink } from "./SiteLink";
export default function NewsletterForm() {
  const { t } = useTranslation();
  const { previewRequested: preview } = useSiteContent();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const lock = useRef(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current || preview) return;
    lock.current = true;
    setBusy(true);
    setError(false);
    setSuccess(false);
    try {
      await subscribeNewsletter({ email: email.trim(), consent, website });
      setSuccess(true);
      setEmail("");
      setConsent(false);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
      lock.current = false;
    }
  }
  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="max-w-2xl mx-auto space-y-5"
    >
      <fieldset disabled={busy || preview} className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="sr-only" htmlFor="newsletter-email">
            {t("contact_email")}
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("blog_votre_adresse_email")}
            className="flex-1 min-w-0 border-b px-4 py-4 bg-transparent"
            style={{ borderColor: "var(--border)" }}
          />
          <button
            type="submit"
            className="btn-gold flex items-center justify-center gap-3"
          >
            {busy ? t("newsletter_sending") : t("blog_s_abonner")}
            {busy ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <ArrowRight size={16} />
            )}
          </button>
        </div>
        <label
          className="flex items-start gap-3 text-xs text-start leading-relaxed"
          style={{ color: "var(--text3)" }}
        >
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 accent-[var(--accent)]"
          />
          <span>
            {t("newsletter_consent")}{" "}
            <SiteLink to="/privacy" className="underline">
              {t("privacy_link")}
            </SiteLink>
          </span>
        </label>
        <label className="honeypot" aria-hidden="true">
          Website
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>
      </fieldset>
      {success && (
        <p role="status" className="text-sm text-accent">
          {t("newsletter_success")}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {t("newsletter_error")}
        </p>
      )}
      {preview && (
        <p className="text-xs text-accent">{t("preview_forms_disabled")}</p>
      )}
    </form>
  );
}
