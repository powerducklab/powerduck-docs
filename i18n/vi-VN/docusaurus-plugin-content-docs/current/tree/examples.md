---
sidebar_position: 5
title: "Ví dụ"
description: "Kéo và thả, menu ngữ cảnh, định vị bằng lệnh và tích hợp JSON Patch."
---

# Ví dụ

## Kéo và thả

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

Các vùng thả trên nút nhánh:
- **25% phía trên** — chèn trước (sắp xếp lại)
- **50% ở giữa** — chuyển vào thư mục này (khác cấp)
- **25% phía dưới** — chèn sau (sắp xếp lại)

## Định vị bằng lệnh

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

## Menu ngữ cảnh

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

## Tích hợp JSON Patch

Khi siêu dữ liệu của nút chứa `jsonPath`, cây phát các thao tác RFC 6902 qua `onPatch`:

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
