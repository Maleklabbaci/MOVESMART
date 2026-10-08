import { Link, type LinkProps } from "react-router-dom";
import { useSiteContent } from "../content/SiteContentProvider";
export function SiteLink({ to, ...props }: LinkProps) {
  const { previewRequested: preview } = useSiteContent();
  let destination = to;
  if (preview && typeof to === "string" && !to.startsWith("/admin")) {
    const url = new URL(to, window.location.origin);
    url.searchParams.set("preview", "draft");
    destination = url.pathname + url.search + url.hash;
  } else if (
    preview &&
    typeof to === "object" &&
    !to.pathname?.startsWith("/admin")
  ) {
    const search = new URLSearchParams(to.search);
    search.set("preview", "draft");
    destination = { ...to, search: "?" + search.toString() };
  }
  return <Link {...props} to={destination} />;
}
