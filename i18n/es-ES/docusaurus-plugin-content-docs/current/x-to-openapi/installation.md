---
sidebar_position: 2
title: "Instalación"
description: "Instala @powerduck/x-to-openapi con npm, yarn o pnpm. ESM con compatibilidad CommonJS y funciones curlToOpenApi y postmanToOpenApi sin configuración."
---

# Instalación

Instala `@powerduck/x-to-openapi` con tu gestor de paquetes preferido.

## Requisitos

- **Node.js:** `>= 22.12.0`
- **TypeScript:** opcional; el paquete incluye todas las definiciones de tipos.

## Instalación

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## Dependencias de ejecución

| Paquete | Versión | Uso |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Tipos canónicos de OpenAPI y validación del resultado |
| `curlconverter` | `^4.12.0` | Análisis de comandos curl como solicitudes estructuradas |

Ambas dependencias se instalan automáticamente.

---

## Sistema de módulos: ESM con compatibilidad CJS

El paquete declara `"type": "module"` y ofrece ambas compilaciones desde un único punto de entrada:

| Compilación | Condición | Archivo |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| Tipos | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

El paquete declara `"sideEffects": false`, por lo que tree shaking elimina los adaptadores no utilizados.

---

## Funciones sin configuración

La mayoría de los usuarios solo necesita dos funciones. Estas crean una instancia de [`XToOpenApi`](/docs/es-ES/x-to-openapi/api-reference/#xtoopenapi), registran el adaptador correspondiente y llaman a `convert`:

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

Usa la clase [`XToOpenApi`](/docs/es-ES/x-to-openapi/api-reference/#xtoopenapi) completa si necesitas opciones personalizadas, varios adaptadores, detección `"auto"` o un adaptador propio.

---

## Verificación

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## Siguientes pasos

- [Inicio rápido](/docs/es-ES/x-to-openapi/quickstart/) — convierte un comando curl y una colección Postman, y registra un adaptador personalizado.
- [Referencia de la API](/docs/es-ES/x-to-openapi/api-reference/) — todas las exportaciones y opciones.
