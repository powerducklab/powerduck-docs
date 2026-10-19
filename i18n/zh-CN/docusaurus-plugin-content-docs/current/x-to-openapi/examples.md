---
sidebar_position: 5
title: "示例"
description: "基于公开 API 的实用可运行示例"
---

# 示例

基于公开 API 的实用可运行示例。转换函数是异步的，请使用 `await`。转换仅在本地解析输入，不会发送其中记录的 HTTP 请求。

---

## 1. 基本 curl 命令

转换单条 curl 命令并查看生成的文档。

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

即使转换成功，也会返回诊断信息：

```typescript
for (const d of result.diagnostics) {
  console.log(`[${d.severity}] ${d.code}: ${d.message}`);
}
```

---

## 2. 多条 curl 命令（批量）

传入命令数组或包含多条命令的字符串。方法与路径相同的请求会合并，Schema 按结构合并。

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

### 浏览器“全部复制为 cURL”的输出

可以一次粘贴整段内容。[`splitCurlCommands`](./api-reference.md#splitcurlcommands) 会处理引号、续行、提示符和 `curl.exe`。

```typescript
const block = `
$ curl 'https://api.example.com/users/1?active=true'
> curl 'https://api.example.com/users/2' -X POST \
  -H 'Content-Type: application/json' --data '{"name":"Ada"}'`;

const result = await curlToOpenApi(block, { title: "Pasted traffic" });
```

---

## 3. Postman Collection

转换集合对象，保留嵌套文件夹、认证继承和测试脚本。

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

也支持 JSON 字符串：

```typescript
const fromText = await postmanToOpenApi(JSON.stringify(collection));
```

---

## 4. 路径参数推断

启用 `inferPathParameters`（默认开启）后，请求会按方法、源站和路径结构分组。仅当组内至少有 `pathParameterMinSamples` 个请求、对应路径段的值存在变化，且**每个**值都像标识符时，才会将该路径段模板化。标识符包括纯数字、UUID、ULID，以及至少 8 位的十六进制字符串。

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

参数名取自最近的前置静态路径段，转换为单数及驼峰形式：

| 路径模式 | 参数名 |
|---|---|
| `/users/{}` | `userId` |
| `/users/{}/posts/{}` | `userId`, `postId` |
| `/categories/{}/items/{}` | `categoryId`, `itemId` |
| `/{}` | `param1` |

同一路径中的重复名称会添加数字后缀（`userId`、`userId2`）。

关闭推断即可保留原始路径段：

```typescript
await curlToOpenApi(commands, { inferPathParameters: false });
```

---

## 5. 自定义适配器

实现 [`SourceAdapter`](./api-reference.md) 即可增加新来源，例如 HAR、HTTPie、Insomnia；随后将其注册到 `XToOpenApi`。

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

## 6. 错误处理与严格模式

问题会汇总到 `result.diagnostics`。设置 `strict: true` 时，错误级别的诊断会抛出 [`ConversionError`](./api-reference.md#conversionerror)，只有警告则不会。无效选项和未知适配器 ID 也可能抛出异常。

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

当前大小检查在字符串长度或数组内字符串元素的总长度超过 10 × 1024 × 1024 个 JavaScript 字符串代码单元时抛出 `ConversionError`，不受 `strict` 影响。这不是 UTF-8 字节限制，也不会测量已解析对象的大小；接受不可信输入前，请自行实施字节限制。

---

## 下一步

- [API 参考](./api-reference.md)——选项默认值与诊断代码。
- [快速入门](./quickstart.md)——完成首次端到端转换。
