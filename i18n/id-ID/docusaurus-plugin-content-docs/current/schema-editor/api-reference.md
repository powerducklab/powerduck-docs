---
sidebar_position: 4
title: "Referensi API"
description: "Prop SchemaEditor, ekspor inti, dan tipe bahasa editor."
---

# Referensi API

## `<SchemaEditor />` — Prop

| Prop | Tipe | Nilai bawaan | Deskripsi |
|------|------|---------|-------------|
| `value` | `string` | wajib | Konten editor |
| `onChange` | `(value: string) => void` | — | Dipanggil saat konten berubah |
| `language` | `"json" \| "yaml" \| "javascript"` | wajib | Bahasa konten |
| `schema` | `JsonSchema` | — | JSON Schema untuk pelengkapan dan diagnostik (json/yaml) |
| `snippets` | `string[]` | — | String cuplikan untuk pelengkapan teks bayangan JavaScript |
| `theme` | `"light" \| "dark"` | `"light"` | Tema visual |
| `readOnly` | `boolean` | `false` | Menonaktifkan pengeditan |
| `placeholder` | `string` | — | Teks petunjuk saat konten kosong |
| `showDiagnostics` | `boolean` | `true` | Menampilkan bilah status diagnostik |
| `enableInlineSuggestions` | `boolean` | `true` | Mengaktifkan teks bayangan |
| `enableCompletion` | `boolean` | `true` | Mengaktifkan pelengkapan pop-up |
| `diagnosticsDebounceMs` | `number` | `250` | Jeda debounce diagnostik |

## Ekspor inti (`@powerduck/schema-editor`)

| Fungsi | Deskripsi |
|----------|-------------|
| `resolveSchemas(document)` | Menyelesaikan penunjuk `$ref` dalam dokumen skema |
| `validateSchema(data, schema)` | Memvalidasi data berdasarkan skema |
| `generateSample(schema)` | Menghasilkan data contoh dari JSON Schema |
| `getCompletionItems(model, position)` | Mengambil item pelengkapan pada posisi kursor |

## Tipe

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
