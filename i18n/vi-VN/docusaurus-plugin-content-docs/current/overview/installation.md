---
sidebar_position: 2
title: "Cài đặt"
description: "Ứng dụng desktop Powerduck ưu tiên làm việc cục bộ. Bạn cài đặt như một chương trình desktop thông thường, mở các tệp thật trên ổ đĩa và không cần tài khoản để bắt đầu."
---

# Cài đặt

Ứng dụng desktop Powerduck ưu tiên làm việc cục bộ. Bạn cài đặt như một chương trình desktop thông thường, mở các tệp thật trên ổ đĩa và không cần tài khoản để bắt đầu.

## Tải xuống

Tải bộ cài cho nền tảng của bạn từ [trang web Powerduck](https://www.powerduck.com/#download). Các bản dựng sau được tạo bằng `electron-builder`:

| Nền tảng | Bộ cài | Kiến trúc |
|---|---|---|
| macOS | `.dmg` và `.zip` cho cập nhật tự động | Apple Silicon (`arm64`) và Intel (`x64`) |
| Windows | Bộ cài NSIS (`.exe`) | `x64` |
| Linux | AppImage (`.AppImage`) | `x64` |

## macOS

1. Mở `.dmg` rồi kéo Powerduck vào **Ứng dụng (Applications)**.
2. Trong lần chạy đầu tiên, macOS có thể yêu cầu xác nhận mở ứng dụng tải ngoài App Store. Hãy xác minh ứng dụng đến từ trang tải xuống chính thức trước khi mở; không tắt các kiểm tra bảo mật của hệ thống.
3. Có hai bản dựng: `arm64` cho Apple Silicon (dòng M) và `x64` cho máy Mac Intel. Tải bản phù hợp với máy của bạn.

## Windows

1. Chạy bộ cài NSIS (`.exe`) và làm theo các bước cài đặt.
2. Nếu SmartScreen báo nhà phát hành không được nhận diện, trước tiên hãy kiểm tra bộ cài có đến từ trang tải xuống chính thức không. Chỉ tiếp tục sau khi xác minh nguồn; đừng bỏ qua cảnh báo đối với bản tải xuống không đáng tin cậy.

## Linux

1. Tải `.AppImage`.
2. Cấp quyền thực thi rồi chạy:

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```

AppImage chạy mà không cần cài đặt toàn hệ thống. Trên một số bản phân phối, bạn có thể cần cài FUSE để gắn kết tệp.

## Những thành phần chạy trên máy của bạn

Ứng dụng desktop được xây dựng bằng Electron và gồm hai phần:

- **Tiến trình chính** (Node.js) quản lý truy cập tệp, yêu cầu HTTP đi ra, máy chủ mock cục bộ, kết nối cơ sở dữ liệu và terminal tích hợp;
- **Tiến trình kết xuất** (không gian làm việc React) hiển thị đặc tả, cuộc trò chuyện AI và mọi công cụ.

Cơ chế truyền tải AI trên desktop gửi yêu cầu sinh nội dung qua tiến trình chính, nên không chịu giới hạn CORS giữa trình duyệt và nhà cung cấp. Lời nhắc, ngữ cảnh liên quan và thông tin xác thực vẫn được gửi đến endpoint mô hình bạn cấu hình; sử dụng mô hình được lưu trữ từ xa không phải là thao tác ngoại tuyến. Ranh giới tiến trình không bảo đảm bí mật sẽ không bao giờ xuất hiện trong nhật ký hoặc công cụ dành cho nhà phát triển. Xem [AI và mô hình](../client/ai-models.md).

## Yêu cầu hệ thống

- macOS 11 trở lên, Windows 10 trở lên hoặc bản phân phối Linux desktop phổ biến tương thích với Electron 37;
- Đủ dung lượng ổ đĩa cho ứng dụng; các đặc tả bạn mở vẫn ở vị trí ban đầu;
- Kết nối mạng khi gửi yêu cầu, đồng bộ nguồn Git hoặc gọi mô hình AI từ xa; các chức năng còn lại có thể hoạt động ngoại tuyến.

## Giấy phép

Bạn có thể dùng thử ứng dụng desktop không giới hạn thời gian. Ứng dụng được bán với giấy phép **vĩnh viễn**, thanh toán một lần, không cần thuê bao. Khóa giấy phép được cấp khi mua và chỉ hiển thị một lần. Dịch vụ lưu trữ đám mây dùng thuê bao riêng. Xem [Thanh toán đám mây](../cloud/billing.md) để phân biệt hai sản phẩm.

Tiếp theo: làm theo [Hướng dẫn bắt đầu nhanh](./quickstart.md).
