---
sidebar_position: 3
title: "快速入門"
description: "建立 OpenAPI 導覽樹，並使用 React Tree 元件顯示。"
---

# 快速入門

## API 導覽樹

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

## 結構描述導覽樹

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

## 自訂資料來源

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
