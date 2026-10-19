---
sidebar_position: 4
title: "Configuración"
description: "La configuración tiene tres capas: opciones de fábrica del cliente o depurador, el objeto SendOptions pasado a prepare() y send(), y opciones específicas de cada protocolo."
---

# Configuración

La configuración tiene tres capas: opciones de fábrica del cliente o depurador, el objeto `SendOptions` pasado a `prepare()` y `send()`, y opciones específicas de cada protocolo.

## Opciones de fábrica

### `CreateClientOptions`

Se pasa a `createClient(options?)`. Todos los campos son opcionales.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | Controla cómo se fusionan las respuestas con la especificación |
| `response` | `ToResponseOptions` | Controla la normalización de los objetos de respuesta |

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

Se pasa a `createDebugger(config?)`. Todos los campos son opcionales.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | Lista de adaptadores personalizada que sustituye todos los predeterminados |
| `extraAdapters` | `ProtocolAdapter[]` | Adaptadores adicionales para el registro predeterminado |
| `writeBack` | `WriteBackOptions` | Opciones de escritura de resultados |
| `response` | `ToResponseOptions` | Opciones de normalización de respuestas |
| `writeBackTruncated` | `boolean` | Escribe el esquema inferido de flujos truncados; valor predeterminado: `true` |

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

### Escritura de resultados y ejemplos capturados

`WriteBackOptions` admite `strategy` (`"merge"` o `"replace"`, por defecto `"merge"`), `keepExistingDescription` (por defecto `true`), `allowedStatusCodes` (vacío significa todos), `protectComponentRefs` (por defecto `true`), `overwriteExamples` (por defecto `true`) y `requirePassingTests`. El proceso de envío comprueba los resultados de las pruebas; llamar directamente a `writeBackResponse` no lo hace.

`ToResponseOptions` admite `includeExamples` (por defecto `true`), `maxExampleChars` (por defecto `4000`) y `maxEventPreviewChars` (por defecto `200`). Desactive la captura de ejemplos o revíselos antes de publicar: las respuestas reales pueden contener credenciales o datos personales.

El proceso de envío normalmente devuelve una copia modificada en `patchedSpec`; no modifica el documento de entrada ni guarda archivos. Establezca `writeBack: false` en cada llamada para omitir ese paso. El objeto `writeBack` de la fábrica configura la fusión; el booleano por llamada la activa o desactiva.

## `SendOptions`

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

### `ScriptConfig`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | Scripts previos a la solicitud de la colección |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | Scripts de pruebas de la colección |
| `preRequest` | `ScriptSource \| ScriptSource[]` | Scripts previos a una solicitud |
| `test` | `ScriptSource \| ScriptSource[]` | Scripts de pruebas de una solicitud |
| `fromSpecExtensions` | `boolean` | Lee `x-postman-scripts` de la especificación; por defecto `true` |
| `captureLastResponse` | `boolean` | Añade el auxiliar integrado que expone la última respuesta a solicitudes posteriores |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

Establezca `scripts.fromSpecExtensions: false` si no quiere ejecutar scripts incluidos en una especificación importada. El valor predeterminado actual es `true`; no dependa de un cambio futuro.

## Opciones por protocolo

### HTTP / SSE

HTTP es el adaptador predeterminado. Declarar `text/event-stream` indica intención SSE; la ejecución también clasifica la respuesta real cuando llegan las cabeceras. `probeStreamingResponse()` es una comprobación explícita independiente, no un requisito automático de cada llamada.

Las solicitudes HTTP básicas no necesitan más configuración. Use `SendOptions.runner` para ajustes avanzados de postman-runtime.

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

La sesión manual MCP predeterminada usa Streamable HTTP y `endpoint`. Para stdio, pase `kind: "mcp"`, `transport: "stdio"` y un `command` local con `args` opcionales; abrir la sesión inicia el proceso configurado.

### gRPC

gRPC necesita una dirección, una fuente de descriptores (archivos `.proto` o reflexión del servidor), y un servicio y método completamente cualificados:

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

Las fábricas de sesiones manuales devuelven una sesión sin abrir. Llame a `open()` antes de enviar y a `close()` durante la limpieza. El ejemplo gRPC necesita un servidor local y un archivo proto compatibles; las opciones de sesión manual no son el mismo objeto que `SendOptions.grpc`.

## Ejemplo completo

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

## Siguientes pasos

- Consulte la [Referencia de la API](./api-reference.md) para todos los tipos exportados
- Explore los [Ejemplos](./examples.md) específicos de cada protocolo
