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

const ENTRY = "overview/introduction/";

const redirectCopy = {
  "en": [
    "Documentation",
    "Opening the documentation.",
    "Continue"
  ],
  "zh-CN": [
    "文档",
    "正在打开文档。",
    "继续"
  ],
  "zh-TW": [
    "文件",
    "正在開啟文件。",
    "繼續"
  ],
  "ja-JP": [
    "ドキュメント",
    "ドキュメントを開いています。",
    "続行"
  ],
  "ko-KR": [
    "문서",
    "문서를 여는 중입니다.",
    "계속"
  ],
  "fr-FR": [
    "Documentation",
    "Ouverture de la documentation.",
    "Continuer"
  ],
  "de-DE": [
    "Dokumentation",
    "Die Dokumentation wird geöffnet.",
    "Weiter"
  ],
  "es-ES": [
    "Documentación",
    "Abriendo la documentación.",
    "Continuar"
  ],
  "pt-BR": [
    "Documentação",
    "Abrindo a documentação.",
    "Continuar"
  ],
  "it-IT": [
    "Documentazione",
    "Apertura della documentazione.",
    "Continua"
  ],
  "ru-RU": [
    "Документация",
    "Открытие документации.",
    "Продолжить"
  ],
  "ar-SA": [
    "الوثائق",
    "جارٍ فتح الوثائق.",
    "متابعة"
  ],
  "hi-IN": [
    "दस्तावेज़",
    "दस्तावेज़ खोले जा रहे हैं।",
    "जारी रखें"
  ],
  "id-ID": [
    "Dokumentasi",
    "Membuka dokumentasi.",
    "Lanjutkan"
  ],
  "vi-VN": [
    "Tài liệu",
    "Đang mở tài liệu.",
    "Tiếp tục"
  ],
  "tr-TR": [
    "Belgeler",
    "Belgeler açılıyor.",
    "Devam et"
  ]
};

export function redirectHtml(lang, canonicalHref) {
  const [title, message, continueLabel] = redirectCopy[lang] || redirectCopy.en;
  return `<!doctype html>
<html lang="${lang}" dir="${lang === "ar-SA" ? "rtl" : "ltr"}">
  <head>
    <meta charset="utf-8" />
    <title>Powerduck · ${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="canonical" href="${canonicalHref}" />
    <meta http-equiv="refresh" content="0; url=${ENTRY}" />
  </head>
  <body>
    <p>
      ${message} <a href="${ENTRY}">${continueLabel}</a>
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
