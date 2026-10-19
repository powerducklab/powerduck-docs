---
sidebar_position: 2
title: "Instalación"
description: "Instala @powerduck/openapi-request, conoce sus subrutas por protocolo y añade los paquetes opcionales para gRPC y MCP."
---

# Instalación

`@powerduck/openapi-request` incluye compilaciones ESM y CommonJS, además de declaraciones TypeScript. Requiere Node.js `>= 22.12.0`.

## Instalación

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

No necesitas paquetes `@types/*` adicionales.

## Estructura del paquete y exportaciones de subrutas

La entrada predeterminada exporta el núcleo. Cada protocolo también tiene su propia subruta:

| Importación | Contenido |
|---|---|
| `@powerduck/openapi-request` | Núcleo: `createClient`, `createDebugger`, `createManualSession`, `AdapterRegistry`, `ProtoKitError`, utilidades OpenAPI y tipos. |
| `@powerduck/openapi-request/http` | `HttpAdapter`, `SseParser`, detección de streaming y constructores HTTP de colecciones y entornos (`buildCollection`, `buildEnvironment`, `resolveServerUrl`). |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`, `createWsManualSession` y utilidades de configuración y sesiones WebSocket. |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`, `GrpcAdapter`, `grpcCall`, `createGrpcManualSession` y módulos de descubrimiento, reflexión, descriptores, catálogo, credenciales, carga y plantillas. |
| `@powerduck/openapi-request/mcp` | `McpAdapter`, `createMcpManualSession`, `createMcpStdioSession` y módulos de transporte, configuración, descubrimiento y generación MCP. |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`, `resolveGraphQLConfig`, `runGraphQL`, introspección, generación de operaciones y escritura de cambios. |

Al importar una subruta, obtienes los tipos y utilidades de ese protocolo sin reexportar adaptadores ajenos.

## Paquetes de capacidades opcionales

gRPC y MCP incluyen dependencias pesadas. Se **cargan bajo demanda en el primer uso**, por lo que una instalación solo para HTTP funciona sin ellas. Instálalas únicamente si necesitas ese protocolo:

- **gRPC** requiere `@grpc/grpc-js` y `@grpc/proto-loader`. La reflexión del servidor exige además `@grpc/proto-loader >= 0.7`, por `loadFileDescriptorSetFromBuffer`.
- **MCP** requiere `@modelcontextprotocol/sdk`.

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

Si falta una dependencia, el cargador gRPC lanza `GrpcDependencyMissingError` con el comando exacto de instalación. Si está instalada pero no funciona, lanza `GrpcDependencyBrokenError`.

## Verificación

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

Ambas importaciones se resuelven tras instalar el paquete.

## Siguientes pasos

- [Inicio rápido](/docs/es-ES/openapi-request/quickstart/)
- [Configuración](/docs/es-ES/openapi-request/configuration/)
