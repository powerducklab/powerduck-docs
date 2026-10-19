---
sidebar_position: 5
title: "Ví dụ"
description: "Ví dụ thực tế cho @powerduck/openapi-codegen: JavaScript fetch, Python requests, cURL, bộ sinh mã tùy chỉnh, plugin và RequestIR trực tiếp."
---

# Ví dụ

Ví dụ thực tế cho `@powerduck/openapi-codegen`. Tất cả đều giả định có đối tượng tài liệu OpenAPI đã phân tích cú pháp mang tên `document`.

## 1. JavaScript `fetch`

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

Máy khách JavaScript khác: `axios`, `ofetch`, `jquery`, `xhr`. Với các lựa chọn tương ứng cho Node phía máy chủ, dùng `node/fetch`, `node/axios`, `node/ofetch` hoặc `node/undici`.

## 2. Python `requests`

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

Máy khách Python khác: `aiohttp`, `http-client`, `httpx-sync`, `httpx-async`.

## 3. cURL (shell)

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
  securityValues: { bearerAuth: "YOUR_ACCESS_TOKEN" },
});

console.log(code);
```

Máy khách shell khác: `wget` và `httpie`. Khi tải lên `multipart/form-data`, nên dùng `shell/curl` hoặc `shell/httpie` thay cho `shell/wget`.

## 4. Tìm và chọn bộ sinh mã

Dùng `list()` để xem các bộ sinh mã có sẵn, rồi tạo mã bằng cặp đã chọn:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const all = list();
console.log(all.length, "generators available");

const picked = all.find(
  (g) => g.language === "python" && g.client === "requests",
);

if (!picked) throw new Error("generator unavailable");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 5. Đăng ký bộ sinh mã tùy chỉnh

Triển khai giao diện `Generator` và gọi `register`:

```typescript
import { register, generate } from "@powerduck/openapi-codegen";
import type { RequestIR } from "@powerduck/openapi-codegen";

register({
  language: "mylang",
  client: "my-client",
  generate(request: RequestIR): string {
    return [
      `// ${request.method} ${request.baseUrl}${request.path}`,
      `mylang.request(${JSON.stringify({
        method: request.method,
        url: request.baseUrl + request.path,
      })})`,
    ].join("\n");
  },
});

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "mylang",
  client: "my-client",
});

console.log(code);
```

## 6. Sử dụng plugin

Plugin gộp việc đăng ký một hoặc nhiều bộ sinh mã qua `use()`:

```typescript
import { use, generate } from "@powerduck/openapi-codegen";

use({
  name: "internal-generators",
  register(api) {
    api.register({
      language: "go",
      client: "our-wrapper",
      generate(request) {
        return `// go wrapper for ${request.method} ${request.path}`;
      },
    });
    api.register({
      language: "ruby",
      client: "our-wrapper",
      generate(request) {
        return `# ruby wrapper for ${request.method} ${request.path}`;
      },
    });
  },
});

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "go",
  client: "our-wrapper",
});
```

## 7. Tạo mã trực tiếp từ `RequestIR`

Tự tạo `RequestIR` để bỏ qua hoàn toàn `normalize`:

```typescript
import { generate } from "@powerduck/openapi-codegen";
import type { RequestIR } from "@powerduck/openapi-codegen";

const request: RequestIR = {
  method: "GET",
  baseUrl: "https://api.example.com",
  path: "/users/{id}",
  parameters: [
    { name: "id", in: "path", value: 123 },
    { name: "limit", in: "query", value: 10, style: "form", explode: true },
  ],
  headers: [
    { name: "Accept", in: "header", value: "application/json" },
  ],
  body: undefined,
  security: [
    { name: "bearerAuth", type: "http", scheme: "bearer", value: "token-abc" },
  ],
};

const code = generate({
  request,
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

## 8. Xử lý lỗi

`generate()` phát sinh lỗi khi thiếu đầu vào, bộ sinh mã không xác định hoặc tham chiếu chưa được phân giải. Luôn bắt lỗi khi xử lý đầu vào không đáng tin cậy:

```typescript
try {
  const code = generate({
    document,
    path: "/does-not-exist",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Failed:", error instanceof Error ? error.message : error);
}
```

Các thông báo lỗi có thể gồm `Unsupported generator: ...`, `Path not found: ...` và `Operation not found: METHOD /path`.

## 9. Chế độ dung sai cho `$ref`

Nếu tài liệu có thể chứa tham chiếu hỏng hoặc vòng lặp, truyền `softRefMode: true` để tiếp tục phân giải với kết quả một phần thay vì phát sinh lỗi:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "python",
  client: "requests",
  softRefMode: true,
});
```
