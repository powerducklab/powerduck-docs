---
sidebar_position: 4
title: "Cấu hình"
description: "Tùy chọn tạo mã của @powerduck/openapi-codegen: GenerateOptions, RequestIR, giao diện Generator và Plugin."
---

# Cấu hình

Không có tệp cấu hình riêng. Việc tạo mã được điều khiển bằng đối tượng `GenerateOptions` truyền vào [`generate()`](/docs/vi-VN/openapi-codegen/api-reference/).

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

| Tùy chọn | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `language` | `string` | có | Mã ngôn ngữ đích, không phân biệt hoa thường, ví dụ `"javascript"` |
| `client` | `string` | có | Mã máy khách HTTP đích, ví dụ `"fetch"` |
| `request` | `RequestIR` | một trong hai* | Yêu cầu đã chuẩn hóa; bỏ qua `normalize` |
| `document` | `unknown` | một trong hai* | Đối tượng tài liệu OpenAPI đã phân tích cú pháp |
| `path` | `string` | khi dùng `document` | Mẫu đường dẫn OpenAPI chính xác, ví dụ `"/pets/{id}"` |
| `method` | `string` | khi dùng `document` | Phương thức HTTP, ví dụ `"get"` / `"post"` |
| `serverUrl` | `string` | không | Ghi đè URL máy chủ trong tài liệu |
| `securityValues` | `Record<string, string>` | không | Thông tin xác thực được lập chỉ mục theo tên lược đồ bảo mật |
| `softRefMode` | `boolean` | không | Không phát sinh lỗi với `$ref` hỏng hoặc vòng lặp; trả về giá trị một phần |

\* Phải cung cấp riêng `request` hoặc kết hợp `document` + `path` + `method`. Khi có `request`, các trường `document`, `path`, `method`, `serverUrl`, `securityValues` và `softRefMode` bị bỏ qua.

### Lỗi xác thực đầu vào

`generate()` phát sinh lỗi nếu thiếu đầu vào bắt buộc:

- `TypeError: generate() requires an options object` — Không có đối tượng tùy chọn.
- `Error: Unsupported generator: <language>/<client>` — Tổ hợp không xác định.
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

Bản thân `normalize()` phát sinh `Error` khi phương thức không được hỗ trợ, thiếu `paths`, đường dẫn không xác định hoặc thiếu thao tác; phát sinh `TypeError` nếu tài liệu không phải đối tượng.

## RequestIR

Biểu diễn đã chuẩn hóa của một yêu cầu, độc lập với bộ sinh mã. Bạn có thể tự tạo và truyền qua `options.request` để bỏ qua `normalize`.

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

Phần giữ chỗ cho tệp multipart dùng cấu trúc đánh dấu sau:

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

Bộ sinh mã là bất kỳ đối tượng nào đáp ứng giao diện này. Các bộ có sẵn được tạo bằng `createGenerator(language, client, emit)`, nhưng bạn cũng có thể đăng ký bộ riêng:

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate` nhận `RequestIR` và trả về mã nguồn được tạo dưới dạng chuỗi.

## Plugin

Plugin đăng ký một hoặc nhiều bộ sinh mã qua `use()`:

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

Ví dụ:

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

Kiểu này được khai báo cho đầu ra trong tương lai có thể chứa nhiều tệp. Hiện tại, `generate()` vẫn trả về `string`:

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## Cấu trúc đầu ra của normalize

Gọi trực tiếp `normalize()` (xem [tài liệu API](/docs/vi-VN/openapi-codegen/api-reference/#normalizeoptions)) trả về đối tượng rộng hơn một chút so với `RequestIR`:

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

## Thứ tự xác định URL máy chủ

`baseUrl` lấy giá trị đầu tiên không rỗng trong:

1. `options.serverUrl`
2. `servers` của thao tác
3. `servers` của mục đường dẫn
4. `servers` ở gốc
5. giá trị dự phòng `"https://example.com"`

Phần giữ chỗ `{variable}` của máy chủ được điền từ `server.variables`, dùng giá trị `default`, rồi đến `example` nếu không có, sau khi mã hóa URI.
