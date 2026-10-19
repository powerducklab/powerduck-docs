---
title: "Lưu yêu cầu và ví dụ giao thức"
description: "Powerduck tách yêu cầu bạn đang thử khỏi hợp đồng API bạn công bố."
---

# Lưu yêu cầu và ví dụ giao thức

Powerduck tách yêu cầu bạn đang thử khỏi hợp đồng API bạn công bố.

| Thao tác | Kết quả |
| --- | --- |
| Lưu trên thanh URL | Lưu cấu hình gỡ lỗi cục bộ của yêu cầu này, không sửa tài liệu OpenAPI. |
| Yêu cầu nhanh: lưu vào đặc tả | Thêm thao tác vào tài liệu và thư mục đã chọn. |
| Yêu cầu từ đặc tả: cập nhật đặc tả | Hiển thị phương thức, đường dẫn đích và bản xem trước định nghĩa trước khi cập nhật hợp đồng. |
| Lưu tài liệu / Cmd+S hoặc Ctrl+S | Ghi tài liệu OpenAPI hiện tại xuống đĩa. Trong tab yêu cầu nhanh, phím tắt lưu yêu cầu nhanh đó. |

Yêu cầu cục bộ chứa máy chủ đã chọn, URL, phương thức, giá trị tham số, nội dung, tập lệnh và cấu hình truyền tải. Bản nháp yêu cầu từ đặc tả nằm trong bộ nhớ khi chỉnh sửa; nút Lưu trên thanh URL lưu bền vững chúng trong bộ nhớ lưu trữ của tiến trình kết xuất ứng dụng dưới tiền tố `powerduck.debug.v1:`. Các mục được phân biệt theo ID tài liệu, đường dẫn và phương thức. Xóa dữ liệu trình duyệt hoặc ứng dụng sẽ xóa trạng thái cục bộ này; tệp OAS xuất ra không chứa nó. Đây **không phải kho bí mật được mã hóa**: hãy dùng tham chiếu môi trường thay vì ghi trực tiếp thông tin xác thực vào URL, tiêu đề hay nội dung yêu cầu. Các điều khiển xác thực dùng cơ chế lưu thông tin xác thực riêng.

`x-powerduck-request` **không phải phần mở rộng hợp đồng chính thức**. Thêm vào đặc tả và Cập nhật đặc tả không tạo trường này. Không dùng nó để mô tả phương thức, tham số, nội dung yêu cầu hay phản hồi. Chỉ mở tài liệu không ghi lại những bản sao đã có trong các thao tác khác.

## Cập nhật định nghĩa một cách rõ ràng

Cập nhật đặc tả cho xem trước phương thức và đường dẫn đích, đồng thời giữ các phản hồi và lược đồ hiện có. Định nghĩa tham số chỉ được đưa vào khi chọn; giá trị gỡ lỗi không được sao chép. Nội dung JSON chỉ trở thành ví dụ khi được chọn rõ ràng. Tên trường thông tin xác thực phổ biến bị loại bỏ, nhưng **hãy kiểm tra văn bản tự do và ví dụ trước khi công bố**. Tập lệnh và cấu hình xác thực ghi đè không phải trường hợp đồng.

Không thể ghi đè thao tác đích đã tồn tại bằng cách đổi phương thức hoặc đường dẫn. Tham chiếu thao tác cục bộ được chuyển sang đích mới. Phương thức tùy chỉnh như `PURGE` được lưu tại `paths./cache.additionalOperations.PURGE` và cần OpenAPI 3.2. Bản xem trước nêu yêu cầu này; khi áp dụng, phiên bản tài liệu được đặt thành 3.2.0. Cũng cần kiểm tra các công cụ sử dụng tài liệu có hỗ trợ phiên bản đó không.

Bạn vẫn có thể sửa lược đồ giao thức qua Chỉnh sửa tài liệu. Đây là thay đổi định nghĩa có chủ đích; gửi hoặc lưu yêu cầu gỡ lỗi không âm thầm ghi lại lược đồ giao thức.

## Ví dụ chính thức để tải xuống

Đây là các **định nghĩa mẫu** được duy trì, không phải dịch vụ API công khai của Powerduck. Mọi endpoint trỏ đến dịch vụ cục bộ do bạn cung cấp. Nhập tệp không khởi động dịch vụ, tự động kết nối hay cấp thông tin xác thực.

- [Tất cả giao thức](https://www.powerduck.com/docs/examples/protocols/all-protocols.yaml)
- [HTTP và PURGE tùy chỉnh](https://www.powerduck.com/docs/examples/protocols/http.yaml)
- [SSE](https://www.powerduck.com/docs/examples/protocols/sse.yaml)
- [WebSocket](https://www.powerduck.com/docs/examples/protocols/websocket.yaml)
- [GraphQL](https://www.powerduck.com/docs/examples/protocols/graphql.yaml)
- [gRPC](https://www.powerduck.com/docs/examples/protocols/grpc.yaml) và [echo.proto](https://www.powerduck.com/docs/examples/protocols/echo.proto)
- [MCP Streamable HTTP](https://www.powerduck.com/docs/examples/protocols/mcp.yaml)
- [A2A 1.0 JSON-RPC](https://www.powerduck.com/docs/examples/protocols/a2a.yaml)

Với gRPC, tải `echo.proto` vào cùng thư mục với tệp YAML rồi chọn đường dẫn cục bộ thực tế trong ứng dụng nếu cần. Máy chủ phải triển khai `powerduck.examples.Echo/Echo` trên cổng 50051. Các ví dụ khác cũng cần máy chủ tương ứng; chúng không minh họa việc xác thực trên backend đang chạy.

## Tham chiếu phần mở rộng hợp đồng

Mỗi thao tác có phương thức OAS thông thường, operationId, summary và responses. Các liên kết giao thức không phải HTTP dùng thao tác OAS làm điểm tham chiếu tài liệu; `post` trong ví dụ gRPC không có nghĩa gRPC đã được chuyển thành endpoint REST.

| Phần mở rộng | Ý nghĩa và trường dùng trong ví dụ |
| --- | --- |
| `x-protocol` | `sse`, `websocket`, `graphql`, `grpc`, `mcp` hoặc `a2a`. HTTP có thể bỏ qua. |
| `x-session` | Khai báo phiên giao thức tồn tại lâu; ví dụ dùng cho WebSocket và MCP. |
| `x-websocket` | `url`, `subprotocols` tùy chọn, `headers` và `messages`. Mỗi thông điệp được mô tả có `id`, `name`, `type`, `body`, `requestSchema`, `responseSchema`. Không đưa thông tin xác thực vào tiêu đề. |
| `x-graphql` | `endpoint`, `query`, `operationName`, `variablesSchema`, `variables` có thể công khai, `responseSchema`. |
| `x-grpc` | `address`, `service`, `method`, `kind`, `reflection`, `protoPaths`, `includeDirs` và `messages` được mô tả. `kind` hỗ trợ unary/server_streaming/client_streaming/bidi_streaming. Đường dẫn proto cục bộ phụ thuộc môi trường triển khai. |
| `x-mcp` | `transport`, `endpoint`, `method` cùng các trường riêng của phương thức: `name`, `argumentsSchema`, `arguments` có thể công khai, `responseSchema`. Thao tác tài nguyên dùng `uri`; không trộn trường của các phương thức không liên quan. |
| `x-a2a` | `version`, `binding`, `endpoint`, `method`, `requestSchema`, `responseSchema` được khai báo rõ ràng cùng `example` có thể công khai. Payload của 0.3 và 1.0 khác nhau; xem [A2A](./a2a.md). |
| `x-response-stream` | Khai báo ý định truyền luồng GraphQL tùy chọn, dùng khi máy chủ và cơ chế truyền tải thực tế hỗ trợ truyền luồng. Không cần cho yêu cầu GraphQL thông thường. |

SSE dùng trường chuẩn `responses.200.content.text/event-stream.itemSchema` để mô tả payload từng sự kiện. HTTP dùng tham số, requestBody, responses và lược đồ bảo mật chuẩn. Không tự tạo khối cấu hình `x-sse` hoặc lưu trạng thái gỡ lỗi thành phần mở rộng hợp đồng.

Ví dụ cung cấp cấu hình đầy đủ, dùng được cho liên kết giao thức đã chọn, không liệt kê tất cả tùy chọn loại trừ nhau. MCP stdio cần tệp thực thi cục bộ được cấu hình riêng; các ví dụ tải xuống chủ ý không tự khởi chạy nó.

## Tích hợp gói

Giao diện desktop quản lý việc lưu trạng thái gỡ lỗi cục bộ và ghi đặc tả một cách rõ ràng. `@powerduck/openapi-parser` đã đọc phương thức tùy chỉnh qua `additionalOperations`; `@powerduck/tree` và `@powerduck/oas-document` dùng cấu trúc hợp đồng đó. `@powerduck/openapi-request` nhận đối số lúc chạy tách biệt với đặc tả. Thực thi yêu cầu không cần `x-powerduck-request`.

Việc tách chức năng lưu không bổ sung tham số npm công khai mới. Dùng các phần mở rộng giao thức hiện có cho dữ liệu hợp đồng và truyền giá trị gỡ lỗi hiện tại vào API thực thi yêu cầu. Không để công cụ xuất, trình sinh hay công cụ MCP phụ thuộc vào cấu trúc trạng thái yêu cầu riêng tư.
