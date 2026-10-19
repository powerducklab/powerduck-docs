---
title: "Menyimpan permintaan dan contoh protokol"
description: "Powerduck memisahkan permintaan yang sedang Anda uji dari kontrak yang Anda publikasikan."
---

# Menyimpan permintaan dan contoh protokol

Powerduck memisahkan permintaan yang sedang Anda uji dari kontrak yang Anda publikasikan.

| Tindakan | Hasil |
| --- | --- |
| Simpan pada bilah URL | Menyimpan konfigurasi debugging lokal permintaan ini tanpa mengubah dokumen OpenAPI. |
| Permintaan cepat: simpan ke spesifikasi | Menambahkan operasi ke dokumen dan folder yang dipilih. |
| Permintaan spesifikasi: perbarui spesifikasi | Menampilkan metode, jalur tujuan, dan pratinjau definisi sebelum memperbarui kontrak. |
| Simpan dokumen / Cmd+S atau Ctrl+S | Menulis dokumen OpenAPI saat ini ke disk. Di tab permintaan cepat, pintasan menyimpan permintaan cepat tersebut. |

Permintaan lokal berisi server yang dipilih, URL, metode, nilai parameter, isi, skrip, dan pengaturan transportasi. Draf permintaan spesifikasi tetap berada di memori saat diedit; Simpan pada bilah URL menyimpannya secara persisten di penyimpanan proses renderer aplikasi dengan awalan `powerduck.debug.v1:`. Entri dipisahkan menurut ID dokumen, jalur, dan metode. Menghapus data browser atau aplikasi desktop menghapus status lokal ini; ekspor berkas OAS tidak menyertakannya. Penyimpanan ini **bukan brankas rahasia terenkripsi**: gunakan referensi lingkungan, bukan kredensial literal, dalam URL, header, atau isi permintaan. Kontrol autentikasi menggunakan jalur persistensi kredensial tersendiri.

`x-powerduck-request` **bukan ekstensi kontrak resmi**. Tindakan menambahkan atau memperbarui spesifikasi tidak menghasilkannya. Jangan gunakan untuk mendeskripsikan metode, parameter, isi permintaan, atau respons. Sekadar membuka dokumen tidak menulis ulang salinan yang sudah ada pada operasi lain.

## Memperbarui definisi secara eksplisit

Perbarui spesifikasi menampilkan pratinjau metode dan jalur tujuan sambil mempertahankan respons serta skema yang ada. Definisi parameter hanya disertakan jika dipilih; nilai parameter debugging tidak disalin. Isi JSON hanya dimasukkan sebagai contoh jika dipilih secara eksplisit. Nama bidang kredensial yang umum dikecualikan, tetapi **tinjau teks bebas dan contoh sebelum dipublikasikan**. Skrip dan penggantian autentikasi bukan bidang kontrak.

Operasi tujuan yang sudah ada tidak dapat ditimpa dengan mengganti metode atau jalur. Referensi operasi lokal diarahkan ulang. Metode kustom seperti `PURGE` disimpan pada `paths./cache.additionalOperations.PURGE` dan memerlukan OpenAPI 3.2. Pratinjau menyebutkan persyaratan ini, dan menerapkan pembaruan menetapkan versi dokumen menjadi 3.2.0. Periksa juga dukungan versi pada alat yang menggunakan dokumen tersebut.

Pengeditan skema protokol tetap tersedia melalui Edit dokumentasi. Tindakan ini mengubah definisi secara eksplisit; mengirim atau menyimpan permintaan debugging tidak diam-diam menulis ulang skema protokol.

## Contoh resmi yang dapat diunduh

Berkas ini adalah **definisi contoh** yang dipelihara, bukan layanan API publik Powerduck. Semua endpoint mengarah ke layanan lokal yang Anda sediakan. Mengimpor berkas tidak menjalankan layanan, menghubungkan secara otomatis, atau memberikan kredensial.

- [Semua protokol](https://www.powerduck.com/docs/examples/protocols/all-protocols.yaml)
- [HTTP dan PURGE kustom](https://www.powerduck.com/docs/examples/protocols/http.yaml)
- [SSE](https://www.powerduck.com/docs/examples/protocols/sse.yaml)
- [WebSocket](https://www.powerduck.com/docs/examples/protocols/websocket.yaml)
- [GraphQL](https://www.powerduck.com/docs/examples/protocols/graphql.yaml)
- [gRPC](https://www.powerduck.com/docs/examples/protocols/grpc.yaml) dan [echo.proto](https://www.powerduck.com/docs/examples/protocols/echo.proto)
- [MCP Streamable HTTP](https://www.powerduck.com/docs/examples/protocols/mcp.yaml)
- [A2A 1.0 JSON-RPC](https://www.powerduck.com/docs/examples/protocols/a2a.yaml)

Untuk gRPC, unduh `echo.proto` di samping berkas YAML, lalu pilih jalur lokal sebenarnya di klien jika diperlukan. Server harus mengimplementasikan `powerduck.examples.Echo/Echo` pada port 50051. Contoh lain juga memerlukan server yang sesuai; berkas tersebut bukan demonstrasi validasi terhadap backend yang sedang berjalan.

## Referensi ekstensi kontrak

Setiap operasi memiliki metode OAS biasa, operationId, summary, dan responses. Binding non-HTTP menggunakan operasi OAS sebagai titik acuan dokumentasi; `post` pada contoh gRPC tidak berarti gRPC diubah menjadi endpoint REST.

| Ekstensi | Makna dan bidang yang digunakan dalam contoh |
| --- | --- |
| `x-protocol` | `sse`, `websocket`, `graphql`, `grpc`, `mcp`, atau `a2a`. Dapat dihilangkan untuk HTTP. |
| `x-session` | Mendeklarasikan sesi protokol berumur panjang; contoh menggunakannya untuk WebSocket dan MCP. |
| `x-websocket` | `url`, `subprotocols` opsional, `headers`, dan `messages`. Setiap pesan terdokumentasi memiliki `id`, `name`, `type`, `body`, `requestSchema`, `responseSchema`. Jangan masukkan kredensial ke header. |
| `x-graphql` | `endpoint`, `query`, `operationName`, `variablesSchema`, `variables` yang aman dipublikasikan, `responseSchema`. |
| `x-grpc` | `address`, `service`, `method`, `kind`, `reflection`, `protoPaths`, `includeDirs`, serta `messages` terdokumentasi. `kind` mendukung unary/server_streaming/client_streaming/bidi_streaming. Jalur proto lokal bergantung pada deployment. |
| `x-mcp` | `transport`, `endpoint`, `method`, serta bidang khusus metode `name`, `argumentsSchema`, `arguments` yang aman dipublikasikan, `responseSchema`. Operasi sumber daya menggunakan `uri`; jangan gabungkan bidang metode yang tidak berkaitan. |
| `x-a2a` | `version`, `binding`, `endpoint`, `method`, `requestSchema`, `responseSchema` eksplisit dan `example` yang aman dipublikasikan. Payload 0.3 dan 1.0 berbeda; lihat [A2A](./a2a.md). |
| `x-response-stream` | Pernyataan opsional untuk streaming GraphQL, digunakan jika server dan transportasi aktual mendukung streaming. Tidak diperlukan untuk permintaan GraphQL biasa. |

SSE menggunakan `responses.200.content.text/event-stream.itemSchema` standar untuk mendeskripsikan payload setiap peristiwa. HTTP menggunakan parameter, requestBody, responses, dan skema keamanan standar. Jangan membuat blok konfigurasi `x-sse` atau menyimpan status debugging sebagai ekstensi kontrak.

Contoh menyertakan konfigurasi lengkap yang dapat digunakan untuk binding terpilih, bukan semua opsi yang saling eksklusif. MCP stdio memerlukan program lokal yang dikonfigurasi terpisah; contoh unduhan ini sengaja tidak menjalankannya otomatis.

## Integrasi paket

UI desktop mengelola persistensi debugging lokal dan penulisan spesifikasi secara eksplisit. `@powerduck/openapi-parser` sudah membaca metode kustom melalui `additionalOperations`; `@powerduck/tree` dan `@powerduck/oas-document` menggunakan bentuk kontrak tersebut. `@powerduck/openapi-request` menerima argumen runtime terpisah dari spesifikasi. Eksekusi permintaan tidak memerlukan `x-powerduck-request`.

Pemisahan penyimpanan ini tidak menambahkan parameter npm publik. Gunakan ekstensi protokol yang ada untuk data kontrak dan berikan nilai debugging saat ini ke API eksekusi permintaan. Jangan membuat eksportir, generator, atau alat MCP bergantung pada struktur privat status permintaan.
