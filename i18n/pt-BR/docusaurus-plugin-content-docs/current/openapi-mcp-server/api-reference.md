---
sidebar_position: 5
title: "Referência da API"
description: "Referência completa de @powerduck/openapi-mcp-server: carregamento de especificações, geração de ferramentas, prompts e recursos, criação e execução de requisições, servidor MCP, transportes, administração, autenticação, registro de serviços e CLI."
---

# Referência da API

Todas as exportações públicas de `@powerduck/openapi-mcp-server`, agrupadas por área.

## Carregamento de especificações

| Exportação | Assinatura | Descrição |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | Lê um arquivo JSON ou YAML, valida, resolve referências e verifica a unicidade dos IDs de operação. YAML é detectado pela extensão `.ya?ml`. |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | Analisa um documento a partir de uma string. Lança uma exceção se a entrada estiver vazia ou for inválida. |

## Geração de ferramentas

| Exportação | Assinatura | Descrição |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | Gera definições MCP `Tool` para cada operação. |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | Retorna `{ tools, bindings, issues }`. |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | Associa os nomes das ferramentas geradas ao respectivo `ToolBinding`; alias de `getBindingIndex`. |

Tipos exportados: `ToolBinding`, `GeneratedToolWithBinding` (alias de `GeneratedTool` no pacote).

## Prompts e recursos

| Exportação | Assinatura | Descrição |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | Lista todos os prompts gerados. |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | Resolve um prompt pelo nome; retorna `null` se for desconhecido. |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | Lista os recursos do catálogo. |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | Lê um recurso pela URI. |

## Criação e execução de requisições

| Exportação | Assinatura | Descrição |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | Serializa os argumentos em `{ url, query, headers, body, dropped }`. Argumentos posicionais. |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | Executa uma ferramenta gerada na API de destino. Respostas não-2xx são retornadas como dados; falhas de transporte lançam exceções. |

Campos de `ToolCallResult`: `status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`.

## Utilitários de especificação

| Exportação | Descrição |
| --- | --- |
| `iterateOperations(spec, issues?)` | Gerador que produz todas as operações resolvidas, incluindo `additionalOperations` do OpenAPI 3.2. |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | Combina parâmetros do item de caminho e da operação pela chave `(name, in)`. |
| `normalizeParameter(candidate)` | Normaliza um parâmetro bruto; retorna `null` se não puder ser usado. |
| `synthesizeOperationId(method, pathTemplate)` | ID alternativo determinístico quando uma operação omite `operationId`. |
| `ensureUniqueName(candidate, taken)` | Acrescenta um sufixo numérico para manter o nome único. |
| `extractPathTemplateVariables(pathTemplate)` | Extrai variáveis `{name}`, removendo duplicatas e preservando a primeira ocorrência. |
| `effectiveStyle(parameter)` | Aplica o valor padrão de `style` da especificação. |
| `effectiveExplode(parameter)` | Aplica o valor padrão de `explode` da especificação. |
| `findOperationById(spec, operationId)` | Busca O(1) após a primeira construção; retorna `null` se não encontrado. |
| `findDuplicateOperationIds(spec)` | Informa IDs duplicados declarados pelo autor. |
| `assertUniqueOperationIds(spec)` | Lança uma exceção para IDs de operação duplicados. |
| `isPlainObject(value)` | Restringe o tipo a um objeto simples. |
| `truncateGeneratedName(name, limit=64)` | Encurta um nome preservando sua unicidade. |

Tipos exportados: `OperationEntry`, `DuplicateOperationId`.

## Servidor MCP e transportes

| Exportação | Descrição |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | Cria um `Server` do SDK com os handlers de ferramentas, prompts e recursos. Argumentos posicionais. |
| `startStdioServer(spec, context?, options?)` | Disponibiliza um documento via stdio; retorna `{ closed, close() }`. |
| `attachMcpRoutes(app, options)` | Monta as rotas Streamable HTTP (`/mcp`) e, opcionalmente, SSE legado (`/sse`). Aceita `AttachMcpRoutesOptions` e retorna `McpRouteHandle`. |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | Wrapper descontinuado com argumentos posicionais. Retorna `{ activeSessionCount, closeAll }`. |
| `createStreamableSessionHost(options)` | Cria um host independente de sessões Streamable HTTP para integrações de transporte personalizadas. |

Tipos: `SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`.

`attachMcpRoutes` é exportado pela raiz do pacote. Suas opções configuram `maxSessions`, `allowedOrigins`, `sessionIdleMs` e a proteção contra DNS rebinding. O identificador expõe `activeSessionCount`, `pendingSessionCount`, `listSessions`, `closeSession`, `closeAll` e `dispose`. Ao encerrar, use `dispose()` para interromper a limpeza periódica e fechar as sessões.

## Servidor de administração e autenticação (subcaminho `./server`) {#admin-server-and-auth-server-subpath}

Importe `startAdminServer` de `@powerduck/openapi-mcp-server/server` ou da raiz do pacote. Importe `createAuthMiddleware` da raiz; ele não é exportado pelo subcaminho `./server`.

| Exportação | Assinatura | Descrição |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | Inicia o aplicativo Express de administração com interface web e rotas MCP. Retorna `{ app, server, port, close() }`. |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Controle de acesso por Bearer ou `x-api-key`. Omita a chave para desativar. Argumento posicional. |

## Runtime e utilitários

| Exportação | Descrição |
| --- | --- |
| `ServiceRegistry` | Classe de `ManagedServiceRecord`: `upsert`, `list`, `get`, `remove`, `clear`, `start`, `stop`, `fail`. |
| `isAbortError(error)` | Verdadeiro para `AbortError` ou `CanceledError` do axios. |
| `newId()` | UUID, com alternativa baseada em timestamp. |

## CLI

Executável **`openapi-mcp`**. Um único comando, `serve`:

```
openapi-mcp serve [options]
```

| Opção | Padrão | Descrição |
| --- | --- | --- |
| `--port <n>` | `3000` | Porta HTTP do transporte web. |
| `--host <host>` | `127.0.0.1` | Host HTTP. |
| `--transport <mode>` | `web` | `stdio` ou `web`. |
| `--spec <path>` | — | Caminho do arquivo OpenAPI, obrigatório no modo stdio. |
| `--base-url <url>` | — | Substitui a URL base do serviço de destino. |
| `--api-key <key>` | — | Chave API de administração. |
| `--upstream-header "Name: value"` | — | Cabeçalho para o serviço de destino; pode ser repetido. |
| `--timeout <ms>` | `30000` | Tempo limite do serviço de destino. |
| `--no-persist` | — | Desativa a persistência do estado. |

## Tipos (reexportados de `types`)

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`; `ResolvedPrompt` está descontinuado. Funções de verificação: `isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`.

## Erros e comportamento

- IDs desconhecidos de ferramentas, prompts ou recursos geram erros MCP `InvalidParams`, e não falhas embutidas no resultado normal.
- A ausência de uma especificação durante uma sessão ativa gera um `InternalError`.
- Respostas 4xx/5xx do serviço de destino são retornadas ao modelo como conteúdo com `isError: true`, sem lançar exceções. Apenas falhas de transporte (DNS, TLS, tempo limite, cancelamento) lançam exceções.

## Veja também

- [Configuração](../configuration/)
- [Exemplos](../examples/)
