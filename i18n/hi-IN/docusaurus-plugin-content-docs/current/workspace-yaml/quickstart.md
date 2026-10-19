---
sidebar_position: 3
title: "त्वरित शुरुआत"
description: "एक ही कॉल से कार्यक्षेत्र और OpenAPI YAML फ़ाइल तैयार करें।"
---

# त्वरित शुरुआत

## Node.js / Electron

```typescript
import { createWorkspaceApi } from "@powerduck/workspace-yaml";

const { workspaceFilePath, openApiFilePath } = await createWorkspaceApi({
  workspaceDirectory: "./my-project",
  oasId: "users-api",
  name: "Users API",
  title: "Users API Documentation",
  version: "1.0.0",
});

console.log("Workspace:", workspaceFilePath);
console.log("OpenAPI:", openApiFilePath);
```

## ब्राउज़र (फ़ाइल सिस्टम के बिना)

```typescript
import { createWorkspaceYaml, createOpenApiYaml } from "@powerduck/workspace-yaml/core";

// Generate YAML content strings — save to IndexedDB, localStorage, or send to an API
const workspaceContent = createWorkspaceYaml();
const openApiContent = createOpenApiYaml({ title: "My API" });
```
