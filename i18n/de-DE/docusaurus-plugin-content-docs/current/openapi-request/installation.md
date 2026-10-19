---
sidebar_position: 2
title: "Installation"
description: "Installiere @powerduck/openapi-request, lerne die Protokoll-Unterpfade kennen und ergänze bei Bedarf gRPC- und MCP-Pakete."
---

# Installation

`@powerduck/openapi-request` enthält ESM- und CommonJS-Builds sowie TypeScript-Deklarationen. Erforderlich ist Node.js `>= 22.12.0`.

## Installation

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

Zusätzliche `@types/*`-Pakete sind nicht nötig.

## Paketstruktur und Unterpfad-Exporte

Der Standardeinstieg exportiert den Kern. Jedes Protokoll hat außerdem einen eigenen Unterpfad:

| Import | Inhalt |
|---|---|
| `@powerduck/openapi-request` | Kern: `createClient`, `createDebugger`, `createManualSession`, `AdapterRegistry`, `ProtoKitError`, OpenAPI-Helfer und Typen. |
| `@powerduck/openapi-request/http` | `HttpAdapter`, `SseParser`, Streaming-Erkennung sowie HTTP-Builder für Collections und Umgebungen (`buildCollection`, `buildEnvironment`, `resolveServerUrl`). |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`, `createWsManualSession` und Helfer für WebSocket-Konfiguration und Sitzungen. |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`, `GrpcAdapter`, `grpcCall`, `createGrpcManualSession` sowie Module für Erkennung, Reflection, Deskriptoren, Kataloge, Zugangsdaten, Laden und Vorlagen. |
| `@powerduck/openapi-request/mcp` | `McpAdapter`, `createMcpManualSession`, `createMcpStdioSession` sowie MCP-Module für Transport, Konfiguration, Erkennung und Generierung. |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`, `resolveGraphQLConfig`, `runGraphQL`, Introspection, Generierung von Operationen und Zurückschreiben von Änderungen. |

Ein Protokoll-Unterpfad importiert dessen Typen und Helfer, ohne die anderen Adapter erneut zu exportieren.

## Optionale Funktionspakete

gRPC und MCP bringen umfangreiche Abhängigkeiten mit. Sie werden **erst bei der ersten Verwendung geladen**; eine reine HTTP-Installation funktioniert ohne sie. Installiere sie nur für benötigte Protokolle:

- **gRPC** benötigt `@grpc/grpc-js` und `@grpc/proto-loader`. Server-Reflection erfordert außerdem `@grpc/proto-loader >= 0.7` für `loadFileDescriptorSetFromBuffer`.
- **MCP** benötigt `@modelcontextprotocol/sdk`.

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

Fehlt ein Paket, löst der gRPC-Loader `GrpcDependencyMissingError` mit dem genauen Installationsbefehl aus. Eine vorhandene, aber fehlerhafte Installation führt zu `GrpcDependencyBrokenError`.

## Prüfen

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

Nach der Installation lassen sich beide Imports auflösen.

## Nächste Schritte

- [Schnellstart](/docs/de-DE/openapi-request/quickstart/)
- [Konfiguration](/docs/de-DE/openapi-request/configuration/)
