---
sidebar_position: 2
title: "Merancang dengan asisten"
description: "Area Spesifikasi adalah tempat merancang API. Area ini menampilkan percakapan AI bersama dokumen terkini dan pratinjaunya, sehingga Anda dapat menjelaskan tujuan dengan bahasa alami sambil tetap mengendalikan perubahan yang diterapkan."
---

# Merancang dengan asisten

Area Spesifikasi adalah tempat merancang API. Area ini menampilkan percakapan AI bersama dokumen terkini dan pratinjaunya, sehingga Anda dapat menjelaskan tujuan dengan bahasa alami sambil tetap mengendalikan perubahan yang diterapkan.

## Siklus persetujuan

Model tidak menyunting dokumen secara langsung. Prosesnya sengaja dibagi menjadi langkah-langkah yang jelas:

```text
you describe an intent
        |
the model reads current state and proposes operations
        |
the host validates the proposal
        |
you review a patch card and Apply or Reject
        |
the change is merged into the document
```

Pemisahan ini merupakan keputusan desain utama. **Model** memahami tujuan dan mengusulkan struktur; **aplikasi host** memvalidasi setiap operasi secara deterministik; **Anda** menyetujui setiap perubahan. Usulan tidak pernah dianggap sudah diterapkan sebelum Anda mengonfirmasinya.

## Kartu perubahan

Kartu perubahan merangkum perubahan dan menampilkan operasi yang tepat, misalnya menambahkan jalur baru:

```json
{
  "type": "patch",
  "summary": "Add GET /products endpoint",
  "ops": [
    { "op": "add", "path": ["paths", "/products"], "value": { "get": {} } }
  ],
  "affects": { "paths": ["/paths/~1products"], "resources": ["Product"] }
}
```

Segmen jalur berupa elemen array, bukan string JSON Pointer. Penambahan jalur baru menargetkan `["paths", "/products"]` dan otomatis membuat kontainer induk.

### Perubahan terperinci pada operasi yang sudah ada

Saat menyunting operasi yang sudah ada, asisten **tidak** mengirim ulang seluruh operasi, karena hal itu akan menghapus semua kolom yang tidak disertakan. Sebagai gantinya, asisten menghasilkan operasi kecil yang hanya menyentuh bagian yang ingin diubah, termasuk bagian yang bertingkat:

- Menambahkan satu parameter kueri:

```json
{ "op": "add", "path": ["paths", "/products", "get", "parameters", "-"], "value": {} }
```

- Memperluas skema respons:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "responses", "200", "content", "application/json", "schema", "properties", "total"], "value": { "type": "integer" } }
```

- Mengubah satu kolom:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "summary"], "value": "..." }
```

Elemen ditambahkan ke array dengan token `"-"`, bukan dengan mengirim ulang seluruh array. Parameter diidentifikasi oleh pasangan `(in, name)` agar parameter yang sudah ada tidak diduplikasi. Aplikasi menggabungkan nilai yang diusulkan ke operasi saat ini dan mempertahankan bagian yang tidak disertakan.

Dengan cara ini, penyempurnaan berulang tetap andal: saat Anda meminta “tambahkan parameter limit” atau “jadikan nama wajib diisi”, hanya kolom tersebut yang berubah; bagian lainnya tetap utuh.

## Alat baca menjadi dasar setiap usulan

Sebelum menjawab, model dapat menggunakan alat hanya-baca untuk mendapatkan keadaan terkini secara tepat, alih-alih menebaknya:

- `spec.overview`: judul, versi, protokol, jumlah, tag, server, dan keamanan;
- `spec.listOperations`: semua operasi dalam format `METHOD /path`, beserta ringkasan dan tag;
- `spec.presentOperations`: kartu daftar semua operasi yang hanya dapat dibaca;
- `spec.getOperation`: definisi lengkap satu operasi dan skema yang dirujuknya;
- `spec.getSchema`: satu skema komponen, termasuk kolom wajib dan deskripsinya.

Jika bentuk lengkap operasi tidak terlihat, model diharapkan membacanya sebelum menyunting.

## Permintaan besar dikerjakan bertahap

Untuk permintaan besar seperti “buat API toko daring”, asisten tidak menghasilkan semuanya sekaligus:

1. Pertama, asisten mengajukan **pertanyaan klarifikasi** tentang keputusan utama;
2. Setelah Anda menjawab, asisten mengusulkan **satu perubahan terfokus setiap kali**, dengan dua hingga lima operasi per kartu;
3. Asisten hanya melanjutkan selama permintaan terbaru Anda masih berada dalam tujuan tersebut.

Setelah cakupan jelas, asisten juga menghasilkan `plan` endpoint yang akan dibuat, sehingga Anda dapat melihat susunan pekerjaan sebelum perubahan diajukan.

## Menjaga pekerjaan tetap sesuai tujuan

Aplikasi menerapkan beberapa aturan agar pekerjaan tetap selaras:

- **Dokumen saat ini** menjadi sumber keadaan yang sah; model tidak menganggap perubahan sebelumnya sudah ada jika dokumen menunjukkan sebaliknya;
- Dalam mode terfokus, hanya target aktif dan skema komponen yang dirujuk secara eksplisit yang diubah, tanpa perubahan tambahan pada endpoint lain;
- Menyebut `METHOD /path` lain secara eksplisit dianggap sebagai perpindahan tugas yang disengaja;
- Usulan yang diterapkan atau ditolak dilacak melalui riwayat; perubahan yang sudah ada tidak diajukan ulang.

Jika detail yang diperlukan tidak terlihat, asisten mengajukan pertanyaan khusus, bukan mengarangnya.

## Kartu lainnya

Tidak setiap respons berupa perubahan:

- **Kartu pertanyaan** meminta Anda memilih di antara beberapa opsi;
- **Kartu validasi** melaporkan pemeriksaan kualitas dengan status lulus, peringatan, atau kesalahan;
- **Kartu tindakan** menawarkan langkah konkret, seperti menjalankan skenario atau membuka ruang kerja;
- **Kartu tabel data** menampilkan contoh data atau baris pengujian untuk endpoint atau skema.

Terkait: [Ruang kerja permintaan](./debug.md), [Pengujian skenario](./scenario-testing.md), [AI dan model](./ai-models.md).

## Agen A2A

Rancang dan debug pesan agen berversi, operasi tugas, serta pembaruan SSE dengan `x-protocol: a2a`. Lihat [Agen A2A](./a2a.md) untuk kolom ekstensi dan binding JSON-RPC, REST, serta gRPC desktop.
