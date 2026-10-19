---
sidebar_position: 4
title: "Tài liệu tham khảo API"
description: "Hàm, tùy chọn và mã lỗi của lớp lõi và lớp tệp."
---

# Tài liệu tham khảo API

## Lớp lõi (`@powerduck/workspace-yaml/core`)

| Hàm | Mô tả |
|----------|-------------|
| `createWorkspaceYaml(options?)` | Tạo chuỗi nội dung workspace.yaml |
| `createOpenApiYaml(options)` | Tạo chuỗi nội dung YAML OpenAPI 3.2 |
| `createWorkspaceWithApi(options)` | Tạo cả nội dung không gian làm việc và OpenAPI |
| `parseWorkspaceYaml(content)` | Phân tích cú pháp và kiểm tra chuỗi workspace.yaml |

### `createOpenApiYaml(options)` — Tùy chọn

| Tùy chọn | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------------|
| `title` | `string` | Có | Tiêu đề API |
| `version` | `string` | Không | Mặc định `"1.0.0"` |
| `description` | `string` | Không | Mô tả API |
| `contact` | `{ name?, url?, email? }` | Không | Thông tin liên hệ |
| `license` | `{ name, url? }` | Không | Thông tin giấy phép |
| `servers` | `Array<{ url, description? }>` | Không | Danh sách máy chủ |

## Lớp tệp (`@powerduck/workspace-yaml`)

| Hàm | Mô tả |
|----------|-------------|
| `initializeWorkspace(options)` | Tạo tệp workspace.yaml trên đĩa |
| `initializeOpenApi(options)` | Tạo tệp YAML OpenAPI trên đĩa |
| `createWorkspaceApi(options)` | Tạo cả hai tệp một cách nguyên tử (hoàn tác khi thất bại) |

### `createWorkspaceApi(options)` — Tùy chọn

| Tùy chọn | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | Có | Thư mục đích |
| `oasId` | `string` | Có | Mã định danh API duy nhất |
| `name` | `string` | Có | Tên hiển thị |
| `file` | `string` | Không | Đường dẫn tương đối (mặc định: `oasFiles/${oasId}.openapi.yaml`) |
| `title` | `string` | Không | Tiêu đề API (mặc định là `name`) |
| `version` | `string` | Không | Phiên bản API (mặc định: `"1.0.0"`) |
| `overwriteOpenApi` | `boolean` | Không | Mặc định `false` |

## Lỗi

Mọi lỗi đều là thực thể `WorkspaceYamlError` với `code` máy có thể đọc:

| Mã | Mô tả |
|------|-------------|
| `INVALID_ARGUMENT` | Tham số đầu vào không hợp lệ |
| `ALREADY_EXISTS` | Tệp đã tồn tại và tùy chọn ghi đè là false |
| `NOT_FOUND` | Không tìm thấy tệp |
| `IO_ERROR` | Thao tác hệ thống tệp thất bại |
| `INVALID_WORKSPACE` | Cấu hình không gian làm việc không hợp lệ |
| `INVALID_OPENAPI` | Tài liệu OpenAPI không hợp lệ |
| `ROLLBACK_FAILED` | Hoàn tác giao dịch thất bại |
