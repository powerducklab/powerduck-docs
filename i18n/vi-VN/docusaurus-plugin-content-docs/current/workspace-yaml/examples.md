---
sidebar_position: 5
title: "Ví dụ"
description: "Xử lý lỗi, đọc tệp hiện có bằng conf-patch và sử dụng trong trình duyệt."
---

# Ví dụ

## Xử lý lỗi

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

## Đọc và cập nhật tệp hiện có

Thư viện này chỉ dùng để **khởi tạo** tệp. Để đọc, áp dụng bản vá hoặc cập nhật tệp hiện có, hãy dùng `@powerduck/conf-patch`:

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

## Tạo nội dung trong trình duyệt

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
