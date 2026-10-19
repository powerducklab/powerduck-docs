---
sidebar_position: 4
title: "Cấu hình"
description: "Cấu hình đầy đủ cho @powerduck/openapi-mcp-server: ServerConfig, SecurityContext, ExecutionContext, TransportMode và kiểu hợp giá trị hằng cho nguồn, trạng thái, giao thức, mức nhật ký và mã hóa phần thân."
---

# Cấu hình

Đối tượng cấu hình chính là `ServerConfig`, được `startAdminServer()` tiếp nhận. Các kiểu ngữ cảnh liên quan được dùng khi thực thi công cụ.

## `ServerConfig`

Chỉ `port` là bắt buộc.

| Trường | Kiểu | Mặc định | Mô tả |
| --- | --- | --- | --- |
| `port` | `number` | — (bắt buộc) | Cổng TCP để lắng nghe, số nguyên từ 0 đến 65535. |
| `host` | `string` | `"127.0.0.1"` | Giao diện mạng để lắng nghe; mặc định là loopback để tránh vô tình cho phép truy cập từ bên ngoài. |
| `apiKey` | `string` | undefined | Bí mật dùng chung mà API quản trị và truyền tải HTTP yêu cầu khi được thiết lập. |
| `specPath` | `string` | undefined | Đặc tả được tải một lần khi khởi động. |
| `baseUrlOverride` | `string` | undefined | Ghi đè URL cơ sở của dịch vụ đích lấy từ `servers[0].url`. |
| `upstreamHeaders` | `Record<string, string>` | undefined | Các tiêu đề được hợp nhất vào mọi yêu cầu tới dịch vụ đích. |
| `requestTimeoutMs` | `number` | undefined | Thời gian chờ cho mỗi yêu cầu tới dịch vụ đích, tính bằng mili giây. |
| `persistState` | `boolean` | `true` | Giữ lại đặc tả đã tải qua các lần khởi động lại. |
| `stateFilePath` | `string` | undefined | Vị trí tệp lưu trạng thái lâu dài. |
| `allowedOrigins` | `string[]` | undefined | Nguồn CORS được phép; để trống hoặc bỏ qua sẽ tắt truy cập khác nguồn. |
| `allowedHosts` | `string[]` | undefined | Các giá trị tiêu đề `Host` được phép. |
| `maxLogEntries` | `number` | 200 | Số mục nhật ký tối đa giữ trong bộ nhớ. |
| `redactSensitiveHeaders` | `boolean` | `true` | Che giá trị tiêu đề nhạy cảm trước khi ghi nhật ký. |
| `redactHeaderNames` | `string[]` | undefined | Tên tiêu đề bổ sung cần che ngoài danh sách tích hợp. |
| `security` | `SecurityContext` | undefined | Thông tin xác thực được chuyển tiếp tới API đích trong mỗi lần gọi công cụ. |

## `SecurityContext`

| Trường | Kiểu | Được gửi dưới dạng |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | Các cặp tên tiêu đề và giá trị chính xác. |

Thông tin xác thực được bộ thực thi chèn vào và không bao giờ được đưa vào đối số công cụ hiển thị cho mô hình.

## `ExecutionContext`

Ngữ cảnh của mỗi lần gọi được truyền tới `executeToolCall` và do `ContextProvider` trả về:

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `baseUrlOverride` | `string` | Ghi đè URL máy chủ trong đặc tả cho lần gọi này. |
| `upstreamHeaders` | `Record<string, string>` | Tiêu đề bổ sung cho dịch vụ đích. |
| `requestTimeoutMs` | `number` | Thời gian chờ mỗi lần gọi, tối thiểu 1 giây. |
| `security` | `SecurityContext` | Thông tin xác thực cho từng lần gọi. |
| `correlationId` | `string` | Liên kết các mục nhật ký của cùng một lần gọi. |
| `protocol` | `ProtocolHint` | Phương thức truyền tải đã khởi tạo lần gọi. |
| `onLog` | `(entry) => void` | Nhận nhật ký yêu cầu/phản hồi; không được ném ngoại lệ. |
| `signal` | `AbortSignal` | Hủy yêu cầu đang thực hiện tới dịch vụ đích. |

## Kiểu hợp giá trị hằng và hàm kiểm tra kiểu

| Kiểu hợp | Giá trị | Hàm kiểm tra |
| --- | --- | --- |
| `TransportMode` | `"stdio" \| "web"` | — |
| `SpecSource` | `"startup-file" \| "upload" \| "paste" \| "runtime"` | `isSpecSource()` |
| `ServiceStatus` | `"running" \| "stopped" \| "error"` | `isServiceStatus()` |
| `ProtocolHint` | `"streamable-http" \| "sse" \| "stdio"` | `isProtocolHint()` |
| `LogDirection` | `"request" \| "response" \| "internal"` | — |
| `LogLevel` | `"debug" \| "info" \| "warn" \| "error"` | — |
| `ParameterLocation` | `"path" \| "query" \| "header" \| "cookie"` | `isParameterLocation()` |
| `BodyEncoding` | `"json" \| "form-urlencoded" \| "multipart" \| "text" \| "binary"` | `isBodyEncoding()` |

## `BuildMcpServerOptions`

Được truyền làm đối số thứ ba của `buildMcpServer()`:

| Trường | Kiểu | Mặc định | Mô tả |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | Gợi ý giao thức được công bố. |
| `name` | `string` | `"openapi-mcp"` | Tên máy chủ được công bố. |
| `version` | `string` | `"1.1.0"` | Phiên bản máy chủ được công bố. |
| `pageSize` | `number` | 100 | Số mục tối đa trong mỗi phản hồi danh sách, giới hạn ở 500. |
| `instructions` | `string` | tích hợp | Hướng dẫn sử dụng được cung cấp qua MCP `instructions`. |

## Tùy chọn lớp truyền tải (`AttachMcpRoutesOptions`)

Nhập `attachMcpRoutes` từ `@powerduck/openapi-mcp-server` và truyền đối tượng tùy chọn làm đối số thứ hai. Hàm bọc cũ `attachSseRoutes()` chỉ nhận đối số vị trí `(app, specProvider, contextProvider, routeGuard?)`.

| Trường | Kiểu | Mặc định | Mô tả |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | — (bắt buộc) | Cung cấp tài liệu cho phiên mới. |
| `contextProvider` | `ContextProvider` | — (bắt buộc) | Cung cấp ngữ cảnh dịch vụ đích cho mỗi lần gọi. |
| `routeGuard` | `RequestHandler` | undefined | Middleware áp dụng cho mọi tuyến MCP. |
| `maxSessions` | `number` | 64 | Giới hạn số phiên đồng thời. |
| `sessionIdleMs` | `number` | 600000 | Thời gian chờ khi không hoạt động, tính bằng mili giây; 0 để tắt. |
| `allowedOrigins` | `string[]` | undefined | Nguồn được phép; danh sách không rỗng sẽ bật bảo vệ chống DNS rebinding. |
| `allowedHosts` | `string[]` | undefined | Các giá trị tiêu đề `Host` được phép. |
| `enableLegacySse` | `boolean` | `true` | Gắn phương thức truyền tải HTTP+SSE đã lỗi thời. |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | Nhận sự kiện vòng đời; không được ném ngoại lệ. |

> Đây là tùy chọn của `attachMcpRoutes`, không phải trường bổ sung của `ServerConfig`. Máy chủ quản trị chuyển tiếp thiết lập nguồn và host, nhưng dùng giới hạn phiên và thời gian chờ không hoạt động mặc định của lớp truyền tải. Hãy dùng trực tiếp hàm truyền tải công khai nếu cần tùy chỉnh các giới hạn này.

## Xem thêm

- [Tham chiếu API](../api-reference/)
- [Ví dụ](../examples/)
