---
sidebar_position: 4
title: "Riferimento API"
description: "Riferimento completo di @powerduck/conf-patch, con firme e valori predefiniti di ogni simbolo esportato."
---

# Riferimento API

Riferimento completo di `@powerduck/conf-patch`, con firme e valori predefiniti di ogni simbolo esportato.

Sono disponibili due punti di ingresso:

- **`@powerduck/conf-patch`** — tutte le funzionalità seguenti: livello principale, file, validazione OpenAPI e utilità.
- **`@powerduck/conf-patch/core`** — solo il sottoinsieme compatibile con il browser: `patchContent`, `setContentValue`, `deleteContentValue`, `PatchContentOptions`, funzioni di asserzione e tipi `ConfigFormat`, `JsonPatchOp`, `JsonPathSegment`.

---

## Livello principale (compatibile con il browser)

### `patchContent`

Applica una lista di operazioni RFC 6902 a una stringa di configurazione. Funzione pura, senza accesso al file system.

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| Parametro | Tipo | Descrizione |
|---|---|---|
| `content` | `string` | Contenuto grezzo della configurazione, conforme al `format` indicato. |
| `ops` | `JsonPatchOp[]` | Operazioni da applicare nell’ordine specificato. Un array vuoto restituisce `content` invariato. |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`. |
| `options.strict` | `boolean` | Con `true` (predefinito), un’operazione non riuscita genera un’eccezione. Con `false`, viene saltata e segnalata tramite `console.warn`. |

**Restituisce:** il contenuto di configurazione modificato (`string`).

**Eccezioni:** `TypeError` se `content` non è una stringa o `ops` non è valido; un errore che descrive l’operazione non riuscita quando `strict` è `true`.

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

Imposta o crea un valore. Internamente chiama `patchContent` con un’operazione `add`. Secondo RFC 6902, `add` sostituisce una proprietà esistente o inserisce a un indice di array.

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| Parametro | Tipo | Descrizione |
|---|---|---|
| `content` | `string` | Contenuto grezzo della configurazione. |
| `path` | `readonly (string \| number)[]` | Percorso a segmenti, ad esempio `["server", "port"]`. Non può essere vuoto. |
| `value` | `unknown` | Valore da scrivere. |
| `format` | `ConfigFormat` | Formato della configurazione. |

**Restituisce:** il contenuto aggiornato (`string`).

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

Rimuove una chiave o un elemento di array. Internamente chiama `patchContent` con un’operazione `remove`. Il percorso deve esistere.

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

## Livello file (solo Node.js / Electron)

### `readConfigFile`

Legge testo UTF-8 da un percorso locale o da un URL `file://`.

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| Parametro | Tipo | Descrizione |
|---|---|---|
| `filePath` | `string` | Percorso assoluto, relativo o URL `file://`. Non può essere vuoto. |

**Restituisce:** il contenuto UTF-8 grezzo (`Promise<string>`).

**Eccezioni:** se la lettura non riesce, un errore che include il problema sottostante del file system.

---

### `writeConfigFile`

Scrive il contenuto in modo **atomico** tramite file temporaneo e rinomina, con un **blocco file** esclusivo per impostazione predefinita. Le directory superiori vengono create prima di acquisire il blocco.

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| Parametro | Tipo | Descrizione |
|---|---|---|
| `filePath` | `string` | Percorso del file di configurazione. |
| `content` | `string` | Contenuto da scrivere. Deve essere una stringa. |
| `options` | `WriteConfigOptions` | Vedere di seguito. |

**Eccezioni:** `TypeError` per input non validi; gli errori di scrittura del file system vengono incapsulati.

#### `WriteConfigOptions`

| Opzione | Tipo | Valore predefinito | Descrizione |
|---|---|---|---|
| `lock` | `boolean` | `true` | Attivare il blocco durante la scrittura. |
| `lockTimeoutMs` | `number` | Valore predefinito di `withFileLock` (10 s) | Attesa massima per acquisire il blocco, in millisecondi. |
| `lockRetryDelayMs` | `number` | Valore predefinito di `withFileLock` (25 ms) | Attesa iniziale tra i tentativi, in millisecondi, prima dell’aumento esponenziale. |
| `lockStaleThresholdMs` | `number` | Valore predefinito di `withFileLock` | Età del blocco, in millisecondi, oltre la quale è consentito il recupero. |
| `allowStaleRecovery` | `boolean` | `false` | Consentire il recupero automatico dei blocchi obsoleti. |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

Transazione principale del livello file: legge sotto blocco, applica `patchContent` e riscrive in modo atomico **solo se il contenuto è cambiato**. Senza `options.format`, il formato viene rilevato dall’estensione.

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| Parametro | Tipo | Descrizione |
|---|---|---|
| `filePath` | `string` | Percorso del file di configurazione. Non può essere vuoto. |
| `ops` | `JsonPatchOp[]` | Operazioni da applicare. Un array vuoto restituisce il controllo senza letture o scritture. |
| `options` | `PatchConfigOptions` | Vedere di seguito. |

**Eccezioni:** `TypeError` se `filePath` è vuoto, le opzioni di blocco non sono valide o il formato non può essere rilevato e non è indicato `format`; l’errore dell’operazione quando `strict` è `true`.

#### `PatchConfigOptions`

| Opzione | Tipo | Valore predefinito | Descrizione |
|---|---|---|---|
| `format` | `ConfigFormat` | rilevamento automatico | Formato esplicito, prioritario rispetto al rilevamento dall’estensione. |
| `strict` | `boolean` | `true` | Le operazioni non riuscite generano eccezioni. |
| `lock` | `boolean` | `true` | Attivare il blocco dei file. |
| `lockTimeoutMs` | `number` | 10 s | Non negativo. Attesa massima del blocco. |
| `lockRetryDelayMs` | `number` | 25 ms | Positivo. Attesa iniziale tra i tentativi. |
| `lockStaleThresholdMs` | `number` | calcolato | Positivo. Età necessaria per recuperare un blocco obsoleto. |
| `allowStaleRecovery` | `boolean` | `false` | Recuperare automaticamente i blocchi obsoleti. |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

Aggiunge o sostituisce un valore annidato in un file. Delega un’operazione `add` a `patchConfigFile`.

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

Rimuove un valore annidato esistente da un file. Delega un’operazione `remove` a `patchConfigFile`.

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

Esegue un callback asincrono tramite una coda locale al processo **e** un file di blocco esclusivo (`<file>.confedit.lock`). I blocchi usano token di proprietà. Un blocco obsoleto viene recuperato solo se `allowStaleRecovery` è `true` e la sua età supera `staleThresholdMs`. I PID non vengono verificati perché possono essere riutilizzati.

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| Parametro | Tipo | Descrizione |
|---|---|---|
| `filePath` | `string` | File da bloccare. |
| `callback` | `() => Promise<T>` | Lavoro da eseguire mentre il blocco è attivo. |
| `options` | `FileLockOptions` | Vedere di seguito. |

**Restituisce:** il risultato di `callback` (`Promise<T>`). Il blocco viene sempre rilasciato in un blocco `finally`, anche se il callback genera un’eccezione.

#### `FileLockOptions`

| Opzione | Tipo | Valore predefinito | Descrizione |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | Attesa massima del blocco in millisecondi. Deve essere non negativa. |
| `retryDelayMs` | `number` | `25` | Attesa iniziale in millisecondi. Deve essere positiva. Cresce di un fattore 1,5 fino a un massimo di 1000 ms. |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | Età che consente il recupero, in millisecondi. Deve essere positiva. |
| `allowStaleRecovery` | `boolean` | `false` | Recupero automatico dei blocchi obsoleti. Disattivato per impostazione predefinita per il singolo processo principale di Electron, per non interrompere transazioni attive. |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

Elimina tutti i file di blocco del processo corrente. Usare durante la chiusura, dopo che le transazioni attive sono terminate. Per la pulizia asincrona in Electron, impedire la prima uscita e riprenderla dopo la pulizia, come negli esempi. Gli errori dei singoli blocchi vengono ignorati.

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## Validazione OpenAPI

### `validateOpenAPISpec`

Valida contenuti grezzi OpenAPI/Swagger in JSON o YAML. L’input è trattato come **contenuto** per impostazione predefinita; viene interpretato come percorso solo con `inputKind: "file"`. La validazione è delegata a `@powerduck/openapi-parser`; questa funzione aggiunge controlli di sicurezza sugli input.

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| Parametro | Tipo | Descrizione |
|---|---|---|
| `input` | `string` | Contenuto grezzo della specifica, oppure percorso con `inputKind: "file"`. |
| `options` | `ValidateOpenApiOptions` | Vedere di seguito. |

**Restituisce:** il documento validato in caso di successo (`Promise<AnyOpenAPIDocument>`).

**Eccezioni:** `TypeError` per input vuoto o diverso da una stringa; [`OpenApiValidationError`](#openapivalidationerror) per opzioni non valide o errori di validazione.

---

### `validateOpenAPIFile`

Funzione di utilità che chiama `validateOpenAPISpec` con `inputKind: "file"` e `baseFilePath` impostato sul percorso fornito. Richiede `allowedRootDirectory`.

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

| Opzione | Tipo | Valore predefinito | Descrizione |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | Come interpretare `input`. |
| `baseFilePath` | `string` | — | Percorso base del contesto di risoluzione dei riferimenti. |
| `allowedRootDirectory` | `string` | — | Directory radice dei file di input. **Obbligatoria** quando `inputKind` è `"file"`. |
| `timeoutMs` | `number` | `15000` | Tempo massimo dell’operazione, in millisecondi. |
| `maxInputBytes` | `number` | `5242880` (5 MB) | Dimensione massima dell’input grezzo, in byte. |
| `maxDocumentNodes` | `number` | `100000` | Numero massimo di nodi del documento analizzato, come protezione da DoS. |
| `maxDocumentDepth` | `number` | `100` | Profondità massima di annidamento, come protezione da DoS. |
| `maxValidationErrors` | `number` | `50` | Numero massimo di errori inclusi nel messaggio. |
| `maxErrorMessageLength` | `number` | `1000` | Numero massimo di caratteri per errore di validazione. |
| `signal` | `AbortSignal` | — | Segnale di annullamento facoltativo. |

---

### `OpenApiValidationError`

Errore strutturato generato in caso di validazione non riuscita. Adattare gli errori al confine dell’applicazione prima di restituirli al client: messaggi e cause possono contenere percorsi locali o dettagli del documento.

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| Proprietà | Tipo | Descrizione |
|---|---|---|
| `code` | `string` | Codice di errore interpretabile dal programma; vedere la tabella seguente. |
| `message` | `string` | Dettaglio leggibile dall’utente. |
| `cause` | `unknown` | Errore sottostante facoltativo. |

#### Codici di errore

| Codice | Significato |
|---|---|
| `INVALID_OPTION` | È stato fornito un valore di opzione non valido. |
| `INPUT_TOO_LARGE` | Il contenuto grezzo supera `maxInputBytes`. |
| `INPUT_FILE_TOO_LARGE` | Il file di input supera il limite di dimensione. |
| `FILE_INPUT_FORBIDDEN` | Input da file usato senza `allowedRootDirectory`. |
| `PATH_OUTSIDE_ROOT` | Il percorso risolto è esterno a `allowedRootDirectory`. |
| `PARSE_ERROR` | Impossibile analizzare il contenuto JSON/YAML. |
| `INVALID_DOCUMENT_SHAPE` | Il documento non è un oggetto JSON. |
| `UNSUPPORTED_VERSION` | Il documento non dichiara una versione OpenAPI/Swagger supportata; sono accettate solo le versioni principali `2` e `3`. |
| `DOCUMENT_TOO_DEEP` | La profondità supera `maxDocumentDepth`. |
| `DOCUMENT_TOO_LARGE` | Il numero di nodi supera `maxDocumentNodes`. |
| `SPEC_VALIDATION_FAILED` | La specifica non supera la validazione OpenAPI. |
| `OPERATION_TIMEOUT` | L’operazione ha superato `timeoutMs`. |
| `OPERATION_ABORTED` | L’operazione è stata annullata tramite `signal`. |
| `UNKNOWN_ERROR` | Errore imprevisto. |

---

## Utilità

### `detectFormat`

Rileva un [`ConfigFormat`](#configformat) dall’estensione di un percorso o di un URL `file://`.

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| Estensione | Risultato |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| qualsiasi altra estensione | genera un errore |

---

### `normalizeFilePath`

Converte un percorso locale o un URL `file:` in un percorso nativo assoluto. Conserva spazi validi e nomi di file Unicode.

```typescript
function normalizeFilePath(filePath: string): string;
```

Un URL `file:` viene decodificato con `fileURLToPath`; un percorso assoluto viene restituito invariato; un percorso relativo viene risolto rispetto a `process.cwd()`.

---

## Funzioni di asserzione

Vengono riesportate per usi avanzati e moduli interni. Il codice applicativo ne ha raramente bisogno direttamente.

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
Genera `TypeError` se `value` non è una stringa non vuota.

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
Genera un’eccezione se `path` non è un array non vuoto composto da stringhe non vuote o interi sicuri non negativi.

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
Valida ogni operazione: `op` deve essere `"add" | "replace" | "remove"`, `path` deve superare `assertPatchPath` e `add`/`replace` devono avere una proprietà propria `value`.

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
Genera un’eccezione se `format` non è `"json"`, `"jsonc"` o `"yaml"`.

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
Restituisce `error.message` per le istanze di `Error`, altrimenti `String(error)`.

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
Crea un `Error` e aggiunge la proprietà `cause` con `Object.defineProperty`, prevedendo un’alternativa per gli ambienti di esecuzione meno recenti.

---

## Tipi

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
Sono supportati solo `"add"`, `"replace"` e `"remove"`. `"move"`, `"copy"` e `"test"` sono esclusi intenzionalmente.
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

Unione delle strutture di documenti OpenAPI/Swagger supportate e restituite dalla validazione:

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` è un tipo strutturale permissivo:

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## Riepilogo delle esportazioni

| Simbolo | Ingresso principale | Sottopercorso core | Categoria |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | funzione |
| `setContentValue` | ✓ | ✓ | funzione |
| `deleteContentValue` | ✓ | ✓ | funzione |
| `PatchContentOptions` | ✓ | ✓ | tipo |
| `assertNonEmptyString` | ✓ | ✓ | funzione |
| `assertPatchPath` | ✓ | ✓ | funzione |
| `assertPatchOperations` | ✓ | ✓ | funzione |
| `assertConfigFormat` | ✓ | ✓ | funzione |
| `getErrorMessage` | ✓ | ✓ | funzione |
| `createError` | ✓ | ✓ | funzione |
| `ConfigFormat` | ✓ | ✓ | tipo |
| `JsonPatchOp` | ✓ | ✓ | tipo |
| `JsonPathSegment` | ✓ | ✓ | tipo |
| `readConfigFile` | ✓ | — | funzione |
| `writeConfigFile` | ✓ | — | funzione |
| `WriteConfigOptions` | ✓ | — | tipo |
| `patchConfigFile` | ✓ | — | funzione |
| `setConfigValue` | ✓ | — | funzione |
| `deleteConfigValue` | ✓ | — | funzione |
| `withFileLock` | ✓ | — | funzione |
| `releaseAllLocalLocks` | ✓ | — | funzione |
| `PatchConfigOptions` | ✓ | — | tipo |
| `FileLockOptions` | ✓ | — | tipo |
| `detectFormat` | ✓ | — | funzione |
| `normalizeFilePath` | ✓ | — | funzione |
| `validateOpenAPISpec` | ✓ | — | funzione |
| `validateOpenAPIFile` | ✓ | — | funzione |
| `OpenApiValidationError` | ✓ | — | classe |
| `ValidateOpenApiOptions` | ✓ | — | tipo |
| `OpenApiInputKind` | ✓ | — | tipo |
| `AnyOpenAPIDocument` | ✓ | — | tipo |