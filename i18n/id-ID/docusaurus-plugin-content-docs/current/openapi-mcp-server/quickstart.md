---
sidebar_position: 3
title: "Mulai cepat"
description: "Mulai menggunakan @powerduck/openapi-mcp-server: CLI dengan konsol web, server stdio melalui kode, dan server admin bawaan."
---

# Mulai cepat

Ada tiga cara menjalankan server: CLI dengan konsol web, server stdio melalui kode, atau server admin bawaan.

## 1. CLI: mode web dengan antarmuka admin

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

Buka `http://127.0.0.1:3000` untuk mengunggah atau menempelkan dokumen OpenAPI, memeriksa tool, prompt, dan resource yang dihasilkan, serta melihat log permintaan. Klien MCP terhubung ke `/mcp` (Streamable HTTP) atau `/sse` (transport lama).

## 2. CLI: mode stdio

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

Dalam mode stdio, `--spec` wajib diberikan. Proses berkomunikasi menggunakan MCP melalui stdin/stdout.

## 3. Melalui kode: server stdio

```typescript
import { loadOpenApiSpec, startStdioServer } from "@powerduck/openapi-mcp-server";

const spec = await loadOpenApiSpec("./openapi.yaml");

const handle = await startStdioServer(
  spec,
  { baseUrlOverride: "https://api.example.com" }, // ExecutionContext
  { handleSignals: true },
);

await handle.closed; // resolves when the peer closes stdin
```

## 4. Melalui kode: server yang Anda kendalikan

```typescript
import { buildMcpServer, attachSseRoutes } from "@powerduck/openapi-mcp-server";
import express from "express";

// specProvider returns the active document (or null); contextProvider returns
// the per-call ExecutionContext (base URL override, security, timeouts, logs).
const server = buildMcpServer(
  () => spec,
  () => ({ baseUrlOverride: "https://api.example.com" }),
  { name: "my-api", version: "1.0.0" },
);

const app = express();
app.use(express.json());
attachSseRoutes(
  app,
  () => spec,
  () => ({ baseUrlOverride: "https://api.example.com" }),
);
app.listen(3000);
```

> Untuk menggunakan handle `attachMcpRoutes(app, options)` yang lebih lengkap, dengan `maxSessions`, `allowedOrigins`, `sessionIdleMs`, `listSessions`, `closeSession`, dan lainnya, impor dari `@powerduck/openapi-mcp-server`. Server admin menggunakan fungsi yang sama.

## 5. Server admin dengan autentikasi

```typescript
import { startAdminServer } from "@powerduck/openapi-mcp-server/server";

const handle = await startAdminServer({
  port: 3000,
  host: "127.0.0.1",
  apiKey: "your-admin-key",
  specPath: "./openapi.yaml",
});

console.log("admin on", handle.port);
await handle.close();
```

## Langkah berikutnya

- [Konfigurasi](/docs/id-ID/openapi-mcp-server/configuration/) — Semua opsi `ServerConfig`.
- [Contoh](/docs/id-ID/openapi-mcp-server/examples/) — Contoh penggunaan melalui kode lainnya.
- [Referensi API](/docs/id-ID/openapi-mcp-server/api-reference/) — Semua ekspor.
