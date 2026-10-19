---
sidebar_position: 5
title: "Protokol"
description: "Sistem nyata tidak hanya menggunakan REST. Powerduck memodelkan tujuh protokol pada objek jalur OpenAPI biasa dengan ekstensi x-protocol. Operasi streaming dan RPC berada dalam spesifikasi yang sama dengan HTTP, bukan dikelola di alat terpisah atau diam-diam diubah menjadi REST."
---

# Protokol

Sistem nyata tidak hanya menggunakan REST. Powerduck memodelkan tujuh protokol pada objek jalur OpenAPI biasa dengan ekstensi `x-protocol`. Operasi streaming dan RPC berada dalam spesifikasi yang sama dengan HTTP, bukan dikelola di alat terpisah atau diam-diam diubah menjadi REST.

Setiap operasi non-HTTP tetap berupa objek jalur biasa dengan metode HTTP dan `responses."200".description`:

- `graphql`, `grpc`, `mcp`, dan `a2a` menggunakan **post**;
- `sse` dan `websocket` biasanya menggunakan **get**;
- `http` adalah bawaan dan tidak menyertakan `x-protocol`.

## SSE

Peristiwa yang dikirim server melalui HTTP menggunakan `x-protocol: "sse"`. Jenis media streaming adalah `text/event-stream` dan mendeskripsikan muatan satu peristiwa dengan `itemSchema`, bukan `schema`:

```yaml
paths:
  /events:
    get:
      x-protocol: sse
      responses:
        "200":
          description: Event stream
          content:
            text/event-stream:
              itemSchema:
                type: object
                properties:
                  type:
                    type: string
                  data:
                    type: string
```

## WebSocket

WebSocket menggunakan `x-protocol: "websocket"` dengan blok `x-websocket`. URL harus diawali `ws://` atau `wss://`:

```yaml
paths:
  /ws:
    get:
      x-protocol: websocket
      x-websocket:
        url: wss://example.com/ws
        subprotocols: []
        headers: {}
      responses:
        "200":
          description: Operation response
```

`subprotocols` dan `headers` bersifat opsional.

## GraphQL

GraphQL menggunakan post pada jalur seperti `/graphql/query/fieldName`, dengan `x-graphql`. Endpoint harus berupa URL HTTP(S) absolut dan kueri wajib diisi:

```yaml
paths:
  /graphql/query/product:
    post:
      x-protocol: graphql
      x-graphql:
        endpoint: https://example.com/graphql
        query: query Product($id: ID!) { product(id: $id) { id name } }
        operationName: Product
        variablesSchema:
          type: object
        variables: {}
      responses:
        "200":
          description: Operation response
```

`operationName`, `variablesSchema`, dan `variables` bersifat opsional.

## gRPC

gRPC menggunakan post pada jalur seperti `/grpc/pkg.Service/Method`, dengan `x-grpc`. Jika server mendukung reflection, atur `reflection: true`; jika tidak, sediakan `protoPaths` dan, bila diperlukan, `includeDirs`:

```yaml
paths:
  /grpc/products.ProductService/GetProduct:
    post:
      x-protocol: grpc
      x-grpc:
        address: host:port
        service: products.ProductService
        method: GetProduct
        kind: unary
        reflection: true
      responses:
        "200":
          description: Operation response
```

`kind` adalah salah satu dari `unary`, `server_streaming`, `client_streaming`, atau `bidi_streaming`.

## MCP

Secara bawaan, MCP menggunakan Streamable HTTP dengan post pada jalur seperti `/mcp/tools/tool-name` dan blok `x-mcp`:

```yaml
paths:
  /mcp/tools/create-product:
    post:
      x-protocol: mcp
      x-mcp:
        endpoint: http://127.0.0.1:3000/mcp
        transport: streamable-http
        method: tools/call
        name: create-product
        argumentsSchema:
          type: object
        arguments: {}
      responses:
        "200":
          description: Operation response
```

`method` memilih operasi MCP: `tools/call`, `tools/list`, `resources/read`, `resources/list`, `resources/templates/list`, `prompts/get`, atau `prompts/list`. `name`, `uri`, `argumentsSchema`, dan `arguments` digunakan sesuai kebutuhan metode.

## Aturan struktur

- Untuk kontrak yang dihasilkan asisten, sediakan `schema` atau `$ref` pada jenis media di dalam `requestBody` atau `responses`; `text/event-stream` menggunakan `itemSchema` OAS 3.2 untuk setiap peristiwa. Ini adalah konvensi penulisan Powerduck, bukan persyaratan universal untuk semua dokumen OpenAPI.
- Setiap parameter harus memiliki `schema` atau `content`.
- Protokol yang dipilih dan konfigurasinya **dipertahankan saat menyunting** operasi. Operasi RPC dan streaming tidak pernah diam-diam diubah menjadi REST.
- Gunakan struktur ekstensi persis seperti contoh di atas; jangan mengarang kunci seperti `externalUrl`, dan jangan gunakan `ws` sebagai nama protokol.

## Mengapa ini penting

Memodelkan protokol dalam satu dokumen menjaga desain, debugging, dan dokumentasi tetap mengacu pada sumber yang sama. Dukungan eksekusi, mock, dan MCP yang dihasilkan bergantung pada transport. A2A 1.0 mendukung debugging dan dokumentasi JSON-RPC, REST, serta gRPC desktop, juga pembuatan server adaptor pesan tanpa status. Tugas persisten dan pengiriman push memerlukan implementasi sendiri. Saat Anda meminta endpoint streaming atau RPC, asisten mempertahankan konfigurasi protokol, bukan mengubahnya menjadi bentuk REST saja.

Terkait: [Merancang dengan asisten](./design.md), [Model data](./data-model.md).

## A2A

Gunakan `x-protocol: a2a` dengan `x-a2a` untuk pesan dan tugas agen melalui JSON-RPC, REST, atau gRPC desktop. A2A 1.0 mendukung ketiga binding; versi 0.3 mendukung JSON-RPC. Struktur data yang dikirim berbeda antarversi. Lihat [Agen A2A](./a2a.md) untuk konfigurasi, contoh, penemuan agen, dan batasan.
