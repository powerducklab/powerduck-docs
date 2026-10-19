---
sidebar_position: 3
title: "तुरंत शुरुआत"
description: "@powerduck/openapi-mcp-server के साथ शुरुआत: वेब कंसोल वाला CLI, कोड से चलने वाला stdio सर्वर और अंतर्निहित प्रबंधन सर्वर।"
---

# तुरंत शुरुआत

चलाने के तीन तरीके हैं: वेब कंसोल वाला CLI, कोड से शुरू किया गया stdio सर्वर या अंतर्निहित प्रबंधन सर्वर।

## 1. CLI: प्रबंधन UI के साथ वेब मोड

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

OpenAPI दस्तावेज़ अपलोड या पेस्ट करने, बनाए गए टूल, प्रॉम्प्ट और संसाधन देखने तथा अनुरोध लॉग जाँचने के लिए `http://127.0.0.1:3000` खोलें। MCP क्लाइंट `/mcp` (Streamable HTTP) या `/sse` (पुराना ट्रांसपोर्ट) से जुड़ते हैं।

## 2. CLI: stdio मोड

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

stdio मोड में `--spec` अनिवार्य है। प्रक्रिया stdin/stdout के ज़रिए MCP में संचार करती है।

## 3. कोड से stdio सर्वर चलाएँ

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

## 4. कोड से अपने नियंत्रण वाला सर्वर बनाएँ

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

> `maxSessions`, `allowedOrigins`, `sessionIdleMs`, `listSessions`, `closeSession` आदि वाला अधिक पूर्ण `attachMcpRoutes(app, options)` हैंडल चाहिए तो उसे `@powerduck/openapi-mcp-server` से इम्पोर्ट करें। प्रबंधन सर्वर भी इसी फ़ंक्शन का इस्तेमाल करता है।

## 5. प्रमाणीकरण वाला प्रबंधन सर्वर

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

## अगले कदम

- [कॉन्फ़िगरेशन](/docs/hi-IN/openapi-mcp-server/configuration/) — `ServerConfig` के सभी विकल्प।
- [उदाहरण](/docs/hi-IN/openapi-mcp-server/examples/) — कोड से इस्तेमाल करने के और उदाहरण।
- [API संदर्भ](/docs/hi-IN/openapi-mcp-server/api-reference/) — सभी एक्सपोर्ट।
