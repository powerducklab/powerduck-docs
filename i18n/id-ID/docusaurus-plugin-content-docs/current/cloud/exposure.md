---
sidebar_position: 4
title: Operasi yang tersedia
description: "Pilih operasi yang tersedia untuk umum tanpa mengubah dokumen sumber. Kelompokkan menurut tag, cari, dan aktifkan satu per satu atau sekaligus."
---

# Operasi yang tersedia

Tidak semua operasi dalam spesifikasi perlu tersedia untuk umum. Endpoint administratif, tool internal, dan operasi yang masih berupa draf sering perlu tetap ada dalam dokumen, tetapi tidak ditampilkan di dokumentasi yang dipublikasikan maupun MCP. Konfigurasi ini menetapkan pilihan tersebut **tanpa mengubah dokumen sumber**.

## Cara kerjanya

Konfigurasi disimpan terpisah dari spesifikasi. Setiap entri merujuk pada operasi dan mencatat apakah operasi tersebut aktif:

- utamakan `operationId` jika tersedia;
- simpan juga `method` dan `path` untuk spesifikasi tanpa ID operasi dan untuk validasi.

Dokumen asli tidak diubah. Dokumentasi dan MCP dihasilkan dari spesifikasi yang digabungkan dengan pilihan operasi aktif. Menonaktifkan operasi akan menghapusnya dari antarmuka publik, tetapi tidak menghapusnya dari file Anda.

## Antarmuka pemilihan operasi

Antarmuka ini dirancang untuk menangani spesifikasi besar:

- **Pencarian** — filter berdasarkan metode, jalur, ringkasan, atau tag;
- **Kelompok menurut tag** — gunakan tag utama; operasi tanpa tag dikumpulkan dalam kelompok tersendiri;
- **Pengaturan per operasi** — aktifkan atau nonaktifkan satu operasi;
- **Pengaturan per kelompok** — aktifkan atau nonaktifkan semua operasi dalam kelompok tag sekaligus;
- **Pilih semua hasil filter** — kotak centang global berlaku untuk operasi yang cocok dengan pencarian saat ini.

Setiap operasi menempati satu baris agar statusnya tetap jelas meskipun memiliki beberapa tag.

## Pendekatan awal yang praktis

Anda dapat memulai dengan semua operasi aktif, lalu menonaktifkan yang tidak ingin dipublikasikan:

- endpoint internal dan administratif, misalnya pengelolaan pengguna atau pemeriksaan kesehatan internal;
- operasi yang masih dalam tahap perancangan;
- endpoint yang hanya ditujukan untuk debugging lokal.

Karena pilihan ini terpisah dari dokumen, Anda dapat mengubahnya seiring perkembangan API tanpa mengedit spesifikasi.

## Hubungannya dengan publikasi

Pilihan ini menentukan **operasi mana** yang muncul. Kontrol lain menentukan **apakah dokumen dapat diakses sama sekali**:

- dokumen harus berstatus `ACTIVE`;
- dokumentasi dan MCP memiliki pengaturan aktif masing-masing;
- akses dapat dilindungi kata sandi untuk dokumentasi atau kunci akses untuk MCP.

Lihat [Kontrol akses](/docs/id-ID/cloud/access-control/) untuk seluruh persyaratan akses.

## Batas paket

Paket membatasi jumlah operasi yang tersedia:

- **Free** — hingga 10;
- **Pro** — hingga 1.000;
- **Team** — hingga 10.000.

Terkait: [Kontrol akses](/docs/id-ID/cloud/access-control/), [Dokumen dan versi](/docs/id-ID/cloud/documents-versions/).
