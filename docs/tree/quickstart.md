---
sidebar_position: 3
title: "Quickstart"
description: "Build an OpenAPI navigation tree and render it with the React Tree component."
---

# Quickstart

## API navigation tree

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

## Schema navigation tree

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

## Custom data source

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
