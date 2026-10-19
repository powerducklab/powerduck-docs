---
sidebar_position: 3
title: "快速开始"
description: "快速上手 @powerduck/x-to-openapi：转换 curl 命令与 Postman 集合，并通过 XToOpenApi 注册自定义适配器。"
---

# 快速开始

本指南介绍三种常用方式：`curlToOpenApi` 辅助函数、`postmanToOpenApi` 辅助函数，以及用于自定义组合的 `XToOpenApi` 类。

前提条件：先安装此包。 [安装](/docs/zh-CN/x-to-openapi/installation/)

:::note
所有转换函数都是 **异步函数**，返回 [`ConvertResult`](/docs/zh-CN/x-to-openapi/api-reference/#convertresult)。调用时务必使用 `await`。
:::

## 1. 转换 curl 命令

将单条 curl 命令传入 [`curlToOpenApi`](/docs/zh-CN/x-to-openapi/api-reference/#curltoopenapi)。结果中的 `document` 就是生成的 OpenAPI 3.2 对象。

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

生成的文档如下，此处为节选：

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

检查转换是否成功，并查看诊断信息：

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. 转换 Postman 集合

将解析后的集合对象或 JSON 字符串传入 [`postmanToOpenApi`](/docs/zh-CN/x-to-openapi/api-reference/)。测试脚本会保留为 `x-postman-scripts`。

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

也可以使用 JSON 字符串：

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. 使用带自定义选项的 `XToOpenApi` 类

需要显式控制已注册适配器和 [`ConvertOptions`](/docs/zh-CN/x-to-openapi/api-reference/#convertoptions) 时，使用此类。

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

### 注册多个适配器并使用 `"auto"`

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. 诊断与严格模式

默认情况下，转换过程将问题收集为 [`Diagnostic`](/docs/zh-CN/x-to-openapi/api-reference/) 条目，并仍然返回结果。设置 `strict: true` 后，遇到首个错误级别诊断时会抛出 [`ConversionError`](/docs/zh-CN/x-to-openapi/api-reference/#conversionerror)。

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

## 下一步

- [示例](/docs/zh-CN/x-to-openapi/examples/) — 批量 curl、路径参数推断、Postman 鉴权和自定义适配器。
- [API 参考](/docs/zh-CN/x-to-openapi/api-reference/) — 所有导出项、选项与诊断代码。
