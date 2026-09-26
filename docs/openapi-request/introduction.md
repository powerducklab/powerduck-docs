---
sidebar_position: 1
title: "Introduction"
description: "OpenAPI 3.2 collection debugger and protocol client from @powerduck/openapi-request v0.2.8: HTTP/SSE/WebSocket, gRPC, MCP and GraphQL adapters, UI-first client, scripted debugger, manual sessions, and response write-back."
keywords: ["openapi-request", "powerduck", "collection debugger", "SSE", "websocket", "grpc", "mcp", "graphql", "introduction"]
---

# @powerduck/openapi-request Introduction

`@powerduck/openapi-request` is an OpenAPI 3.2 collection debugger and request runtime. It turns an OpenAPI document into something you can actually drive: it plans a request from the document, sends it, classifies streaming responses, feeds observed data back into the document, and speaks six wire protocols behind one small surface.

- **Package name:** `@powerduck/openapi-request`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **License:** MIT
- **Module format:** dual ESM and CommonJS builds with bundled type declarations.

## What it is

The library answers three different needs with one document as the source of truth:

- **A UI-first client** — `createClient()` returns an object whose `prepare()`, `send()`, `connect()`, `discover()` and `writeback()` methods line up exactly with the steps a graphical request builder walks through.
- **A scripted debugger** — `createDebugger()` returns a `ProtoKit` with `send()`, `sendMany()` and `toCollection()` for automation, scripts and CI.
- **Long-lived manual sessions** — `createManualSession()` returns a duplex session object (open/send/close + an event stream) that is identical in shape for WebSocket, MCP and gRPC, so one renderer can drive all three.

## Protocol adapters

The core is transport-agnostic; behaviour is supplied by protocol adapters registered in an `AdapterRegistry`.

- **HTTP / SSE** — the default. Plain JSON requests and Server-Sent-Events streams are detected automatically from declared content types or by probing live response headers.
- **WebSocket** — duplex text/binary sessions over one event shape.
- **gRPC** — unary, server-streaming, client-streaming and bidi calls, driven from `.proto` files or server reflection.
- **MCP** — calls to Model Context Protocol tools over Streamable HTTP or stdio.
- **GraphQL** — introspection, operation generation and execution.

## Key features

- **OpenAPI 3.2 collection model** — operations are located by `operationId` or `method`+`path`, and requests are planned from parameters, request bodies and examples.
- **Streaming detection** — `isStreamingOperation()`, `isSseContentType()` and `isStreamingContentType()` classify a response from declared content types, and `probeStreamingResponse()` inspects live response headers.
- **Response write-back** — observed responses are inferred into JSON Schemas and merged back into the document with `inferSchema()`, `mergeSchema()`, `toResponseObject()` and `writeBackResponse()`.
- **Schema helpers** — `sampleFromSchema()` produces example payloads from a schema.
- **Lazy heavy dependencies** — gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`) and MCP (`@modelcontextprotocol/sdk`) are loaded on first use, so HTTP-only consumers never pay for them.

## Installation

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## Quick start

```typescript
import { createClient } from "@powerduck/openapi-request";

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

## Next steps

- [Installation](./installation.md) — package layout, subpath exports and peer capability packages.
- [Quickstart](./quickstart.md) — your first request, debugger run and manual session.
- [Configuration](./configuration.md) — `CreateClientOptions`, `DebuggerOptions` and per-protocol configuration.
- [API Reference](./api-reference.md) — every export grouped by surface area.
- [Examples](./examples.md) — runnable recipes for HTTP, SSE, WebSocket, GraphQL, MCP and gRPC.

## License

MIT.
