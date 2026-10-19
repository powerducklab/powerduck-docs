---
sidebar_position: 5
title: "Beispiele"
description: "Praktische, ausführbare Beispiele auf Basis der öffentlichen API. Wählen Sie den passenden Import: das browsersichere @powerduck/conf-patch/core für Zeichenfolgen oder @powerduck/conf-patch für Dateien."
---

# Beispiele

Praktische, ausführbare Beispiele auf Basis der öffentlichen API. Wählen Sie den passenden Import: das browsersichere `@powerduck/conf-patch/core` für Zeichenfolgen oder `@powerduck/conf-patch` für Dateien.

---

## 1. JSON-Patch-Operationen (Kernschicht)

Wenden Sie mehrere RFC-6902-Operationen auf eine JSON-Zeichenfolge an. `add` fügt Arrayelemente ein oder ergänzt/ersetzt Objekteigenschaften; bei `replace` und `remove` muss das Ziel vorhanden sein.

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

Ergebnis:

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

Mit `strict: false` werden fehlgeschlagene Operationen übersprungen, statt Fehler auszulösen:

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. Einen verschachtelten YAML-Wert setzen (Dateischicht)

Setzen Sie `database.port` in einer YAML-Datei. Der übergeordnete Pfad (`database`) muss bereits existieren. Der Schreibvorgang ist atomar und durch eine Sperre geschützt.

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

Erstellen Sie bei einem noch nicht vorhandenen verschachtelten Objekt zuerst das übergeordnete Objekt:

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### Arrayoperationen in YAML

Verwenden Sie numerische Pfadsegmente für Sequenzindizes. `add` **fügt ein**, `replace` ersetzt an Ort und Stelle, `remove` löscht:

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. JSONC mit erhaltenen Kommentaren

JSONC-Änderungen arbeiten auf Textbereichen. Kommentare und nachgestellte Kommata um die geänderten Zeilen bleiben daher erhalten.

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

Ergebnis mit erhaltenen Kommentaren:

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. Ein OpenAPI-Dokument validieren

Validieren Sie zunächst den Inhalt, anschließend eine Datei. Im Dateimodus ist `allowedRootDirectory` zur Begrenzung der erlaubten Pfade erforderlich.

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

Abbruch über `AbortSignal`:

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

## 5. Sicherer gleichzeitiger Zugriff mit Dateisperren

Wenn mehrere Prozesse oder mehrere gleichzeitige Operationen eines Prozesses dieselbe Datei bearbeiten, serialisiert `patchConfigFile` den Zugriff bereits. Verwenden Sie `withFileLock` direkt, um mehrere Dateivorgänge zu einem kritischen Abschnitt zusammenzufassen.

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

Hinweise:

- `withFileLock` reiht Operationen auf **dieselbe Datei** innerhalb eines Prozesses ein und verwendet prozessübergreifend eine exklusive `.confedit.lock`-Datei.
- Vor dem Entfernen einer Sperre wird das Eigentümertoken geprüft. So entfernt die Freigabe einer alten Sperre keine neue Sperre, die eine veraltete übernommen hat.
- Geben Sie beim Herunterfahren (z. B. bei Electron `will-quit`) verbleibende Sperren frei:

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

## 6. Zusammenspiel: eine OpenAPI-Datei bearbeiten

Das Beispielmuster aus der Bibliothek: Spezifikation lesen, Werte setzen, Antwort ergänzen und anschließend validieren.

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

## Nächste Schritte

- [API-Referenz](../api-reference/) — vollständige Signaturen und alle Standardwerte.
- [Schnellstart](../quickstart/) — erster vollständiger Durchlauf.
