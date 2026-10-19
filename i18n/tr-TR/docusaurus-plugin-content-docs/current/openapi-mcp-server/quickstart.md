---
sidebar_position: 3
title: "Hızlı başlangıç"
description: "@powerduck/openapi-mcp-server ile ilk adımlar: web konsollu CLI, kodla başlatılan stdio sunucusu ve gömülü yönetim sunucusu."
---

# Hızlı başlangıç

Üç çalıştırma yöntemi vardır: web konsollu CLI, kodla başlatılan stdio sunucusu veya gömülü yönetim sunucusu.

## 1. CLI: yönetim arayüzlü web modu

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

Bir OpenAPI belgesi yüklemek veya yapıştırmak, üretilen araçları, istemleri ve kaynakları incelemek, istek günlüklerini izlemek için `http://127.0.0.1:3000` adresini açın. MCP istemcileri `/mcp` (Streamable HTTP) veya `/sse` (eski aktarım) yoluna bağlanır.

## 2. CLI: stdio modu

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

stdio modunda `--spec` zorunludur. İşlem, stdin/stdout üzerinden MCP ile iletişim kurar.

## 3. Kodla kullanım: stdio sunucusu

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

## 4. Kodla kullanım: sizin yönettiğiniz bir sunucu

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

> `maxSessions`, `allowedOrigins`, `sessionIdleMs`, `listSessions`, `closeSession` gibi özellikler sunan daha kapsamlı `attachMcpRoutes(app, options)` arabirimi için işlevi `@powerduck/openapi-mcp-server` paketinden içe aktarın. Yönetim sunucusu da aynı işlevi kullanır.

## 5. Kimlik doğrulamalı yönetim sunucusu

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

## Sonraki adımlar

- [Yapılandırma](/docs/tr-TR/openapi-mcp-server/configuration/) — Tüm `ServerConfig` seçenekleri.
- [Örnekler](/docs/tr-TR/openapi-mcp-server/examples/) — Kodla kullanıma ilişkin diğer örnekler.
- [API başvurusu](/docs/tr-TR/openapi-mcp-server/api-reference/) — Dışa aktarılan tüm öğeler.
