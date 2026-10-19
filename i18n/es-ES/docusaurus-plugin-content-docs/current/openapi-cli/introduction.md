---
sidebar_position: 1
title: "Introducción"
description: "@powerduck/openapi-cli es una herramienta de línea de comandos que prueba por lotes un documento OpenAPI 3.2 contra un servidor real. Indica un archivo de especificación o una URL: ejecuta las operaciones del documento, comprueba cada respuesta con aserciones y genera tres formatos de informe."
---

# Introducción

`@powerduck/openapi-cli` es una herramienta de línea de comandos que prueba por lotes un documento OpenAPI 3.2 contra un servidor real. Indica un archivo de especificación o una URL: ejecuta las operaciones del documento, comprueba cada respuesta con aserciones y genera tres formatos de informe.

Utiliza [`@powerduck/openapi-request`](https://www.npmjs.com/package/@powerduck/openapi-request) para ejecutar peticiones y [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) para resolver referencias `$ref`.

## Por qué usar openapi-cli

- **Preparado para CI** — de forma predeterminada, un código de salida distinto de cero indica un fallo de prueba o un error de ejecución. Se integra directamente en GitHub Actions, GitLab CI o cualquier otra canalización.
- **Varios protocolos integrados** — una misma especificación puede describir operaciones HTTP, SSE, WebSocket, GraphQL, gRPC y MCP; el mismo ejecutor las gestiona todas.
- **Dos estilos de aserción** — arrays declarativos `x-tests` para comprobaciones sencillas y scripts de estilo Postman con `pm.test()` / `pm.expect()` para casos complejos.
- **Tres formatos de informe** — JSON legible por máquinas, salida CLI en color fácil de leer e informe HTML interactivo independiente.
- **Especificaciones locales o remotas** — carga desde una ruta de archivo o una URL `http(s)://`, con seguimiento de redirecciones y tiempo de espera limitado.
- **Filtrado flexible** — selección de operaciones por método, ruta, etiqueta u operationId, con concurrencia limitada.

## Protocolos compatibles

El ejecutor detecta el protocolo de cada operación mediante las extensiones de OpenAPI o los tipos de contenido de las respuestas:

| Protocolo | Identificador | Cómo se selecciona |
|----------|-----------|--------------------|
| HTTP | `http` | Predeterminado para las operaciones estándar |
| Eventos enviados por el servidor | `sse` | Tipo de contenido de respuesta `text/event-stream` o `x-response-stream: true` |
| WebSocket | `websocket` | `x-protocol: "websocket"` |
| GraphQL | `graphql` | `x-protocol: "graphql"` |
| gRPC | `grpc` | `x-protocol: "grpc"` |
| MCP | `mcp` | `x-protocol: "mcp"` |

También se puede fijar el protocolo mediante la extensión `x-protocol` en la operación o en el elemento de ruta.

## Informes

Tras la ejecución, la herramienta genera lo siguiente; los archivos se guardan por defecto en `./openapi-cli-report`:

- `report.json` — el objeto `TestReport` completo como JSON con sangría.
- `report.html` — un informe HTML independiente y sin dependencias, con resumen, barra de progreso, botones de filtro y filas de prueba desplegables.
- Salida estándar — un resumen CLI en color con barra de progreso y aserciones de cada prueba.

## Uso desde código

El mismo flujo está disponible como biblioteca. Resuelve la configuración, ejecuta las pruebas y elige los generadores de informes que necesites:

```ts
import { resolveConfig, runTests, printCliReport, generateJsonReport } from "@powerduck/openapi-cli";

const config = resolveConfig({ spec: "./openapi.json" });
const report = await runTests(config);
printCliReport(report);
generateJsonReport(report, "./reports");
```

## Siguientes pasos

- [Instalación](./installation.md) — instalación global o como dependencia de desarrollo.
- [Inicio rápido](./quickstart.md) — ejecuta tu primera suite de pruebas.
- [Configuración](./configuration.md) — referencia completa de `CliConfig`.
- [Comandos](./commands.md) — todas las opciones CLI y los códigos de salida.
- [Referencia de la API](./api-reference.md) — todas las funciones y los tipos exportados.
- [Ejemplos](./examples.md) — ejemplos listos para ejecutar.
