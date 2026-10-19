---
sidebar_position: 4
title: "Référence API"
description: "Référence du point d’entrée public de @powerduck/x-to-openapi"
---

# Référence API

Référence du point d’entrée public de `@powerduck/x-to-openapi`. Les signatures ci-dessous résument l’API ; consultez les déclarations TypeScript du paquet pour l’ensemble des annotations de lecture seule et des types importés.

---

## Fonctions sans configuration

### `curlToOpenApi`

Conversion en un appel : enregistre un [`CurlAdapter`](#curladapter), puis appelle [`convert`](#convertsource-input-options).

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Paramètre | Type | Description |
|---|---|---|
| `input` | `string \| readonly string[]` | Une commande curl, un tableau de commandes ou la sortie « Tout copier au format cURL » du navigateur ; le texte contenant plusieurs commandes est découpé automatiquement. |
| `options` | `ConvertOptions` | Paramètres de conversion facultatifs. |

**Renvoie :** [`ConvertResult`](#convertresult).

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

Conversion en un appel : enregistre un [`PostmanAdapter`](#postmanadapter), puis convertit. Accepte un objet collection déjà analysé ou une chaîne JSON. Les scripts de test sont conservés dans `x-postman-scripts`.

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Paramètre | Type | Description |
|---|---|---|
| `input` | `unknown` | Un objet Postman Collection v2.0/v2.1.0 ou sa représentation JSON. |
| `options` | `ConvertOptions` | Paramètres de conversion facultatifs. |

**Renvoie :** [`ConvertResult`](#convertresult).

---

## Infrastructure principale

### `XToOpenApi`

Classe de conversion. Contient un [`AdapterRegistry`](#adapterregistry) et exécute le pipeline analyse → construction → validation.

```typescript
class XToOpenApi {
  register<I>(adapter: SourceAdapter<I>): this;
  adapters(): string[];
  convert(
    source: string,
    input: unknown,
    options?: ConvertOptions,
  ): Promise<ConvertResult>;
}
```

#### `register(adapter)`

Enregistre un adaptateur et renvoie `this` pour permettre le chaînage. Vérifie que son `id` respecte `/^[a-z][a-z0-9-]*$/`, exige une méthode `parse()` et refuse les identifiants en double.

#### `adapters()`

Renvoie les identifiants des adaptateurs enregistrés sous forme de `string[]`.

#### `convert(source, input, options?)`

Point d’entrée unique.

| Paramètre | Type | Description |
|---|---|---|
| `source` | `string` | Un identifiant d’adaptateur (`"curl"`, `"postman"`, etc.) ou `"auto"` pour une sélection via `canHandle()`. |
| `input` | `unknown` | Données source, dont la structure dépend de l’adaptateur. |
| `options` | `ConvertOptions` | Paramètres de conversion facultatifs. |

**Comportement :**

1. Fusionne les options avec [`DEFAULT_OPTIONS`](#default_options) et les valide.
2. Refuse les chaînes, ou l’ensemble des éléments chaîne d’un tableau, dépassant **10 × 1024 × 1024 unités de code JavaScript**, en levant une `ConversionError`. Ce n’est pas une limite en octets UTF-8 ; les objets déjà analysés ne sont pas mesurés.
3. Sélectionne l’adaptateur par identifiant explicite ou détection `"auto"`.
4. Analyse l’entrée en `NormalizedRequest[]` ; les échecs d’analyse deviennent des diagnostics.
5. Construit le document OpenAPI 3.2 via [`buildOpenApi32`](#buildopenapi32).
6. Si `validate` vaut `true`, valide via [`validateOpenApi32`](#validateopenapi32) et intègre les diagnostics obtenus.
7. Renvoie un [`ConvertResult`](#convertresult).

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

Valeurs par défaut auxquelles chaque [`ConvertOptions`](#convertoptions) est fusionné. Exportées sous le type `ResolvedConvertOptions`.

```typescript
const DEFAULT_OPTIONS: ResolvedConvertOptions = {
  openapiVersion: "3.2.0",
  title: "Generated API",
  version: "1.0.0",
  description: "",
  inferPathParameters: true,
  pathParameterMinSamples: 2,
  inferSecurity: true,
  includeCommonHeaders: false,
  includeCookies: false,
  includeExamples: false,
  useServerBasePath: false,
  validate: true,
  strict: false,
};
```

---

### `AdapterRegistry`

Conserve les adaptateurs enregistrés par identifiant.

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| Méthode | Description |
|---|---|
| `register(adapter)` | Valide l’identifiant (`/^[a-z][a-z0-9-]*$/`), vérifie `parse()` et refuse les doublons. Renvoie `this`. |
| `has(id)` | Vérifie l’appartenance au registre. |
| `get(id)` | Renvoie l’adaptateur ou lève une exception indiquant les identifiants enregistrés. |
| `detect(input)` | Renvoie le premier adaptateur dont `canHandle()` accepte l’entrée. Les exceptions des prédicats sont interceptées, puis l’adaptateur est ignoré. |
| `ids()` | Liste les identifiants enregistrés. |

---

### `ConversionError`

Levée pour les diagnostics de gravité erreur en mode `strict`, une chaîne trop volumineuse ou l’échec de la sélection automatique d’adaptateur. Elle contient les diagnostics disponibles ; la liste peut être vide. Des options invalides ou des erreurs d’enregistrement peuvent plutôt lever `TypeError` ou `Error`.

```typescript
class ConversionError extends Error {
  readonly diagnostics: readonly Diagnostic[];
  constructor(
    message: string,
    diagnostics: readonly Diagnostic[],
    options?: { cause?: unknown },
  );
}
```

---

### `DiagnosticBag`

Collecteur interne utilisé par [`XToOpenApi.convert`](#convertsource-input-options). Déduplique les diagnostics et lève une `ConversionError` pour les erreurs lorsque `strict` vaut `true`.

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## Adaptateurs

### `CurlAdapter`

Convertit les commandes curl, seules, en lot ou exportées par le navigateur, en `NormalizedRequest[]`. Encapsule `curlconverter` et normalise sa sortie.

```typescript
class CurlAdapter implements SourceAdapter<string | readonly string[]> {
  readonly id = "curl";
  canHandle(input: unknown): boolean;
  parse(
    input: string | readonly string[],
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- `canHandle` accepte une chaîne, ou le premier élément d’un tableau, commençant par une invite facultative (`$`, `#`, `>`), suivie de `curl` ou `curl.exe`.
- `parse` découpe les commandes avec [`splitCurlCommands`](#splitcurlcommands), ignore les URL autres que HTTP(S), retire les pseudo-en-têtes HTTP/2, analyse les corps et cookies, puis déduit l’authentification.

> `resolveBackend`, `availableExports` et `resetBackend` sont des fonctions d’intégration internes, pas des exports pris en charge. Importez l’adaptateur public plutôt que les fichiers internes.

---

### `splitCurlCommands`

Découpe la sortie « Tout copier au format cURL » en commandes individuelles. Gère les guillemets simples et doubles, les continuations par barre oblique inverse ou accent circonflexe (`^`), CRLF, les invites (`$`, `#`, `>`, `PS C:\>`) et `curl.exe`.

```typescript
function splitCurlCommands(input: string): string[];
```

```typescript
import { splitCurlCommands } from "@powerduck/x-to-openapi";

const commands = splitCurlCommands(`
  $ curl https://api.example.com/users
  > curl https://api.example.com/users/123
`);
// ["curl https://api.example.com/users", "curl https://api.example.com/users/123"]
```

---

### `PostmanAdapter`

Convertit les collections Postman v2.0/v2.1.0 en `NormalizedRequest[]`. Parcourt les dossiers imbriqués, résout l’authentification par héritage élément > dossier > collection, convertit les modes de corps et conserve les scripts de test.

```typescript
class PostmanAdapter implements SourceAdapter<PostmanCollection | string> {
  readonly id = "postman";
  canHandle(input: unknown): boolean;
  parse(
    input: PostmanCollection | string,
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- `canHandle` accepte un objet, ou une chaîne JSON analysée, comportant un objet `info` et un tableau `item`. Les URL de schéma v2.1.0 et v2.0 sont acceptées, ainsi que les collections correctement structurées sans URL de schéma.
- Les événements de test et de prérequête sont inscrits dans l’opération sous `x-postman-scripts`.

---

### `PostmanTypes`

Espace de noms contenant les types de collection Postman utilisés par l’adaptateur :

```typescript
import { PostmanTypes } from "@powerduck/x-to-openapi";

type Collection = PostmanTypes.PostmanCollection;
type Item = PostmanTypes.PostmanItem;
type Request = PostmanTypes.PostmanRequest;
type Body = PostmanTypes.PostmanBody;
type Auth = PostmanTypes.PostmanAuth;
type Script = PostmanTypes.PostmanScript;

// Runtime type guards are functions; the other members are TypeScript types.
const isFolder = PostmanTypes.isFolder;
const isRequestItem = PostmanTypes.isRequestItem;
```

Principaux membres : `PostmanCollection`, `PostmanInfo`, `PostmanVersion`, `PostmanItem`, `PostmanFolder`, `PostmanRequestItem`, `PostmanRequest`, `PostmanHeader`, `PostmanUrl`, `PostmanQueryParam`, `PostmanBodyMode`, `PostmanBody`, `PostmanUrlEncodedParam`, `PostmanFormDataParam`, `PostmanFileParam`, `PostmanGraphQLBody`, `PostmanAuthType`, `PostmanAuth`, `PostmanAuthParam`, `PostmanEvent`, `PostmanScript`, `PostmanVariable`, `PostmanDescription`, `isFolder`, `isRequestItem`.

---

## Composants de construction OpenAPI

### `buildOpenApi32`

Constructeur de bas niveau. Assemble un document OpenAPI 3.2 à partir d’un tableau de requêtes déjà normalisées. Il est généralement appelé indirectement via [`XToOpenApi.convert`](#convertsource-input-options).

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Regroupe les opérations par chemin et méthode, collecte les paramètres de requête, d’en-tête, de cookie et de chemin, fusionne les schémas de corps, produit `securitySchemes`, place les méthodes non standard dans `additionalOperations` et attribue `operationId`/`tags`.

---

### `buildPathTemplates`

Regroupe les requêtes de même structure et transforme en paramètres les segments dont les valeurs varient sur au moins `minSamples` échantillons et ressemblent toutes à des identifiants.

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

Renvoie une map indexée par `sourceIndex`. Chaque `PathTemplate` contient :

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

Lorsque `enabled` vaut `false`, chaque requête reçoit un modèle statique égal à son chemin brut.

---

### `looksLikeIdentifier`

Règle unique déterminant si un segment peut devenir un paramètre.

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

Renvoie `true` pour un segment numérique, un UUID, un ULID ou une chaîne hexadécimale d’au moins 8 caractères.

---

### `scalar`

Déduit un JSON Schema d’un seul échantillon de chaîne, selon une approche prudente.

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

Déduit `boolean`, `integer` avec une limite de longueur sûre, `number`, ou `string` avec un `format` (`uuid`, `date`, `date-time`) ; sinon, utilise un simple `string`.

---

### `jsonSchema`

Déduit un JSON Schema de toute valeur JSON : objet, tableau ou scalaire.

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

Les objets deviennent `{ type: "object", properties, required }` et les tableaux `{ type: "array", items }`, avec `{}` pour les éléments des tableaux vides. Les scalaires suivent une logique similaire à `scalar`.

---

### `mergeSchemas`

Fusionne structurellement plusieurs schémas d’échantillons. Les propriétés d’objets sont réunies ; une propriété absente d’un échantillon devient facultative. Les tableaux sont traités récursivement, `integer` est élargi à `number`, et les formats ne sont conservés que s’ils sont identiques dans tous les échantillons.

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

Sous-ensemble structurel de JSON Schema utilisé pour les corps et paramètres déduits.

```typescript
interface Schema {
  type?: string | string[];
  format?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  example?: unknown;
  contentMediaType?: string;
  description?: string;
  nullable?: boolean;
  [key: string]: unknown; // OpenAPI extensions and unmodeled fields
}
```

---

## Type canonique et validation

### `validateOpenApi32`

Valide un document OpenAPI selon le schéma OpenAPI 3.2 via `@powerduck/openapi-parser`.

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

Les erreurs de validation produisent des diagnostics `OAS_VALIDATION_ERROR` ; les défaillances du validateur produisent `OAS_VALIDATOR_FAILED`.

### `validateOpenApiDocument`

Alias canonique de [`validateOpenApi32`](#validateopenapi32). Les bibliothèques `@powerduck/*` en aval devraient importer ce nom stable.

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

Type canonique de document OpenAPI 3.2, alias de `Oas32Document` provenant de `@powerduck/openapi-parser`. Toutes les bibliothèques `@powerduck/*` devraient l’utiliser plutôt que des paquets de types tiers directement.

### `OpenApi32Document`

Alias de `OpenApiDocument` propre à cette version.

---

## Types

### `ConvertOptions`

Tous les paramètres de conversion. Les champs non définis reprennent [`DEFAULT_OPTIONS`](#default_options).

```typescript
interface ConvertOptions {
  openapiVersion?: "3.2.0";
  title?: string;
  version?: string;
  description?: string;
  inferPathParameters?: boolean;
  pathParameterMinSamples?: number;
  inferSecurity?: boolean;
  includeCommonHeaders?: boolean;
  includeCookies?: boolean;
  includeExamples?: boolean;
  useServerBasePath?: boolean;
  validate?: boolean;
  strict?: boolean;
}
```

| Option | Type | Valeur par défaut | Description |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | Seul `"3.2.0"` est pris en charge ; toute autre valeur provoque une exception. |
| `title` | `string` | `"Generated API"` | `info.title`. Ne doit pas être vide. |
| `version` | `string` | `"1.0.0"` | `info.version`. Ne doit pas être vide. |
| `description` | `string` | `""` | `info.description`. Omis si vide. |
| `inferPathParameters` | `boolean` | `true` | Transforme les segments variables ressemblant à des identifiants en paramètres. |
| `pathParameterMinSamples` | `number` | `2` | Nombre minimal de requêtes par groupe avant paramétrage ; entier strictement positif. |
| `inferSecurity` | `boolean` | `true` | Produit `securitySchemes` et `security` pour chaque opération. |
| `includeCommonHeaders` | `boolean` | `false` | Inclut les en-têtes accessoires du navigateur ; les en-têtes de transport sont toujours exclus. |
| `includeCookies` | `boolean` | `false` | Produit des paramètres à partir des cookies. |
| `includeExamples` | `boolean` | `false` | Remplit les exemples de schéma et de paramètres avec les valeurs observées. |
| `useServerBasePath` | `boolean` | `false` | Intègre le préfixe de chemin commun dans `servers[0].url` si toutes les requêtes ont la même origine. |
| `validate` | `boolean` | `true` | Valide le document produit. Les erreurs deviennent des diagnostics ; le mode strict peut les transformer en exceptions. |
| `strict` | `boolean` | `false` | Lève une `ConversionError` pour tout diagnostic de gravité erreur. |

`ResolvedConvertOptions` correspond à `Required<ConvertOptions> & { openapiVersion: "3.2.0" }`.

---

### `ConvertResult`

Valeur de retour de chaque conversion.

```typescript
interface ConvertResult {
  /** The generated OpenAPI 3.2 document. */
  document: OpenApiDocument;
  /** Normalized requests (urlString is populated for JSON serialization). */
  requests: NormalizedRequest[];
  /** All diagnostics produced during conversion. */
  diagnostics: Diagnostic[];
  /** True when no error-severity diagnostic was produced. */
  ok: boolean;
  /** True when the document passed validation (or validation was skipped). */
  documentValid: boolean;
}
```

---

### `NormalizedRequest`

Représentation intermédiaire indépendante de l’adaptateur, produite par chacun d’eux.

```typescript
interface NormalizedRequest {
  source: string;            // adapter id, e.g. "curl"
  sourceIndex: number;       // index within the source
  method: string;            // lowercase token, e.g. "get", "post", "purge"
  url: URL;
  urlString?: string;        // string form, set for JSON-safe serialization
  headers: readonly Header[];
  query: readonly ParameterValue[];
  cookies: readonly ParameterValue[];
  body?: RequestBody;
  auth?: RequestAuth;
  /** x-* extensions merged onto the operation (first-wins per key). */
  extensions?: Readonly<Record<string, unknown>>;
}
```

---

### `Diagnostic` / `DiagnosticCode` / `Severity`

```typescript
type Severity = "info" | "warning" | "error";

interface Diagnostic {
  code: DiagnosticCode;
  message: string;
  severity: Severity;
  source?: string;   // adapter id
  index?: number;    // source command index
  path?: string;      // affected OpenAPI path
  cause?: unknown;    // underlying error
}
```

`DiagnosticCode` est l’union des chaînes représentant tous les codes que le framework peut signaler :

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### Autres types principaux

```typescript
type JsonObject = Record<string, unknown>;

interface Header { readonly name: string; readonly value: string; }
interface ParameterValue { readonly name: string; readonly value: string; }
interface FormField {
  readonly name: string;
  readonly value?: string;
  readonly fileName?: string;
  readonly contentType?: string;
}

type BodyKind = "json" | "xml" | "form-urlencoded" | "multipart" | "text" | "binary";

interface RequestBody {
  readonly kind: BodyKind;
  readonly mediaType: string;
  readonly raw?: string;
  readonly fields?: readonly FormField[];
}

type RequestAuth =
  | { readonly type: "basic" }
  | { readonly type: "bearer" }
  | { readonly type: "apiKey"; readonly in: "header" | "query" | "cookie"; readonly name: string };

interface AdapterContext {
  readonly report: (diagnostic: Diagnostic) => void;
  readonly strict: boolean;
}

interface SourceAdapter<I = unknown> {
  readonly id: string;
  canHandle?(input: unknown): boolean;
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

---

## Conversion de l’IR de découverte

### `discoveryToOpenApi`

Convertit un `DiscoveredProject` fourni en OpenAPI 3.2, sans analyser lui-même les fichiers source. Les routes non résolues produisent des avertissements et ne sont jamais ajoutées silencieusement à `paths` ; les emplacements source et niveaux de confiance restent accessibles dans le projet renvoyé.

```typescript
function discoveryToOpenApi(
  project: DiscoveredProject,
  options?: DiscoveryOptions,
): Promise<DiscoveryResult>;

interface DiscoveryOptions {
  openapiVersion?: "3.2.0";
  allowGaps?: boolean; // default true
  validate?: boolean; // default true
}

interface DiscoveryResult {
  readonly document: OpenApiDocument;
  readonly project: DiscoveredProject;
  readonly diagnostics: Diagnostic[];
  readonly ok: boolean;
  readonly documentValid: boolean;
}
```

`allowGaps: false` transforme les diagnostics de lacunes d’opération ou de schéma en erreurs ; ce n’est pas un interrupteur d’exceptions en mode strict. Vérifiez toujours `ok`, `documentValid` et `diagnostics`. Les routes non résolues font l’objet d’avertissements distincts. Sans validation, `documentValid` vaut true sans vérification du schéma.

### `buildDiscoveryOpenApi32`

Constructeur synchrone de bas niveau pour la même IR. Signale les diagnostics via le rappel fourni, sans valider le document. Préférez la fonction asynchrone englobante pour obtenir la validation et un résultat complet.

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Les types de découverte exportés depuis le point d’entrée principal comprennent : `Confidence`, `GapCode`, `SourceLocation`, `JsonSchema`, `DiscoveredParameter`, `DiscoveredMediaType`, `DiscoveredRequestBody`, `DiscoveredResponse`, `DiscoveredOperation`, `DiscoveredComponent`, `DiscoveredSecurityScheme`, `DiscoveredServer`, `DiscoveredUnresolved`, `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult`.

```typescript
import { discoveryToOpenApi } from "@powerduck/x-to-openapi";

const discovered = await discoveryToOpenApi({
  title: "Health API",
  operations: [{
    method: "get",
    path: "/health",
    responses: [{ statusCode: "204", description: "Healthy", confidence: "high" }],
    confidence: "high",
    origin: { file: "src/routes.ts", line: 1 },
  }],
});
console.log(discovered.ok, discovered.documentValid, discovered.diagnostics);
```

---

## Résumé des exports

| Symbole | Nature |
|---|---|
| `curlToOpenApi` | fonction |
| `postmanToOpenApi` | fonction |
| `XToOpenApi` | classe |
| `DEFAULT_OPTIONS` | constante |
| `AdapterRegistry` | classe |
| `ConversionError` | classe |
| `DiagnosticBag` | classe |
| `CurlAdapter` | classe |
| `splitCurlCommands` | fonction |
| `PostmanAdapter` | classe |
| `PostmanTypes` | espace de noms |
| `buildOpenApi32` | fonction |
| `buildPathTemplates` | fonction |
| `looksLikeIdentifier` | fonction |
| `scalar` | fonction |
| `jsonSchema` | fonction |
| `mergeSchemas` | fonction |
| `Schema` | type |
| `discoveryToOpenApi` | fonction |
| `buildDiscoveryOpenApi32` | fonction |
| `validateOpenApi32` | fonction |
| `validateOpenApiDocument` | fonction (alias) |
| `OpenApiDocument` | type |
| `OpenApi32Document` | type |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | types |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | types |
