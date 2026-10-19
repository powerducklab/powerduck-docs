---
sidebar_position: 4
title: "Référence API"
description: "Référence complète de @powerduck/conf-patch, avec les signatures et valeurs par défaut de chaque symbole exporté."
---

# Référence API

Référence complète de `@powerduck/conf-patch`, avec les signatures et valeurs par défaut de chaque symbole exporté.

Deux points d’entrée sont disponibles :

- **`@powerduck/conf-patch`** — tout ce qui suit : cœur, fichiers, validation OpenAPI et utilitaires.
- **`@powerduck/conf-patch/core`** — uniquement le sous-ensemble compatible navigateur : `patchContent`, `setContentValue`, `deleteContentValue`, `PatchContentOptions`, les fonctions d’assertion et les types `ConfigFormat`, `JsonPatchOp`, `JsonPathSegment`.

---

## Couche cœur (compatible navigateur)

### `patchContent`

Applique une liste d’opérations RFC 6902 à une chaîne de configuration. Fonction pure, sans accès au système de fichiers.

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| Paramètre | Type | Description |
|---|---|---|
| `content` | `string` | Contenu brut de la configuration, conforme au `format` indiqué. |
| `ops` | `JsonPatchOp[]` | Opérations à appliquer dans l’ordre. Un tableau vide renvoie `content` sans modification. |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`. |
| `options.strict` | `boolean` | Avec `true` (par défaut), une opération en échec lève une exception. Avec `false`, elle est ignorée et signalée par `console.warn`. |

**Renvoie :** le contenu de configuration modifié (`string`).

**Exceptions :** `TypeError` si `content` n’est pas une chaîne ou si `ops` est invalide ; une erreur décrivant l’opération échouée lorsque `strict` vaut `true`.

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

Définit ou crée une valeur. Appelle `patchContent` avec une opération `add`. Selon RFC 6902, `add` remplace une propriété d’objet existante ou insère à un indice de tableau.

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| Paramètre | Type | Description |
|---|---|---|
| `content` | `string` | Contenu brut de la configuration. |
| `path` | `readonly (string \| number)[]` | Chemin segmenté, par exemple `["server", "port"]`. Ne doit pas être vide. |
| `value` | `unknown` | Valeur à écrire. |
| `format` | `ConfigFormat` | Format de configuration. |

**Renvoie :** le contenu mis à jour (`string`).

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

Supprime une clé ou un élément de tableau. Appelle `patchContent` avec une opération `remove`. Le chemin doit exister.

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

## Couche fichiers (Node.js / Electron uniquement)

### `readConfigFile`

Lit du texte UTF-8 à partir d’un chemin local ou d’une URL `file://`.

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| Paramètre | Type | Description |
|---|---|---|
| `filePath` | `string` | Chemin absolu, relatif ou URL `file://`. Ne doit pas être vide. |

**Renvoie :** le contenu UTF-8 brut (`Promise<string>`).

**Exceptions :** une erreur contenant l’échec sous-jacent du système de fichiers si la lecture est impossible.

---

### `writeConfigFile`

Écrit le contenu de façon **atomique** (fichier temporaire puis renommage), avec un **verrou de fichier** exclusif par défaut. Les répertoires parents sont créés avant le verrouillage.

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| Paramètre | Type | Description |
|---|---|---|
| `filePath` | `string` | Chemin du fichier de configuration. |
| `content` | `string` | Contenu à écrire. Doit être une chaîne. |
| `options` | `WriteConfigOptions` | Voir ci-dessous. |

**Exceptions :** `TypeError` pour une entrée invalide ; les échecs d’écriture du système de fichiers sont encapsulés.

#### `WriteConfigOptions`

| Option | Type | Valeur par défaut | Description |
|---|---|---|---|
| `lock` | `boolean` | `true` | Activer le verrouillage pendant l’écriture. |
| `lockTimeoutMs` | `number` | Valeur par défaut de `withFileLock` (10 s) | Durée maximale d’attente du verrou, en millisecondes. |
| `lockRetryDelayMs` | `number` | Valeur par défaut de `withFileLock` (25 ms) | Délai initial entre les tentatives, en millisecondes, avant augmentation exponentielle. |
| `lockStaleThresholdMs` | `number` | Valeur par défaut de `withFileLock` | Ancienneté du verrou, en millisecondes, au-delà de laquelle sa récupération est autorisée. |
| `allowStaleRecovery` | `boolean` | `false` | Autoriser la récupération automatique des verrous périmés. |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

Transaction principale de la couche fichiers : lire sous verrou, appliquer `patchContent`, puis réécrire de façon atomique **uniquement si le contenu a changé**. Le format est déduit de l’extension si `options.format` est omis.

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| Paramètre | Type | Description |
|---|---|---|
| `filePath` | `string` | Chemin du fichier de configuration. Ne doit pas être vide. |
| `ops` | `JsonPatchOp[]` | Opérations à appliquer. Un tableau vide entraîne un retour sans lecture ni écriture. |
| `options` | `PatchConfigOptions` | Voir ci-dessous. |

**Exceptions :** `TypeError` si `filePath` est vide, si les options de verrouillage sont invalides ou si le format ne peut pas être détecté et qu’aucun `format` n’est fourni ; erreur de l’opération lorsque `strict` vaut `true`.

#### `PatchConfigOptions`

| Option | Type | Valeur par défaut | Description |
|---|---|---|---|
| `format` | `ConfigFormat` | détection automatique | Format explicite, prioritaire sur la détection par extension. |
| `strict` | `boolean` | `true` | Les opérations en échec lèvent une exception. |
| `lock` | `boolean` | `true` | Activer le verrouillage des fichiers. |
| `lockTimeoutMs` | `number` | 10 s | Valeur non négative. Attente maximale du verrou. |
| `lockRetryDelayMs` | `number` | 25 ms | Valeur positive. Délai initial entre les tentatives. |
| `lockStaleThresholdMs` | `number` | calculée | Valeur positive. Ancienneté nécessaire pour récupérer un verrou périmé. |
| `allowStaleRecovery` | `boolean` | `false` | Récupérer automatiquement les verrous périmés. |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

Ajoute ou remplace une valeur imbriquée dans un fichier. Délègue une opération `add` à `patchConfigFile`.

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

Supprime une valeur imbriquée existante dans un fichier. Délègue une opération `remove` à `patchConfigFile`.

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

Exécute un rappel asynchrone via une file locale au processus **et** un fichier de verrou exclusif (`<file>.confedit.lock`). Les verrous utilisent des jetons de propriété. Un verrou périmé est récupéré seulement si `allowStaleRecovery` vaut `true` et si son ancienneté dépasse `staleThresholdMs`. Les PID ne sont volontairement pas vérifiés, car ils peuvent être réutilisés.

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| Paramètre | Type | Description |
|---|---|---|
| `filePath` | `string` | Fichier à verrouiller. |
| `callback` | `() => Promise<T>` | Travail à exécuter pendant la détention du verrou. |
| `options` | `FileLockOptions` | Voir ci-dessous. |

**Renvoie :** le résultat de `callback` (`Promise<T>`). Le verrou est toujours libéré dans un bloc `finally`, même si le rappel lève une exception.

#### `FileLockOptions`

| Option | Type | Valeur par défaut | Description |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | Attente maximale du verrou en millisecondes. Doit être non négative. |
| `retryDelayMs` | `number` | `25` | Délai initial en millisecondes. Doit être positif. Il est multiplié par 1,5 entre les tentatives, jusqu’à 1 000 ms. |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | Ancienneté autorisant la récupération, en millisecondes. Doit être positive. |
| `allowStaleRecovery` | `boolean` | `false` | Récupération automatique des verrous périmés. Désactivée par défaut pour le processus principal unique d’Electron afin de ne pas interrompre une transaction active. |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

Supprime tous les fichiers de verrou détenus par le processus courant. À utiliser lors de l’arrêt, après la fin des transactions actives. Pour un nettoyage asynchrone avec Electron, empêchez la première fermeture puis relancez-la après le nettoyage, comme dans les exemples. Les échecs individuels sont ignorés.

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## Validation OpenAPI

### `validateOpenAPISpec`

Valide le contenu brut OpenAPI/Swagger, en JSON ou YAML. L’entrée est du **contenu** par défaut ; elle n’est interprétée comme chemin qu’avec `inputKind: "file"`. La validation est déléguée à `@powerduck/openapi-parser` ; cette fonction sécurise le traitement des entrées.

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| Paramètre | Type | Description |
|---|---|---|
| `input` | `string` | Contenu brut de la spécification, ou chemin avec `inputKind: "file"`. |
| `options` | `ValidateOpenApiOptions` | Voir ci-dessous. |

**Renvoie :** le document validé en cas de succès (`Promise<AnyOpenAPIDocument>`).

**Exceptions :** `TypeError` pour une entrée vide ou non textuelle ; [`OpenApiValidationError`](#openapivalidationerror) pour des options invalides ou un échec de validation.

---

### `validateOpenAPIFile`

Raccourci appelant `validateOpenAPISpec` avec `inputKind: "file"` et `baseFilePath` défini sur le chemin fourni. Exige `allowedRootDirectory`.

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

| Option | Type | Valeur par défaut | Description |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | Interprétation de `input`. |
| `baseFilePath` | `string` | — | Chemin de base du contexte de résolution des références. |
| `allowedRootDirectory` | `string` | — | Répertoire racine des fichiers d’entrée. **Obligatoire** lorsque `inputKind` vaut `"file"`. |
| `timeoutMs` | `number` | `15000` | Délai maximal de l’opération, en millisecondes. |
| `maxInputBytes` | `number` | `5242880` (5 Mo) | Taille maximale de l’entrée brute, en octets. |
| `maxDocumentNodes` | `number` | `100000` | Nombre maximal de nœuds du document analysé, contre le déni de service. |
| `maxDocumentDepth` | `number` | `100` | Profondeur maximale d’imbrication, contre le déni de service. |
| `maxValidationErrors` | `number` | `50` | Nombre maximal d’erreurs incluses dans le message. |
| `maxErrorMessageLength` | `number` | `1000` | Nombre maximal de caractères par erreur de validation. |
| `signal` | `AbortSignal` | — | Signal d’annulation facultatif. |

---

### `OpenApiValidationError`

Erreur structurée levée lors d’un échec de validation. Adaptez les erreurs à la frontière de l’application avant de les renvoyer au client : messages et causes peuvent contenir des chemins locaux ou des détails du document.

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| Propriété | Type | Description |
|---|---|---|
| `code` | `string` | Code d’erreur exploitable par programme, voir le tableau ci-dessous. |
| `message` | `string` | Détail lisible par l’utilisateur. |
| `cause` | `unknown` | Erreur sous-jacente facultative. |

#### Codes d’erreur

| Code | Signification |
|---|---|
| `INVALID_OPTION` | Valeur d’option invalide. |
| `INPUT_TOO_LARGE` | Le contenu brut dépasse `maxInputBytes`. |
| `INPUT_FILE_TOO_LARGE` | Le fichier d’entrée dépasse la limite de taille. |
| `FILE_INPUT_FORBIDDEN` | Entrée fichier utilisée sans `allowedRootDirectory`. |
| `PATH_OUTSIDE_ROOT` | Le chemin résolu est hors de `allowedRootDirectory`. |
| `PARSE_ERROR` | Impossible d’analyser le contenu JSON/YAML. |
| `INVALID_DOCUMENT_SHAPE` | Le document n’est pas un objet JSON. |
| `UNSUPPORTED_VERSION` | Le document ne déclare pas de version OpenAPI/Swagger prise en charge ; seules les versions majeures `2` et `3` sont acceptées. |
| `DOCUMENT_TOO_DEEP` | La profondeur dépasse `maxDocumentDepth`. |
| `DOCUMENT_TOO_LARGE` | Le nombre de nœuds dépasse `maxDocumentNodes`. |
| `SPEC_VALIDATION_FAILED` | La spécification échoue à la validation OpenAPI. |
| `OPERATION_TIMEOUT` | L’opération dépasse `timeoutMs`. |
| `OPERATION_ABORTED` | L’opération a été annulée par `signal`. |
| `UNKNOWN_ERROR` | Erreur inattendue. |

---

## Utilitaires

### `detectFormat`

Détecte un [`ConfigFormat`](#configformat) à partir de l’extension d’un chemin ou d’une URL `file://`.

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| Extension | Résultat |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| toute autre extension | lève une erreur |

---

### `normalizeFilePath`

Convertit un chemin local ou une URL `file:` en chemin natif absolu. Préserve les espaces valides et les noms de fichiers Unicode.

```typescript
function normalizeFilePath(filePath: string): string;
```

Une URL `file:` est décodée par `fileURLToPath` ; un chemin absolu est renvoyé tel quel ; un chemin relatif est résolu par rapport à `process.cwd()`.

---

## Fonctions d’assertion

Ces fonctions sont réexportées pour les usages avancés et les modules internes. Le code applicatif en a rarement besoin directement.

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
Lève `TypeError` si `value` n’est pas une chaîne non vide.

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
Lève une exception si `path` n’est pas un tableau non vide composé de chaînes non vides ou d’entiers sûrs non négatifs.

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
Valide chaque opération : `op` doit être `"add" | "replace" | "remove"`, `path` doit passer `assertPatchPath`, et `add`/`replace` doivent avoir une propriété propre `value`.

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
Lève une exception si `format` n’est ni `"json"`, ni `"jsonc"`, ni `"yaml"`.

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
Renvoie `error.message` pour une instance de `Error`, sinon `String(error)`.

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
Crée un `Error` et lui ajoute une propriété `cause` avec `Object.defineProperty`, avec une solution de repli pour les anciens environnements d’exécution.

---

## Types

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
Seuls `"add"`, `"replace"` et `"remove"` sont pris en charge. `"move"`, `"copy"` et `"test"` sont volontairement exclus.
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

Union des structures de documents OpenAPI/Swagger prises en charge et renvoyées par la validation :

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` est un type structurel permissif :

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## Récapitulatif des exports

| Symbole | Entrée principale | Sous-chemin cœur | Nature |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | fonction |
| `setContentValue` | ✓ | ✓ | fonction |
| `deleteContentValue` | ✓ | ✓ | fonction |
| `PatchContentOptions` | ✓ | ✓ | type |
| `assertNonEmptyString` | ✓ | ✓ | fonction |
| `assertPatchPath` | ✓ | ✓ | fonction |
| `assertPatchOperations` | ✓ | ✓ | fonction |
| `assertConfigFormat` | ✓ | ✓ | fonction |
| `getErrorMessage` | ✓ | ✓ | fonction |
| `createError` | ✓ | ✓ | fonction |
| `ConfigFormat` | ✓ | ✓ | type |
| `JsonPatchOp` | ✓ | ✓ | type |
| `JsonPathSegment` | ✓ | ✓ | type |
| `readConfigFile` | ✓ | — | fonction |
| `writeConfigFile` | ✓ | — | fonction |
| `WriteConfigOptions` | ✓ | — | type |
| `patchConfigFile` | ✓ | — | fonction |
| `setConfigValue` | ✓ | — | fonction |
| `deleteConfigValue` | ✓ | — | fonction |
| `withFileLock` | ✓ | — | fonction |
| `releaseAllLocalLocks` | ✓ | — | fonction |
| `PatchConfigOptions` | ✓ | — | type |
| `FileLockOptions` | ✓ | — | type |
| `detectFormat` | ✓ | — | fonction |
| `normalizeFilePath` | ✓ | — | fonction |
| `validateOpenAPISpec` | ✓ | — | fonction |
| `validateOpenAPIFile` | ✓ | — | fonction |
| `OpenApiValidationError` | ✓ | — | classe |
| `ValidateOpenApiOptions` | ✓ | — | type |
| `OpenApiInputKind` | ✓ | — | type |
| `AnyOpenAPIDocument` | ✓ | — | type |