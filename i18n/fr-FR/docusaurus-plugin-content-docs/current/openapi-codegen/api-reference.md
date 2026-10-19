---
sidebar_position: 4
title: "Référence API"
description: "Documentation complète de l’API de @powerduck/openapi-codegen."
---

# Référence API

Documentation complète de l’API de `@powerduck/openapi-codegen`.

## Fonctions principales

| Export | Signature | Description |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | Générer du code source exécutable pour une opération |
| `register` | `(generator: Generator) => void` | Enregistrer un générateur personnalisé |
| `get` | `(language: string, client: string) => Generator \| undefined` | Rechercher un générateur |
| `list` | `() => Array<{ language: string; client: string }>` | Lister tous les générateurs enregistrés |
| `use` | `(plugin: Plugin) => void` | Appliquer un plugin qui enregistre des générateurs |
| `registerBuiltins` | `() => void` | Enregistrer tous les générateurs intégrés (automatique à l’import) |
| `normalize` | `(options) => NormalizedRequest` | Transformer document, chemin et méthode en requête normalisée |
| `builtinGenerators` | `Generator[]` | Tableau brut des définitions de tous les générateurs intégrés |

Les générateurs intégrés sont enregistrés automatiquement au chargement du module. L’appel manuel à `registerBuiltins()` est donc facultatif.

## generate(options)

```ts
generate(options: GenerateOptions): string
```

Renvoie le code source généré sous forme de chaîne. Recherche le générateur avec `get(options.language, options.client)` ; si `options.request` manque, appelle `normalize({ document, path, method, serverUrl, securityValues, softRefMode })`, puis `generator.generate(request)`.

Erreurs possibles :

- `TypeError` si `options` n’est pas un objet ou si des entrées obligatoires manquent.
- `Error: Unsupported generator: <language>/<client>` pour une combinaison inconnue.
- Erreurs de `normalize()` : chemin ou méthode inconnus, document invalide, `$ref` cassées ou circulaires sauf si `softRefMode` est activé.

Consultez [Configuration](/docs/fr-FR/openapi-codegen/configuration/#generateoptions) pour le tableau complet des options.

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

Enregistre dans le registre interne insensible à la casse, avec la clé `language\0client`.

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

Renvoie le `Generator`, ou `undefined` s’il n’existe pas.

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

Équivaut à appeler `plugin.register({ register })`.

## registerBuiltins()

```ts
registerBuiltins();
```

Idempotente grâce à un indicateur interne. Enregistre chaque entrée de `builtinGenerators`.

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

Résout les `$ref`, fusionne les paramètres du chemin et de l’opération, choisit le type de média du corps, génère les valeurs d’exemple, résout la sécurité et calcule `baseUrl`. Lève une erreur pour les chemins ou méthodes inconnus et les méthodes non prises en charge.

## Générateurs intégrés (21 langages, 41 clients) {#built-in-generators-21-languages-41-clients}

Identifiants exacts `language` et `client`, enregistrés dans `src/emitters/index.ts`. La recherche ne distingue pas la casse ; le tableau donne les identifiants canoniques.

| Langage | `language` | Valeurs de `client` |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| Fichier de requête HTTP | `http` | `http1` |
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

Total : 21 langages, 41 combinaisons.

> La présence d’un générateur ne signifie pas que chaque client peut représenter toutes les opérations. Par exemple, `shell/wget` ne permet pas de construire de façon sûre des requêtes `multipart/form-data` arbitraires ; utilisez plutôt `shell/curl` ou `shell/httpie`.

## Types fondamentaux

Réexportés depuis `./types` :

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

## Fonctions fondamentales

Toutes sont réexportées depuis la racine du paquet.

### refs

| Export | Description |
|--------|-------------|
| `RefResolver` | Classe de résolution JSON Pointer interne au document, sous la forme `#/...`. Constructeur : `(root, softMode = false)`. Méthodes : `deref(value)`, `resolveRef(ref)`, `clearCache()`. Champ public : `softMode`. Lève une erreur pour les références externes, cassées ou circulaires, sauf si `softMode` est vrai. |

### example

| Export | Description |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | Génère une valeur d’exemple depuis JSON Schema. Respecte `example`, `enum`, `const`, `default`, `oneOf`/`anyOf`/`allOf`, les types, formats et contraintes. |
| `ExampleGenContext` | Type `{ isRequestBody: boolean; isResponse: boolean }` contrôlant le filtrage `readOnly`/`writeOnly`. |
| `defaultExampleContext` | Valeur par défaut : `{ isRequestBody: false, isResponse: false }`. |

### serialize

| Export | Description |
|--------|-------------|
| `Pair` | Type `[string, string]`. |
| `parameter(parameter)` | Sérialise un paramètre en `Pair[]` selon les règles OpenAPI `style`/`explode` (form, spaceDelimited, pipeDelimited, label, matrix, simple, deepObject). |
| `query(pairs)` | Assemble les paires en chaîne de requête. |
| `cookie(pairs)` | Assemble les paires en valeur d’en-tête `Cookie`. |
| `headerValue(value)` | Nettoie une valeur d’en-tête en supprimant CR/LF/NUL. |

### generator

| Export | Description |
|--------|-------------|
| `createGenerator(language, client, emit)` | Encapsule une fonction `emit(request) => string` dans un `Generator`. |
| `GeneratorEmitter` | Type `(request: RequestIR) => string`. |

### registry

| Export | Description |
|--------|-------------|
| `registerGenerator(generator)` | Insère dans le registre insensible à la casse. |
| `getGenerator(language, client)` | Lit dans le registre. |
| `listGenerators()` | Renvoie `[{ language, client }, ...]`. |

### plugin

| Export | Description |
|--------|-------------|
| `PluginApi` | Type `{ register(generator: Generator): void }`. |
| `applyPlugin(plugin, api)` | Appelle `plugin.register(api)`. |

### request

| Export | Description |
|--------|-------------|
| `CompiledRequest` | Type `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`. |
| `compile(request)` | Remplace les paramètres de chemin, construit les paires query/header/cookie, applique la sécurité et assemble l’URL. |
| `form(value)` | Sérialise un objet en chaîne `application/x-www-form-urlencoded`. |

### helpers

Utilitaires courants :

| Export | Description |
|--------|-------------|
| `isRecord(value)` | Garde de type pour les objets simples. |
| `isFileValue(value)` | Garde de type pour un marqueur `FileValue`. |
| `firstDefined(...values)` | Première valeur différente de `undefined`. |
| `nonBlankString(value, fallback?)` | Chaîne non vide après suppression des espaces aux extrémités, ou `undefined`/valeur de repli. |
| `normalizeMethod(method)` | Méthode en majuscules, avec `GET` par défaut. |
| `supportsRequestBody(method)` | `false` pour `GET`/`HEAD`. |
| `requiresRequestBody(method)` | `true` pour `POST`/`PUT`/`PATCH`. |
| `mediaTypeOf(request, fallback)` | Type de média effectif issu du corps ou de l’en-tête Content-Type. |
| `hasJsonBody(request)` | Type de média JSON ou `+json`. |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | Texte brut du corps ou JSON mis en forme. |
| `toHeaderObject(headers)` | Convertit les paires en `Record<string,string>`. |
| `toKeyValueBody(value)` | Aplatit un corps multipart en descripteurs de champs ordonnés. |
| `collectByLocation(request, location)` | Filtre les paramètres selon leur emplacement OpenAPI. |
| `operationName(request)` | Déduit un nom de fonction ou variable en snake_case depuis la méthode et le chemin. |
| `sanitizeIdentifier(value)` | Transforme un texte arbitraire en identifiant valide. |
| `indent(text, prefix="  ")` | Indente chaque ligne non vide. |
| `stringifyLiteral(value)` | JSON mis en forme avec une solution de repli sûre. |
| `kotlinValue(value)` / `formFieldValue(value)` | Sérialise une valeur pour un littéral ou un champ de formulaire. |
| `fileComment(path, fieldName)` | Crée un commentaire TODO pour un chemin multipart provisoire. |
| `mergeAllOfSchemas(schemas, resolver)` | Fusionne superficiellement les schémas `allOf`. |
| `lightweightOpenAPIPreCheck(doc)` | Renvoie les avertissements structurels d’un document. |
| `browserHeaders(headers, multipart)` | Retire les en-têtes interdits par le navigateur. |
| `isBrowserForbiddenHeader(name)` | Indique si l’en-tête est contrôlé par les API réseau du navigateur. |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | Fonctions d’échappement des littéraux de chaîne propres à chaque langage. |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | Gardes d’assertion à l’exécution. |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | Constantes pour les fichiers de remplacement lors des téléversements. |
