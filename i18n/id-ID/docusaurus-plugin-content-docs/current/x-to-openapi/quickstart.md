---
sidebar_position: 3
title: "Mulai cepat"
description: "Mulai dengan @powerduck/x-to-openapi: konversi perintah curl dan koleksi Postman, lalu daftarkan adaptor kustom melalui XToOpenApi."
---

# Mulai cepat

Panduan ini membahas tiga cara paling umum: fungsi pembantu `curlToOpenApi`, fungsi `postmanToOpenApi`, dan kelas `XToOpenApi` untuk konfigurasi khusus.

Prasyarat: instal paket. [Instalasi](/docs/id-ID/x-to-openapi/installation/)

:::note
Semua fungsi konversi bersifat **asinkron** dan mengembalikan [`ConvertResult`](/docs/id-ID/x-to-openapi/api-reference/#convertresult). Selalu gunakan `await`.
:::

## 1. Mengonversi perintah curl

Berikan satu perintah curl ke [`curlToOpenApi`](/docs/id-ID/x-to-openapi/api-reference/#curltoopenapi). Bidang `document` pada hasil berisi objek OpenAPI 3.2 yang dihasilkan.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

Berikut cuplikan dokumen yang dihasilkan:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Generated API", "version": "1.0.0" },
  "servers": [{ "url": "https://api.example.com" }],
  "paths": {
    "/users": {
      "post": {
        "operationId": "postUsers",
        "tags": ["users"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "age": { "type": "integer" }
                },
                "required": ["name", "age"]
              }
            }
          }
        },
        "responses": { "default": { "description": "Successful response" } }
      }
    }
  }
}
```

Periksa keberhasilan konversi dan pesan diagnostiknya:

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. Mengonversi koleksi Postman

Berikan objek koleksi yang sudah diparsing atau string JSON ke [`postmanToOpenApi`](/docs/id-ID/x-to-openapi/api-reference/). Skrip pengujian dipertahankan sebagai `x-postman-scripts`.

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "Get user",
      request: {
        method: "GET",
        url: "https://api.example.com/users/123",
        header: [{ key: "Authorization", value: "Bearer token" }],
      },
      event: [
        {
          listen: "test",
          script: {
            type: "text/javascript",
            exec: ["pm.test('status is 200', () => pm.response.to.have.status(200));"],
          },
        },
      ],
    },
  ],
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// The Postman test script survives on the operation:
console.log(result.document.paths["/users/123"]?.get?.["x-postman-scripts"]);
```

String JSON juga dapat digunakan:

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. Menggunakan kelas `XToOpenApi` dengan opsi khusus

Gunakan kelas ini untuk mengontrol adaptor terdaftar dan [`ConvertOptions`](/docs/id-ID/x-to-openapi/api-reference/#convertoptions) secara eksplisit.

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());

const result = await converter.convert(
  "curl",
  "curl https://api.example.com/users/123",
  {
    title: "My API",
    version: "1.0.0",
    description: "Generated from curl commands",
    inferPathParameters: true,
    pathParameterMinSamples: 2,
    inferSecurity: true,
    includeCommonHeaders: false,
    includeCookies: false,
    includeExamples: false,
    useServerBasePath: false,
    validate: true,
    strict: false,
  },
);

console.log(result.document);
```

### Mendaftarkan beberapa adaptor dan menggunakan `"auto"`

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. Diagnostik dan mode ketat

Secara bawaan, konversi mengumpulkan masalah sebagai entri [`Diagnostic`](/docs/id-ID/x-to-openapi/api-reference/) dan tetap mengembalikan hasil. Tetapkan `strict: true` untuk melempar [`ConversionError`](/docs/id-ID/x-to-openapi/api-reference/#conversionerror) pada diagnostik pertama dengan tingkat kesalahan.

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

try {
  await curlToOpenApi("curl https://api.example.com/users", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Failed:", error.message);
    for (const d of error.diagnostics) console.error(`  [${d.code}] ${d.message}`);
  }
}
```

## Langkah berikutnya

- [Contoh](/docs/id-ID/x-to-openapi/examples/) — Batch curl, inferensi parameter jalur, autentikasi Postman, dan adaptor kustom.
- [Referensi API](/docs/id-ID/x-to-openapi/api-reference/) — Semua ekspor, opsi, dan kode diagnostik.
