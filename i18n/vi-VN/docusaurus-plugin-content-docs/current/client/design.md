---
sidebar_position: 2
title: "Thiết kế cùng trợ lý"
description: "Khu vực Đặc tả là nơi thiết kế API. Khu vực này đặt cuộc trò chuyện AI cạnh tài liệu hiện tại và bản xem trước, giúp bạn mô tả ý định bằng ngôn ngữ tự nhiên mà vẫn kiểm soát những thay đổi thực sự được áp dụng."
---

# Thiết kế cùng trợ lý

Khu vực Đặc tả là nơi thiết kế API. Khu vực này đặt cuộc trò chuyện AI cạnh tài liệu hiện tại và bản xem trước, giúp bạn mô tả ý định bằng ngôn ngữ tự nhiên mà vẫn kiểm soát những thay đổi thực sự được áp dụng.

## Quy trình phê duyệt

Mô hình không chỉnh sửa tài liệu trực tiếp. Quy trình được chia thành các bước rõ ràng:

```text
you describe an intent
        |
the model reads current state and proposes operations
        |
the host validates the proposal
        |
you review a patch card and Apply or Reject
        |
the change is merged into the document
```

Sự phân tách này là quyết định thiết kế cốt lõi. **Mô hình** hiểu ý định và đề xuất cấu trúc; **ứng dụng chủ** kiểm tra từng thao tác theo quy tắc xác định; **bạn** phê duyệt từng thay đổi. Đề xuất không bao giờ được xem là đã áp dụng trước khi bạn xác nhận.

## Thẻ thay đổi

Thẻ thay đổi tóm tắt nội dung và liệt kê chính xác các thao tác, chẳng hạn thêm một đường dẫn mới:

```json
{
  "type": "patch",
  "summary": "Add GET /products endpoint",
  "ops": [
    { "op": "add", "path": ["paths", "/products"], "value": { "get": {} } }
  ],
  "affects": { "paths": ["/paths/~1products"], "resources": ["Product"] }
}
```

Các đoạn đường dẫn là phần tử của mảng, không phải chuỗi JSON Pointer. Khi thêm đường dẫn mới, đích là `["paths", "/products"]`; các cấu trúc chứa ở cấp cha được tạo tự động.

### Chỉnh sửa từng phần của thao tác hiện có

Khi sửa thao tác đã có, trợ lý **không** gửi lại toàn bộ thao tác vì làm vậy sẽ xóa những trường không được gửi kèm. Thay vào đó, trợ lý tạo các thao tác nhỏ chỉ tác động đến phần cần đổi, kể cả phần nằm sâu trong cấu trúc:

- Thêm một tham số truy vấn:

```json
{ "op": "add", "path": ["paths", "/products", "get", "parameters", "-"], "value": {} }
```

- Mở rộng schema phản hồi:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "responses", "200", "content", "application/json", "schema", "properties", "total"], "value": { "type": "integer" } }
```

- Thay đổi một trường:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "summary"], "value": "..." }
```

Phần tử được thêm vào mảng bằng token `"-"`, thay vì gửi lại cả mảng. Tham số được xác định bằng cặp `(in, name)` để tránh tạo trùng tham số đã có. Ứng dụng hợp nhất giá trị đề xuất vào thao tác hiện tại và giữ nguyên mọi phần không được đề cập.

Nhờ vậy, việc tinh chỉnh nhiều lần vẫn đáng tin cậy: khi bạn yêu cầu “thêm tham số limit” hoặc “bắt buộc nhập tên”, chỉ trường đó thay đổi, còn phần còn lại của thao tác được giữ nguyên.

## Công cụ đọc làm cơ sở cho đề xuất

Trước khi trả lời, mô hình có thể gọi công cụ chỉ đọc để lấy trạng thái hiện tại chính xác thay vì phỏng đoán:

- `spec.overview`: tiêu đề, phiên bản, giao thức, số lượng, thẻ, máy chủ và bảo mật;
- `spec.listOperations`: mọi thao tác dưới dạng `METHOD /path`, kèm tóm tắt và thẻ;
- `spec.presentOperations`: thẻ danh sách chỉ đọc của tất cả thao tác;
- `spec.getOperation`: định nghĩa đầy đủ của một thao tác và các schema mà nó tham chiếu;
- `spec.getSchema`: một schema thành phần, gồm trường bắt buộc và mô tả.

Nếu chưa thấy toàn bộ cấu trúc của thao tác, mô hình cần đọc thao tác đó trước khi chỉnh sửa.

## Yêu cầu lớn được xử lý theo từng bước

Với yêu cầu rộng như “xây dựng API thương mại điện tử”, trợ lý không đưa ra mọi thứ cùng lúc:

1. Trước tiên, trợ lý đặt **câu hỏi làm rõ** về các quyết định chính;
2. Sau khi bạn trả lời, trợ lý đề xuất **từng thay đổi có phạm vi cụ thể**, với hai đến năm thao tác trong mỗi thẻ;
3. Trợ lý chỉ tiếp tục khi yêu cầu mới nhất của bạn vẫn nằm trong mục tiêu đó.

Ngay khi xác định được phạm vi, trợ lý còn tạo `plan` cho các điểm cuối dự kiến, giúp bạn thấy cấu trúc công việc trước khi nhận các thay đổi.

## Tránh đi chệch yêu cầu

Ứng dụng áp dụng một số quy tắc để giữ công việc đúng hướng:

- **Tài liệu hiện tại** là nguồn trạng thái có thẩm quyền; mô hình không mặc định rằng thay đổi trước đó đã tồn tại nếu tài liệu cho thấy điều ngược lại;
- Trong chế độ chỉnh sửa có trọng tâm, chỉ đối tượng đang chọn và các schema thành phần được tham chiếu rõ ràng bị thay đổi, không tự ý sửa các điểm cuối khác;
- Việc chỉ rõ một `METHOD /path` khác được hiểu là chủ động chuyển nhiệm vụ;
- Các đề xuất đã áp dụng hoặc từ chối được theo dõi trong lịch sử; thay đổi đã có không được đề xuất lại.

Nếu thiếu thông tin cần thiết, trợ lý đặt câu hỏi cụ thể thay vì tự bịa chi tiết.

## Các loại thẻ khác

Không phải phản hồi nào cũng là thay đổi:

- **Thẻ câu hỏi** yêu cầu bạn chọn giữa các phương án;
- **Thẻ kiểm tra** báo cáo kết quả kiểm tra chất lượng với trạng thái đạt, cảnh báo hoặc lỗi;
- **Thẻ hành động** đưa ra bước tiếp theo cụ thể, chẳng hạn chạy kịch bản hoặc mở không gian làm việc;
- **Thẻ bảng dữ liệu** hiển thị dữ liệu mẫu hoặc các dòng kiểm thử cụ thể cho điểm cuối hay schema.

Liên quan: [Không gian làm việc yêu cầu](./debug.md), [Kiểm thử kịch bản](./scenario-testing.md), [AI và mô hình](./ai-models.md).

## Tác tử A2A

Thiết kế và gỡ lỗi thông điệp tác tử có phiên bản, thao tác tác vụ và cập nhật SSE bằng `x-protocol: a2a`. Xem [Tác tử A2A](./a2a.md) để biết các trường mở rộng và cơ chế kết nối JSON-RPC, REST, gRPC trên ứng dụng máy tính.
