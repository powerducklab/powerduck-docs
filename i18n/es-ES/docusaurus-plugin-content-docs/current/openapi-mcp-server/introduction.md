---
sidebar_position: 1
title: "Introducción"
description: "Convierta OpenAPI en servicios MCP: herramientas, prompts y recursos, consola web, stdio, HTTP y CLI openapi-mcp."
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — Introducción

`@powerduck/openapi-mcp-server` convierte un documento OpenAPI en un servicio MCP (Model Context Protocol) en ejecución. Genera **herramientas** a partir de las operaciones, **prompts** a partir de los metadatos y las operaciones de la API, y **recursos** a partir del catálogo. Los ofrece mediante MCP e incluye una interfaz web de administración.

- **Nombre del paquete:** `@powerduck/openapi-mcp-server`
- **Versión:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **Licencia:** MIT
- **Versión de Node:** `>=22.12.0`
- **Ejecutable CLI:** `openapi-mcp`
- **Formato de módulos:** Distribuciones ESM y CommonJS con declaraciones de tipos incluidas.

Utiliza `@powerduck/openapi-parser` para validar y resolver referencias, y `@modelcontextprotocol/sdk` para el protocolo.

## Contenido generado

- **Tools** — Una herramienta MCP por operación OpenAPI, con serialización completa de parámetros (estilos path/query/header/cookie y reglas explode), codificación del cuerpo (JSON, form-urlencoded, multipart, texto y binario) y anotaciones MCP (`readOnlyHint`, `destructiveHint`, `idempotentHint`).
- **Prompts** — Prompts globales (`spec_overview`, `integration_guardrails`) y por operación (`explain_*`, `plan_*`, `sample_*`).
- **Resources** — Recursos de catálogo fijos, como `openapi://spec/summary`, `openapi://catalog/tools` y `openapi://spec/document`.

## Transportes

- **stdio** — `startStdioServer()` sirve un documento a un cliente MCP local, como Claude Desktop o una integración de editor.
- **HTTP** — `attachMcpRoutes(app, options)` monta Streamable HTTP en `/mcp` y, opcionalmente, SSE heredado en `/sse` dentro de su aplicación Express. Sus opciones controlan límites de sesiones, tiempos de inactividad, CORS y protección frente a DNS rebinding. `startAdminServer()` añade la interfaz de administración y utiliza los límites de sesiones predeterminados. `attachSseRoutes()` sigue disponible como envoltorio obsoleto con argumentos posicionales.

## Servidor de administración

`startAdminServer()` inicia una aplicación Express que ofrece:

- una consola web para cargar o pegar especificaciones, inspeccionar herramientas, prompts y recursos, y consultar servicios activos y registros de solicitudes;
- los transportes HTTP de MCP;
- autenticación por clave API, registros de solicitudes con ocultación de cabeceras sensibles y persistencia opcional del estado.

## Instalación

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## Inicio rápido

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## Siguientes pasos

- [Instalación](../installation/) — npm/yarn/pnpm, instalación global, subruta `./server` y dependencias.
- [Inicio rápido](../quickstart/) — Uso mediante CLI y desde el código.
- [Configuración](../configuration/) — Descripción completa de `ServerConfig`.
- [Referencia de la API](../api-reference/) — Todas las exportaciones y los comandos CLI.
- [Ejemplos](../examples/) — Casos prácticos.

## Licencia

MIT.
