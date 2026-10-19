---
sidebar_position: 4
title: "Tài liệu API"
description: "Tài liệu API đầy đủ cho @powerduck/openapi-codegen."
---

# Tài liệu API

Tài liệu API đầy đủ cho `@powerduck/openapi-codegen`.

## Hàm cấp cao nhất

| Mục xuất | Chữ ký | Mô tả |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | Tạo mã nguồn chạy được cho một thao tác |
| `register` | `(generator: Generator) => void` | Đăng ký bộ sinh mã tùy chỉnh |
| `get` | `(language: string, client: string) => Generator \| undefined` | Tra cứu bộ sinh mã |
| `list` | `() => Array<{ language: string; client: string }>` | Liệt kê tất cả bộ sinh mã đã đăng ký |
| `use` | `(plugin: Plugin) => void` | Áp dụng plugin đăng ký bộ sinh mã |
| `registerBuiltins` | `() => void` | Đăng ký tất cả bộ sinh mã có sẵn, tự động khi nhập |
| `normalize` | `(options) => NormalizedRequest` | Chuyển tài liệu, đường dẫn và phương thức thành yêu cầu chuẩn hóa |
| `builtinGenerators` | `Generator[]` | Mảng gốc chứa định nghĩa của mọi bộ sinh mã có sẵn |

Các bộ sinh mã có sẵn tự đăng ký khi mô-đun được nạp, nên không bắt buộc gọi `registerBuiltins()` thủ công.

## generate(options)

```ts
generate(options: GenerateOptions): string
```

Trả về mã nguồn được tạo dưới dạng chuỗi. Tra bộ sinh mã bằng `get(options.language, options.client)`; nếu thiếu `options.request`, gọi `normalize({ document, path, method, serverUrl, securityValues, softRefMode })`; sau đó gọi `generator.generate(request)`.

Lỗi có thể phát sinh:

- `TypeError` nếu `options` không phải đối tượng hoặc thiếu đầu vào bắt buộc.
- `Error: Unsupported generator: <language>/<client>` với tổ hợp không xác định.
- Lỗi từ `normalize()` khi đường dẫn/phương thức không xác định, tài liệu không hợp lệ hoặc `$ref` hỏng/vòng lặp, trừ khi bật `softRefMode`.

Xem [Cấu hình](/docs/vi-VN/openapi-codegen/configuration/#generateoptions) để biết bảng tùy chọn đầy đủ.

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

Đăng ký vào kho nội bộ không phân biệt hoa thường, với khóa `language\0client`.

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

Trả về `Generator`, hoặc `undefined` nếu không tìm thấy.

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

Tương đương gọi `plugin.register({ register })`.

## registerBuiltins()

```ts
registerBuiltins();
```

Có tính lũy đẳng, được bảo vệ bằng cờ nội bộ. Đăng ký từng mục trong `builtinGenerators`.

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

Phân giải `$ref`, hợp nhất tham số đường dẫn/thao tác, chọn loại phương tiện cho thân yêu cầu, tạo giá trị ví dụ, xử lý bảo mật và tính `baseUrl`. Phát sinh lỗi với đường dẫn/phương thức không xác định hoặc phương thức không được hỗ trợ.

## Bộ sinh mã có sẵn (21 ngôn ngữ, 41 máy khách) {#built-in-generators-21-languages-41-clients}

Các mã `language` / `client` chính xác được đăng ký trong `src/emitters/index.ts`. Tra cứu không phân biệt hoa thường; bảng liệt kê cách viết chuẩn.

| Ngôn ngữ | `language` | Giá trị `client` |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| Tệp yêu cầu HTTP | `http` | `http1` |
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

Tổng: 21 ngôn ngữ, 41 tổ hợp.

> Có bộ sinh mã không có nghĩa là mọi máy khách đều biểu diễn được mọi thao tác. Chẳng hạn, `shell/wget` không thể tạo an toàn yêu cầu `multipart/form-data` tùy ý; hãy dùng `shell/curl` hoặc `shell/httpie`.

## Kiểu cốt lõi

Được xuất lại từ `./types`:

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

## Hàm cốt lõi

Tất cả được xuất lại từ gốc gói.

### refs

| Mục xuất | Mô tả |
|--------|-------------|
| `RefResolver` | Lớp phân giải JSON Pointer `#/...` trong tài liệu. Hàm khởi tạo: `(root, softMode = false)`. Phương thức: `deref(value)`, `resolveRef(ref)`, `clearCache()`. Trường công khai: `softMode`. Phát sinh lỗi với tham chiếu ngoài/hỏng/vòng lặp, trừ khi `softMode` là đúng. |

### example

| Mục xuất | Mô tả |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | Tạo giá trị ví dụ từ JSON Schema. Tuân theo `example`, `enum`, `const`, `default`, `oneOf`/`anyOf`/`allOf`, kiểu, định dạng và ràng buộc. |
| `ExampleGenContext` | Kiểu `{ isRequestBody: boolean; isResponse: boolean }` điều khiển lọc `readOnly`/`writeOnly`. |
| `defaultExampleContext` | Giá trị mặc định `{ isRequestBody: false, isResponse: false }`. |

### serialize

| Mục xuất | Mô tả |
|--------|-------------|
| `Pair` | Kiểu `[string, string]`. |
| `parameter(parameter)` | Tuần tự hóa một tham số thành `Pair[]` theo quy tắc OpenAPI `style`/`explode`: form, spaceDelimited, pipeDelimited, label, matrix, simple, deepObject. |
| `query(pairs)` | Ghép các cặp thành chuỗi truy vấn. |
| `cookie(pairs)` | Ghép các cặp thành giá trị header `Cookie`. |
| `headerValue(value)` | Làm sạch giá trị header bằng cách loại bỏ CR/LF/NUL. |

### generator

| Mục xuất | Mô tả |
|--------|-------------|
| `createGenerator(language, client, emit)` | Bọc hàm `emit(request) => string` thành `Generator`. |
| `GeneratorEmitter` | Kiểu `(request: RequestIR) => string`. |

### registry

| Mục xuất | Mô tả |
|--------|-------------|
| `registerGenerator(generator)` | Chèn vào kho không phân biệt hoa thường. |
| `getGenerator(language, client)` | Đọc từ kho. |
| `listGenerators()` | Trả về `[{ language, client }, ...]`. |

### plugin

| Mục xuất | Mô tả |
|--------|-------------|
| `PluginApi` | Kiểu `{ register(generator: Generator): void }`. |
| `applyPlugin(plugin, api)` | Gọi `plugin.register(api)`. |

### request

| Mục xuất | Mô tả |
|--------|-------------|
| `CompiledRequest` | Kiểu `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`. |
| `compile(request)` | Thay tham số đường dẫn, tạo cặp query/header/cookie, áp dụng bảo mật và ghép URL. |
| `form(value)` | Tuần tự hóa đối tượng thành chuỗi `application/x-www-form-urlencoded`. |

### helpers

Tiện ích thường dùng:

| Mục xuất | Mô tả |
|--------|-------------|
| `isRecord(value)` | Hàm kiểm tra kiểu cho đối tượng thuần. |
| `isFileValue(value)` | Hàm kiểm tra kiểu cho dấu `FileValue`. |
| `firstDefined(...values)` | Giá trị đầu tiên khác `undefined`. |
| `nonBlankString(value, fallback?)` | Chuỗi không rỗng sau khi bỏ khoảng trắng hai đầu, hoặc `undefined`/giá trị dự phòng. |
| `normalizeMethod(method)` | Phương thức viết hoa, mặc định là `GET`. |
| `supportsRequestBody(method)` | `false` với `GET`/`HEAD`. |
| `requiresRequestBody(method)` | `true` với `POST`/`PUT`/`PATCH`. |
| `mediaTypeOf(request, fallback)` | Loại phương tiện hiệu lực lấy từ thân hoặc header Content-Type. |
| `hasJsonBody(request)` | Loại phương tiện JSON hoặc `+json`. |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | Văn bản thân nguyên bản hoặc JSON đã định dạng. |
| `toHeaderObject(headers)` | Chuyển các cặp thành `Record<string,string>`. |
| `toKeyValueBody(value)` | Làm phẳng thân multipart thành mô tả trường có thứ tự. |
| `collectByLocation(request, location)` | Lọc tham số theo vị trí OpenAPI. |
| `operationName(request)` | Suy ra tên hàm/biến snake_case từ phương thức và đường dẫn. |
| `sanitizeIdentifier(value)` | Chuyển văn bản bất kỳ thành định danh hợp lệ. |
| `indent(text, prefix="  ")` | Thụt lề mọi dòng không rỗng. |
| `stringifyLiteral(value)` | JSON đã định dạng với phương án dự phòng an toàn. |
| `kotlinValue(value)` / `formFieldValue(value)` | Tuần tự hóa giá trị cho literal hoặc trường biểu mẫu. |
| `fileComment(path, fieldName)` | Tạo chú thích TODO cho đường dẫn multipart giữ chỗ. |
| `mergeAllOfSchemas(schemas, resolver)` | Hợp nhất nông các lược đồ `allOf`. |
| `lightweightOpenAPIPreCheck(doc)` | Trả về cảnh báo cấu trúc của tài liệu. |
| `browserHeaders(headers, multipart)` | Loại bỏ header bị trình duyệt cấm. |
| `isBrowserForbiddenHeader(name)` | Xác định header có do API mạng trình duyệt kiểm soát không. |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | Hàm escape chuỗi literal riêng cho từng ngôn ngữ. |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | Hàm kiểm tra điều kiện khẳng định khi chạy. |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | Hằng số cho tệp tải lên giữ chỗ. |
