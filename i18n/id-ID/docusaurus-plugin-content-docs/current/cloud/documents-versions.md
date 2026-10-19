---
sidebar_position: 3
title: Dokumen dan Versi
description: "Kelola siklus status dokumen, versi yang tidak dapat diubah, serta sumber dari unggahan atau sinkronisasi Git."
---

# Dokumen dan Versi

Dokumen adalah representasi satu API yang dihosting. Dokumen berada di organisasi Anda, baik langsung maupun di dalam proyek, dan menyimpan versi baru dari waktu ke waktu alih-alih menimpa versi lama.

## Hierarki

```text
Organization -> Project -> Document -> Versions
```

Dokumen dapat dibuat langsung di bawah organisasi atau di dalam proyek. Daftarnya tersedia pada tingkat proyek dan organisasi.

## Siklus status

Dokumen memiliki empat status:

| Status | Arti | Layanan publik |
|---|---|---|
| `ACTIVE` | Aktif | Dokumentasi dan MCP tersedia jika masing-masing diaktifkan |
| `PAUSED` | Dihentikan sementara | Layanan publik tidak tersedia |
| `ARCHIVED` | Disimpan, tetapi bukan dokumen aktif saat ini | Tidak disajikan |
| `DELETED` | Dihapus secara logis | Tidak disajikan |

Perubahan status yang diizinkan:

```text
pause:    ACTIVE  -> PAUSED
resume:   PAUSED  -> ACTIVE
archive:  ACTIVE / PAUSED -> ARCHIVED
restore:  ARCHIVED -> ACTIVE
delete:   ACTIVE / PAUSED / ARCHIVED -> DELETED
```

Menjeda adalah cara tercepat untuk menonaktifkan dokumen sementara lalu mengaktifkannya kembali. Pengarsipan mempertahankan riwayat tanpa memperlakukan dokumen sebagai dokumen aktif. Penghapusan bersifat logis, sehingga data utama tidak langsung dimusnahkan.

## Versi tidak dapat diubah

Saat spesifikasi berubah, versi baru dibuat. Versi asli tidak pernah diganti:

```text
v1 -> v2 -> v3 -> v4
```

Setiap versi mencatat:

- **Kunci penyimpanan** file di penyimpanan objek;
- Checksum **SHA-256**;
- Jenis konten, ukuran, dan waktu pembuatan.

Informasi ini memungkinkan penyimpanan riwayat, pemulihan versi, perbandingan perubahan, serta pembuatan ulang dokumentasi dan MCP berdasarkan versi tertentu.

### Tautan versi terkini dan versi tetap

- Tautan ke dokumen **terkini** mengikuti versi terbaru;
- Tautan **versi tetap** merujuk ke satu versi tertentu dan isinya tidak berubah bagi pembaca.

Gunakan tautan versi tetap jika membutuhkan referensi yang tidak berubah, misalnya dalam catatan rilis atau kontrak. Gunakan tautan terkini jika ingin selalu menampilkan versi terbaru.

## Sumber

Konten dokumen berasal dari sumber yang diabstraksikan, sehingga model dokumen tidak terikat langsung pada unggahan atau Git.

- **Unggah** — tambahkan file secara langsung;
- **Git** — hubungkan repositori dengan URL, cabang, dan jalur file.

Sumber Git mencatat apakah sinkronisasi aktif dan kapan terakhir dilakukan. Anda dapat:

- **Menghubungkan** repositori: URL repositori dan jalur file wajib diisi, sedangkan cabang opsional;
- **Menyinkronkan** sesuai kebutuhan untuk mengambil konten terbaru sebagai versi baru.

Metadata sumber disimpan bersama dokumen. Anda selalu dapat mengetahui apakah dokumen berasal dari unggahan atau repositori dan memeriksa sinkronisasi terakhir.

## Penyimpanan

File disimpan di penyimpanan objek dengan susunan organisasi/dokumen/versi. Database hanya menyimpan metadata: kunci penyimpanan, checksum, jenis konten, dan ukuran. Secara bawaan, file tidak dapat dibaca publik langsung dari penyimpanan; akses publik menggunakan rute publikasi dokumen.

## Manfaatnya

Versi yang tidak dapat diubah dan penghapusan logis memungkinkan iterasi cepat tanpa kehilangan riwayat atau tanpa sengaja mengekspos dokumen yang ingin dinonaktifkan. Jeda dokumen untuk penghentian sementara, arsipkan untuk penyimpanan jangka panjang, dan gunakan tautan versi tetap saat stabilitas diperlukan.

Terkait: [Operasi yang diekspos](/docs/id-ID/cloud/exposure/), [Kontrol akses](/docs/id-ID/cloud/access-control/), [Domain kustom](/docs/id-ID/cloud/custom-domains/).
