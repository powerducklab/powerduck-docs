// @ts-check
// Powerduck Docs - Docusaurus Configuration
// Clean, compact documentation experience

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Powerduck Docs",
  tagline: "High-performance OpenAPI tooling and embeddable components",
  favicon: "img/favicon.svg",

  // Production URL
  url: "https://www.powerduck.com",
  baseUrl: "/docs/",

  // GitHub pages deployment
  organizationName: "PowerDuckie",
  projectName: "powerduck-docs",

  // Link handling
  onBrokenLinks: "warn",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  // Internationalization
  i18n: {
    defaultLocale: "en",
    locales: [
      "en",
      "zh-CN",
      "zh-TW",
      "ja-JP",
      "ko-KR",
      "fr-FR",
      "de-DE",
      "es-ES",
      "pt-BR",
      "ar-SA",
    ],
    localeConfigs: {
      en: { label: "English", direction: "ltr" },
      "zh-CN": { label: "简体中文", direction: "ltr" },
      "zh-TW": { label: "繁體中文", direction: "ltr" },
      "ja-JP": { label: "日本語", direction: "ltr" },
      "ko-KR": { label: "한국어", direction: "ltr" },
      "fr-FR": { label: "Français", direction: "ltr" },
      "de-DE": { label: "Deutsch", direction: "ltr" },
      "es-ES": { label: "Español", direction: "ltr" },
      "pt-BR": { label: "Português (Brasil)", direction: "ltr" },
      "ar-SA": { label: "العربية", direction: "rtl" },
    },
  },

  // Custom fields for SEO and branding
  customFields: {
    description:
      "Powerduck provides high-performance OpenAPI tooling, embeddable Markdown editors, and developer libraries. Explore our open-source documentation.",
    keywords:
      "Powerduck, OpenAPI, Markdown editor, API tools, developer libraries, code generation, MCP server, API testing",
    author: "POWERDUCK LIMITED",
  },

  // Head tags for SEO and fonts.
  // Docusaurus generates per-page canonical, description, Open Graph and
  // Twitter tags, so global versions of those are intentionally omitted to
  // avoid duplicate and stale metadata (such as a fixed og:url on subpages).
  headTags: [
    {
      tagName: "meta",
      attributes: {
        name: "keywords",
        content:
          "Powerduck, OpenAPI, Markdown editor, API tools, developer libraries, code generation, MCP server, API testing",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "author",
        content: "POWERDUCK LIMITED",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous",
      },
    },
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          editUrl: "https://github.com/powerducklab/powerduck-docs/tree/main/",
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Social card
      image: "img/docusaurus-social-card.jpg",

      // Color mode - default light
      colorMode: {
        defaultMode: "light",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },

      // Navbar - Solid compact header
      navbar: {
        title: "Powerduck",
        logo: {
          alt: "Powerduck Logo",
          src: "img/logo.svg",
          href: "/overview/introduction",
        },
        items: [
          {
            type: "dropdown",
            label: "Client",
            position: "left",
            items: [
              {
                label: "Spec Editor",
                href: "https://www.powerduck.com/#spec-editor",
              },
              {
                label: "API Debug",
                href: "https://www.powerduck.com/#api-debug",
              },
              {
                label: "MCP Server",
                href: "https://www.powerduck.com/#mcp-server",
              },
              {
                label: "API Docs",
                href: "https://www.powerduck.com/#api-docs",
              },
            ],
          },
          {
            type: "dropdown",
            label: "Cloud",
            position: "left",
            items: [
              {
                label: "Hub",
                href: "https://www.powerduck.com/hub",
              },
              {
                label: "Cloud Docs",
                to: "/cloud/introduction",
              },
              {
                label: "Sign in",
                href: "https://www.powerduck.com/signin",
              },
            ],
          },
          {
            label: "Pricing",
            href: "https://www.powerduck.com/#licensing",
            position: "left",
          },
          {
            type: "dropdown",
            label: "Resources",
            position: "left",
            items: [
              {
                label: "Documentation",
                to: "/overview/introduction",
              },
              {
                label: "Live Demo",
                href: "https://www.powerduck.com/demo/",
              },
              {
                label: "Open Source",
                href: "https://github.com/powerducklab",
              },
            ],
          },
          {
            type: "localeDropdown",
            position: "right",
          },
          {
            href: "https://github.com/powerducklab",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
          {
            label: "Sign in",
            href: "https://www.powerduck.com/signin",
            position: "right",
            className: "header-signin-link",
          },
          {
            label: "Download",
            href: "https://github.com/powerducklab",
            position: "right",
            className: "header-download-link",
          },
        ],
      },

      // Footer - Clean and minimal
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Overview",
                to: "/overview/introduction",
              },
              {
                label: "MD Editor",
                to: "/md-editor/introduction",
              },
              {
                label: "OpenAPI CLI",
                to: "/openapi-cli/introduction",
              },
            ],
          },
          {
            title: "Libraries",
            items: [
              {
                label: "conf-patch",
                to: "/conf-patch/introduction",
              },
              {
                label: "openapi-codegen",
                to: "/openapi-codegen/introduction",
              },
              {
                label: "openapi-mcp-server",
                to: "/openapi-mcp-server/introduction",
              },
              {
                label: "openapi-request",
                to: "/openapi-request/introduction",
              },
              {
                label: "x-to-openapi",
                to: "/x-to-openapi/introduction",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/powerducklab",
              },
              {
                label: "Website",
                href: "https://www.powerduck.com",
              },
              {
                label: "Contact",
                href: "mailto:contact@neatico.com",
              },
            ],
          },
          {
            title: "Legal",
            items: [
              {
                label: "Privacy Policy",
                href: "https://www.powerduck.com/privacy.html",
              },
              {
                label: "Terms of Service",
                href: "https://www.powerduck.com/terms.html",
              },
              {
                label: "Refund Policy",
                href: "https://www.powerduck.com/refunds.html",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} POWERDUCK LIMITED. Built with Docusaurus.`,
      },

      // Code highlighting - Solid dark theme
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: [
          "bash",
          "json",
          "yaml",
          "typescript",
          "javascript",
          "python",
          "go",
          "rust",
          "java",
          "php",
          "ruby",
          "csharp",
          "kotlin",
          "swift",
          "dart",
          "sql",
        ],
      },

      // Table of contents
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
    }),

  // Client scripts
  scripts: [{ src: "/docs/session.js", async: true }],

  // Plugins
  // Local plugin that emits the root redirect only during production builds,
  // avoiding the dev-time static/index.html asset conflict.
  plugins: ["./src/plugins/root-redirect.mjs"],
};

export default config;
