---
sidebar_position: 3
title: "快速开始"
description: "使用 @powerduck/openapi-codegen 生成可执行的请求示例，并查看可用的代码生成器。"
---

# 快速开始

本指南介绍如何生成第一个可执行的请求示例，以及如何查找可用的生成器。

## 1. 安装

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. 从文档生成代码

传入**已解析的** OpenAPI 文档，以及目标 `path`、`method`、`language` 和 `client`。`generate()` 返回源代码字符串。

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

对应的 CommonJS 写法：

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. 列出可用生成器

`list()` 返回所有已注册生成器的描述信息：

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

每个描述对象的格式为 `{ language: string; client: string }`。标识符区分大小写，请严格使用 API 参考的生成器列表中给出的值。 [API 参考](/docs/zh-CN/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

也可以通过代码选择生成器：

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. 提供凭据

使用 `securityValues` 为命名的安全方案提供值。键必须与文档中的安全方案名称一致：

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. 覆盖服务器 URL

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## 错误处理

缺少输入或生成器不受支持时，`generate()` 会抛出异常。处理不可信文档时，请捕获调用异常：

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## 下一步

- [配置](/docs/zh-CN/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [示例](/docs/zh-CN/openapi-codegen/examples/) — JavaScript fetch、Python requests、cURL、自定义生成器、插件，以及直接使用 `RequestIR`。
- [API 参考](/docs/zh-CN/openapi-codegen/api-reference/) — 全部导出项。
