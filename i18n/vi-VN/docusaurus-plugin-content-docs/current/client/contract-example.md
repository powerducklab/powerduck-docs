---
title: "Tìm lỗi triển khai bằng kiểm thử hợp đồng"
description: "Tìm lỗi triển khai bằng kiểm thử hợp đồng"
---

# Tìm lỗi triển khai bằng kiểm thử hợp đồng

Ví dụ này dùng trình chạy MCP dành cho nhà phát triển, hỗ trợ kiểm tra lược đồ phản hồi từ phiên bản 0.7.6. Cần Node.js 22.12.0 trở lên. Ví dụ sử dụng dữ liệu giả và backend chỉ lắng nghe trên giao diện loopback; sau khi cài phần phụ thuộc, không cần tài khoản, mô hình hay API công khai.

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

Phản hồi là `{"total":"42"}` trong khi lược đồ yêu cầu số. Bộ kiểm tra thực tế báo `/total must be number` và thoát với mã 1.

```sh
node examples/contract-total/verify.mjs --correct
```

Backend giờ trả về `{"total":42}`; cùng phép kiểm tra đó thành công và thoát với mã 0. Để tự sửa cách triển khai, thay đổi biểu thức `total` trong `examples/contract-total/server.mjs` để trả về số. Đừng nới lỏng hợp đồng nhằm che giấu lỗi.

Mỗi lần chạy sẽ cấp một cổng cục bộ còn trống và dừng máy chủ khi hoàn tất. Mã nguồn và lệnh nằm trong [dự án ví dụ](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total). Hiện tại việc kiểm tra lược đồ bao gồm phản hồi JSON, không kiểm tra định dạng hay tải lược đồ từ xa. Nếu loại nội dung chưa được hỗ trợ cần kiểm tra lược đồ, hệ thống báo giới hạn thay vì âm thầm cho qua.

Đây là kiểm tra backend thực tế. Yêu cầu Mock thành công chỉ minh họa quy trình mẫu. Nếu muốn, tác nhân lập trình có thể dùng `run_contract_tests` với `baseUrl` được chỉ định rõ để chạy cùng phép kiểm tra; hãy xem bản vá trước khi áp dụng.

[Tải ứng dụng máy tính](https://www.powerduck.com/download.html) · [Bắt đầu nhanh](https://www.powerduck.com/docs/vi-VN/overview/quickstart/)
