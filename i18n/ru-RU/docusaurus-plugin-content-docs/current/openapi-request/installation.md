---
sidebar_position: 2
title: "Установка"
description: "Установите @powerduck/openapi-request, изучите подпути протоколов и дополнительные пакеты для gRPC и MCP."
---

# Установка

`@powerduck/openapi-request` содержит сборки ESM и CommonJS с декларациями TypeScript. Требуется Node.js `>= 22.12.0`.

## Установка

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

Дополнительные пакеты `@types/*` не нужны.

## Структура пакета и экспорты подпутей

Основной вход экспортирует ядро. Для каждого протокола также предусмотрен отдельный подпуть:

| Импорт | Содержимое |
|---|---|
| `@powerduck/openapi-request` | Ядро: `createClient`, `createDebugger`, `createManualSession`, `AdapterRegistry`, `ProtoKitError`, вспомогательные средства OpenAPI и типы. |
| `@powerduck/openapi-request/http` | `HttpAdapter`, `SseParser`, обнаружение потоков и HTTP-построители коллекций и окружений (`buildCollection`, `buildEnvironment`, `resolveServerUrl`). |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`, `createWsManualSession`, средства настройки и управления сессиями WebSocket. |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`, `GrpcAdapter`, `grpcCall`, `createGrpcManualSession`, модули обнаружения, рефлексии, дескрипторов, каталога, учётных данных, загрузки и шаблонов. |
| `@powerduck/openapi-request/mcp` | `McpAdapter`, `createMcpManualSession`, `createMcpStdioSession`, модули транспорта, настройки, обнаружения и генерации MCP. |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`, `resolveGraphQLConfig`, `runGraphQL`, интроспекция, генерация операций и запись изменений обратно. |

Импорт подпути подключает типы и вспомогательные средства соответствующего протокола, не реэкспортируя остальные адаптеры.

## Дополнительные пакеты возможностей

У gRPC и MCP крупные зависимости. Они **загружаются при первом использовании**, поэтому установка только для HTTP работает без них. Добавляйте их лишь для нужных протоколов:

- **gRPC** требует `@grpc/grpc-js` и `@grpc/proto-loader`. Для рефлексии сервера также нужен `@grpc/proto-loader >= 0.7`, предоставляющий `loadFileDescriptorSetFromBuffer`.
- **MCP** требует `@modelcontextprotocol/sdk`.

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

Если пакет отсутствует, загрузчик gRPC выбрасывает `GrpcDependencyMissingError` с точной командой установки. Если пакет установлен, но неисправен, возникает `GrpcDependencyBrokenError`.

## Проверка

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

После установки оба импорта разрешаются успешно.

## Следующие шаги

- [Быстрый старт](/docs/ru-RU/openapi-request/quickstart/)
- [Настройка](/docs/ru-RU/openapi-request/configuration/)
