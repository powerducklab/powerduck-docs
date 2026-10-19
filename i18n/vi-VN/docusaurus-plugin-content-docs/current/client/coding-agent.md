---
title: "Kết nối OpenAPI với tác nhân lập trình"
description: "Kết nối OpenAPI với tác nhân lập trình"
---

# Kết nối OpenAPI với tác nhân lập trình

Dùng **MCP dành cho nhà phát triển** để tác nhân lập trình kiểm tra hợp đồng và xác minh backend. **API-to-MCP** cung cấp các thao tác API dưới dạng công cụ có thể gọi; đây là một quy trình khác.

1. Mở tệp YAML/JSON bằng nút **Mở** trong ứng dụng máy tính. Lưu một bản sao độc lập trước khi thử nghiệm.
2. Mở **MCP và lập trình** cho đặc tả hiện tại. Bạn cũng có thể chạy `npm ci` và `npm run build` trong bản sao cục bộ của kho mã MCP dành cho nhà phát triển.
3. Cấu hình máy chủ MCP stdio trong tác nhân với chương trình thực thi `node` và các đối số `/absolute/path/dev-mcp-server/dist/cli.mjs`, `--spec`, `/absolute/path/openapi.yaml`. Hãy dùng đường dẫn tuyệt đối thực tế, không dán nguyên các giá trị mẫu.
4. Yêu cầu tác nhân đọc một thao tác và lược đồ phản hồi của thao tác đó trước khi sửa backend. Sau khi sửa, yêu cầu tác nhân gọi `run_contract_tests` và chỉ rõ `baseUrl` cục bộ của backend.
5. Xem lại các khẳng định kiểm thử được báo cáo và bản vá mã được đề xuất. Chạy lại kiểm thử sau khi áp dụng bản sửa mà bạn chấp nhận.

Máy chủ MCP dành cho nhà phát triển yêu cầu Node.js 22.12.0 trở lên. Tác nhân có thể gửi kết quả công cụ hoặc ngữ cảnh mã đến mô hình từ xa đã cấu hình. Không cần mô hình để gửi yêu cầu cục bộ thủ công và kiểm thử hợp đồng. Nhà cung cấp của bạn tính phí sử dụng khóa riêng; tín dụng cho mô hình được lưu trữ được tính riêng. Làm việc cục bộ không cần đăng ký Cloud.

[Tải ứng dụng máy tính](https://www.powerduck.com/download.html) · [Bắt đầu nhanh](https://www.powerduck.com/docs/vi-VN/overview/quickstart/)
