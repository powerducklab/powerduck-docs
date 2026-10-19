---
sidebar_position: 6
title: "예제"
description: "@powerduck/openapi-mcp-server 예제: CLI 웹 서버, stdio, API 키, 사용자 정의 SpecProvider 및 도구 생성."
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# 예제

## 1. CLI: 관리 UI가 포함된 웹 전송

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

관리 콘솔은 `/`, Streamable HTTP MCP 엔드포인트는 `/mcp`, 기존 SSE 엔드포인트는 `/sse`에서 제공됩니다.

## 2. 코드로 실행하는 stdio 서버

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

## 3. API 키 인증을 사용하는 관리 서버

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

## 4. 사용자 정의 SpecProvider와 컨텍스트 공급자

MCP 서버를 직접 구성하고 자체 Express 앱에 마운트합니다.

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

> `attachMcpRoutes`는 패키지 루트에서 내보냅니다. 옵션으로 세션 수 제한, CORS 출처, 유휴 세션 정리를 설정할 수 있습니다. 반환된 핸들은 `listSessions`, `closeSession`, `closeAll`, `dispose`를 제공합니다. 종료할 때 `dispose()`를 호출하여 백그라운드 정리 작업을 중지하고 세션을 닫으세요. 관리 콘솔도 필요하면 [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath)를 사용하세요.

## 5. 명세에서 도구, 프롬프트, 리소스 생성

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

## 6. 자체 Express 앱에서 인증 미들웨어 사용

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

키를 생략하면 접근 보호가 비활성화됩니다. 빈 문자열을 전달하면 아무런 안내 없이 접근을 허용하는 대신 오류가 발생합니다.

## 관련 문서

- [빠른 시작](../quickstart/)
- [API 레퍼런스](../api-reference/)
