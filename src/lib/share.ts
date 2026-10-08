export async function sharePage(
  title: string,
): Promise<"shared" | "copied" | "cancelled"> {
  const url = new URL(window.location.href);
  url.searchParams.delete("preview");
  if (navigator.share) {
    try {
      await navigator.share({ title, url: url.href });
      return "shared";
    } catch (error) {
      if ((error as DOMException)?.name === "AbortError") return "cancelled";
      throw error;
    }
  }
  if (!navigator.clipboard) throw new Error("Clipboard unavailable.");
  await navigator.clipboard.writeText(url.href);
  return "copied";
}
