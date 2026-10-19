# Powerduck Docs

Official documentation site for Powerduck libraries, built with [Docusaurus](https://docusaurus.io/).

## Libraries Documented

- [@powerduck/md-editor](https://github.com/powerducklab/md-editor) - Embeddable Markdown editor with math, mindmaps, and code highlighting
- [@powerduck/conf-patch](https://github.com/powerducklab/conf-patch) - Two-layer configuration editor with OpenAPI validation
- [@powerduck/openapi-cli](https://github.com/powerducklab/openapi-cli) - CI-ready CLI for batch-testing OpenAPI documents
- [@powerduck/openapi-codegen](https://github.com/powerducklab/openapi-codegen) - Generate runnable HTTP code from OpenAPI (21 languages)
- [@powerduck/openapi-mcp-server](https://github.com/powerducklab/openapi-mcp-server) - Turn OpenAPI specs into production MCP servers
- [@powerduck/openapi-request](https://github.com/powerducklab/openapi-request) - OpenAPI 3.2 collection debugger
- [@powerduck/x-to-openapi](https://github.com/powerducklab/x-to-openapi) - Convert cURL and Postman to OpenAPI 3.2

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Serve

```bash
npm run serve
```

This command serves the built documentation locally.

## Project Structure

```
powerduck-docs/
├── docs/
│   ├── getting-started/     # Getting started guide
│   ├── md-editor/           # MD Editor documentation
│   ├── conf-patch/          # conf-patch documentation
│   ├── openapi-cli/         # openapi-cli documentation
│   ├── openapi-codegen/     # openapi-codegen documentation
│   ├── openapi-mcp-server/  # openapi-mcp-server documentation
│   ├── openapi-request/     # openapi-request documentation
│   └── x-to-openapi/        # x-to-openapi documentation
├── src/
│   ├── css/
│   │   └── custom.css       # Custom CSS
│   └── components/          # Custom React components
├── static/
│   └── img/
│       ├── logo.svg         # Site logo
│       └── favicon.svg      # Site favicon
├── docusaurus.config.js     # Docusaurus configuration
├── sidebars.js              # Sidebar configuration
└── package.json             # Project dependencies
```

## Adding Documentation

1. Create a new `.md` file in the appropriate `docs/` subdirectory
2. Add frontmatter with `sidebar_position` and `title`
3. Add the new page to `sidebars.js` if needed

## Deployment

The documentation can be deployed to any static hosting service:

- **GitHub Pages**: `npm run deploy`
- **Vercel**: Connect the repository and set build command to `npm run build`
- **Netlify**: Set build command to `npm run build` and publish directory to `build`

## License

MIT License. See [LICENSE](LICENSE) for details.

## Community

- [Website](https://www.powerduck.com)
- [GitHub](https://github.com/powerducklab)
- [Contact](mailto:contact@neatico.com)

## Local onboarding and contract tutorials

The English, Simplified Chinese and Japanese quickstarts start with the native
local Mock example; a model and Cloud account are optional. The client section
contains coding-Agent, real backend contract-error, and code-scan tutorials.
The contract sample uses the response validator introduced in
`@powerduck/dev-mcp-server@0.7.6`; its string-versus-number failure is real.

Build every locale with `bash scripts/build-docs.sh`. This reuses Docusaurus
canonical/hreflang/sitemap generation and syncs static output into
`../website/docs`; it does not itself deploy the site. Do not build a single
locale into the shared output and then publish it as all locales. Verify the
English, `zh-CN` and `ja-JP` URLs and no-JavaScript article body before release.
Japanese content has not received native-speaker proofreading.


## Localization and page-quality checks

The target language registry in `src/data/locales.json` mirrors the desktop app's
16 languages. A configured locale does **not** mean all articles are translated.
Run `npm run audit:localization` for the actual per-file inventory, or pass
`--require-complete` to `scripts/audit-localization.mjs` for a strict release gate.
This deliberately fails until every article has a translation and metadata.

The navigation, footer, fallback notices and local-request quickstart now cover
all 16 locales. Long-form article coverage remains incomplete. Do not describe
these packages as fully translated or native-speaker certified. Maintain product
terms, commands, security advice and troubleshooting steps when reviewing prose.

The installation guides for tree, schema-editor, workspace-yaml, oas-document
and openapi-parser now have full translations in all 15 non-English locales.
`installation-localization.test.mjs` verifies all 75 translations retain the
original executable code, inline API identifiers and table rows. The overview
introduction has also been added in Italian, Russian, Hindi, Indonesian,
Vietnamese and Turkish. These additions do not make the remaining articles
complete; use the coverage inventory for the current outstanding work.

`content-quality.mjs` excludes untranslated English fallback pages from locale
sitemaps and hreflang sets. Those pages display an explicit notice, mark the
article text as English, use `noindex,follow`, and canonicalize to the English
article. Real translations retain their own canonical and reciprocal alternates.
Do not create English copies just to satisfy the coverage gate.
Changing only a title or front matter while leaving the English body unchanged
does not qualify as a translation.

After the **full multilingual build**, run `npm run audit:pages` and
`npm run test:quality`. The first checks every rendered article for unique titles,
canonical/description/H1 metadata, self-alternates and existing social images.
The build script runs both the coverage inventory and HTML audit before syncing.
A single-locale build changes URL bases and cannot validate production hreflang.
