---
sidebar_position: 5
title: "使用例"
description: "エラー処理、conf-patch による既存ファイルの読み込み、ブラウザーでの使用方法を紹介します。"
---

# 使用例

## エラー処理

```typescript
import { createWorkspaceApi, WorkspaceYamlError } from "@powerduck/workspace-yaml";

try {
  await createWorkspaceApi({
    workspaceDirectory: "./my-project",
    oasId: "my-api",
    name: "My API",
  });
} catch (error) {
  if (error instanceof WorkspaceYamlError) {
    console.error(`Error [${error.code}]: ${error.message}`);
    console.error(`File: ${error.filePath}`);
  }
}
```

## 既存ファイルの読み込みと更新

このライブラリはファイルの**初期化**専用です。既存ファイルの読み込み、パッチ適用、更新には `@powerduck/conf-patch` を使用してください。

```typescript
import { readConfigFile, setConfigValue, patchConfigFile } from "@powerduck/conf-patch";

// Read
const workspace = await readConfigFile("./my-project/workspace.yaml");

// Update a single value
await setConfigValue("./my-project/workspace.yaml", ["activeOasFileId"], "new-api");

// Batch patch (RFC 6902)
await patchConfigFile("./my-project/workspace.yaml", [
  { op: "add", path: ["oasFiles", "-"], value: { id: "new-api", name: "New API", file: "..." } },
]);
```

## ブラウザーでコンテンツを生成する

```typescript
import { createOpenApiYaml } from "@powerduck/workspace-yaml/core";

const yaml = createOpenApiYaml({
  title: "My API",
  version: "2.0.0",
  description: "A production-ready API.",
  servers: [{ url: "https://api.example.com", description: "Production" }],
});

// Send to an API, save to IndexedDB, or display in a textarea
console.log(yaml);
```
