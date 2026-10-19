---
sidebar_position: 4
title: "Referensi API"
description: "Prop OasDocument, hook useOasDocument, dan fungsi inti."
---

# Referensi API

## `<OasDocument />` — Prop

| Prop | Tipe | Nilai bawaan | Deskripsi |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | wajib | Dokumen OpenAPI/Swagger (objek, string JSON, atau string YAML) |
| `autoUpgrade` | `boolean` | `true` | Memvalidasi dan mengonversi ke OAS 3.2 melalui `@powerduck/openapi-parser` |
| `defaultOperationId` | `string` | — | ID operasi yang dipilih saat rendering awal |
| `onOperationChange` | `(operation) => void` | — | Callback saat pengguna mengubah pilihan |
| `className` | `string` | — | Kelas CSS tambahan untuk elemen akar |
| `style` | `React.CSSProperties` | — | Gaya sebaris untuk elemen akar |
| `theme` | `"light" \| "dark"` | `"light"` | Tema awal. Disimpan ke localStorage. |
| `header` | `OasDocumentHeaderConfig` | — | Konfigurasi header (logo, judul, tautan navigasi) |
| `showTree` | `boolean` | `true` | Menampilkan pohon sidebar |
| `treeWidth` | `number` | `340` | Lebar sidebar dalam piksel (240–480) |

### Konfigurasi header

| Kolom | Tipe | Nilai bawaan |
|-------|------|---------|
| `logo` | `string \| ReactNode` | — |
| `title` | `string` | `"API Documentation"` |
| `navItems` | `Array<{ label, href?, onClick? }>` | `[]` |
| `showThemeToggle` | `boolean` | `true` |

## `useOasDocument(input, options?)`

```typescript
const {
  document,          // Oas32Document | null
  loading,           // boolean
  error,             // Error | null
  operations,        // OasOperation[]
  navigationGroups,  // OasNavigationGroup[]
  tree,              // TreeNode[]
  selectedOperation, // OasOperation | undefined
  setSelectedOperation,
  theme,             // "light" | "dark"
  setTheme,
} = useOasDocument(spec, { autoUpgrade: true });
```

## Fungsi inti

| Fungsi | Deskripsi |
|----------|-------------|
| `loadOasDocument(input, options?)` | Memuat dan mengonversi dokumen. Mengembalikan `{ document, operations, navigationGroups, tree, warnings, error }` |
| `parseOperations(document)` | Mengekstrak operasi dari dokumen OAS |
| `buildNavigationGroups(document)` | Membangun struktur navigasi berkelompok |
