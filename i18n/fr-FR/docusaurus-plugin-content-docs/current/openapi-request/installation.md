---
sidebar_position: 2
title: "Installation"
description: "Installez @powerduck/openapi-request, découvrez ses sous-chemins par protocole et ajoutez les paquets facultatifs pour gRPC et MCP."
---

# Installation

`@powerduck/openapi-request` fournit des versions ESM et CommonJS avec les déclarations TypeScript. Node.js `>= 22.12.0` est requis.

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

Aucun paquet `@types/*` supplémentaire n’est nécessaire.

## Structure du paquet et sous-chemins d’export

L’entrée par défaut exporte le noyau. Chaque protocole dispose aussi de son propre sous-chemin :

| Import | Contenu |
|---|---|
| `@powerduck/openapi-request` | Noyau : `createClient`, `createDebugger`, `createManualSession`, `AdapterRegistry`, `ProtoKitError`, utilitaires OpenAPI et types. |
| `@powerduck/openapi-request/http` | `HttpAdapter`, `SseParser`, détection des flux et constructeurs HTTP de collections et d’environnements (`buildCollection`, `buildEnvironment`, `resolveServerUrl`). |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`, `createWsManualSession` et utilitaires de configuration et de session WebSocket. |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`, `GrpcAdapter`, `grpcCall`, `createGrpcManualSession` et modules de découverte, réflexion, descripteurs, catalogue, identifiants, chargement et modèles. |
| `@powerduck/openapi-request/mcp` | `McpAdapter`, `createMcpManualSession`, `createMcpStdioSession` et modules de transport, configuration, découverte et génération MCP. |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`, `resolveGraphQLConfig`, `runGraphQL`, introspection, génération d’opérations et réécriture des modifications. |

Importer un sous-chemin charge les types et utilitaires du protocole concerné, sans réexporter les autres adaptateurs.

## Paquets facultatifs par fonctionnalité

gRPC et MCP ont des dépendances volumineuses, **chargées à la première utilisation**. Une installation limitée à HTTP fonctionne sans elles. Installez-les uniquement pour les protocoles nécessaires :

- **gRPC** nécessite `@grpc/grpc-js` et `@grpc/proto-loader`. La réflexion du serveur exige aussi `@grpc/proto-loader >= 0.7` pour `loadFileDescriptorSetFromBuffer`.
- **MCP** nécessite `@modelcontextprotocol/sdk`.

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

Si une dépendance manque, le chargeur gRPC lève `GrpcDependencyMissingError` avec la commande d’installation exacte. Si elle est présente mais défectueuse, il lève `GrpcDependencyBrokenError`.

## Vérification

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

Les deux imports se résolvent une fois le paquet installé.

## Pour aller plus loin

- [Démarrage rapide](/docs/fr-FR/openapi-request/quickstart/)
- [Configuration](/docs/fr-FR/openapi-request/configuration/)
