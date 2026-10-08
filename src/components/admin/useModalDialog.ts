import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

/** Focus/scroll management shared by the admin dialogs; closing may be refused. */
export function useModalDialog(
  open: boolean,
  dialog: RefObject<HTMLElement | null>,
  onClose: () => void,
  returnFocus?: RefObject<HTMLElement | null>,
) {
  const close = useRef(onClose);
  useLayoutEffect(() => {
    close.current = onClose;
  }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const previous =
      returnFocus?.current ?? (document.activeElement as HTMLElement | null);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      Array.from(
        dialog.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled):not([type="file"]):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);
    (
      dialog.current?.querySelector<HTMLElement>(
        'input:not(:disabled):not([type="file"]):not([type="hidden"])',
      ) ??
      focusable()[0] ??
      dialog.current
    )?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) {
        event.preventDefault();
        dialog.current?.focus();
        return;
      }
      const first = items[0],
        last = items[items.length - 1];
      if (!dialog.current?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
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
      if (previous?.isConnected && previous.getClientRects().length)
        previous.focus();
    };
  }, [open, dialog, returnFocus]);
}
