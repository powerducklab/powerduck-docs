---
sidebar_position: 5
title: "Ejemplos"
description: "Ejemplos prácticos y ejecutables basados en la API pública. Use la capa que necesite: @powerduck/conf-patch/core, compatible con el navegador, para cadenas, o @powerduck/conf-patch para archivos."
---

# Ejemplos

Ejemplos prácticos y ejecutables basados en la API pública. Use la capa que necesite: `@powerduck/conf-patch/core`, compatible con el navegador, para cadenas, o `@powerduck/conf-patch` para archivos.

---

## 1. Operaciones JSON Patch (capa principal)

Aplique varias operaciones RFC 6902 a una cadena JSON. `add` inserta elementos en arrays o añade/sustituye propiedades de objetos; `replace` y `remove` requieren que el destino exista.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

const source = JSON.stringify(
  {
    name: "my-app",
    version: "1.0.0",
    tags: ["web"],
  },
  null,
  2,
);

const patched = patchContent(
  source,
  [
    { op: "add", path: ["description"], value: "Demos patchContent" },
    { op: "replace", path: ["version"], value: "1.1.0" },
    { op: "add", path: ["tags", 1], value: "api" }, // inserts, does not overwrite
  ],
  "json",
);

console.log(patched);
```

Resultado:

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

Configure `strict: false` para omitir las operaciones fallidas en lugar de lanzar excepciones:

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. Establecer un valor YAML anidado (capa de archivos)

Establezca `database.port` en un archivo YAML. La ruta padre (`database`) debe existir; la escritura es atómica y está protegida por un bloqueo.

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

Para crear un objeto anidado que todavía no existe, cree primero el padre:

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### Operaciones con arrays en YAML

Use segmentos numéricos para los índices de secuencia. `add` **inserta**, `replace` sustituye en la misma posición y `remove` elimina:

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. JSONC conservando los comentarios

Las modificaciones JSONC se basan en rangos de texto, por lo que conservan los comentarios y las comas finales alrededor de las líneas modificadas.

```typescript
import { patchContent, deleteContentValue } from "@powerduck/conf-patch/core";

const jsonc = `{
  // Application name
  "name": "my-app",
  // Legacy feature flag
  "legacyFeature": true,
  "version": "1.0.0",
}`;

// Replace a value — the surrounding comments stay put.
const updated = patchContent(
  jsonc,
  [{ op: "replace", path: ["version"], value: "1.2.0" }],
  "jsonc",
);

// Delete a key — its own line is removed, other comments remain.
const cleaned = deleteContentValue(updated, ["legacyFeature"], "jsonc");

console.log(cleaned);
```

Resultado con los comentarios conservados:

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. Validar un documento OpenAPI

Valide el contenido sin procesar y después un archivo. El modo de archivo requiere `allowedRootDirectory` para restringir las rutas permitidas.

```typescript
import {
  validateOpenAPISpec,
  validateOpenAPIFile,
  OpenApiValidationError,
} from "@powerduck/conf-patch";

// (a) Validate raw content (JSON or YAML)
const specContent = `openapi: 3.0.0
info:
  title: Demo API
  version: 1.0.0
paths: {}`;

try {
  const doc = await validateOpenAPISpec(specContent);
  console.log("Valid. openapi =", doc.openapi);
} catch (error) {
  if (error instanceof OpenApiValidationError) {
    console.error(`Validation failed [${error.code}]:`, error.message);
  } else {
    throw error;
  }
}

// (b) Validate from a file (requires allowedRootDirectory)
const fileDoc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
  // Optional hardening:
  // timeoutMs: 10000,
  // maxInputBytes: 2 * 1024 * 1024,
});
```

Cancelación mediante `AbortSignal`:

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

await validateOpenAPISpec(specContent, { signal: controller.signal }).catch(
  (error) => {
    // Throws OpenApiValidationError with code "OPERATION_ABORTED" on abort.
    console.error(error.code);
  },
);
```

---

## 5. Acceso concurrente seguro con bloqueo de archivos

Cuando varios procesos, o varias operaciones simultáneas de un proceso, acceden al mismo archivo, `patchConfigFile` ya serializa el acceso. Use `withFileLock` directamente para agrupar varias operaciones en una sección crítica.

```typescript
import { readConfigFile, writeConfigFile, withFileLock } from "@powerduck/conf-patch";

async function bumpCounter(file: string): Promise<number> {
  return withFileLock(
    file,
    async () => {
      // Read-inside-lock prevents a lost read between workers.
      const raw = await readConfigFile(file);
      const data = JSON.parse(raw);
      data.count = (data.count ?? 0) + 1;
      await writeConfigFile(file, JSON.stringify(data, null, 2), { lock: false });
      return data.count;
    },
    {
      timeoutMs: 5000, // give up after 5s
      retryDelayMs: 25, // initial delay; grows by 1.5x up to 1s
      allowStaleRecovery: false,
    },
  );
}
```

Notas:

- `withFileLock` pone en cola las operaciones sobre **el mismo archivo** dentro de un proceso y usa un archivo exclusivo `.confedit.lock` entre procesos.
- Antes de eliminar un bloqueo, se verifica un token de propiedad. Así, la liberación de un bloqueo antiguo nunca elimina uno nuevo que haya sustituido a otro obsoleto.
- Al cerrar (por ejemplo, con Electron `will-quit`), libere los bloqueos pendientes:

```typescript
import { app } from "electron";
import { releaseAllLocalLocks } from "@powerduck/conf-patch";

let locksReleased = false;
app.on("will-quit", (event) => {
  if (locksReleased) return;
  event.preventDefault();
  void releaseAllLocalLocks()
    .catch((error) => console.error("Lock cleanup failed", error))
    .finally(() => {
      locksReleased = true;
      app.quit();
    });
});
```

---

## 6. Ejemplo completo: editar una especificación OpenAPI en disco

El patrón de ejemplo de la propia biblioteca: leer una especificación, establecer valores, añadir una respuesta y validar.

```typescript
import {
  readConfigFile,
  setConfigValue,
  patchConfigFile,
  validateOpenAPIFile,
} from "@powerduck/conf-patch";

const specPath = "./openapi.yaml";

// Read the raw text.
await readConfigFile(specPath);

// Set info.version and the first server URL.
await setConfigValue(specPath, ["info", "version"], "1.1.0");
await setConfigValue(specPath, ["servers", 0, "url"], "https://api.prod.example.com/v1");

// Add a 404 response to GET /pets.
await patchConfigFile(specPath, [
  {
    op: "add",
    path: ["paths", "/pets", "get", "responses", "404"],
    value: { description: "Resource not found" },
  },
]);

// Confirm the edited document still validates.
await validateOpenAPIFile(specPath, { allowedRootDirectory: "." });
```

---

## Siguientes pasos

- [Referencia de la API](../api-reference/) — firmas completas y valores predeterminados de todas las opciones.
- [Inicio rápido](../quickstart/) — primera ejecución de principio a fin.
