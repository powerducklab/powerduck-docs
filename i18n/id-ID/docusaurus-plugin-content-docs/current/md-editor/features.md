---
sidebar_position: 5
title: "Fitur"
description: "Halaman ini menjelaskan setiap fitur bawaan sesuai implementasinya dalam kode sumber."
---

# Fitur

Halaman ini menjelaskan setiap fitur bawaan sesuai implementasinya dalam kode sumber.

## Rendering inkremental

Pratinjau menggunakan rendering inkremental per blok agar tetap responsif saat menangani dokumen besar:

- **Pemisahan blok** (`splitIntoBlocks`): sumber dipisahkan menjadi blok pada baris judul ATX (`#` hingga `######`). Konten di dalam pagar kode backtick atau tilde tidak pernah menjadi titik pemisahan; judul di dalam kontainer khusus `:::` juga tetap dipertahankan. Dokumen tanpa judul diproses sebagai satu blok.
- **Rendering per blok**: hanya blok dengan hash konten yang berubah yang diproses ulang melalui markdown-it / KaTeX. Blok yang tidak berubah langsung menggunakan kembali node DOM yang sudah ada, termasuk SVG peta pikiran yang sudah dihidrasi.
- **Cache hash konten**: hasil rendering disimpan berdasarkan hash konten (hash cepat bergaya djb2 ditambah panjang konten), sehingga urungkan/ulangi dan penyalinan paragraf identik juga dapat menggunakan cache. Jika cache melebihi 800 entri, hash yang tidak lagi ada dalam dokumen dihapus. Entri untuk blok saat ini dipertahankan, sehingga dokumen dengan lebih dari 800 blok berbeda dapat melampaui ambang tersebut.
- **Pengurutan ulang**: blok yang diurutkan ulang dipindahkan dengan menambahkan node yang sudah ada ke `DocumentFragment`.
- **Debounce adaptif** (`adaptiveDebounceMs(docLength, base = 120, max = 600)`): jeda sebelum rendering adalah `base + floor(docLength / 20000) * 60`, dengan batas atas `max`. Timpa melalui `renderDebounce`, atau tetapkan `renderDebounce: false` untuk rendering sinkron.
- **`content-visibility: auto`**: setiap blok dibungkus elemen `.md-editor-block` agar blok di luar layar dapat melewati proses tata letak dan penggambaran.

Kegagalan rendering satu blok tidak mengosongkan seluruh pratinjau; blok tersebut ditampilkan sebagai sumber dengan karakter yang di-escape di dalam `<pre>`.

## Rumus KaTeX

Plugin matematika markdown-it mandiri merender rumus dengan KaTeX (tanpa dependensi `markdown-it-texmath`):

- **Rumus sebaris**: `$E=mc^2$` — konten tidak boleh kosong atau memuat `$` maupun baris baru. Teks yang menyerupai nilai mata uang, seperti `$5` atau `$10.50`, dikecualikan secara heuristik.
- **Rumus blok**:
  ```markdown
  $$
  \int_0^1 x^2 \, dx
  $$
  ```
  Bentuk satu baris (`$$ ... $$`) dan beberapa baris sama-sama didukung. CSS KaTeX disertakan dalam paket. Nonaktifkan dengan `math: false`.

## Peta pikiran Markmap

Tulis blok berpagar ```` ```mindmap ```` yang isinya berupa kerangka Markdown:

````markdown
```mindmap
# Root topic
## Branch one
- Child A
- Child B
## Branch two
- Child C
```
````

Aturan blok melacak kedalaman pagar bertingkat, sehingga pagar kode di dalam peta pikiran tetap dipertahankan. Rendering sinkron menghasilkan placeholder `<div>`; `Renderer.hydrate(container)` mengimpor `markmap-lib` dan `markmap-view` secara asinkron, lalu mengubah setiap placeholder menjadi SVG interaktif. Kegagalan hidrasi tidak bersifat fatal. Nonaktifkan dengan `mindmap: false`.

## Penyorotan kode dengan tombol salin

Blok kode berpagar disorot menggunakan highlight.js. Build mendaftarkan sekumpulan bahasa tetap: JavaScript, TypeScript, Python, JSON, Bash/Shell, CSS, XML/HTML/SVG, SQL, YAML, Markdown, Go, Rust, Java, C, dan C++ (beserta alias umum seperti `js`, `ts`, `py`, `sh`, `yml`, `md`, `rs`, `c++`). Bahasa yang tidak dikenal dideteksi otomatis; jika deteksi gagal, kode ditampilkan sebagai teks biasa yang di-escape.

Setiap blok yang disorot dibungkus kontainer bergaya macOS dengan titik merah-kuning-hijau, label bahasa, dan tombol **Salin**. Tombol ini menggunakan delegasi peristiwa pada panel pratinjau dan beralih ke `document.execCommand('copy')` jika Clipboard API tidak tersedia. Nonaktifkan dengan `codeHighlight: false`.

## Tindakan bilah alat {#toolbar-actions}

Dalam mode `complex`, bilah alat berisi 22 tindakan berikut dengan urutan bawaan ini:

| # | Nama tindakan | Fungsi |
|---|-------------|---------------|
| 1 | `heading` | Judul |
| 2 | `bold` | Tebal (Ctrl+B) |
| 3 | `italic` | Miring (Ctrl+I) |
| 4 | `link` | Tautan (Ctrl+K) |
| 5 | `image` | Sisipkan gambar |
| 6 | `video` | Sisipkan video |
| 7 | `youtube` | Sisipkan video YouTube |
| 8 | `quote` | Kutipan |
| 9 | `ul` | Daftar tak berurutan |
| 10 | `ol` | Daftar berurutan |
| 11 | `tasklist` | Daftar tugas |
| 12 | `mention` | Sebutan (@) |
| 13 | `doclink` | Sisipkan tautan dokumen |
| 14 | `code` | Blok kode |
| 15 | `table` | Tabel |
| 16 | `math` | Rumus matematika |
| 17 | `mindmap` | Sisipkan peta pikiran |
| 18 | `hr` | Garis horizontal |
| 19 | `tips` | Sisipkan kotak keterangan |
| 20 | `preview` | Alihkan pratinjau |
| 21 | `help` | Pintasan keyboard |
| 22 | `theme` | Alihkan tema |

Label bawaan berbahasa Inggris. Timpa `label` pada setiap item untuk melokalkan tooltip dan nama aksesibel. Beberapa tindakan membuka dialog atau pemilih templat: gambar, video, YouTube, tabel, rumus (templat), peta pikiran (templat), kotak keterangan (kisi jenis), dan bantuan. Atur bilah alat melalui opsi `toolbar` seperti dijelaskan dalam [Konfigurasi](./configuration.md#toolbarconfig).

## Pintasan keyboard

Pintasan bawaan didefinisikan dalam `DEFAULT_SHORTCUTS`. `Mod` berarti Ctrl di Windows/Linux dan Cmd di macOS.

| Tombol | Tindakan | Deskripsi |
|-----|--------|-------------|
| `Mod-b` | `bold` | Tebal |
| `Mod-i` | `italic` | Miring |
| `Mod-Alt-1` | `heading` | Judul |
| `Mod-k` | `link` | Sisipkan tautan |
| `Mod-Alt-c` | `code` | Blok kode |
| `Mod-Shift-.` | `quote` | Kutipan blok |
| `Mod-Shift-8` | `ul` | Daftar tak berurutan |
| `Mod-Shift-7` | `ol` | Daftar berurutan |
| `Mod-Shift-9` | `tasklist` | Daftar tugas |
| `Mod-Alt-m` | `math` | Rumus matematika |
| `Mod-Alt-p` | `preview` | Alihkan pratinjau |
| `Mod-Shift-l` | `theme` | Alihkan tema |

Tombol **Bantuan** pada bilah alat membuka dialog berisi daftar pintasan dengan tampilan tombol keyboard, serta referensi ringkas untuk daftar tugas, sebutan, tautan dokumen, rumus, peta pikiran, dan kotak keterangan.

## Unggah gambar

Sediakan `onImageUpload: (file: File) => Promise<string>`. Hook dipanggil ketika berkas gambar ditempelkan atau diseret ke editor. Popup gambar menerima URL dan tidak menyediakan pemilihan berkas. Kembalikan URL gambar yang dapat diakses publik; editor menyisipkan `![alt](url)` pada posisi kursor (nama berkas tanpa ekstensi digunakan sebagai teks alternatif). Kegagalan unggah diabaikan tanpa pesan agar pengguna dapat mencoba kembali.

## @mention

Berikan opsi `mention` untuk mengaktifkan dropdown pencarian ketika pengguna mengetik `@`:

- `onMentionSearch(query)` mengembalikan item `MentionItem` yang cocok.
- `onMentionSelect(item)` mengembalikan teks yang disisipkan. Nilai bawaannya adalah `[@label](mention:id)`, yang diubah renderer menjadi lencana berformat.
- `minChars` (bawaan `0`) dan `maxItems` (bawaan `8`) mengatur dropdown.

Dropdown mendukung navigasi ArrowUp/ArrowDown, Enter/Tab, dan Escape, lalu ditutup saat editor kehilangan fokus. Di pratinjau, teks `@` biasa seperti `@media` tidak ditampilkan sebagai lencana; hanya tautan berskema `mention:` yang menjadi lencana. Di editor, teks tersebut tetap dapat memicu hook pencarian yang dikonfigurasi.

## Tautan dokumen

Berikan opsi `docLink` untuk mengaktifkan dropdown pencarian dokumen setelah karakter pemicu (bawaan `/`):

- `onDocSearch(query)` mengembalikan item `DocItem` yang cocok.
- `onFetchDocMeta(url)` mengambil judul, thumbnail, dan deskripsi. Implementasi bawaan menggunakan `fetch` + `DOMParser` untuk membaca tag Open Graph dan dapat gagal jika server lintas origin tidak mengizinkan CORS. Gunakan proxy backend sendiri bila diperlukan.
- `insertStyle` mengatur penyisipan: `'auto'` (kartu jika metadata tersedia), `'card'`, atau `'link'`.

Dokumen yang dipilih disisipkan sebagai tautan biasa atau kartu `:::doc-link` yang menampilkan judul, thumbnail, deskripsi, dan nama host sebagai kartu pratinjau yang dapat diklik.

## Blok pemberitahuan / keterangan

Tulis kontainer `:::` dengan salah satu dari enam jenis. Judul opsional dapat ditambahkan setelah jenis pada baris pembuka:

```markdown
:::notice
This is a notice.
:::

:::warning Title here
Warning content.
:::
```

Jenis yang didukung: `notice`, `info`, `tip`, `success`, `warning`, `danger`. Masing-masing ditampilkan dengan ikon, garis kiri berwarna, dan judul. Tombol keterangan pada bilah alat membuka pemilih visual untuk keenam jenis tersebut. Nonaktifkan dengan `tips: false`.

## Daftar tugas

Item daftar yang cocok dengan `- [ ]` atau `- [x]` (dengan spasi bebas di dalam kurung) ditampilkan sebagai kotak centang nonaktif. Perhatikan konvensi proyek: **`- [ ]` ditampilkan tercentang (hijau) dan `- [x]` ditampilkan tidak tercentang** — kebalikan dari GitHub Flavored Markdown. Tombol daftar tugas pada bilah alat mengalihkan penanda pada baris saat ini atau baris yang dipilih.

## Langkah berikutnya

- [Konfigurasi](./configuration.md) — sesuaikan fitur melalui opsi.
- [Referensi API](./api-reference.md) — kendalikan editor secara terprogram.
