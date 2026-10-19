---
sidebar_position: 4
title: "Configurazione"
description: "Opzioni di generazione di @powerduck/openapi-codegen: GenerateOptions, RequestIR e le interfacce Generator e Plugin."
---

# Configurazione

Non esiste un file di configurazione separato. La generazione è controllata dall'oggetto `GenerateOptions` passato a [`generate()`](/docs/it-IT/openapi-codegen/api-reference/).

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

| Opzione | Tipo | Obbligatorio | Descrizione |
|---|---|---|---|
| `language` | `string` | sì | Identificatore del linguaggio di destinazione, non distingue maiuscole e minuscole, ad es. `"javascript"` |
| `client` | `string` | sì | Identificatore del client HTTP di destinazione, ad es. `"fetch"` |
| `request` | `RequestIR` | una variante* | Richiesta già normalizzata; salta `normalize` |
| `document` | `unknown` | una variante* | Oggetto documento OpenAPI già analizzato |
| `path` | `string` | con `document` | Modello di percorso OpenAPI esatto, ad es. `"/pets/{id}"` |
| `method` | `string` | con `document` | Metodo HTTP, ad es. `"get"` / `"post"` |
| `serverUrl` | `string` | no | Sostituisce l'URL del server del documento |
| `securityValues` | `Record<string, string>` | no | Credenziali indicizzate per nome dello schema di sicurezza |
| `softRefMode` | `boolean` | no | Non genera errori per `$ref` interrotti o circolari; restituisce valori parziali |

\* È necessario fornire solo `request` oppure `document` + `path` + `method`. Se è presente `request`, vengono ignorati `document`, `path`, `method`, `serverUrl`, `securityValues` e `softRefMode`.

### Errori di validazione dell'input

`generate()` genera un errore quando mancano input obbligatori:

- `TypeError: generate() requires an options object` — Oggetto delle opzioni assente.
- `Error: Unsupported generator: <language>/<client>` — Combinazione sconosciuta.
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

`normalize()` genera `Error` per metodi non supportati, assenza di `paths`, percorsi sconosciuti e operazioni mancanti; genera `TypeError` se il documento non è un oggetto.

## RequestIR

Rappresentazione normalizzata di una richiesta, indipendente dal generatore di codice. Puoi costruirla direttamente e passarla come `options.request` per saltare `normalize`.

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

I segnaposto per i file multipart usano questa struttura:

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

Un generatore è un oggetto conforme a questa interfaccia. Quelli integrati vengono creati con `createGenerator(language, client, emit)`, ma puoi registrare i tuoi:

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate` riceve un `RequestIR` e restituisce il codice sorgente generato come stringa.

## Plugin

Un plugin registra uno o più generatori tramite `use()`:

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

Esempio:

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

Questo tipo è previsto per futuri risultati che possono contenere più file. Attualmente `generate()` restituisce ancora una `string`:

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## Struttura di output di normalize

Chiamando direttamente `normalize()` (vedi il [riferimento API](/docs/it-IT/openapi-codegen/api-reference/#normalizeoptions)) si ottiene un oggetto leggermente più ampio di `RequestIR`:

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

## Ordine di risoluzione dell'URL del server

`baseUrl` assume il primo valore non vuoto fra:

1. `options.serverUrl`
2. i `servers` dell'operazione
3. i `servers` dell'elemento percorso
4. i `servers` alla radice
5. il valore di ripiego `"https://example.com"`

I segnaposto `{variable}` del server vengono compilati da `server.variables` usando `default`, oppure `example` se assente, con codifica URI.
