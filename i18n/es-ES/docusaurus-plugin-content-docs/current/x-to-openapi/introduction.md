---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi es un framework TypeScript extensible que convierte comandos curl y colecciones de Postman (v2.0 / v2.1.0) en documentos OpenAPI 3.2. Está pensado para pipelines de CI, generación de documentación API y reconstrucción de interfaces a partir de solicitudes HTTP."
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** es un framework TypeScript extensible que convierte **comandos curl** y **colecciones de Postman (v2.0 / v2.1.0)** en documentos **OpenAPI 3.2**. Está pensado para pipelines de CI, generación de documentación API y reconstrucción de interfaces a partir de solicitudes HTTP.

Utiliza [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) para validar documentos.

- **Versión:** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **Licencia:** MIT
- **Requisito de Node.js:** `>= 22.12.0`
- **Salida:** solo OpenAPI **3.2.0**
- **Código fuente:** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## Cómo funciona

```text
comando curl → CurlAdapter
colección de Postman → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → documento OpenAPI 3.2
             ↓
     validateOpenApi32() → diagnósticos
```

1. Un **adaptador** analiza la fuente, como texto curl o una colección de Postman, y produce una lista de objetos [`NormalizedRequest`](./api-reference.md#normalizedrequest).
2. El **generador** combina solicitudes por método y ruta, infiere esquemas, parámetros de ruta y seguridad, y genera un documento OpenAPI 3.2.
3. El **validador** comprueba la salida frente al esquema OpenAPI mediante `@powerduck/openapi-parser` y devuelve diagnósticos.

---

## Funciones

- **Dos adaptadores integrados:** [`CurlAdapter`](./api-reference.md#curladapter) admite comandos individuales, lotes y la salida «Copy all as cURL» del navegador; [`PostmanAdapter`](./api-reference.md#postmanadapter) admite v2.0/v2.1.0, carpetas anidadas y autenticación heredada.
- **Funciones sin configuración:** [`curlToOpenApi`](./api-reference.md#curltoopenapi) y [`postmanToOpenApi`](./api-reference.md) registran un adaptador y convierten en una sola llamada.
- **Salida OpenAPI 3.2:** cada documento declara `openapi: "3.2.0"`. La validación está activada por defecto. Revisa los diagnósticos o activa el modo estricto para rechazar errores.
- **Combinación de solicitudes:** se combinan operaciones con el mismo método y ruta; los parámetros de consulta, cabeceras, cookies y esquemas de cuerpo se fusionan por estructura.
- **Inferencia de parámetros de ruta:** los ID numéricos, UUID, ULID y segmentos hexadecimales largos se convierten en plantillas como `/users/{userId}` cuando varían en al menos N muestras.
- **Inferencia de seguridad:** detecta Bearer, Basic y claves API en cabeceras, consultas o cookies, con los `securitySchemes` correspondientes.
- **Distintos tipos de cuerpo:** JSON, XML, form-urlencoded, multipart/form-data con texto y archivos, GraphQL, texto y binario.
- **Conservación de pruebas de Postman:** `pm.test()` / `pm.expect()` se incluyen como `x-postman-scripts` en cada operación.
- **Diagnósticos:** cada problema tiene gravedad, código y detalles de origen cuando están disponibles; el modo [`strict`](./api-reference.md#convertoptions) lanza una excepción ante errores.
- **Extensible:** implementa [`SourceAdapter`](./api-reference.md) para añadir fuentes HAR, HTTPie o Insomnia.

---

## Arquitectura de plugins

El framework se basa en una pequeña interfaz de adaptador:

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

Los adaptadores se registran en una instancia [`XToOpenApi`](./api-reference.md#xtoopenapi) mediante [`AdapterRegistry`](./api-reference.md#adapterregistry):

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

Las funciones sin configuración ya incluyen ambos adaptadores, por lo que normalmente no hace falta utilizar el registro directamente.

---

## ¿Funciones auxiliares o clase?

| Caso de uso | API |
|---|---|
| Convertir un comando curl o un lote | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| Convertir una colección de Postman como objeto o cadena | [`postmanToOpenApi`](./api-reference.md) |
| Opciones personalizadas, varios adaptadores, detección `"auto"` o un adaptador propio | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## Próximos pasos

- [Instalación](./installation.md) — añadir el paquete y conocer las funciones sin configuración.
- [Inicio rápido](./quickstart.md) — convertir comandos curl y colecciones de Postman, y usar un adaptador propio.
- [Referencia de la API](./api-reference.md) — todas las exportaciones, tipos, opciones, valores predeterminados y códigos de diagnóstico.
- [Ejemplos](./examples.md) — curl, lotes de comandos, colecciones de Postman, adaptadores propios e inferencia de rutas.
