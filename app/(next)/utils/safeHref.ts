const SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const SAFE_SCHEME = /^(https?|mailto|tel):/i;

/** CMS-supplied URL, or "#" when it carries a scheme other than http(s), mailto or tel. Relative URLs pass. */
export function safeHref(url: string | null | undefined): string {
  const href = (url ?? "").trim();
  // browsers drop tabs, newlines and spaces inside a scheme ("java\tscript:")
  const probe = href.replace(/[\u0000- ]/g, "");
  return SCHEME.test(probe) && !SAFE_SCHEME.test(probe) ? "#" : href;
}

/** Same-origin path for a CMS page slug, never protocol-relative (`//host`). */
export function internalHref(slug: string | null | undefined): string {
  return `/${(slug ?? "").replace(/^[/\\]+/, "")}`;
}
