---
sidebar_position: 4
title: "Cấu hình"
description: "Cấu hình được chia thành ba lớp: tùy chọn của hàm khởi tạo client/debugger, đối tượng SendOptions truyền vào prepare() và send(), cùng các tùy chọn riêng cho từng giao thức."
---

# Cấu hình

Cấu hình được chia thành ba lớp: tùy chọn của hàm khởi tạo client/debugger, đối tượng `SendOptions` truyền vào `prepare()` và `send()`, cùng các tùy chọn riêng cho từng giao thức.

## Tùy chọn của hàm khởi tạo

### `CreateClientOptions`

Truyền vào `createClient(options?)`. Tất cả các trường đều không bắt buộc.

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | Điều khiển cách hợp nhất phản hồi vào đặc tả |
| `response` | `ToResponseOptions` | Điều khiển cách chuẩn hóa đối tượng phản hồi |

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: {
    overwriteExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    includeExamples: false,
    // ... other ToResponseOptions
  },
});
```

### `DebuggerOptions`

Truyền vào `createDebugger(config?)`. Tất cả các trường đều không bắt buộc.

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | Danh sách adapter tùy chỉnh (thay thế toàn bộ adapter mặc định) |
| `extraAdapters` | `ProtocolAdapter[]` | Các adapter bổ sung vào bộ đăng ký mặc định |
| `writeBack` | `WriteBackOptions` | Tùy chọn ghi lại vào đặc tả |
| `response` | `ToResponseOptions` | Tùy chọn chuẩn hóa phản hồi |
| `writeBackTruncated` | `boolean` | Ghi lại lược đồ suy luận từ luồng bị cắt ngắn (mặc định: `true`) |

```typescript
import { createDebugger, HttpAdapter, WebSocketAdapter } from "@powerduck/openapi-request";

// Use only HTTP and WebSocket adapters
const debugger1 = createDebugger({
  adapters: [new HttpAdapter(), new WebSocketAdapter()],
});

// Add a custom adapter to the defaults
const debugger2 = createDebugger({
  extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});
```

### Ghi lại vào đặc tả và ví dụ được thu thập

`WriteBackOptions` hỗ trợ `strategy` (`"merge"` hoặc `"replace"`, mặc định `"merge"`), `keepExistingDescription` (mặc định `true`), `allowedStatusCodes` (để trống nghĩa là tất cả), `protectComponentRefs` (mặc định `true`), `overwriteExamples` (mặc định `true`) và `requirePassingTests`. Quy trình gửi áp dụng điều kiện kiểm thử thành công; gọi trực tiếp `writeBackResponse` thì không áp dụng điều kiện này.

`ToResponseOptions` hỗ trợ `includeExamples` (mặc định `true`), `maxExampleChars` (mặc định `4000`) và `maxEventPreviewChars` (mặc định `200`). Hãy tắt việc thu thập ví dụ hoặc kiểm tra trước khi xuất bản: phản hồi thực tế có thể chứa thông tin xác thực hoặc dữ liệu cá nhân.

Quy trình gửi thường trả về một bản sao đã chỉnh sửa qua `patchedSpec`; quy trình này không sửa tài liệu đầu vào hay lưu tệp. Đặt `writeBack: false` cho từng lần gọi để bỏ qua bước đó. Đối tượng `writeBack` của hàm khởi tạo cấu hình cách hợp nhất; giá trị boolean theo từng lần gọi bật hoặc tắt việc ghi lại.

## `SendOptions`

Đối tượng đầu vào chính của `prepare()` và `send()`. Bạn truyền đặc tả, đích, giá trị và toàn bộ cấu hình ở cấp yêu cầu tại đây.

| Trường | Kiểu | Bắt buộc | Mô tả |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | Có | Tài liệu OpenAPI 3.2 đầy đủ |
| `target` | `OperationTarget` | Có | Định danh thao tác (xem bên dưới) |
| `values` | `RequestValues` | Không | Giá trị cụ thể cho path/query/header/cookie/body |
| `serverUrl` | `string` | Không | Ghi đè `spec.servers[0].url` |
| `serverVariables` | `Record<string, string>` | Không | Biến trong mẫu URL máy chủ |
| `variables` | `Record<string, string>` | Không | Biến môi trường được tham chiếu bằng `{{name}}` |
| `globals` | `Record<string, string>` | Không | Biến toàn cục theo kiểu Postman |
| `localVariables` | `Record<string, string>` | Không | Biến cục bộ |
| `collectionVariables` | `Record<string, string>` | Không | Biến ở cấp collection |
| `auth` | `AuthConfig` | Không | Cấu hình xác thực |
| `scripts` | `ScriptConfig` | Không | Script trước yêu cầu và script kiểm thử |
| `runner` | `RuntimeRunOptions` | Không | Truyền trực tiếp toàn bộ tùy chọn postman-runtime (ưu tiên cao nhất) |
| `websocket` | `WebSocketOptions` | Không | Tùy chọn riêng cho WebSocket |
| `graphql` | `GraphQLOptions` | Không | Tùy chọn riêng cho GraphQL |
| `mcp` | `McpOptions` | Không | Tùy chọn riêng cho MCP |
| `grpc` | `any` | Không | Tùy chọn riêng cho gRPC |
| `timeout` | `number` | Không | Thời gian chờ cho từng yêu cầu, tính bằng mili giây (cách viết gọn của `runner.timeout.request`) |

`SendOptions` còn nhận các tùy chọn điều khiển thực thi và truyền luồng sau:

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `fetch` | `typeof fetch` | Cơ chế truyền fetch biệt lập do ứng dụng chủ cung cấp, nếu được hỗ trợ; HTTP/SSE vẫn dùng postman-runtime. |
| `writeBack` | `boolean` | Đặt thành `false` để giữ `patchedSpec` là undefined trong khi vẫn tạo `responseFragment`. |
| `signal` | `AbortSignal` | Hủy thực thi hoặc lấy mẫu; vẫn có thể trả về kết quả một phần. |
| `maxEvents` | `number` | Số sự kiện luồng tối đa được giữ lại. |
| `maxStreamMs` | `number` | Thời lượng lấy mẫu luồng tối đa, tính bằng mili giây. |
| `maxResponseSize` | `number` | Giới hạn kích thước phản hồi theo byte. |
| `maxBufferChars` | `number` | Giới hạn bộ đệm của bộ phân tích SSE trước ranh giới sự kiện; mặc định là `4194304` ký tự. |
| `maxEventChars` | `number` | Giới hạn dữ liệu được giữ lại cho mỗi sự kiện SSE; mặc định là `1048576` ký tự. |
| `inheritEventId` | `boolean` | Kế thừa ID sự kiện SSE gần nhất khi thiếu ID; mặc định là `true`. Đặt thành `false` để suy luận lược đồ chặt chẽ hơn. |
| `onEvent` | `(event: StreamEvent) => void` | Nhận sự kiện luồng. |
| `onConsole` | `(log: ConsoleLog) => void` | Nhận đầu ra console của script. |
| `onAssertion` | `(assertion: AssertionResult) => void` | Nhận kết quả assertion. |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | Kiểm tra sớm header HTTP/SSE và phân loại `streaming`. |
| `onOpen` | `(info) => void` | Nhận thông tin kết nối WebSocket: URL, giao thức và header. |

Các adapter giao thức có thể diễn giải giới hạn khác nhau. Giữ callback UI gọn nhẹ; tầng thực thi sẽ bắt ngoại lệ do callback ném ra. Với thiết lập bộ gửi yêu cầu HTTP, dùng `runner.requester`; nếu được chỉ định, `maxResponseSize` phải là số dương, không phải 0.

### `OperationTarget`

Xác định một thao tác. Nên dùng `operationId` hoặc `method` + `path`. Nếu cung cấp cả hai, `operationId` được ưu tiên.

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `operationId` | `string` | Khóa tra cứu thay thế; được ưu tiên hơn đường dẫn + phương thức |
| `method` | `string` | Phương thức HTTP, không phân biệt chữ hoa chữ thường. Cần có `path`. |
| `path` | `string` | Đường dẫn dạng mẫu, ví dụ `/users/{id}`. Cần có `method`. |

```typescript
// By operationId (recommended)
const result1 = await client.send({
  spec,
  target: { operationId: "getUserById" },
});

// By method + path
const result2 = await client.send({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

### `RequestValues`

Các giá trị cụ thể được chèn vào yêu cầu được tạo.

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | Giá trị tham số đường dẫn |
| `query` | `Record<string, unknown>` | Giá trị tham số truy vấn |
| `header` | `Record<string, unknown>` | Giá trị header |
| `cookie` | `Record<string, unknown>` | Giá trị cookie |
| `querystring` | `string` | Chuỗi truy vấn thô đã được mã hóa sẵn (vị trí `querystring` của OpenAPI 3.2) |
| `body` | `unknown` | Nội dung yêu cầu |
| `contentType` | `string` | Buộc sử dụng một kiểu media yêu cầu cụ thể khi thao tác khai báo nhiều kiểu |

```typescript
const result = await client.send({
  spec,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { version: "2" },
    header: { "X-Request-Id": "abc-123" },
    body: { name: "Alice", email: "alice@example.com" },
    contentType: "application/json",
  },
});
```

### `AuthConfig`

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | Loại xác thực |
| `token` | `string` | Token Bearer (cho `type: "bearer"`) |
| `username` | `string` | Tên người dùng xác thực Basic (cho `type: "basic"`) |
| `password` | `string` | Mật khẩu xác thực Basic (cho `type: "basic"`) |
| `key` | `string` | Tên khóa API (cho `type: "apikey"`) |
| `value` | `string` | Giá trị khóa API (cho `type: "apikey"`) |
| `in` | `"header" \| "query"` | Vị trí khóa API (cho `type: "apikey"`) |

```typescript
// Bearer token
const result1 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "bearer", token: "your-jwt-token" },
});

// Basic auth
const result2 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "basic", username: "admin", password: "secret" },
});

// API key in header
const result3 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "apikey", key: "X-API-Key", value: "key-123", in: "header" },
});
```

Các loại xác thực nâng cao gồm `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` và `edgegrid`. Truyền các trường của trình hỗ trợ Postman cho HTTP/SSE/GraphQL qua `parameters: Record<string, string | boolean | number>`. Tùy chọn `oauth2: OAuth2FlowConfig` cho phép lấy và làm mới token với loại OAuth 2.0; không nên mặc định rằng mọi trình hỗ trợ xác thực đều dùng được với mọi giao thức.

### `ScriptConfig`

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | Script trước yêu cầu ở cấp collection |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | Script kiểm thử ở cấp collection |
| `preRequest` | `ScriptSource \| ScriptSource[]` | Script trước yêu cầu ở cấp yêu cầu |
| `test` | `ScriptSource \| ScriptSource[]` | Script kiểm thử ở cấp yêu cầu |
| `fromSpecExtensions` | `boolean` | Đọc `x-postman-scripts` từ đặc tả (mặc định: `true`) |
| `captureLastResponse` | `boolean` | Thêm trình hỗ trợ tích hợp để các yêu cầu sau truy cập phản hồi gần nhất |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

Đặt `scripts.fromSpecExtensions: false` nếu bạn không muốn thực thi script nhúng trong đặc tả được nhập. Giá trị mặc định hiện tại là `true`; đừng dựa vào giả định rằng mặc định sẽ thay đổi trong tương lai.

## Tùy chọn riêng cho từng giao thức

### HTTP / SSE

HTTP là adapter mặc định. Nội dung `text/event-stream` được khai báo thể hiện ý định dùng SSE; khi nhận header, quy trình thực thi cũng phân loại phản hồi thực tế. `probeStreamingResponse()` là phép kiểm tra riêng cần gọi tường minh, không tự động chạy trước mỗi lần gọi.

Yêu cầu HTTP cơ bản không cần cấu hình bổ sung. Dùng `SendOptions.runner` để cấu hình postman-runtime nâng cao.

### WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
  // Manual-session options are distinct from SendOptions.websocket.
});
```

### MCP

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "mcp",
  endpoint: "https://api.example.com/mcp",
});
```

Phiên MCP thủ công mặc định dùng Streamable HTTP và `endpoint`. Với stdio, truyền `kind: "mcp"`, `transport: "stdio"`, cùng `command` cục bộ và `args` tùy chọn; khởi động phiên sẽ chạy tiến trình đã cấu hình.

### gRPC

gRPC cần địa chỉ, nguồn mô tả (tệp `.proto` hoặc phản chiếu máy chủ), cùng tên dịch vụ đầy đủ và phương thức:

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "grpc",
  address: "localhost:50051",
  service: "powerduck.examples.Echo",
  method: "Echo",
  protoPaths: ["./echo.proto"],
});
```

Hàm khởi tạo phiên thủ công trả về một phiên chưa mở. Gọi `open()` trước khi gửi và `close()` khi dọn dẹp. Ví dụ gRPC cần máy chủ cục bộ và tệp proto phù hợp; tùy chọn phiên thủ công không cùng loại đối tượng với `SendOptions.grpc`.

## Ví dụ đầy đủ

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const result = await client.send({
  spec: openApiDocument,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { verbose: "true" },
    header: { "X-Request-Id": "req-abc" },
    body: { name: "Alice", email: "alice@example.com" },
  },
  serverUrl: "https://api.staging.example.com",
  auth: { type: "bearer", token: "staging-token" },
  timeout: 10000,
  variables: {
    environment: "staging",
  },
});

console.log(result.response.status);
console.log(result.response.body);
console.log(result.response.headers);
```

## Bước tiếp theo

- Xem [Tài liệu tham khảo API](./api-reference.md) để biết tất cả các kiểu được xuất
- Xem [Ví dụ](./examples.md) để biết cách sử dụng từng giao thức
