---
sidebar_position: 4
title: "API リファレンス"
description: "@powerduck/x-to-openapi の公開エントリーポイントのリファレンスです"
---

# API リファレンス

`@powerduck/x-to-openapi` の公開エントリーポイントのリファレンスです。以下のシグネチャは API の概要です。readonly 修飾子やインポートされる型の詳細は、パッケージの TypeScript 型宣言を参照してください。

---

## 設定不要のヘルパー

### `curlToOpenApi`

1 回の呼び出しで変換します。[`CurlAdapter`](#curladapter) を登録し、[`convert`](#convertsource-input-options) を呼び出します。

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| 引数 | 型 | 説明 |
|---|---|---|
| `input` | `string \| readonly string[]` | curl コマンド、コマンドの配列、またはブラウザーの「Copy all as cURL」の出力。複数のコマンドを含むテキストは自動で分割されます。 |
| `options` | `ConvertOptions` | 省略可能な変換設定。 |

**戻り値:** [`ConvertResult`](#convertresult)。

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

1 回の呼び出しで変換します。[`PostmanAdapter`](#postmanadapter) を登録し、解析済みのコレクションオブジェクトまたは JSON 文字列を変換します。テストスクリプトは `x-postman-scripts` として保持されます。

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| 引数 | 型 | 説明 |
|---|---|---|
| `input` | `unknown` | Postman Collection v2.0/v2.1.0 のオブジェクト、またはその JSON 文字列。 |
| `options` | `ConvertOptions` | 省略可能な変換設定。 |

**戻り値:** [`ConvertResult`](#convertresult)。

---

## コア機構

### `XToOpenApi`

変換器のクラス。[`AdapterRegistry`](#adapterregistry) を保持し、解析 → 構築 → 検証のパイプラインを実行します。

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

アダプターを登録します。呼び出しを連結できるように `this` を返します。アダプターの `id` を `/^[a-z][a-z0-9-]*$/` で検証し、`parse()` メソッドの存在を確認して、重複する ID を拒否します。

#### `adapters()`

登録済みアダプターの ID を `string[]` として返します。

#### `convert(source, input, options?)`

変換の単一エントリーポイント。

| 引数 | 型 | 説明 |
|---|---|---|
| `source` | `string` | アダプター ID（`"curl"`、`"postman"` など）、または `canHandle()` によって選択するための `"auto"`。 |
| `input` | `unknown` | 入力データ。構造はアダプターによって異なります。 |
| `options` | `ConvertOptions` | 省略可能な変換設定。 |

**動作:**

1. [`DEFAULT_OPTIONS`](#default_options) を使ってオプションを補完し、検証します。
2. 文字列、または配列内の文字列要素の合計が **10 × 1024 × 1024 JavaScript コード単位**を超える場合、`ConversionError` で拒否します。UTF-8 のバイト数の制限ではなく、解析済みオブジェクトのサイズは計測しません。
3. 明示的な ID または `"auto"` の自動検出でアダプターを選択します。
4. 入力を `NormalizedRequest[]` に解析します。解析失敗は診断情報になります。
5. [`buildOpenApi32`](#buildopenapi32) で OpenAPI 3.2 ドキュメントを構築します。
6. `validate` が `true` の場合、[`validateOpenApi32`](#validateopenapi32) で検証し、その診断情報を結果に含めます。
7. [`ConvertResult`](#convertresult) を返します。

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

すべての [`ConvertOptions`](#convertoptions) とマージされるデフォルト値。`ResolvedConvertOptions` としてエクスポートされます。

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

登録済みアダプターを ID ごとに保持します。

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| メソッド | 説明 |
|---|---|
| `register(adapter)` | ID を `/^[a-z][a-z0-9-]*$/` で検証し、`parse()` の存在を確認して重複を拒否します。`this` を返します。 |
| `has(id)` | アダプターが登録されているか確認します。 |
| `get(id)` | アダプターを返します。見つからない場合は、登録済み ID を含むエラーをスローします。 |
| `detect(input)` | `canHandle()` が入力を受け入れる最初のアダプターを返します。判定処理の例外は捕捉し、そのアダプターをスキップします。 |
| `ids()` | 登録済み ID の一覧を返します。 |

---

### `ConversionError`

`strict` モードでエラーレベルの診断が発生した場合、入力文字列が長すぎる場合、またはアダプターの自動選択に失敗した場合にスローされます。利用可能な診断情報を持ちますが、一覧が空の場合もあります。無効なオプションや登録エラーでは、代わりに `TypeError` または `Error` がスローされることがあります。

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

[`XToOpenApi.convert`](#convertsource-input-options) が使用する内部コレクター。診断情報の重複を除き、`strict` が `true` のときにエラーレベルの診断に対して `ConversionError` をスローします。

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## アダプター

### `CurlAdapter`

単一または複数の curl コマンドやブラウザーのエクスポートを `NormalizedRequest[]` に変換します。`curlconverter` をラップし、出力を正規化します。

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

- `canHandle` は、省略可能なシェルプロンプト（`$`、`#`、`>`）に続いて `curl` または `curl.exe` で始まる文字列、またはそのような配列の先頭要素を受け入れます。
- `parse` は [`splitCurlCommands`](#splitcurlcommands) で複数コマンドを分割し、HTTP(S) 以外の URL をスキップして HTTP/2 の疑似ヘッダーを削除し、ボディーと Cookie を解析して認証を推論します。

> `resolveBackend`、`availableExports`、`resetBackend` は内部連携用のヘルパーであり、サポート対象のパッケージエクスポートではありません。内部ファイルではなく公開アダプターをインポートしてください。

---

### `splitCurlCommands`

ブラウザーの「Copy all as cURL」の出力を個別のコマンドに分割します。単一引用符と二重引用符、バックスラッシュとキャレット（`^`）による行継続、CRLF、シェルプロンプト（`$`、`#`、`>`、`PS C:\>`）、`curl.exe` に対応します。

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

Postman Collections v2.0/v2.1.0 を `NormalizedRequest[]` に変換します。入れ子のフォルダーを走査し、項目 > フォルダー > コレクションの優先順位で認証を解決して、ボディーモードを対応付け、テストスクリプトを保持します。

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

- `canHandle` は `info` オブジェクトと `item` 配列を持つオブジェクト、または解析された JSON 文字列を受け入れます。v2.1.0 と v2.0 のスキーマ URL、およびスキーマ URL を省略した構造的に有効なコレクションに対応します。
- テストイベントとリクエスト前イベントは、操作の `x-postman-scripts` として出力されます。

---

### `PostmanTypes`

アダプターが使用するすべての Postman コレクション型を含む名前空間:

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

主なメンバー: `PostmanCollection`、`PostmanInfo`、`PostmanVersion`、`PostmanItem`、`PostmanFolder`、`PostmanRequestItem`、`PostmanRequest`、`PostmanHeader`、`PostmanUrl`、`PostmanQueryParam`、`PostmanBodyMode`、`PostmanBody`、`PostmanUrlEncodedParam`、`PostmanFormDataParam`、`PostmanFileParam`、`PostmanGraphQLBody`、`PostmanAuthType`、`PostmanAuth`、`PostmanAuthParam`、`PostmanEvent`、`PostmanScript`、`PostmanVariable`、`PostmanDescription`、`isFolder`、`isRequestItem`。

---

## OpenAPI の構築要素

### `buildOpenApi32`

低レベルのビルダー。正規化済みリクエストの配列から OpenAPI 3.2 ドキュメントを構築します。通常は [`XToOpenApi.convert`](#convertsource-input-options) を介して間接的に呼び出します。

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

操作をパスとメソッドでグループ化し、クエリ、ヘッダー、Cookie、パスの各パラメーターを収集して、ボディースキーマをマージします。`securitySchemes` を生成し、非標準メソッドを `additionalOperations` に格納して、`operationId`/`tags` を割り当てます。

---

### `buildPathTemplates`

同じ構造のリクエストをグループ化し、少なくとも `minSamples` 個のサンプル間で変化し、すべてのサンプルで識別子と判定されるセグメントをテンプレート化します。

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

`sourceIndex` をキーとするマップを返します。各 `PathTemplate` は次の情報を持ちます。

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

`enabled` が `false` の場合、各リクエストには元のパス名と同じ静的テンプレートが設定されます。

---

### `looksLikeIdentifier`

テンプレート化できるセグメントを判断するための統一された基準。

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

セグメントが数字のみ、UUID、ULID、または 8 文字以上の 16 進文字列の場合に `true` を返します。

---

### `scalar`

単一の文字列サンプルから JSON Schema を慎重に推論します。

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

`boolean`、安全な整数の桁数制限付きの `integer`、`number`、または `format`（`uuid`、`date`、`date-time`）付きの `string` を推論します。それ以外は通常の `string` になります。

---

### `jsonSchema`

任意の JSON 値（オブジェクト、配列、スカラー）から JSON Schema を推論します。

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

オブジェクトは `{ type: "object", properties, required }`、配列は `{ type: "array", items }` になります。空の配列には `{}` を使用し、スカラーは `scalar` と同様の型推論に従います。

---

### `mergeSchemas`

複数のサンプルスキーマを構造的にマージします。オブジェクトのプロパティを統合し、いずれかのサンプルにないプロパティは省略可能にします。配列は再帰的に処理し、`integer` を `number` に拡張します。形式はすべてのサンプルで一致する場合のみ保持します。

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

推論されたボディーとパラメーターに使用する、JSON Schema の構造的なサブセット。

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

## 正式な共通型と検証

### `validateOpenApi32`

`@powerduck/openapi-parser` を使用し、OpenAPI ドキュメントを OpenAPI 3.2 スキーマに対して検証します。

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

検証エラーはコード `OAS_VALIDATION_ERROR` の診断に、バリデーター自体の失敗は `OAS_VALIDATOR_FAILED` に変換されます。

### `validateOpenApiDocument`

[`validateOpenApi32`](#validateopenapi32) の正式なエイリアス。依存する `@powerduck/*` ライブラリでは、この安定した名前をインポートしてください。

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

正式な OpenAPI 3.2 ドキュメント型。`@powerduck/openapi-parser` の `Oas32Document` のエイリアスです。すべての `@powerduck/*` ライブラリでは、サードパーティーの型パッケージを直接参照せず、この型を使用してください。

### `OpenApi32Document`

`OpenApiDocument` のバージョン固有のエイリアス。

---

## 型

### `ConvertOptions`

すべての変換設定。未設定のフィールドには [`DEFAULT_OPTIONS`](#default_options) の値を使用します。

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

| オプション | 型 | デフォルト | 説明 |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | `"3.2.0"` のみ対応しています。それ以外はエラーになります。 |
| `title` | `string` | `"Generated API"` | `info.title`。空にはできません。 |
| `version` | `string` | `"1.0.0"` | `info.version`。空にはできません。 |
| `description` | `string` | `""` | `info.description`。空の場合は省略します。 |
| `inferPathParameters` | `boolean` | `true` | 識別子と判定される可変セグメントをテンプレート化します。 |
| `pathParameterMinSamples` | `number` | `2` | テンプレート化に必要なグループ内の最小リクエスト数。正の整数である必要があります。 |
| `inferSecurity` | `boolean` | `true` | `securitySchemes` と操作ごとの `security` を生成します。 |
| `includeCommonHeaders` | `boolean` | `false` | ブラウザー由来の付随的なヘッダーを含めます。転送用ヘッダーは常に除外します。 |
| `includeCookies` | `boolean` | `false` | Cookie をパラメーターとして出力します。 |
| `includeExamples` | `boolean` | `false` | 観測した値からスキーマやパラメーターの例を設定します。 |
| `useServerBasePath` | `boolean` | `false` | すべてのリクエストが同じオリジンを持つ場合、共通のパス接頭辞を `servers[0].url` にまとめます。 |
| `validate` | `boolean` | `true` | 出力ドキュメントを検証します。検証エラーは診断情報になり、厳格モードでは例外になる場合があります。 |
| `strict` | `boolean` | `false` | エラーレベルの診断がある場合に `ConversionError` をスローします。 |

`ResolvedConvertOptions` は `Required<ConvertOptions> & { openapiVersion: "3.2.0" }` です。

---

### `ConvertResult`

各変換の戻り値。

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

すべてのアダプターが生成する、アダプターに依存しない中間表現。

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

`DiagnosticCode` は、この機構が報告できるすべてのコードを含む文字列のユニオン型です。

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### その他のコア型

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

## Discovery IR の変換

### `discoveryToOpenApi`

渡された `DiscoveredProject` を OpenAPI 3.2 に変換します。ソースファイル自体は走査しません。未解決のルートは警告となり、黙って `paths` に追加されることはありません。ソース位置と信頼度は、返されたプロジェクトで引き続き参照できます。

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

`allowGaps: false` は操作やスキーマの不足に関する診断をエラーに昇格させます。厳格モードの例外を有効にするスイッチではありません。必ず `ok`、`documentValid`、`diagnostics` を確認してください。未解決ルートの警告は別途報告されます。検証を無効にした場合、スキーマ検証を実行しなくても `documentValid` は真になります。

### `buildDiscoveryOpenApi32`

同じ中間表現を扱う低レベルの同期ビルダー。渡されたコールバックで診断を報告し、ドキュメント検証は行いません。検証と完全な結果オブジェクトが必要な場合は、非同期ラッパーを使用してください。

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

メインエントリーポイントからエクスポートされる Discovery 型: `Confidence`、`GapCode`、`SourceLocation`、`JsonSchema`、`DiscoveredParameter`、`DiscoveredMediaType`、`DiscoveredRequestBody`、`DiscoveredResponse`、`DiscoveredOperation`、`DiscoveredComponent`、`DiscoveredSecurityScheme`、`DiscoveredServer`、`DiscoveredUnresolved`、`DiscoveredProject`、`DiscoveryOptions`、`DiscoveryResult`。

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

## エクスポート一覧

| シンボル | 種別 |
|---|---|
| `curlToOpenApi` | 関数 |
| `postmanToOpenApi` | 関数 |
| `XToOpenApi` | クラス |
| `DEFAULT_OPTIONS` | 定数 |
| `AdapterRegistry` | クラス |
| `ConversionError` | クラス |
| `DiagnosticBag` | クラス |
| `CurlAdapter` | クラス |
| `splitCurlCommands` | 関数 |
| `PostmanAdapter` | クラス |
| `PostmanTypes` | 名前空間 |
| `buildOpenApi32` | 関数 |
| `buildPathTemplates` | 関数 |
| `looksLikeIdentifier` | 関数 |
| `scalar` | 関数 |
| `jsonSchema` | 関数 |
| `mergeSchemas` | 関数 |
| `Schema` | 型 |
| `discoveryToOpenApi` | 関数 |
| `buildDiscoveryOpenApi32` | 関数 |
| `validateOpenApi32` | 関数 |
| `validateOpenApiDocument` | 関数（エイリアス） |
| `OpenApiDocument` | 型 |
| `OpenApi32Document` | 型 |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | 型 |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | 型 |
