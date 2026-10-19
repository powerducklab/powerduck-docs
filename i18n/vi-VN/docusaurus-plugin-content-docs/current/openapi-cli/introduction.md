---
sidebar_position: 1
title: "Giới thiệu"
description: "@powerduck/openapi-cli là công cụ dòng lệnh kiểm thử hàng loạt tài liệu OpenAPI 3.2 với máy chủ thực tế. Chỉ cần cung cấp tệp đặc tả hoặc URL: công cụ thực thi các thao tác trong tài liệu, chạy phép khẳng định trên từng phản hồi và tạo báo cáo ở ba định dạng."
---

# Giới thiệu

`@powerduck/openapi-cli` là công cụ dòng lệnh kiểm thử hàng loạt tài liệu OpenAPI 3.2 với máy chủ thực tế. Chỉ cần cung cấp tệp đặc tả hoặc URL: công cụ thực thi các thao tác trong tài liệu, chạy phép khẳng định trên từng phản hồi và tạo báo cáo ở ba định dạng.

Công cụ dùng [`@powerduck/openapi-request`](https://www.npmjs.com/package/@powerduck/openapi-request) để thực thi yêu cầu và [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) để giải tham chiếu `$ref`.

## Vì sao nên dùng openapi-cli

- **Sẵn sàng cho CI** — theo mặc định, mã thoát khác không báo hiệu kiểm thử thất bại hoặc lỗi thực thi. Công cụ có thể tích hợp trực tiếp vào GitHub Actions, GitLab CI hay các quy trình CI khác.
- **Tích hợp nhiều giao thức** — một đặc tả có thể mô tả thao tác HTTP, SSE, WebSocket, GraphQL, gRPC và MCP; cùng một trình chạy xử lý tất cả.
- **Hai kiểu khẳng định** — dùng mảng khai báo `x-tests` cho kiểm tra đơn giản và tập lệnh kiểu Postman với `pm.test()` / `pm.expect()` cho trường hợp phức tạp.
- **Ba định dạng báo cáo** — JSON dành cho máy xử lý, đầu ra CLI có màu dễ đọc và báo cáo HTML tương tác độc lập.
- **Đặc tả cục bộ hoặc từ xa** — tải tài liệu từ đường dẫn tệp hoặc URL `http(s)://`, có theo chuyển hướng và giới hạn thời gian chờ.
- **Lọc linh hoạt** — chọn thao tác theo phương thức, đường dẫn, thẻ hoặc operationId, với số tác vụ đồng thời được giới hạn.

## Giao thức được hỗ trợ

Trình chạy xác định giao thức của từng thao tác từ phần mở rộng OpenAPI hoặc kiểu nội dung của phản hồi:

| Giao thức | Định danh | Cách lựa chọn |
|----------|-----------|--------------------|
| HTTP | `http` | Mặc định cho thao tác tiêu chuẩn |
| Sự kiện do máy chủ gửi | `sse` | Kiểu nội dung phản hồi `text/event-stream` hoặc `x-response-stream: true` |
| WebSocket | `websocket` | `x-protocol: "websocket"` |
| GraphQL | `graphql` | `x-protocol: "graphql"` |
| gRPC | `grpc` | `x-protocol: "grpc"` |
| MCP | `mcp` | `x-protocol: "mcp"` |

Bạn cũng có thể chỉ định giao thức rõ ràng bằng phần mở rộng `x-protocol` trên thao tác hoặc mục đường dẫn.

## Báo cáo

Sau khi chạy, công cụ xuất các kết quả sau; tệp được lưu mặc định trong `./openapi-cli-report`:

- `report.json` — toàn bộ đối tượng `TestReport` dưới dạng JSON đã định dạng dễ đọc.
- `report.html` — báo cáo HTML độc lập, không có phụ thuộc, với thanh tóm tắt, thanh tiến độ, nút lọc và hàng kiểm thử có thể mở rộng.
- Đầu ra chuẩn — bản tóm tắt CLI có màu, gồm thanh tiến độ và phép khẳng định của từng kiểm thử.

## Sử dụng trong mã

Quy trình tương tự cũng có sẵn dưới dạng thư viện. Xử lý cấu hình, chạy kiểm thử rồi chọn bộ tạo báo cáo cần dùng:

```ts
import { resolveConfig, runTests, printCliReport, generateJsonReport } from "@powerduck/openapi-cli";

const config = resolveConfig({ spec: "./openapi.json" });
const report = await runTests(config);
printCliReport(report);
generateJsonReport(report, "./reports");
```

## Bước tiếp theo

- [Cài đặt](./installation.md) — cài toàn cục hoặc làm phụ thuộc phát triển.
- [Bắt đầu nhanh](./quickstart.md) — chạy bộ kiểm thử đầu tiên.
- [Cấu hình](./configuration.md) — tham chiếu đầy đủ về `CliConfig`.
- [Lệnh](./commands.md) — tất cả tùy chọn CLI và mã thoát.
- [Tham chiếu API](./api-reference.md) — mọi hàm và kiểu được xuất.
- [Ví dụ](./examples.md) — ví dụ sẵn sàng chạy.
