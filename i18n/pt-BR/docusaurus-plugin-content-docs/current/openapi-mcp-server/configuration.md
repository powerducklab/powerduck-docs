---
sidebar_position: 4
title: "Configuração"
description: "Configuração completa de @powerduck/openapi-mcp-server: ServerConfig, SecurityContext, ExecutionContext, TransportMode e uniões de literais para fontes, estados, protocolos, níveis de log e codificações do corpo."
---

# Configuração

O objeto central de configuração é `ServerConfig`, aceito por `startAdminServer()`. Os tipos de contexto relacionados são usados na execução das ferramentas.

## `ServerConfig`

Apenas `port` é obrigatório.

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `port` | `number` | — (obrigatório) | Porta TCP de escuta, inteiro de 0 a 65535. |
| `host` | `string` | `"127.0.0.1"` | Interface de escuta; loopback por padrão para evitar exposição acidental. |
| `apiKey` | `string` | undefined | Segredo compartilhado exigido pela API de administração e pelo transporte HTTP quando configurado. |
| `specPath` | `string` | undefined | Especificação carregada uma vez na inicialização. |
| `baseUrlOverride` | `string` | undefined | Substitui a URL base do serviço de destino derivada de `servers[0].url`. |
| `upstreamHeaders` | `Record<string, string>` | undefined | Cabeçalhos adicionados a todas as requisições ao serviço de destino. |
| `requestTimeoutMs` | `number` | undefined | Tempo limite por requisição ao serviço de destino, em milissegundos. |
| `persistState` | `boolean` | `true` | Mantém a especificação carregada entre reinicializações. |
| `stateFilePath` | `string` | undefined | Localização do arquivo de estado persistente. |
| `allowedOrigins` | `string[]` | undefined | Origens CORS permitidas; vazio ou omitido desativa o acesso entre origens. |
| `allowedHosts` | `string[]` | undefined | Valores permitidos do cabeçalho `Host`. |
| `maxLogEntries` | `number` | 200 | Número máximo de entradas de log mantidas na memória. |
| `redactSensitiveHeaders` | `boolean` | `true` | Oculta valores de cabeçalhos sensíveis antes de registrá-los. |
| `redactHeaderNames` | `string[]` | undefined | Nomes de cabeçalhos adicionais a ocultar, além da lista interna. |
| `security` | `SecurityContext` | undefined | Credenciais encaminhadas à API de destino em cada chamada de ferramenta. |

## `SecurityContext`

| Campo | Tipo | Enviado como |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | Pares exatos de nome de cabeçalho e valor. |

As credenciais são inseridas pelo executor e nunca expostas ao modelo como argumentos de ferramentas.

## `ExecutionContext`

Contexto por chamada passado a `executeToolCall` e retornado por um `ContextProvider`:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `baseUrlOverride` | `string` | Substitui a URL do servidor da especificação nesta chamada. |
| `upstreamHeaders` | `Record<string, string>` | Cabeçalhos adicionais para o serviço de destino. |
| `requestTimeoutMs` | `number` | Tempo limite por chamada, com mínimo de 1 segundo. |
| `security` | `SecurityContext` | Credenciais para esta chamada. |
| `correlationId` | `string` | Relaciona as entradas de log de uma mesma invocação. |
| `protocol` | `ProtocolHint` | Transporte que iniciou a chamada. |
| `onLog` | `(entry) => void` | Recebe logs de requisições e respostas; nunca deve lançar exceções. |
| `signal` | `AbortSignal` | Cancela uma requisição em andamento ao serviço de destino. |

## Uniões de literais e funções de verificação

| União | Valores | Função de verificação |
| --- | --- | --- |
| `TransportMode` | `"stdio" \| "web"` | — |
| `SpecSource` | `"startup-file" \| "upload" \| "paste" \| "runtime"` | `isSpecSource()` |
| `ServiceStatus` | `"running" \| "stopped" \| "error"` | `isServiceStatus()` |
| `ProtocolHint` | `"streamable-http" \| "sse" \| "stdio"` | `isProtocolHint()` |
| `LogDirection` | `"request" \| "response" \| "internal"` | — |
| `LogLevel` | `"debug" \| "info" \| "warn" \| "error"` | — |
| `ParameterLocation` | `"path" \| "query" \| "header" \| "cookie"` | `isParameterLocation()` |
| `BodyEncoding` | `"json" \| "form-urlencoded" \| "multipart" \| "text" \| "binary"` | `isBodyEncoding()` |

## `BuildMcpServerOptions`

Passado como terceiro argumento de `buildMcpServer()`:

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | Indicação de protocolo anunciada. |
| `name` | `string` | `"openapi-mcp"` | Nome do servidor anunciado. |
| `version` | `string` | `"1.1.0"` | Versão do servidor anunciada. |
| `pageSize` | `number` | 100 | Máximo de entradas por resposta de lista, limitado a 500. |
| `instructions` | `string` | integrado | Orientação de uso exposta por MCP `instructions`. |

## Opções da camada de transporte (`AttachMcpRoutesOptions`)

Importe `attachMcpRoutes` de `@powerduck/openapi-mcp-server` e passe um objeto de opções como segundo argumento. O wrapper legado `attachSseRoutes()` aceita apenas os argumentos posicionais `(app, specProvider, contextProvider, routeGuard?)`.

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | — (obrigatório) | Fornece o documento para novas sessões. |
| `contextProvider` | `ContextProvider` | — (obrigatório) | Fornece o contexto do serviço de destino para cada chamada. |
| `routeGuard` | `RequestHandler` | undefined | Middleware aplicado a todas as rotas MCP. |
| `maxSessions` | `number` | 64 | Limite de sessões simultâneas. |
| `sessionIdleMs` | `number` | 600000 | Tempo limite de inatividade em milissegundos; 0 o desativa. |
| `allowedOrigins` | `string[]` | undefined | Origens permitidas; uma lista não vazia ativa a proteção contra DNS rebinding. |
| `allowedHosts` | `string[]` | undefined | Valores permitidos do cabeçalho `Host`. |
| `enableLegacySse` | `boolean` | `true` | Monta o transporte HTTP+SSE descontinuado. |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | Recebe eventos do ciclo de vida; nunca deve lançar exceções. |

> Estas são opções de `attachMcpRoutes`, não campos adicionais de `ServerConfig`. O servidor de administração encaminha as configurações de origens e hosts, mas usa o limite de sessões e o tempo de inatividade padrão do transporte. Para personalizar esses limites, use diretamente a função pública de transporte.

## Veja também

- [Referência da API](../api-reference/)
- [Exemplos](../examples/)
