---
sidebar_position: 1
title: "@powerduck/conf-patch"
description: "@powerduck/conf-patch edita configuraciones con una arquitectura de dos capas. Aplica la semántica de RFC 6902 JSON Patch a cadenas JSON, JSONC y YAML, conserva comentarios y formato, y añade escrituras atómicas y bloqueos entre procesos para Node.js y Electron."
---

# @powerduck/conf-patch

**@powerduck/conf-patch** edita configuraciones con una **arquitectura de dos capas**. Aplica la semántica de [RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) a cadenas JSON, JSONC y YAML, conserva comentarios y formato, y añade escrituras atómicas y bloqueos entre procesos para Node.js y Electron.

- **Versión:** <img src="https://img.shields.io/npm/v/@powerduck/conf-patch"/>
- **Licencia:** MIT
- **Requisito de Node.js:** `>= 22.12.0`
- **Código fuente:** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## ¿Por qué conf-patch?

Editar archivos de configuración mediante código suele obligar a elegir entre serializar todo el documento, lo que puede alterar comentarios y formato, o manipular texto de forma frágil. conf-patch ofrece:

- **Ediciones incrementales que conservan los comentarios** para JSON/JSONC con `jsonc-parser` y modificaciones del AST para YAML con `yaml`. JSON/JSONC evita la serialización completa; YAML vuelve a serializar el AST modificado.
- **Escrituras atómicas** mediante un archivo temporal y su renombrado, para evitar archivos de destino escritos parcialmente.
- **Bloqueos entre procesos** con tokens de propiedad, reintentos con espera exponencial y recuperación de bloqueos obsoletos.
- **Una API versátil:** la capa principal también funciona en navegadores, funciones Edge y aplicaciones con almacenamiento IndexedDB.

---

## Arquitectura de dos capas

```
┌──────────────────────────────────────────────────────────────┐
│                     Application code                          │
├──────────────────────────────────────────────────────────────┤
│  File layer (Node.js / Electron only)                         │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐  │
│  │ readConfigFile │ │ writeConfigFile│ │ patchConfigFile   │  │
│  │ setConfigValue │ │ deleteConfig…  │ │ withFileLock     │  │
│  └──────┬────────┘ └───────┬────────┘ └────────┬─────────┘  │
│         │                  │                   │            │
│  ┌──────▼──────────────────▼───────────────────▼───────────┐ │
│  │           Core layer (browser-safe, zero Node deps)      │ │
│  │  patchContent   setContentValue   deleteContentValue     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Capa principal — `@powerduck/conf-patch/core` (compatible con navegadores)

Funciones puras que trabajan con **cadenas**, sin `node:fs`, `node:path` ni API específicas de Node.js. Esta subruta se puede incluir en código para navegadores, funciones Edge o service workers.

| Función | Finalidad |
|---|---|
| [`patchContent`](../api-reference/#patchcontent) | Aplicar operaciones RFC 6902 a una cadena de configuración |
| [`setContentValue`](../api-reference/#setcontentvalue) | Establecer o crear un valor anidado (con `add`) |
| [`deleteContentValue`](../api-reference/#deletecontentvalue) | Eliminar una clave o un elemento de un array (con `remove`) |

### Capa de archivos — `@powerduck/conf-patch` (Node.js / Electron)

Funciones asíncronas que leen y escriben archivos y añaden escrituras atómicas y bloqueos a la capa principal.

| Función | Finalidad |
|---|---|
| [`readConfigFile`](../api-reference/#readconfigfile) | Leer texto UTF-8 desde una ruta o una URL `file://` |
| [`writeConfigFile`](../api-reference/#writeconfigfile) | Escribir contenido de forma atómica, con bloqueo opcional |
| [`patchConfigFile`](../api-reference/#patchconfigfile) | Ejecutar una transacción de lectura, modificación y escritura bajo bloqueo |
| [`setConfigValue`](../api-reference/#setconfigvalue) | Establecer un valor anidado en un archivo |
| [`deleteConfigValue`](../api-reference/#deleteconfigvalue) | Eliminar un valor anidado de un archivo |
| [`withFileLock`](../api-reference/#withfilelock) | Ejecutar una tarea bajo un bloqueo exclusivo |
| [`releaseAllLocalLocks`](../api-reference/#releasealllocallocks) | Liberar todos los bloqueos del proceso actual |

---

## Formatos admitidos

| Formato | Extensión | Comportamiento |
|---|---|---|
| **JSON** | `.json` | JSON estándar. Ediciones incrementales con `jsonc-parser`. |
| **JSONC** | `.jsonc` | JSON con comentarios y comas finales. Conserva los comentarios. |
| **YAML** | `.yaml`, `.yml` | YAML 1.2. Las modificaciones del AST conservan comentarios, anclas y sangría. |

[`detectFormat`](../api-reference/#detectformat) asocia extensiones a un [`ConfigFormat`](../api-reference/#configformat). Cualquier otra extensión provoca un error, salvo que se indique `format` explícitamente.

---

## Operaciones RFC 6902

conf-patch implementa un subconjunto de RFC 6902. Solo admite estas operaciones:

| `op` | Comportamiento |
|---|---|
| `"add"` | Insertar en un índice de array o añadir/reemplazar una propiedad de objeto |
| `"replace"` | Reemplazar un valor existente; la ruta debe existir |
| `"remove"` | Eliminar una clave o un elemento existente; la ruta debe existir |

:::caution
`"move"`, `"copy"` y `"test"` **no se admiten**. El tipo [`JsonPatchOp`](../api-reference/#jsonpatchop) limita `op` a `"add" | "replace" | "remove"`.
:::

Detalles del comportamiento:

- `add` en un índice de array **inserta** un elemento (RFC 6902). Para reemplazar uno existente, usa `replace`.
- `add` requiere que la ruta padre exista. Crea los padres antes que los hijos.
- `replace` y `remove` requieren que la ruta de destino exista.
- Con `strict: true` (valor predeterminado), una operación fallida lanza una excepción. Con `strict: false`, se omite y se registra una advertencia.

---

## Conservación de comentarios y formato

- **JSON/JSONC:** los cambios se calculan como rangos de texto a partir del árbol sintáctico, sin alterar los comentarios cercanos, las comas finales ni la sangría.
- **YAML:** el AST de `yaml` se modifica y vuelve a serializar, conservando comentarios, anclas, alias y sangría.

---

## Validación de OpenAPI

conf-patch valida documentos OpenAPI/Swagger mediante una interfaz protegida sobre `@powerduck/openapi-parser`:

- [`validateOpenAPISpec`](../api-reference/#validateopenapispec) valida contenido JSON o YAML sin procesar.
- [`validateOpenAPIFile`](../api-reference/#validateopenapifile) valida un documento a partir de su ruta.
- El tratamiento de entradas aplica límites de tamaño, restricciones de rutas (`allowedRootDirectory`), controles de complejidad, plazos y cancelación con `AbortSignal`.
- Los fallos lanzan [`OpenApiValidationError`](../api-reference/#openapivalidationerror) con un `code` interpretable por programas.

---

## Próximos pasos

- [Instalación](../installation/) — añadir conf-patch y conocer sus dos puntos de entrada.
- [Inicio rápido](../quickstart/) — modificar una cadena en el navegador y un archivo en disco.
- [Referencia de la API](../api-reference/) — todas las exportaciones, tipos y opciones.
- [Ejemplos](../examples/) — ejemplos ejecutables de JSON, YAML, JSONC, validación OpenAPI y bloqueos.
