// @ts-check
// Local Docusaurus plugin.
//
// Why this exists:
// With docs `routeBasePath: "/"`, Docusaurus registers a "/" route but the
// production static generator does not emit a root `index.html` for it. A
// `static/index.html` redirect used to fill that gap, but in `docusaurus start`
// that static copy collided with the registered "/" route and webpack failed
// with "Conflict: Multiple assets emit different content to the same filename
// index.html".
//
// This plugin writes the redirect `index.html` only during the production
// build (`postBuild` never runs in `docusaurus start`). A multilingual build
// invokes `postBuild` once per locale with `outDir` set to that locale's output
// directory, so the language and canonical are derived from the live plugin
// context (`i18n.currentLocale` and the locale-prefixed `baseUrl`).

import { promises as fs } from "node:fs";
import path from "node:path";

const ENTRY = "overview/introduction";

function redirectHtml(lang, canonicalHref) {
  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <title>Powerduck Documentation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="canonical" href="${canonicalHref}" />
    <meta http-equiv="refresh" content="0; url=${ENTRY}" />
  </head>
  <body>
    <p>
      Redirecting to the documentation entry point. If you are not redirected
      automatically, <a href="${ENTRY}">continue here</a>.
    </p>
    <script>
      (function redirect() {
        var target = "${ENTRY}";
        window.location.replace(target);
      })();
    </script>
  </body>
</html>
`;
}

async function isDirectory(target) {
  try {
    const stat = await fs.stat(target);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

function trimSlash(value) {
  return value.replace(/^\/+|\/+$/g, "");
}

/** @type {import('@docusaurus/types').PluginModule} */
export default function rootRedirect({ baseUrl, siteConfig, i18n }) {
  const siteUrl = siteConfig.url.replace(/\/+$/, "");
  const docsBase = trimSlash(baseUrl);
  const lang =
    i18n.currentLocale === i18n.defaultLocale ? "en" : i18n.currentLocale;

  return {
    name: "powerduck-root-redirect",

    async postBuild({ outDir }) {
      // This output directory holds a generated docs tree only when it contains
      // the `overview/` folder; otherwise there is nothing to redirect.
      if (!(await isDirectory(path.join(outDir, "overview")))) {
        return;
      }
      const canonicalHref = `${siteUrl}/${docsBase}/${ENTRY}`;
      await fs.writeFile(
        path.join(outDir, "index.html"),
        redirectHtml(lang, canonicalHref),
        "utf8",
      );
    },
  };
}
