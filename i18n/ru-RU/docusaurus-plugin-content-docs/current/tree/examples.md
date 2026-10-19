---
sidebar_position: 5
title: "Примеры"
description: "Перетаскивание, контекстные меню, императивный поиск и интеграция JSON Patch."
---

# Примеры

## Перетаскивание

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

Зоны перетаскивания на узле-ветви:
- **Верхние 25 %** — вставить перед узлом (изменить порядок)
- **Средние 50 %** — переместить в эту папку (между уровнями)
- **Нижние 25 %** — вставить после узла (изменить порядок)

## Императивный поиск

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

## Контекстное меню

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

## Интеграция JSON Patch

Если метаданные узлов содержат `jsonPath`, дерево передаёт операции RFC 6902 через `onPatch`:

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
