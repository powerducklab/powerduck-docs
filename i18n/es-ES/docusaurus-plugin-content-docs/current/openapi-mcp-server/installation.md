---
sidebar_position: 2
title: "Instalación"
description: "Instala @powerduck/openapi-mcp-server con npm, yarn o pnpm, o globalmente. Incluye la CLI openapi-mcp y la subruta ./server; requiere Node.js 22.12.0 o posterior."
---

# Instalación

## Requisitos

- **Node.js `>=22.12.0`** (declarado en `engines`).

## Instalación

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

El paquete registra el ejecutable `openapi-mcp`.

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

La CLI tiene un único comando `serve` (consulta [Inicio rápido](/docs/es-ES/openapi-mcp-server/quickstart/)).

## ESM / CommonJS

Se incluyen compilaciones para ambos formatos y declaraciones de tipos. No se necesitan paquetes `@types/*` adicionales:

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## Exportación de subrutas

| Importación | Contenido |
| --- | --- |
| `@powerduck/openapi-mcp-server` | Biblioteca principal: carga de especificaciones, generación de herramientas, prompts y recursos, ejecución de solicitudes, creación del servidor MCP y transportes stdio y HTTP. |
| `@powerduck/openapi-mcp-server/server` | Servidor HTTP de administración y middleware de autenticación (`startAdminServer`, `createAuthMiddleware`). |

## Dependencias de ejecución

Se instalan automáticamente con el paquete:

- `@modelcontextprotocol/sdk` — implementación del protocolo MCP.
- `@powerduck/openapi-parser` — validación, resolución de referencias y actualización de OpenAPI.
- `express` y `cors` — servidor HTTP de administración y CORS.
- `axios` — cliente HTTP para ejecutar las herramientas contra el servidor de destino.
- `commander` — framework de la CLI.
- `js-yaml` — análisis de YAML.
- `multer` — gestión de la carga de especificaciones.
- `terser` — minificación de los recursos de la interfaz web integrada.

## Verificación

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## Siguientes pasos

- [Inicio rápido](/docs/es-ES/openapi-mcp-server/quickstart/)
- [Configuración](/docs/es-ES/openapi-mcp-server/configuration/)
