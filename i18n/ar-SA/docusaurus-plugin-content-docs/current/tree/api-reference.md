---
sidebar_position: 4
title: "مرجع API"
description: "خصائص مكوّن Tree ومحولاته وأدواته الأساسية وطرق التحكم البرمجي."
---

# مرجع API

## الوحدة الأساسية: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## المحولات

### `buildOpenApiTree(document, options?)`

يبني شجرة تنقل OpenAPI.

| الخيار | النوع | القيمة الافتراضية | الوصف |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | يعرض العقد المحددة بـ `x-internal` أو `x-scalar-ignore` عند التمكين |
| `showComponents` | `boolean` | `true` | عرض قسم المكونات |
| `showWebhooks` | `boolean` | `true` | عرض webhooks |
| `defaultExpandDepth` | `number` | `2` | عمق التوسيع الافتراضي |

أولوية التنقل: وسوم OAS 3.2 المتداخلة الأصلية → `x-tagGroups` → وسوم مسطحة.

### `buildSchemaTree(schema, options?)`

| الخيار | النوع | القيمة الافتراضية | الوصف |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | أقصى عمق للتداخل |
| `showDeprecated` | `boolean` | `true` | عرض الخصائص المهجورة |
| `expandCombinators` | `boolean` | `true` | توسيع oneOf/anyOf/allOf |
| `showArrayItems` | `boolean` | `true` | توسيع عناصر المصفوفات |

### `buildDocTree(document, options?)`

شجرة توثيق بأسلوب Stripe تتوسع فيها كل عملية لعرض المعاملات ومتن الطلب والاستجابات.

## مكوّن React `<Tree />`

### الخصائص الأساسية

| الخاصية | النوع | القيمة الافتراضية | الوصف |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | مطلوب | العقد الجذرية المطلوب عرضها |
| `onSelect` | `(node) => void` | — | يُستدعى عند تحديد عقدة |
| `searchable` | `boolean` | `false` | عرض حقل البحث |
| `defaultExpandDepth` | `number` | `1` | عمق التوسيع الأولي |
| `showExpandAll` | `boolean` | `false` | زر لتوسيع الكل أو طيه |
| `draggable` | `boolean` | `false` | تمكين إعادة الترتيب بالسحب والإفلات |
| `onReorder` | `(result: ReorderResult) => void` | — | يُستدعى عند إعادة الترتيب تحت الأصل نفسه |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | يُستدعى عند النقل بين المستويات |
| `canDrag` | `(node) => boolean` | — | تحديد العقد القابلة للسحب |
| `canDrop` | `(dragged, target, position) => boolean` | — | تحديد أهداف الإفلات المسموح بها |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | عناصر قائمة النقر بزر الفأرة الأيمن |
| `onPatch` | `(ops, context) => void` | — | عمليات تصحيح RFC 6902 عند إعادة الترتيب |
| `maxHeight` | `number \| string` | — | أقصى ارتفاع قبل التمرير |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | خيار الحجم |

### التحكم البرمجي (عبر ref)

| الطريقة | الوصف |
|--------|-------------|
| `expandAll()` | توسيع جميع العقد |
| `collapseAll()` | طي جميع العقد |
| `expandToDepth(depth)` | التوسيع إلى عمق محدد |
| `getExpandedIds()` | جلب معرّفات العقد الموسعة حاليًا |
| `getSelectedNode()` | جلب العقدة المحددة حاليًا |
| `scrollToNode(id)` | تمرير عقدة إلى المنطقة المرئية |
| `locateNode(predicate)` | العثور على عقدة وتوسيع أسلافها وتحديدها وإظهارها بالتمرير |

## الأدوات الأساسية

| الدالة | الوصف |
|----------|-------------|
| `findNode(nodes, id)` | العثور على عقدة بالمعرّف |
| `findPath(nodes, id)` | العثور على المسار الكامل من الجذر |
| `getLeaves(nodes)` | جلب جميع العقد الطرفية |
| `countNodes(nodes)` | عد جميع العقد |
| `filterTree(nodes, { query })` | التصفية باستعلام البحث |
| `flattenTree(nodes)` | تحويل الشجرة إلى قائمة باجتياز سابق الترتيب |
| `updateNode(nodes, id, updater)` | تحديث عقدة دون تعديل البيانات الأصلية |
| `removeNode(nodes, id)` | إزالة عقدة دون تعديل البيانات الأصلية |
