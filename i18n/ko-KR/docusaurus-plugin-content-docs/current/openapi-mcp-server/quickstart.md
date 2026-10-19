---
sidebar_position: 3
title: "빠른 시작"
description: "@powerduck/openapi-mcp-server 시작하기: 웹 콘솔 CLI, 코드로 실행하는 stdio 서버, 내장 관리 서버."
---

# 빠른 시작

실행 방법은 세 가지입니다. 웹 콘솔이 있는 CLI, 코드로 실행하는 stdio 서버, 내장 관리 서버를 사용할 수 있습니다.

## 1. CLI: 관리 UI가 있는 웹 모드

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

`http://127.0.0.1:3000`을 열어 OpenAPI 문서를 업로드하거나 붙여 넣고, 생성된 도구·프롬프트·리소스와 요청 로그를 확인합니다. MCP 클라이언트는 `/mcp`(Streamable HTTP) 또는 `/sse`(레거시)에 연결합니다.

## 2. CLI: stdio 모드

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

stdio 모드에서는 `--spec`이 필수입니다. 프로세스는 stdin/stdout을 통해 MCP로 통신합니다.

## 3. 코드로 실행: stdio 서버

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

## 4. 코드로 실행: 직접 제어하는 서버

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

> `maxSessions`, `allowedOrigins`, `sessionIdleMs`, `listSessions`, `closeSession` 등을 제공하는 더 완전한 `attachMcpRoutes(app, options)` 핸들은 `@powerduck/openapi-mcp-server`에서 가져오세요. 관리 서버도 같은 함수를 사용합니다.

## 5. 인증을 사용하는 관리 서버

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

## 다음 단계

- [설정](/docs/ko-KR/openapi-mcp-server/configuration/) — `ServerConfig`의 모든 옵션.
- [예제](/docs/ko-KR/openapi-mcp-server/examples/) — 코드로 사용하는 추가 예제.
- [API 참조](/docs/ko-KR/openapi-mcp-server/api-reference/) — 모든 내보내기 항목.
