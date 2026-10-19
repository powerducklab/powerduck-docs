---
sidebar_position: 4
title: "Riferimento API"
description: "Documentazione completa dell'API di @powerduck/openapi-codegen."
---

# Riferimento API

Documentazione completa dell'API di `@powerduck/openapi-codegen`.

## Funzioni principali

| Export | Firma | Descrizione |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | Genera codice sorgente eseguibile per un'operazione |
| `register` | `(generator: Generator) => void` | Registra un generatore personalizzato |
| `get` | `(language: string, client: string) => Generator \| undefined` | Cerca un generatore |
| `list` | `() => Array<{ language: string; client: string }>` | Elenca tutti i generatori registrati |
| `use` | `(plugin: Plugin) => void` | Applica un plugin che registra generatori |
| `registerBuiltins` | `() => void` | Registra tutti i generatori integrati, automaticamente all'importazione |
| `normalize` | `(options) => NormalizedRequest` | Trasforma documento, percorso e metodo in una richiesta normalizzata |
| `builtinGenerators` | `Generator[]` | Array originale di tutte le definizioni dei generatori integrati |

I generatori integrati vengono registrati automaticamente al caricamento del modulo; la chiamata manuale a `registerBuiltins()` è facoltativa.

## generate(options)

```ts
generate(options: GenerateOptions): string
```

Restituisce il codice sorgente generato come stringa. Cerca il generatore con `get(options.language, options.client)`; se manca `options.request`, chiama `normalize({ document, path, method, serverUrl, securityValues, softRefMode })`; infine chiama `generator.generate(request)`.

Errori possibili:

- `TypeError` quando `options` non è un oggetto o mancano input obbligatori.
- `Error: Unsupported generator: <language>/<client>` per una combinazione sconosciuta.
- Errori di `normalize()` per percorso o metodo sconosciuto, documento non valido o `$ref` interrotti o circolari, salvo quando è attivo `softRefMode`.

Consulta [Configurazione](/docs/it-IT/openapi-codegen/configuration/#generateoptions) per la tabella completa delle opzioni.

## register(generator)

```ts
register({
  language: "mylang",
  client: "my-client",
  generate(request) {
    return `// ${request.method} ${request.path}`;
  },
});
```

Registra nell'archivio interno senza distinguere maiuscole e minuscole, con chiave `language\0client`.

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

Restituisce il `Generator`, oppure `undefined` se non esiste.

## list()

```ts
const combos = list();
// [{ language: "c", client: "libcurl" }, ...]
```

## use(plugin)

```ts
use({
  name: "my-plugin",
  register({ register }) {
    register(customGenerator);
  },
});
```

Equivale a chiamare `plugin.register({ register })`.

## registerBuiltins()

```ts
registerBuiltins();
```

Idempotente grazie a un flag interno. Registra ogni voce di `builtinGenerators`.

## normalize(options)

```ts
import { normalize } from "@powerduck/openapi-codegen";

const request = normalize({
  document,
  path: "/pets/{id}",
  method: "get",
  serverUrl: "https://example.com",
  securityValues: { bearerAuth: "token" },
  softRefMode: false,
});
```

Risolve i `$ref`, unisce i parametri di percorso e operazione, sceglie il tipo di contenuto del corpo, genera valori di esempio, risolve la sicurezza e calcola `baseUrl`. Genera errori per percorsi o metodi sconosciuti e metodi non supportati.

## Generatori integrati (21 linguaggi, 41 client) {#built-in-generators-21-languages-41-clients}

Identificatori esatti `language` e `client`, registrati in `src/emitters/index.ts`. La ricerca non distingue maiuscole e minuscole; la tabella riporta gli identificatori canonici.

| Linguaggio | `language` | Valori di `client` |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| File di richiesta HTTP | `http` | `http1` |
| Java | `java` | `asynchttp`, `java-net-http`, `okhttp`, `unirest` |
| JavaScript | `javascript` | `axios`, `fetch`, `jquery`, `ofetch`, `xhr` |
| Kotlin | `kotlin` | `okhttp` |
| Node.js | `node` | `axios`, `fetch`, `ofetch`, `undici` |
| Objective-C | `objc` | `nsurlsession` |
| OCaml | `ocaml` | `cohttp` |
| PHP | `php` | `curl`, `guzzle`, `laravel-http` |
| PowerShell | `powershell` | `invoke-restmethod`, `invoke-webrequest` |
| Python | `python` | `aiohttp`, `http-client`, `httpx-async`, `httpx-sync`, `requests` |
| R | `r` | `httr2` |
| Ruby | `ruby` | `net-http` |
| Rust | `rust` | `reqwest` |
| Shell | `shell` | `curl`, `httpie`, `wget` |
| Swift | `swift` | `nsurlsession` |

Totale: 21 linguaggi, 41 combinazioni.

> La disponibilità di un generatore non implica che ogni client possa rappresentare ogni operazione. Ad esempio, `shell/wget` non può costruire in sicurezza richieste `multipart/form-data` arbitrarie; usa invece `shell/curl` o `shell/httpie`.

## Tipi fondamentali

Riesportati da `./types`:

```ts
type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";

interface FileValue { __file: true; path?; name?; contentType?; data?; }
interface Parameter { name; in: ParameterLocation; value: unknown; style?; explode?; allowReserved?; }
interface Body { mediaType: string; value: unknown; encoding?: Record<string, unknown>; }
interface Security { name; type; scheme?; in?; paramName?; value: string; }
interface RequestIR { method; baseUrl; path; parameters: Parameter[]; headers: Parameter[]; body?; security: Security[]; }
interface GenerateResult { code: string; files?: Record<string, string>; metadata?: Record<string, unknown>; }
interface Generator { language: string; client: string; generate(request: RequestIR): string; }
interface Plugin { name: string; register(api: { register(g: Generator): void }): void; }
interface GenerateOptions { language; client; request?; document?; path?; method?; serverUrl?; securityValues?; softRefMode?; }
```

## Funzioni del nucleo

Sono tutte riesportate dalla radice del pacchetto.

### refs

| Export | Descrizione |
|--------|-------------|
| `RefResolver` | Classe per risolvere JSON Pointer `#/...` interni al documento. Costruttore: `(root, softMode = false)`. Metodi: `deref(value)`, `resolveRef(ref)`, `clearCache()`. Campo pubblico: `softMode`. Genera errori per riferimenti esterni, interrotti o circolari, salvo quando `softMode` è vero. |

### example

| Export | Descrizione |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | Genera un valore di esempio da JSON Schema. Rispetta `example`, `enum`, `const`, `default`, `oneOf`/`anyOf`/`allOf`, tipi, formati e vincoli. |
| `ExampleGenContext` | Tipo `{ isRequestBody: boolean; isResponse: boolean }` che controlla il filtro `readOnly`/`writeOnly`. |
| `defaultExampleContext` | Valore predefinito: `{ isRequestBody: false, isResponse: false }`. |

### serialize

| Export | Descrizione |
|--------|-------------|
| `Pair` | Tipo `[string, string]`. |
| `parameter(parameter)` | Serializza un parametro in `Pair[]` secondo le regole OpenAPI `style`/`explode` (form, spaceDelimited, pipeDelimited, label, matrix, simple, deepObject). |
| `query(pairs)` | Unisce le coppie in una stringa di query. |
| `cookie(pairs)` | Unisce le coppie nel valore dell'header `Cookie`. |
| `headerValue(value)` | Pulisce un valore di header eliminando CR/LF/NUL. |

### generator

| Export | Descrizione |
|--------|-------------|
| `createGenerator(language, client, emit)` | Racchiude una funzione `emit(request) => string` in un `Generator`. |
| `GeneratorEmitter` | Tipo `(request: RequestIR) => string`. |

### registry

| Export | Descrizione |
|--------|-------------|
| `registerGenerator(generator)` | Inserisce nell'archivio senza distinguere maiuscole e minuscole. |
| `getGenerator(language, client)` | Legge dall'archivio. |
| `listGenerators()` | Restituisce `[{ language, client }, ...]`. |

### plugin

| Export | Descrizione |
|--------|-------------|
| `PluginApi` | Tipo `{ register(generator: Generator): void }`. |
| `applyPlugin(plugin, api)` | Chiama `plugin.register(api)`. |

### request

| Export | Descrizione |
|--------|-------------|
| `CompiledRequest` | Tipo `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`. |
| `compile(request)` | Sostituisce i parametri di percorso, costruisce coppie query/header/cookie, applica la sicurezza e compone l'URL. |
| `form(value)` | Serializza un oggetto in una stringa `application/x-www-form-urlencoded`. |

### helpers

Utilità comuni:

| Export | Descrizione |
|--------|-------------|
| `isRecord(value)` | Guardia di tipo per oggetti semplici. |
| `isFileValue(value)` | Guardia di tipo per un marcatore `FileValue`. |
| `firstDefined(...values)` | Primo valore diverso da `undefined`. |
| `nonBlankString(value, fallback?)` | Stringa non vuota dopo la rimozione degli spazi alle estremità, oppure `undefined`/valore di ripiego. |
| `normalizeMethod(method)` | Metodo in maiuscolo, con `GET` come ripiego. |
| `supportsRequestBody(method)` | `false` per `GET`/`HEAD`. |
| `requiresRequestBody(method)` | `true` per `POST`/`PUT`/`PATCH`. |
| `mediaTypeOf(request, fallback)` | Tipo di contenuto effettivo ricavato dal corpo o dall'header Content-Type. |
| `hasJsonBody(request)` | Tipo di contenuto JSON o `+json`. |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | Testo grezzo del corpo o JSON formattato. |
| `toHeaderObject(headers)` | Converte coppie in un `Record<string,string>`. |
| `toKeyValueBody(value)` | Appiattisce un corpo multipart in descrittori di campo ordinati. |
| `collectByLocation(request, location)` | Filtra i parametri per posizione OpenAPI. |
| `operationName(request)` | Deriva un nome di funzione o variabile in snake_case da metodo e percorso. |
| `sanitizeIdentifier(value)` | Trasforma testo arbitrario in un identificatore valido. |
| `indent(text, prefix="  ")` | Indenta ogni riga non vuota. |
| `stringifyLiteral(value)` | JSON formattato con un ripiego sicuro. |
| `kotlinValue(value)` / `formFieldValue(value)` | Serializza un valore per un letterale o campo di modulo. |
| `fileComment(path, fieldName)` | Crea un commento TODO per un percorso multipart segnaposto. |
| `mergeAllOfSchemas(schemas, resolver)` | Unisce superficialmente gli schemi `allOf`. |
| `lightweightOpenAPIPreCheck(doc)` | Restituisce avvisi strutturali sul documento. |
| `browserHeaders(headers, multipart)` | Elimina gli header vietati dal browser. |
| `isBrowserForbiddenHeader(name)` | Indica se un header è controllato dalle API di rete del browser. |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | Funzioni di escape dei letterali stringa specifiche per linguaggio. |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | Guardie di asserzione a runtime. |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | Costanti per i file segnaposto dei caricamenti. |
