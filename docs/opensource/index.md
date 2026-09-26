---
sidebar_position: 1
title: Open Source Libraries
description: "The @powerduck/* npm packages are the engines behind the desktop client and Cloud: parsing and upgrading, multi-protocol CLI, codegen, MCP, request running, conversion, and embeddable editors and viewers."
---

# Open Source Libraries

Powerduck is built from a set of small, composable npm packages. The desktop client and the cloud service are both assembled from these libraries, so the same engines run locally, over the network, or inside your own tooling.

Each package is published independently, with its own installation, API reference, and examples. This page maps what each one does and how they fit together.

## How they layer

```text
                         your application
                                  |
   embeddable UI (editors, tree, document viewer)
                                  |
   workflows (CLI, codegen, MCP server, request runner)
                                  |
              parsing, patching, conversion (base layer)
```

The parser and the converters form the foundation; higher-level workflows build on them; embeddable UI sits on top. Depending on a shared base rather than re-implementing parsing in every package is what keeps behavior consistent.

## The packages

### Foundation

| Package | Latest | Purpose |
|---|---|---|
| [`@powerduck/openapi-parser`](../openapi-parser/introduction.md) | 0.3.7 | Parse, validate, and upgrade OpenAPI/Swagger documents |
| [`@powerduck/conf-patch`](../conf-patch/introduction.md) | 0.3.6 | Apply structured, validated configuration patches |
| [`@powerduck/x-to-openapi`](../x-to-openapi/introduction.md) | 0.2.5 | Convert other formats (such as cURL and Postman) to OpenAPI |

### Workflows

| Package | Latest | Purpose |
|---|---|---|
| [`@powerduck/openapi-cli`](../openapi-cli/introduction.md) | 0.2.12 | Multi-protocol command-line workflows, including scenario runs |
| [`@powerduck/openapi-codegen`](../openapi-codegen/introduction.md) | 0.6.3 | Generate client code and other artifacts from a specification |
| [`@powerduck/openapi-mcp-server`](../openapi-mcp-server/introduction.md) | 1.3.5 | Serve an OpenAPI specification as an MCP server |
| [`@powerduck/openapi-request`](../openapi-request/introduction.md) | 0.2.12 | Execute requests described by a specification |

### Embeddable UI

| Package | Latest | Purpose |
|---|---|---|
| [`@powerduck/oas-document`](../oas-document/introduction.md) | 0.1.9 | Render OpenAPI as readable documentation, including a React entry |
| [`@powerduck/md-editor`](../md-editor/introduction.md) | 0.11.7 | An embeddable Markdown editor |
| [`@powerduck/schema-editor`](../schema-editor/introduction.md) | 0.2.10 | An embeddable JSON Schema editor |
| [`@powerduck/tree`](../tree/introduction.md) | 0.7.16 | A tree component for structured data |
| [`@powerduck/workspace-yaml`](../workspace-yaml/introduction.md) | 0.2.5 | Workspace YAML integration |

## Which package do I need?

- **Read, validate, or upgrade an OpenAPI file?** Start with `openapi-parser`.
- **Turn cURL or a Postman collection into OpenAPI?** Use `x-to-openapi`.
- **Run scenarios or multi-protocol workflows from the command line or CI?** Use `openapi-cli`.
- **Generate client code?** Use `openapi-codegen`.
- **Expose an API as tools to an AI agent?** Use `openapi-mcp-server`.
- **Embed rendered documentation in a React app?** Use `oas-document` (the React entry and its CSS).
- **Embed an editor?** Use `md-editor` or `schema-editor`.

## Sharing capabilities with agents

The MCP server package is also how Powerduck's capabilities reach external AI agents. A specification served through `openapi-mcp-server` exposes its operations as MCP tools, so the same contract that drives documentation and codegen can be called from an agent directly. This keeps the source of truth consistent across the desktop client, Cloud, and other MCP-compatible tools.

## A note on the examples

Every code sample in these pages is written against the package's real API and is intended to run as shown. When a package is upgraded, consult that package's release notes for the current parameters rather than copying snippets from older versions.

Browse each package from the sidebar for installation, configuration, and the full API reference.
