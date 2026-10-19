---
sidebar_position: 6
title: Domain kustom
description: "Hubungkan nama host, atau nama host beserta subjalur, ke dokumen. Verifikasi kepemilikan melalui DNS TXT, lalu sajikan dokumentasi dan MCP dari domain Anda."
---

# Domain kustom

Secara bawaan, dokumen disajikan dari alamat bersama Powerduck. Domain kustom menempatkan dokumentasi dan MCP pada **nama host Anda sendiri**, sehingga API dapat diterbitkan dengan merek Anda, bukan tautan bersama.

Domain kustom merupakan fitur berbayar pada paket **Pro dan Team**, yang diperiksa melalui hak `oas.custom_domain`.

## Menghubungkan seluruh host atau subjalur

Pengikatan dapat ditujukan ke:

- **Seluruh host** — `api.example.com` menyajikan satu dokumen pada akar;
- **Host dan subjalur** — `example.com/v1` menyajikan dokumen di bawah `/v1`.

Pengikatan subjalur memungkinkan satu nama host menyajikan beberapa dokumen:

```text
example.com/v1  -> document A
example.com/v2  -> document B
```

Dengan demikian, satu host tidak terbatas pada satu dokumen, dan jalur dasar berversi dapat digunakan.

## Alamat pada domain kustom

Antarmuka yang tersedia pada alamat bersama juga disajikan pada domain terikat dengan jalur singkat dan stabil:

| Antarmuka | Seluruh host | Subjalur |
|---|---|---|
| Spesifikasi terkini | `/oas` | `/v1/oas` |
| Spesifikasi versi tertentu | `/v/:version/oas` | `/v1/v/:version/oas` |
| MCP | `/mcp` | `/v1/mcp` |

Nama host dan jalur permintaan digunakan untuk menentukan dokumen yang terikat. Permintaan preflight CORS ditangani untuk setiap jalur tersebut.

## Menambahkan dan memverifikasi domain

Domain belum dipercaya sebelum kepemilikannya diverifikasi:

1. **Tambahkan** nama host, dengan atau tanpa jalur, ke dokumen;
2. layanan mengembalikan pengikatan dan **petunjuk DNS**;
3. buat catatan DNS, lalu lakukan **verifikasi**;
4. status pengikatan berubah dari tertunda menjadi terverifikasi dan mulai melayani permintaan.

Pemeriksaan kepemilikan menggunakan **catatan TXT**:

| Kolom | Nilai |
|---|---|
| Jenis catatan | `TXT` |
| Host | `_powerduck-challenge.<your-domain>` |
| Nilai | `powerduck-verify=<verification-token>` |

Verifikasi membaca catatan TXT melalui DNS dan membandingkan token dalam waktu konstan. Pengikatan yang sudah terverifikasi tetap terverifikasi tanpa pemeriksaan ulang.

### Contoh

Untuk `api.example.com`, tambahkan catatan TXT berikut:

```text
_powerduck-challenge.api.example.com
TXT "powerduck-verify=<the-token-shown-for-the-binding>"
```

Lalu pilih **Verifikasi** di ruang kerja dokumen. Setelah berhasil, dokumentasi dan MCP disajikan dari domain tersebut, selama dokumen aktif dan masing-masing antarmuka diaktifkan.

## Mengelola pengikatan

- **Lihat daftar** domain yang terikat ke dokumen, termasuk status dan jalur dasar;
- **verifikasi** pengikatan yang tertunda setelah menambahkan catatan DNS;
- **hapus** pengikatan untuk berhenti menyajikan dokumen dari domain tersebut.

Perubahan pengaturan akses membatalkan cache resolusi host agar pengikatan lama tidak terus digunakan.

## Kontrol akses tetap berlaku

Domain kustom adalah alamat tambahan, bukan jalan pintas untuk melewati kontrol:

- dokumen harus berstatus `ACTIVE`;
- dokumentasi dan MCP memiliki pengaturan aktif masing-masing;
- kata sandi tetap melindungi dokumentasi, dan kunci akses MCP tetap melindungi MCP.

Lihat [Kontrol akses](/docs/id-ID/cloud/access-control/).

Terkait: [Dokumen dan versi](/docs/id-ID/cloud/documents-versions/), [Penagihan](/docs/id-ID/cloud/billing/).
