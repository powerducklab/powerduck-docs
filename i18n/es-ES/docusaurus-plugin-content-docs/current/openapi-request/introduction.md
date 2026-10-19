---
sidebar_position: 1
title: "Introducción a @powerduck/openapi-request"
description: "@powerduck/openapi-request es un depurador de colecciones y un motor de ejecución de peticiones para OpenAPI 3.2. Prepara y envía peticiones a partir de un documento OpenAPI, identifica respuestas en streaming y puede generar un documento actualizado a partir de las respuestas observadas. Una interfaz compacta permite trabajar con seis protocolos de comunicación."
---

# Introducción a @powerduck/openapi-request

`@powerduck/openapi-request` es un depurador de colecciones y un motor de ejecución de peticiones para OpenAPI 3.2. Prepara y envía peticiones a partir de un documento OpenAPI, identifica respuestas en streaming y puede generar un documento actualizado a partir de las respuestas observadas. Una interfaz compacta permite trabajar con seis protocolos de comunicación.

- **Nombre del paquete:** `@powerduck/openapi-request`
- **Versión:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **Licencia:** MIT
- **Formato de módulos:** distribuciones ESM y CommonJS con declaraciones de tipos incluidas.

## Para qué sirve

La biblioteca cubre tres necesidades tomando el mismo documento como referencia:

- **Cliente pensado para interfaces gráficas** — `createClient()` devuelve un objeto con `prepare()`, `send()`, `connect()`, `discover()` y `writeback()`, que corresponden a los pasos de un editor gráfico de peticiones.
- **Depurador controlado por scripts** — `createDebugger()` devuelve un `ProtoKit` con `send()`, `sendMany()` y `toCollection()` para automatización, scripts y CI.
- **Sesiones persistentes de gestión manual** — `createManualSession()` devuelve un objeto de sesión bidireccional con apertura, envío, cierre y un flujo de eventos. La estructura es la misma para WebSocket, MCP y gRPC, de modo que una única interfaz puede gestionar los tres.

## Adaptadores de protocolo

El núcleo es independiente del transporte; los adaptadores de protocolo registrados en un `AdapterRegistry` aportan el comportamiento específico.

- **HTTP / SSE** — opción predeterminada. Detecta automáticamente las peticiones JSON convencionales y los flujos Server-Sent Events a partir de los tipos de contenido declarados o de las cabeceras de respuesta reales.
- **WebSocket** — sesiones bidireccionales de texto o datos binarios con un formato de evento común.
- **gRPC** — llamadas unarias, streaming de servidor, streaming de cliente y streaming bidireccional a partir de archivos `.proto` o de la reflexión del servidor.
- **MCP** — llamadas a herramientas de Model Context Protocol mediante Streamable HTTP o stdio.
- **GraphQL** — introspección, generación y ejecución de operaciones.

## Funciones principales

- **Modelo de colecciones OpenAPI 3.2** — localiza operaciones mediante `operationId` o `method`+`path` y prepara peticiones a partir de parámetros, cuerpos de petición y ejemplos.
- **Detección de streaming** — `isStreamingOperation()`, `isSseContentType()` e `isStreamingContentType()` clasifican las respuestas según los tipos de contenido declarados; `probeStreamingResponse()` examina las cabeceras de respuesta reales.
- **Incorporación de respuestas al documento** — `inferSchema()`, `mergeSchema()`, `toResponseObject()` y `writeBackResponse()` deducen los esquemas de respuesta y devuelven un documento actualizado. De forma predeterminada, `send()` lo devuelve en `patchedSpec` si la incorporación tiene éxito; `writeBack: false` desactiva este comportamiento. El documento de entrada no se modifica ni se guarda ningún archivo automáticamente. Comprueba `writeBackSkippedReason` y `writeBackWarnings` antes de guardar el resultado.
- **Utilidades de esquemas** — `sampleFromSchema()` genera datos de ejemplo a partir de un esquema.
- **Carga diferida de dependencias pesadas** — gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`) y MCP (`@modelcontextprotocol/sdk`) se cargan al usarlos por primera vez. Quienes solo utilizan HTTP evitan ese coste de carga.

## Instalación

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## Inicio rápido

```typescript
import { createClient } from "@powerduck/openapi-request";

const spec = {
  openapi: "3.2.0",
  info: { title: "Users", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User" } },
      },
    },
  },
};

const client = createClient();

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

## Siguientes pasos

- [Instalación](./installation.md) — estructura del paquete, exportaciones de subrutas y dependencias pares para las funciones de protocolo.
- [Inicio rápido](./quickstart.md) — primera petición, ejecución del depurador y sesión manual.
- [Configuración](./configuration.md) — `CreateClientOptions`, `DebuggerOptions` y configuración por protocolo.
- [Referencia de la API](./api-reference.md) — todas las exportaciones agrupadas por funcionalidad.
- [Ejemplos](./examples.md) — ejemplos ejecutables de HTTP, SSE, WebSocket, GraphQL, MCP y gRPC.

## Licencia

MIT.
