---
sidebar_position: 5
title: "Tham chiếu API"
description: "Tham chiếu đầy đủ của @powerduck/openapi-mcp-server: tải đặc tả, tạo công cụ, prompt và tài nguyên, tạo và thực thi yêu cầu, máy chủ MCP, truyền tải, quản trị, xác thực, sổ đăng ký dịch vụ và CLI."
---

# Tham chiếu API

Mọi thành phần công khai được xuất từ `@powerduck/openapi-mcp-server`, nhóm theo chức năng.

## Tải đặc tả

| Thành phần xuất | Chữ ký | Mô tả |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | Đọc tệp JSON hoặc YAML, kiểm tra, phân giải tham chiếu và xác nhận ID thao tác là duy nhất. Nhận diện YAML qua phần mở rộng `.ya?ml`. |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | Phân tích tài liệu từ chuỗi. Ném ngoại lệ khi đầu vào rỗng hoặc không hợp lệ. |

## Tạo công cụ

| Thành phần xuất | Chữ ký | Mô tả |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | Tạo định nghĩa MCP `Tool` cho mọi thao tác. |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | Trả về `{ tools, bindings, issues }`. |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | Ánh xạ tên công cụ được tạo tới `ToolBinding` tương ứng; bí danh của `getBindingIndex`. |

Các kiểu được xuất: `ToolBinding`, `GeneratedToolWithBinding` (bí danh của `GeneratedTool` trong gói).

## Prompt và tài nguyên

| Thành phần xuất | Chữ ký | Mô tả |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | Liệt kê mọi prompt đã tạo. |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | Tìm prompt theo tên; trả về `null` nếu không xác định. |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | Liệt kê tài nguyên danh mục. |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | Đọc một tài nguyên theo URI. |

## Tạo và thực thi yêu cầu

| Thành phần xuất | Chữ ký | Mô tả |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | Tuần tự hóa đối số thành `{ url, query, headers, body, dropped }`. Dùng đối số vị trí. |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | Thực thi công cụ được tạo đối với API đích. Phản hồi không thuộc 2xx được trả về dưới dạng dữ liệu; lỗi truyền tải ném ngoại lệ. |

Các trường của `ToolCallResult`: `status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`.

## Tiện ích đặc tả

| Thành phần xuất | Mô tả |
| --- | --- |
| `iterateOperations(spec, issues?)` | Generator trả về mọi thao tác đã phân giải, gồm `additionalOperations` của OpenAPI 3.2. |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | Hợp nhất tham số của mục đường dẫn và thao tác theo khóa `(name, in)`. |
| `normalizeParameter(candidate)` | Chuẩn hóa tham số thô; trả về `null` nếu không dùng được. |
| `synthesizeOperationId(method, pathTemplate)` | ID dự phòng có tính xác định khi thao tác thiếu `operationId`. |
| `ensureUniqueName(candidate, taken)` | Thêm hậu tố số để giữ tên duy nhất. |
| `extractPathTemplateVariables(pathTemplate)` | Trích xuất biến `{name}`, loại bỏ trùng lặp và giữ lần xuất hiện đầu tiên. |
| `effectiveStyle(parameter)` | Áp dụng giá trị `style` mặc định theo đặc tả. |
| `effectiveExplode(parameter)` | Áp dụng giá trị `explode` mặc định theo đặc tả. |
| `findOperationById(spec, operationId)` | Tra cứu O(1) sau lần xây dựng đầu tiên; trả về `null` nếu không xác định. |
| `findDuplicateOperationIds(spec)` | Báo cáo ID trùng lặp do tác giả khai báo. |
| `assertUniqueOperationIds(spec)` | Ném ngoại lệ khi ID thao tác trùng lặp. |
| `isPlainObject(value)` | Thu hẹp kiểu thành đối tượng thông thường. |
| `truncateGeneratedName(name, limit=64)` | Rút ngắn tên nhưng vẫn giữ tính duy nhất. |

Các kiểu được xuất: `OperationEntry`, `DuplicateOperationId`.

## Máy chủ MCP và truyền tải

| Thành phần xuất | Mô tả |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | Tạo `Server` của SDK và kết nối bộ xử lý công cụ, prompt, tài nguyên. Dùng đối số vị trí. |
| `startStdioServer(spec, context?, options?)` | Cung cấp một tài liệu qua stdio; trả về `{ closed, close() }`. |
| `attachMcpRoutes(app, options)` | Gắn các tuyến Streamable HTTP (`/mcp`) và tùy chọn SSE cũ (`/sse`). Nhận `AttachMcpRoutesOptions` và trả về `McpRouteHandle`. |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | Hàm bọc dùng đối số vị trí đã lỗi thời. Trả về `{ activeSessionCount, closeAll }`. |
| `createStreamableSessionHost(options)` | Tạo máy chủ quản lý phiên Streamable HTTP độc lập cho tích hợp truyền tải tùy chỉnh. |

Các kiểu: `SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`.

`attachMcpRoutes` được xuất từ gốc gói. Cấu hình `maxSessions`, `allowedOrigins`, `sessionIdleMs` và bảo vệ chống DNS rebinding trong các tùy chọn. Đối tượng trả về cung cấp `activeSessionCount`, `pendingSessionCount`, `listSessions`, `closeSession`, `closeAll` và `dispose`. Dùng `dispose()` khi tắt để dừng tác vụ dọn dẹp định kỳ và đóng các phiên.

## Máy chủ quản trị và xác thực (đường dẫn con `./server`) {#admin-server-and-auth-server-subpath}

Nhập `startAdminServer` từ `@powerduck/openapi-mcp-server/server` hoặc gốc gói. Nhập `createAuthMiddleware` từ gốc gói; đường dẫn con `./server` không xuất hàm này.

| Thành phần xuất | Chữ ký | Mô tả |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | Khởi chạy ứng dụng quản trị Express với giao diện web và các tuyến MCP. Trả về `{ app, server, port, close() }`. |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Bảo vệ truy cập bằng Bearer hoặc `x-api-key`. Bỏ qua khóa để tắt. Dùng đối số vị trí. |

## Môi trường thực thi và tiện ích

| Thành phần xuất | Mô tả |
| --- | --- |
| `ServiceRegistry` | Lớp quản lý `ManagedServiceRecord`: `upsert`, `list`, `get`, `remove`, `clear`, `start`, `stop`, `fail`. |
| `isAbortError(error)` | Đúng với `AbortError` hoặc `CanceledError` của axios. |
| `newId()` | UUID, với giá trị dự phòng dựa trên dấu thời gian. |

## CLI

Lệnh thực thi **`openapi-mcp`**. Chỉ có lệnh `serve`:

```
openapi-mcp serve [options]
```

| Tùy chọn | Mặc định | Mô tả |
| --- | --- | --- |
| `--port <n>` | `3000` | Cổng HTTP cho truyền tải web. |
| `--host <host>` | `127.0.0.1` | Host HTTP. |
| `--transport <mode>` | `web` | `stdio` hoặc `web`. |
| `--spec <path>` | — | Đường dẫn tệp OpenAPI, bắt buộc trong chế độ stdio. |
| `--base-url <url>` | — | Ghi đè URL cơ sở của dịch vụ đích. |
| `--api-key <key>` | — | Khóa API quản trị. |
| `--upstream-header "Name: value"` | — | Tiêu đề gửi tới dịch vụ đích; có thể chỉ định nhiều lần. |
| `--timeout <ms>` | `30000` | Thời gian chờ dịch vụ đích. |
| `--no-persist` | — | Tắt lưu trạng thái lâu dài. |

## Các kiểu (xuất lại từ `types`)

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`; `ResolvedPrompt` đã lỗi thời. Các hàm kiểm tra kiểu: `isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`.

## Lỗi và hành vi

- ID công cụ, prompt hoặc tài nguyên không xác định tạo lỗi MCP `InvalidParams`, không phải nội dung lỗi trong kết quả thông thường.
- Thiếu đặc tả khi phiên đang hoạt động gây ra `InternalError`.
- Phản hồi 4xx/5xx của dịch vụ đích được trả về mô hình dưới dạng nội dung có `isError: true`, không ném ngoại lệ. Chỉ lỗi truyền tải (DNS, TLS, hết thời gian chờ, hủy) mới ném ngoại lệ.

## Xem thêm

- [Cấu hình](../configuration/)
- [Ví dụ](../examples/)
