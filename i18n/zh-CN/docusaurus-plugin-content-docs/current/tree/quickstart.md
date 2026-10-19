---
sidebar_position: 3
title: "快速开始"
description: "构建 OpenAPI 导航树，并使用 React Tree 组件渲染。"
---

# 快速开始

## API 导航树

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

## 模式导航树

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

## 自定义数据源

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
