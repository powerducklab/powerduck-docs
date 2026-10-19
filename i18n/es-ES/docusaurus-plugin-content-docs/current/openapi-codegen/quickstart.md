---
sidebar_position: 3
title: "Inicio rápido"
description: "Genera tu primer ejemplo de petición ejecutable con @powerduck/openapi-codegen y consulta los generadores disponibles."
---

# Inicio rápido

Esta guía muestra cómo generar un ejemplo de petición ejecutable y descubrir los generadores disponibles.

## 1. Instalación

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. Generar a partir de un documento

Pasa un documento OpenAPI **ya analizado** junto con `path`, `method`, `language` y `client`. `generate()` devuelve el código fuente como cadena.

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

Equivalente en CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. Consultar los generadores disponibles

`list()` devuelve los descriptores de todos los generadores registrados:

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

Cada descriptor tiene la forma `{ language: string; client: string }`. Los identificadores distinguen entre mayúsculas y minúsculas; cópialos exactamente de la lista de generadores de la referencia de API. [Referencia de API](/docs/es-ES/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

También puedes seleccionar un generador mediante código:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. Proporcionar credenciales

Usa `securityValues` para completar los esquemas de seguridad con nombre. Las claves deben coincidir con los nombres de los esquemas del documento:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. Cambiar la URL del servidor

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## Gestión de errores

`generate()` lanza una excepción si faltan datos o el generador no está soportado. Al procesar documentos no confiables, captura las excepciones:

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## Siguientes pasos

- [Configuración](/docs/es-ES/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Ejemplos](/docs/es-ES/openapi-codegen/examples/) — JavaScript fetch, Python requests, cURL, generadores personalizados, plugins y uso directo de `RequestIR`.
- [Referencia de API](/docs/es-ES/openapi-codegen/api-reference/) — Todas las exportaciones.
