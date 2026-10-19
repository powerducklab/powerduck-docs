---
sidebar_position: 2
title: "Instalación"
description: "Instala @powerduck/conf-patch y elige entre la entrada de archivos para Node.js y la subruta ./core compatible con navegadores."
---

# Instalación

Instala `@powerduck/conf-patch` con tu gestor de paquetes preferido.

## Requisitos

- **Node.js:** `>= 22.12.0`
- **TypeScript:** opcional; el paquete incluye todas las declaraciones de tipos, sin necesidad de `@types/...`.

## Instalación

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## Dependencias de ejecución

conf-patch incluye tres dependencias de ejecución que se instalan automáticamente:

| Paquete | Versión | Uso |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Validación OpenAPI/Swagger (`validateOpenAPISpec`, `validateOpenAPIFile`). |
| `jsonc-parser` | `^3.3.1` | Ediciones incrementales de texto en JSON y JSONC. |
| `yaml` | `^2.9.0` | Análisis y modificación del AST de YAML. |

No necesitas utilizar estas dependencias directamente.

## Dos puntos de entrada

El paquete ofrece **dos exportaciones de subrutas**. Elige según tu entorno.

### Entrada principal — `@powerduck/conf-patch`

Incluye la **capa de archivos** (`readConfigFile`, `writeConfigFile`, `patchConfigFile`, `setConfigValue`, `deleteConfigValue`, `withFileLock`, `releaseAllLocalLocks`), la capa de núcleo y la validación OpenAPI. Úsala en Node.js y Electron. Depende de `node:fs`, `node:path` y `node:crypto`.

### Subruta del núcleo — `@powerduck/conf-patch/core`

Exporta **solo el núcleo compatible con navegadores**: `patchContent`, `setContentValue`, `deleteContentValue`, utilidades de aserción y tipos del núcleo. No depende de Node.js y puede empaquetarse para navegadores, Edge Functions y service workers.

:::tip
Para el navegador, importa siempre desde `@powerduck/conf-patch/core`. Así evitas incluir la capa de archivos y `node:fs` en el bundle.
:::

## Sistema de módulos: CJS y ESM

El paquete **no** declara `"type": "module"`, por lo que los archivos `.js` son CommonJS de forma predeterminada. El mapa `exports` de `package.json` dirige explícitamente las condiciones `import` y `require` a la compilación correcta.

| Entrada | CJS (`require`) | ESM (`import`) | Tipos |
|---|---|---|---|
| Entrada principal | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| Subruta del núcleo | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS (Node.js o proceso principal de Electron)

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules (Node.js moderno, navegadores y empaquetadores)

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## Verificar la instalación

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## Siguientes pasos

- [Inicio rápido](/docs/es-ES/conf-patch/quickstart/) — modifica una cadena en el navegador y un archivo en disco.
- [Referencia de API](/docs/es-ES/conf-patch/api-reference/) — todas las exportaciones, tipos y opciones.
