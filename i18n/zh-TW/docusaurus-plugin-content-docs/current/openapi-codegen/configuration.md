---
sidebar_position: 4
title: "設定"
description: "@powerduck/openapi-codegen 的產生選項：GenerateOptions、RequestIR，以及 Generator 與 Plugin 介面。"
---

# 設定

沒有獨立的設定檔。產生行為由傳給 [`generate()`](/docs/zh-TW/openapi-codegen/api-reference/) 的 `GenerateOptions` 物件控制。

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

| 選項 | 型別 | 必填 | 說明 |
|---|---|---|---|
| `language` | `string` | 是 | 目標語言識別碼，不區分大小寫，例如 `"javascript"` |
| `client` | `string` | 是 | 目標 HTTP 用戶端識別碼，例如 `"fetch"` |
| `request` | `RequestIR` | 二擇一* | 已正規化的請求；略過 `normalize` |
| `document` | `unknown` | 二擇一* | 已解析的 OpenAPI 文件物件 |
| `path` | `string` | 使用 `document` 時 | 精確的 OpenAPI 路徑範本，例如 `"/pets/{id}"` |
| `method` | `string` | 使用 `document` 時 | HTTP 方法，例如 `"get"` / `"post"` |
| `serverUrl` | `string` | 否 | 覆寫文件中的伺服器 URL |
| `securityValues` | `Record<string, string>` | 否 | 以安全方案名稱為索引鍵的認證資訊 |
| `softRefMode` | `boolean` | 否 | 遇到失效或循環的 `$ref` 時不擲回錯誤，而是傳回部分值 |

\* 必須單獨提供 `request`，或同時提供 `document` + `path` + `method`。提供 `request` 時，會忽略 `document`、`path`、`method`、`serverUrl`、`securityValues` 與 `softRefMode`。

### 輸入驗證錯誤

缺少必要輸入時，`generate()` 會擲回錯誤：

- `TypeError: generate() requires an options object` — 未提供選項物件。
- `Error: Unsupported generator: <language>/<client>` — 未知的組合。
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

遇到不支援的方法、缺少 `paths`、未知路徑或缺少操作時，`normalize()` 本身會擲回 `Error`；文件不是物件時則擲回 `TypeError`。

## RequestIR

單一請求的正規化表示，不依賴特定程式碼產生器。可直接建立並透過 `options.request` 傳入，以略過 `normalize`。

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

Multipart 檔案預留位置使用以下標記結構：

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

符合此介面的物件都可作為產生器。內建產生器以 `createGenerator(language, client, emit)` 包裝，也可註冊自己的產生器：

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate` 接收 `RequestIR`，並傳回產生的原始碼字串。

## Plugin

外掛程式透過 `use()` 註冊一個或多個產生器：

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

範例：

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

此型別為未來可能包含多個檔案的產生結果預留。目前 `generate()` 仍傳回 `string`：

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## normalize 的輸出結構

直接呼叫 `normalize()`（參閱 [API 參考](/docs/zh-TW/openapi-codegen/api-reference/#normalizeoptions)）會傳回比 `RequestIR` 稍豐富的物件：

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

## 伺服器 URL 的解析順序

`baseUrl` 依下列順序使用第一個非空值：

1. `options.serverUrl`
2. 操作層級的 `servers`
3. 路徑項目的 `servers`
4. 根層級的 `servers`
5. 備援值 `"https://example.com"`

伺服器的 `{variable}` 預留位置會從 `server.variables` 讀取 `default` 值，若無則使用 `example`，並進行 URI 編碼。
