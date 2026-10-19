---
sidebar_position: 6
title: "Örnekler"
description: "@powerduck/openapi-mcp-server örnekleri: CLI ile web sunucusu, stdio, API anahtarları, özel SpecProvider ve araç üretimi."
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# Örnekler

## 1. CLI: yönetim arayüzüyle web aktarımı

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

Yönetim konsolu `/`, Streamable HTTP MCP uç noktası `/mcp`, eski SSE uç noktası ise `/sse` yolunda sunulur.

## 2. Kodla stdio sunucusu başlatma

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

## 3. API anahtarıyla kimlik doğrulayan yönetim sunucusu

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

## 4. Özel SpecProvider ve bağlam sağlayıcısı

MCP sunucusunu kendiniz oluşturup kendi Express uygulamanıza bağlayın:

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

> `attachMcpRoutes`, paketin kökünden dışa aktarılır. Seçenekleri oturum sınırlarını, CORS kaynaklarını ve boşta kalan oturumların temizlenmesini denetler. Döndürülen nesne `listSessions`, `closeSession`, `closeAll` ve `dispose` işlevlerini sunar. Kapanış sırasında arka plan temizliğini durdurmak ve oturumları kapatmak için `dispose()` çağırın. Yönetim konsolu da gerekiyorsa [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath) kullanın.

## 5. Belirtimden araç, istem ve kaynak üretme

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

## 6. Kendi Express uygulamanızda kimlik doğrulama ara yazılımı kullanma

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

Anahtar verilmezse erişim koruması devre dışı kalır. Boş dize ise erişimi sessizce açmak yerine hata oluşturur.

## Ayrıca bakınız

- [Hızlı başlangıç](../quickstart/)
- [API başvurusu](../api-reference/)
