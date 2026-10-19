---
sidebar_position: 3
title: "Démarrage rapide"
description: "Créez un arbre de navigation OpenAPI et affichez-le avec le composant React Tree."
---

# Démarrage rapide

## Arbre de navigation de l’API

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

## Arbre de navigation du schéma

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

## Source de données personnalisée

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
