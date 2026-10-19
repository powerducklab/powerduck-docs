---
sidebar_position: 2
title: "Installazione"
description: "Installa @powerduck/openapi-request, scopri i sottopercorsi dei protocolli e aggiungi i pacchetti opzionali per gRPC e MCP."
---

# Installazione

`@powerduck/openapi-request` include build ESM e CommonJS con dichiarazioni TypeScript. Richiede Node.js `>= 22.12.0`.

## Installazione

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

Non servono pacchetti `@types/*` aggiuntivi.

## Struttura del pacchetto ed esportazioni dei sottopercorsi

La voce predefinita esporta il nucleo. Ogni protocollo ha anche un proprio sottopercorso:

| Importazione | Contenuto |
|---|---|
| `@powerduck/openapi-request` | Nucleo: `createClient`, `createDebugger`, `createManualSession`, `AdapterRegistry`, `ProtoKitError`, helper OpenAPI e tipi. |
| `@powerduck/openapi-request/http` | `HttpAdapter`, `SseParser`, rilevamento dello streaming e builder HTTP per raccolte e ambienti (`buildCollection`, `buildEnvironment`, `resolveServerUrl`). |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`, `createWsManualSession` e helper per configurazione e sessioni WebSocket. |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`, `GrpcAdapter`, `grpcCall`, `createGrpcManualSession` e moduli per rilevamento, reflection, descrittori, cataloghi, credenziali, caricamento e template. |
| `@powerduck/openapi-request/mcp` | `McpAdapter`, `createMcpManualSession`, `createMcpStdioSession` e moduli MCP per trasporto, configurazione, rilevamento e generazione. |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`, `resolveGraphQLConfig`, `runGraphQL`, introspezione, generazione di operazioni e scrittura delle modifiche. |

Importare un sottopercorso carica tipi e helper del protocollo senza riesportare gli altri adattatori.

## Pacchetti opzionali per funzionalità

gRPC e MCP hanno dipendenze pesanti, **caricate al primo utilizzo**. Un’installazione solo HTTP funziona senza di esse. Installale solo per i protocolli necessari:

- **gRPC** richiede `@grpc/grpc-js` e `@grpc/proto-loader`. La reflection del server richiede inoltre `@grpc/proto-loader >= 0.7` per `loadFileDescriptorSetFromBuffer`.
- **MCP** richiede `@modelcontextprotocol/sdk`.

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

Se manca un pacchetto, il loader gRPC genera `GrpcDependencyMissingError` con il comando esatto di installazione. Un’installazione presente ma non funzionante genera `GrpcDependencyBrokenError`.

## Verifica

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

Entrambe le importazioni si risolvono dopo l’installazione del pacchetto.

## Passaggi successivi

- [Guida rapida](/docs/it-IT/openapi-request/quickstart/)
- [Configurazione](/docs/it-IT/openapi-request/configuration/)
