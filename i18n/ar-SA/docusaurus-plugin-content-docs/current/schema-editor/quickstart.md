---
sidebar_position: 3
title: "البدء السريع"
description: "اعرض محرر Monaco يستند إلى مخطط لتحرير JSON أو YAML أو JavaScript."
---

# البدء السريع

```tsx
import { useState } from "react";
import { SchemaEditor } from "@powerduck/schema-editor/react";

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    port: { type: "number", minimum: 1024, maximum: 65535 },
    debug: { type: "boolean", enum: [true, false] },
  },
  required: ["name"],
};

function MyEditor() {
  const [value, setValue] = useState('{"name": "app"}');

  return (
    <div style={{ height: 400 }}>
      <SchemaEditor
        value={value}
        onChange={setValue}
        language="json"
        schema={schema}
        theme="light"
      />
    </div>
  );
}
```

## وضع YAML

```tsx
<SchemaEditor
  value={yamlValue}
  onChange={setYamlValue}
  language="yaml"
  schema={openApiSchema}
  theme="dark"
/>
```

## وضع مقتطفات JavaScript

```tsx
<SchemaEditor
  value={jsValue}
  onChange={setJsValue}
  language="javascript"
  snippets={[
    'pm.test("Status is 200", () => { pm.response.to.have.status(200); });',
    "const json = pm.response.json();",
  ]}
/>
```
