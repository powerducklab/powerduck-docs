---
sidebar_position: 5
title: "Exemples"
description: "Exemples pratiques et exécutables utilisant l’API publique. Choisissez la couche adaptée : @powerduck/conf-patch/core, compatible navigateur, pour les chaînes, ou @powerduck/conf-patch pour les fichiers."
---

# Exemples

Exemples pratiques et exécutables utilisant l’API publique. Choisissez la couche adaptée : `@powerduck/conf-patch/core`, compatible navigateur, pour les chaînes, ou `@powerduck/conf-patch` pour les fichiers.

---

## 1. Opérations JSON Patch (couche cœur)

Appliquez plusieurs opérations RFC 6902 à une chaîne JSON. `add` insère dans les tableaux ou ajoute/remplace des propriétés d’objet ; `replace` et `remove` exigent une cible existante.

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

Résultat :

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

Définissez `strict: false` pour ignorer les opérations en échec au lieu de lever une exception :

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. Définir une valeur YAML imbriquée (couche fichier)

Définissez `database.port` dans un fichier YAML. Le chemin parent (`database`) doit déjà exister ; l’écriture est atomique et protégée par un verrou.

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

Pour créer un objet imbriqué inexistant, créez d’abord son parent :

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### Opérations sur les tableaux YAML

Utilisez des segments numériques pour les indices de séquence. `add` **insère**, `replace` remplace sur place et `remove` supprime :

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. JSONC avec conservation des commentaires

Les modifications JSONC portent sur des plages de texte ; les commentaires et virgules finales autour des lignes modifiées sont donc conservés.

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

Résultat avec les commentaires conservés :

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. Valider un document OpenAPI

Validez d’abord le contenu brut, puis un fichier. Le mode fichier exige `allowedRootDirectory` pour limiter les chemins autorisés.

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

Annulation avec `AbortSignal` :

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

## 5. Accès concurrent sûr avec verrouillage de fichier

Lorsque plusieurs processus, ou plusieurs opérations simultanées d’un même processus, touchent le même fichier, `patchConfigFile` sérialise déjà les accès. Utilisez directement `withFileLock` pour regrouper plusieurs opérations dans une même section critique.

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

Remarques :

- `withFileLock` met en file les opérations sur **le même fichier** dans un processus et utilise un fichier `.confedit.lock` exclusif entre processus.
- La libération vérifie un jeton de propriété avant suppression : une ancienne libération ne peut donc pas supprimer un nouveau verrou ayant remplacé un verrou périmé.
- À l’arrêt (par exemple avec Electron `will-quit`), libérez les verrous restants :

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

## 6. Tout réunir : modifier une spécification OpenAPI sur disque

Le modèle utilisé par la bibliothèque : lire la spécification, définir des valeurs, ajouter une réponse, puis valider.

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

## Étapes suivantes

- [Référence de l’API](../api-reference/) — signatures complètes et valeurs par défaut de toutes les options.
- [Démarrage rapide](../quickstart/) — un premier parcours de bout en bout.
