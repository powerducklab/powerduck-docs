// @ts-check
// Powerduck Docs - Docusaurus Configuration
// Clean, compact documentation experience

import { themes as prismThemes } from "prism-react-renderer";
import {readFileSync} from "node:fs";
import relativeDocLinks from "./src/plugins/relative-doc-links.mjs";
const languages = JSON.parse(readFileSync(new URL("./src/data/locales.json", import.meta.url), "utf8"));

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Powerduck Docs",
  tagline: "High-performance OpenAPI tooling and embeddable components",
  favicon: "img/favicon.svg",

  // Production URL
  url: "https://www.powerduck.com",
  baseUrl: "/docs/",

  // S3/Amplify serves each page as a directory (path/index.html). Emit links
  // with a trailing slash so they resolve directly (no 301 hop) and the client
  // router never resolves a sibling link against the wrong base directory.
  trailingSlash: true,

  // GitHub pages deployment
  organizationName: "PowerDuckie",
  projectName: "powerduck-docs",

  // Link handling
  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },

  // Internationalization
  i18n: {
    defaultLocale: "en",
    locales: languages.map(language => language.docs),
    localeConfigs: Object.fromEntries(languages.map(language => [language.docs, {
      label: language.label, direction: language.rtl ? 'rtl' : 'ltr', htmlLang: language.code,
    }])),
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

  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          beforeDefaultRemarkPlugins: [relativeDocLinks],
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
        gtag: {
          trackingID: "G-8HXDV7CDEB",
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Social card
      image: "img/social-card.png",

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
            href: "https://www.powerduck.com/pricing",
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
                label: "Blog",
                href: "https://www.powerduck.com/blog/",
              },
              {
                label: "Live Demo",
                href: "https://www.powerduck.com/app/",
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
            href: "https://www.powerduck.com/download.html",
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
  plugins: ["./src/plugins/root-redirect.mjs", "./src/plugins/content-quality.mjs"],
};

export default config;
