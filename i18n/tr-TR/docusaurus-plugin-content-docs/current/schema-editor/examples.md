---
sidebar_position: 5
title: "Örnekler"
description: "Yan yana birden fazla düzenleyici, salt okunur mod ve özel şemalar."
---

# Örnekler

## Birden fazla düzenleyici

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

## Salt okunur görüntüleyici

```tsx
<SchemaEditor
  value={documentContent}
  language="yaml"
  readOnly
  showDiagnostics={false}
/>
```

## OpenAPI şeması kullanma

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
