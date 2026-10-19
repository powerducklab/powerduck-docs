---
sidebar_position: 4
title: "Konfiguration"
description: "Optionen für @powerduck/openapi-codegen: GenerateOptions, RequestIR sowie die Schnittstellen Generator und Plugin."
---

# Konfiguration

Es gibt keine separate Konfigurationsdatei. Gesteuert wird die Generierung durch das an [`generate()`](/docs/de-DE/openapi-codegen/api-reference/) übergebene Objekt `GenerateOptions`.

## GenerateOptions

```ts
interface GenerateOptions {
  language: string;
  client: string;
  request?: RequestIR;
  document?: unknown;
  path?: string;
  method?: string;
  serverUrl?: string;
  securityValues?: Record<string, string>;
  softRefMode?: boolean;
}
```

| Option | Typ | Erforderlich | Beschreibung |
|---|---|---|---|
| `language` | `string` | ja | Zielsprachkennung, Groß-/Kleinschreibung wird ignoriert, z. B. `"javascript"` |
| `client` | `string` | ja | Kennung des HTTP-Zielclients, z. B. `"fetch"` |
| `request` | `RequestIR` | eine Variante* | Bereits normalisierte Anfrage; überspringt `normalize` |
| `document` | `unknown` | eine Variante* | Geparstes OpenAPI-Dokumentobjekt |
| `path` | `string` | mit `document` | Exakte OpenAPI-Pfadvorlage, z. B. `"/pets/{id}"` |
| `method` | `string` | mit `document` | HTTP-Methode, z. B. `"get"` / `"post"` |
| `serverUrl` | `string` | nein | Server-URL aus dem Dokument überschreiben |
| `securityValues` | `Record<string, string>` | nein | Zugangsdaten, indiziert nach dem Namen des Sicherheitsschemas |
| `softRefMode` | `boolean` | nein | Bei defekten oder zyklischen `$ref`s keinen Fehler auslösen, sondern Teilwerte zurückgeben |

\* Entweder nur `request` oder die Kombination `document` + `path` + `method` muss angegeben werden. Ist `request` vorhanden, werden `document`, `path`, `method`, `serverUrl`, `securityValues` und `softRefMode` ignoriert.

### Fehler bei der Eingabevalidierung

`generate()` löst einen Fehler aus, wenn erforderliche Eingaben fehlen:

- `TypeError: generate() requires an options object` — Kein Optionsobjekt angegeben.
- `Error: Unsupported generator: <language>/<client>` — Unbekannte Kombination.
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

`normalize()` selbst löst bei nicht unterstützten Methoden, fehlenden `paths`, unbekannten Pfaden und fehlenden Operationen einen `Error` aus; bei Dokumenten, die keine Objekte sind, einen `TypeError`.

## RequestIR

Die normalisierte, vom Code-Emitter unabhängige Darstellung einer Anfrage. Sie können sie direkt erstellen und als `options.request` übergeben, um `normalize` zu umgehen.

```ts
interface RequestIR {
  method: string;
  baseUrl: string;
  path: string;
  parameters: Parameter[];
  headers: Parameter[];
  body?: Body;
  security: Security[];
}
```

### Parameter

```ts
interface Parameter {
  name: string;
  in: ParameterLocation;
  value: unknown;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";
```

### Body

```ts
interface Body {
  mediaType: string;
  value: unknown;
  encoding?: Record<string, unknown>;
}
```

### Security

```ts
interface Security {
  name: string;
  type: string;       // e.g. "apiKey" | "http"
  scheme?: string;    // e.g. "bearer" | "basic"
  in?: string;        // e.g. "header" | "query" | "cookie"
  paramName?: string;
  value: string;
}
```

### FileValue

Dateiplatzhalter für Multipart verwenden diese Markierungsstruktur:

```ts
interface FileValue {
  __file: true;
  path?: string;
  name?: string;
  contentType?: string;
  data?: string | ArrayBuffer | Uint8Array | Blob;
}
```

## Generator

Ein Generator ist ein Objekt, das dieser Schnittstelle entspricht. Integrierte Generatoren werden mit `createGenerator(language, client, emit)` erstellt; eigene können Sie ebenfalls registrieren:

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate` erhält einen `RequestIR` und gibt den generierten Quellcode als Zeichenfolge zurück.

## Plugin

Ein Plugin registriert über `use()` einen oder mehrere Generatoren:

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

Beispiel:

```typescript
import { use } from "@powerduck/openapi-codegen";

use({
  name: "my-plugin",
  register({ register }) {
    register({
      language: "mylang",
      client: "my-client",
      generate(request) {
        return `// ${request.method} ${request.path}`;
      },
    });
  },
});
```

## GenerateResult

Dieser Typ ist für künftige Generatorausgaben vorgesehen, die mehrere Dateien enthalten können. Derzeit gibt `generate()` weiterhin einen `string` zurück:

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## Ausgabeform von normalize

Ein direkter Aufruf von `normalize()` (siehe [API-Referenz](/docs/de-DE/openapi-codegen/api-reference/#normalizeoptions)) liefert ein etwas umfangreicheres Objekt als `RequestIR`:

```ts
{
  preWarnings: string[];   // lightweight structural warnings
  method: string;          // uppercase
  baseUrl: string;
  path: string;
  parameters: NormalizedParameter[];
  headers: NormalizedParameter[];   // parameters filtered to in === "header"
  body?: { mediaType, value, encoding? };
  security: NormalizedSecurity[];
}
```

## Reihenfolge der Server-URL-Auflösung

`baseUrl` erhält den ersten nicht leeren Wert aus:

1. `options.serverUrl`
2. `servers` der Operation
3. `servers` des Pfadeintrags
4. `servers` auf Wurzelebene
5. Ersatzwert `"https://example.com"`

Serverplatzhalter `{variable}` werden aus `server.variables` mit `default`, ersatzweise `example`, gefüllt und URI-kodiert.
