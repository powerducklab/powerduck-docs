---
sidebar_position: 2
title: "Instalasi"
description: "Instal @powerduck/openapi-request, pelajari subjalur protokol, dan tambahkan paket opsional untuk gRPC serta MCP."
---

# Instalasi

`@powerduck/openapi-request` menyertakan build ESM dan CommonJS beserta deklarasi TypeScript. Memerlukan Node.js `>= 22.12.0`.

## Instalasi

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

Tidak perlu paket `@types/*` tambahan.

## Struktur paket dan ekspor subjalur

Titik masuk bawaan mengekspor API inti. Setiap protokol juga memiliki subjalur sendiri:

| Impor | Isi |
|---|---|
| `@powerduck/openapi-request` | Inti: `createClient`, `createDebugger`, `createManualSession`, `AdapterRegistry`, `ProtoKitError`, helper OpenAPI, dan tipe. |
| `@powerduck/openapi-request/http` | `HttpAdapter`, `SseParser`, deteksi streaming, serta pembuat koleksi dan lingkungan HTTP (`buildCollection`, `buildEnvironment`, `resolveServerUrl`). |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`, `createWsManualSession`, serta helper konfigurasi dan sesi WebSocket. |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`, `GrpcAdapter`, `grpcCall`, `createGrpcManualSession`, serta modul penemuan, refleksi, deskriptor, katalog, kredensial, pemuat, dan template. |
| `@powerduck/openapi-request/mcp` | `McpAdapter`, `createMcpManualSession`, `createMcpStdioSession`, serta modul transport, konfigurasi, penemuan, dan pembuatan MCP. |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`, `resolveGraphQLConfig`, `runGraphQL`, introspeksi, pembuatan operasi, dan penulisan kembali perubahan. |

Mengimpor subjalur protokol memuat tipe dan helper protokol tersebut tanpa mengekspor ulang adaptor lain.

## Paket kemampuan opsional

gRPC dan MCP memiliki dependensi besar yang **dimuat saat pertama digunakan**. Instalasi khusus HTTP dapat berjalan tanpanya. Instal hanya jika protokol tersebut diperlukan:

- **gRPC** memerlukan `@grpc/grpc-js` dan `@grpc/proto-loader`. Refleksi server juga memerlukan `@grpc/proto-loader >= 0.7` untuk `loadFileDescriptorSetFromBuffer`.
- **MCP** memerlukan `@modelcontextprotocol/sdk`.

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

Jika paket tidak tersedia, pemuat gRPC melempar `GrpcDependencyMissingError` dengan perintah instalasi yang tepat. Jika terinstal tetapi rusak, yang muncul adalah `GrpcDependencyBrokenError`.

## Verifikasi

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

Kedua impor dapat diselesaikan setelah paket diinstal.

## Langkah berikutnya

- [Mulai cepat](/docs/id-ID/openapi-request/quickstart/)
- [Konfigurasi](/docs/id-ID/openapi-request/configuration/)
