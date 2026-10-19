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

/** Keep cross-product navigation in the reader's selected language. */
export function localizedSitePath(path: string, locale: string): string {
  const language = ({en: 'en', 'en-US': 'en', 'ja-JP': 'ja', 'de-DE': 'de', 'fr-FR': 'fr', 'es-ES': 'es'} as Record<string, string>)[locale] ?? locale;
  const supported = ['en','zh-CN','zh-TW','ja','de','fr','es','pt-BR','ko-KR','it-IT','ru-RU','id-ID','vi-VN','tr-TR','ar-SA','hi-IN'];
  if (!supported.includes(language)) return path;
  const url = new URL(path, 'https://www.powerduck.com');
  const prefix = language === 'en' ? '' : '/' + language;
  const base = url.pathname.replace(new RegExp('^/(' + supported.join('|') + ')(?=/)'), '');
  if (base === '/' || base === '/index.html') url.pathname = prefix + '/';
  else if (/^\/(hub|cloud|pricing)\/?$/.test(base)) url.pathname = prefix + base.replace(/\/$/, '');
  else if (/^\/(download|use-cases)(\.html|\/)$/.test(base)) {
    const page = base.replace(/(\.html|\/)$/, '');
    url.pathname = prefix ? prefix + page + '/' : page + '.html';
  }
  return url.pathname + url.search + url.hash;
}
