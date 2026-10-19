---
sidebar_position: 2
title: "安裝"
description: "安裝 @powerduck/openapi-request，了解各通訊協定的子路徑匯出，以及 gRPC 和 MCP 所需的選用相依套件。"
---

# 安裝

`@powerduck/openapi-request` 提供 ESM 與 CommonJS 建置，並附有 TypeScript 型別宣告。需要 Node.js `>= 22.12.0`。

## 安裝

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

Yarn:

```bash
yarn add @powerduck/openapi-request
```

pnpm:

```bash
pnpm add @powerduck/openapi-request
```

## ESM / CommonJS

```javascript
// ESM
import { createClient } from "@powerduck/openapi-request";

// CommonJS
const { createClient } = require("@powerduck/openapi-request");
```

不必額外安裝 `@types/*` 套件。

## 套件結構與子路徑匯出

預設進入點匯出核心 API，每種通訊協定也有自己的子路徑：

| 匯入路徑 | 內容 |
|---|---|
| `@powerduck/openapi-request` | 核心：`createClient`、`createDebugger`、`createManualSession`、`AdapterRegistry`、`ProtoKitError`、OpenAPI 輔助工具與型別。 |
| `@powerduck/openapi-request/http` | `HttpAdapter`、`SseParser`、串流偵測函式，以及 HTTP 集合與環境建構器（`buildCollection`、`buildEnvironment`、`resolveServerUrl`）。 |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`、`createWsManualSession`，以及 WebSocket 設定與工作階段輔助工具。 |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`、`GrpcAdapter`、`grpcCall`、`createGrpcManualSession`，以及探索、反射、描述元、目錄、認證資訊、載入器與範本模組。 |
| `@powerduck/openapi-request/mcp` | `McpAdapter`、`createMcpManualSession`、`createMcpStdioSession`，以及 MCP 傳輸、設定、探索與產生模組。 |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`、`resolveGraphQLConfig`、`runGraphQL`，以及內省、操作產生與寫回功能。 |

匯入通訊協定子路徑會帶入該協定的型別與輔助工具，不會重新匯出無關的介面卡。

## 選用功能相依套件

gRPC 與 MCP 的相依套件較大，採用**首次使用時延遲載入**。只使用 HTTP 時不必安裝。需要對應通訊協定時再安裝：

- **gRPC** 需要 `@grpc/grpc-js` 與 `@grpc/proto-loader`。伺服器反射另需 `@grpc/proto-loader >= 0.7`，以提供 `loadFileDescriptorSetFromBuffer`。
- **MCP** 需要 `@modelcontextprotocol/sdk`。

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

缺少相依套件時，gRPC 載入器會擲回 `GrpcDependencyMissingError` 並列出確切安裝指令；已安裝但無法正常使用時，則擲回 `GrpcDependencyBrokenError`。

## 驗證

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

安裝後，兩個匯入路徑都應能正常解析。

## 後續步驟

- [快速入門](/docs/zh-TW/openapi-request/quickstart/)
- [設定](/docs/zh-TW/openapi-request/configuration/)
