---
sidebar_position: 5
title: "Esempi"
description: "Esempi pratici ed eseguibili basati sull’API pubblica. Importa il livello adatto: @powerduck/conf-patch/core, compatibile con il browser, per le stringhe, oppure @powerduck/conf-patch per i file."
---

# Esempi

Esempi pratici ed eseguibili basati sull’API pubblica. Importa il livello adatto: `@powerduck/conf-patch/core`, compatibile con il browser, per le stringhe, oppure `@powerduck/conf-patch` per i file.

---

## 1. Operazioni JSON Patch (livello core)

Applica più operazioni RFC 6902 a una stringa JSON. `add` inserisce negli array o aggiunge/sostituisce proprietà degli oggetti; `replace` e `remove` richiedono che la destinazione esista.

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

Risultato:

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

Imposta `strict: false` per saltare le operazioni non riuscite anziché generare eccezioni:

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. Impostare un valore YAML annidato (livello file)

Imposta `database.port` in un file YAML. Il percorso padre (`database`) deve esistere; la scrittura è atomica e protetta da un blocco.

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

Per creare un oggetto annidato che non esiste ancora, crea prima il padre:

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### Operazioni sugli array in YAML

Usa segmenti numerici per gli indici delle sequenze. `add` **inserisce**, `replace` sostituisce nella stessa posizione e `remove` elimina:

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. JSONC con commenti conservati

Le modifiche JSONC operano su intervalli di testo, preservando commenti e virgole finali attorno alle righe modificate.

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

Risultato con i commenti conservati:

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. Convalidare un documento OpenAPI

Convalida prima il contenuto grezzo e poi un file. La modalità file richiede `allowedRootDirectory` per limitare i percorsi consentiti.

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

Annullamento tramite `AbortSignal`:

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

## 5. Accesso concorrente sicuro con blocco dei file

Quando più processi, o più operazioni contemporanee nello stesso processo, modificano lo stesso file, `patchConfigFile` serializza già gli accessi. Usa direttamente `withFileLock` per raggruppare più operazioni in una sezione critica.

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

Note:

- `withFileLock` accoda le operazioni sullo **stesso file** all’interno del processo e usa un file esclusivo `.confedit.lock` tra processi.
- Prima di rimuovere un blocco, il rilascio verifica un token di proprietà: un rilascio vecchio non può quindi eliminare un nuovo blocco subentrato a uno obsoleto.
- All’arresto, ad esempio con Electron `will-quit`, rilascia i blocchi ancora attivi:

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

## 6. Un esempio completo: modificare una specifica OpenAPI su disco

Il modello dimostrativo della libreria: leggere la specifica, impostare valori, aggiungere una risposta e convalidare.

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

## Passaggi successivi

- [Riferimento API](../api-reference/) — firme complete e valori predefiniti di ogni opzione.
- [Guida rapida](../quickstart/) — prima esecuzione completa.
