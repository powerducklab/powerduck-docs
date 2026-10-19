---
sidebar_position: 3
title: "البدء السريع"
description: "ابدأ مع @powerduck/openapi-mcp-server عبر CLI بلوحة ويب، أو خادم stdio برمجي، أو خادم الإدارة المدمج."
---

# البدء السريع

تتوفر ثلاث طرق للتشغيل: CLI بلوحة ويب، أو خادم stdio يبدأ برمجيًا، أو خادم الإدارة المدمج.

## 1. CLI: وضع الويب مع واجهة الإدارة

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

افتح `http://127.0.0.1:3000` لرفع مستند OpenAPI أو لصقه، وفحص الأدوات والمطالبات والموارد المنشأة، ومتابعة سجلات الطلبات. تتصل عملاء MCP بالمسار `/mcp` عبر Streamable HTTP أو `/sse` للنقل القديم.

## 2. CLI: وضع stdio

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

الخيار `--spec` إلزامي في وضع stdio. يتواصل البرنامج باستخدام MCP عبر stdin/stdout.

## 3. التشغيل البرمجي: خادم stdio

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

## 4. التشغيل البرمجي: خادم تتحكم فيه

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

> لاستخدام الواجهة الأوسع `attachMcpRoutes(app, options)` التي تشمل `maxSessions` و`allowedOrigins` و`sessionIdleMs` و`listSessions` و`closeSession` وغيرها، استوردها من `@powerduck/openapi-mcp-server`. يستخدم خادم الإدارة الدالة نفسها.

## 5. خادم إدارة مع المصادقة

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

## الخطوات التالية

- [الإعدادات](/docs/ar-SA/openapi-mcp-server/configuration/) — جميع خيارات `ServerConfig`.
- [أمثلة](/docs/ar-SA/openapi-mcp-server/examples/) — أمثلة إضافية للاستخدام البرمجي.
- [مرجع API](/docs/ar-SA/openapi-mcp-server/api-reference/) — جميع العناصر المصدّرة.
