---
sidebar_position: 5
title: "Referencia de la API"
description: "Referencia de las principales API de integración de @powerduck/openapi-request"
---

# Referencia de la API

Referencia de las principales API de integración de `@powerduck/openapi-request`. Las tablas resumen los contratos; las declaraciones TypeScript del paquete contienen todas las sobrecargas y los parámetros opcionales. El punto de entrada principal y los subdirectorios de exportación por protocolo no ofrecen exactamente los mismos elementos.

## API principales

### `createClient(options?): ProtoClient`

Crea el cliente orientado a interfaces de usuario. El argumento `options` es opcional.

**Parámetros:**

| Nombre | Tipo | Descripción |
| --- | --- | --- |
| `options` | `CreateClientOptions` | Configuración opcional |
| `options.writeBack` | `WriteBackOptions` | Controla cómo se fusionan las respuestas con la especificación |
| `options.response` | `ToResponseOptions` | Controla la normalización de los objetos de respuesta |

**Devuelve:** un `ProtoClient` con los siguientes métodos:

| Método | Firma | Descripción |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | Planifica una petición y devuelve el protocolo, el modo de visualización y el tipo de flujo |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | Ejecuta una petición |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | Ejecuta un lote con resultados por destino; un fallo no descarta los demás resultados |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | Crea una sesión websocket/mcp/grpc sin abrir; llama a `open()` para conectarla |
| `discover` | `(discoverOptions) => Promise<any>` | Descubre las capacidades de MCP y gRPC |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | Fusiona la respuesta observada con el documento |
| `dispose` | `() => void` | Actualmente no realiza ninguna acción; quien llama debe cerrar sus sesiones |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | Realiza una petición fetch y clasifica su respuesta; consume o cancela el cuerpo devuelto |

**Ejemplo:**

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

Crea el depurador programable para automatización, scripts y CI.

**Parámetros:**

| Nombre | Tipo | Descripción |
| --- | --- | --- |
| `config` | `DebuggerOptions` | Configuración opcional |
| `config.adapters` | `ProtocolAdapter[]` | Lista de adaptadores personalizados que sustituye a los predeterminados |
| `config.extraAdapters` | `ProtocolAdapter[]` | Adaptadores adicionales a los predeterminados |
| `config.writeBack` | `WriteBackOptions` | Opciones de escritura de resultados |
| `config.response` | `ToResponseOptions` | Opciones de normalización de respuestas |
| `config.writeBackTruncated` | `boolean` | Incorpora el esquema inferido de flujos truncados (predeterminado: true) |

**Devuelve:** un `ProtoKit` con `prepare`, `send`, `sendMany`, `toCollection` y otros métodos.

**Ejemplo:**

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

Crea una sesión dúplex de larga duración para WebSocket, MCP o gRPC. La función de creación no realiza E/S; la conexión se abre con `open()`.

**Parámetros:**

| Nombre | Tipo | Descripción |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | Protocolo que se utilizará |
| `options.url` | `string` | URL de conexión WebSocket |
| `options.endpoint` | `string` | Endpoint MCP Streamable HTTP |
| `options.transport` | `"streamable-http" \| "stdio"` | Transporte MCP; Streamable HTTP de forma predeterminada |
| `options.command`, `options.args` | `string`, `string[]` | Ejecutable local y argumentos para MCP stdio |
| `options.address`, `options.service`, `options.method` | `string` | Dirección gRPC, nombre completo del servicio y método |

Para gRPC, proporciona también una fuente de descriptores mediante `protoPaths` o `reflection`. Las opciones por protocolo se detallan en [Configuración](./configuration.md).

**Devuelve:** una sesión con `open()`, `send()`, `close()`, `onEvent()`, `waitForClose()`, `events` y `state`. `onEvent()` devuelve una suscripción con `unsubscribe()`.

**Ejemplo:**

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

Registro de instancias de `ProtocolAdapter`. Un registro nuevo está vacío; `createDebugger()` registra los adaptadores integrados HTTP, WebSocket, gRPC, MCP y GraphQL, salvo que una lista personalizada los sustituya. Usa `register()`, `unregister()`, `get()`, `list()`, `rank()` y `resolve()` para gestionar la selección.

### `ProtoKitError`

Error tipado que lanzan el depurador y los procesos principales. Usa `instanceof ProtoKitError` para distinguir los errores de la biblioteca de otros fallos inesperados.

## Tipos principales

### `SendOptions`

Objeto de entrada principal de `prepare()` y `send()`. Recibe la especificación, el destino, los valores y toda la configuración de la solicitud.

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | Sí | Documento OpenAPI 3.2 completo |
| `target` | `OperationTarget` | Sí | Identificador de operación, explicado más abajo |
| `values` | `RequestValues` | No | Valores concretos para path/query/header/cookie/body |
| `serverUrl` | `string` | No | Sustituye `spec.servers[0].url` |
| `serverVariables` | `Record<string, string>` | No | Variables de la plantilla de URL del servidor |
| `variables` | `Record<string, string>` | No | Variables de entorno referenciadas como `{{name}}` |
| `globals` | `Record<string, string>` | No | Variables globales de estilo Postman |
| `localVariables` | `Record<string, string>` | No | Variables locales |
| `collectionVariables` | `Record<string, string>` | No | Variables de colección |
| `auth` | `AuthConfig` | No | Configuración de autenticación |
| `scripts` | `ScriptConfig` | No | Scripts previos a la solicitud y de pruebas |
| `runner` | `RuntimeRunOptions` | No | Opciones completas de postman-runtime transmitidas con máxima prioridad |
| `websocket` | `WebSocketOptions` | No | Opciones de WebSocket |
| `graphql` | `GraphQLOptions` | No | Opciones de GraphQL |
| `mcp` | `McpOptions` | No | Opciones de MCP |
| `grpc` | `any` | No | Opciones de gRPC |
| `timeout` | `number` | No | Tiempo límite por solicitud en ms; atajo para `runner.timeout.request` |

`SendOptions` también acepta estos controles de ejecución y streaming:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `fetch` | `typeof fetch` | Transporte fetch aislado proporcionado por el host donde se admita; HTTP/SSE siguen usando postman-runtime. |
| `writeBack` | `boolean` | Al establecer `false`, deja `patchedSpec` sin definir y sigue generando `responseFragment`. |
| `signal` | `AbortSignal` | Cancela la ejecución o el muestreo; aún puede devolver un resultado parcial. |
| `maxEvents` | `number` | Máximo de eventos de streaming conservados. |
| `maxStreamMs` | `number` | Duración máxima del muestreo del flujo en milisegundos. |
| `maxResponseSize` | `number` | Límite de bytes de la respuesta. |
| `maxBufferChars` | `number` | Límite del búfer SSE antes de un límite de evento; por defecto `4194304` caracteres. |
| `maxEventChars` | `number` | Límite de datos conservados por evento SSE; por defecto `1048576` caracteres. |
| `inheritEventId` | `boolean` | Hereda el último ID de evento SSE cuando falta; por defecto `true`. Use `false` para una inferencia de esquemas más estricta. |
| `onEvent` | `(event: StreamEvent) => void` | Recibe eventos del flujo. |
| `onConsole` | `(log: ConsoleLog) => void` | Recibe la salida de consola de los scripts. |
| `onAssertion` | `(assertion: AssertionResult) => void` | Recibe resultados de aserciones. |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | Inspecciona las primeras cabeceras HTTP/SSE y la clasificación `streaming`. |
| `onOpen` | `(info) => void` | Recibe detalles de la conexión WebSocket: URL, protocolo y cabeceras. |

Los adaptadores pueden interpretar los límites de forma distinta. Mantenga ligeros los callbacks de la interfaz; la capa de ejecución captura sus excepciones. Para ajustar el requester HTTP use `runner.requester`; su `maxResponseSize`, si se indica, debe ser positivo, no cero.

### `OperationTarget`

Identifica una operación. Use preferiblemente `operationId` o `method` + `path`. Si se proporcionan ambos, prevalece `operationId`.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `operationId` | `string` | Clave de búsqueda alternativa con prioridad sobre ruta y método |
| `method` | `string` | Método HTTP sin distinguir mayúsculas. Requiere `path`. |
| `path` | `string` | Ruta parametrizada, por ejemplo `/users/{id}`. Requiere `method`. |

### `RequestValues`

Valores concretos inyectados en la solicitud generada.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | Valores de parámetros de ruta |
| `query` | `Record<string, unknown>` | Valores de parámetros de consulta |
| `header` | `Record<string, unknown>` | Valores de cabeceras |
| `cookie` | `Record<string, unknown>` | Valores de cookies |
| `querystring` | `string` | Cadena de consulta sin procesar y ya codificada, para la ubicación `querystring` de OpenAPI 3.2 |
| `body` | `unknown` | Cuerpo de la solicitud |
| `contentType` | `string` | Fuerza un tipo de medio si la operación declara varios |

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

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | Tipo de autenticación |
| `token` | `string` | Token Bearer para `type: "bearer"` |
| `username` | `string` | Usuario Basic para `type: "basic"` |
| `password` | `string` | Contraseña Basic para `type: "basic"` |
| `key` | `string` | Nombre de clave API para `type: "apikey"` |
| `value` | `string` | Valor de clave API para `type: "apikey"` |
| `in` | `"header" \| "query"` | Ubicación de clave API para `type: "apikey"` |

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

Los tipos avanzados son `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` y `edgegrid`. Pase sus campos auxiliares Postman de HTTP/SSE/GraphQL mediante `parameters: Record<string, string | boolean | number>`. La opción `oauth2: OAuth2FlowConfig` activa la obtención y renovación de tokens OAuth 2.0; no suponga que todos los mecanismos funcionan con todos los protocolos.

### `PreparedRequest`

Lo devuelve `createClient().prepare()`. El depurador ofrece otro resultado de planificación: `createDebugger().prepare()` devuelve un `PlanResult` con `located`, `adapter` y `plan`.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `protocol` | `string` | Protocolo resuelto (http, websocket, grpc, graphql, mcp) |
| `transport` | `string` | Transporte resuelto |
| `target` | `OperationTarget` | Destino original |
| `operation` | `any` | Objeto de operación OpenAPI resuelto |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | Clasificación del flujo (véase más abajo) |
| `stream.expected` | `boolean` | Indica si se espera streaming |
| `openapi.extensions` | `Record<string, unknown>` | Extensiones OpenAPI resueltas |
| `warnings` | `string[]` | Advertencias durante la planificación |

### `StreamKind`

Clasificación precisa de flujos: `"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## Funciones auxiliares de OpenAPI

| Exportación | Firma | Descripción |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | Resuelve una operación mediante `OperationTarget` |
| `inferSchema` | `(value) => Schema` | Infiere un JSON Schema a partir de un único valor observado |
| `inferSchemaFromMany` | `(values) => Schema` | Infiere un esquema que abarca varios valores observados |
| `mergeSchema` | `(a, b) => Schema` | Fusiona dos esquemas inferidos (unión o combinación) |
| `sampleFromSchema` | `(schema) => unknown` | Genera un valor de ejemplo realista para un esquema |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | Construye un objeto de respuesta OpenAPI a partir de un resultado observado |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | Fusiona una respuesta observada con el documento |

Tipos exportados: `LocatedOperation`, `WriteBackOptions`, `ToResponseOptions`.

## HTTP / SSE

Los siguientes nombres están disponibles en el punto de entrada principal. La ruta `@powerduck/openapi-request/http` exporta `HttpAdapter`, `SseParser`, `buildCollection`, `buildEnvironment`, `resolveServerUrl`, `buildRunOptions` y `runWithPostman`; importa las funciones de detección y `BUILTIN_CAPTURE_TEST` desde el punto de entrada principal.

| Exportación | Descripción |
| --- | --- |
| `HttpAdapter` | Adaptador de protocolo predeterminado para HTTP/HTTPS |
| `SseParser` | Analizador que convierte un flujo de bytes SSE en eventos estructurados |
| `isStreamingOperation` | Clasifica una operación como streaming según los tipos de contenido declarados |
| `isSseContentType` | Comprueba si un tipo de contenido indica SSE |
| `isStreamingContentType` | Comprueba si un tipo de contenido indica streaming |
| `acceptHeaderFor` | Genera la cabecera Accept adecuada para una operación |
| `probeStreamingResponse` | Realiza una petición fetch y clasifica su respuesta; consume o cancela el cuerpo devuelto |
| `BUILTIN_CAPTURE_TEST` | Script de prueba Postman integrado para capturar la última respuesta |

## WebSocket

Importa desde `@powerduck/openapi-request/ws`.

| Exportación | Descripción |
| --- | --- |
| `WebSocketAdapter` | Adaptador de protocolo para destinos WebSocket |
| `createWsManualSession` | Crea una sesión WebSocket manual dúplex, también disponible como `runWebSocketSession` y `wsManualSession` |

## GraphQL

Importa desde `@powerduck/openapi-request/graphql`.

| Exportación | Descripción |
| --- | --- |
| `GraphQLAdapter` | Adaptador de protocolo para destinos GraphQL |
| `resolveGraphQLConfig` | Resuelve la configuración GraphQL de una operación |
| `runGraphQL` | Ejecuta una operación GraphQL |
| `introspectSchema` | Obtiene por introspección el esquema de un endpoint GraphQL |
| `INTROSPECTION_QUERY` | Consulta estándar de introspección GraphQL |
| `generateOperation` | Genera un documento de consulta a partir de un esquema GraphQL obtenido por introspección y un campo |
| `generateAllOperations` | Genera documentos de consulta para los campos de un esquema GraphQL obtenido por introspección |
| `writeGraphQLOperations` | Incorpora las operaciones GraphQL generadas a la especificación |
| `discoverAndWriteGraphQLSchema` | Descubre un esquema GraphQL y lo incorpora a la especificación |

## MCP (Model Context Protocol)

La mayoría de los siguientes elementos están disponibles en `@powerduck/openapi-request/mcp`. Importa `initializeMcpSession` desde el punto de entrada principal; en la ruta específica se llama `initializeSession`. Esta también expone `runMcp`, `createMcpSessionCore` y `createMcpStdioConnection`.

| Exportación | Descripción |
| --- | --- |
| `McpAdapter` | Adaptador de protocolo para destinos MCP |
| `createMcpManualSession` | Crea una sesión MCP manual, también disponible como `mcpManualSession` |
| `createMcpStdioSession` | Crea una sesión MCP mediante stdio |
| `runMcpManualSession` | Obsoleto: utiliza `createMcpManualSession` |
| `resolveMcpConfig` | Resuelve la configuración MCP de una operación |
| `initializeMcpSession` | Inicializa una sesión MCP (alias de `initializeSession`) |
| `discoverMcpCapabilities` | Descubre las capacidades del servidor MCP |
| `MCP_PROTOCOL_VERSION` | Versión compatible del protocolo MCP |
| `generateMcpCall` | Genera una llamada a una herramienta MCP |
| `generateAllMcpCalls` | Genera todas las llamadas a herramientas MCP |
| `writeMcpOperations` | Incorpora las operaciones MCP a la especificación |
| `discoverAndWriteMcpCapabilities` | Descubre las capacidades MCP y las incorpora a la especificación |
| `createHttpMcpTransport` | Crea un transporte HTTP para MCP |
| `createStdioMcpTransport` | Crea un transporte stdio para MCP |

## gRPC

Importa las funciones de bajo nivel para descubrimiento, llamadas y descriptores desde `@powerduck/openapi-request/grpc`. Importa `GrpcProtocolAdapter`, `createGrpcManualSession`, `grpcManualSession`, `grpcDiscover` y `discoverGrpc` desde el punto de entrada principal; en la ruta específica, la función de descubrimiento se llama `discover`. Esta también proporciona `discoverFromCatalog`, `describeMethod` y `describeFromCatalog` para reutilizar un catálogo sin repetir la reflexión por cada método.

| Exportación | Descripción |
| --- | --- |
| `GrpcProtocolAdapter` | Adaptador de protocolo gRPC orientado a OpenAPI |
| `GrpcAdapter` | Adaptador gRPC de bajo nivel |
| `grpcDiscover` / `discoverGrpc` | Descubre servicios y métodos gRPC |
| `createGrpcManualSession` / `grpcManualSession` | Crea una sesión gRPC manual |
| `grpcCall` | Ejecuta una llamada gRPC |
| `resolveMethod` | Resuelve un descriptor de método gRPC |
| `buildMessageTemplate` | Construye una plantilla de mensaje a partir de un descriptor |
| `buildCatalog` | Construye un catálogo de servicios y métodos |
| `LOADER_OPTIONS` | Opciones predeterminadas del cargador proto |
| `scanProtoFiles` | Busca archivos proto en directorios |
| `deriveIncludeDirsDetailed` | Deduce los directorios de inclusión a partir de las rutas de archivos proto |
| `fetchDescriptorSet` | Obtiene un conjunto de descriptores mediante reflexión gRPC |
| `fetchFullDescriptorSet` | Obtiene un conjunto completo de descriptores con todas sus dependencias |
| `listServices` | Enumera los servicios de un conjunto de descriptores |
| `listServicesDetailed` | Enumera los servicios con información detallada de sus métodos |
| `serializeDescriptorSet` | Serializa un conjunto de descriptores en bytes |
| `decodeFileDescriptorProto` | Decodifica un proto de descriptor de archivo |
| `decodeFileDescriptorSet` | Decodifica un conjunto de descriptores de archivos |
| `buildCredentials` | Construye credenciales gRPC de forma síncrona |
| `buildCredentialsAsync` | Construye credenciales gRPC de forma asíncrona |
| `buildCredentialsChecked` | Construye y valida credenciales de forma síncrona |
| `buildCredentialsCheckedAsync` | Construye y valida credenciales de forma asíncrona |
| `loadGrpc` | Carga dinámicamente el paquete `@grpc/grpc-js` |
| `isGrpcAvailable` | Comprueba si las dependencias gRPC están disponibles |
| `requireCapability` | Exige una capacidad gRPC concreta y lanza un error si no está disponible |

El punto de entrada principal exporta los alias de tipo `GrpcDiscoveryResult`, `GrpcDiscoveredMethod` y `GrpcDiscoveredService`. En la ruta gRPC se llaman `DiscoveryResult`, `DiscoveredMethod` y `DiscoveredService`.

Tipos de error: `ReflectionProtocolError`, `ReflectionUnavailableError`, `DescriptorDecodeError`, `GrpcDependencyBrokenError`, `GrpcDependencyMissingError`.

## Otras utilidades

El punto de entrada principal también exporta las funciones OAuth 2.0 `resolveOAuth2Token`, `acquireOAuth2Token`, `isOAuth2TokenExpired`, `oauth2RefreshStatuses` y `authFromOAuth2Token`, la utilidad de copia `toCloneable`, la clase base `UnifiedSession` y las funciones de escritura gRPC `writeGrpcOperations` y `discoverAndWriteGrpcOperations`.

## Exportaciones por subruta

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
