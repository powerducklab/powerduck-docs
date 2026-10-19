---
sidebar_position: 4
title: "API リファレンス"
description: "@powerduck/openapi-codegen の完全な API ドキュメントです。"
---

# API リファレンス

`@powerduck/openapi-codegen` の完全な API ドキュメントです。

## トップレベルの関数

| エクスポート | シグネチャ | 説明 |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | 1 つの操作の実行可能なソースコードを生成 |
| `register` | `(generator: Generator) => void` | 独自ジェネレーターを登録 |
| `get` | `(language: string, client: string) => Generator \| undefined` | ジェネレーターを検索 |
| `list` | `() => Array<{ language: string; client: string }>` | 登録済みの全ジェネレーターを一覧表示 |
| `use` | `(plugin: Plugin) => void` | ジェネレーターを登録するプラグインを適用 |
| `registerBuiltins` | `() => void` | すべての組み込みジェネレーターを登録。インポート時に自動実行 |
| `normalize` | `(options) => NormalizedRequest` | ドキュメント・パス・メソッドを正規化されたリクエストに変換 |
| `builtinGenerators` | `Generator[]` | すべての組み込みジェネレーター定義の元の配列 |

組み込みジェネレーターはモジュールの読み込み時に自動登録されるため、`registerBuiltins()` の手動呼び出しは任意です。

## generate(options)

```ts
generate(options: GenerateOptions): string
```

生成したソースコードを文字列で返します。`get(options.language, options.client)` でジェネレーターを探し、`options.request` がなければ `normalize({ document, path, method, serverUrl, securityValues, softRefMode })` を呼び、その後 `generator.generate(request)` を呼びます。

スローされるエラー：

- `options` がオブジェクトでない場合や必須入力がない場合は `TypeError`。
- 未対応の組み合わせには `Error: Unsupported generator: <language>/<client>`。
- `normalize()` のエラー。不明なパスやメソッド、不正なドキュメント、壊れた・循環する `$ref` が対象です。ただし参照のエラーは `softRefMode` 有効時には許容されます。

全オプションは[設定](/docs/ja-JP/openapi-codegen/configuration/#generateoptions)を参照してください。

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

`language\0client` をキーとして、大文字小文字を区別しない内部ストアに登録します。

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

`Generator` を返します。見つからなければ `undefined` です。

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

`plugin.register({ register })` の呼び出しと同じです。

## registerBuiltins()

```ts
registerBuiltins();
```

内部フラグで保護された冪等な操作です。`builtinGenerators` の全項目を登録します。

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

`$ref` を解決し、パスと操作のパラメーターを統合し、ボディのメディアタイプを選択し、例の値を生成し、セキュリティを解決して `baseUrl` を計算します。不明なパスやメソッド、未対応メソッドではエラーをスローします。

## 組み込みジェネレーター（21 言語、41 クライアント） {#built-in-generators-21-languages-41-clients}

`src/emitters/index.ts` に登録された正確な `language` / `client` 識別子です。検索では大文字小文字を区別しません。表には標準の表記を示します。

| 言語 | `language` | `client` の値 |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| HTTP リクエストファイル | `http` | `http1` |
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

合計：21 言語、41 通りの組み合わせ。

> ジェネレーターが存在しても、各クライアントがすべての操作を表現できるとは限りません。たとえば `shell/wget` は任意の `multipart/form-data` リクエストを安全に構築できません。代わりに `shell/curl` または `shell/httpie` を使ってください。

## コアの型

`./types` から再エクスポートされます。

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

## コアの関数

すべてパッケージのルートから再エクスポートされます。

### refs

| エクスポート | 説明 |
|--------|-------------|
| `RefResolver` | ドキュメント内の `#/...` JSON Pointer を解決するクラス。コンストラクターは `(root, softMode = false)`。メソッドは `deref(value)`、`resolveRef(ref)`、`clearCache()`。公開フィールドは `softMode`。外部参照、壊れた参照、循環参照では、`softMode` が真でない限りエラーをスローします。 |

### example

| エクスポート | 説明 |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | JSON Schema から例の値を生成します。`example`、`enum`、`const`、`default`、`oneOf`/`anyOf`/`allOf`、型、形式、制約を考慮します。 |
| `ExampleGenContext` | `readOnly`/`writeOnly` のフィルタリングを制御する型 `{ isRequestBody: boolean; isResponse: boolean }`。 |
| `defaultExampleContext` | 既定値は `{ isRequestBody: false, isResponse: false }`。 |

### serialize

| エクスポート | 説明 |
|--------|-------------|
| `Pair` | 型 `[string, string]`。 |
| `parameter(parameter)` | OpenAPI の `style`/`explode` に従い、1 つのパラメーターを `Pair[]` にシリアライズします。form、spaceDelimited、pipeDelimited、label、matrix、simple、deepObject に対応します。 |
| `query(pairs)` | ペアをクエリ文字列に連結します。 |
| `cookie(pairs)` | ペアを `Cookie` ヘッダーの値に連結します。 |
| `headerValue(value)` | ヘッダー値から CR/LF/NUL を除去します。 |

### generator

| エクスポート | 説明 |
|--------|-------------|
| `createGenerator(language, client, emit)` | `emit(request) => string` 関数を `Generator` にラップします。 |
| `GeneratorEmitter` | 型 `(request: RequestIR) => string`。 |

### registry

| エクスポート | 説明 |
|--------|-------------|
| `registerGenerator(generator)` | 大文字小文字を区別しないストアに挿入します。 |
| `getGenerator(language, client)` | ストアから読み取ります。 |
| `listGenerators()` | `[{ language, client }, ...]` を返します。 |

### plugin

| エクスポート | 説明 |
|--------|-------------|
| `PluginApi` | 型 `{ register(generator: Generator): void }`。 |
| `applyPlugin(plugin, api)` | `plugin.register(api)` を呼びます。 |

### request

| エクスポート | 説明 |
|--------|-------------|
| `CompiledRequest` | 型 `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`。 |
| `compile(request)` | パスパラメーターを置換し、query/header/cookie のペアを作り、セキュリティを適用し、URL を組み立てます。 |
| `form(value)` | オブジェクトを `application/x-www-form-urlencoded` 文字列にシリアライズします。 |

### helpers

よく使うユーティリティ：

| エクスポート | 説明 |
|--------|-------------|
| `isRecord(value)` | プレーンオブジェクト用の型ガード。 |
| `isFileValue(value)` | `FileValue` マーカー用の型ガード。 |
| `firstDefined(...values)` | 最初の `undefined` でない値。 |
| `nonBlankString(value, fallback?)` | 前後の空白を除いた空でない文字列、または `undefined`/代替値。 |
| `normalizeMethod(method)` | メソッドを大文字化。代替値は `GET`。 |
| `supportsRequestBody(method)` | `GET`/`HEAD` なら `false`。 |
| `requiresRequestBody(method)` | `POST`/`PUT`/`PATCH` なら `true`。 |
| `mediaTypeOf(request, fallback)` | ボディまたは Content-Type ヘッダーから有効なメディアタイプを取得。 |
| `hasJsonBody(request)` | JSON または `+json` メディアタイプかどうか。 |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | ボディの生テキスト、または整形した JSON。 |
| `toHeaderObject(headers)` | ペアを `Record<string,string>` に変換。 |
| `toKeyValueBody(value)` | Multipart ボディを順序付きのフィールド記述に展開。 |
| `collectByLocation(request, location)` | OpenAPI のパラメーター位置で絞り込み。 |
| `operationName(request)` | メソッドとパスから snake_case の関数名・変数名を生成。 |
| `sanitizeIdentifier(value)` | 任意のテキストを有効な識別子に変換。 |
| `indent(text, prefix="  ")` | 空でない各行をインデント。 |
| `stringifyLiteral(value)` | 安全な代替処理付きの整形 JSON。 |
| `kotlinValue(value)` / `formFieldValue(value)` | リテラルまたはフォームフィールド用に値をシリアライズ。 |
| `fileComment(path, fieldName)` | Multipart のプレースホルダーパスに TODO コメントを生成。 |
| `mergeAllOfSchemas(schemas, resolver)` | `allOf` スキーマを浅くマージ。 |
| `lightweightOpenAPIPreCheck(doc)` | ドキュメントの構造上の警告を返す。 |
| `browserHeaders(headers, multipart)` | ブラウザーが禁止するヘッダーを除去。 |
| `isBrowserForbiddenHeader(name)` | ブラウザーのネットワーク API が管理するヘッダーかどうか。 |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | 言語別の文字列リテラル用エスケープ関数。 |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | 実行時のアサーションガード。 |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | ファイルアップロードのプレースホルダー用定数。 |
