---
sidebar_position: 4
title: "API 참조"
description: "Tree 컴포넌트 속성, 어댑터, 코어 유틸리티 및 명령형 핸들 메서드."
---

# API 참조

## 코어: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## 어댑터

### `buildOpenApiTree(document, options?)`

OpenAPI 탐색 트리를 생성합니다.

| 옵션 | 타입 | 기본값 | 설명 |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | 활성화하면 `x-internal` 또는 `x-scalar-ignore`로 표시된 노드 표시 |
| `showComponents` | `boolean` | `true` | 컴포넌트 섹션 표시 |
| `showWebhooks` | `boolean` | `true` | 웹훅 표시 |
| `defaultExpandDepth` | `number` | `2` | 기본 펼침 깊이 |

탐색 우선순위: OAS 3.2 기본 중첩 태그 → `x-tagGroups` → 평면 태그.

### `buildSchemaTree(schema, options?)`

| 옵션 | 타입 | 기본값 | 설명 |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | 최대 중첩 깊이 |
| `showDeprecated` | `boolean` | `true` | 사용 중단된 속성 표시 |
| `expandCombinators` | `boolean` | `true` | oneOf/anyOf/allOf 펼치기 |
| `showArrayItems` | `boolean` | `true` | 배열 항목 펼치기 |

### `buildDocTree(document, options?)`

각 작업을 펼치면 매개변수, 요청 본문 및 응답을 보여 주는 Stripe 스타일 문서 트리.

## React `<Tree />` 컴포넌트

### 주요 속성

| 속성 | 타입 | 기본값 | 설명 |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | 필수 | 렌더링할 루트 노드 |
| `onSelect` | `(node) => void` | — | 노드가 선택될 때 호출 |
| `searchable` | `boolean` | `false` | 검색 입력 표시 |
| `defaultExpandDepth` | `number` | `1` | 초기 펼침 깊이 |
| `showExpandAll` | `boolean` | `false` | 모두 펼치기/접기 전환 |
| `draggable` | `boolean` | `false` | 드래그 앤 드롭 순서 변경 활성화 |
| `onReorder` | `(result: ReorderResult) => void` | — | 같은 부모 내에서 순서를 변경할 때 호출 |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | 계층 간 이동 시 호출 |
| `canDrag` | `(node) => boolean` | — | 드래그할 수 있는 노드 제어 |
| `canDrop` | `(dragged, target, position) => boolean` | — | 허용되는 드롭 대상 제어 |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | 오른쪽 클릭 메뉴 항목 |
| `onPatch` | `(ops, context) => void` | — | 순서 변경 시 RFC 6902 패치 작업 |
| `maxHeight` | `number \| string` | — | 스크롤이 생기기 전 최대 높이 |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | 크기 옵션 |

### 명령형 핸들(ref 사용)

| 메서드 | 설명 |
|--------|-------------|
| `expandAll()` | 모든 노드 펼치기 |
| `collapseAll()` | 모든 노드 접기 |
| `expandToDepth(depth)` | 지정한 깊이까지 펼치기 |
| `getExpandedIds()` | 현재 펼쳐진 노드 ID 가져오기 |
| `getSelectedNode()` | 현재 선택된 노드 가져오기 |
| `scrollToNode(id)` | 노드가 보이도록 스크롤 |
| `locateNode(predicate)` | 노드를 찾아 상위 노드를 펼치고 선택한 뒤 보이는 위치로 스크롤 |

## 코어 유틸리티

| 함수 | 설명 |
|----------|-------------|
| `findNode(nodes, id)` | ID로 노드 찾기 |
| `findPath(nodes, id)` | 루트부터 전체 경로 찾기 |
| `getLeaves(nodes)` | 모든 리프 노드 가져오기 |
| `countNodes(nodes)` | 전체 노드 수 계산 |
| `filterTree(nodes, { query })` | 검색어로 필터링 |
| `flattenTree(nodes)` | 전위 순회 목록으로 평탄화 |
| `updateNode(nodes, id, updater)` | 원본을 변경하지 않고 노드 업데이트 |
| `removeNode(nodes, id)` | 원본을 변경하지 않고 노드 삭제 |
