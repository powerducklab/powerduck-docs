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
