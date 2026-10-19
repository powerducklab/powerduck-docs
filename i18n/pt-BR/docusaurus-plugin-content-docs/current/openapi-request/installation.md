---
sidebar_position: 2
title: "Instalação"
description: "Instale @powerduck/openapi-request, conheça os subcaminhos por protocolo e adicione os pacotes opcionais para gRPC e MCP."
---

# Instalação

`@powerduck/openapi-request` inclui builds ESM e CommonJS com declarações TypeScript. Requer Node.js `>= 22.12.0`.

## Instalação

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

Não são necessários pacotes `@types/*` adicionais.

## Estrutura do pacote e exportações de subcaminhos

A entrada padrão exporta o núcleo. Cada protocolo também tem seu próprio subcaminho:

| Importação | Conteúdo |
|---|---|
| `@powerduck/openapi-request` | Núcleo: `createClient`, `createDebugger`, `createManualSession`, `AdapterRegistry`, `ProtoKitError`, utilitários OpenAPI e tipos. |
| `@powerduck/openapi-request/http` | `HttpAdapter`, `SseParser`, detecção de streaming e construtores HTTP de coleções e ambientes (`buildCollection`, `buildEnvironment`, `resolveServerUrl`). |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`, `createWsManualSession` e utilitários de configuração e sessões WebSocket. |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`, `GrpcAdapter`, `grpcCall`, `createGrpcManualSession` e módulos de descoberta, reflexão, descritores, catálogo, credenciais, carregamento e templates. |
| `@powerduck/openapi-request/mcp` | `McpAdapter`, `createMcpManualSession`, `createMcpStdioSession` e módulos de transporte, configuração, descoberta e geração MCP. |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`, `resolveGraphQLConfig`, `runGraphQL`, introspecção, geração de operações e gravação das alterações. |

Importar um subcaminho traz os tipos e utilitários daquele protocolo sem reexportar os adaptadores não relacionados.

## Pacotes opcionais por capacidade

gRPC e MCP têm dependências pesadas, **carregadas apenas no primeiro uso**. Uma instalação somente HTTP funciona sem elas. Instale-as apenas quando precisar do protocolo:

- **gRPC** requer `@grpc/grpc-js` e `@grpc/proto-loader`. A reflexão do servidor também exige `@grpc/proto-loader >= 0.7` para `loadFileDescriptorSetFromBuffer`.
- **MCP** requer `@modelcontextprotocol/sdk`.

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

Se faltar um pacote, o carregador gRPC lança `GrpcDependencyMissingError` com o comando exato de instalação. Se estiver instalado, mas com defeito, lança `GrpcDependencyBrokenError`.

## Verificação

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

As duas importações são resolvidas após instalar o pacote.

## Próximos passos

- [Início rápido](/docs/pt-BR/openapi-request/quickstart/)
- [Configuração](/docs/pt-BR/openapi-request/configuration/)
