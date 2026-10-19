---
sidebar_position: 4
title: "Configuración"
description: "Configuración completa de @powerduck/openapi-mcp-server: ServerConfig, SecurityContext, ExecutionContext, TransportMode y uniones de literales para orígenes, estados, protocolos, niveles de registro y codificaciones del cuerpo."
---

# Configuración

El objeto central de configuración es `ServerConfig`, que acepta `startAdminServer()`. Los tipos de contexto relacionados se utilizan en la ejecución de herramientas.

## `ServerConfig`

Solo `port` es obligatorio.

| Campo | Tipo | Valor predeterminado | Descripción |
| --- | --- | --- | --- |
| `port` | `number` | — (obligatorio) | Puerto TCP de escucha, entero de 0 a 65535. |
| `host` | `string` | `"127.0.0.1"` | Interfaz de escucha; loopback por defecto para evitar la exposición accidental. |
| `apiKey` | `string` | undefined | Secreto compartido exigido por la API de administración y el transporte HTTP cuando se configura. |
| `specPath` | `string` | undefined | Especificación cargada una vez al iniciar. |
| `baseUrlOverride` | `string` | undefined | Sustituye la URL base del servidor de destino derivada de `servers[0].url`. |
| `upstreamHeaders` | `Record<string, string>` | undefined | Cabeceras añadidas a cada solicitud al servidor de destino. |
| `requestTimeoutMs` | `number` | undefined | Tiempo de espera por solicitud al servidor de destino, en milisegundos. |
| `persistState` | `boolean` | `true` | Conserva la especificación cargada entre reinicios. |
| `stateFilePath` | `string` | undefined | Ubicación del archivo de estado persistente. |
| `allowedOrigins` | `string[]` | undefined | Orígenes CORS permitidos; vacío u omitido desactiva el acceso entre orígenes. |
| `allowedHosts` | `string[]` | undefined | Valores permitidos de la cabecera `Host`. |
| `maxLogEntries` | `number` | 200 | Máximo de entradas de registro conservadas en memoria. |
| `redactSensitiveHeaders` | `boolean` | `true` | Oculta valores de cabeceras sensibles antes de registrarlos. |
| `redactHeaderNames` | `string[]` | undefined | Nombres de cabeceras adicionales que se ocultarán, además de la lista integrada. |
| `security` | `SecurityContext` | undefined | Credenciales enviadas a la API de destino en cada llamada de herramienta. |

## `SecurityContext`

| Campo | Tipo | Se envía como |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | Pares exactos de nombre de cabecera y valor. |

El ejecutor inyecta las credenciales y nunca las expone al modelo como argumentos de herramientas.

## `ExecutionContext`

Contexto por llamada, pasado a `executeToolCall` y devuelto por un `ContextProvider`:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `baseUrlOverride` | `string` | Sustituye la URL del servidor de la especificación para esta llamada. |
| `upstreamHeaders` | `Record<string, string>` | Cabeceras adicionales para el servidor de destino. |
| `requestTimeoutMs` | `number` | Tiempo de espera por llamada, con un mínimo de 1 segundo. |
| `security` | `SecurityContext` | Credenciales para esta llamada. |
| `correlationId` | `string` | Relaciona las entradas de registro de una misma invocación. |
| `protocol` | `ProtocolHint` | Transporte que inició la llamada. |
| `onLog` | `(entry) => void` | Recibe registros de solicitudes y respuestas; nunca debe lanzar excepciones. |
| `signal` | `AbortSignal` | Cancela una solicitud en curso al servidor de destino. |

## Uniones de literales y funciones de comprobación

| Unión | Valores | Función de comprobación |
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

Se pasa como tercer argumento a `buildMcpServer()`:

| Campo | Tipo | Valor predeterminado | Descripción |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | Indicación de protocolo anunciada. |
| `name` | `string` | `"openapi-mcp"` | Nombre del servidor anunciado. |
| `version` | `string` | `"1.1.0"` | Versión del servidor anunciada. |
| `pageSize` | `number` | 100 | Máximo de entradas por respuesta de lista, limitado a 500. |
| `instructions` | `string` | integrado | Orientación de uso expuesta mediante MCP `instructions`. |

## Opciones de la capa de transporte (`AttachMcpRoutesOptions`)

Importe `attachMcpRoutes` desde `@powerduck/openapi-mcp-server` y pase un objeto de opciones como segundo argumento. El envoltorio heredado `attachSseRoutes()` solo admite los argumentos posicionales `(app, specProvider, contextProvider, routeGuard?)`.

| Campo | Tipo | Valor predeterminado | Descripción |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | — (obligatorio) | Proporciona el documento para nuevas sesiones. |
| `contextProvider` | `ContextProvider` | — (obligatorio) | Proporciona el contexto del servidor de destino para cada llamada. |
| `routeGuard` | `RequestHandler` | undefined | Middleware aplicado a todas las rutas MCP. |
| `maxSessions` | `number` | 64 | Límite de sesiones simultáneas. |
| `sessionIdleMs` | `number` | 600000 | Tiempo de inactividad en milisegundos; 0 lo desactiva. |
| `allowedOrigins` | `string[]` | undefined | Orígenes permitidos; una lista no vacía activa la protección frente a DNS rebinding. |
| `allowedHosts` | `string[]` | undefined | Valores permitidos de la cabecera `Host`. |
| `enableLegacySse` | `boolean` | `true` | Monta el transporte HTTP+SSE obsoleto. |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | Recibe eventos del ciclo de vida; nunca debe lanzar excepciones. |

> Estas son opciones de `attachMcpRoutes`, no campos adicionales de `ServerConfig`. El servidor de administración transmite la configuración de orígenes y hosts, pero usa los límites de sesiones y el tiempo de inactividad predeterminados del transporte. Para personalizarlos, utilice directamente la función pública de transporte.

## Véase también

- [Referencia de la API](../api-reference/)
- [Ejemplos](../examples/)
