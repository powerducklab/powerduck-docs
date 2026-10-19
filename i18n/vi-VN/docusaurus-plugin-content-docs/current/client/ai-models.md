---
sidebar_position: 8
title: "AI và mô hình"
description: "Powerduck cho phép bạn chọn và cấu hình mô hình của trợ lý. Trên desktop, yêu cầu đi qua tiến trình chính đến endpoint bạn chọn; các thay đổi tài liệu vẫn dùng thẻ để xem xét."
---

# AI và mô hình

Powerduck cho phép bạn chọn và cấu hình mô hình của trợ lý. Trên desktop, yêu cầu đi qua tiến trình chính đến endpoint bạn chọn; các thay đổi tài liệu vẫn dùng thẻ để xem xét.

## Dùng mô hình của bạn

Trong cài đặt, kết nối trợ lý với endpoint Chat Completions **tương thích OpenAI**:

- Chọn nhà cung cấp có sẵn hoặc khai báo nhà cung cấp **tùy chỉnh**;
- Nhập tên hiển thị, URL cơ sở, khóa API và ID mô hình;
- Có thể cấu hình nhiều hồ sơ và chọn giữa chúng.

Ứng dụng không gắn với nhà cung cấp cụ thể. Endpoint tương thích OpenAI tự lưu trữ hoặc của bên thứ ba hoạt động theo cùng cách, phù hợp với nhóm có chính sách mô hình riêng.

## Khả năng nâng cao và cơ chế dự phòng

Mỗi hồ sơ có tùy chọn **khả năng nâng cao**, được bật mặc định:

- Khi bật, ứng dụng dùng **gọi hàm gốc** của mô hình và gửi danh mục công cụ để mô hình trực tiếp chọn và gọi công cụ phù hợp;
- Nếu endpoint từ chối tham số công cụ gốc, chẳng hạn mô hình nhỏ không hỗ trợ công cụ, ứng dụng ghi nhớ endpoint đó và thử lại một lần bằng **giao thức dự phòng dựa trên nội dung**.

Cơ chế dự phòng cải thiện khả năng tương thích nhưng không bảo đảm thành công: lỗi mạng, xác thực và mô hình vẫn có thể xảy ra. Tắt khả năng nâng cao nếu hồ sơ luôn cần dùng chế độ cơ bản.

Hoạt động công cụ cũng có giới hạn: tác nhân dùng số vòng công cụ hữu hạn, mặc định là ba, và loại bỏ lời gọi lặp trong cùng lần chạy.

## Vì sao yêu cầu đi qua tiến trình chính

Trên desktop, yêu cầu sinh nội dung được gửi từ **tiến trình chính Node**, không phải khung web. Điều này có hai lợi ích cụ thể:

- **Không bị CORS của trình duyệt chặn.** Giới hạn khác nguồn áp dụng cho trang web không cản lời gọi đến endpoint mô hình;
- **Yêu cầu HTTP chạy ngoài tiến trình kết xuất.** Bảng mạng của tiến trình này không hiển thị trao đổi HTTP của tiến trình chính. Điều đó không bảo đảm lời nhắc hoặc khóa không có trong bộ nhớ của tiến trình kết xuất, nhật ký hay công cụ phát triển khác.

Cổng kết nối desktop kiểm tra cấu trúc yêu cầu và áp dụng giới hạn tài nguyên:

- Chỉ chấp nhận URL HTTP(S); kiểm tra tên và giá trị tiêu đề, kích thước nội dung, thời gian chờ và số yêu cầu đồng thời. Cho phép endpoint cục bộ và riêng tư. Đây không phải danh sách máy chủ được phép hay cam kết về quyền riêng tư từ nhà cung cấp;
- Có thể hủy yêu cầu (`ai:cancel`).

## Desktop và web

Cùng một trợ lý hoạt động trong cả hai môi trường với kênh phù hợp:

- **Desktop (Electron):** khả năng được nhập và thực thi cục bộ; yêu cầu sinh nội dung được chuyển qua tiến trình chính;
- **Web:** cùng quy trình chạy qua HTTP, gọi API dịch vụ thay vì mô-đun cục bộ.

Vì vậy ứng dụng giữ đường xử lý tương thích web bên cạnh Electron: cách hiểu ý định và thẻ vẫn nhất quán, còn cơ chế truyền tải thay đổi theo môi trường.

## Cách nhận diện ý định

Ý định không được xử lý bằng cách liệt kê từ khóa cho từng tính năng. Thay vào đó, ứng dụng cung cấp **danh mục công cụ** rõ ràng cho mô hình: ID, tham số và tình huống sử dụng chính xác của từng công cụ. Mô hình chọn công cụ; ứng dụng xác định kiểm tra rồi thực thi, còn thao tác ghi phải được xác nhận.

Thêm khả năng nghĩa là thêm công cụ có mô tả chính xác vào danh mục, thay vì kéo dài danh sách từ khóa. Danh mục này có thể được chia sẻ với tác nhân bên ngoài qua máy chủ MCP, giữ khả năng của sản phẩm và các công cụ khác nhất quán.

## Quyền riêng tư

- Lời nhắc, ngữ cảnh đã chọn, mô tả công cụ và thông tin xác thực được gửi đến endpoint mô hình đã cấu hình. Nhà cung cấp từ xa nhận những dữ liệu đó; dùng endpoint cục bộ đáng tin cậy nếu chính sách yêu cầu suy luận tại chỗ;
- Ứng dụng xác định, chứ không phải mô hình, kiểm tra và áp dụng mọi thay đổi;
- Bạn phê duyệt từng thao tác ghi trước khi chạy.

Xem thêm: [Thiết kế cùng trợ lý](./design.md), [Cài đặt](./settings.md), [Kiểm soát truy cập đám mây](../cloud/access-control.md).
