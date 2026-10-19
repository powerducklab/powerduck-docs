---
sidebar_position: 3
title: "Bắt đầu nhanh"
description: "Bắt đầu với @powerduck/x-to-openapi: chuyển đổi lệnh curl và bộ sưu tập Postman, rồi đăng ký bộ chuyển đổi tùy chỉnh bằng XToOpenApi."
---

# Bắt đầu nhanh

Hướng dẫn này trình bày ba cách phổ biến nhất: hàm hỗ trợ `curlToOpenApi`, hàm `postmanToOpenApi` và lớp `XToOpenApi` cho cấu hình tùy chỉnh.

Điều kiện tiên quyết: cài đặt gói. [Cài đặt](/docs/vi-VN/x-to-openapi/installation/)

:::note
Tất cả hàm chuyển đổi đều **bất đồng bộ** và trả về [`ConvertResult`](/docs/vi-VN/x-to-openapi/api-reference/#convertresult). Luôn dùng `await`.
:::

## 1. Chuyển đổi lệnh curl

Truyền một lệnh curl vào [`curlToOpenApi`](/docs/vi-VN/x-to-openapi/api-reference/#curltoopenapi). Trường `document` của kết quả chứa đối tượng OpenAPI 3.2 được tạo.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

Dưới đây là phần trích từ tài liệu được tạo:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Generated API", "version": "1.0.0" },
  "servers": [{ "url": "https://api.example.com" }],
  "paths": {
    "/users": {
      "post": {
        "operationId": "postUsers",
        "tags": ["users"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "age": { "type": "integer" }
                },
                "required": ["name", "age"]
              }
            }
          }
        },
        "responses": { "default": { "description": "Successful response" } }
      }
    }
  }
}
```

Kiểm tra chuyển đổi có thành công không và xem thông tin chẩn đoán:

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. Chuyển đổi bộ sưu tập Postman

Truyền đối tượng bộ sưu tập đã phân tích cú pháp hoặc chuỗi JSON vào [`postmanToOpenApi`](/docs/vi-VN/x-to-openapi/api-reference/). Tập lệnh kiểm thử được giữ lại trong `x-postman-scripts`.

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "Get user",
      request: {
        method: "GET",
        url: "https://api.example.com/users/123",
        header: [{ key: "Authorization", value: "Bearer token" }],
      },
      event: [
        {
          listen: "test",
          script: {
            type: "text/javascript",
            exec: ["pm.test('status is 200', () => pm.response.to.have.status(200));"],
          },
        },
      ],
    },
  ],
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// The Postman test script survives on the operation:
console.log(result.document.paths["/users/123"]?.get?.["x-postman-scripts"]);
```

Bạn cũng có thể dùng chuỗi JSON:

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. Dùng lớp `XToOpenApi` với tùy chọn riêng

Dùng lớp này khi muốn kiểm soát rõ các bộ chuyển đổi đã đăng ký và [`ConvertOptions`](/docs/vi-VN/x-to-openapi/api-reference/#convertoptions).

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());

const result = await converter.convert(
  "curl",
  "curl https://api.example.com/users/123",
  {
    title: "My API",
    version: "1.0.0",
    description: "Generated from curl commands",
    inferPathParameters: true,
    pathParameterMinSamples: 2,
    inferSecurity: true,
    includeCommonHeaders: false,
    includeCookies: false,
    includeExamples: false,
    useServerBasePath: false,
    validate: true,
    strict: false,
  },
);

console.log(result.document);
```

### Đăng ký nhiều bộ chuyển đổi và dùng `"auto"`

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. Chẩn đoán và chế độ nghiêm ngặt

Theo mặc định, quá trình chuyển đổi thu thập vấn đề thành các mục [`Diagnostic`](/docs/vi-VN/x-to-openapi/api-reference/) và vẫn trả về kết quả. Đặt `strict: true` để phát sinh [`ConversionError`](/docs/vi-VN/x-to-openapi/api-reference/#conversionerror) ngay tại chẩn đoán đầu tiên ở mức lỗi.

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

try {
  await curlToOpenApi("curl https://api.example.com/users", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Failed:", error.message);
    for (const d of error.diagnostics) console.error(`  [${d.code}] ${d.message}`);
  }
}
```

## Các bước tiếp theo

- [Ví dụ](/docs/vi-VN/x-to-openapi/examples/) — Chuyển đổi curl theo lô, suy luận tham số đường dẫn, xác thực Postman và bộ chuyển đổi tùy chỉnh.
- [Tham chiếu API](/docs/vi-VN/x-to-openapi/api-reference/) — Tất cả mục xuất, tùy chọn và mã chẩn đoán.
