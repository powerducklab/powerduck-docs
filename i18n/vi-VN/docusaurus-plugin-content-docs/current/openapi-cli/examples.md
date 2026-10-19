---
sidebar_position: 5
title: "Ví dụ"
description: "Ví dụ thực tế về @powerduck/openapi-cli, sử dụng các tùy chọn CLI và API lập trình được hỗ trợ."
---

# Ví dụ

Ví dụ thực tế về `@powerduck/openapi-cli`, sử dụng các tùy chọn CLI và API lập trình được hỗ trợ.

## 1. Kiểm thử CLI cơ bản

Chỉ định tài liệu OpenAPI cục bộ để chạy mọi thao tác:

```bash
openapi-cli --spec openapi.json
```

Ghi đè máy chủ và lưu báo cáo vào thư mục tùy chọn:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Kiểm thử đặc tả được lưu tại URL từ xa:

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. Chạy từ mã với xác thực

Dùng API của thư viện với mã thông báo Bearer, tiêu đề tùy chỉnh và số tác vụ đồng thời:

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  timeout: 15000,
  bearer: process.env.BEARER_TOKEN,
  header: ["X-Environment: staging", "X-Team: platform"],
});

const report = await runTests(config);

printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

console.log(
  `Passed ${report.summary.passed}/${report.summary.total} (${report.summary.passRate}%)`,
);
```

## 3. Chạy kiểm thử có lọc

Chỉ chạy một số thao tác theo phương thức, thẻ, biểu thức chính quy của đường dẫn hoặc operationId:

```bash
# Only GET and POST requests
openapi-cli --spec openapi.json --method get,post

# Only operations tagged "public" or "v2"
openapi-cli --spec openapi.json --tag public,v2

# Only paths under /api/v2
openapi-cli --spec openapi.json --path "^/api/v2"

# Only specific operations
openapi-cli --spec openapi.json --operation-id getUser,createUser
```

Cấu hình trong mã kết hợp các bộ lọc này: các nhóm bộ lọc khác nhau được kết hợp bằng AND; các thẻ trong cùng nhóm được so khớp bằng OR.

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. Tạo báo cáo JSON và HTML

Chọn định dạng xuất bằng `--format`. Mặc định cả ba định dạng đều được tạo:

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

Mã tương đương:

```typescript
import { resolveConfig, runTests, generateJsonReport, generateHtmlReport } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  format: "json,html",
  output: "./reports",
});

const report = await runTests(config);

const jsonPath = generateJsonReport(report, config.outputDir);
const htmlPath = generateHtmlReport(report, config.outputDir);

console.log("Wrote", jsonPath, "and", htmlPath);
```

`generateJsonReport` ghi `report.json`; `generateHtmlReport` ghi `report.html`. Cả hai đều tạo thư mục xuất nếu chưa có và trả về đường dẫn tệp.

## 5. Khẳng định khai báo trong đặc tả

Thêm mảng `x-tests` vào một thao tác. Mỗi mục cần có `name` và loại `assert`:

```json
{
  "paths": {
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "content-type is JSON", "assert": "header", "key": "content-type", "contains": "application/json" },
          { "name": "user id exists", "assert": "jsonPath", "path": "$.id", "exists": true },
          { "name": "user is active", "assert": "jsonPath", "path": "$.status", "equals": "active" },
          { "name": "response under 2s", "assert": "responseTime", "max": 2000 },
          { "name": "body contains email", "assert": "bodyContains", "contains": "@" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

Các loại khẳng định:

| `assert` | Trường bắt buộc | Mục đích |
|----------|-----------------|---------|
| `status` | `value` | Trạng thái HTTP bằng `value` |
| `header` | `key`; `contains` không bắt buộc | Tiêu đề tồn tại; có thể kiểm tra thêm việc chứa chuỗi con |
| `bodyContains` | `contains` | Nội dung phản hồi chứa chuỗi con |
| `bodyEquals` | `body` | Nội dung phản hồi bằng chính xác `body` |
| `jsonPath` | `path`; `equals` / `exists` không bắt buộc | Giải JSONPath rồi so sánh giá trị hoặc kiểm tra sự tồn tại |
| `responseTime` | `max` | Thời gian phải `<= max` ms |

## 6. Tập lệnh Postman

Nhúng tập lệnh kiểm thử kiểu Postman bằng `x-postman-scripts`:

```json
{
  "paths": {
    "/users": {
      "get": {
        "operationId": "listUsers",
        "x-postman-scripts": {
          "test": "pm.test('status is 200', () => pm.response.to.have.status(200)); pm.test('users is an array', () => pm.expect(pm.response.json().users).to.be.an('array'));"
        },
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

Khẳng định khai báo `x-tests` và `x-postman-scripts` có thể cùng tồn tại trên một thao tác.

## 7. Tích hợp CI với GitHub Actions

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Run API tests
        run: npx @powerduck/openapi-cli --spec openapi.json --server "$API_URL" --bearer "$BEARER_TOKEN" --output ./reports
        env:
          API_URL: ${{ secrets.API_URL }}
          BEARER_TOKEN: ${{ secrets.BEARER_TOKEN }}
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: openapi-cli-reports
          path: ./reports
```

Theo mặc định, kiểm thử thất bại trả mã thoát `1`, còn lỗi cấu hình hoặc lỗi thực thi nghiêm trọng trả `2`, làm tác vụ CI thất bại. Dùng `--no-fail-on-error` để một lần chạy kiểm thử đã hoàn tất không làm quy trình CI thất bại; tùy chọn này không bỏ qua lỗi cấu hình hay lỗi nghiêm trọng.
