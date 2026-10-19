---
sidebar_position: 5
title: "उदाहरण"
description: "त्रुटि प्रबंधन, conf-patch से मौजूदा फ़ाइलें पढ़ना और ब्राउज़र में उपयोग करना।"
---

# उदाहरण

## त्रुटि प्रबंधन

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

## मौजूदा फ़ाइलें पढ़ें और अपडेट करें

यह लाइब्रेरी केवल फ़ाइलों को **शुरुआती रूप से तैयार** करती है। मौजूदा फ़ाइलों को पढ़ने, पैच लगाने या अपडेट करने के लिए `@powerduck/conf-patch` का उपयोग करें:

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

## ब्राउज़र में सामग्री बनाएँ

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
