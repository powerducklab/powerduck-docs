---
sidebar_position: 2
title: "Kurulum"
description: "@powerduck/openapi-request paketini kurun, protokol alt yollarını öğrenin ve gRPC ile MCP için isteğe bağlı paketleri ekleyin."
---

# Kurulum

`@powerduck/openapi-request`, TypeScript bildirimleriyle birlikte ESM ve CommonJS derlemeleri sunar. Node.js `>= 22.12.0` gerekir.

## Kurulum

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

Ek `@types/*` paketleri gerekmez.

## Paket yapısı ve alt yol dışa aktarımları

Varsayılan giriş çekirdek API’yi dışa aktarır. Her protokolün ayrıca kendi alt yolu vardır:

| İçe aktarma | İçerik |
|---|---|
| `@powerduck/openapi-request` | Çekirdek: `createClient`, `createDebugger`, `createManualSession`, `AdapterRegistry`, `ProtoKitError`, OpenAPI yardımcıları ve türler. |
| `@powerduck/openapi-request/http` | `HttpAdapter`, `SseParser`, akış algılama işlevleri ve HTTP koleksiyon/ortam oluşturucuları (`buildCollection`, `buildEnvironment`, `resolveServerUrl`). |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`, `createWsManualSession`, WebSocket yapılandırma ve oturum yardımcıları. |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`, `GrpcAdapter`, `grpcCall`, `createGrpcManualSession`; keşif, yansıma, tanımlayıcı, katalog, kimlik bilgileri, yükleyici ve şablon modülleri. |
| `@powerduck/openapi-request/mcp` | `McpAdapter`, `createMcpManualSession`, `createMcpStdioSession`; MCP aktarım, yapılandırma, keşif ve üretim modülleri. |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`, `resolveGraphQLConfig`, `runGraphQL`, içgözlem, işlem üretimi ve değişiklikleri geri yazma. |

Protokol alt yolunu içe aktarmak, ilgili türleri ve yardımcıları yükler; ilgisiz adaptörleri yeniden dışa aktarmaz.

## İsteğe bağlı yetenek paketleri

gRPC ve MCP’nin büyük bağımlılıkları **ilk kullanımda yüklenir**. Yalnızca HTTP kullanan bir kurulum bunlar olmadan çalışır. Sadece ilgili protokole ihtiyacınız varsa kurun:

- **gRPC**, `@grpc/grpc-js` ve `@grpc/proto-loader` gerektirir. Sunucu yansıması ayrıca `loadFileDescriptorSetFromBuffer` için `@grpc/proto-loader >= 0.7` gerektirir.
- **MCP**, `@modelcontextprotocol/sdk` gerektirir.

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

Paket eksikse gRPC yükleyicisi tam kurulum komutunu içeren `GrpcDependencyMissingError` fırlatır. Paket kurulu ancak bozuksa `GrpcDependencyBrokenError` oluşur.

## Doğrulama

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

Paket kurulduğunda her iki içe aktarma da çözümlenir.

## Sonraki adımlar

- [Hızlı başlangıç](/docs/tr-TR/openapi-request/quickstart/)
- [Yapılandırma](/docs/tr-TR/openapi-request/configuration/)
