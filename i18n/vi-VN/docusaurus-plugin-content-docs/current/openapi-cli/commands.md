---
sidebar_position: 5
title: "Lệnh CLI"
description: "Gói cung cấp một lệnh thực thi duy nhất là openapi-cli. Lệnh nhận trực tiếp danh sách tùy chọn; không có lệnh con run / validate / init:"
---

# Lệnh CLI

Gói cung cấp một lệnh thực thi duy nhất là `openapi-cli`. Lệnh nhận trực tiếp danh sách tùy chọn; **không có** lệnh con `run` / `validate` / `init`:

```
openapi-cli [options]
```

## Cú pháp

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

Đặc tả là **bắt buộc**: cung cấp `--spec` (hoặc `-s`), hay đặt `specPath` trong tệp JSON được tải bằng `--config`. Các tùy chọn khác đều không bắt buộc.

## Tùy chọn chính

| Tùy chọn | Dạng ngắn | Mặc định | Mô tả |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | Đường dẫn hoặc URL `http(s)://` đến đặc tả JSON OpenAPI 3.2 |
| `--server <url>` | `-S` | *(từ đặc tả)* | Ghi đè URL máy chủ trong đặc tả |
| `--output <dir>` | `-o` | `./openapi-cli-report` | Thư mục xuất báo cáo |
| `--format <formats>` | `-f` | `json,cli,html` | Định dạng báo cáo phân cách bằng dấu phẩy: `json`, `cli`, `html` |
| `--config <path>` | `-c` | — | Đường dẫn tệp cấu hình JSON; đối số CLI được ưu tiên |

## Tùy chọn thực thi

| Tùy chọn | Dạng ngắn | Mặc định | Mô tả |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | Số yêu cầu đồng thời tối đa; số nguyên từ 1 đến 100 |
| `--timeout <ms>` | `-t` | `30000` | Thời gian chờ cho mỗi yêu cầu tính bằng ms, số nguyên từ 1 đến 600000; cũng áp dụng khi tải đặc tả từ xa |
| `--no-fail-on-error` | — | tắt | Trả về `0` sau khi chạy xong dù kiểm thử thất bại; lỗi cấu hình và lỗi nghiêm trọng vẫn gây thất bại |

## Tùy chọn lọc

| Tùy chọn | Mặc định | Mô tả |
|--------|---------|-------------|
| `--method <methods>` | — | Các phương thức HTTP cần đưa vào, phân cách bằng dấu phẩy, ví dụ `get,post` |
| `--path <patterns>` | — | Biểu thức chính quy phân cách bằng dấu phẩy để đối chiếu với từng đường dẫn |
| `--tag <tags>` | — | Các thẻ OpenAPI cần đưa vào, phân cách bằng dấu phẩy |
| `--operation-id <ids>` | — | Các giá trị `operationId` cần đưa vào, phân cách bằng dấu phẩy |

## Tùy chọn mạng và TLS

| Tùy chọn | Dạng ngắn | Mặc định | Mô tả |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | URL proxy HTTP(S), ví dụ `http://proxy.corp:8080` |
| `--ca <path>` | — | — | Bộ chứng chỉ CA ở định dạng PEM |
| `--cert <path>` | — | — | Chứng chỉ máy khách PEM cho mTLS |
| `--key <path>` | — | — | Khóa riêng máy khách PEM cho mTLS |
| `--insecure` | `-k` | tắt | Bỏ qua xác minh chứng chỉ TLS |

## Xác thực, tiêu đề và biến

| Tùy chọn | Dạng ngắn | Mô tả |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | Tiêu đề bổ sung theo dạng `Key: Value`; có thể lặp lại |
| `--bearer <token>` | — | Mã thông báo Bearer gửi trong tiêu đề `Authorization` |
| `--variable <vars...>` | `-v` | Biến Postman theo dạng `KEY=VALUE`; có thể lặp lại |
| `--env <path>` | — | Đường dẫn tệp `.env`; không ghi đè biến môi trường hiện có |

## Tùy chọn gRPC

| Tùy chọn | Mặc định | Mô tả |
|--------|---------|-------------|
| `--grpc-no-reflection` | tắt | Tắt phản chiếu máy chủ gRPC và dùng tệp proto |
| `--grpc-proto <paths...>` | — | Đường dẫn đến tệp `.proto` hoặc thư mục chứa chúng |

## Tùy chọn MCP

| Tùy chọn | Mặc định | Mô tả |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | Cơ chế truyền tải MCP: `streamable-http` hoặc `stdio` |
| `--mcp-command <command>` | — | Lệnh MCP stdio, ví dụ `npx` |
| `--mcp-args <args>` | — | Đối số MCP stdio phân cách bằng dấu cách hoặc dấu phẩy |
| `--mcp-cwd <dir>` | — | Thư mục làm việc của tiến trình con MCP stdio |

## Tùy chọn thông tin

| Tùy chọn | Dạng ngắn | Mô tả |
|--------|-------|-------------|
| `--help` | `-h` | Hiển thị trợ giúp |
| `--version` | `-V` | Hiển thị phiên bản |

## Mã thoát

| Mã | Ý nghĩa |
|------|---------|
| `0` | Mọi kiểm thử đều đạt hoặc đã bật `--no-fail-on-error` |
| `1` | Một hay nhiều kiểm thử thất bại hoặc gặp lỗi, hoặc phân tích đối số CLI thất bại |
| `2` | Lỗi cấu hình, không tải được đặc tả hoặc lỗi thực thi nghiêm trọng |

CLI in `Error:` màu đỏ và thoát với `2` khi `resolveConfig` ném ngoại lệ, chẳng hạn khi không có cả `--spec` lẫn `specPath` trong cấu hình. CLI in `Fatal error:` và thoát với `2` khi `runTests` ném ngoại lệ. Sau khi chạy xong, công cụ chỉ trả về `1` khi `report.summary.failed > 0 || report.summary.errors > 0` và `failOnError !== false`.

## Biến môi trường

Không có biến chuyên dụng `OPENAPI_CLI_*`. Cấu hình được cung cấp qua tùy chọn, tệp cấu hình và các cơ chế sau:

- **Tệp `.env`** — truyền `--env .env` để tải các cặp `KEY=VALUE` vào `process.env`. Biến hiện có không bị ghi đè.
- **Mở rộng `${VAR}`** — sau khi tải, `${VAR_NAME}` được thay thế trong `serverUrl`, `proxy`, các giá trị `headers`, `auth.token` và các giá trị `variables`.

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## Ví dụ chạy lệnh

```bash
# Test a local spec against its first server URL
openapi-cli --spec openapi.json

# Override the server and write JSON + HTML reports
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --format json,html --output ./reports

# Only GET requests, 10 workers, with a bearer token
openapi-cli --spec openapi.json --method get --concurrency 10 --bearer "$TOKEN"

# Use a config file
openapi-cli --config openapi-cli.config.json
```
