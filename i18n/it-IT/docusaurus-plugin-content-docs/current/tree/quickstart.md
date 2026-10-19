---
sidebar_position: 3
title: "Guida rapida"
description: "Crea un albero di navigazione OpenAPI e visualizzalo con il componente React Tree."
---

# Guida rapida

## Albero di navigazione dell’API

```tsx
import { useMemo } from "react";
import { buildOpenApiTree } from "@powerduck/tree";
import { Tree } from "@powerduck/tree/react";

function ApiNav({ document }) {
  const { root } = useMemo(() => buildOpenApiTree(document), [document]);

  return (
    <div style={{ width: 320, height: "100%" }}>
      <Tree
        nodes={root.children ?? []}
        onSelect={(node) => console.log(node.metadata?.method, node.metadata?.path)}
        searchable
        showExpandAll
        defaultExpandDepth={2}
      />
    </div>
  );
}
```

## Albero di navigazione dello schema

```tsx
import { buildSchemaTree } from "@powerduck/tree";
import { Tree } from "@powerduck/tree/react";

function SchemaNav({ schema }) {
  const { root } = useMemo(() => buildSchemaTree(schema), [schema]);

  return (
    <Tree
      nodes={root.children ?? []}
      searchable
      defaultExpandDepth={3}
    />
  );
}
```

## Origine dati personalizzata

```tsx
import { Tree } from "@powerduck/tree/react";
import type { TreeNode } from "@powerduck/tree/core";

const files: TreeNode<{ type: "folder" | "file" }>[] = [
  {
    id: "src",
    name: "src",
    metadata: { type: "folder" },
    children: [
      { id: "src/index.ts", name: "index.ts", metadata: { type: "file" } },
    ],
  },
];

function FileTree() {
  return <Tree nodes={files} searchable defaultExpandDepth={1} />;
}
```
