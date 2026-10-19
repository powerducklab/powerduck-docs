---
sidebar_position: 1
title: "@powerduck/openapi-request 简介"
description: "@powerduck/openapi-request 是面向 OpenAPI 3.2 的集合调试器和请求运行库。它根据 OpenAPI 文档规划并发送请求，识别流式响应，根据实际响应生成更新后的文档，并通过一套精简接口支持六种通信协议。"
---

# @powerduck/openapi-request 简介

`@powerduck/openapi-request` 是面向 OpenAPI 3.2 的集合调试器和请求运行库。它根据 OpenAPI 文档规划并发送请求，识别流式响应，根据实际响应生成更新后的文档，并通过一套精简接口支持六种通信协议。

- **包名：** `@powerduck/openapi-request`
- **版本：** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **许可证：** MIT
- **模块格式：** 同时提供 ESM 和 CommonJS 构建，附带类型声明。

## 用途

该库以同一份文档为依据，满足三类需求：

- **面向图形界面的客户端** — `createClient()` 返回的对象提供 `prepare()`、`send()`、`connect()`、`discover()` 和 `writeback()`，分别对应图形化请求编辑器的各个操作步骤。
- **脚本化调试器** — `createDebugger()` 返回 `ProtoKit`，提供 `send()`、`sendMany()` 和 `toCollection()`，用于自动化、脚本和 CI。
- **手动管理的长连接会话** — `createManualSession()` 返回双向会话对象，包含打开、发送、关闭操作及事件流。WebSocket、MCP 和 gRPC 使用相同的对象结构，因此可以共用一套界面。

## 协议适配器

核心不依赖具体传输方式；协议行为由注册到 `AdapterRegistry` 的适配器提供。

- **HTTP / SSE** — 默认支持。根据声明的内容类型或实际响应头，自动识别普通 JSON 请求和服务器发送事件流。
- **WebSocket** — 使用统一事件结构处理双向文本和二进制会话。
- **gRPC** — 根据 `.proto` 文件或服务器反射，执行一元、服务端流、客户端流和双向流调用。
- **MCP** — 通过 Streamable HTTP 或 stdio 调用 Model Context Protocol 工具。
- **GraphQL** — 支持内省、操作生成和执行。

## 主要功能

- **OpenAPI 3.2 集合模型** — 通过 `operationId` 或 `method`+`path` 定位操作，并根据参数、请求体和示例规划请求。
- **流式响应识别** — `isStreamingOperation()`、`isSseContentType()` 和 `isStreamingContentType()` 根据声明的内容类型判断响应类型，`probeStreamingResponse()` 检查实际响应头。
- **响应回写** — `inferSchema()`、`mergeSchema()`、`toResponseObject()` 和 `writeBackResponse()` 推导响应模式并返回更新后的文档。默认情况下，回写成功时 `send()` 通过 `patchedSpec` 返回该文档；设置 `writeBack: false` 可禁用回写。传入的文档不会被修改，也不会自动保存文件。持久化结果前，请检查 `writeBackSkippedReason` 和 `writeBackWarnings`。
- **模式辅助工具** — `sampleFromSchema()` 根据模式生成示例数据。
- **大型依赖按需加载** — gRPC（`@grpc/grpc-js`、`@grpc/proto-loader`）和 MCP（`@modelcontextprotocol/sdk`）在首次使用时加载，仅使用 HTTP 时无需承担其加载开销。

## 安装

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## 快速上手

```typescript
import { createClient } from "@powerduck/openapi-request";

const spec = {
  openapi: "3.2.0",
  info: { title: "Users", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User" } },
      },
    },
  },
};

const client = createClient();

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

## 后续阅读

- [安装](./installation.md) — 包结构、子路径导出和协议能力的对等依赖。
- [快速上手](./quickstart.md) — 第一个请求、调试器运行和手动会话。
- [配置](./configuration.md) — `CreateClientOptions`、`DebuggerOptions` 及各协议的配置。
- [API 参考](./api-reference.md) — 按功能分类的全部导出。
- [示例](./examples.md) — HTTP、SSE、WebSocket、GraphQL、MCP 和 gRPC 的可运行示例。

## 许可证

MIT.
