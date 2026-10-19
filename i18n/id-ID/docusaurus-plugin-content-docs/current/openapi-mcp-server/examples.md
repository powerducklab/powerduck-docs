---
sidebar_position: 6
title: "Contoh"
description: "Contoh @powerduck/openapi-mcp-server: server web melalui CLI, stdio, kunci API, SpecProvider khusus, dan pembuatan alat."
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# Contoh

## 1. CLI: transport web dengan antarmuka admin

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

Konsol admin tersedia di `/`, endpoint MCP Streamable HTTP di `/mcp`, dan endpoint SSE lama di `/sse`.

## 2. Penggunaan melalui kode: server stdio

```typescript
import { loadOpenApiSpec, startStdioServer } from "@powerduck/openapi-mcp-server";

const spec = await loadOpenApiSpec("./openapi.yaml");

const handle = await startStdioServer(
  spec,
  {
    baseUrlOverride: "https://api.example.com",
    security: { bearerToken: process.env.UPSTREAM_TOKEN },
    requestTimeoutMs: 10000,
  },
  { handleSignals: true },
);

console.error("stdio MCP server ready");
await handle.closed;
```

## 3. Server admin dengan autentikasi kunci API

```typescript
import { startAdminServer } from "@powerduck/openapi-mcp-server/server";

const handle = await startAdminServer({
  port: 3000,
  host: "127.0.0.1",
  apiKey: process.env.ADMIN_API_KEY,
  specPath: "./openapi.yaml",
  allowedOrigins: ["https://your-console.example.com"],
  redactSensitiveHeaders: true,
  maxLogEntries: 500,
});

console.log("admin listening on", handle.port);
// ...
await handle.close();
```

## 4. SpecProvider dan penyedia konteks khusus

Buat server MCP dan pasang pada aplikasi Express Anda sendiri:

```typescript
import express from "express";
import {
  attachMcpRoutes,
  loadOpenApiSpec,
} from "@powerduck/openapi-mcp-server";

let spec = await loadOpenApiSpec("./openapi.yaml");

// A provider that can be swapped at runtime without restarting sessions.
const specProvider = () => spec;
const contextProvider = () => ({
  baseUrlOverride: "https://api.example.com",
  security: { bearerToken: process.env.UPSTREAM_TOKEN },
});

const app = express();
app.use(express.json());

const routes = attachMcpRoutes(app, {
  specProvider,
  contextProvider,
  maxSessions: 64,
  sessionIdleMs: 600000,
});
console.log(routes.listSessions());

app.listen(8080, () => console.log("mcp on :8080/mcp"));
```

> `attachMcpRoutes` diekspor dari akar paket. Opsinya mengatur batas sesi, origin CORS, dan pembersihan sesi tidak aktif. Handle yang dikembalikan menyediakan `listSessions`, `closeSession`, `closeAll`, dan `dispose`. Panggil `dispose()` saat penghentian untuk menghentikan pembersihan latar belakang dan menutup sesi. Gunakan [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath) jika Anda juga membutuhkan konsol admin.

## 5. Membuat alat, prompt, dan sumber daya dari spesifikasi

```typescript
import {
  loadOpenApiSpec,
  generateTools,
  generateToolsDetailed,
  buildBindingIndex,
  generatePrompts,
  generateResources,
  executeToolCall,
} from "@powerduck/openapi-mcp-server";

const spec = await loadOpenApiSpec("./openapi.yaml");

const tools = generateTools(spec);
console.log(tools.map((t) => t.name));

const detailed = generateToolsDetailed(spec);
console.log("issues:", detailed.issues);

const bindings = buildBindingIndex(spec); // toolName -> ToolBinding

console.log(generatePrompts(spec).map((p) => p.name));
console.log(generateResources(spec).map((r) => r.uri));

// Execute one generated tool directly.
const result = await executeToolCall(
  spec,
  "get_user",
  { id: "42" },
  { baseUrlOverride: "https://api.example.com" },
);
console.log(result.status, result.data);
```

## 6. Menggunakan middleware autentikasi dalam aplikasi Express sendiri

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

Jika kunci tidak disertakan, perlindungan akses dinonaktifkan. String kosong akan memicu error, bukan membuka akses tanpa pemberitahuan.

## Lihat juga

- [Panduan cepat](../quickstart/)
- [Referensi API](../api-reference/)
