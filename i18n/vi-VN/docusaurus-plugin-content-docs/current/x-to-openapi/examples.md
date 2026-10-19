---
sidebar_position: 5
title: "Ví dụ"
description: "Các ví dụ thực tế có thể chạy bằng API công khai"
---

# Ví dụ

Các ví dụ thực tế có thể chạy bằng API công khai. Hàm chuyển đổi là bất đồng bộ, vì vậy hãy dùng `await`. Chúng phân tích đầu vào cục bộ và không gửi các yêu cầu HTTP đã ghi lại.

---

## 1. Lệnh curl cơ bản

Chuyển đổi một lệnh curl và kiểm tra tài liệu được tạo.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36,"tags":["admin","user"]}'`,
);

console.log(result.document.openapi);            // "3.2.0"
console.log(result.ok, result.documentValid);    // true true

const post = result.document.paths["/users"].post;
const body = post?.requestBody;
if (!body || !("content" in body)) throw new Error("Expected an inline request body");
const media = body.content["application/json"];
console.log(media && "schema" in media ? media.schema : undefined);
// {
//   type: "object",
//   properties: {
//     name: { type: "string" },
//     age: { type: "integer" },
//     tags: { type: "array", items: { type: "string" } }
//   },
//   required: ["name", "age", "tags"]
// }
```

Thông tin chẩn đoán luôn được trả về, kể cả khi thành công:

```typescript
for (const d of result.diagnostics) {
  console.log(`[${d.severity}] ${d.code}: ${d.message}`);
}
```

---

## 2. Nhiều lệnh curl theo lô

Truyền mảng lệnh hoặc chuỗi chứa nhiều lệnh. Các yêu cầu có cùng phương thức và đường dẫn được hợp nhất; lược đồ được kết hợp theo cấu trúc.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users",
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    `curl -X POST https://api.example.com/users \
       -H 'Content-Type: application/json' \
       --data '{"name":"Ada"}'`,
  ],
  {
    title: "User API",
    version: "2.0.0",
    useServerBasePath: false,
    inferPathParameters: true,
  },
);

// The two detail requests are grouped; /users remains a separate path.
console.log(Object.keys(result.document.paths)); // ["/users", "/users/{userId}"]
```

### Đầu ra “Sao chép tất cả dưới dạng cURL” của trình duyệt

Dán cả khối cùng lúc: [`splitCurlCommands`](./api-reference.md#splitcurlcommands) xử lý dấu ngoặc kép, nối dòng, dấu nhắc và `curl.exe`.

```typescript
const block = `
$ curl 'https://api.example.com/users/1?active=true'
> curl 'https://api.example.com/users/2' -X POST \
  -H 'Content-Type: application/json' --data '{"name":"Ada"}'`;

const result = await curlToOpenApi(block, { title: "Pasted traffic" });
```

---

## 3. Collection Postman

Chuyển đổi đối tượng collection. Thư mục lồng nhau, kế thừa xác thực và script kiểm thử đều được xử lý.

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
  item: [
    {
      name: "Users",
      item: [
        {
          name: "Create user",
          request: {
            method: "POST",
            url: "https://api.example.com/users",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: '{"name":"Ada","role":"admin"}',
              options: { raw: { language: "json" } },
            },
          },
          event: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: ["pm.test('status is 201', () => pm.response.to.have.status(201));"],
              },
            },
          ],
        },
      ],
    },
  ],
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// Collection-level bearer auth becomes a securityScheme + operation security.
console.log(result.document.components?.securitySchemes);
// { bearerAuth: { type: "http", scheme: "bearer" } }

// The Postman test script is preserved:
console.log(result.document.paths["/users"].post["x-postman-scripts"]);
// { test: "pm.test('status is 201', () => ...)" }
```

Cũng có thể dùng chuỗi JSON:

```typescript
const fromText = await postmanToOpenApi(JSON.stringify(collection));
```

---

## 4. Suy luận tham số đường dẫn

Khi `inferPathParameters` được bật, như mặc định, yêu cầu được nhóm theo phương thức, origin và hình dạng đường dẫn. Một đoạn chỉ trở thành tham số khi nhóm có ít nhất `pathParameterMinSamples` yêu cầu, các giá trị thay đổi và **mọi** giá trị đều giống định danh: số, UUID, ULID hoặc chuỗi thập lục phân từ 8 ký tự trở lên.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    "curl https://api.example.com/users/123/posts/abc12345",
    "curl https://api.example.com/users/456/posts/def45678",
  ],
  { pathParameterMinSamples: 2 },
);

console.log(Object.keys(result.document.paths));
// [ "/users/{userId}", "/users/{userId}/posts/{postId}" ]
```

Tên tham số lấy từ đoạn tĩnh gần nhất phía trước, chuyển sang số ít và camelCase:

| Mẫu đường dẫn | Tên tham số |
|---|---|
| `/users/{}` | `userId` |
| `/users/{}/posts/{}` | `userId`, `postId` |
| `/categories/{}/items/{}` | `categoryId`, `itemId` |
| `/{}` | `param1` |

Tên trùng trong cùng đường dẫn được thêm hậu tố số (`userId`, `userId2`).

Tắt suy luận để giữ nguyên các đoạn đường dẫn:

```typescript
await curlToOpenApi(commands, { inferPathParameters: false });
```

---

## 5. Adapter tùy chỉnh

Triển khai [`SourceAdapter`](./api-reference.md) để thêm nguồn như HAR, HTTPie hoặc Insomnia, rồi đăng ký vào `XToOpenApi`.

```typescript
import {
  XToOpenApi,
  CurlAdapter,
  type SourceAdapter,
  type NormalizedRequest,
  type AdapterContext,
} from "@powerduck/x-to-openapi";

// A trivial adapter that emits a single GET request.
class PingAdapter implements SourceAdapter<{ url: string }> {
  readonly id = "ping";

  canHandle(input: unknown): boolean {
    return (
      typeof input === "object" &&
      input !== null &&
      "url" in (input as Record<string, unknown>)
    );
  }

  async parse(
    input: { url: string },
    context: AdapterContext,
  ): Promise<NormalizedRequest[]> {
    let url: URL;
    try {
      url = new URL(input.url);
    } catch (cause) {
      context.report({
        code: "ADAPTER_PARSE_FAILED",
        severity: "error",
        source: this.id,
        message: `Invalid URL: ${input.url}`,
        cause,
      });
      return [];
    }

    return [
      {
        source: this.id,
        sourceIndex: 0,
        method: "get",
        url,
        urlString: url.toString(),
        headers: [],
        query: [],
        cookies: [],
      },
    ];
  }
}

const converter = new XToOpenApi()
  .register(new PingAdapter())
  .register(new CurlAdapter());

// Explicit adapter id:
const a = await converter.convert("ping", { url: "https://api.example.com/health" });

// Auto-detect:
const b = await converter.convert("auto", { url: "https://api.example.com/health" });

console.log(a.document.paths["/health"]?.get?.operationId);
```

---

## 6. Xử lý lỗi và chế độ nghiêm ngặt

Vấn đề được thu thập trong `result.diagnostics`. Với `strict: true`, chẩn đoán mức lỗi ném [`ConversionError`](./api-reference.md#conversionerror), còn chỉ có cảnh báo thì không. Tùy chọn không hợp lệ và ID adapter không xác định cũng có thể ném ngoại lệ.

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

// Soft mode: inspect diagnostics yourself.
const soft = await curlToOpenApi("curl https://api.example.com/health");
if (!soft.ok) {
  for (const d of soft.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}

// Strict mode: throw on the first error-severity diagnostic.
try {
  await curlToOpenApi("not a curl command at all", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Conversion failed:", error.message);
    for (const d of error.diagnostics) console.error(`  ${d.code}`);
  }
}
```

Kiểm tra kích thước hiện tại ném `ConversionError` khi một chuỗi, hoặc tổng các phần tử chuỗi của mảng, vượt 10 × 1024 × 1024 đơn vị mã chuỗi JavaScript, bất kể `strict`. Đây không phải giới hạn byte UTF-8 và không đo đối tượng đã phân tích; hãy tự áp dụng giới hạn byte trước khi nhận đầu vào không đáng tin cậy.

---

## Bước tiếp theo

- [Tài liệu tham khảo API](./api-reference.md): giá trị mặc định của tùy chọn và mã chẩn đoán.
- [Bắt đầu nhanh](./quickstart.md): lần chuyển đổi đầy đủ đầu tiên.
