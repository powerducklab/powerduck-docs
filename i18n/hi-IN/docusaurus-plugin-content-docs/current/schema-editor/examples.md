---
sidebar_position: 5
title: "उदाहरण"
description: "एक साथ कई एडिटर, केवल-पढ़ने का मोड और कस्टम स्कीमा के उदाहरण।"
---

# उदाहरण

## कई एडिटर

```tsx
import { useState } from "react";
import { SchemaEditor } from "@powerduck/schema-editor/react";

function MultiEditor({ schema }) {
  const [json, setJson] = useState("{}");
  const [yaml, setYaml] = useState("");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, height: "100vh" }}>
      <SchemaEditor value={json} onChange={setJson} language="json" schema={schema} theme="light" />
      <SchemaEditor value={yaml} onChange={setYaml} language="yaml" schema={schema} theme="dark" />
    </div>
  );
}
```

## केवल-पढ़ने वाला व्यूअर

```tsx
<SchemaEditor
  value={documentContent}
  language="yaml"
  readOnly
  showDiagnostics={false}
/>
```

## OpenAPI स्कीमा का उपयोग करें

```tsx
const openApiSchema = {
  type: "object",
  required: ["openapi", "info", "paths"],
  properties: {
    openapi: { type: "string", enum: ["3.0.0", "3.1.0", "3.2.0"] },
    info: {
      type: "object",
      required: ["title", "version"],
      properties: {
        title: { type: "string" },
        version: { type: "string" },
      },
    },
    paths: { type: "object" },
  },
};

<SchemaEditor
  value={specText}
  onChange={setSpecText}
  language="yaml"
  schema={openApiSchema}
/>
```
