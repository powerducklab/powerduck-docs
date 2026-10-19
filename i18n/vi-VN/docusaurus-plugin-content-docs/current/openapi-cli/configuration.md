---
sidebar_position: 6
title: "Cấu hình"
description: "Thứ tự ưu tiên là đối số CLI > tệp cấu hình > giá trị mặc định. Kết quả là đối tượng CliConfig do resolveConfig trả về."
---

# Cấu hình

Thứ tự ưu tiên là **đối số CLI > tệp cấu hình > giá trị mặc định**. Kết quả là đối tượng `CliConfig` do [`resolveConfig`](./api-reference.md#resolveconfig) trả về.

## CliConfig

Kiểu cấu hình chính. Mọi trường ngoại trừ `specPath` đều không bắt buộc.

| Trường | Kiểu | Mặc định | Mô tả |
|-------|------|---------|-------------|
| `specPath` | `string` | **bắt buộc** | Đường dẫn hoặc URL `http(s)://` đến đặc tả JSON OpenAPI 3.2 |
| `serverUrl` | `string` | *(từ đặc tả)* | Ghi đè URL cơ sở của máy chủ trong đặc tả |
| `outputDir` | `string` | `"./openapi-cli-report"` | Thư mục ghi tệp báo cáo |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | Định dạng báo cáo cần tạo |
| `filter` | `FilterConfig` | `undefined` | Lọc thao tác cần kiểm thử |
| `concurrency` | `number` | `5` | Số yêu cầu đồng thời tối đa; số nguyên từ 1 đến 100 |
| `timeout` | `number` | `30000` | Thời gian chờ mỗi yêu cầu tính bằng ms, số nguyên từ 1 đến 600000; cũng áp dụng khi tải đặc tả từ xa |
| `proxy` | `string` | `undefined` | URL proxy HTTP(S), ví dụ `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | Cấu hình TLS và chứng chỉ |
| `headers` | `Record<string, string>` | `undefined` | Tiêu đề bổ sung được gửi trong mỗi yêu cầu |
| `auth` | `AuthConfig` | `undefined` | Cấu hình xác thực |
| `variables` | `Record<string, string>` | `undefined` | Biến Postman `{{name}}` cần chèn |
| `failOnError` | `boolean` | `true` | Chỉ dành cho CLI: trả mã khác không sau khi kiểm thử thất bại; bên gọi thư viện phải kiểm tra báo cáo |
| `envFile` | `string` | `undefined` | Đường dẫn tệp `.env` với một cặp `KEY=VALUE` trên mỗi dòng |
| `grpcReflection` | `boolean` | tự động | gRPC: ưu tiên cấu hình tường minh, rồi phần mở rộng của thao tác; nếu không có thì bật khi không cung cấp đường dẫn proto |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC: đường dẫn đến tệp `.proto` hoặc thư mục |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP: cơ chế truyền tải cho thao tác MCP |
| `mcpCommand` | `string` | `undefined` | MCP stdio: lệnh cần khởi chạy |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio: đối số của lệnh |
| `mcpCwd` | `string` | `undefined` | MCP stdio: thư mục làm việc |

`ReportFormat` là kiểu hợp `"json" | "cli" | "html"`.

## Tùy chọn thực thi nâng cao

Các trường sau cũng thuộc `CliConfig`. `requester`, `maxEvents`, `maxStreamMs` và `maxResponseSize` có thể được cung cấp trong tệp JSON. Sau khi xử lý cấu hình, hãy truyền `signal`, `httpRuntime` và `resolveTransport` trực tiếp cho `runTests()` trong mã: đây là đối tượng lúc chạy, không phải cấu hình JSON.

```typescript
interface AdvancedRuntimeOptions {
  requester?: {
    followRedirects?: boolean;
    maxRedirects?: number;
    disableCookies?: boolean;
    protocolVersion?: "http1" | "http2" | "auto";
  };
  maxEvents?: number;
  maxStreamMs?: number;
  maxResponseSize?: number;
  signal?: AbortSignal;
  httpRuntime?: { certificates?: unknown; fileResolver?: unknown };
  resolveTransport?: (target: { protocol: string; url?: string }) => Promise<
    Pick<CliConfig, "proxy" | "tls" | "httpRuntime">
  >;
}
```

`requester` điều khiển chuyển hướng HTTP, cookie và lựa chọn giao thức. Với HTTP/SSE, `maxEvents` mặc định là 50; `maxStreamMs` dùng `timeout` khi không được đặt; `maxResponseSize` được chuyển cho thư viện thực thi yêu cầu. gRPC dùng `maxStreamMs` làm hạn chót của luồng, rồi đến `timeout`, cuối cùng là 30000 ms. `signal` hủy lần chạy; `httpRuntime` cung cấp xử lý chứng chỉ và tệp cho HTTP; `resolveTransport` xác định cấu hình truyền tải theo từng đích.

## DEFAULT_CONFIG

Đối tượng giá trị mặc định tích hợp được thư viện xuất ra:

```ts
export const DEFAULT_CONFIG: Required<
  Pick<
    CliConfig,
    "outputDir" | "formats" | "concurrency" | "timeout" | "failOnError" | "grpcReflection" | "mcpTransport"
  >
> = {
  outputDir: "./openapi-cli-report",
  formats: ["json", "cli", "html"],
  concurrency: 5,
  timeout: 30000,
  failOnError: true,
  grpcReflection: true,
  mcpTransport: "streamable-http",
};
```

## FilterConfig

| Trường | Kiểu | Mô tả |
|-------|------|-------------|
| `methods` | `string[]` | Chỉ kiểm thử các phương thức HTTP này, ví dụ `["get","post"]`; dùng chữ thường trong tệp, còn đầu vào CLI được chuẩn hóa |
| `paths` | `string[]` | Chỉ kiểm thử đường dẫn khớp với một biểu thức chính quy; nếu biểu thức không hợp lệ thì dùng so khớp chuỗi con |
| `tags` | `string[]` | Chỉ kiểm thử thao tác có một trong các thẻ này |
| `operationIds` | `string[]` | Chỉ kiểm thử giá trị `operationId` trùng khớp chính xác |

Bộ lọc không có khóa nào được xử lý thành `undefined`, nghĩa là chạy mọi thao tác.

## TlsConfig

| Trường | Kiểu | Mô tả |
|-------|------|-------------|
| `caCert` | `string` | Đường dẫn bộ chứng chỉ CA định dạng PEM |
| `clientCert` | `string` | Đường dẫn chứng chỉ máy khách PEM cho mTLS |
| `clientKey` | `string` | Đường dẫn khóa riêng máy khách PEM cho mTLS |
| `strictSSL` | `boolean` | Bỏ qua xác minh chứng chỉ TLS khi là `false`; không an toàn |
| `pfx` | `string` | Đường dẫn bộ chứng chỉ PFX; gRPC yêu cầu PEM |
| `passphrase` | `string` | Cụm mật khẩu cho dữ liệu chứng chỉ được mã hóa |

> Lưu ý: tùy chọn CLI `--insecure` tương ứng với `tls.strictSSL = false`, tức là **tắt** xác minh.

## AuthConfig

| Trường | Kiểu | Mô tả |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | Cơ chế xác thực; xem các tên được hỗ trợ bên dưới |
| `parameters` | `Record<string, string \| number \| boolean>` | Tham số riêng của cơ chế được chuyển cho thư viện thực thi yêu cầu |
| `token` | `string` | Mã thông báo Bearer cho `type: "bearer"` |
| `username` | `string` | Tên người dùng cho `type: "basic"` |
| `password` | `string` | Mật khẩu cho `type: "basic"` |
| `key` | `string` | Tên khóa API cho `type: "apikey"` |
| `value` | `string` | Giá trị khóa API cho `type: "apikey"` |
| `in` | `"header" \| "query"` | Vị trí đặt khóa API |

Các giá trị `type` được hỗ trợ gồm `bearer`, `basic`, `apikey`, `none`, `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` và `edgegrid`. Khả năng sử dụng cùng tham số bắt buộc phụ thuộc vào giao thức và thư viện thực thi yêu cầu; chỉ ghi tên chưa đủ để cấu hình xác thực.

Hiện tại tùy chọn CLI `--bearer` chỉ tạo `{ type: "bearer", token }`. Cấu hình đầy đủ hơn cho `basic` / `apikey` được cung cấp qua tệp cấu hình.

## Tệp cấu hình JSON

Tệp là JSON thông thường phù hợp với `Partial<CliConfig>`. Truyền bằng `--config <path>` / `-c`. Đối số CLI luôn được ưu tiên hơn giá trị trong tệp.

```json
{
  "specPath": "./openapi.json",
  "serverUrl": "https://api.staging.example.com",
  "outputDir": "./reports",
  "formats": ["json", "html"],
  "concurrency": 10,
  "timeout": 15000,
  "failOnError": true,
  "proxy": "http://proxy.corp:8080",
  "tls": {
    "strictSSL": true,
    "caCert": "./ca-bundle.pem",
    "clientCert": "./client.crt",
    "clientKey": "./client.key"
  },
  "headers": {
    "X-API-Key": "${API_KEY}",
    "X-Environment": "staging"
  },
  "auth": {
    "type": "bearer",
    "token": "${BEARER_TOKEN}"
  },
  "variables": {
    "host": "api.staging.example.com"
  },
  "filter": {
    "methods": ["get", "post"],
    "tags": ["v2", "public"],
    "paths": ["^/api/v2"],
    "operationIds": ["getUser", "createUser"]
  },
  "grpcReflection": true,
  "grpcProtoPaths": ["./proto"],
  "mcpTransport": "streamable-http",
  "mcpCommand": "npx",
  "mcpArgs": ["-y", "@modelcontextprotocol/server-everything"],
  "mcpCwd": "./mcp-servers"
}
```

Tệp không tồn tại gây lỗi `Config file not found: <path>`; JSON không hợp lệ gây lỗi `Invalid config file (must be JSON)`.

## Mở rộng biến môi trường

Sau khi tải tệp `.env` bằng `--env` / `envFile`, các tham chiếu `${VAR_NAME}` được mở rộng trong các trường chuỗi sau:

- `serverUrl`
- `proxy`
- Giá trị của `headers`
- `auth.token`
- Giá trị của `variables`

Ví dụ:

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

Cách xử lý `.env`: **không** ghi đè mục hiện có trong `process.env`; bỏ dấu nháy đơn hoặc nháy kép bao quanh giá trị; bỏ qua dòng trống và dòng chú thích `#`; nếu thiếu tệp thì bỏ qua mà không báo lỗi.

## Tạo cấu hình trong mã

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

`resolveConfig` ném `"No OpenAPI spec path provided..."` khi không cung cấp đặc tả và `Invalid proxy URL: <url>` khi `proxy` không phải URL hợp lệ.
