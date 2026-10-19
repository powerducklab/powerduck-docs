---
sidebar_position: 4
title: "Referencia de la API"
description: "Referencia completa de @powerduck/conf-patch, con las firmas y los valores predeterminados de cada símbolo exportado."
---

# Referencia de la API

Referencia completa de `@powerduck/conf-patch`, con las firmas y los valores predeterminados de cada símbolo exportado.

Hay dos puntos de entrada:

- **`@powerduck/conf-patch`** — todo lo indicado a continuación: capa principal, archivos, validación OpenAPI y utilidades.
- **`@powerduck/conf-patch/core`** — solo el subconjunto compatible con navegadores: `patchContent`, `setContentValue`, `deleteContentValue`, `PatchContentOptions`, las funciones de aserción y los tipos `ConfigFormat`, `JsonPatchOp`, `JsonPathSegment`.

---

## Capa principal (compatible con navegadores)

### `patchContent`

Aplica una lista de operaciones RFC 6902 a una cadena de configuración. Es una función pura, sin acceso al sistema de archivos.

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `content` | `string` | Contenido de configuración sin procesar. Debe ajustarse al `format` indicado. |
| `ops` | `JsonPatchOp[]` | Operaciones que se aplican en orden. Un array vacío devuelve `content` sin cambios. |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`. |
| `options.strict` | `boolean` | Con `true` (predeterminado), una operación fallida lanza una excepción. Con `false`, se omite y se notifica mediante `console.warn`. |

**Devuelve:** el contenido de configuración modificado (`string`).

**Excepciones:** `TypeError` si `content` no es una cadena o `ops` no es válido; un error que describe la operación fallida cuando `strict` es `true`.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

patchContent(
  '{"name": "app"}',
  [{ op: "add", path: ["version"], value: "1.0.0" }],
  "json",
);
// => '{\n  "name": "app",\n  "version": "1.0.0"\n}'
```

---

### `setContentValue`

Establece o crea un valor. Internamente llama a `patchContent` con una operación `add`. Según RFC 6902, `add` reemplaza una propiedad de objeto existente o inserta en un índice de array.

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `content` | `string` | Contenido de configuración sin procesar. |
| `path` | `readonly (string \| number)[]` | Ruta por segmentos, por ejemplo `["server", "port"]`. No puede estar vacía. |
| `value` | `unknown` | Valor que se escribirá. |
| `format` | `ConfigFormat` | Formato de configuración. |

**Devuelve:** el contenido actualizado (`string`).

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

Elimina una clave o un elemento de array. Internamente llama a `patchContent` con una operación `remove`. La ruta debe existir.

```typescript
function deleteContentValue(
  content: string,
  path: readonly (string | number)[],
  format: ConfigFormat,
): string;
```

```typescript
deleteContentValue(
  '{"name": "app", "legacy": true}',
  ["legacy"],
  "json",
);
```

---

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  /** When true, failed operations throw. When false, they are skipped with a warning. Default: true */
  strict?: boolean;
}
```

---

## Capa de archivos (solo Node.js / Electron)

### `readConfigFile`

Lee texto UTF-8 desde una ruta local o una URL `file://`.

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `filePath` | `string` | Ruta absoluta, relativa o URL `file://`. No puede estar vacía. |

**Devuelve:** el contenido UTF-8 sin procesar (`Promise<string>`).

**Excepciones:** si no se puede leer el archivo, un error que incluye el fallo subyacente del sistema de archivos.

---

### `writeConfigFile`

Escribe contenido de forma **atómica** mediante un archivo temporal y su renombrado, con un **bloqueo de archivo** exclusivo por defecto. Los directorios padre se crean antes de adquirir el bloqueo.

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `filePath` | `string` | Ruta del archivo de configuración. |
| `content` | `string` | Contenido que se escribirá. Debe ser una cadena. |
| `options` | `WriteConfigOptions` | Consulta la sección siguiente. |

**Excepciones:** `TypeError` por entradas inválidas; los fallos de escritura del sistema de archivos se encapsulan.

#### `WriteConfigOptions`

| Opción | Tipo | Valor predeterminado | Descripción |
|---|---|---|---|
| `lock` | `boolean` | `true` | Activar el bloqueo durante la escritura. |
| `lockTimeoutMs` | `number` | Predeterminado de `withFileLock` (10 s) | Tiempo máximo para adquirir el bloqueo, en milisegundos. |
| `lockRetryDelayMs` | `number` | Predeterminado de `withFileLock` (25 ms) | Espera inicial entre reintentos, en milisegundos, antes del incremento exponencial. |
| `lockStaleThresholdMs` | `number` | Predeterminado de `withFileLock` | Antigüedad del bloqueo, en milisegundos, a partir de la cual se permite recuperarlo. |
| `allowStaleRecovery` | `boolean` | `false` | Permitir la recuperación automática de bloqueos obsoletos. |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

Transacción principal de la capa de archivos: lee bajo bloqueo, aplica `patchContent` y vuelve a escribir de forma atómica **solo si el contenido cambió**. Si se omite `options.format`, el formato se detecta por la extensión.

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `filePath` | `string` | Ruta del archivo de configuración. No puede estar vacía. |
| `ops` | `JsonPatchOp[]` | Operaciones que se aplicarán. Un array vacío devuelve el control sin leer ni escribir. |
| `options` | `PatchConfigOptions` | Consulta la sección siguiente. |

**Excepciones:** `TypeError` si `filePath` está vacío, las opciones de bloqueo no son válidas o no se detecta el formato y no se proporciona `format`; el error de la operación cuando `strict` es `true`.

#### `PatchConfigOptions`

| Opción | Tipo | Valor predeterminado | Descripción |
|---|---|---|---|
| `format` | `ConfigFormat` | detección automática | Formato explícito, con prioridad sobre la detección por extensión. |
| `strict` | `boolean` | `true` | Las operaciones fallidas lanzan excepciones. |
| `lock` | `boolean` | `true` | Activar el bloqueo de archivos. |
| `lockTimeoutMs` | `number` | 10 s | No negativo. Espera máxima para adquirir el bloqueo. |
| `lockRetryDelayMs` | `number` | 25 ms | Positivo. Espera inicial entre reintentos. |
| `lockStaleThresholdMs` | `number` | calculado | Positivo. Antigüedad necesaria para recuperar un bloqueo obsoleto. |
| `allowStaleRecovery` | `boolean` | `false` | Recuperar automáticamente bloqueos obsoletos. |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

Añade o reemplaza un valor anidado en un archivo. Delega una operación `add` en `patchConfigFile`.

```typescript
function setConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  value: unknown,
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await setConfigValue("config.yaml", ["database", "port"], 5432);
```

---

### `deleteConfigValue`

Elimina un valor anidado existente de un archivo. Delega una operación `remove` en `patchConfigFile`.

```typescript
function deleteConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await deleteConfigValue("config.json", ["features", "betaPreview"]);
```

---

### `withFileLock`

Ejecuta una función asíncrona mediante una cola local al proceso **y** un archivo de bloqueo exclusivo (`<file>.confedit.lock`). Los bloqueos utilizan tokens de propiedad. Solo se recupera un bloqueo obsoleto si `allowStaleRecovery` es `true` y su antigüedad supera `staleThresholdMs`. No se comprueban los PID porque pueden reutilizarse.

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `filePath` | `string` | Archivo que se bloqueará. |
| `callback` | `() => Promise<T>` | Trabajo que se ejecutará mientras se mantiene el bloqueo. |
| `options` | `FileLockOptions` | Consulta la sección siguiente. |

**Devuelve:** el resultado de `callback` (`Promise<T>`). El bloqueo siempre se libera en un bloque `finally`, incluso si la función lanza una excepción.

#### `FileLockOptions`

| Opción | Tipo | Valor predeterminado | Descripción |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | Espera máxima del bloqueo en milisegundos. Debe ser no negativa. |
| `retryDelayMs` | `number` | `25` | Espera inicial en milisegundos. Debe ser positiva. Aumenta por un factor de 1,5 hasta un máximo de 1000 ms. |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | Antigüedad que permite recuperar el bloqueo, en milisegundos. Debe ser positiva. |
| `allowStaleRecovery` | `boolean` | `false` | Recuperación automática de bloqueos obsoletos. Desactivada por defecto para el proceso principal único de Electron, para no interrumpir transacciones activas. |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

Elimina todos los archivos de bloqueo del proceso actual. Úsala al cerrar la aplicación, una vez terminadas las transacciones activas. Para una limpieza asíncrona en Electron, impide el primer cierre y reanúdalo tras completar la limpieza, como muestran los ejemplos. Los fallos individuales se ignoran.

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## Validación de OpenAPI

### `validateOpenAPISpec`

Valida contenido OpenAPI/Swagger sin procesar en JSON o YAML. La entrada se trata como **contenido** por defecto; solo se interpreta como ruta con `inputKind: "file"`. La validación se delega en `@powerduck/openapi-parser`; esta función añade controles de seguridad a las entradas.

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `input` | `string` | Contenido de la especificación, o ruta de archivo con `inputKind: "file"`. |
| `options` | `ValidateOpenApiOptions` | Consulta la sección siguiente. |

**Devuelve:** el documento validado si la operación tiene éxito (`Promise<AnyOpenAPIDocument>`).

**Excepciones:** `TypeError` si la entrada está vacía o no es una cadena; [`OpenApiValidationError`](#openapivalidationerror) si las opciones son inválidas o falla la validación.

---

### `validateOpenAPIFile`

Función auxiliar que llama a `validateOpenAPISpec` con `inputKind: "file"` y `baseFilePath` establecido en la ruta indicada. Requiere `allowedRootDirectory`.

```typescript
function validateOpenAPIFile(
  filePath: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

```typescript
import { validateOpenAPIFile } from "@powerduck/conf-patch";

const doc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
});
```

---

### `ValidateOpenApiOptions`

| Opción | Tipo | Valor predeterminado | Descripción |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | Cómo interpretar `input`. |
| `baseFilePath` | `string` | — | Ruta base para el contexto de resolución de referencias. |
| `allowedRootDirectory` | `string` | — | Directorio raíz para archivos de entrada. **Obligatorio** cuando `inputKind` es `"file"`. |
| `timeoutMs` | `number` | `15000` | Plazo máximo de la operación, en milisegundos. |
| `maxInputBytes` | `number` | `5242880` (5 MB) | Tamaño máximo de la entrada sin procesar, en bytes. |
| `maxDocumentNodes` | `number` | `100000` | Número máximo de nodos del documento analizado, como protección frente a DoS. |
| `maxDocumentDepth` | `number` | `100` | Profundidad máxima de anidamiento, como protección frente a DoS. |
| `maxValidationErrors` | `number` | `50` | Número máximo de errores incluidos en el mensaje. |
| `maxErrorMessageLength` | `number` | `1000` | Número máximo de caracteres por error de validación. |
| `signal` | `AbortSignal` | — | Señal de cancelación opcional. |

---

### `OpenApiValidationError`

Error estructurado que se lanza cuando falla la validación. Adapta los errores en el límite de la aplicación antes de devolverlos al cliente: los mensajes y las causas pueden contener rutas locales o detalles del documento.

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| Propiedad | Tipo | Descripción |
|---|---|---|
| `code` | `string` | Código de error interpretable por programas; consulta la tabla siguiente. |
| `message` | `string` | Detalle legible para el usuario. |
| `cause` | `unknown` | Error subyacente opcional. |

#### Códigos de error

| Código | Significado |
|---|---|
| `INVALID_OPTION` | Se proporcionó un valor de opción no válido. |
| `INPUT_TOO_LARGE` | El contenido supera `maxInputBytes`. |
| `INPUT_FILE_TOO_LARGE` | El archivo de entrada supera el límite de tamaño. |
| `FILE_INPUT_FORBIDDEN` | Se utilizó una entrada de archivo sin `allowedRootDirectory`. |
| `PATH_OUTSIDE_ROOT` | La ruta resuelta queda fuera de `allowedRootDirectory`. |
| `PARSE_ERROR` | No se pudo analizar el contenido JSON/YAML. |
| `INVALID_DOCUMENT_SHAPE` | El documento no es un objeto JSON. |
| `UNSUPPORTED_VERSION` | El documento no declara una versión OpenAPI/Swagger admitida; solo se aceptan las versiones principales `2` y `3`. |
| `DOCUMENT_TOO_DEEP` | La profundidad supera `maxDocumentDepth`. |
| `DOCUMENT_TOO_LARGE` | El número de nodos supera `maxDocumentNodes`. |
| `SPEC_VALIDATION_FAILED` | La especificación no supera la validación OpenAPI. |
| `OPERATION_TIMEOUT` | La operación superó `timeoutMs`. |
| `OPERATION_ABORTED` | La operación se canceló mediante `signal`. |
| `UNKNOWN_ERROR` | Error inesperado. |

---

## Utilidades

### `detectFormat`

Detecta un [`ConfigFormat`](#configformat) a partir de la extensión de una ruta o URL `file://`.

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| Extensión | Resultado |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| cualquier otra extensión | lanza un error |

---

### `normalizeFilePath`

Convierte una ruta local o una URL `file:` en una ruta nativa absoluta. Conserva espacios válidos y nombres de archivo Unicode.

```typescript
function normalizeFilePath(filePath: string): string;
```

Una URL `file:` se decodifica con `fileURLToPath`; una ruta absoluta se devuelve sin cambios y una relativa se resuelve respecto a `process.cwd()`.

---

## Funciones de aserción

Se reexportan para usos avanzados y módulos internos. El código de aplicación rara vez las necesita directamente.

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
Lanza `TypeError` si `value` no es una cadena no vacía.

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
Lanza una excepción si `path` no es un array no vacío cuyos segmentos son cadenas no vacías o enteros seguros no negativos.

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
Valida cada operación: `op` debe ser `"add" | "replace" | "remove"`, `path` debe superar `assertPatchPath` y `add`/`replace` deben tener una propiedad propia `value`.

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
Lanza una excepción si `format` no es `"json"`, `"jsonc"` o `"yaml"`.

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
Devuelve `error.message` para instancias de `Error`; en los demás casos, `String(error)`.

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
Crea un `Error` y añade una propiedad `cause` mediante `Object.defineProperty`, con una alternativa para entornos de ejecución antiguos.

---

## Tipos

### `ConfigFormat`

```typescript
type ConfigFormat = "json" | "jsonc" | "yaml";
```

### `JsonPathSegment`

```typescript
type JsonPathSegment = string | number;
```

### `JsonPatchOp`

```typescript
interface JsonPatchOp {
  op: "add" | "replace" | "remove";
  path: JsonPathSegment[];
  /** Required for "add" and "replace". */
  value?: unknown;
}
```

:::caution
Solo se admiten `"add"`, `"replace"` y `"remove"`. `"move"`, `"copy"` y `"test"` se excluyen deliberadamente.
:::

### `PatchConfigOptions`

```typescript
interface PatchConfigOptions {
  format?: ConfigFormat;
  strict?: boolean;
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `FileLockOptions`

```typescript
interface FileLockOptions {
  /** Max time to wait for a lock. Defaults to 10 seconds. */
  timeoutMs?: number;
  /** Initial retry delay. Defaults to 25ms. */
  retryDelayMs?: number;
  /** Explicit lock age after which recovery is allowed. */
  staleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `WriteConfigOptions`

```typescript
interface WriteConfigOptions {
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  allowStaleRecovery?: boolean;
}
```

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  strict?: boolean;
}
```

### `OpenApiInputKind`

```typescript
type OpenApiInputKind = "content" | "file";
```

### `AnyOpenAPIDocument`

Unión de las estructuras OpenAPI/Swagger admitidas que devuelve la validación:

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` es un tipo estructural permisivo:

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## Resumen de exportaciones

| Símbolo | Entrada principal | Subruta del núcleo | Clase de símbolo |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | función |
| `setContentValue` | ✓ | ✓ | función |
| `deleteContentValue` | ✓ | ✓ | función |
| `PatchContentOptions` | ✓ | ✓ | tipo |
| `assertNonEmptyString` | ✓ | ✓ | función |
| `assertPatchPath` | ✓ | ✓ | función |
| `assertPatchOperations` | ✓ | ✓ | función |
| `assertConfigFormat` | ✓ | ✓ | función |
| `getErrorMessage` | ✓ | ✓ | función |
| `createError` | ✓ | ✓ | función |
| `ConfigFormat` | ✓ | ✓ | tipo |
| `JsonPatchOp` | ✓ | ✓ | tipo |
| `JsonPathSegment` | ✓ | ✓ | tipo |
| `readConfigFile` | ✓ | — | función |
| `writeConfigFile` | ✓ | — | función |
| `WriteConfigOptions` | ✓ | — | tipo |
| `patchConfigFile` | ✓ | — | función |
| `setConfigValue` | ✓ | — | función |
| `deleteConfigValue` | ✓ | — | función |
| `withFileLock` | ✓ | — | función |
| `releaseAllLocalLocks` | ✓ | — | función |
| `PatchConfigOptions` | ✓ | — | tipo |
| `FileLockOptions` | ✓ | — | tipo |
| `detectFormat` | ✓ | — | función |
| `normalizeFilePath` | ✓ | — | función |
| `validateOpenAPISpec` | ✓ | — | función |
| `validateOpenAPIFile` | ✓ | — | función |
| `OpenApiValidationError` | ✓ | — | clase |
| `ValidateOpenApiOptions` | ✓ | — | tipo |
| `OpenApiInputKind` | ✓ | — | tipo |
| `AnyOpenAPIDocument` | ✓ | — | tipo |