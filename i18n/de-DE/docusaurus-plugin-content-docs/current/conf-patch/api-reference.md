---
sidebar_position: 4
title: "API-Referenz"
description: "Vollständige Referenz für @powerduck/conf-patch mit Signaturen und Standardwerten aller exportierten Symbole."
---

# API-Referenz

Vollständige Referenz für `@powerduck/conf-patch` mit Signaturen und Standardwerten aller exportierten Symbole.

Es gibt zwei Einstiegspunkte:

- **`@powerduck/conf-patch`** — alle folgenden Funktionen: Kernschicht, Dateischicht, OpenAPI-Validierung und Hilfsfunktionen.
- **`@powerduck/conf-patch/core`** — nur der browsergeeignete Teil: `patchContent`, `setContentValue`, `deleteContentValue`, `PatchContentOptions`, die Prüffunktionen sowie die Typen `ConfigFormat`, `JsonPatchOp`, `JsonPathSegment`.

---

## Kernschicht (browsergeeignet)

### `patchContent`

Wendet RFC-6902-Patch-Operationen auf eine Konfigurationszeichenfolge an. Reine Funktion ohne Dateisystemzugriff.

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| Parameter | Typ | Beschreibung |
|---|---|---|
| `content` | `string` | Roher Konfigurationsinhalt, der dem angegebenen `format` entsprechen muss. |
| `ops` | `JsonPatchOp[]` | Der Reihe nach anzuwendende Operationen. Ein leeres Array gibt `content` unverändert zurück. |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`. |
| `options.strict` | `boolean` | Bei `true` (Standard) lösen fehlgeschlagene Operationen Ausnahmen aus. Bei `false` werden sie übersprungen und mit `console.warn` gemeldet. |

**Rückgabe:** der geänderte Konfigurationsinhalt (`string`).

**Ausnahmen:** `TypeError`, wenn `content` keine Zeichenfolge oder `ops` ungültig ist; bei `strict` gleich `true` ein Fehler mit Beschreibung der fehlgeschlagenen Operation.

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

Setzt oder erstellt einen einzelnen Wert. Ruft intern `patchContent` mit einer `add`-Operation auf. Nach RFC 6902 ersetzt `add` vorhandene Objekteigenschaften oder fügt an einem Arrayindex ein.

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| Parameter | Typ | Beschreibung |
|---|---|---|
| `content` | `string` | Roher Konfigurationsinhalt. |
| `path` | `readonly (string \| number)[]` | Segmentierter Pfad, etwa `["server", "port"]`. Darf nicht leer sein. |
| `value` | `unknown` | Zu schreibender Wert. |
| `format` | `ConfigFormat` | Konfigurationsformat. |

**Rückgabe:** der aktualisierte Inhalt (`string`).

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

Entfernt einen Schlüssel oder ein Arrayelement. Ruft intern `patchContent` mit einer `remove`-Operation auf. Der Pfad muss existieren.

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

## Dateischicht (nur Node.js / Electron)

### `readConfigFile`

Liest UTF-8-Text über einen lokalen Dateipfad oder eine `file://`-URL.

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| Parameter | Typ | Beschreibung |
|---|---|---|
| `filePath` | `string` | Absoluter oder relativer Pfad oder eine `file://`-URL. Darf nicht leer sein. |

**Rückgabe:** der rohe UTF-8-Inhalt (`Promise<string>`).

**Ausnahmen:** Bei Lesefehlern wird der zugrunde liegende Dateisystemfehler in einen Fehler eingebettet.

---

### `writeConfigFile`

Schreibt Inhalte **atomar** über eine temporäre Datei und anschließendes Umbenennen, standardmäßig unter einer exklusiven **Dateisperre**. Übergeordnete Verzeichnisse werden vor dem Sperren angelegt.

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| Parameter | Typ | Beschreibung |
|---|---|---|
| `filePath` | `string` | Pfad zur Konfigurationsdatei. |
| `content` | `string` | Zu schreibender Inhalt; muss eine Zeichenfolge sein. |
| `options` | `WriteConfigOptions` | Siehe unten. |

**Ausnahmen:** `TypeError` bei ungültiger Eingabe; Dateisystemfehler beim Schreiben werden eingebettet.

#### `WriteConfigOptions`

| Option | Typ | Standardwert | Beschreibung |
|---|---|---|---|
| `lock` | `boolean` | `true` | Dateisperre während des Schreibens aktivieren. |
| `lockTimeoutMs` | `number` | Standard von `withFileLock` (10 s) | Maximale Wartezeit auf die Sperre in Millisekunden. |
| `lockRetryDelayMs` | `number` | Standard von `withFileLock` (25 ms) | Anfängliche Wiederholungsverzögerung vor exponentiellem Backoff, in Millisekunden. |
| `lockStaleThresholdMs` | `number` | Standard von `withFileLock` | Sperralter in Millisekunden, ab dem eine Wiederherstellung zulässig ist. |
| `allowStaleRecovery` | `boolean` | `false` | Ob veraltete Sperren automatisch übernommen werden dürfen. |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

Die zentrale Dateitransaktion: unter einer Sperre lesen, `patchContent` anwenden und **nur bei geändertem Inhalt** atomar zurückschreiben. Ohne `options.format` wird das Format aus der Dateierweiterung ermittelt.

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| Parameter | Typ | Beschreibung |
|---|---|---|
| `filePath` | `string` | Pfad zur Konfigurationsdatei. Darf nicht leer sein. |
| `ops` | `JsonPatchOp[]` | Anzuwendende Operationen. Bei einem leeren Array erfolgt die Rückgabe ohne Lesen oder Schreiben. |
| `options` | `PatchConfigOptions` | Siehe unten. |

**Ausnahmen:** `TypeError`, wenn `filePath` leer ist, Sperroptionen ungültig sind oder das Format nicht erkannt wird und kein `format` angegeben ist; bei `strict` gleich `true` der Operationsfehler.

#### `PatchConfigOptions`

| Option | Typ | Standardwert | Beschreibung |
|---|---|---|---|
| `format` | `ConfigFormat` | automatisch erkannt | Explizites Format; hat Vorrang vor der Erkennung anhand der Erweiterung. |
| `strict` | `boolean` | `true` | Fehlgeschlagene Operationen lösen Ausnahmen aus. |
| `lock` | `boolean` | `true` | Dateisperren aktivieren. |
| `lockTimeoutMs` | `number` | 10 s | Nicht negativ. Maximale Wartezeit auf die Sperre. |
| `lockRetryDelayMs` | `number` | 25 ms | Positiv. Anfängliche Wiederholungsverzögerung. |
| `lockStaleThresholdMs` | `number` | berechnet | Positiv. Erforderliches Sperralter für die Wiederherstellung. |
| `allowStaleRecovery` | `boolean` | `false` | Veraltete Sperren automatisch übernehmen. |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

Fügt einen verschachtelten Dateiwert hinzu oder ersetzt ihn. Übergibt eine einzelne `add`-Operation an `patchConfigFile`.

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

Entfernt einen vorhandenen verschachtelten Dateiwert. Übergibt eine einzelne `remove`-Operation an `patchConfigFile`.

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

Führt einen asynchronen Callback über eine prozesslokale Warteschlange **und** eine exklusive Sperrdatei (`<file>.confedit.lock`) aus. Sperren verwenden Eigentümertoken. Eine veraltete Sperre wird nur bei `allowStaleRecovery` gleich `true` und einem Alter über `staleThresholdMs` wiederhergestellt. PID-Prüfungen werden bewusst vermieden, da PIDs wiederverwendet werden können.

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| Parameter | Typ | Beschreibung |
|---|---|---|
| `filePath` | `string` | Zu sperrende Datei. |
| `callback` | `() => Promise<T>` | Unter der Sperre auszuführende Arbeit. |
| `options` | `FileLockOptions` | Siehe unten. |

**Rückgabe:** das Ergebnis von `callback` (`Promise<T>`). Die Sperre wird immer in einem `finally`-Block freigegeben, auch bei einer Ausnahme im Callback.

#### `FileLockOptions`

| Option | Typ | Standardwert | Beschreibung |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | Maximale Wartezeit auf die Sperre in Millisekunden; muss nicht negativ sein. |
| `retryDelayMs` | `number` | `25` | Anfängliche Verzögerung in Millisekunden; muss positiv sein. Der Backoff wächst um den Faktor 1,5 bis höchstens 1000 ms. |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | Sperralter in Millisekunden, ab dem Wiederherstellung erlaubt ist; muss positiv sein. |
| `allowStaleRecovery` | `boolean` | `false` | Veraltete Sperren automatisch übernehmen. Für Electrons einzelnen Hauptprozess standardmäßig deaktiviert, um laufende Transaktionen nicht zu unterbrechen. |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

Entfernt alle Sperrdateien des aktuellen Prozesses. Beim Beenden erst aufrufen, nachdem laufende Dateitransaktionen abgeschlossen sind. Für asynchrone Bereinigung in Electron zunächst das Beenden verhindern und nach der Bereinigung erneut auslösen; siehe Beispiele. Fehler einzelner Sperren werden ignoriert.

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## OpenAPI-Validierung

### `validateOpenAPISpec`

Validiert rohe OpenAPI-/Swagger-Inhalte in JSON oder YAML. Die Eingabe gilt standardmäßig als **Inhalt**; nur bei `inputKind: "file"` wird sie als Dateipfad interpretiert. Die Validierung übernimmt `@powerduck/openapi-parser`; diese Funktion ergänzt die abgesicherte Eingabeverarbeitung.

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| Parameter | Typ | Beschreibung |
|---|---|---|
| `input` | `string` | Roher Spezifikationsinhalt oder ein Dateipfad bei `inputKind: "file"`. |
| `options` | `ValidateOpenApiOptions` | Siehe unten. |

**Rückgabe:** das erfolgreich validierte Dokument (`Promise<AnyOpenAPIDocument>`).

**Ausnahmen:** `TypeError` bei leerer Eingabe oder einem anderen Typ als Zeichenfolge; [`OpenApiValidationError`](#openapivalidationerror) bei ungültigen Optionen oder Validierungsfehlern.

---

### `validateOpenAPIFile`

Komfortfunktion, die `validateOpenAPISpec` mit `inputKind: "file"` und dem angegebenen Pfad als `baseFilePath` aufruft. Erfordert `allowedRootDirectory`.

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

| Option | Typ | Standardwert | Beschreibung |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | Interpretation von `input`. |
| `baseFilePath` | `string` | — | Basispfad für den Kontext der Referenzauflösung. |
| `allowedRootDirectory` | `string` | — | Wurzelverzeichnis für Dateieingaben. **Erforderlich**, wenn `inputKind` gleich `"file"` ist. |
| `timeoutMs` | `number` | `15000` | Zeitlimit der Operation in Millisekunden. |
| `maxInputBytes` | `number` | `5242880` (5 MB) | Maximale Größe der Roheingabe in Bytes. |
| `maxDocumentNodes` | `number` | `100000` | Maximale Knotenzahl des eingelesenen Dokuments als DoS-Schutz. |
| `maxDocumentDepth` | `number` | `100` | Maximale Verschachtelungstiefe als DoS-Schutz. |
| `maxValidationErrors` | `number` | `50` | Maximale Anzahl der Fehler in der Fehlermeldung. |
| `maxErrorMessageLength` | `number` | `1000` | Maximale Zeichenanzahl pro Validierungsfehler. |
| `signal` | `AbortSignal` | — | Optionales Abbruchsignal. |

---

### `OpenApiValidationError`

Strukturierter Fehler bei fehlgeschlagener Validierung. Vor der Rückgabe an einen Client Fehler an der Anwendungsgrenze abbilden: Meldungen und Ursachen können lokale Pfade oder Dokumentdetails enthalten.

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| Eigenschaft | Typ | Beschreibung |
|---|---|---|
| `code` | `string` | Maschinenlesbarer Fehlercode; siehe folgende Tabelle. |
| `message` | `string` | Für Menschen lesbare Details. |
| `cause` | `unknown` | Optionaler zugrunde liegender Fehler. |

#### Fehlercodes

| Code | Bedeutung |
|---|---|
| `INVALID_OPTION` | Ungültiger Optionswert angegeben. |
| `INPUT_TOO_LARGE` | Rohinhalt überschreitet `maxInputBytes`. |
| `INPUT_FILE_TOO_LARGE` | Eingabedatei überschreitet das Größenlimit. |
| `FILE_INPUT_FORBIDDEN` | Dateieingabe ohne `allowedRootDirectory` verwendet. |
| `PATH_OUTSIDE_ROOT` | Dateipfad liegt nach Auflösung außerhalb von `allowedRootDirectory`. |
| `PARSE_ERROR` | JSON-/YAML-Inhalt konnte nicht eingelesen werden. |
| `INVALID_DOCUMENT_SHAPE` | Dokument ist kein JSON-Objekt. |
| `UNSUPPORTED_VERSION` | Dokument deklariert keine unterstützte OpenAPI-/Swagger-Version; nur Hauptversionen `2` und `3` werden akzeptiert. |
| `DOCUMENT_TOO_DEEP` | Verschachtelungstiefe überschreitet `maxDocumentDepth`. |
| `DOCUMENT_TOO_LARGE` | Knotenzahl überschreitet `maxDocumentNodes`. |
| `SPEC_VALIDATION_FAILED` | Spezifikation besteht die OpenAPI-Validierung nicht. |
| `OPERATION_TIMEOUT` | Operation überschreitet `timeoutMs`. |
| `OPERATION_ABORTED` | Operation wurde über `signal` abgebrochen. |
| `UNKNOWN_ERROR` | Unerwarteter Fehler. |

---

## Hilfsfunktionen

### `detectFormat`

Erkennt ein [`ConfigFormat`](#configformat) anhand der Erweiterung eines Dateipfads oder einer `file://`-URL.

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| Erweiterung | Ergebnis |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| jede andere Erweiterung | löst einen Fehler aus |

---

### `normalizeFilePath`

Wandelt einen lokalen Pfad oder eine `file:`-URL in einen absoluten nativen Pfad um. Gültige Leerzeichen und Unicode-Dateinamen bleiben erhalten.

```typescript
function normalizeFilePath(filePath: string): string;
```

Eine `file:`-URL wird mit `fileURLToPath` dekodiert; absolute Pfade werden unverändert zurückgegeben, relative Pfade anhand von `process.cwd()` aufgelöst.

---

## Prüffunktionen

Diese Funktionen werden für erweiterte Anwendungsfälle und interne Module erneut exportiert. Anwendungscode benötigt sie selten direkt.

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
Löst `TypeError` aus, wenn `value` keine nicht leere Zeichenfolge ist.

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
Löst eine Ausnahme aus, wenn `path` kein nicht leeres Array aus nicht leeren Zeichenfolgen oder sicheren, nicht negativen Ganzzahlen ist.

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
Prüft jede Operation: `op` muss `"add" | "replace" | "remove"` sein, `path` muss `assertPatchPath` bestehen und `add`/`replace` müssen eine eigene Eigenschaft `value` besitzen.

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
Löst eine Ausnahme aus, wenn `format` nicht `"json"`, `"jsonc"` oder `"yaml"` ist.

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
Gibt bei `Error`-Instanzen `error.message` zurück, andernfalls `String(error)`.

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
Erstellt einen `Error` und ergänzt eine Eigenschaft `cause` mit `Object.defineProperty`, mit Rückfalllösung für ältere Laufzeitumgebungen.

---

## Typen

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
Nur `"add"`, `"replace"` und `"remove"` werden unterstützt. `"move"`, `"copy"` und `"test"` sind bewusst ausgeschlossen.
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

Union der unterstützten OpenAPI-/Swagger-Dokumentstrukturen, die die Validierung zurückgibt:

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` ist ein großzügig definierter struktureller Typ:

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## Exportübersicht

| Symbol | Haupteinstieg | Kern-Unterpfad | Art |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | Funktion |
| `setContentValue` | ✓ | ✓ | Funktion |
| `deleteContentValue` | ✓ | ✓ | Funktion |
| `PatchContentOptions` | ✓ | ✓ | Typ |
| `assertNonEmptyString` | ✓ | ✓ | Funktion |
| `assertPatchPath` | ✓ | ✓ | Funktion |
| `assertPatchOperations` | ✓ | ✓ | Funktion |
| `assertConfigFormat` | ✓ | ✓ | Funktion |
| `getErrorMessage` | ✓ | ✓ | Funktion |
| `createError` | ✓ | ✓ | Funktion |
| `ConfigFormat` | ✓ | ✓ | Typ |
| `JsonPatchOp` | ✓ | ✓ | Typ |
| `JsonPathSegment` | ✓ | ✓ | Typ |
| `readConfigFile` | ✓ | — | Funktion |
| `writeConfigFile` | ✓ | — | Funktion |
| `WriteConfigOptions` | ✓ | — | Typ |
| `patchConfigFile` | ✓ | — | Funktion |
| `setConfigValue` | ✓ | — | Funktion |
| `deleteConfigValue` | ✓ | — | Funktion |
| `withFileLock` | ✓ | — | Funktion |
| `releaseAllLocalLocks` | ✓ | — | Funktion |
| `PatchConfigOptions` | ✓ | — | Typ |
| `FileLockOptions` | ✓ | — | Typ |
| `detectFormat` | ✓ | — | Funktion |
| `normalizeFilePath` | ✓ | — | Funktion |
| `validateOpenAPISpec` | ✓ | — | Funktion |
| `validateOpenAPIFile` | ✓ | — | Funktion |
| `OpenApiValidationError` | ✓ | — | Klasse |
| `ValidateOpenApiOptions` | ✓ | — | Typ |
| `OpenApiInputKind` | ✓ | — | Typ |
| `AnyOpenAPIDocument` | ✓ | — | Typ |