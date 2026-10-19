---
sidebar_position: 4
title: "API-Referenz"
description: "Vollständige API-Dokumentation für @powerduck/openapi-codegen."
---

# API-Referenz

Vollständige API-Dokumentation für `@powerduck/openapi-codegen`.

## Funktionen auf oberster Ebene

| Export | Signatur | Beschreibung |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | Ausführbaren Quellcode für eine Operation erzeugen |
| `register` | `(generator: Generator) => void` | Eigenen Generator registrieren |
| `get` | `(language: string, client: string) => Generator \| undefined` | Generator nachschlagen |
| `list` | `() => Array<{ language: string; client: string }>` | Alle registrierten Generatoren auflisten |
| `use` | `(plugin: Plugin) => void` | Plugin anwenden, das Generatoren registriert |
| `registerBuiltins` | `() => void` | Alle integrierten Generatoren registrieren (automatisch beim Import) |
| `normalize` | `(options) => NormalizedRequest` | Dokument, Pfad und Methode in eine normalisierte Anfrage umwandeln |
| `builtinGenerators` | `Generator[]` | Unverarbeitetes Array aller integrierten Generatordefinitionen |

Die integrierten Generatoren werden beim Laden des Moduls automatisch registriert. Ein manueller Aufruf von `registerBuiltins()` ist daher optional.

## generate(options)

```ts
generate(options: GenerateOptions): string
```

Gibt den erzeugten Quellcode als Zeichenfolge zurück. Sucht den Generator mit `get(options.language, options.client)`; ohne `options.request` wird `normalize({ document, path, method, serverUrl, securityValues, softRefMode })` aufgerufen; anschließend folgt `generator.generate(request)`.

Mögliche Fehler:

- `TypeError`, wenn `options` kein Objekt ist oder erforderliche Eingaben fehlen.
- `Error: Unsupported generator: <language>/<client>` bei einer unbekannten Kombination.
- Fehler aus `normalize()` bei unbekanntem Pfad oder unbekannter Methode, ungültigem Dokument sowie defekten oder zyklischen `$ref`s, sofern `softRefMode` nicht aktiviert ist.

Die vollständige Optionstabelle finden Sie unter [Konfiguration](/docs/de-DE/openapi-codegen/configuration/#generateoptions).

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

Registriert im internen Speicher ohne Unterscheidung von Groß- und Kleinschreibung, mit `language\0client` als Schlüssel.

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

Gibt den `Generator` zurück, andernfalls `undefined`.

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

Entspricht dem Aufruf `plugin.register({ register })`.

## registerBuiltins()

```ts
registerBuiltins();
```

Idempotent, durch ein internes Flag abgesichert. Registriert jeden Eintrag aus `builtinGenerators`.

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

Löst `$ref`s auf, führt Pfad- und Operationsparameter zusammen, wählt den Medientyp des Anfragebodys, erzeugt Beispielwerte, löst Sicherheitsschemas auf und berechnet `baseUrl`. Unbekannte Pfade oder Methoden sowie nicht unterstützte Methoden lösen Fehler aus.

## Integrierte Generatoren (21 Sprachen, 41 Clients) {#built-in-generators-21-languages-41-clients}

Die exakten Kennungen für `language` und `client`, wie in `src/emitters/index.ts` registriert. Die Suche ignoriert Groß- und Kleinschreibung; die Tabelle zeigt die kanonischen Kennungen.

| Sprache | `language` | Werte für `client` |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| HTTP-Anfragedatei | `http` | `http1` |
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

Anzahl: 21 Sprachen, 41 Kombinationen.

> Ein verfügbarer Generator bedeutet nicht, dass jeder Client jede Operation darstellen kann. Beispielsweise kann `shell/wget` nicht beliebige `multipart/form-data`-Anfragen sicher erstellen. Verwenden Sie dafür `shell/curl` oder `shell/httpie`.

## Kerntypen

Aus `./types` erneut exportiert:

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

## Kernfunktionen

Alle werden über den Paketeinstiegspunkt erneut exportiert.

### refs

| Export | Beschreibung |
|--------|-------------|
| `RefResolver` | Klasse zur Auflösung dokumentinterner JSON Pointer mit `#/...`. Konstruktor: `(root, softMode = false)`. Methoden: `deref(value)`, `resolveRef(ref)`, `clearCache()`. Öffentliches Feld: `softMode`. Externe, defekte oder zyklische Referenzen lösen Fehler aus, außer wenn `softMode` wahr ist. |

### example

| Export | Beschreibung |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | Erzeugt einen Beispielwert aus JSON Schema. Berücksichtigt `example`, `enum`, `const`, `default`, `oneOf`/`anyOf`/`allOf`, Typen, Formate und Einschränkungen. |
| `ExampleGenContext` | Typ `{ isRequestBody: boolean; isResponse: boolean }` zur Steuerung der `readOnly`-/`writeOnly`-Filterung. |
| `defaultExampleContext` | Standardwert `{ isRequestBody: false, isResponse: false }`. |

### serialize

| Export | Beschreibung |
|--------|-------------|
| `Pair` | Typ `[string, string]`. |
| `parameter(parameter)` | Serialisiert einen Parameter zu `Pair[]` nach OpenAPI `style`/`explode` (form, spaceDelimited, pipeDelimited, label, matrix, simple, deepObject). |
| `query(pairs)` | Verbindet Paare zu einer Query-Zeichenfolge. |
| `cookie(pairs)` | Verbindet Paare zum Wert eines `Cookie`-Headers. |
| `headerValue(value)` | Bereinigt einen Headerwert durch Entfernen von CR/LF/NUL. |

### generator

| Export | Beschreibung |
|--------|-------------|
| `createGenerator(language, client, emit)` | Verpackt eine Funktion `emit(request) => string` als `Generator`. |
| `GeneratorEmitter` | Typ `(request: RequestIR) => string`. |

### registry

| Export | Beschreibung |
|--------|-------------|
| `registerGenerator(generator)` | Fügt einen Eintrag ohne Unterscheidung von Groß- und Kleinschreibung hinzu. |
| `getGenerator(language, client)` | Liest aus dem Speicher. |
| `listGenerators()` | Gibt `[{ language, client }, ...]` zurück. |

### plugin

| Export | Beschreibung |
|--------|-------------|
| `PluginApi` | Typ `{ register(generator: Generator): void }`. |
| `applyPlugin(plugin, api)` | Ruft `plugin.register(api)` auf. |

### request

| Export | Beschreibung |
|--------|-------------|
| `CompiledRequest` | Typ `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`. |
| `compile(request)` | Ersetzt Pfadparameter, erstellt Query-/Header-/Cookie-Paare, wendet Sicherheitsschemas an und setzt die URL zusammen. |
| `form(value)` | Serialisiert ein Objekt zu einer `application/x-www-form-urlencoded`-Zeichenfolge. |

### helpers

Häufig verwendete Hilfsfunktionen:

| Export | Beschreibung |
|--------|-------------|
| `isRecord(value)` | Typprüfung für einfache Objekte. |
| `isFileValue(value)` | Typprüfung für einen `FileValue`-Marker. |
| `firstDefined(...values)` | Erster Wert, der nicht `undefined` ist. |
| `nonBlankString(value, fallback?)` | Getrimmte, nicht leere Zeichenfolge oder `undefined` beziehungsweise Ersatzwert. |
| `normalizeMethod(method)` | Methode in Großbuchstaben; Standard ist `GET`. |
| `supportsRequestBody(method)` | `false` für `GET`/`HEAD`. |
| `requiresRequestBody(method)` | `true` für `POST`/`PUT`/`PATCH`. |
| `mediaTypeOf(request, fallback)` | Wirksamer Medientyp aus dem Body oder Content-Type-Header. |
| `hasJsonBody(request)` | Medientyp JSON oder `+json`. |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | Unveränderter Bodytext oder formatiertes JSON. |
| `toHeaderObject(headers)` | Wandelt Paare in ein `Record<string,string>` um. |
| `toKeyValueBody(value)` | Reduziert einen Multipart-Body auf geordnete Feldbeschreibungen. |
| `collectByLocation(request, location)` | Filtert Parameter nach ihrer OpenAPI-Position. |
| `operationName(request)` | Leitet aus Methode und Pfad einen Funktions- oder Variablennamen in snake_case ab. |
| `sanitizeIdentifier(value)` | Wandelt beliebigen Text in einen gültigen Bezeichner um. |
| `indent(text, prefix="  ")` | Rückt jede nicht leere Zeile ein. |
| `stringifyLiteral(value)` | Formatiertes JSON mit sicherem Ersatzwert. |
| `kotlinValue(value)` / `formFieldValue(value)` | Serialisiert einen Wert für ein Literal oder Formularfeld. |
| `fileComment(path, fieldName)` | Erstellt einen TODO-Kommentar für einen Multipart-Platzhalterpfad. |
| `mergeAllOfSchemas(schemas, resolver)` | Führt `allOf`-Schemas flach zusammen. |
| `lightweightOpenAPIPreCheck(doc)` | Gibt strukturelle Warnungen für ein Dokument zurück. |
| `browserHeaders(headers, multipart)` | Entfernt vom Browser verbotene Header. |
| `isBrowserForbiddenHeader(name)` | Prüft, ob ein Header von den Netzwerk-APIs des Browsers verwaltet wird. |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | Sprachspezifische Escape-Funktionen für Zeichenfolgenliterale. |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | Assertions zur Laufzeitprüfung. |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | Konstanten für Platzhalter bei Datei-Uploads. |
