---
sidebar_position: 6
title: "उदाहरण"
description: "@powerduck/openapi-mcp-server के उदाहरण: CLI वेब सर्वर, stdio, API कुंजियाँ, कस्टम SpecProvider और टूल जनरेशन।"
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# उदाहरण

## 1. CLI: एडमिन UI के साथ वेब ट्रांसपोर्ट

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

एडमिन कंसोल `/` पर, Streamable HTTP MCP एंडपॉइंट `/mcp` पर और पुराना SSE एंडपॉइंट `/sse` पर उपलब्ध होता है।

## 2. कोड से stdio सर्वर चलाना

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

## 3. API कुंजी से प्रमाणीकरण वाला एडमिन सर्वर

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

## 4. कस्टम SpecProvider और कॉन्टेक्स्ट प्रोवाइडर

MCP सर्वर स्वयं बनाएँ और उसे अपने Express ऐप में माउंट करें:

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

> `attachMcpRoutes` पैकेज के रूट से एक्सपोर्ट होता है। इसके विकल्प सत्रों की सीमा, CORS ओरिजिन और निष्क्रिय सत्रों की सफ़ाई नियंत्रित करते हैं। लौटाए गए हैंडल में `listSessions`, `closeSession`, `closeAll` और `dispose` उपलब्ध हैं। सर्वर बंद करते समय `dispose()` कॉल करें, ताकि बैकग्राउंड सफ़ाई रुक जाए और सत्र बंद हो जाएँ। यदि एडमिन कंसोल भी चाहिए, तो [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath) का उपयोग करें।

## 5. स्पेसिफ़िकेशन से टूल, प्रॉम्प्ट और रिसोर्स बनाना

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

## 6. अपने Express ऐप में प्रमाणीकरण मिडलवेयर का उपयोग

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

कुंजी न देने पर एक्सेस सुरक्षा बंद हो जाती है। खाली स्ट्रिंग देने पर बिना सूचना के एक्सेस खोलने के बजाय त्रुटि आती है।

## यह भी देखें

- [त्वरित शुरुआत](../quickstart/)
- [API संदर्भ](../api-reference/)
