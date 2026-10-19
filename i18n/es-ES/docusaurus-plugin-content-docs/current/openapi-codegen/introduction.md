---
sidebar_position: 1
title: "Introducción"
description: "Genera ejemplos HTTP ejecutables desde OpenAPI con @powerduck/openapi-codegen: 21 lenguajes, 41 clientes, compatible con navegadores y sin dependencias en ejecución."
---

# Introducción

`@powerduck/openapi-codegen` es una biblioteca TypeScript que convierte una operación OpenAPI en **código de ejemplo HTTP ejecutable** con el lenguaje y cliente HTTP que elijas. Está diseñada para sitios de documentación API, portales de desarrolladores, exploradores de API, herramientas CLI y generación de código durante la compilación.

Admite **21 lenguajes** y **41 combinaciones de lenguaje y cliente**, es **compatible con navegadores** y no tiene **dependencias en tiempo de ejecución**.

## Por qué usar openapi-codegen

- **Sin dependencias en ejecución** — funciona en navegadores, Node.js, Electron y entornos edge sin módulos integrados de Node.
- **Dos formatos de módulos** — versiones ESM nativa y CommonJS (`require()`).
- **OpenAPI 3.0 / 3.1 / 3.2** — procesa objetos de documento ya analizados. Admite JSON y YAML si se analizan antes de llamar a `generate()`.
- **41 generadores integrados** en 21 lenguajes, registrados automáticamente al importar.
- **Serialización completa de parámetros** — ruta, query, header y cookie con las reglas OpenAPI `style` / `explode` / `allowReserved`.
- **Esquemas de seguridad** — clave API en header, query o cookie, HTTP bearer y HTTP basic.
- **Tipos de cuerpo** — JSON, texto plano, formulario codificado en URL y `multipart/form-data`.
- **Resolución de `$ref`** — referencias JSON Pointer dentro del documento, con caché, encadenamiento y detección de ciclos.
- **Ejemplos automáticos** — infiere valores desde JSON Schema (`example`, `enum`, `default`, tipos, formatos y restricciones).
- **Plugins** — registra generadores personalizados con `register()` o `use()`.

## Cómo funciona

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize` resuelve las `$ref`, combina parámetros de ruta y operación, elige el tipo de contenido del cuerpo, genera valores de ejemplo, resuelve esquemas de seguridad y produce un `RequestIR` normalizado.
2. El `Generator` seleccionado recibe el `RequestIR` y devuelve una cadena de código fuente ejecutable.

Normalmente basta con llamar a `generate({...})`, que realiza ambos pasos.

## Ejemplo básico

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## Siguientes pasos

- [Instalación](/docs/es-ES/openapi-codegen/installation/) — npm / yarn / pnpm y uso en el navegador.
- [Inicio rápido](/docs/es-ES/openapi-codegen/quickstart/) — Genera tu primer fragmento y consulta los generadores.
- [Configuración](/docs/es-ES/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Referencia de API](/docs/es-ES/openapi-codegen/api-reference/) — Todas las exportaciones y la lista completa de lenguajes y clientes.
- [Ejemplos](/docs/es-ES/openapi-codegen/examples/) — fetch, Python requests, cURL, generadores personalizados, plugins y `RequestIR` directo.
