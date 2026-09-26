---
sidebar_position: 2
title: "Installation"
description: "Installing @powerduck/openapi-request v0.2.4 via npm/yarn/pnpm, its subpath exports (./http, ./ws, ./grpc, ./mcp, ./graphql), and the optional gRPC and MCP capability packages."
keywords: ["installation", "install", "subpath exports", "grpc-js", "modelcontextprotocol", "openapi-request"]
---

# Installation

`@powerduck/openapi-request` ships dual ESM and CommonJS builds with bundled TypeScript declarations.

## Install

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

The package ships both ESM and CJS entry points, with type declarations:

```javascript
// ESM
import { createClient } from "@powerduck/openapi-request";

// CommonJS
const { createClient } = require("@powerduck/openapi-request");
```

No extra `@types/*` packages are required.

## Package layout and subpath exports

The default entry exports the core surface. Each protocol also has its own subpath:

| Import | Contents |
| --- | --- |
| `@powerduck/openapi-request` | Core: `createClient`, `createDebugger`, `createManualSession`, `AdapterRegistry`, `ProtoKitError`, the OpenAPI helpers, and type exports. |
| `@powerduck/openapi-request/http` | `HttpAdapter`, `SseParser`, streaming detection functions, plus HTTP collection/env builders (`buildCollection`, `buildEnvironment`, `resolveServerUrl`). |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`, `createWsManualSession`, WebSocket config and session helpers. |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`, `GrpcAdapter`, `grpcCall`, `createGrpcManualSession`, and the discovery/reflection/descriptor/catalog/credentials/loader/template modules. |
| `@powerduck/openapi-request/mcp` | `McpAdapter`, `createMcpManualSession`, `createMcpStdioSession`, and MCP transport/config/discovery/generation modules. |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`, `resolveGraphQLConfig`, `runGraphQL`, introspection, operation generation and write-back. |

Importing a protocol subpath pulls in that protocol's own types and helpers without re-exporting the unrelated adapters.

## Optional capability packages

gRPC and MCP are heavy stacks. They are **loaded lazily on first use**, so an HTTP-only install works without them. Install them only when you need that protocol:

- **gRPC** requires `@grpc/grpc-js` and `@grpc/proto-loader`. Server reflection additionally needs `@grpc/proto-loader >= 0.7` (for `loadFileDescriptorSetFromBuffer`).
- **MCP** requires `@modelcontextprotocol/sdk`.

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

If a capability package is missing, the gRPC loader throws a `GrpcDependencyMissingError` naming the exact install command; a present-but-broken install surfaces as `GrpcDependencyBrokenError`.

## Verify

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

Both imports resolve once the package is installed.

## Next steps

- [Quickstart](./quickstart.md)
- [Configuration](./configuration.md)
