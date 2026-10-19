---
sidebar_position: 5
title: "Tài liệu tham khảo API"
description: "Tài liệu tham khảo các API tích hợp chính của @powerduck/openapi-request"
---

# Tài liệu tham khảo API

Tài liệu tham khảo các API tích hợp chính của `@powerduck/openapi-request`. Các bảng tóm tắt hợp đồng giao diện; khai báo TypeScript của gói là nguồn đầy đủ về các phiên bản nạp chồng và tham số tùy chọn. Điểm vào chính và đường dẫn con theo giao thức không xuất cùng một tập hợp thành phần.

## API cốt lõi

### `createClient(options?): ProtoClient`

Tạo client hướng đến giao diện người dùng. Đối số `options` là tùy chọn.

**Tham số:**

| Tên | Kiểu | Mô tả |
| --- | --- | --- |
| `options` | `CreateClientOptions` | Cấu hình tùy chọn |
| `options.writeBack` | `WriteBackOptions` | Điều khiển cách hợp nhất phản hồi vào đặc tả |
| `options.response` | `ToResponseOptions` | Điều khiển cách chuẩn hóa đối tượng phản hồi |

**Trả về:** `ProtoClient` với các phương thức sau:

| Phương thức | Chữ ký | Mô tả |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | Lập kế hoạch yêu cầu và trả về giao thức, chế độ hiển thị cùng loại luồng |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | Thực thi yêu cầu |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | Thực thi theo lô với kết quả riêng cho từng đích; lỗi không làm mất các kết quả khác |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | Tạo phiên websocket/mcp/grpc chưa mở; gọi `open()` để kết nối |
| `discover` | `(discoverOptions) => Promise<any>` | Khám phá khả năng của MCP và gRPC |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | Hợp nhất phản hồi quan sát được vào tài liệu |
| `dispose` | `() => void` | Hiện không thực hiện thao tác nào; bên gọi phải tự đóng phiên |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | Thực hiện yêu cầu fetch và phân loại phản hồi; cần đọc hoặc hủy nội dung phản hồi được trả về |

**Ví dụ:**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
});
```

### `createDebugger(config?): ProtoKit`

Tạo trình gỡ lỗi dùng script cho tự động hóa, script và CI.

**Tham số:**

| Tên | Kiểu | Mô tả |
| --- | --- | --- |
| `config` | `DebuggerOptions` | Cấu hình tùy chọn |
| `config.adapters` | `ProtocolAdapter[]` | Danh sách adapter tùy chỉnh thay thế các adapter mặc định |
| `config.extraAdapters` | `ProtocolAdapter[]` | Adapter bổ sung vào danh sách mặc định |
| `config.writeBack` | `WriteBackOptions` | Tùy chọn ghi lại vào đặc tả |
| `config.response` | `ToResponseOptions` | Tùy chọn chuẩn hóa phản hồi |
| `config.writeBackTruncated` | `boolean` | Ghi lại lược đồ suy luận từ luồng bị cắt ngắn (mặc định: true) |

**Trả về:** `ProtoKit` với `prepare`, `send`, `sendMany`, `toCollection` và các phương thức khác.

**Ví dụ:**

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const dbg = createDebugger({
  writeBackTruncated: true,
});

const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

### `createManualSession(options): AnyManualSession`

Tạo phiên song công duy trì lâu dài cho WebSocket, MCP và gRPC. Hàm khởi tạo không thực hiện I/O; kết nối chỉ được mở khi gọi `open()`.

**Tham số:**

| Tên | Kiểu | Mô tả |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | Giao thức sử dụng |
| `options.url` | `string` | URL kết nối WebSocket |
| `options.endpoint` | `string` | Endpoint MCP Streamable HTTP |
| `options.transport` | `"streamable-http" \| "stdio"` | Cơ chế truyền MCP; mặc định là Streamable HTTP |
| `options.command`, `options.args` | `string`, `string[]` | Tệp thực thi cục bộ và đối số cho MCP stdio |
| `options.address`, `options.service`, `options.method` | `string` | Địa chỉ gRPC, tên dịch vụ đầy đủ và phương thức |

Với gRPC, cần cung cấp thêm nguồn mô tả qua `protoPaths` hoặc `reflection`. Các tùy chọn theo giao thức nằm trong [Cấu hình](./configuration.md).

**Trả về:** phiên có `open()`, `send()`, `close()`, `onEvent()`, `waitForClose()`, `events` và `state`. `onEvent()` trả về đối tượng đăng ký có `unsubscribe()`.

**Ví dụ:**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

const subscription = session.onEvent((event) => {
  console.log(event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "message", data: "hello" });
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

### `AdapterRegistry`

Bộ đăng ký các phiên bản `ProtocolAdapter`. Bộ đăng ký mới ban đầu trống; `createDebugger()` đăng ký các adapter HTTP, WebSocket, gRPC, MCP và GraphQL tích hợp, trừ khi được thay bằng danh sách tùy chỉnh. Dùng `register()`, `unregister()`, `get()`, `list()`, `rank()` và `resolve()` để quản lý lựa chọn.

### `ProtoKitError`

Lỗi có kiểu do trình gỡ lỗi và các luồng xử lý cốt lõi ném ra. Dùng `instanceof ProtoKitError` để phân biệt lỗi thư viện với lỗi bất ngờ khác.

## Các kiểu cốt lõi

### `SendOptions`

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

### `PreparedRequest`

Được trả về bởi `createClient().prepare()`. Trình gỡ lỗi có kết quả lập kế hoạch khác: `createDebugger().prepare()` trả về `PlanResult` với `located`, `adapter` và `plan`.

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `protocol` | `string` | Giao thức đã xác định (http, websocket, grpc, graphql, mcp) |
| `transport` | `string` | Cơ chế truyền đã xác định |
| `target` | `OperationTarget` | Đích ban đầu |
| `operation` | `any` | Đối tượng thao tác OpenAPI đã xác định |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | Phân loại luồng (xem bên dưới) |
| `stream.expected` | `boolean` | Có dự kiến truyền luồng hay không |
| `openapi.extensions` | `Record<string, unknown>` | Các phần mở rộng OpenAPI đã xác định |
| `warnings` | `string[]` | Cảnh báo trong quá trình lập kế hoạch |

### `StreamKind`

Phân loại luồng chi tiết: `"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## Hàm hỗ trợ OpenAPI

| Thành phần xuất | Chữ ký | Mô tả |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | Xác định thao tác bằng `OperationTarget` |
| `inferSchema` | `(value) => Schema` | Suy luận JSON Schema từ một giá trị quan sát được |
| `inferSchemaFromMany` | `(values) => Schema` | Suy luận lược đồ bao quát nhiều giá trị quan sát được |
| `mergeSchema` | `(a, b) => Schema` | Hợp nhất hai lược đồ đã suy luận (hợp hoặc kết hợp) |
| `sampleFromSchema` | `(schema) => unknown` | Tạo giá trị mẫu sát thực tế cho lược đồ |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | Tạo đối tượng phản hồi OpenAPI từ kết quả quan sát được |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | Hợp nhất phản hồi quan sát được vào tài liệu |

Các kiểu được xuất: `LocatedOperation`, `WriteBackOptions`, `ToResponseOptions`.

## HTTP / SSE

Các tên dưới đây có sẵn từ điểm vào chính. Đường dẫn con `@powerduck/openapi-request/http` xuất `HttpAdapter`, `SseParser`, `buildCollection`, `buildEnvironment`, `resolveServerUrl`, `buildRunOptions` và `runWithPostman`; hãy nhập các hàm phát hiện cùng `BUILTIN_CAPTURE_TEST` từ điểm vào chính.

| Thành phần xuất | Mô tả |
| --- | --- |
| `HttpAdapter` | Adapter giao thức mặc định cho HTTP/HTTPS |
| `SseParser` | Bộ phân tích luồng chuyển luồng byte SSE thành sự kiện có cấu trúc |
| `isStreamingOperation` | Phân loại thao tác là truyền luồng dựa trên kiểu nội dung đã khai báo |
| `isSseContentType` | Kiểm tra kiểu nội dung có biểu thị SSE hay không |
| `isStreamingContentType` | Kiểm tra kiểu nội dung có biểu thị truyền luồng hay không |
| `acceptHeaderFor` | Tạo header Accept phù hợp cho thao tác |
| `probeStreamingResponse` | Thực hiện yêu cầu fetch và phân loại phản hồi; cần đọc hoặc hủy nội dung phản hồi được trả về |
| `BUILTIN_CAPTURE_TEST` | Script kiểm thử Postman tích hợp để thu thập phản hồi gần nhất |

## WebSocket

Nhập từ `@powerduck/openapi-request/ws`.

| Thành phần xuất | Mô tả |
| --- | --- |
| `WebSocketAdapter` | Adapter giao thức cho đích WebSocket |
| `createWsManualSession` | Tạo phiên WebSocket thủ công song công, cũng có tên `runWebSocketSession` và `wsManualSession` |

## GraphQL

Nhập từ `@powerduck/openapi-request/graphql`.

| Thành phần xuất | Mô tả |
| --- | --- |
| `GraphQLAdapter` | Adapter giao thức cho đích GraphQL |
| `resolveGraphQLConfig` | Xác định cấu hình GraphQL từ thao tác |
| `runGraphQL` | Thực thi thao tác GraphQL |
| `introspectSchema` | Truy vấn nội quan lược đồ của endpoint GraphQL |
| `INTROSPECTION_QUERY` | Truy vấn nội quan GraphQL tiêu chuẩn |
| `generateOperation` | Tạo tài liệu truy vấn từ lược đồ GraphQL đã nội quan và một trường |
| `generateAllOperations` | Tạo tài liệu truy vấn cho các trường của lược đồ GraphQL đã nội quan |
| `writeGraphQLOperations` | Ghi các thao tác GraphQL đã tạo vào đặc tả |
| `discoverAndWriteGraphQLSchema` | Khám phá lược đồ GraphQL và ghi vào đặc tả |

## MCP (Model Context Protocol)

Phần lớn các mục dưới đây có sẵn từ `@powerduck/openapi-request/mcp`. Nhập `initializeMcpSession` từ điểm vào chính; đường dẫn con gọi hàm này là `initializeSession`. Đường dẫn con còn cung cấp `runMcp`, `createMcpSessionCore` và `createMcpStdioConnection`.

| Thành phần xuất | Mô tả |
| --- | --- |
| `McpAdapter` | Adapter giao thức cho đích MCP |
| `createMcpManualSession` | Tạo phiên MCP thủ công, cũng có tên `mcpManualSession` |
| `createMcpStdioSession` | Tạo phiên MCP qua stdio |
| `runMcpManualSession` | Không còn được khuyến nghị: dùng `createMcpManualSession` |
| `resolveMcpConfig` | Xác định cấu hình MCP từ thao tác |
| `initializeMcpSession` | Khởi tạo phiên MCP (bí danh của `initializeSession`) |
| `discoverMcpCapabilities` | Khám phá khả năng của máy chủ MCP |
| `MCP_PROTOCOL_VERSION` | Phiên bản giao thức MCP được hỗ trợ |
| `generateMcpCall` | Tạo một lệnh gọi công cụ MCP |
| `generateAllMcpCalls` | Tạo tất cả lệnh gọi công cụ MCP |
| `writeMcpOperations` | Ghi các thao tác MCP vào đặc tả |
| `discoverAndWriteMcpCapabilities` | Khám phá khả năng MCP và ghi vào đặc tả |
| `createHttpMcpTransport` | Tạo cơ chế truyền HTTP cho MCP |
| `createStdioMcpTransport` | Tạo cơ chế truyền stdio cho MCP |

## gRPC

Nhập các hàm cấp thấp về khám phá, gọi và mô tả từ `@powerduck/openapi-request/grpc`. Nhập `GrpcProtocolAdapter`, `createGrpcManualSession`, `grpcManualSession`, `grpcDiscover` và `discoverGrpc` từ điểm vào chính; đường dẫn con dùng `discover` cho chức năng khám phá. Đường dẫn con còn có `discoverFromCatalog`, `describeMethod` và `describeFromCatalog` để tái sử dụng danh mục, tránh lặp lại phản chiếu cho từng phương thức.

| Thành phần xuất | Mô tả |
| --- | --- |
| `GrpcProtocolAdapter` | Adapter giao thức gRPC hướng đến OpenAPI |
| `GrpcAdapter` | Adapter gRPC cấp thấp |
| `grpcDiscover` / `discoverGrpc` | Khám phá dịch vụ và phương thức gRPC |
| `createGrpcManualSession` / `grpcManualSession` | Tạo phiên gRPC thủ công |
| `grpcCall` | Thực thi một lệnh gọi gRPC |
| `resolveMethod` | Xác định bộ mô tả phương thức gRPC |
| `buildMessageTemplate` | Tạo mẫu thông điệp từ bộ mô tả |
| `buildCatalog` | Tạo danh mục dịch vụ và phương thức |
| `LOADER_OPTIONS` | Tùy chọn mặc định của bộ tải proto |
| `scanProtoFiles` | Quét thư mục để tìm tệp proto |
| `deriveIncludeDirsDetailed` | Suy ra thư mục bao gồm từ đường dẫn tệp proto |
| `fetchDescriptorSet` | Lấy tập mô tả qua phản chiếu gRPC |
| `fetchFullDescriptorSet` | Lấy tập mô tả đầy đủ cùng mọi phụ thuộc |
| `listServices` | Liệt kê dịch vụ từ tập mô tả |
| `listServicesDetailed` | Liệt kê dịch vụ với thông tin phương thức chi tiết |
| `serializeDescriptorSet` | Tuần tự hóa tập mô tả thành byte |
| `decodeFileDescriptorProto` | Giải mã một proto mô tả tệp |
| `decodeFileDescriptorSet` | Giải mã tập mô tả tệp |
| `buildCredentials` | Tạo thông tin xác thực gRPC đồng bộ |
| `buildCredentialsAsync` | Tạo thông tin xác thực gRPC bất đồng bộ |
| `buildCredentialsChecked` | Tạo và xác thực thông tin xác thực đồng bộ |
| `buildCredentialsCheckedAsync` | Tạo và xác thực thông tin xác thực bất đồng bộ |
| `loadGrpc` | Tải động gói `@grpc/grpc-js` |
| `isGrpcAvailable` | Kiểm tra các phụ thuộc gRPC có sẵn hay không |
| `requireCapability` | Yêu cầu một khả năng gRPC cụ thể và ném lỗi nếu không có |

Điểm vào chính xuất các bí danh kiểu `GrpcDiscoveryResult`, `GrpcDiscoveredMethod` và `GrpcDiscoveredService`. Trong đường dẫn con gRPC, chúng có tên `DiscoveryResult`, `DiscoveredMethod` và `DiscoveredService`.

Các kiểu lỗi: `ReflectionProtocolError`, `ReflectionUnavailableError`, `DescriptorDecodeError`, `GrpcDependencyBrokenError`, `GrpcDependencyMissingError`.

## Tiện ích bổ sung

Điểm vào chính còn xuất các hàm hỗ trợ OAuth 2.0 `resolveOAuth2Token`, `acquireOAuth2Token`, `isOAuth2TokenExpired`, `oauth2RefreshStatuses` và `authFromOAuth2Token`; tiện ích sao chép `toCloneable`; lớp cơ sở `UnifiedSession`; cùng các hàm ghi gRPC `writeGrpcOperations` và `discoverAndWriteGrpcOperations`.

## Thành phần xuất theo đường dẫn con

```typescript
// Main integration entry
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```
