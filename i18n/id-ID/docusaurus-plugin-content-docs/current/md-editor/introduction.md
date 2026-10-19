---
sidebar_position: 1
title: "Pengantar"
description: "@powerduck/md-editor adalah editor Markdown berkinerja tinggi yang dapat disematkan di browser. Editor ini memadukan area penyuntingan CodeMirror 6 dengan pratinjau langsung melalui markdown-it, serta menyediakan rumus KaTeX, peta pikiran Markmap, penyorotan kode, blok pemberitahuan, bilah alat yang dapat diatur, pintasan keyboard, hook unggah gambar, @sebutan, dan penyisipan tautan dokumen."
---

# Pengantar

`@powerduck/md-editor` adalah editor Markdown berkinerja tinggi yang dapat disematkan di browser. Editor ini memadukan area penyuntingan [CodeMirror 6](https://codemirror.net) dengan pratinjau langsung melalui [markdown-it](https://github.com/markdown-it/markdown-it), serta menyediakan rumus KaTeX, peta pikiran Markmap, penyorotan kode, blok pemberitahuan, bilah alat yang dapat diatur, pintasan keyboard, hook unggah gambar, @sebutan, dan penyisipan tautan dokumen.

- **Nama paket:** `@powerduck/md-editor` <img src="https://img.shields.io/npm/v/@powerduck/md-editor"/>
- **Lisensi:** MIT
- **Format modul:** modul ECMAScript (`type: "module"`), dengan build ESM (`dist/index.mjs`) dan CJS (`dist/index.cjs`) serta deklarasi tipe (`dist/index.d.ts`).

## Fitur utama

Fitur berikut sesuai dengan modul sumber yang telah diimplementasikan:

- **Penyuntingan Markdown** dengan CodeMirror 6, penyorotan sintaks Markdown, serta tema penyorotan terang dan gelap.
- **Rumus KaTeX** melalui plugin markdown-it mandiri: rumus sebaris `$...$` dan blok `$$...$$`. Nilai mata uang seperti `$5` dikecualikan dari penguraian rumus menggunakan heuristik.
- **Peta pikiran Markmap** dirender dari blok berpagar ```` ```mindmap ````. markmap-lib dan markmap-view diimpor secara dinamis sehingga tidak memperbesar bundle awal saat tidak ada peta pikiran.
- **Penyorotan kode** dengan highlight.js, header tiga titik berwarna bergaya macOS, label bahasa, dan tombol salin sekali klik.
- **Blok pemberitahuan** (`:::notice`, `:::info`, `:::tip`, `:::success`, `:::warning`, `:::danger`) dengan ikon dan warna yang sesuai.
- **Pratinjau bergaya GitHub** menggunakan `github-markdown-css`.
- **Bilah alat lengkap** dengan 22 tindakan, dialog penyisipan gambar, video, YouTube, dan tabel, pemilih templat rumus dan peta pikiran, serta dialog bantuan yang mencantumkan semua pintasan.
- **Pintasan keyboard** dengan `Mod`, yang berarti Ctrl di Windows/Linux dan Cmd di macOS.
- **Bilah alat yang dapat diatur** melalui array item yang ingin disertakan atau pengaturan per item (`show`, `label`, `icon`).
- **Hook unggah gambar** (`onImageUpload`) dipanggil saat gambar ditempelkan atau diseret ke editor.
- **Dropdown @sebutan** diatur melalui opsi `mention`; sebutan yang dipilih tampil sebagai lencana bergaya dalam pratinjau.
- **Penyisipan tautan dokumen** diatur melalui `docLink`: tautan biasa atau kartu pratinjau `:::doc-link`. Metadata diambil oleh pemuat bawaan atau hook khusus; permintaan lintas asal mengikuti aturan CORS browser.
- **Rendering video:** sintaks gambar dengan URL berakhiran `.mp4`, `.webm`, `.ogg`, atau ekstensi lain yang dikenal menghasilkan elemen `<video controls>`.
- **Renderer mandiri** (`renderMarkdown(source, options)`) menghasilkan HTML dengan plugin dan gaya yang sama seperti pratinjau tanpa memasang editor.
- **Rendering inkremental per blok:** sumber dibagi pada judul ATX dan hanya blok yang berubah yang dirender ulang. Blok lain menggunakan kembali simpul DOM yang ada, termasuk SVG peta pikiran yang sudah diinisialisasi. Hasil rendering disimpan dalam cache berdasarkan hash konten.
- **Debounce adaptif:** jeda rendering pratinjau menyesuaikan panjang dokumen, dari 120 ms hingga maksimum 600 ms.
- **Dua mode penyuntingan:** `simple` (penyuntingan dan pratinjau tanpa bilah alat) dan `complex` (bilah alat serta bilah status), yang dapat diganti saat aplikasi berjalan.
- **Dua tema:** `light` dan `dark`, diterapkan melalui atribut `data-theme` dan properti khusus CSS.

## Gambaran arsitektur

Pustaka ini menyediakan dua antarmuka:

1. **Kelas JavaScript native** — API utama berpusat pada `MarkdownEditor`, yang dibuat dengan elemen penampung. Kelas ini menggabungkan `CodeEditor` (pembungkus CodeMirror), `Renderer` (pembungkus markdown-it), `IncrementalRenderer` untuk pratinjau, serta `Toolbar` dan `StatusBar` dalam mode `complex`. Dialog, pengontrol @sebutan, dan pengontrol tautan dokumen adalah modul yang dipasang sesuai kebutuhan.

2. **Ekspor React melalui subjalur** — `MarkdownEditorReact` adalah komponen `forwardRef` yang diekspor dari `./react`. Komponen ini membungkus instans native `MarkdownEditor`, mendukung penggunaan `value` terkontrol dan tidak terkontrol, serta menyediakan `MarkdownEditorHandle` imperatif melalui ref. Entri React terpisah agar proyek tanpa React tidak wajib memasang `react` dan `react-dom`.

Rendering terdiri dari tahap markdown-it sinkron yang menghasilkan HTML penampung peta pikiran, lalu inisialisasi asinkron dengan `Renderer.hydrate` yang mengubahnya menjadi diagram SVG interaktif. `renderMarkdown` mengembalikan HTML sinkron; untuk membuat SVG peta pikiran, gunakan `Renderer.render`, masukkan HTML ke DOM, lalu panggil `Renderer.hydrate`. Renderer inkremental bekerja langsung pada penampung pratinjau.

## Dukungan browser

Pustaka ini ditujukan untuk browser modern dengan DOM. CodeMirror 6, KaTeX, dan markmap-view adalah dependensi paket, bukan fitur browser; peta pikiran interaktif menggunakan `ResizeObserver`. API Clipboard digunakan jika tersedia. Jika `navigator.clipboard` tidak tersedia, misalnya di luar HTTPS, penyalinan blok kode menggunakan `document.execCommand('copy')`. Modul peta pikiran memasang implementasi kosong `ResizeObserver` hanya jika objek global tersebut tidak ada, untuk mencegah kesalahan saat impor; implementasi ini tidak memberikan notifikasi perubahan ukuran yang sebenarnya.

## Lisensi

`@powerduck/md-editor` dirilis dengan lisensi **MIT**.

## Langkah berikutnya

- [Instalasi](./installation.md) — pasang paket dan pelajari jalur impornya.
- [Mulai cepat](./quickstart.md) — pasang editor pertama dengan JavaScript native atau React.
- [Konfigurasi](./configuration.md) — semua opsi `MarkdownEditorOptions`.
- [Fitur](./features.md) — pelajari setiap fitur bawaan secara mendalam.
- [Referensi API](./api-reference.md) — semua kelas, fungsi, dan tipe yang diekspor.
- [Contoh](./examples.md) — cuplikan lengkap yang dapat dijalankan.
