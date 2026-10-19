---
sidebar_position: 2
title: "Instalasi"
description: "Instal @powerduck/md-editor melalui npm, yarn, atau pnpm, lalu pelajari jalur impor, dependensi peer, dan dukungan TypeScript."
---

# Instalasi

Instal `@powerduck/md-editor` dengan pengelola paket pilihan Anda.

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## Jalur impor

Paket mendefinisikan ekspor subjalur secara eksplisit dalam `package.json`:

| Jalur impor | Isi |
|---|---|
| `@powerduck/md-editor` | Titik masuk utama: kelas `MarkdownEditor` serta semua helper, tipe, dan fungsi mandiri. |
| `@powerduck/md-editor/react` | Subjalur React: komponen `MarkdownEditorReact` serta tipe `MarkdownEditorProps` dan `MarkdownEditorHandle`. |
| `@powerduck/md-editor/dist/style.css` | Stylesheet editor yang sudah dikompilasi; wajib diimpor satu kali. |
| `@powerduck/md-editor/styles/tokens.css` | Properti kustom CSS token desain dalam bentuk asli. |

Paket diterbitkan sebagai modul ECMAScript (`"type": "module"`) dengan dua build: `dist/index.mjs` (ESM) dan `dist/index.cjs` (CommonJS). Deklarasi tipe tersedia di `dist/index.d.ts`.

```ts
// Vanilla JS main entry
import { MarkdownEditor, renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';
```

```tsx
// React subpath
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';
```

## Dependensi peer

`react` dan `react-dom` merupakan dependensi peer **opsional** (`>=17`). Keduanya hanya diperlukan jika Anda mengimpor subjalur `./react`:

```bash
npm install react react-dom
```

Kelas `MarkdownEditor` tanpa framework dan fungsi mandiri `renderMarkdown` tidak bergantung pada React, sehingga dapat dipakai di proyek browser apa pun tanpa menginstalnya.

## Dukungan TypeScript

Paket menyertakan deklarasi tipenya sendiri; paket `@types/*` tambahan tidak diperlukan. Titik masuk utama mengekspor `MarkdownEditorOptions`, `EditorMode`, `EditorTheme`, `ToolbarConfig`, `RendererOptions`, dan semua tipe helper. Subjalur `./react` mengekspor `MarkdownEditorProps` dan `MarkdownEditorHandle`.

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## Efek samping CSS

File `*.css` ditandai sebagai efek samping dalam `package.json` agar bundler tidak menghapusnya melalui tree-shaking. Impor `dist/style.css` sekali pada titik masuk aplikasi; file ini mencakup antarmuka editor, pratinjau melalui `github-markdown-css`, gaya KaTeX, dan semua gaya plugin.

## Langkah berikutnya

- [Mulai cepat](/docs/id-ID/md-editor/quickstart/) — pasang editor pertama Anda.
- [Konfigurasi](/docs/id-ID/md-editor/configuration/) — semua opsi `MarkdownEditorOptions`.
