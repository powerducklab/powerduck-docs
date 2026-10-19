---
sidebar_position: 3
title: "快速入門"
description: "使用 @powerduck/openapi-codegen 產生可執行的請求範例，並查看可用的程式碼產生器。"
---

# 快速入門

本指南說明如何產生第一個可執行的請求範例，以及如何尋找可用的產生器。

## 1. 安裝

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. 從文件產生程式碼

傳入**已剖析的** OpenAPI 文件，以及目標 `path`、`method`、`language` 和 `client`。`generate()` 會傳回原始碼字串。

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

對應的 CommonJS 寫法：

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

## 3. 列出可用的產生器

`list()` 會傳回所有已註冊產生器的描述資訊：

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

每個描述物件的格式為 `{ language: string; client: string }`。識別碼區分大小寫，請使用 API 參考的產生器清單中列出的確切值。 [API 參考](/docs/zh-TW/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

也可以透過程式碼選擇產生器：

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

## 4. 提供認證資訊

使用 `securityValues` 為具名的安全配置提供值。索引鍵必須與文件中的安全配置名稱一致：

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

## 5. 覆寫伺服器 URL

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

## 錯誤處理

缺少輸入或產生器不受支援時，`generate()` 會擲回例外。處理不受信任的文件時，請捕捉呼叫的例外：

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

## 後續步驟

- [設定](/docs/zh-TW/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [範例](/docs/zh-TW/openapi-codegen/examples/) — JavaScript fetch、Python requests、cURL、自訂產生器、外掛程式，以及直接使用 `RequestIR`。
- [API 參考](/docs/zh-TW/openapi-codegen/api-reference/) — 所有匯出項目。
