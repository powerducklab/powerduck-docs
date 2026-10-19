---
sidebar_position: 2
title: "Instalación"
description: "Instala @powerduck/openapi-cli de forma global, como dependencia de desarrollo o con npx. Requiere Node.js 22.12.0 o posterior."
---

# Instalación

## Requisitos

- **Node.js**: `>= 22.12.0` (declarado en el campo `engines` del paquete).
- Un gestor de paquetes: npm, yarn o pnpm.

El paquete incluye compilaciones ESM (`dist/index.js`) y CommonJS (`dist/index.cjs`), junto con declaraciones TypeScript (`dist/index.d.ts`). No hacen falta paquetes `@types` adicionales.

## Instalación global (recomendada para la CLI)

La instalación global añade el ejecutable `openapi-cli` a tu `PATH`:

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

Comprueba el ejecutable:

```bash
openapi-cli --help
```

## Instalación en el proyecto (recomendada para CI)

Fija la versión dentro del proyecto para que CI utilice una versión conocida:

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

Después, ejecuta el comando mediante el gestor de paquetes:

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## Ejecución puntual con npx

Sin instalación previa:

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## Estructura del paquete

| Entrada | Ruta |
|-------|------|
| Entrada ESM | `dist/index.js` |
| Entrada CommonJS | `dist/index.cjs` |
| Definiciones de tipos | `dist/index.d.ts` |
| Entrada CLI (bin) | `dist/cli.js` |
| Nombre del ejecutable | `openapi-cli` |

El paquete declara `"type": "module"` y solo expone las subrutas `.` y `./package.json`.

## Importación programática

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## Dependencias de ejecución

El paquete publicado depende de:

- `@powerduck/openapi-parser` (`^0.3.12`) — resolución de referencias `$ref` internas.
- `@powerduck/openapi-request` (`0.2.22`) — ejecución de solicitudes de protocolo.
- `commander` (`^12.1.0`) — análisis de argumentos de la CLI.
- `https-proxy-agent` (`^5.0.1`) — soporte de proxy para el transporte HTTP.

## Siguientes pasos

- [Inicio rápido](/docs/es-ES/openapi-cli/quickstart/) — ejecuta tu primera batería de pruebas.
- [Comandos](/docs/es-ES/openapi-cli/commands/) — referencia completa de opciones.
