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
    locales: ["en"],
  },

  // Custom fields for SEO and branding
  customFields: {
    description:
      "Powerduck provides high-performance OpenAPI tooling, embeddable Markdown editors, and developer libraries. Explore our open-source documentation.",
    keywords:
      "Powerduck, OpenAPI, Markdown editor, API tools, developer libraries, code generation, MCP server, API testing",
    author: "POWERDUCK LIMITED",
  },

  // Head tags for SEO and fonts
  headTags: [
    {
      tagName: "meta",
      attributes: {
        name: "description",
        content:
          "Powerduck provides high-performance OpenAPI tooling, embeddable Markdown editors, and developer libraries. Explore our open-source documentation.",
      },
    },
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
      tagName: "meta",
      attributes: {
        property: "og:title",
        content: "Powerduck Docs - High-performance OpenAPI tooling",
      },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:description",
        content:
          "Explore Powerduck open-source libraries: Markdown editor, OpenAPI CLI, code generation, MCP server, and more.",
      },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:type",
        content: "website",
      },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:url",
        content: "https://www.powerduck.com/docs/",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "twitter:card",
        content: "summary_large_image",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "twitter:title",
        content: "Powerduck Docs",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "twitter:description",
        content: "High-performance OpenAPI tooling and embeddable components.",
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
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Docs",
          },
          {
            type: "dropdown",
            label: "Open Source",
            position: "left",
            items: [
              {
                label: "MD Editor",
                href: "https://www.powerduck.com/opensource/md-editor.html",
              },
              {
                label: "OpenAPI CLI",
                href: "https://www.powerduck.com/opensource/openapi-cli.html",
              },
              {
                label: "OpenAPI Codegen",
                href: "https://www.powerduck.com/opensource/openapi-codegen.html",
              },
              {
                label: "OpenAPI Request",
                href: "https://www.powerduck.com/opensource/openapi-request.html",
              },
              {
                label: "OpenAPI MCP Server",
                href: "https://www.powerduck.com/opensource/openapi-mcp-server.html",
              },
              {
                label: "x-to-openapi",
                href: "https://www.powerduck.com/opensource/x-to-openapi.html",
              },
              {
                label: "conf-patch",
                href: "https://www.powerduck.com/opensource/conf-patch.html",
              },
            ],
          },
          {
            href: "https://www.powerduck.com",
            label: "Website",
            position: "right",
          },
          {
            href: "https://github.com/powerducklab",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
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

  // Plugins
  plugins: [],
};

export default config;
