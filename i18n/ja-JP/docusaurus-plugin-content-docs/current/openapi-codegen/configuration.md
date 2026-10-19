---
sidebar_position: 4
title: "設定"
description: "@powerduck/openapi-codegen の生成オプション：GenerateOptions、RequestIR、Generator と Plugin のインターフェース。"
---

# 設定

専用の設定ファイルはありません。[`generate()`](/docs/ja-JP/openapi-codegen/api-reference/) に渡す `GenerateOptions` オブジェクトで生成を制御します。

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

| オプション | 型 | 必須 | 説明 |
|---|---|---|---|
| `language` | `string` | はい | 対象言語の識別子。大文字小文字は区別しません。例：`"javascript"` |
| `client` | `string` | はい | 対象 HTTP クライアントの識別子。例：`"fetch"` |
| `request` | `RequestIR` | いずれか* | 正規化済みリクエスト。`normalize` をスキップします |
| `document` | `unknown` | いずれか* | 解析済みの OpenAPI ドキュメントオブジェクト |
| `path` | `string` | `document` 使用時 | 正確な OpenAPI パステンプレート。例：`"/pets/{id}"` |
| `method` | `string` | `document` 使用時 | HTTP メソッド。例：`"get"` / `"post"` |
| `serverUrl` | `string` | いいえ | ドキュメント内のサーバー URL を上書きします |
| `securityValues` | `Record<string, string>` | いいえ | セキュリティスキーム名をキーにした認証情報 |
| `softRefMode` | `boolean` | いいえ | 壊れた参照や循環する `$ref` でエラーをスローせず、部分的な値を返します |

\* `request` 単独、または `document` + `path` + `method` の組み合わせが必要です。`request` を指定すると、`document`、`path`、`method`、`serverUrl`、`securityValues`、`softRefMode` は無視されます。

### 入力検証エラー

`generate()` は必須入力がない場合にエラーをスローします。

- `TypeError: generate() requires an options object` — オプションオブジェクトがありません。
- `Error: Unsupported generator: <language>/<client>` — 未対応の組み合わせです。
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

`normalize()` 自体も、未対応メソッド、`paths` の欠落、不明なパス、操作の欠落には `Error`、オブジェクトでないドキュメントには `TypeError` をスローします。

## RequestIR

コード生成器に依存しない、正規化されたリクエストの表現です。直接作成して `options.request` に渡すと、`normalize` を省略できます。

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

Multipart のファイルプレースホルダーには次のマーカー構造を使います。

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

このインターフェースを満たすオブジェクトがジェネレーターです。組み込みのものは `createGenerator(language, client, emit)` で作成されていますが、独自のものも登録できます。

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate` は `RequestIR` を受け取り、生成されたソースコードを文字列で返します。

## Plugin

プラグインは `use()` を通じて 1 つ以上のジェネレーターを登録します。

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

例：

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

この型は、複数ファイルを含む将来の生成結果向けに定義されています。現在の `generate()` は引き続き `string` を返します。

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## normalize の出力構造

`normalize()` を直接呼ぶと（[API リファレンス](/docs/ja-JP/openapi-codegen/api-reference/#normalizeoptions)を参照）、`RequestIR` より少し広いオブジェクトが返ります。

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

## サーバー URL の解決順序

次のうち最初の空でない値が `baseUrl` になります。

1. `options.serverUrl`
2. 操作の `servers`
3. パス項目の `servers`
4. ルートの `servers`
5. フォールバック値 `"https://example.com"`

サーバーの `{variable}` は `server.variables` の `default`、なければ `example` を使い、URI エンコードして置換されます。
