---
sidebar_position: 6
title: "Agen A2A"
description: "Gunakan A2A saat satu agen mendelegasikan pekerjaan kepada agen lain. MCP menyediakan alat dan sumber daya; A2A mendeskripsikan pesan agen, tugas, pembaruan status, dan artefak. Keduanya dapat disimpan dalam spesifikasi lokal yang sama tanpa dianggap sebagai protokol yang sama."
---

# Agen A2A

Gunakan A2A saat satu agen mendelegasikan pekerjaan kepada agen lain. MCP menyediakan alat dan sumber daya; A2A mendeskripsikan pesan agen, tugas, pembaruan status, dan artefak. Keduanya dapat disimpan dalam spesifikasi lokal yang sama tanpa dianggap sebagai protokol yang sama.

## Membuat dan melakukan debug

1. Di Debug, pilih **Permintaan baru → A2A**. Bawaannya adalah A2A **1.0**, menggunakan JSON-RPC melalui HTTP.
2. Masukkan endpoint JSON-RPC agen pada bilah URL. Pilih versi **0.3** secara eksplisit untuk agen lama; Powerduck tidak mengonversi versi secara diam-diam.
3. Pada tab Protokol, pilih metode lalu klik **Buat badan permintaan**. Periksa pratinjau, lalu pilih **Ganti badan permintaan** untuk menerapkannya. Batalkan atau ganti metode untuk mempertahankan draf saat ini.
4. Sunting `params` pada tab Badan. Gunakan Autentikasi dan Header untuk kredensial; pengiriman menambahkan header `A2A-Version` yang dipilih.
5. Kirim permintaan. Periksa keseluruhan envelope JSON-RPC: HTTP 200 masih dapat berisi `error`. Respons 1.0 yang berhasil menempatkan `task` atau `message` di dalam `result`; versi 0.3 menggunakan struktur responsnya sendiri.
6. Gunakan **Simpan ke spesifikasi** untuk menambahkan permintaan cepat. Pada operasi yang sudah ada, **Simpan** mempertahankan pengaturan debug lokal; **Perbarui spesifikasi** secara eksplisit memperbarui definisinya. Versi, endpoint, metode, dan skema terdokumentasi berada dalam `x-a2a`; draf permintaan lokal tidak diekspor ke OAS. Gunakan **Sunting dokumentasi** untuk menyunting kontrak protokol.

ID pesan dan ID permintaan JSON-RPC berbeda. Contoh baru membuat ID baru. Untuk melanjutkan percakapan, pertahankan pengenal konteks/tugas yang dikembalikan dalam pesan berikutnya sesuai versi protokol yang dipilih.

## Agent Card

Gunakan **Ambil Agent Card publik** dengan URL yang dinyatakan secara eksplisit, biasanya `/.well-known/agent-card.json`. Periksa antarmuka yang ditawarkan, versi, keterampilan, autentikasi, dan kemampuan sebelum mengatur endpoint. Mengambil kartu tidak otomatis mengubah URL permintaan atau meneruskan kredensial ke origin lain.

Penemuan publik tidak mengirim kredensial permintaan dan menolak pengalihan. Desktop menggunakan pelaksana HTTP native; penemuan di browser memerlukan CORS. Respons dibatasi hingga 1 MiB. Untuk A2A 1.0, buka **Verifikasi tanda tangan JWS** dan tempelkan JWKS publik tepercaya. Verifikasi dilakukan secara lokal, mendukung tanda tangan asimetris, dan tidak pernah mengikuti URL kunci yang diberikan kartu. Nilai kosong yang wajib tetap dipertahankan sesuai proto A2A yang versinya dikunci proyek. Kolom kustom di luar skema kartu standar tidak diautentikasi. Kartu tanpa tanda tangan dan yang belum diverifikasi diberi label jelas; menyimpan snapshot tidak menyimpan keputusan kepercayaan. Untuk metadata terlindungi, gunakan RPC kartu diperluas dengan autentikasi permintaan. **Simpan kartu dalam spesifikasi** hanya menyimpan snapshot; hapus metadata privat sebelum membagikan atau menghosting spesifikasi.

## Tugas dan streaming

Untuk 1.0, gunakan `SendStreamingMessage` atau `SubscribeToTask`; untuk 0.3, gunakan `message/stream` atau `tasks/resubscribe`. Respons menggunakan penampil peristiwa SSE yang sudah tersedia, dengan batas respons dan kontrol pembatalan. Pembaruan status dan artefak mentah tetap dapat diperiksa.

**Hentikan** memutus permintaan lokal, bukan membatalkan pekerjaan jarak jauh. Kirim `CancelTask` pada 1.0 atau `tasks/cancel` pada 0.3, dengan ID tugas yang dikembalikan, untuk meminta pembatalan jarak jauh. Tugas berstatus akhir tidak dapat begitu saja dimulai ulang.

Tersedia metode pengambilan tugas, daftar tugas pada 1.0, kartu diperluas, dan konfigurasi notifikasi push. A2A 1.0 menyediakannya melalui ketiga binding; 0.3 menggunakan JSON-RPC. Operasi opsional bergantung pada kemampuan yang dinyatakan agen. Powerduck tidak menghosting penerima notifikasi push.

## Ekstensi OpenAPI

`x-a2a` adalah ekstensi OpenAPI milik Powerduck, bukan Agent Card A2A standar atau kata kunci standar OpenAPI. Operasi JSON-RPC menggunakan `post`. Jalur OpenAPI mengidentifikasi operasi yang didokumentasikan; `endpoint` adalah URL JSON-RPC jarak jauh yang sebenarnya.

```yaml
openapi: 3.2.0
info:
  title: Research agent
  version: 1.0.0
paths:
  /agents/research/send:
    post:
      summary: Ask the research agent
      x-protocol: a2a
      x-a2a:
        version: '1.0'
        binding: JSONRPC
        endpoint: https://agent.example.com/rpc
        agentCardUrl: https://agent.example.com/.well-known/agent-card.json
        method: SendMessage
        requestSchema:
          type: object
          description: Application-specific message parameters
        responseSchema:
          type: object
          description: JSON-RPC response envelope
        example:
          jsonrpc: '2.0'
          id: request-1
          method: SendMessage
          params:
            message:
              messageId: message-1
              role: ROLE_USER
              parts:
                - text: Summarize the release notes
      responses:
        '200':
          description: A2A response; inspect result or error
          content:
            application/json:
              schema:
                type: object
```

Untuk respons streaming, gunakan `text/event-stream` dengan `itemSchema` OAS 3.2 yang mendeskripsikan satu peristiwa JSON-RPC. Editor desain mendukung skema permintaan dan respons yang terpisah. Dokumentasi yang dipublikasikan dan Salin untuk LLM mempertahankan konfigurasi A2A serta kontrak terdokumentasi.

| Kolom | Arti |
| --- | --- |
| `version` | Versi format transmisi yang didukung: `1.0` atau `0.3` |
| `binding` | `JSONRPC`; A2A 1.0 juga mendukung `HTTP+JSON` dan `GRPC` |
| `endpoint` | Endpoint JSON-RPC, URL dasar REST, atau alamat otoritas gRPC HTTP(S) |
| `method` | Metode sesuai versi: REST/gRPC menggunakan pilihan ini; JSON-RPC menggunakan metode dalam badan |
| `agentCardUrl` | URL penemuan publik |
| `agentCard` | Snapshot metadata tersimpan yang bersifat opsional |
| `requestSchema`, `responseSchema` | Kontrak terdokumentasi yang eksplisit, bukan disimpulkan dari satu respons yang ditangkap |
| `example` | Envelope JSON-RPC atau objek permintaan REST/gRPC langsung |

## REST dan gRPC

Pilih **Binding transport** secara terpisah dari versi dan metode. A2A 1.0 mendukung JSON-RPC, REST, dan gRPC native. A2A 0.3 tetap mendukung JSON-RPC; kombinasi yang tidak didukung ditolak, bukan dikonversi diam-diam.

Untuk REST, bilah URL berisi URL dasar, misalnya `https://agent.example/rest`. Metode menentukan verba HTTP dan akhiran jalur. Sunting objek permintaan langsung pada Badan, tanpa kolom envelope `jsonrpc`, `id`, dan `params`. Pengenal tugas dienkode sebagai segmen jalur; filter dan paginasi menjadi parameter kueri. Debug dan pembuatan kode dokumentasi menggunakan pemetaan yang sama.

gRPC native memerlukan aplikasi desktop. Gunakan `https://host:port` untuk TLS dengan kepercayaan sertifikat sistem, atau `http://localhost:port` untuk pengujian lokal tanpa enkripsi. URL tidak memiliki komponen jalur. Header menjadi metadata gRPC. Panggilan menggunakan deskriptor resmi `lf.a2a.v1.A2AService`, dengan konversi ProtoJSON untuk data bertingkat, enum, dan kolom biner. Hentikan membatalkan panggilan lokal, bukan tugas jarak jauh. Skrip HTTP, proxy, dan pengaturan TLS kustom ditolak untuk binding ini, bukan diabaikan diam-diam.

Perubahan versi atau binding mempertahankan draf. Gunakan **Buat badan permintaan**, periksa templat, lalu konfirmasikan **Ganti badan permintaan** untuk menerapkan bentuk yang benar. Envelope yang tidak sesuai ditolak sebelum dikirim. Antarmuka yang ditemukan dapat diterapkan secara eksplisit; A2A tidak lagi otomatis mewarisi server dokumen yang tidak terkait.

## Membuat server

Buka **Buat server → Unduh proyek server**. Arsip memuat proyek Node 22+ yang menyediakan JSON-RPC, REST, dan gRPC melalui satu handler HTTP untuk logika bisnis, beserta Agent Card publik. Jalankan `npm install`, atur `A2A_TOKEN` dengan setidaknya 32 karakter acak dan `HANDLER_URL`, lalu jalankan `npm start`.

Handler menerima `{message, contextId}` dan mengembalikan Message dengan `parts` yang tidak kosong. Unduhan tidak memuat rahasia atau kredensial permintaan yang sudah ada. Layanan yang dihasilkan membatasi muatan, memberi handler tenggat 60 detik, membatasi konkurensi, membersihkan sumber daya saat berhenti, dan mendukung penandatanganan JWS opsional melalui `SIGNING_JWK_FILE`.

Ini adalah **adaptor pesan tanpa status**, bukan model otonom atau mesin tugas persisten. Tugas persisten, pembatalan tugas, dan pengiriman push memerlukan eksekutor kustom serta penyimpanan permanen. Kartu tidak menyatakan dukungan push. Sebelum penerapan publik, atur URL publik, TLS, dan pembatasan laju pada reverse proxy HTTP; ganti identitas berbasis token bersama jika melayani banyak pengguna. Persyaratan penerapan ini dicatat dalam README yang dihasilkan.

## Interoperabilitas tanda tangan

Verifikasi mengikuti aturan keberadaan kolom A2A 1.0 dan JSON kanonis RFC 8785, termasuk string/array kosong yang wajib serta boolean opsional yang secara eksplisit disertakan. Tanda tangan yang dibuat dengan menghapus kolom wajib tersebut ditolak; tandatangani ulang dengan pengkanonis yang sesuai. Tanda tangan valid membuktikan kolom standar terhadap kunci publik yang diberikan, bukan membuktikan bahwa kunci tak tepercaya dimiliki organisasi yang diklaim.

Referensi: [Spesifikasi A2A 1.0](https://a2a-protocol.org/v1.0.0/specification/) dan [Spesifikasi A2A 0.3](https://a2a-protocol.org/v0.3.0/specification/).

## Contoh lokal yang dapat dijalankan

Repositori Powerduck React memuat `examples/a2a-demo`. Dengan Node.js 22+, jalankan `npm ci` dan `npm start` dalam direktori tersebut. Impor `openapi.json` untuk melakukan debug JSON-RPC, REST, dan gRPC desktop terhadap kalkulator lokal yang sama. README mencakup token bearer demo, penemuan Agent Card, JWKS lokal tepercaya, dan petunjuk streaming. `npm test` menguji transport nyata serta penolakan tanda tangan yang dimanipulasi tanpa layanan eksternal.

Pada panel protokol, **Buat badan permintaan** menampilkan pratinjau templat metode terpilih. **Ganti badan permintaan** menerapkannya secara eksplisit; membatalkan atau mengganti metode mempertahankan draf yang ada.

```bash
cd powerduck-react/examples/a2a-demo
npm ci
npm start
# In another terminal, in the same directory:
npm test
```

Endpoint lokal: JSON-RPC `http://127.0.0.1:9999/rpc`, REST `http://127.0.0.1:9999/rest`, gRPC `http://127.0.0.1:9998`. Kartu publik tersedia di `http://127.0.0.1:9999/.well-known/agent-card.json`. Gunakan token bearer demo `powerduck-local-demo-token-0123456789`. Mengirim angka `[12,30]` menghasilkan `Sum: 42` dan nilai terstruktur `total: 42`. Kunci publik tepercaya ada di `.runtime/trusted-jwks.json` dan berubah saat dimulai ulang. Demo hanya mendengarkan koneksi lokal, tidak memerlukan kunci AI, tidak memiliki mesin tugas persisten atau pengiriman push, dan tidak boleh diterapkan secara publik dengan token demo. Origin browser bawaan adalah `http://localhost:3000` dan `http://127.0.0.1:3000`; gunakan `CORS_ORIGINS` untuk origin lain. Server yang dihasilkan juga mendukung daftar izin eksplisit ini.
