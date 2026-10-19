---
sidebar_position: 4
title: "Referensi API"
description: "Prop komponen Tree, adaptor, utilitas inti, dan metode kontrol imperatif."
---

# Referensi API

## Inti: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## Adaptor

### `buildOpenApiTree(document, options?)`

Membangun pohon navigasi OpenAPI.

| Opsi | Tipe | Nilai bawaan | Deskripsi |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | Menampilkan simpul bertanda `x-internal` atau `x-scalar-ignore` jika diaktifkan |
| `showComponents` | `boolean` | `true` | Menampilkan bagian komponen |
| `showWebhooks` | `boolean` | `true` | Menampilkan webhook |
| `defaultExpandDepth` | `number` | `2` | Kedalaman perluasan bawaan |

Prioritas navigasi: tag bertingkat bawaan OAS 3.2 → `x-tagGroups` → tag datar.

### `buildSchemaTree(schema, options?)`

| Opsi | Tipe | Nilai bawaan | Deskripsi |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | Kedalaman penyarangan maksimum |
| `showDeprecated` | `boolean` | `true` | Menampilkan properti usang |
| `expandCombinators` | `boolean` | `true` | Memperluas oneOf/anyOf/allOf |
| `showArrayItems` | `boolean` | `true` | Memperluas item array |

### `buildDocTree(document, options?)`

Pohon dokumentasi bergaya Stripe; tiap operasi diperluas untuk menampilkan parameter, isi permintaan, dan respons.

## Komponen React `<Tree />`

### Prop utama

| Prop | Tipe | Nilai bawaan | Deskripsi |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | wajib | Simpul akar yang dirender |
| `onSelect` | `(node) => void` | — | Dipanggil saat simpul dipilih |
| `searchable` | `boolean` | `false` | Menampilkan kolom pencarian |
| `defaultExpandDepth` | `number` | `1` | Kedalaman perluasan awal |
| `showExpandAll` | `boolean` | `false` | Tombol perluas/ciutkan semua |
| `draggable` | `boolean` | `false` | Mengaktifkan pengurutan dengan seret dan lepas |
| `onReorder` | `(result: ReorderResult) => void` | — | Dipanggil saat mengubah urutan di bawah induk yang sama |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | Dipanggil saat memindahkan antar tingkat |
| `canDrag` | `(node) => boolean` | — | Mengontrol simpul yang dapat diseret |
| `canDrop` | `(dragged, target, position) => boolean` | — | Mengontrol target pelepasan yang diizinkan |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | Item menu klik kanan |
| `onPatch` | `(ops, context) => void` | — | Operasi patch RFC 6902 saat pengurutan |
| `maxHeight` | `number \| string` | — | Tinggi maksimum sebelum menggulir |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | Varian ukuran |

### Kontrol imperatif (melalui ref)

| Metode | Deskripsi |
|--------|-------------|
| `expandAll()` | Memperluas semua simpul |
| `collapseAll()` | Menciutkan semua simpul |
| `expandToDepth(depth)` | Memperluas hingga kedalaman tertentu |
| `getExpandedIds()` | Mengambil ID simpul yang sedang diperluas |
| `getSelectedNode()` | Mengambil simpul yang dipilih |
| `scrollToNode(id)` | Menggulir simpul ke area tampilan |
| `locateNode(predicate)` | Mencari simpul, membuka leluhurnya, memilihnya, dan menggulirnya ke area tampilan |

## Utilitas inti

| Fungsi | Deskripsi |
|----------|-------------|
| `findNode(nodes, id)` | Mencari simpul berdasarkan ID |
| `findPath(nodes, id)` | Mencari jalur lengkap dari akar |
| `getLeaves(nodes)` | Mengambil semua simpul daun |
| `countNodes(nodes)` | Menghitung semua simpul |
| `filterTree(nodes, { query })` | Memfilter berdasarkan kueri pencarian |
| `flattenTree(nodes)` | Meratakan menjadi daftar pre-order |
| `updateNode(nodes, id, updater)` | Memperbarui simpul tanpa mengubah data asli |
| `removeNode(nodes, id)` | Menghapus simpul tanpa mengubah data asli |
