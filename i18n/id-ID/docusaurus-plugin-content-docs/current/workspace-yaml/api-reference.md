---
sidebar_position: 4
title: "Referensi API"
description: "Fungsi, opsi, dan kode kesalahan lapisan inti dan berkas."
---

# Referensi API

## Lapisan inti (`@powerduck/workspace-yaml/core`)

| Fungsi | Deskripsi |
|----------|-------------|
| `createWorkspaceYaml(options?)` | Menghasilkan string konten workspace.yaml |
| `createOpenApiYaml(options)` | Menghasilkan string konten YAML OpenAPI 3.2 |
| `createWorkspaceWithApi(options)` | Menghasilkan konten ruang kerja dan OpenAPI sekaligus |
| `parseWorkspaceYaml(content)` | Mengurai dan memvalidasi string workspace.yaml |

### `createOpenApiYaml(options)` — Opsi

| Opsi | Tipe | Wajib | Deskripsi |
|--------|------|----------|-------------|
| `title` | `string` | Ya | Judul API |
| `version` | `string` | Tidak | Nilai bawaan `"1.0.0"` |
| `description` | `string` | Tidak | Deskripsi API |
| `contact` | `{ name?, url?, email? }` | Tidak | Informasi kontak |
| `license` | `{ name, url? }` | Tidak | Informasi lisensi |
| `servers` | `Array<{ url, description? }>` | Tidak | Daftar server |

## Lapisan berkas (`@powerduck/workspace-yaml`)

| Fungsi | Deskripsi |
|----------|-------------|
| `initializeWorkspace(options)` | Membuat berkas workspace.yaml di disk |
| `initializeOpenApi(options)` | Membuat berkas YAML OpenAPI di disk |
| `createWorkspaceApi(options)` | Membuat kedua berkas secara atomik (rollback jika gagal) |

### `createWorkspaceApi(options)` — Opsi

| Opsi | Tipe | Wajib | Deskripsi |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | Ya | Direktori tujuan |
| `oasId` | `string` | Ya | Pengenal API unik |
| `name` | `string` | Ya | Nama tampilan |
| `file` | `string` | Tidak | Jalur relatif (bawaan: `oasFiles/${oasId}.openapi.yaml`) |
| `title` | `string` | Tidak | Judul API (bawaan: `name`) |
| `version` | `string` | Tidak | Versi API (bawaan: `"1.0.0"`) |
| `overwriteOpenApi` | `boolean` | Tidak | Nilai bawaan `false` |

## Kesalahan

Semua kesalahan adalah instans `WorkspaceYamlError` dengan `code` yang dapat dibaca mesin:

| Kode | Deskripsi |
|------|-------------|
| `INVALID_ARGUMENT` | Parameter input tidak valid |
| `ALREADY_EXISTS` | Berkas sudah ada dan penimpaan bernilai false |
| `NOT_FOUND` | Berkas tidak ditemukan |
| `IO_ERROR` | Operasi sistem berkas gagal |
| `INVALID_WORKSPACE` | Konfigurasi ruang kerja tidak valid |
| `INVALID_OPENAPI` | Dokumen OpenAPI tidak valid |
| `ROLLBACK_FAILED` | Rollback transaksi gagal |
