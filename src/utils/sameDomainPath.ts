/**
 * Convert an absolute same-registrable-domain URL into a root-relative path.
 *
 * Cross-app links (site root, legal pages, signin, hub, demo) must render as
 * normal internal links: same tab, no target/rel and no `/docs` baseUrl
 * rewrite. Docusaurus externalizes absolute URLs and rewrites root-relative
 * hrefs with the configured baseUrl, so the swizzled link components use this
 * helper to emit a plain root-relative anchor instead.
 */
export default function sameDomainPath(
  href: string | undefined,
): string | null {
  if (!href) {
    return null;
  }
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (host !== "powerduck.com" && !host.endsWith(".powerduck.com")) {
    return null;
  }
  const path = `${url.pathname}${url.search}${url.hash}`;
  return path.length > 0 ? path : "/";
}
