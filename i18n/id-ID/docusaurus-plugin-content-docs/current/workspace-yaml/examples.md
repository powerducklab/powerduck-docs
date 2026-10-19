---
sidebar_position: 5
title: "Contoh"
description: "Penanganan kesalahan, pembacaan berkas yang sudah ada dengan conf-patch, dan penggunaan di browser."
---

# Contoh

## Penanganan kesalahan

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

## Membaca dan memperbarui berkas yang sudah ada

Pustaka ini hanya **menginisialisasi** berkas. Untuk membaca, menerapkan patch, atau memperbarui berkas yang sudah ada, gunakan `@powerduck/conf-patch`:

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

## Menghasilkan konten di browser

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
