---
sidebar_position: 2
title: "安装"
description: "安装 @powerduck/openapi-request，了解各协议的子路径导出，以及 gRPC 和 MCP 所需的可选依赖。"
---

# 安装

`@powerduck/openapi-request` 同时提供 ESM 和 CommonJS 构建，并附带 TypeScript 类型声明。需要 Node.js `>= 22.12.0`。

## 安装

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

无须额外安装 `@types/*` 包。

## 包结构和子路径导出

默认入口导出核心 API，每种协议也有自己的子路径：

| 导入路径 | 内容 |
|---|---|
| `@powerduck/openapi-request` | 核心：`createClient`、`createDebugger`、`createManualSession`、`AdapterRegistry`、`ProtoKitError`、OpenAPI 辅助工具和类型。 |
| `@powerduck/openapi-request/http` | `HttpAdapter`、`SseParser`、流式检测函数，以及 HTTP 集合和环境构建器（`buildCollection`、`buildEnvironment`、`resolveServerUrl`）。 |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`、`createWsManualSession`，以及 WebSocket 配置和会话辅助工具。 |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`、`GrpcAdapter`、`grpcCall`、`createGrpcManualSession`，以及发现、反射、描述符、目录、凭据、加载器和模板模块。 |
| `@powerduck/openapi-request/mcp` | `McpAdapter`、`createMcpManualSession`、`createMcpStdioSession`，以及 MCP 传输、配置、发现和生成模块。 |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`、`resolveGraphQLConfig`、`runGraphQL`，以及内省、操作生成和回写功能。 |

导入协议子路径会引入该协议的类型和辅助工具，不会重新导出无关的适配器。

## 可选功能依赖

gRPC 和 MCP 的依赖较重，采用**首次使用时延迟加载**。仅使用 HTTP 时无需安装它们。需要相应协议时再安装：

- **gRPC** 需要 `@grpc/grpc-js` 和 `@grpc/proto-loader`。服务器反射还要求 `@grpc/proto-loader >= 0.7`，以提供 `loadFileDescriptorSetFromBuffer`。
- **MCP** 需要 `@modelcontextprotocol/sdk`。

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

缺少依赖时，gRPC 加载器会抛出 `GrpcDependencyMissingError`，并给出准确的安装命令；已安装但不可用时，会抛出 `GrpcDependencyBrokenError`。

## 验证

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

安装后，两条导入路径都应能正常解析。

## 下一步

- [快速开始](/docs/zh-CN/openapi-request/quickstart/)
- [配置](/docs/zh-CN/openapi-request/configuration/)
