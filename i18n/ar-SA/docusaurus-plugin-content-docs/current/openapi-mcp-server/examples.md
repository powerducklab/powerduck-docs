---
sidebar_position: 6
title: "أمثلة"
description: "أمثلة على @powerduck/openapi-mcp-server: خادم ويب عبر CLI وstdio ومفاتيح API وSpecProvider مخصص وتوليد الأدوات."
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# أمثلة

## 1. CLI: النقل عبر الويب مع واجهة الإدارة

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

تتوفر لوحة الإدارة على `/`، ونقطة نهاية MCP باستخدام Streamable HTTP على `/mcp`، ونقطة نهاية SSE القديمة على `/sse`.

## 2. تشغيل خادم stdio برمجيًا

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

## 3. خادم إدارة مع مصادقة بمفتاح API

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

## 4. موفّر SpecProvider وموفّر سياق مخصصان

أنشئ خادم MCP واربطه بتطبيق Express الخاص بك:

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

> تُصدَّر `attachMcpRoutes` من جذر الحزمة. تتحكم خياراتها في حدود الجلسات ومصادر CORS وتنظيف الجلسات الخاملة. ويوفر الكائن المُعاد `listSessions` و`closeSession` و`closeAll` و`dispose`. استدعِ `dispose()` عند الإيقاف لإيقاف التنظيف في الخلفية وإغلاق الجلسات. استخدم [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath) إذا كنت تحتاج أيضًا إلى لوحة الإدارة.

## 5. توليد الأدوات والموجّهات والموارد من المواصفة

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

## 6. استخدام وسيط المصادقة في تطبيق Express الخاص بك

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

يؤدي عدم تمرير المفتاح إلى تعطيل حماية الوصول، أما تمرير سلسلة فارغة فيؤدي إلى خطأ بدلًا من إتاحة الوصول دون تنبيه.

## انظر أيضًا

- [البدء السريع](../quickstart/)
- [مرجع API](../api-reference/)
