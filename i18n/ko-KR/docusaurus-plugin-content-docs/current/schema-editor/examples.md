---
sidebar_position: 5
title: "예제"
description: "여러 편집기를 나란히 배치하고, 읽기 전용 모드와 사용자 정의 스키마를 사용하는 예제입니다."
---

# 예제

## 여러 편집기

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

## 읽기 전용 뷰어

```tsx
<SchemaEditor
  value={documentContent}
  language="yaml"
  readOnly
  showDiagnostics={false}
/>
```

## OpenAPI 스키마 사용

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
