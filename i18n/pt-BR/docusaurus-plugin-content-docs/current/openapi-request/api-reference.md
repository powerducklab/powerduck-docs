---
sidebar_position: 5
title: "Referência da API"
description: "Referência das principais APIs de integração de @powerduck/openapi-request"
---

# Referência da API

Referência das principais APIs de integração de `@powerduck/openapi-request`. As tabelas resumem os contratos; as declarações TypeScript do pacote contêm todas as sobrecargas e os parâmetros opcionais. O ponto de entrada principal e os subcaminhos de protocolo não exportam exatamente os mesmos elementos.

## APIs principais

### `createClient(options?): ProtoClient`

Cria o cliente voltado a interfaces de usuário. O argumento `options` é opcional.

**Parâmetros:**

| Nome | Tipo | Descrição |
| --- | --- | --- |
| `options` | `CreateClientOptions` | Configuração opcional |
| `options.writeBack` | `WriteBackOptions` | Controla como as respostas são mescladas à especificação |
| `options.response` | `ToResponseOptions` | Controla a normalização dos objetos de resposta |

**Retorna:** um `ProtoClient` com os seguintes métodos:

| Método | Assinatura | Descrição |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | Planeja uma requisição e retorna o protocolo, o modo de exibição e o tipo de fluxo |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | Executa uma requisição |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | Executa um lote com resultados por destino; falhas não descartam os demais resultados |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | Cria uma sessão websocket/mcp/grpc ainda não aberta; chame `open()` para conectar |
| `discover` | `(discoverOptions) => Promise<any>` | Descobre os recursos de MCP e gRPC |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | Mescla a resposta observada no documento |
| `dispose` | `() => void` | Atualmente não executa nenhuma ação; quem chama deve fechar suas sessões |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | Executa uma requisição fetch e classifica a resposta; consuma ou cancele o corpo retornado |

**Exemplo:**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
});
```

### `createDebugger(config?): ProtoKit`

Cria o depurador programável para automação, scripts e CI.

**Parâmetros:**

| Nome | Tipo | Descrição |
| --- | --- | --- |
| `config` | `DebuggerOptions` | Configuração opcional |
| `config.adapters` | `ProtocolAdapter[]` | Lista de adaptadores personalizados que substitui os padrões |
| `config.extraAdapters` | `ProtocolAdapter[]` | Adaptadores adicionais aos padrões |
| `config.writeBack` | `WriteBackOptions` | Opções de gravação de resultados |
| `config.response` | `ToResponseOptions` | Opções de normalização de respostas |
| `config.writeBackTruncated` | `boolean` | Grava o esquema inferido de fluxos truncados (padrão: true) |

**Retorna:** um `ProtoKit` com `prepare`, `send`, `sendMany`, `toCollection` e outros métodos.

**Exemplo:**

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const dbg = createDebugger({
  writeBackTruncated: true,
});

const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

### `createManualSession(options): AnyManualSession`

Cria uma sessão duplex de longa duração para WebSocket, MCP ou gRPC. A função de criação não realiza E/S; a conexão é aberta com `open()`.

**Parâmetros:**

| Nome | Tipo | Descrição |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | Protocolo a usar |
| `options.url` | `string` | URL de conexão WebSocket |
| `options.endpoint` | `string` | Endpoint MCP Streamable HTTP |
| `options.transport` | `"streamable-http" \| "stdio"` | Transporte MCP; o padrão é Streamable HTTP |
| `options.command`, `options.args` | `string`, `string[]` | Executável local e argumentos para MCP stdio |
| `options.address`, `options.service`, `options.method` | `string` | Endereço gRPC, nome completo do serviço e método |

Para gRPC, forneça também uma fonte de descritores por `protoPaths` ou `reflection`. As opções por protocolo estão em [Configuração](./configuration.md).

**Retorna:** uma sessão com `open()`, `send()`, `close()`, `onEvent()`, `waitForClose()`, `events` e `state`. `onEvent()` retorna uma inscrição com `unsubscribe()`.

**Exemplo:**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

const subscription = session.onEvent((event) => {
  console.log(event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "message", data: "hello" });
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

### `AdapterRegistry`

Registro de instâncias de `ProtocolAdapter`. Um novo registro começa vazio; `createDebugger()` registra os adaptadores HTTP, WebSocket, gRPC, MCP e GraphQL integrados, salvo se uma lista personalizada os substituir. Use `register()`, `unregister()`, `get()`, `list()`, `rank()` e `resolve()` para gerenciar a seleção.

### `ProtoKitError`

Erro tipado lançado pelo depurador e pelos fluxos principais. Use `instanceof ProtoKitError` para distinguir erros da biblioteca de falhas inesperadas.

## Tipos principais

### `SendOptions`

Objeto de entrada principal de `prepare()` e `send()`. Recebe a especificação, o alvo, os valores e toda a configuração da requisição.

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | Sim | Documento OpenAPI 3.2 completo |
| `target` | `OperationTarget` | Sim | Identificador da operação, explicado abaixo |
| `values` | `RequestValues` | Não | Valores concretos para path/query/header/cookie/body |
| `serverUrl` | `string` | Não | Substitui `spec.servers[0].url` |
| `serverVariables` | `Record<string, string>` | Não | Variáveis do modelo de URL do servidor |
| `variables` | `Record<string, string>` | Não | Variáveis de ambiente referenciadas como `{{name}}` |
| `globals` | `Record<string, string>` | Não | Variáveis globais no estilo Postman |
| `localVariables` | `Record<string, string>` | Não | Variáveis locais |
| `collectionVariables` | `Record<string, string>` | Não | Variáveis de coleção |
| `auth` | `AuthConfig` | Não | Configuração de autenticação |
| `scripts` | `ScriptConfig` | Não | Scripts anteriores à requisição e de testes |
| `runner` | `RuntimeRunOptions` | Não | Repasse completo das opções postman-runtime, com prioridade máxima |
| `websocket` | `WebSocketOptions` | Não | Opções de WebSocket |
| `graphql` | `GraphQLOptions` | Não | Opções de GraphQL |
| `mcp` | `McpOptions` | Não | Opções de MCP |
| `grpc` | `any` | Não | Opções de gRPC |
| `timeout` | `number` | Não | Tempo limite por requisição em ms, atalho para `runner.timeout.request` |

`SendOptions` também aceita estes controles de execução e streaming:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `fetch` | `typeof fetch` | Transporte fetch isolado fornecido pelo host quando suportado; HTTP/SSE continuam usando postman-runtime. |
| `writeBack` | `boolean` | Definir `false` deixa `patchedSpec` indefinido, mas ainda produz `responseFragment`. |
| `signal` | `AbortSignal` | Cancela a execução ou amostragem; um resultado parcial ainda pode ser retornado. |
| `maxEvents` | `number` | Máximo de eventos de streaming retidos. |
| `maxStreamMs` | `number` | Duração máxima da amostragem do fluxo em milissegundos. |
| `maxResponseSize` | `number` | Limite de bytes da resposta. |
| `maxBufferChars` | `number` | Limite do buffer SSE antes de um delimitador de evento; padrão: `4194304` caracteres. |
| `maxEventChars` | `number` | Limite de dados retidos por evento SSE; padrão: `1048576` caracteres. |
| `inheritEventId` | `boolean` | Herda o último ID de evento SSE quando ausente; padrão: `true`. Defina `false` para uma inferência de schema mais rigorosa. |
| `onEvent` | `(event: StreamEvent) => void` | Recebe eventos do fluxo. |
| `onConsole` | `(log: ConsoleLog) => void` | Recebe a saída de console dos scripts. |
| `onAssertion` | `(assertion: AssertionResult) => void` | Recebe resultados de asserções. |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | Inspeciona os primeiros cabeçalhos HTTP/SSE e a classificação `streaming`. |
| `onOpen` | `(info) => void` | Recebe detalhes da conexão WebSocket: URL, protocolo e cabeçalhos. |

Adaptadores podem interpretar os limites de formas diferentes. Mantenha leves os callbacks de interface; a camada de execução captura suas exceções. Para configurar o requester HTTP, use `runner.requester`; seu `maxResponseSize`, quando informado, deve ser positivo, não zero.

### `OperationTarget`

Identifica uma operação. Prefira `operationId` ou `method` + `path`. Se ambos forem fornecidos, `operationId` tem prioridade.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `operationId` | `string` | Chave alternativa de busca, com prioridade sobre caminho e método |
| `method` | `string` | Método HTTP sem distinção entre maiúsculas e minúsculas. Exige `path`. |
| `path` | `string` | Caminho parametrizado, como `/users/{id}`. Exige `method`. |

### `RequestValues`

Valores concretos injetados na requisição gerada.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | Valores de parâmetros de caminho |
| `query` | `Record<string, unknown>` | Valores de parâmetros de consulta |
| `header` | `Record<string, unknown>` | Valores de cabeçalhos |
| `cookie` | `Record<string, unknown>` | Valores de cookies |
| `querystring` | `string` | Query string bruta e já codificada, para a localização `querystring` do OpenAPI 3.2 |
| `body` | `unknown` | Corpo da requisição |
| `contentType` | `string` | Força um tipo de mídia quando a operação declara vários |

```typescript
const result = await client.send({
  spec,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { version: "2" },
    header: { "X-Request-Id": "abc-123" },
    body: { name: "Alice", email: "alice@example.com" },
    contentType: "application/json",
  },
});
```

### `AuthConfig`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | Tipo de autenticação |
| `token` | `string` | Token Bearer para `type: "bearer"` |
| `username` | `string` | Usuário Basic para `type: "basic"` |
| `password` | `string` | Senha Basic para `type: "basic"` |
| `key` | `string` | Nome da chave API para `type: "apikey"` |
| `value` | `string` | Valor da chave API para `type: "apikey"` |
| `in` | `"header" \| "query"` | Localização da chave API para `type: "apikey"` |

```typescript
// Bearer token
const result1 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "bearer", token: "your-jwt-token" },
});

// Basic auth
const result2 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "basic", username: "admin", password: "secret" },
});

// API key in header
const result3 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "apikey", key: "X-API-Key", value: "key-123", in: "header" },
});
```

Os tipos avançados são `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` e `edgegrid`. Passe os campos auxiliares Postman de HTTP/SSE/GraphQL por `parameters: Record<string, string | boolean | number>`. A opção `oauth2: OAuth2FlowConfig` ativa a obtenção e renovação de tokens OAuth 2.0; não presuma que todo mecanismo funciona com todos os protocolos.

### `PreparedRequest`

Retornado por `createClient().prepare()`. O depurador oferece outro resultado de planejamento: `createDebugger().prepare()` retorna um `PlanResult` com `located`, `adapter` e `plan`.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `protocol` | `string` | Protocolo resolvido (http, websocket, grpc, graphql, mcp) |
| `transport` | `string` | Transporte resolvido |
| `target` | `OperationTarget` | Destino original |
| `operation` | `any` | Objeto de operação OpenAPI resolvido |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | Classificação do fluxo (veja abaixo) |
| `stream.expected` | `boolean` | Indica se streaming é esperado |
| `openapi.extensions` | `Record<string, unknown>` | Extensões OpenAPI resolvidas |
| `warnings` | `string[]` | Avisos encontrados durante o planejamento |

### `StreamKind`

Classificação precisa dos fluxos: `"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## Funções auxiliares OpenAPI

| Exportação | Assinatura | Descrição |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | Resolve uma operação por `OperationTarget` |
| `inferSchema` | `(value) => Schema` | Infere um JSON Schema a partir de um único valor observado |
| `inferSchemaFromMany` | `(values) => Schema` | Infere um esquema que abrange vários valores observados |
| `mergeSchema` | `(a, b) => Schema` | Mescla dois esquemas inferidos (união ou combinação) |
| `sampleFromSchema` | `(schema) => unknown` | Produz um valor de exemplo realista para um esquema |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | Constrói um objeto de resposta OpenAPI a partir de um resultado observado |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | Mescla uma resposta observada no documento |

Tipos exportados: `LocatedOperation`, `WriteBackOptions`, `ToResponseOptions`.

## HTTP / SSE

Os nomes abaixo estão disponíveis no ponto de entrada principal. O subcaminho `@powerduck/openapi-request/http` exporta `HttpAdapter`, `SseParser`, `buildCollection`, `buildEnvironment`, `resolveServerUrl`, `buildRunOptions` e `runWithPostman`; importe as funções de detecção e `BUILTIN_CAPTURE_TEST` pelo ponto de entrada principal.

| Exportação | Descrição |
| --- | --- |
| `HttpAdapter` | Adaptador de protocolo padrão para HTTP/HTTPS |
| `SseParser` | Parser de streaming que transforma um fluxo de bytes SSE em eventos estruturados |
| `isStreamingOperation` | Classifica uma operação como streaming pelos tipos de conteúdo declarados |
| `isSseContentType` | Verifica se um tipo de conteúdo indica SSE |
| `isStreamingContentType` | Verifica se um tipo de conteúdo indica streaming |
| `acceptHeaderFor` | Gera o cabeçalho Accept adequado para uma operação |
| `probeStreamingResponse` | Executa uma requisição fetch e classifica a resposta; consuma ou cancele o corpo retornado |
| `BUILTIN_CAPTURE_TEST` | Script de teste Postman integrado para capturar a última resposta |

## WebSocket

Importe de `@powerduck/openapi-request/ws`.

| Exportação | Descrição |
| --- | --- |
| `WebSocketAdapter` | Adaptador de protocolo para destinos WebSocket |
| `createWsManualSession` | Cria uma sessão WebSocket manual duplex, também disponível como `runWebSocketSession` e `wsManualSession` |

## GraphQL

Importe de `@powerduck/openapi-request/graphql`.

| Exportação | Descrição |
| --- | --- |
| `GraphQLAdapter` | Adaptador de protocolo para destinos GraphQL |
| `resolveGraphQLConfig` | Resolve a configuração GraphQL de uma operação |
| `runGraphQL` | Executa uma operação GraphQL |
| `introspectSchema` | Obtém por introspecção o esquema de um endpoint GraphQL |
| `INTROSPECTION_QUERY` | Consulta padrão de introspecção GraphQL |
| `generateOperation` | Gera um documento de consulta a partir de um esquema GraphQL obtido por introspecção e de um campo |
| `generateAllOperations` | Gera documentos de consulta para os campos de um esquema GraphQL obtido por introspecção |
| `writeGraphQLOperations` | Grava as operações GraphQL geradas na especificação |
| `discoverAndWriteGraphQLSchema` | Descobre um esquema GraphQL e o grava na especificação |

## MCP (Model Context Protocol)

A maioria dos itens abaixo está disponível em `@powerduck/openapi-request/mcp`. Importe `initializeMcpSession` pelo ponto de entrada principal; no subcaminho, o nome é `initializeSession`. O subcaminho também expõe `runMcp`, `createMcpSessionCore` e `createMcpStdioConnection`.

| Exportação | Descrição |
| --- | --- |
| `McpAdapter` | Adaptador de protocolo para destinos MCP |
| `createMcpManualSession` | Cria uma sessão MCP manual, também disponível como `mcpManualSession` |
| `createMcpStdioSession` | Cria uma sessão MCP por stdio |
| `runMcpManualSession` | Obsoleto: use `createMcpManualSession` |
| `resolveMcpConfig` | Resolve a configuração MCP de uma operação |
| `initializeMcpSession` | Inicializa uma sessão MCP (alias de `initializeSession`) |
| `discoverMcpCapabilities` | Descobre os recursos do servidor MCP |
| `MCP_PROTOCOL_VERSION` | Versão compatível do protocolo MCP |
| `generateMcpCall` | Gera uma chamada de ferramenta MCP |
| `generateAllMcpCalls` | Gera todas as chamadas de ferramentas MCP |
| `writeMcpOperations` | Grava as operações MCP na especificação |
| `discoverAndWriteMcpCapabilities` | Descobre os recursos MCP e os grava na especificação |
| `createHttpMcpTransport` | Cria um transporte HTTP para MCP |
| `createStdioMcpTransport` | Cria um transporte stdio para MCP |

## gRPC

Importe as funções de baixo nível para descoberta, chamadas e descritores de `@powerduck/openapi-request/grpc`. Importe `GrpcProtocolAdapter`, `createGrpcManualSession`, `grpcManualSession`, `grpcDiscover` e `discoverGrpc` pelo ponto de entrada principal; o subcaminho usa `discover` para descoberta. Ele também oferece `discoverFromCatalog`, `describeMethod` e `describeFromCatalog`, permitindo reutilizar um catálogo sem repetir a reflexão para cada método.

| Exportação | Descrição |
| --- | --- |
| `GrpcProtocolAdapter` | Adaptador de protocolo gRPC voltado a OpenAPI |
| `GrpcAdapter` | Adaptador gRPC de baixo nível |
| `grpcDiscover` / `discoverGrpc` | Descobre serviços e métodos gRPC |
| `createGrpcManualSession` / `grpcManualSession` | Cria uma sessão gRPC manual |
| `grpcCall` | Executa uma chamada gRPC |
| `resolveMethod` | Resolve um descritor de método gRPC |
| `buildMessageTemplate` | Cria um modelo de mensagem a partir de um descritor |
| `buildCatalog` | Cria um catálogo de serviços e métodos |
| `LOADER_OPTIONS` | Opções padrão do carregador proto |
| `scanProtoFiles` | Procura arquivos proto em diretórios |
| `deriveIncludeDirsDetailed` | Deriva os diretórios de inclusão dos caminhos de arquivos proto |
| `fetchDescriptorSet` | Obtém um conjunto de descritores por reflexão gRPC |
| `fetchFullDescriptorSet` | Obtém um conjunto completo de descritores com todas as dependências |
| `listServices` | Lista os serviços de um conjunto de descritores |
| `listServicesDetailed` | Lista os serviços com informações detalhadas dos métodos |
| `serializeDescriptorSet` | Serializa um conjunto de descritores em bytes |
| `decodeFileDescriptorProto` | Decodifica um proto de descritor de arquivo |
| `decodeFileDescriptorSet` | Decodifica um conjunto de descritores de arquivos |
| `buildCredentials` | Cria credenciais gRPC de forma síncrona |
| `buildCredentialsAsync` | Cria credenciais gRPC de forma assíncrona |
| `buildCredentialsChecked` | Cria e valida credenciais de forma síncrona |
| `buildCredentialsCheckedAsync` | Cria e valida credenciais de forma assíncrona |
| `loadGrpc` | Carrega dinamicamente o pacote `@grpc/grpc-js` |
| `isGrpcAvailable` | Verifica se as dependências gRPC estão disponíveis |
| `requireCapability` | Exige um recurso gRPC específico e lança erro se ele estiver indisponível |

O ponto de entrada principal exporta os aliases de tipo `GrpcDiscoveryResult`, `GrpcDiscoveredMethod` e `GrpcDiscoveredService`. No subcaminho gRPC, os nomes são `DiscoveryResult`, `DiscoveredMethod` e `DiscoveredService`.

Tipos de erro: `ReflectionProtocolError`, `ReflectionUnavailableError`, `DescriptorDecodeError`, `GrpcDependencyBrokenError`, `GrpcDependencyMissingError`.

## Outros utilitários

O ponto de entrada principal também exporta as funções OAuth 2.0 `resolveOAuth2Token`, `acquireOAuth2Token`, `isOAuth2TokenExpired`, `oauth2RefreshStatuses` e `authFromOAuth2Token`, o utilitário de cópia `toCloneable`, a classe base `UnifiedSession` e as funções de gravação gRPC `writeGrpcOperations` e `discoverAndWriteGrpcOperations`.

## Exportações por subcaminho

```typescript
// Main integration entry
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```
