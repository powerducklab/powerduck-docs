---
sidebar_position: 2
title: "Cài đặt"
description: "Powerduck · Google OAuth / GitHub · Free / Pro / Max"
---

# Cài đặt

Powerduck, kể cả ứng dụng máy tính, yêu cầu đăng nhập bằng Google OAuth hoặc GitHub. Tệp vẫn nằm trên ổ đĩa. Phân tích AI gửi ngữ cảnh được chọn đến các nhà cung cấp do Powerduck quản lý. Không còn hỗ trợ địa chỉ mô hình hay khóa API tùy chỉnh.

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

Powerduck, kể cả ứng dụng máy tính, yêu cầu đăng nhập bằng Google OAuth hoặc GitHub. Tệp vẫn nằm trên ổ đĩa. Phân tích AI gửi ngữ cảnh được chọn đến các nhà cung cấp do Powerduck quản lý. Không còn hỗ trợ địa chỉ mô hình hay khóa API tùy chỉnh.

## Yêu cầu hệ thống

- macOS 11 trở lên, Windows 10 trở lên hoặc bản phân phối Linux desktop phổ biến tương thích với Electron 37;
- Đủ dung lượng ổ đĩa cho ứng dụng; các đặc tả bạn mở vẫn ở vị trí ban đầu;
- Powerduck, kể cả ứng dụng máy tính, yêu cầu đăng nhập bằng Google OAuth hoặc GitHub. Tệp vẫn nằm trên ổ đĩa. Phân tích AI gửi ngữ cảnh được chọn đến các nhà cung cấp do Powerduck quản lý. Không còn hỗ trợ địa chỉ mô hình hay khóa API tùy chỉnh.

## Powerduck · Free / Pro / Max

Free: 300.000 credits mỗi ngày, đặt lại lúc 00:00 UTC. Pro: $39/tháng và 18.000.000 credits mỗi 7 ngày. Max: $99/tháng và 60.000.000 credits mỗi 7 ngày. Chu kỳ tính từ lần bắt đầu đăng ký đầu tiên, độc lập với thanh toán hằng tháng. Credits không cộng dồn. Máy tính và AI Chat dùng chung gói cá nhân; không còn bán giấy phép vĩnh viễn hoặc mã kích hoạt.

Tiếp theo: làm theo [Hướng dẫn bắt đầu nhanh](./quickstart.md).
