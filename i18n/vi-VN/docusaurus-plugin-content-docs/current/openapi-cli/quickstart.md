---
sidebar_position: 3
title: "Bắt đầu nhanh"
description: "Chạy lô kiểm thử đầu tiên bằng @powerduck/openapi-cli từ CLI và Node.js."
---

# Bắt đầu nhanh

Hướng dẫn này trình bày cách kiểm thử tài liệu OpenAPI đầu tiên của bạn.

## Điều kiện tiên quyết

- Node.js `>= 22.12.0`.
- Tài liệu OpenAPI 3.2 dạng **JSON**. YAML không được chấp nhận; hãy chuyển sang JSON trước. Tài liệu phải có đối tượng `paths` ở cấp cao nhất.

## 1. Chạy từ CLI

Cách chạy đơn giản nhất tải đặc tả cục bộ và kiểm thử mọi thao tác trên URL máy chủ đầu tiên được khai báo trong tài liệu:

```bash
openapi-cli --spec openapi.json
```

Ghi đè máy chủ đích và lưu báo cáo vào thư mục tùy chọn:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Kiểm thử đặc tả từ xa chỉ với các thao tác `GET`, sử dụng 10 worker đồng thời:

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

Dùng tệp cấu hình JSON cho thiết lập phức tạp:

```bash
openapi-cli --config openapi-cli.config.json
```

Xem tất cả cờ tại [Lệnh](/docs/vi-VN/openapi-cli/commands/).

## 2. Viết đặc tả tối thiểu

Tài liệu OpenAPI tối thiểu có các điều kiện kiểm tra khai báo:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Demo API", "version": "1.0.0" },
  "servers": [{ "url": "https://httpbin.org" }],
  "paths": {
    "/get": {
      "get": {
        "operationId": "getGet",
        "responses": { "200": { "description": "ok" } },
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "response under 5s", "assert": "responseTime", "max": 5000 }
        ]
      }
    }
  }
}
```

Nếu thao tác **không** định nghĩa điều kiện kiểm tra, bộ chạy thêm kiểm tra thành công của giao thức một cách ngầm định. Với HTTP, mã trạng thái phải là `2xx`, tránh việc phản hồi 4xx/5xx bị coi là đạt mà không có cảnh báo.

## 3. Chạy từ Node.js (API lập trình)

Thư viện cung cấp cùng quy trình qua các hàm: `resolveConfig` → `runTests` → bộ tạo báo cáo.

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

// 1. Build a CliConfig from CLI-style args.
const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
});

// 2. Run all collected tests.
const report = await runTests(config);

// 3. Emit the reports you need.
printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

// 4. Exit with the correct code for CI.
if (report.summary.failed > 0 || report.summary.errors > 0) {
  process.exit(1);
}
```

`resolveConfig` nhận cấu trúc tùy chọn giống CLI. `runTests` trả về `TestReport` chứa `summary`, `results`, `config`, `generatedAt` và `version`. [Cấu hình](/docs/vi-VN/openapi-cli/configuration/).

## 4. Mã thoát cho CI

| Mã | Ý nghĩa |
|---|---|
| `0` | Mọi kiểm thử đều đạt, hoặc đã bật `--no-fail-on-error`. |
| `1` | Một hoặc nhiều kiểm thử không đạt hoặc gặp lỗi. |
| `2` | Lỗi cấu hình, không tải được đặc tả hoặc lỗi nghiêm trọng khi chạy. |

## Các bước tiếp theo

- [Cấu hình](/docs/vi-VN/openapi-cli/configuration/) — mọi trường `CliConfig` và giá trị mặc định.
- [Lệnh](/docs/vi-VN/openapi-cli/commands/) — tất cả cờ CLI.
- [Ví dụ](/docs/vi-VN/openapi-cli/examples/) — xác thực, lọc, báo cáo và điều kiện kiểm tra.
- [Tham chiếu API](/docs/vi-VN/openapi-cli/api-reference/) — mọi hàm và kiểu được xuất.
