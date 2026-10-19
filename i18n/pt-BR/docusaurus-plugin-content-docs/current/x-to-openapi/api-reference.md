---
sidebar_position: 4
title: "Referência da API"
description: "Referência do ponto de entrada público de @powerduck/x-to-openapi"
---

# Referência da API

Referência do ponto de entrada público de `@powerduck/x-to-openapi`. As assinaturas abaixo resumem a API; consulte as declarações TypeScript do pacote para todas as anotações readonly e os tipos importados.

---

## Funções auxiliares sem configuração

### `curlToOpenApi`

Conversão em uma chamada: registra um [`CurlAdapter`](#curladapter) e chama [`convert`](#convertsource-input-options).

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `input` | `string \| readonly string[]` | Um comando curl, um array de comandos ou a saída “Copy all as cURL” do navegador; textos com vários comandos são separados automaticamente. |
| `options` | `ConvertOptions` | Configurações opcionais de conversão. |

**Retorno:** [`ConvertResult`](#convertresult).

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

Conversão em uma chamada: registra um [`PostmanAdapter`](#postmanadapter) e converte um objeto de coleção já analisado ou uma string JSON. Scripts de teste são preservados como `x-postman-scripts`.

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `input` | `unknown` | Um objeto de Postman Collection v2.0/v2.1.0 ou sua representação em uma string JSON. |
| `options` | `ConvertOptions` | Configurações opcionais de conversão. |

**Retorno:** [`ConvertResult`](#convertresult).

---

## Estrutura principal

### `XToOpenApi`

A classe do conversor. Mantém um [`AdapterRegistry`](#adapterregistry) e executa o fluxo de análise → construção → validação.

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

Registra um adaptador. Retorna `this` para encadear chamadas. Valida o `id` do adaptador com `/^[a-z][a-z0-9-]*$/`, exige um método `parse()` e rejeita IDs duplicados.

#### `adapters()`

Retorna os IDs dos adaptadores registrados como `string[]`.

#### `convert(source, input, options?)`

O ponto de entrada único.

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `source` | `string` | Um ID de adaptador (`"curl"`, `"postman"`, …) ou `"auto"` para seleção por `canHandle()`. |
| `input` | `unknown` | Os dados de origem; a estrutura depende do adaptador. |
| `options` | `ConvertOptions` | Configurações opcionais de conversão. |

**Comportamento:**

1. Completa as opções com [`DEFAULT_OPTIONS`](#default_options) e as valida.
2. Rejeita com `ConversionError` strings, ou a soma dos elementos de string de um array, que ultrapassem **10 × 1024 × 1024 unidades de código JavaScript**. Não é um limite de bytes UTF-8; objetos já analisados não são medidos.
3. Seleciona o adaptador pelo ID explícito ou pela detecção `"auto"`.
4. Analisa a entrada em `NormalizedRequest[]`; falhas de análise viram diagnósticos.
5. Constrói o documento OpenAPI 3.2 com [`buildOpenApi32`](#buildopenapi32).
6. Se `validate` for `true`, valida com [`validateOpenApi32`](#validateopenapi32) e incorpora seus diagnósticos.
7. Retorna um [`ConvertResult`](#convertresult).

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

Os valores padrão combinados com todas as [`ConvertOptions`](#convertoptions). Exportados como `ResolvedConvertOptions`.

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

Armazena os adaptadores registrados por ID.

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| Método | Descrição |
|---|---|
| `register(adapter)` | Valida o ID (`/^[a-z][a-z0-9-]*$/`), verifica a existência de `parse()` e rejeita duplicatas. Retorna `this`. |
| `has(id)` | Verifica se o adaptador está registrado. |
| `get(id)` | Retorna o adaptador ou lança um erro que lista os IDs registrados. |
| `detect(input)` | Retorna o primeiro adaptador cujo `canHandle()` aceite a entrada. Exceções dos predicados são capturadas e o adaptador correspondente é ignorado. |
| `ids()` | Lista os IDs registrados. |

---

### `ConversionError`

Lançado para diagnósticos de nível de erro no modo `strict`, strings de entrada grandes demais ou falha na seleção automática do adaptador. Contém os diagnósticos disponíveis; a lista pode estar vazia. Opções inválidas e erros de registro podem lançar `TypeError` ou `Error`.

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

Coletor interno usado por [`XToOpenApi.convert`](#convertsource-input-options). Remove diagnósticos duplicados e lança `ConversionError` para entradas de nível de erro quando `strict` é `true`.

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## Adaptadores

### `CurlAdapter`

Converte comandos curl individuais, lotes ou exportações do navegador em `NormalizedRequest[]`. Encapsula `curlconverter` e normaliza a saída.

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

- `canHandle` aceita uma string, ou o primeiro elemento de um array, que comece com um prompt de shell opcional (`$`, `#`, `>`) seguido de `curl` ou `curl.exe`.
- `parse` separa entradas com vários comandos usando [`splitCurlCommands`](#splitcurlcommands), ignora URLs que não sejam HTTP(S), remove pseudocabeçalhos HTTP/2, analisa corpos e cookies e infere a autenticação.

> `resolveBackend`, `availableExports` e `resetBackend` são auxiliares internos de integração, não exportações públicas com suporte. Importe o adaptador público em vez de arquivos internos.

---

### `splitCurlCommands`

Separa a saída “Copy all as cURL” do navegador em comandos individuais. Aceita aspas simples e duplas, continuação com barra invertida ou circunflexo (`^`), CRLF, prompts de shell (`$`, `#`, `>`, `PS C:\>`) e `curl.exe`.

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

Converte Postman Collections v2.0/v2.1.0 em `NormalizedRequest[]`. Percorre pastas aninhadas, resolve a autenticação com prioridade item > pasta > coleção, mapeia os modos de corpo e preserva scripts de teste.

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

- `canHandle` aceita um objeto ou uma string JSON analisada com um objeto `info` e um array `item`. Aceita as URLs de esquema v2.1.0 e v2.0 e coleções estruturalmente válidas sem URL de esquema.
- Eventos de teste e pré-requisição são emitidos na operação como `x-postman-scripts`.

---

### `PostmanTypes`

Um namespace com todos os tipos de coleção Postman usados pelo adaptador:

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

Membros principais: `PostmanCollection`, `PostmanInfo`, `PostmanVersion`, `PostmanItem`, `PostmanFolder`, `PostmanRequestItem`, `PostmanRequest`, `PostmanHeader`, `PostmanUrl`, `PostmanQueryParam`, `PostmanBodyMode`, `PostmanBody`, `PostmanUrlEncodedParam`, `PostmanFormDataParam`, `PostmanFileParam`, `PostmanGraphQLBody`, `PostmanAuthType`, `PostmanAuth`, `PostmanAuthParam`, `PostmanEvent`, `PostmanScript`, `PostmanVariable`, `PostmanDescription`, `isFolder`, `isRequestItem`.

---

## Componentes de construção do OpenAPI

### `buildOpenApi32`

Construtor de baixo nível. Monta um documento OpenAPI 3.2 com um array de requisições já normalizadas. Normalmente é chamado indiretamente por [`XToOpenApi.convert`](#convertsource-input-options).

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Agrupa operações por caminho e método, coleta parâmetros de consulta, cabeçalho, cookie e caminho, combina esquemas de corpo, emite `securitySchemes`, direciona métodos não padronizados para `additionalOperations` e atribui `operationId`/`tags`.

---

### `buildPathTemplates`

Agrupa requisições com a mesma estrutura e parametriza segmentos que variam entre pelo menos `minSamples` amostras e parecem identificadores em todas elas.

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

Retorna um mapa indexado por `sourceIndex`. Cada `PathTemplate` contém:

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

Quando `enabled` é `false`, cada requisição recebe um modelo estático igual ao caminho original.

---

### `looksLikeIdentifier`

A regra central para determinar quais segmentos podem ser parametrizados.

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

Retorna `true` se o segmento for apenas numérico, um UUID, um ULID ou uma string hexadecimal com pelo menos 8 caracteres.

---

### `scalar`

Infere um JSON Schema de uma única amostra de string, de forma deliberadamente conservadora.

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

Infere `boolean`, `integer` com limite de comprimento para inteiros seguros, `number` ou `string` com `format` (`uuid`, `date`, `date-time`); nos demais casos, um `string` simples.

---

### `jsonSchema`

Infere um JSON Schema de qualquer valor JSON: objeto, array ou escalar.

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

Objetos tornam-se `{ type: "object", properties, required }`; arrays, `{ type: "array", items }`, com `{}` para arrays vazios; escalares seguem regras semelhantes às de `scalar`.

---

### `mergeSchemas`

Combina estruturalmente vários esquemas de amostra. Une propriedades de objetos; uma propriedade ausente em qualquer amostra torna-se opcional. Processa arrays recursivamente; amplia `integer` para `number` e só mantém formatos idênticos em todas as amostras.

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

O subconjunto estrutural de JSON Schema usado para corpos e parâmetros inferidos.

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

## Tipo canônico e validação

### `validateOpenApi32`

Valida um documento OpenAPI em relação ao esquema OpenAPI 3.2 usando `@powerduck/openapi-parser`.

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

Erros de validação viram diagnósticos com o código `OAS_VALIDATION_ERROR`; falhas do validador usam `OAS_VALIDATOR_FAILED`.

### `validateOpenApiDocument`

Alias canônico de [`validateOpenApi32`](#validateopenapi32). Bibliotecas dependentes de `@powerduck/*` devem importar esse nome estável.

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

O tipo canônico de documento OpenAPI 3.2, alias de `Oas32Document` de `@powerduck/openapi-parser`. Todas as bibliotecas `@powerduck/*` devem usá-lo em vez de acessar pacotes de tipos de terceiros.

### `OpenApi32Document`

Alias de `OpenApiDocument` específico da versão.

---

## Tipos

### `ConvertOptions`

Todas as configurações de conversão. Campos não definidos usam os valores de [`DEFAULT_OPTIONS`](#default_options).

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

| Opção | Tipo | Padrão | Descrição |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | Somente `"3.2.0"` é aceito; qualquer outro valor lança um erro. |
| `title` | `string` | `"Generated API"` | `info.title`. Não pode estar vazio. |
| `version` | `string` | `"1.0.0"` | `info.version`. Não pode estar vazio. |
| `description` | `string` | `""` | `info.description`. Omitido quando vazio. |
| `inferPathParameters` | `boolean` | `true` | Parametriza segmentos variáveis que parecem identificadores. |
| `pathParameterMinSamples` | `number` | `2` | Número mínimo de requisições por grupo para gerar modelos. Deve ser um inteiro positivo. |
| `inferSecurity` | `boolean` | `true` | Emite `securitySchemes` e `security` por operação. |
| `includeCommonHeaders` | `boolean` | `false` | Inclui cabeçalhos acessórios do navegador. Cabeçalhos de transporte são sempre excluídos. |
| `includeCookies` | `boolean` | `false` | Emite cookies como parâmetros. |
| `includeExamples` | `boolean` | `false` | Preenche exemplos de esquemas e parâmetros com valores observados. |
| `useServerBasePath` | `boolean` | `false` | Incorpora o prefixo comum dos caminhos em `servers[0].url` quando todas as requisições têm a mesma origem. |
| `validate` | `boolean` | `true` | Valida o documento de saída. Erros de validação viram diagnósticos; o modo estrito pode convertê-los em exceções. |
| `strict` | `boolean` | `false` | Lança `ConversionError` para qualquer diagnóstico de nível de erro. |

`ResolvedConvertOptions` equivale a `Required<ConvertOptions> & { openapiVersion: "3.2.0" }`.

---

### `ConvertResult`

O valor retornado por cada conversão.

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

A representação intermediária independente de adaptador produzida por todos os adaptadores.

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

`DiagnosticCode` é uma união de strings com todos os códigos que a estrutura pode emitir:

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### Outros tipos principais

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

## Conversão da representação intermediária de descoberta

### `discoveryToOpenApi`

Converte um `DiscoveredProject` fornecido em OpenAPI 3.2. Não examina arquivos-fonte por conta própria. Rotas não resolvidas geram avisos e nunca são adicionadas silenciosamente a `paths`; as localizações de origem e o nível de confiança continuam disponíveis no projeto retornado.

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

`allowGaps: false` eleva diagnósticos de lacunas em operações e esquemas a erros; não ativa exceções de modo estrito. Verifique sempre `ok`, `documentValid` e `diagnostics`. Avisos sobre rotas não resolvidas são informados separadamente. Com a validação desativada, `documentValid` é verdadeiro sem executar a validação do esquema.

### `buildDiscoveryOpenApi32`

Construtor síncrono de baixo nível para a mesma representação intermediária. Informa diagnósticos pelo callback fornecido e não valida o documento. Prefira o wrapper assíncrono quando precisar de validação e de um objeto de resultado completo.

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Tipos de descoberta exportados pelo ponto de entrada principal: `Confidence`, `GapCode`, `SourceLocation`, `JsonSchema`, `DiscoveredParameter`, `DiscoveredMediaType`, `DiscoveredRequestBody`, `DiscoveredResponse`, `DiscoveredOperation`, `DiscoveredComponent`, `DiscoveredSecurityScheme`, `DiscoveredServer`, `DiscoveredUnresolved`, `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult`.

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

## Resumo das exportações

| Símbolo | Categoria |
|---|---|
| `curlToOpenApi` | função |
| `postmanToOpenApi` | função |
| `XToOpenApi` | classe |
| `DEFAULT_OPTIONS` | constante |
| `AdapterRegistry` | classe |
| `ConversionError` | classe |
| `DiagnosticBag` | classe |
| `CurlAdapter` | classe |
| `splitCurlCommands` | função |
| `PostmanAdapter` | classe |
| `PostmanTypes` | namespace |
| `buildOpenApi32` | função |
| `buildPathTemplates` | função |
| `looksLikeIdentifier` | função |
| `scalar` | função |
| `jsonSchema` | função |
| `mergeSchemas` | função |
| `Schema` | tipo |
| `discoveryToOpenApi` | função |
| `buildDiscoveryOpenApi32` | função |
| `validateOpenApi32` | função |
| `validateOpenApiDocument` | função (alias) |
| `OpenApiDocument` | tipo |
| `OpenApi32Document` | tipo |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | tipos |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | tipos |
