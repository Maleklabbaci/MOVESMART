import {
  useEffect,
  useState,
  createContext,
  useContext,
  useRef,
  lazy,
  Suspense,
  type ReactNode,
} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useTranslation, I18nextProvider } from "react-i18next";
import { createPortal } from "react-dom";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import i18n from "./lib/i18n";
import Home from "./pages/Home";
import WhatsAppButton from "./components/WhatsAppButton";
import AnalyticsConsent from "./components/AnalyticsConsent";
import AnalyticsTracker from "./components/AnalyticsTracker";
import Footer from "./components/Footer";
import RouteMetadata from "./components/RouteMetadata";
import { SiteLink as Link } from "./components/SiteLink";
import {
  SiteContentProvider,
  useSiteContent,
} from "./content/SiteContentProvider";
import { localize, normalizeLanguage } from "./content/utils";

const Listings = lazy(() => import("./pages/Listings"));
const ListingDetails = lazy(() => import("./pages/ListingDetails"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Admin = lazy(() => import("./pages/Admin"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(
  null,
);
export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("Missing theme provider");
  return value;
}
const LANGS = [
  { code: "fr", label: "FR", name: "Français" },
  { code: "en", label: "EN", name: "English" },
  { code: "ar", label: "ع", name: "العربية" },
];
function LangSelector() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const language = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        aria-label={t("language_select")}
        aria-expanded={open}
        aria-controls="language-options"
        onClick={() => setOpen((value) => !value)}
        className="px-2 py-3 text-[11px] font-semibold tracking-widest"
      >
        {LANGS.find((item) => item.code === language)?.label}{" "}
        <span aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div
          id="language-options"
          className="absolute end-0 top-full mt-2 card-border min-w-36 shadow-xl py-2"
          style={{ color: "var(--text)" }}
        >
          {LANGS.map((item) => (
            <button
              key={item.code}
              lang={item.code}
              onClick={() => {
                void i18n.changeLanguage(item.code);
                setOpen(false);
              }}
              className="block w-full text-start px-5 py-3 text-xs hover:text-accent"
              aria-current={item.code === language ? "true" : undefined}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={t(theme === "dark" ? "theme_light" : "theme_dark")}
      className="w-10 h-10 flex items-center justify-center hover:text-accent"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
function MobileNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const drawer = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const items = drawer.current?.querySelectorAll<HTMLElement>("a, button");
      if (!items?.length) return;
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
      trigger.current?.focus();
    };
  }, [open]);
  return (
    <>
      <button
        ref={trigger}
        onClick={() => setOpen(true)}
        aria-label={t("menu_open")}
        aria-expanded={open}
        className="md:hidden p-2"
      >
        <Menu className="w-6 h-6" />
      </button>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] bg-black/80"
            onClick={() => setOpen(false)}
          >
            <div
              ref={drawer}
              role="dialog"
              aria-modal="true"
              aria-label={t("menu_open")}
              className="absolute inset-y-0 end-0 w-[85%] max-w-sm bg-[#0a0b0d] text-white p-8 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t("menu_close")}
                  className="p-3"
                >
                  <X />
                </button>
              </div>
              <nav className="flex flex-col gap-8 pt-12">
                {[
                  ["/", "home"],
                  ["/listings", "listings"],
                  ["/about", "about"],
                  ["/blog", "blog"],
                  ["/contact", "contact"],
                ].map(([path, key]) => (
                  <Link
                    to={path}
                    key={path}
                    className={`font-serif text-3xl ${location.pathname === path ? "text-amber-400" : ""}`}
                  >
                    {t(key)}
                  </Link>
                ))}
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
function Header() {
  const location = useLocation();
  const { t } = useTranslation();
  const { content, language } = useSiteContent();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 40);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, [location.pathname]);
  const hasPreviewBanner =
    new URLSearchParams(location.search).get("preview") === "draft";
  const onHero =
    location.pathname === "/" &&
    !scrolled &&
    content.visibleSections.hero &&
    content.homeOrder[0] === "hero";
  return (
    <header
      className="fixed inset-x-0 z-50 h-20 transition-colors duration-300"
      style={{
        top: hasPreviewBanner ? 44 : 0,
        color: onHero ? "#fff" : "var(--text)",
        background: onHero ? "transparent" : "var(--header-bg)",
        backdropFilter: onHero ? "none" : "blur(12px)",
        borderBottom: onHero ? "none" : "1px solid var(--border)",
      }}
    >
      <div className="h-full max-w-[1400px] mx-auto px-4 md:px-10 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img
            src={content.images.logo.url}
            alt={localize(content.images.logo.alt, language)}
            className="h-6 md:h-7 max-w-[100px] object-contain"
            style={{
              filter:
                !onHero && content.settings.logoMonochrome
                  ? "var(--img-filter)"
                  : "none",
            }}
          />
          <span
            title={content.settings.brand}
            className="font-serif text-2xl hidden lg:block truncate min-w-0 max-w-[180px]"
          >
            {content.settings.brand}
          </span>
        </Link>
        <nav className="hidden md:flex gap-6 lg:gap-9">
          {[
            ["/", "home"],
            ["/listings", "listings"],
            ["/about", "about"],
            ["/blog", "blog"],
            ["/contact", "contact"],
          ].map(([path, key]) => (
            <Link
              key={path}
              to={path}
              className="text-[10px] font-semibold tracking-[.18em] uppercase py-3 hover:text-accent"
              style={{
                color: location.pathname === path ? "var(--accent)" : undefined,
              }}
              aria-current={location.pathname === path ? "page" : undefined}
            >
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className="flex gap-1 sm:gap-4 items-center">
          <ThemeToggle />
          <LangSelector />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
function PreviewBanner() {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const { preview } = useSiteContent();
  if (new URLSearchParams(search).get("preview") !== "draft") return null;
  return (
    <div
      className="fixed top-0 inset-x-0 z-[150] h-11 flex items-center justify-center gap-3 px-4 py-2 bg-amber-300 text-black text-xs"
      role="status"
    >
      <span className="min-w-0 truncate">
        {preview
          ? "Aperçu du brouillon — non publié"
          : "Aperçu en attente / indisponible — contenu public affiché"}
      </span>
      <button
        className="font-bold underline shrink-0 whitespace-nowrap"
        onClick={() => {
          const params = new URLSearchParams(search);
          params.delete("preview");
          navigate({ pathname, search: params.toString() }, { replace: true });
        }}
      >
        Quitter l’aperçu
      </button>
      <Link
        to="/admin"
        className="font-bold hidden sm:inline-flex items-center gap-1"
      >
        Admin <ArrowUpRight size={13} />
      </Link>
    </div>
  );
}
function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <PreviewBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <AnalyticsTracker />
      <AnalyticsConsent />
    </>
  );
}
function App() {
  const location = useLocation();
  const { t } = useTranslation();
  const { language } = useSiteContent();
  const isAdmin = /^\/admin\/?$/.test(location.pathname);
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  const routes = (
    <Suspense
      fallback={
        <div
          role="status"
          className="min-h-[80vh] flex items-center justify-center pt-24"
        >
          {t("loading")}
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <RouteMetadata />
      {isAdmin ? routes : <SiteFrame>{routes}</SiteFrame>}
    </div>
  );
}
export default function AppWrapper() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem("theme") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });
  useEffect(() => {
    const html = document.documentElement;
    html.toggleAttribute("data-theme-dark", theme === "dark");
    if (theme === "dark") html.setAttribute("data-theme-dark", "true");
    else html.setAttribute("data-theme", "light");
    if (theme === "dark") html.removeAttribute("data-theme");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* Storage can be disabled in private browsing. */
    }
  }, [theme]);
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeContext.Provider
        value={{
          theme,
          toggle: () =>
            setTheme((value) => (value === "dark" ? "light" : "dark")),
        }}
      >
        <BrowserRouter>
          <SiteContentProvider>
            <App />
          </SiteContentProvider>
        </BrowserRouter>
      </ThemeContext.Provider>
    </I18nextProvider>
  );
}
