---
sidebar_position: 5
title: "Contoh"
description: "Contoh praktis @powerduck/openapi-codegen: JavaScript fetch, Python requests, cURL, generator kustom, plugin, dan RequestIR langsung."
---

# Contoh

Contoh praktis untuk `@powerduck/openapi-codegen`. Semua contoh mengasumsikan adanya objek dokumen OpenAPI yang sudah diparsing bernama `document`.

## 1. JavaScript `fetch`

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

Klien JavaScript lainnya: `axios`, `ofetch`, `jquery`, `xhr`. Untuk padanan Node di server, gunakan `node/fetch`, `node/axios`, `node/ofetch`, atau `node/undici`.

## 2. Python `requests`

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

Klien Python lainnya: `aiohttp`, `http-client`, `httpx-sync`, `httpx-async`.

## 3. cURL (shell)

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
  securityValues: { bearerAuth: "YOUR_ACCESS_TOKEN" },
});

console.log(code);
```

Klien shell lainnya: `wget` dan `httpie`. Untuk unggahan `multipart/form-data`, utamakan `shell/curl` atau `shell/httpie` daripada `shell/wget`.

## 4. Menemukan dan memilih generator

Gunakan `list()` untuk mengetahui generator yang tersedia, lalu buat kode dengan pasangan yang dipilih:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const all = list();
console.log(all.length, "generators available");

const picked = all.find(
  (g) => g.language === "python" && g.client === "requests",
);

if (!picked) throw new Error("generator unavailable");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 5. Mendaftarkan generator kustom

Implementasikan antarmuka `Generator` dan panggil `register`:

```typescript
import { register, generate } from "@powerduck/openapi-codegen";
import type { RequestIR } from "@powerduck/openapi-codegen";

register({
  language: "mylang",
  client: "my-client",
  generate(request: RequestIR): string {
    return [
      `// ${request.method} ${request.baseUrl}${request.path}`,
      `mylang.request(${JSON.stringify({
        method: request.method,
        url: request.baseUrl + request.path,
      })})`,
    ].join("\n");
  },
});

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "mylang",
  client: "my-client",
});

console.log(code);
```

## 6. Menggunakan plugin

Plugin menggabungkan pendaftaran satu atau beberapa generator melalui `use()`:

```typescript
import { use, generate } from "@powerduck/openapi-codegen";

use({
  name: "internal-generators",
  register(api) {
    api.register({
      language: "go",
      client: "our-wrapper",
      generate(request) {
        return `// go wrapper for ${request.method} ${request.path}`;
      },
    });
    api.register({
      language: "ruby",
      client: "our-wrapper",
      generate(request) {
        return `# ruby wrapper for ${request.method} ${request.path}`;
      },
    });
  },
});

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "go",
  client: "our-wrapper",
});
```

## 7. Membuat kode langsung dari `RequestIR`

Buat `RequestIR` sendiri untuk melewati `normalize` sepenuhnya:

```typescript
import { generate } from "@powerduck/openapi-codegen";
import type { RequestIR } from "@powerduck/openapi-codegen";

const request: RequestIR = {
  method: "GET",
  baseUrl: "https://api.example.com",
  path: "/users/{id}",
  parameters: [
    { name: "id", in: "path", value: 123 },
    { name: "limit", in: "query", value: 10, style: "form", explode: true },
  ],
  headers: [
    { name: "Accept", in: "header", value: "application/json" },
  ],
  body: undefined,
  security: [
    { name: "bearerAuth", type: "http", scheme: "bearer", value: "token-abc" },
  ],
};

const code = generate({
  request,
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

## 8. Penanganan kesalahan

`generate()` melempar kesalahan untuk input yang tidak ada, generator tidak dikenal, dan referensi yang tidak terselesaikan. Selalu tangkap kesalahan saat memproses input yang tidak tepercaya:

```typescript
try {
  const code = generate({
    document,
    path: "/does-not-exist",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Failed:", error instanceof Error ? error.message : error);
}
```

Pesan kesalahan yang mungkin muncul mencakup `Unsupported generator: ...`, `Path not found: ...`, dan `Operation not found: METHOD /path`.

## 9. Mode toleran `$ref`

Jika dokumen mungkin berisi referensi rusak atau melingkar, berikan `softRefMode: true` agar resolusi berlanjut dengan hasil parsial alih-alih melempar kesalahan:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "python",
  client: "requests",
  softRefMode: true,
});
```
