---
sidebar_position: 4
title: "Konfigurasi"
description: "Konstruktor MarkdownEditor menerima elemen penampung atau selector, lalu objek MarkdownEditorOptions. Halaman ini menjelaskan tipe, nilai bawaan, dan perilaku setiap bidang beserta tipe opsi terkait."
---

# Konfigurasi

Konstruktor `MarkdownEditor` menerima elemen penampung atau selector, lalu objek `MarkdownEditorOptions`. Halaman ini menjelaskan tipe, nilai bawaan, dan perilaku setiap bidang beserta tipe opsi terkait.

## `MarkdownEditorOptions`

```ts
interface MarkdownEditorOptions {
  value?: string;
  mode?: EditorMode;
  theme?: EditorTheme;
  math?: boolean;
  mindmap?: boolean;
  codeHighlight?: boolean;
  tips?: boolean;
  preview?: boolean;
  onChange?: (value: string) => void;
  toolbar?: ToolbarConfig;
  onImageUpload?: (file: File) => Promise<string>;
  mention?: MentionOptions;
  docLink?: DocLinkOptions;
  renderDebounce?: number | false;
  autoPreview?: boolean;
}
```

| Opsi | Tipe | Bawaan | Deskripsi |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Konten Markdown awal. |
| `mode` | `EditorMode` | `'simple'` | `'simple'` menampilkan editor dan pratinjau tanpa bilah alat atau status. `'complex'` menambahkan kedua bilah tersebut. |
| `theme` | `EditorTheme` | `'light'` | Tema warna melalui atribut `data-theme`: `'light'` atau `'dark'`. |
| `math` | `boolean` | `true` | Mengaktifkan rumus KaTeX: `$...$` sebaris dan `$$...$$` sebagai blok. |
| `mindmap` | `boolean` | `true` | Mengaktifkan peta pikiran Markmap dari blok berpagar ```` ```mindmap ````. |
| `codeHighlight` | `boolean` | `true` | Mengaktifkan blok kode highlight.js dengan header tiga titik berwarna dan tombol salin. |
| `tips` | `boolean` | `true` | Mengaktifkan blok pemberitahuan seperti `:::notice` dan `:::warning`. |
| `preview` | `boolean` | `true` | Menampilkan panel pratinjau. Jika `false`, hanya panel editor yang dibuat. |
| `onChange` | `(value: string) => void` | — | Dipanggil pada setiap penyuntingan dengan string seluruh dokumen. |
| `toolbar` | `ToolbarConfig` | semua tindakan | Mengatur tindakan bilah alat yang ditampilkan serta mengganti label atau ikonnya. |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Hook yang dipanggil saat berkas gambar ditempelkan atau diseret ke editor. Promise harus menghasilkan URL gambar, yang disisipkan sebagai `![alt](url)`. Dialog gambar menerima URL dan tidak menyediakan pemilih berkas. |
| `mention` | `MentionOptions` | — | Konfigurasi dropdown @sebutan. Jika dihilangkan, mengetik `@` tidak membuka dropdown. |
| `docLink` | `DocLinkOptions` | — | Konfigurasi penyisipan tautan dokumen. Jika dihilangkan, mengetik karakter pemicu tidak membuka dropdown. |
| `renderDebounce` | `number \| false` | adaptif | Debounce pratinjau dalam milidetik. `false` merender secara sinkron pada setiap penyuntingan; angka menetapkan jeda tetap. Jika dihilangkan, menggunakan `adaptiveDebounceMs(value.length)`, dari 120 ms hingga 600 ms. |
| `autoPreview` | `boolean` | `true` | Jika `true`, pratinjau dirender ulang setelah penyuntingan dengan debounce. Jika `false`, panggil `renderNow()` atau gunakan tombol penyegaran pada bilah status. |

## `EditorMode` dan `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'` (bawaan): tanpa bilah alat, bilah status, atau nomor baris.
- `'complex'`: mengaktifkan bilah alat, bilah status, dan nomor baris.
- `'light'` (bawaan) dan `'dark'` mengatur palet penyorotan sintaks dan properti khusus CSS.

Keduanya dapat diubah saat aplikasi berjalan dengan `setMode(mode)` dan `setTheme(theme)`.

## `ToolbarConfig`

`ToolbarConfig` berupa **array nama tindakan** yang ingin disertakan atau **objek pemetaan nama tindakan ke pengaturan penggantinya**:

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### Bentuk array (daftar yang disertakan)

Hanya tindakan yang tercantum yang ditampilkan. Urutannya tetap mengikuti urutan bawaan bilah alat; array menyaring visibilitas, bukan mengubah urutan:

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### Bentuk objek (pengaturan per item)

Semua tindakan ditampilkan secara bawaan. Bentuk objek dapat menyembunyikan item atau mengganti label dan ikonnya:

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: {
    bold: { label: 'Make bold', icon: '<b>B</b>' },
    image: { show: false },
    youtube: { show: false },
  },
});
```

### `ToolbarItemOverride`

```ts
interface ToolbarItemOverride {
  show?: boolean;  // Show this item. Default: true.
  label?: string;  // Custom tooltip / aria-label.
  icon?: string;   // Custom icon as an HTML string.
}
```

Daftar lengkap nama tindakan yang valid ada di [Fitur](./features.md#toolbar-actions).

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| Bidang | Tipe | Bawaan | Deskripsi |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | Hook pencarian yang menerima teks setelah `@`. Diperlukan untuk mengaktifkan dropdown. |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | Mengembalikan teks yang disisipkan pada kursor untuk mengganti `@query`. Gunakan bentuk `[@label](mention:id)` agar pratinjau menampilkan lencana. |
| `minChars` | `number` | `0` | Panjang kueri minimum sebelum dropdown ditampilkan. |
| `maxItems` | `number` | `8` | Jumlah maksimum item dalam dropdown. |

`MentionItem` dijelaskan dalam [referensi API](./api-reference.md).

## `DocLinkOptions`

```ts
interface DocLinkOptions {
  onDocSearch?: (query: string) => DocItem[] | Promise<DocItem[]>;
  onFetchDocMeta?: (url: string) => Promise<DocMeta>;
  insertStyle?: 'card' | 'link' | 'auto';
  triggerChar?: string;
  minChars?: number;
  maxItems?: number;
}
```

| Bidang | Tipe | Bawaan | Deskripsi |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | Hook pencarian yang dipanggil setelah karakter pemicu. Diperlukan untuk mengaktifkan dropdown. |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | fetch + DOMParser bawaan | Ganti hook ini untuk mengambil metadata melalui proxy backend dan menghindari pembatasan CORS browser. |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'` menyisipkan kartu `:::doc-link`, atau tautan jika tidak ada metadata; `'link'` selalu menyisipkan tautan Markdown biasa; `'auto'` menyisipkan kartu jika metadata tersedia. |
| `triggerChar` | `string` | `'/'` | Karakter yang membuka dropdown pencarian dokumen. |
| `minChars` | `number` | `0` | Panjang kueri minimum sebelum pencarian. |
| `maxItems` | `number` | `8` | Jumlah maksimum item dalam dropdown. |

## `RendererOptions`

Digunakan oleh konstruktor `Renderer` dan `renderMarkdown(source, options)`.

```ts
interface RendererOptions {
  math?: boolean;
  mindmap?: boolean;
  codeHighlight?: boolean;
  tips?: boolean;
  html?: boolean;
  breaks?: boolean;
  theme?: 'light' | 'dark';
}
```

| Opsi | Tipe | Bawaan | Deskripsi |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | Mengaktifkan rendering rumus KaTeX. |
| `mindmap` | `boolean` | `true` | Mengaktifkan rendering peta pikiran Markmap. |
| `codeHighlight` | `boolean` | `true` | Mengaktifkan blok kode highlight.js. |
| `tips` | `boolean` | `true` | Mengaktifkan blok pemberitahuan. |
| `html` | `boolean` | `false` | Mengizinkan HTML mentah dalam sumber Markdown. Nilai bawaan `false` lebih aman. |
| `breaks` | `boolean` | `false` | Mengubah pergantian baris biasa menjadi `<br>`. |
| `theme` | `'light' \| 'dark'` | — | Pada `renderMarkdown`, membungkus HTML dengan penampung bertema. `Renderer.render` mengembalikan HTML tanpa pembungkus; atur gaya penampungnya sendiri. |

Kotak centang daftar tugas, kartu `:::doc-link`, dan lencana @sebutan selalu aktif dan tidak dapat dinonaktifkan melalui `RendererOptions`.

## Langkah berikutnya

- [Fitur](./features.md) — perilaku setiap opsi saat aplikasi berjalan.
- [Referensi API](./api-reference.md) — seluruh tipe yang tersedia.
