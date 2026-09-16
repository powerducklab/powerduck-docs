---
sidebar_position: 3
title: "Quickstart"
description: "Drop in the OasDocument component with a spec object."
---

# Quickstart

```tsx
import { OasDocument } from "@powerduck/oas-document/react";
import "@powerduck/oas-document/react/index.css";

const spec = {
  openapi: "3.1.0",
  info: { title: "My API", version: "1.0.0" },
  paths: {
    "/users": {
      get: {
        summary: "List users",
        operationId: "listUsers",
        tags: ["Users"],
        responses: { "200": { description: "A list of users" } },
      },
    },
  },
};

export default function App() {
  return <OasDocument input={spec} style={{ height: "100vh" }} />;
}
```

## With header configuration

```tsx
<OasDocument
  input={spec}
  header={{
    logo: "https://example.com/logo.svg",
    title: "My API Docs",
    navItems: [
      { label: "Home", href: "/" },
      { label: "GitHub", href: "https://github.com/org/repo" },
    ],
    showThemeToggle: true,
  }}
  treeWidth={340}
/>
```

## Using the hook directly

```tsx
import { useOasDocument } from "@powerduck/oas-document/react";

function MyDocs({ spec }) {
  const { document, loading, error, operations, tree, selectedOperation, theme, setTheme } =
    useOasDocument(spec, { autoUpgrade: true });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* custom render */}</div>;
}
```
