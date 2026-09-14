---
sidebar_position: 3
title: "Quick Start"
description: "Get started with Powerduck libraries in minutes. Runnable examples for OpenAPI code generation, curl conversion, config patching, Markdown editing, and MCP server creation."
keywords: ["quick start", "tutorial", "examples", "OpenAPI", "code generation", "curl", "MCP"]
---

# Quick Start

This guide provides runnable examples for the most common Powerduck use cases. Every example uses the actual public API from the library source code.

## Prerequisites

- Node.js 18 or higher (20.11+ for `@powerduck/openapi-mcp-server`)
- npm, yarn, or pnpm

## 1. Generate HTTP Code from an OpenAPI Document

`@powerduck/openapi-codegen` generates runnable request examples in 21 languages and 41 client combinations.

```bash
npm install @powerduck/openapi-codegen
```

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

// List all available language/client combinations
const generators = list();
console.log(`Available generators: ${generators.length}`);
generators.forEach((g) => console.log(`  ${g.language} / ${g.client}`));

// Generate a JavaScript fetch example for a specific operation
const code = generate({
  document: {
    openapi: "3.1.0",
    info: { title: "Example API", version: "1.0.0" },
    paths: {
      "/users/{id}": {
        get: {
          operationId: "getUserById",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "OK" } },
        },
      },
    },
  },
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

## 2. Convert cURL Commands to OpenAPI 3.2

`@powerduck/x-to-openapi` transforms curl commands and Postman collections into valid OpenAPI 3.2 documents.

```bash
npm install @powerduck/x-to-openapi
```

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/v1/users \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer my-token" \
    -d '{"name": "Alice", "email": "alice@example.com"}'`,
  {
    title: "User API",
    version: "1.0.0",
    description: "API for managing users",
    inferSecurity: true,
    includeExamples: true,
    validate: true,
  }
);

console.log("Conversion OK:", result.ok);
console.log("Document valid:", result.documentValid);
console.log("Requests parsed:", result.requests.length);
console.log("Diagnostics:", result.diagnostics);

// The generated OpenAPI 3.2 document
console.log(JSON.stringify(result.document, null, 2));
```

### Convert Multiple cURL Commands

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const commands = [
  "curl https://api.example.com/v1/users",
  "curl -X POST https://api.example.com/v1/users -H 'Content-Type: application/json' -d '{\"name\":\"Bob\"}'",
  "curl https://api.example.com/v1/users/123",
];

const result = await curlToOpenApi(commands, {
  title: "User API",
  version: "1.0.0",
  inferPathParameters: true,
  useServerBasePath: true,
});
```

## 3. Patch Configuration Files

`@powerduck/conf-patch` provides a two-layer architecture: a browser-safe core for string patching, and a Node.js/Electron file layer with atomic writes.

```bash
npm install @powerduck/conf-patch
```

### Browser-Safe Core (String Patching)

```typescript
import { patchContent, setContentValue, deleteContentValue } from "@powerduck/conf-patch/core";

// Patch a JSON string using RFC 6902 operations
const json = '{"name": "app", "version": "1.0.0"}';
const patched = patchContent(
  json,
  [
    { op: "add", path: ["description"], value: "My application" },
    { op: "replace", path: ["version"], value: "1.1.0" },
  ],
  "json"
);
console.log(patched);

// Set a single value in a YAML string
const yaml = "database:\n  host: localhost\n  port: 5432\n";
const updated = setContentValue(yaml, ["database", "port"], 6432, "yaml");
console.log(updated);

// Delete a value from a JSONC string (comments preserved)
const jsonc = '{\n  // app name\n  "name": "app",\n  "debug": true\n}';
const removed = deleteContentValue(jsonc, ["debug"], "jsonc");
console.log(removed);
```

### Node.js File Layer (Atomic Writes)

```typescript
import { setConfigValue, patchConfigFile, readConfigFile } from "@powerduck/conf-patch";

// Read a config file (format auto-detected from extension)
const config = await readConfigFile("config.yaml");
console.log(config);

// Set a single value (atomic write, format auto-detected)
await setConfigValue("config.yaml", ["server", "port"], 8080);

// Apply multiple patch operations with file locking
await patchConfigFile(
  "config.json",
  [
    { op: "add", path: ["features", "darkMode"], value: true },
    { op: "replace", path: ["version"], value: "2.0.0" },
  ],
  { format: "json", lock: true }
);
```

## 4. Embed a Markdown Editor

`@powerduck/md-editor` is a high-performance embeddable Markdown editor with KaTeX math, Markmap mindmaps, and incremental rendering.

```bash
npm install @powerduck/md-editor
```

### Vanilla JavaScript

```html
<div id="editor" style="height: 500px;"></div>
```

```typescript
import { MarkdownEditor } from "@powerduck/md-editor";
import "@powerduck/md-editor/dist/style.css";

const editor = new MarkdownEditor("#editor", {
  value: "# Hello World\n\nThis is **bold** and *italic*.\n\n$$E = mc^2$$",
  mode: "complex",
  theme: "light",
  math: true,
  mindmap: true,
  codeHighlight: true,
  tips: true,
  preview: true,
  onChange: (value) => console.log("Content changed:", value.length, "chars"),
});

// Get the current Markdown content
const markdown = editor.getValue();

// Get the rendered HTML
const html = editor.getHtml();

// Programmatically set content
editor.setValue("# New Content");

// Toggle theme
editor.setTheme("dark");
```

### React Component

```bash
npm install react react-dom @powerduck/md-editor
```

```tsx
import { useState } from "react";
import { MarkdownEditorReact } from "@powerduck/md-editor/react";
import "@powerduck/md-editor/dist/style.css";

function App() {
  const [value, setValue] = useState("# Hello from React");

  return (
    <div style={{ height: "600px" }}>
      <MarkdownEditorReact
        value={value}
        onChange={setValue}
        mode="complex"
        theme="light"
      />
    </div>
  );
}
```

### Standalone Markdown Rendering

```typescript
import { renderMarkdown } from "@powerduck/md-editor";
import "@powerduck/md-editor/dist/style.css";

const html = renderMarkdown(`
# Title

- Item one
- Item two

\`\`\`typescript
console.log("Hello");
\`\`\`

$$\\sum_{i=1}^{n} i$$
`);

document.getElementById("output").innerHTML = html;
```

## 5. Create an MCP Server from an OpenAPI Spec

`@powerduck/openapi-mcp-server` turns OpenAPI documents into production MCP servers with Tools, Prompts, Resources, and a Web UI admin console.

```bash
npm install @powerduck/openapi-mcp-server
```

### CLI Usage

```bash
# Serve via web transport with the admin UI
openapi-mcp serve --spec ./openapi.json --transport web --port 3000

# Serve via stdio (for MCP clients like Claude Desktop)
openapi-mcp serve --spec ./openapi.json --transport stdio
```

### Programmatic Usage

```typescript
import { loadOpenApiSpec, generateTools, buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// Load an OpenAPI document from a file or URL
const spec = await loadOpenApiSpec("./openapi.json");

// Generate MCP tools from every operation
const tools = generateTools(spec.document);
console.log(`Generated ${tools.length} MCP tools`);
tools.forEach((t) => console.log(`  - ${t.name}: ${t.description}`));

// Build and start an MCP server over stdio
const server = buildMcpServer({
  spec: spec.document,
  tools,
});

await startStdioServer(server);
```

## 6. Debug an API Request

`@powerduck/openapi-request` provides a scripted debugger for sending requests based on OpenAPI operations, with support for HTTP, SSE, WebSocket, GraphQL, gRPC, and MCP.

```bash
npm install @powerduck/openapi-request
```

```typescript
import { createDebugger, locateOperation } from "@powerduck/openapi-request";

const debugger = createDebugger({
  baseUrl: "https://api.example.com",
  defaultHeaders: { "Authorization": "Bearer my-token" },
});

// Send a single request
const result = await debugger.send({
  method: "GET",
  url: "https://api.example.com/v1/users/123",
  headers: { "Accept": "application/json" },
});

console.log("Status:", result.status);
console.log("Body:", result.body);
console.log("Duration:", result.durationMs, "ms");
```

## Next Steps

- Dive deeper into [MD Editor](../md-editor/introduction) — configuration, features, and API reference.
- Explore [OpenAPI Codegen](../openapi-codegen/introduction) — all 21 languages and plugin system.
- Learn [conf-patch](../conf-patch/introduction) — file locking, OpenAPI validation, and atomic writes.
- Build an [MCP Server](../openapi-mcp-server/introduction) — admin UI, auth, and runtime management.
- Convert [cURL and Postman](../x-to-openapi/introduction) — custom adapters and schema inference.
