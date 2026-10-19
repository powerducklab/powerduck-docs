---
sidebar_position: 5
title: "Referencia de la API"
description: "Referencia completa de @powerduck/openapi-mcp-server: carga de especificaciones, generación de herramientas, prompts y recursos, creación y ejecución de solicitudes, servidor MCP, transportes, administración, autenticación, registro de servicios y CLI."
---

# Referencia de la API

Todas las exportaciones públicas de `@powerduck/openapi-mcp-server`, agrupadas por área.

## Carga de especificaciones

| Exportación | Firma | Descripción |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | Lee un archivo JSON o YAML, lo valida, resuelve referencias y comprueba la unicidad de los identificadores de operación. YAML se detecta por la extensión `.ya?ml`. |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | Analiza un documento a partir de una cadena. Lanza una excepción si la entrada está vacía o no es válida. |

## Generación de herramientas

| Exportación | Firma | Descripción |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | Genera definiciones MCP `Tool` para cada operación. |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | Devuelve `{ tools, bindings, issues }`. |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | Asocia los nombres de las herramientas generadas con su `ToolBinding`; alias de `getBindingIndex`. |

Tipos exportados: `ToolBinding`, `GeneratedToolWithBinding` (alias de `GeneratedTool` en el paquete).

## Prompts y recursos

| Exportación | Firma | Descripción |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | Lista todos los prompts generados. |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | Resuelve un prompt por su nombre; devuelve `null` si no existe. |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | Lista los recursos del catálogo. |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | Lee un recurso por su URI. |

## Creación y ejecución de solicitudes

| Exportación | Firma | Descripción |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | Serializa los argumentos en `{ url, query, headers, body, dropped }`. Argumentos posicionales. |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | Ejecuta una herramienta generada contra la API de destino. Las respuestas no-2xx se devuelven como datos; los fallos de transporte lanzan excepciones. |

Campos de `ToolCallResult`: `status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`.

## Utilidades de especificación

| Exportación | Descripción |
| --- | --- |
| `iterateOperations(spec, issues?)` | Generador que produce todas las operaciones resueltas, incluidas las `additionalOperations` de OpenAPI 3.2. |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | Combina los parámetros del elemento de ruta y de la operación mediante la clave `(name, in)`. |
| `normalizeParameter(candidate)` | Normaliza un parámetro sin procesar; devuelve `null` si no se puede usar. |
| `synthesizeOperationId(method, pathTemplate)` | Identificador alternativo determinista si una operación omite `operationId`. |
| `ensureUniqueName(candidate, taken)` | Añade un sufijo numérico para mantener el nombre único. |
| `extractPathTemplateVariables(pathTemplate)` | Extrae las variables `{name}` y elimina duplicados conservando la primera aparición. |
| `effectiveStyle(parameter)` | Aplica el valor predeterminado de `style` de la especificación. |
| `effectiveExplode(parameter)` | Aplica el valor predeterminado de `explode` de la especificación. |
| `findOperationById(spec, operationId)` | Búsqueda O(1) tras la primera construcción; devuelve `null` si no existe. |
| `findDuplicateOperationIds(spec)` | Detecta identificadores duplicados declarados por el autor. |
| `assertUniqueOperationIds(spec)` | Lanza una excepción si hay identificadores de operación duplicados. |
| `isPlainObject(value)` | Acota el tipo a un objeto simple. |
| `truncateGeneratedName(name, limit=64)` | Acorta un nombre sin perder su unicidad. |

Tipos exportados: `OperationEntry`, `DuplicateOperationId`.

## Servidor MCP y transportes

| Exportación | Descripción |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | Construye un `Server` del SDK con manejadores de herramientas, prompts y recursos. Argumentos posicionales. |
| `startStdioServer(spec, context?, options?)` | Sirve un documento mediante stdio; devuelve `{ closed, close() }`. |
| `attachMcpRoutes(app, options)` | Monta las rutas Streamable HTTP (`/mcp`) y, opcionalmente, SSE heredado (`/sse`). Acepta `AttachMcpRoutesOptions` y devuelve `McpRouteHandle`. |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | Envoltorio obsoleto con argumentos posicionales. Devuelve `{ activeSessionCount, closeAll }`. |
| `createStreamableSessionHost(options)` | Crea un host independiente de sesiones Streamable HTTP para integraciones de transporte personalizadas. |

Tipos: `SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`.

`attachMcpRoutes` se exporta desde la raíz del paquete. Sus opciones configuran `maxSessions`, `allowedOrigins`, `sessionIdleMs` y la protección frente a DNS rebinding. El objeto devuelto expone `activeSessionCount`, `pendingSessionCount`, `listSessions`, `closeSession`, `closeAll` y `dispose`. Use `dispose()` al apagar el servidor para detener la limpieza periódica y cerrar las sesiones.

## Servidor de administración y autenticación (subruta `./server`) {#admin-server-and-auth-server-subpath}

Importe `startAdminServer` desde `@powerduck/openapi-mcp-server/server` o desde la raíz del paquete. Importe `createAuthMiddleware` desde la raíz; la subruta `./server` no lo exporta.

| Exportación | Firma | Descripción |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | Inicia la aplicación Express de administración con interfaz web y rutas MCP. Devuelve `{ app, server, port, close() }`. |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Control de acceso mediante Bearer o `x-api-key`. Omita la clave para desactivarlo. Argumento posicional. |

## Ejecución y utilidades

| Exportación | Descripción |
| --- | --- |
| `ServiceRegistry` | Clase de `ManagedServiceRecord`: `upsert`, `list`, `get`, `remove`, `clear`, `start`, `stop`, `fail`. |
| `isAbortError(error)` | Verdadero para `AbortError` o `CanceledError` de axios. |
| `newId()` | UUID con alternativa basada en una marca de tiempo. |

## CLI

Ejecutable **`openapi-mcp`**. Un único comando, `serve`:

```
openapi-mcp serve [options]
```

| Opción | Valor predeterminado | Descripción |
| --- | --- | --- |
| `--port <n>` | `3000` | Puerto HTTP del transporte web. |
| `--host <host>` | `127.0.0.1` | Host HTTP. |
| `--transport <mode>` | `web` | `stdio` o `web`. |
| `--spec <path>` | — | Ruta del archivo OpenAPI; obligatoria en modo stdio. |
| `--base-url <url>` | — | Sustituye la URL base del servidor de destino. |
| `--api-key <key>` | — | Clave API de administración. |
| `--upstream-header "Name: value"` | — | Cabecera para el servidor de destino; se puede repetir. |
| `--timeout <ms>` | `30000` | Tiempo de espera del servidor de destino. |
| `--no-persist` | — | Desactiva la persistencia del estado. |

## Tipos (reexportados desde `types`)

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`; `ResolvedPrompt` está obsoleto. Funciones de comprobación: `isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`.

## Errores y comportamiento

- Los identificadores desconocidos de herramientas, prompts o recursos producen errores MCP `InvalidParams`, no fallos dentro del resultado normal.
- Si falta la especificación durante una sesión activa, se produce un `InternalError`.
- Las respuestas 4xx/5xx del servidor de destino se devuelven al modelo como contenido con `isError: true`, sin lanzar excepciones. Solo los fallos de transporte (DNS, TLS, tiempo de espera, cancelación) lanzan excepciones.

## Véase también

- [Configuración](../configuration/)
- [Ejemplos](../examples/)
