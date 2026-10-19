---
sidebar_position: 2
title: "Instalación"
description: "Instala @powerduck/openapi-codegen con npm, yarn o pnpm y úsalo en Node.js o en el navegador. Requiere Node.js 22.12.0 o posterior."
---

# Instalación

## Requisitos

- **Node.js**: `>= 22.12.0` (declarado en el campo `engines` del paquete), para usarlo en Node.js.
- Un documento OpenAPI **ya analizado**, representado como objeto JavaScript, no como cadena JSON/YAML sin procesar.
- Un navegador moderno con la API Fetch para el uso en navegador.

El paquete incluye compilaciones ESM (`dist/index.js`) y CommonJS (`dist/index.cjs`), con declaraciones TypeScript. No tiene **dependencias de ejecución**.

## npm

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## pnpm

```bash npm2yarn2pnpm
pnpm add @powerduck/openapi-codegen
```

## Yarn

```bash npm2yarn2pnpm
yarn add @powerduck/openapi-codegen
```

## Uso en Node.js

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

Los generadores integrados se **registran automáticamente al importar el módulo**, por lo que `generate` funciona sin configuración adicional.

## Uso en el navegador

La biblioteca es compatible con navegadores y no utiliza módulos internos de Node.js. Cárgala desde una CDN ESM y úsala directamente:

```html
<script type="module">
  import { generate, list } from "https://esm.sh/@powerduck/openapi-codegen";

  const document = {
    openapi: "3.1.0",
    info: { title: "Example API", version: "1.0.0" },
    servers: [{ url: "https://api.example.com" }],
    paths: {
      "/hello": { get: { responses: { "200": { description: "OK" } } } },
    },
  };

  const code = generate({
    document,
    path: "/hello",
    method: "get",
    language: "javascript",
    client: "fetch",
  });

  console.log(code);
</script>
```

También funciona directamente con Vite, esbuild y webpack; la compilación ESM permite eliminar código no utilizado mediante tree shaking.

## Proporcionar el documento

Pasa un objeto ya analizado. Para JSON:

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

Para YAML, analízalo primero con un paquete YAML independiente:

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## Estructura del paquete

| Entrada | Ruta |
|-------|------|
| Entrada ESM | `dist/index.js` |
| Entrada CommonJS | `dist/index.cjs` |
| Definiciones de tipos | `dist/index.d.ts` |

No hay un ejecutable CLI; la biblioteca solo se usa desde código.

## Siguientes pasos

- [Inicio rápido](/docs/es-ES/openapi-codegen/quickstart/) — genera tu primer fragmento de código.
- [Configuración](/docs/es-ES/openapi-codegen/configuration/) — todas las opciones de generación.
