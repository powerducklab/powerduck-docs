---
sidebar_position: 4
title: "Configuração"
description: "A configuração tem três camadas: opções de fábrica do cliente ou depurador, o objeto SendOptions passado a prepare() e send(), e opções por protocolo."
---

# Configuração

A configuração tem três camadas: opções de fábrica do cliente ou depurador, o objeto `SendOptions` passado a `prepare()` e `send()`, e opções por protocolo.

## Opções de fábrica

### `CreateClientOptions`

Passado a `createClient(options?)`. Todos os campos são opcionais.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | Controla como as respostas são mescladas à especificação |
| `response` | `ToResponseOptions` | Controla a normalização dos objetos de resposta |

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: {
    overwriteExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    includeExamples: false,
    // ... other ToResponseOptions
  },
});
```

### `DebuggerOptions`

Passado a `createDebugger(config?)`. Todos os campos são opcionais.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | Lista personalizada de adaptadores que substitui todos os padrões |
| `extraAdapters` | `ProtocolAdapter[]` | Adaptadores extras adicionados ao registro padrão |
| `writeBack` | `WriteBackOptions` | Opções de gravação de resultados |
| `response` | `ToResponseOptions` | Opções de normalização de respostas |
| `writeBackTruncated` | `boolean` | Grava o schema inferido de fluxos truncados; padrão: `true` |

```typescript
import { createDebugger, HttpAdapter, WebSocketAdapter } from "@powerduck/openapi-request";

// Use only HTTP and WebSocket adapters
const debugger1 = createDebugger({
  adapters: [new HttpAdapter(), new WebSocketAdapter()],
});

// Add a custom adapter to the defaults
const debugger2 = createDebugger({
  extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});
```

### Gravação de resultados e exemplos capturados

`WriteBackOptions` aceita `strategy` (`"merge"` ou `"replace"`, padrão `"merge"`), `keepExistingDescription` (padrão `true`), `allowedStatusCodes` (vazio significa todos), `protectComponentRefs` (padrão `true`), `overwriteExamples` (padrão `true`) e `requirePassingTests`. O fluxo de envio verifica os testes; chamar `writeBackResponse` diretamente não faz essa verificação.

`ToResponseOptions` aceita `includeExamples` (padrão `true`), `maxExampleChars` (padrão `4000`) e `maxEventPreviewChars` (padrão `200`). Desative a captura de exemplos ou revise-os antes de publicar: respostas reais podem conter credenciais ou dados pessoais.

O fluxo de envio normalmente retorna uma cópia modificada em `patchedSpec`; não altera o documento de entrada nem salva um arquivo. Defina `writeBack: false` por chamada para pular essa etapa. O objeto `writeBack` da fábrica configura a mesclagem; o booleano por chamada a ativa ou desativa.

## `SendOptions`

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

```typescript
// By operationId (recommended)
const result1 = await client.send({
  spec,
  target: { operationId: "getUserById" },
});

// By method + path
const result2 = await client.send({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

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

### `ScriptConfig`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | Scripts anteriores à requisição no nível da coleção |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | Scripts de testes no nível da coleção |
| `preRequest` | `ScriptSource \| ScriptSource[]` | Scripts anteriores à requisição individual |
| `test` | `ScriptSource \| ScriptSource[]` | Scripts de testes da requisição individual |
| `fromSpecExtensions` | `boolean` | Lê `x-postman-scripts` da especificação; padrão: `true` |
| `captureLastResponse` | `boolean` | Adiciona o auxiliar integrado que expõe a última resposta às requisições seguintes |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

Defina `scripts.fromSpecExtensions: false` se não quiser executar scripts embutidos em uma especificação importada. O padrão atual é `true`; não dependa de uma alteração futura.

## Opções por protocolo

### HTTP / SSE

HTTP é o adaptador padrão. Declarar `text/event-stream` indica intenção de SSE; a execução também classifica a resposta real quando os cabeçalhos chegam. `probeStreamingResponse()` é uma sondagem explícita separada, não um pré-requisito automático de cada chamada.

Requisições HTTP básicas não exigem configuração extra. Use `SendOptions.runner` para ajustes avançados de postman-runtime.

### WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
  // Manual-session options are distinct from SendOptions.websocket.
});
```

### MCP

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "mcp",
  endpoint: "https://api.example.com/mcp",
});
```

A sessão manual MCP padrão usa Streamable HTTP e `endpoint`. Para stdio, passe `kind: "mcp"`, `transport: "stdio"` e um `command` local com `args` opcionais; abrir a sessão inicia o processo configurado.

### gRPC

gRPC exige um endereço, uma fonte de descritores (arquivos `.proto` ou reflexão do servidor) e um serviço e método totalmente qualificados:

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "grpc",
  address: "localhost:50051",
  service: "powerduck.examples.Echo",
  method: "Echo",
  protoPaths: ["./echo.proto"],
});
```

As fábricas de sessão manual retornam uma sessão ainda não aberta. Chame `open()` antes de enviar e `close()` na limpeza. O exemplo gRPC exige um servidor local e um arquivo proto correspondentes; as opções de sessão manual não são o mesmo objeto que `SendOptions.grpc`.

## Exemplo completo

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const result = await client.send({
  spec: openApiDocument,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { verbose: "true" },
    header: { "X-Request-Id": "req-abc" },
    body: { name: "Alice", email: "alice@example.com" },
  },
  serverUrl: "https://api.staging.example.com",
  auth: { type: "bearer", token: "staging-token" },
  timeout: 10000,
  variables: {
    environment: "staging",
  },
});

console.log(result.response.status);
console.log(result.response.body);
console.log(result.response.headers);
```

## Próximos passos

- Consulte a [Referência da API](./api-reference.md) para todos os tipos exportados
- Veja os [Exemplos](./examples.md) específicos de cada protocolo
