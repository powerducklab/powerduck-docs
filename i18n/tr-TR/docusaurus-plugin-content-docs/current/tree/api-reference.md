---
sidebar_position: 4
title: "API başvuru kaynağı"
description: "Tree bileşeni özellikleri, bağdaştırıcılar, çekirdek yardımcıları ve komutla kontrol yöntemleri."
---

# API başvuru kaynağı

## Çekirdek: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## Bağdaştırıcılar

### `buildOpenApiTree(document, options?)`

OpenAPI gezinme ağacı oluşturur.

| Seçenek | Tür | Varsayılan | Açıklama |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | Etkinleştirildiğinde `x-internal` veya `x-scalar-ignore` işaretli düğümleri gösterir |
| `showComponents` | `boolean` | `true` | Bileşenler bölümünü gösterir |
| `showWebhooks` | `boolean` | `true` | Webhook’ları gösterir |
| `defaultExpandDepth` | `number` | `2` | Varsayılan genişletme derinliği |

Gezinme önceliği: OAS 3.2’nin yerel iç içe etiketleri → `x-tagGroups` → düz etiketler.

### `buildSchemaTree(schema, options?)`

| Seçenek | Tür | Varsayılan | Açıklama |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | En fazla iç içe geçme derinliği |
| `showDeprecated` | `boolean` | `true` | Kullanımdan kaldırılan özellikleri gösterir |
| `expandCombinators` | `boolean` | `true` | oneOf/anyOf/allOf öğelerini genişletir |
| `showArrayItems` | `boolean` | `true` | Dizi öğelerini genişletir |

### `buildDocTree(document, options?)`

Her işlemin parametreleri, istek gövdesini ve yanıtları göstermek üzere genişlediği Stripe tarzı belge ağacı.

## React `<Tree />` bileşeni

### Temel özellikler

| Özellik | Tür | Varsayılan | Açıklama |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | gerekli | Görüntülenecek kök düğümler |
| `onSelect` | `(node) => void` | — | Düğüm seçildiğinde çağrılır |
| `searchable` | `boolean` | `false` | Arama alanını gösterir |
| `defaultExpandDepth` | `number` | `1` | İlk genişletme derinliği |
| `showExpandAll` | `boolean` | `false` | Tümünü genişlet/daralt düğmesi |
| `draggable` | `boolean` | `false` | Sürükle bırak ile sıralamayı etkinleştirir |
| `onReorder` | `(result: ReorderResult) => void` | — | Aynı üst öğe içinde sıralama değiştiğinde çağrılır |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | Düzeyler arası taşımada çağrılır |
| `canDrag` | `(node) => boolean` | — | Sürüklenebilir düğümleri belirler |
| `canDrop` | `(dragged, target, position) => boolean` | — | İzin verilen bırakma hedeflerini belirler |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | Sağ tıklama menüsü öğeleri |
| `onPatch` | `(ops, context) => void` | — | Yeniden sıralamada RFC 6902 yama işlemleri |
| `maxHeight` | `number \| string` | — | Kaydırmadan önceki en fazla yükseklik |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | Boyut seçeneği |

### Komutla kontrol (ref aracılığıyla)

| Yöntem | Açıklama |
|--------|-------------|
| `expandAll()` | Tüm düğümleri genişletir |
| `collapseAll()` | Tüm düğümleri daraltır |
| `expandToDepth(depth)` | Belirli derinliğe kadar genişletir |
| `getExpandedIds()` | Genişletilmiş düğüm kimliklerini getirir |
| `getSelectedNode()` | Seçili düğümü getirir |
| `scrollToNode(id)` | Düğümü görünür alana kaydırır |
| `locateNode(predicate)` | Düğümü bulur, üst düğümleri genişletir, seçer ve görünür alana kaydırır |

## Çekirdek yardımcıları

| İşlev | Açıklama |
|----------|-------------|
| `findNode(nodes, id)` | Kimliğe göre düğüm bulur |
| `findPath(nodes, id)` | Kökten başlayan tam yolu bulur |
| `getLeaves(nodes)` | Tüm yaprak düğümleri getirir |
| `countNodes(nodes)` | Tüm düğümleri sayar |
| `filterTree(nodes, { query })` | Arama sorgusuna göre filtreler |
| `flattenTree(nodes)` | Önce kök sırasıyla düz listeye dönüştürür |
| `updateNode(nodes, id, updater)` | Asıl veriyi değiştirmeden düğümü günceller |
| `removeNode(nodes, id)` | Asıl veriyi değiştirmeden düğümü kaldırır |
