---
sidebar_position: 6
title: "Tác tử A2A"
description: "Dùng A2A khi một tác tử giao việc cho tác tử khác. MCP cung cấp công cụ và tài nguyên; A2A mô tả thông điệp tác tử, tác vụ, cập nhật trạng thái và sản phẩm đầu ra. Có thể giữ cả hai trong cùng đặc tả cục bộ mà không coi chúng là một giao thức."
---

# Tác tử A2A

Dùng A2A khi một tác tử giao việc cho tác tử khác. MCP cung cấp công cụ và tài nguyên; A2A mô tả thông điệp tác tử, tác vụ, cập nhật trạng thái và sản phẩm đầu ra. Có thể giữ cả hai trong cùng đặc tả cục bộ mà không coi chúng là một giao thức.

## Tạo và gỡ lỗi

1. Trong phần Gỡ lỗi, chọn **Yêu cầu mới → A2A**. Mặc định là A2A **1.0**, dùng JSON-RPC qua HTTP.
2. Đặt điểm cuối JSON-RPC của tác tử trong thanh URL. Với tác tử cũ, hãy chọn rõ phiên bản **0.3**; Powerduck không âm thầm chuyển đổi giữa các phiên bản.
3. Trong thẻ Giao thức, chọn phương thức rồi nhấn **Tạo nội dung yêu cầu**. Kiểm tra bản xem trước, sau đó chọn **Thay thế nội dung yêu cầu** để áp dụng. Hủy hoặc đổi phương thức sẽ giữ bản nháp hiện tại.
4. Sửa `params` trong thẻ Nội dung. Dùng Xác thực và Tiêu đề cho thông tin xác thực; khi gửi, hệ thống thêm tiêu đề `A2A-Version` đã chọn.
5. Gửi yêu cầu và kiểm tra toàn bộ cấu trúc bao JSON-RPC: HTTP 200 vẫn có thể chứa `error`. Phản hồi thành công của 1.0 đặt `task` hoặc `message` bên trong `result`; phiên bản 0.3 dùng cấu trúc phản hồi riêng.
6. Dùng **Lưu vào đặc tả** để thêm yêu cầu nhanh. Với thao tác hiện có, **Lưu** giữ cài đặt gỡ lỗi cục bộ; **Cập nhật đặc tả** chủ động cập nhật định nghĩa. Phiên bản, điểm cuối, phương thức và schema được tài liệu hóa nằm trong `x-a2a`; bản nháp yêu cầu cục bộ không được xuất vào OAS. Dùng **Sửa tài liệu** để chỉnh hợp đồng giao thức.

ID thông điệp và ID yêu cầu JSON-RPC là hai loại riêng biệt. Ví dụ mới tạo các ID mới. Để tiếp tục hội thoại, giữ lại các ID ngữ cảnh/tác vụ được trả về trong thông điệp tiếp theo, theo yêu cầu của phiên bản giao thức đã chọn.

## Agent Card

Dùng **Lấy Agent Card công khai** với URL được chỉ định rõ, thường là `/.well-known/agent-card.json`. Kiểm tra giao diện được công bố, phiên bản, kỹ năng, xác thực và khả năng trước khi cấu hình điểm cuối. Việc lấy thẻ không tự đổi URL yêu cầu hoặc chuyển thông tin xác thực sang nguồn khác.

Khám phá công khai không gửi thông tin xác thực của yêu cầu và từ chối chuyển hướng. Ứng dụng máy tính dùng bộ thực thi HTTP gốc; trình duyệt cần CORS. Phản hồi được giới hạn ở 1 MiB. Với A2A 1.0, mở **Xác minh chữ ký JWS** rồi dán JWKS công khai đáng tin cậy. Xác minh diễn ra cục bộ, hỗ trợ chữ ký bất đối xứng và không bao giờ truy cập URL khóa do thẻ cung cấp. Giá trị rỗng bắt buộc được giữ theo proto A2A đã cố định trong dự án. Trường tùy chỉnh ngoài schema thẻ chuẩn không được xác thực. Thẻ chưa ký và chưa xác minh được ghi rõ; lưu ảnh chụp dữ liệu không lưu quyết định tin cậy. Với siêu dữ liệu được bảo vệ, dùng RPC thẻ mở rộng cùng xác thực của yêu cầu. **Lưu thẻ vào đặc tả** chỉ lưu ảnh chụp dữ liệu; hãy bỏ siêu dữ liệu riêng tư trước khi chia sẻ hoặc lưu trữ đặc tả.

## Tác vụ và truyền luồng

Với 1.0, dùng `SendStreamingMessage` hoặc `SubscribeToTask`; với 0.3, dùng `message/stream` hoặc `tasks/resubscribe`. Phản hồi dùng trình xem sự kiện SSE hiện có, với giới hạn phản hồi và điều khiển hủy. Có thể xem dữ liệu gốc của cập nhật trạng thái và sản phẩm đầu ra.

**Dừng** ngắt yêu cầu cục bộ, không hủy công việc từ xa. Gửi `CancelTask` ở 1.0 hoặc `tasks/cancel` ở 0.3, kèm ID tác vụ được trả về, để yêu cầu hủy từ xa. Tác vụ đã ở trạng thái kết thúc không thể đơn giản khởi động lại.

Có các phương thức lấy tác vụ, liệt kê tác vụ ở 1.0, thẻ mở rộng và cấu hình thông báo đẩy. A2A 1.0 cung cấp chúng qua cả ba cơ chế kết nối; 0.3 dùng JSON-RPC. Thao tác tùy chọn phụ thuộc vào khả năng tác tử công bố. Powerduck không lưu trữ bộ nhận thông báo đẩy.

## Phần mở rộng OpenAPI

`x-a2a` là phần mở rộng OpenAPI của Powerduck, không phải Agent Card A2A chuẩn hay từ khóa chuẩn OpenAPI. Thao tác JSON-RPC dùng `post`. Đường dẫn OpenAPI xác định thao tác được mô tả; `endpoint` là URL JSON-RPC từ xa thực tế.

```yaml
openapi: 3.2.0
info:
  title: Research agent
  version: 1.0.0
paths:
  /agents/research/send:
    post:
      summary: Ask the research agent
      x-protocol: a2a
      x-a2a:
        version: '1.0'
        binding: JSONRPC
        endpoint: https://agent.example.com/rpc
        agentCardUrl: https://agent.example.com/.well-known/agent-card.json
        method: SendMessage
        requestSchema:
          type: object
          description: Application-specific message parameters
        responseSchema:
          type: object
          description: JSON-RPC response envelope
        example:
          jsonrpc: '2.0'
          id: request-1
          method: SendMessage
          params:
            message:
              messageId: message-1
              role: ROLE_USER
              parts:
                - text: Summarize the release notes
      responses:
        '200':
          description: A2A response; inspect result or error
          content:
            application/json:
              schema:
                type: object
```

Với phản hồi truyền luồng, dùng `text/event-stream` cùng `itemSchema` của OAS 3.2 để mô tả một sự kiện JSON-RPC. Trình thiết kế hỗ trợ schema yêu cầu và phản hồi độc lập. Tài liệu được xuất bản và chức năng Sao chép cho LLM giữ cấu hình A2A cùng các hợp đồng được mô tả.

| Trường | Ý nghĩa |
| --- | --- |
| `version` | Phiên bản định dạng truyền được hỗ trợ: `1.0` hoặc `0.3` |
| `binding` | `JSONRPC`; A2A 1.0 còn hỗ trợ `HTTP+JSON` và `GRPC` |
| `endpoint` | Điểm cuối JSON-RPC, URL gốc REST hoặc địa chỉ máy chủ gRPC HTTP(S) |
| `method` | Phương thức theo phiên bản: REST/gRPC dùng lựa chọn này; JSON-RPC dùng phương thức trong nội dung |
| `agentCardUrl` | URL khám phá công khai |
| `agentCard` | Ảnh chụp siêu dữ liệu được lưu, không bắt buộc |
| `requestSchema`, `responseSchema` | Hợp đồng được mô tả rõ, không suy ra từ một phản hồi được ghi lại |
| `example` | Cấu trúc bao JSON-RPC hoặc đối tượng yêu cầu REST/gRPC trực tiếp |

## REST và gRPC

Chọn **Cơ chế kết nối truyền tải** độc lập với phiên bản và phương thức. A2A 1.0 hỗ trợ JSON-RPC, REST và gRPC gốc. A2A 0.3 tiếp tục hỗ trợ JSON-RPC; tổ hợp không được hỗ trợ bị từ chối thay vì âm thầm chuyển đổi.

Với REST, thanh URL chứa URL gốc, chẳng hạn `https://agent.example/rest`. Phương thức xác định động từ HTTP và phần đường dẫn nối thêm. Sửa đối tượng yêu cầu trực tiếp trong Nội dung, không có các trường bao `jsonrpc`, `id` và `params`. ID tác vụ được mã hóa thành đoạn đường dẫn; bộ lọc và phân trang trở thành tham số truy vấn. Gỡ lỗi và tạo mã tài liệu dùng chung ánh xạ này.

gRPC gốc cần ứng dụng máy tính. Dùng `https://host:port` cho TLS với chứng chỉ tin cậy của hệ thống, hoặc `http://localhost:port` để kiểm thử cục bộ không mã hóa. URL không có thành phần đường dẫn. Tiêu đề trở thành siêu dữ liệu gRPC. Lệnh gọi dùng bộ mô tả chính thức `lf.a2a.v1.A2AService`, với chuyển đổi ProtoJSON cho dữ liệu lồng nhau, enum và trường nhị phân. Dừng hủy lệnh gọi cục bộ, không hủy tác vụ từ xa. Script HTTP, proxy và cài đặt TLS tùy chỉnh bị từ chối với cơ chế này, không bị âm thầm bỏ qua.

Thay đổi phiên bản hoặc cơ chế kết nối giữ nguyên bản nháp. Dùng **Tạo nội dung yêu cầu**, kiểm tra mẫu rồi xác nhận **Thay thế nội dung yêu cầu** để áp dụng đúng cấu trúc. Cấu trúc bao không phù hợp bị từ chối trước khi gửi. Có thể chủ động áp dụng giao diện đã khám phá; A2A không còn tự kế thừa máy chủ tài liệu không liên quan.

## Tạo máy chủ

Mở **Tạo máy chủ → Tải dự án máy chủ**. Tệp nén chứa dự án Node 22+ cung cấp JSON-RPC, REST và gRPC qua một trình xử lý nghiệp vụ HTTP duy nhất, cùng Agent Card công khai. Chạy `npm install`, đặt `A2A_TOKEN` với ít nhất 32 ký tự ngẫu nhiên và `HANDLER_URL`, rồi chạy `npm start`.

Trình xử lý nhận `{message, contextId}` và trả về Message với `parts` không rỗng. Tệp tải xuống không chứa bí mật hoặc thông tin xác thực của yêu cầu hiện có. Dịch vụ tạo ra giới hạn kích thước dữ liệu, đặt thời hạn 60 giây cho trình xử lý, giới hạn đồng thời, dọn tài nguyên khi tắt và hỗ trợ ký JWS tùy chọn qua `SIGNING_JWK_FILE`.

Đây là **bộ chuyển tiếp thông điệp không lưu trạng thái**, không phải mô hình tự chủ hay bộ máy tác vụ bền vững. Tác vụ bền vững, hủy tác vụ và gửi thông báo đẩy cần bộ thực thi tùy chỉnh cùng lưu trữ lâu dài. Thẻ không công bố hỗ trợ thông báo đẩy. Trước khi triển khai công khai, cấu hình URL công khai, TLS và giới hạn tốc độ tại reverse proxy HTTP; nếu phục vụ nhiều người dùng, thay cơ chế định danh bằng token dùng chung. Các yêu cầu này được ghi trong README tạo ra.

## Khả năng tương thích chữ ký

Xác minh tuân theo quy tắc hiện diện trường của A2A 1.0 và JSON chuẩn hóa RFC 8785, gồm chuỗi/mảng rỗng bắt buộc cùng giá trị boolean tùy chọn được khai báo rõ. Chữ ký tạo bởi bên ký loại bỏ các trường bắt buộc này bị từ chối; hãy ký lại bằng bộ chuẩn hóa phù hợp. Chữ ký hợp lệ chứng minh các trường chuẩn khớp với khóa công khai được cung cấp, không chứng minh khóa chưa đáng tin thuộc về tổ chức được tuyên bố.

Tham khảo: [Đặc tả A2A 1.0](https://a2a-protocol.org/v1.0.0/specification/) và [Đặc tả A2A 0.3](https://a2a-protocol.org/v0.3.0/specification/).

## Ví dụ cục bộ có thể chạy

Kho Powerduck React có `examples/a2a-demo`. Với Node.js 22+, chạy `npm ci` và `npm start` trong thư mục đó. Nhập `openapi.json` để gỡ lỗi JSON-RPC, REST và gRPC trên ứng dụng máy tính với cùng một máy tính toán cục bộ. README có bearer token mẫu, cách khám phá Agent Card, JWKS cục bộ đáng tin cậy và hướng dẫn truyền luồng. `npm test` kiểm tra truyền tải thật và việc từ chối chữ ký bị sửa mà không cần dịch vụ bên ngoài.

Trong bảng giao thức, **Tạo nội dung yêu cầu** xem trước mẫu của phương thức đang chọn. **Thay thế nội dung yêu cầu** chủ động áp dụng mẫu; hủy hoặc đổi phương thức sẽ giữ bản nháp hiện có.

```bash
cd powerduck-react/examples/a2a-demo
npm ci
npm start
# In another terminal, in the same directory:
npm test
```

Điểm cuối cục bộ: JSON-RPC `http://127.0.0.1:9999/rpc`, REST `http://127.0.0.1:9999/rest`, gRPC `http://127.0.0.1:9998`. Thẻ công khai ở `http://127.0.0.1:9999/.well-known/agent-card.json`. Dùng bearer token mẫu `powerduck-local-demo-token-0123456789`. Gửi các số `[12,30]` sẽ nhận `Sum: 42` và dữ liệu có cấu trúc `total: 42`. Khóa công khai đáng tin nằm trong `.runtime/trusted-jwks.json` và đổi sau mỗi lần khởi động lại. Ví dụ chỉ lắng nghe cục bộ, không cần khóa AI, không có bộ máy tác vụ bền vững hay gửi thông báo đẩy, và không được triển khai công khai với token mẫu. Nguồn trình duyệt mặc định là `http://localhost:3000` và `http://127.0.0.1:3000`; dùng `CORS_ORIGINS` cho nguồn khác. Máy chủ tạo ra cũng hỗ trợ danh sách cho phép được chỉ định rõ này.
