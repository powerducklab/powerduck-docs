---
sidebar_position: 1
title: "Pengantar"
description: "Ubah OpenAPI menjadi layanan MCP: alat, prompt, sumber daya, konsol web, stdio, HTTP, dan CLI openapi-mcp."
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — Pengantar

`@powerduck/openapi-mcp-server` mengubah dokumen OpenAPI menjadi layanan MCP (Model Context Protocol) yang berjalan. Paket ini membuat **alat** dari operasi, **prompt** dari metadata dan operasi API, serta **sumber daya** dari katalog API, lalu menyediakannya melalui protokol MCP dengan antarmuka admin web bawaan.

- **Nama paket:** `@powerduck/openapi-mcp-server`
- **Versi:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **Lisensi:** MIT
- **Persyaratan Node:** `>=22.12.0`
- **Program CLI:** `openapi-mcp`
- **Format modul:** Build ESM dan CommonJS dengan deklarasi tipe yang disertakan.

Validasi dan resolusi referensi menggunakan `@powerduck/openapi-parser`, sedangkan protokol menggunakan `@modelcontextprotocol/sdk`.

## Hasil yang dibuat

- **Tools** — Satu alat MCP per operasi OpenAPI, dengan serialisasi parameter lengkap (gaya path/query/header/cookie dan aturan explode), pengodean isi permintaan (JSON, form-urlencoded, multipart, teks, biner), serta anotasi alat MCP (`readOnlyHint`, `destructiveHint`, `idempotentHint`).
- **Prompts** — Prompt global (`spec_overview`, `integration_guardrails`) dan prompt per operasi (`explain_*`, `plan_*`, `sample_*`).
- **Resources** — Sumber daya katalog tetap seperti `openapi://spec/summary`, `openapi://catalog/tools`, dan `openapi://spec/document`.

## Transport

- **stdio** — `startStdioServer()` menyediakan satu dokumen untuk klien MCP lokal, seperti Claude Desktop atau integrasi editor.
- **HTTP** — `attachMcpRoutes(app, options)` memasang Streamable HTTP di `/mcp` dan SSE lama opsional di `/sse` pada aplikasi Express Anda. Opsinya mengontrol batas sesi, waktu tunggu tidak aktif, CORS, dan perlindungan DNS rebinding. `startAdminServer()` menambahkan UI admin dan menggunakan batas sesi bawaan. `attachSseRoutes()` tetap tersedia sebagai pembungkus usang dengan argumen posisi.

## Server admin

`startAdminServer()` memulai aplikasi Express yang menyediakan:

- konsol web untuk mengunggah atau menempelkan spesifikasi, memeriksa alat, prompt, dan sumber daya, serta melihat layanan yang berjalan dan log permintaan;
- transport HTTP MCP;
- autentikasi kunci API, pencatatan permintaan dengan penyamaran header sensitif, serta penyimpanan status persisten opsional.

## Instalasi

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## Panduan cepat

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## Langkah berikutnya

- [Instalasi](../installation/) — npm/yarn/pnpm, instalasi global, subjalur `./server`, dan dependensi.
- [Panduan cepat](../quickstart/) — Penggunaan melalui CLI dan kode.
- [Konfigurasi](../configuration/) — Penjelasan lengkap `ServerConfig`.
- [Referensi API](../api-reference/) — Semua ekspor dan perintah CLI.
- [Contoh](../examples/) — Contoh penerapan.

## Lisensi

MIT.
