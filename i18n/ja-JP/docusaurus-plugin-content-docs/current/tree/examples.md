---
sidebar_position: 5
title: "使用例"
description: "ドラッグ＆ドロップ、コンテキストメニュー、命令的な位置指定、JSON Patch 連携の使用例です。"
---

# 使用例

## ドラッグ＆ドロップ

```tsx
import { useState } from "react";
import { Tree } from "@powerduck/tree/react";
import type { ReorderResult } from "@powerduck/tree/core";

function SortableTree({ initialNodes }) {
  const [nodes, setNodes] = useState(initialNodes);

  return (
    <Tree
      nodes={nodes}
      draggable
      onReorder={(result: ReorderResult) => setNodes(result.nodes)}
    />
  );
}
```

分岐ノードのドロップ領域：
- **上部 25%** — 前に挿入（並べ替え）
- **中央 50%** — このフォルダーへ移動（階層をまたぐ移動）
- **下部 25%** — 後ろに挿入（並べ替え）

## 命令的な位置指定

```tsx
import { useRef } from "react";
import { Tree } from "@powerduck/tree/react";
import type { TreeHandle } from "@powerduck/tree/react";

function TreeWithLocate({ nodes }) {
  const treeRef = useRef<TreeHandle>(null);

  const locateById = (operationId: string) => {
    treeRef.current?.locateNode(
      (node) => node.metadata?.operationId === operationId
    );
  };

  return (
    <>
      <button onClick={() => locateById("getPet")}>Locate getPet</button>
      <Tree ref={treeRef} nodes={nodes} />
    </>
  );
}
```

## コンテキストメニュー

```tsx
import { LuCopy, LuTrash2 } from "react-icons/lu";
import { Tree } from "@powerduck/tree/react";
import type { ContextMenuItem } from "@powerduck/tree/react";

function ApiTree({ nodes }) {
  const buildMenu = (node): ContextMenuItem[] => [
    {
      label: "Copy operationId",
      icon: <LuCopy size={14} />,
      onClick: (n) => navigator.clipboard.writeText(n.metadata?.operationId ?? ""),
    },
    { separator: true, label: "" },
    {
      label: "Delete",
      icon: <LuTrash2 size={14} />,
      danger: true,
      onClick: (n) => console.log("Delete", n.id),
    },
  ];

  return <Tree nodes={nodes} contextMenuItems={buildMenu} />;
}
```

## JSON Patch 連携

ノードのメタデータに `jsonPath` がある場合、ツリーは `onPatch` 経由で RFC 6902 操作を通知します：

```tsx
import { patchContent } from "@powerduck/conf-patch/core";
import { Tree } from "@powerduck/tree/react";

function EditableTree({ nodes, format }) {
  const handlePatch = (ops) => {
    // Apply patch operations to your document string.
    const updated = patchContent(documentString, ops, format);
  };

  return (
    <Tree
      nodes={nodes}
      draggable
      onPatch={handlePatch}
    />
  );
}
```
