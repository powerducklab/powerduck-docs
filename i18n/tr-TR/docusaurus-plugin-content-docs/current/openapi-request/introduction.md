---
sidebar_position: 1
title: "@powerduck/openapi-request'e giriş"
description: "@powerduck/openapi-request, OpenAPI 3.2 için bir koleksiyon hata ayıklayıcısı ve istek çalışma zamanıdır. OpenAPI belgesinden istekleri oluşturup gönderir, akış yanıtlarını tanır ve gözlemlenen yanıtlardan güncellenmiş bir belge üretebilir. Altı iletişim protokolünü tek bir yalın arayüz üzerinden destekler."
---

# @powerduck/openapi-request'e giriş

`@powerduck/openapi-request`, OpenAPI 3.2 için bir koleksiyon hata ayıklayıcısı ve istek çalışma zamanıdır. OpenAPI belgesinden istekleri oluşturup gönderir, akış yanıtlarını tanır ve gözlemlenen yanıtlardan güncellenmiş bir belge üretebilir. Altı iletişim protokolünü tek bir yalın arayüz üzerinden destekler.

- **Paket adı:** `@powerduck/openapi-request`
- **Sürüm:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **Lisans:** MIT
- **Modül biçimi:** tür bildirimleri dahil ESM ve CommonJS derlemeleri.

## Kullanım amacı

Kütüphane, aynı belgeyi temel alarak üç farklı ihtiyacı karşılar:

- **Grafik arayüzler için istemci** — `createClient()`, grafik istek düzenleyicisinin adımlarına karşılık gelen `prepare()`, `send()`, `connect()`, `discover()` ve `writeback()` yöntemlerini içeren bir nesne döndürür.
- **Betikle yönetilen hata ayıklayıcı** — `createDebugger()`, otomasyon, betikler ve CI için `send()`, `sendMany()` ve `toCollection()` yöntemlerini içeren bir `ProtoKit` döndürür.
- **Elle yönetilen uzun süreli oturumlar** — `createManualSession()`, açma, gönderme, kapatma ve olay akışı içeren çift yönlü bir oturum nesnesi döndürür. WebSocket, MCP ve gRPC için yapı aynıdır; dolayısıyla tek bir arayüz üçünü de yönetebilir.

## Protokol bağdaştırıcıları

Çekirdek, taşıma yönteminden bağımsızdır; protokole özgü davranışlar bir `AdapterRegistry` içine kaydedilen bağdaştırıcılar tarafından sağlanır.

- **HTTP / SSE** — varsayılan olarak desteklenir. Normal JSON istekleri ve Server-Sent Events akışları, bildirilen içerik türlerinden veya gerçek yanıt başlıklarından otomatik olarak tanınır.
- **WebSocket** — ortak bir olay yapısıyla çift yönlü metin veya ikili veri oturumları.
- **gRPC** — `.proto` dosyaları veya sunucu yansıması üzerinden tekli çağrılar, sunucu akışı, istemci akışı ve çift yönlü akış.
- **MCP** — Streamable HTTP veya stdio üzerinden Model Context Protocol araçlarını çağırma.
- **GraphQL** — iç gözlem, işlem oluşturma ve yürütme.

## Temel özellikler

- **OpenAPI 3.2 koleksiyon modeli** — işlemleri `operationId` veya `method`+`path` ile bulur; parametreler, istek gövdeleri ve örneklerden istek oluşturur.
- **Akış algılama** — `isStreamingOperation()`, `isSseContentType()` ve `isStreamingContentType()` yanıtları bildirilen içerik türlerine göre sınıflandırır; `probeStreamingResponse()` gerçek yanıt başlıklarını inceler.
- **Yanıtları belgeye geri yazma** — `inferSchema()`, `mergeSchema()`, `toResponseObject()` ve `writeBackResponse()` yanıt şemalarını çıkarır ve güncellenmiş bir belge döndürür. Varsayılan olarak, geri yazma başarılı olduğunda `send()` bu belgeyi `patchedSpec` içinde döndürür; `writeBack: false` bu davranışı devre dışı bırakır. Girdi belgesi değiştirilmez ve hiçbir dosya otomatik olarak kaydedilmez. Sonucu kalıcı olarak kaydetmeden önce `writeBackSkippedReason` ve `writeBackWarnings` alanlarını kontrol edin.
- **Şema yardımcıları** — `sampleFromSchema()` bir şemadan örnek veri üretir.
- **Büyük bağımlılıkları gecikmeli yükleme** — gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`) ve MCP (`@modelcontextprotocol/sdk`) ilk kullanımda yüklenir. Yalnızca HTTP kullanan uygulamalar bu yükleme maliyetini üstlenmez.

## Kurulum

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## Hızlı başlangıç

```typescript
import { createClient } from "@powerduck/openapi-request";

const spec = {
  openapi: "3.2.0",
  info: { title: "Users", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User" } },
      },
    },
  },
};

const client = createClient();

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

## Sonraki adımlar

- [Kurulum](./installation.md) — paket yapısı, alt yol dışa aktarımları ve protokol yetenekleri için eş bağımlılıklar.
- [Hızlı başlangıç](./quickstart.md) — ilk istek, hata ayıklayıcı çalıştırma ve elle yönetilen oturum.
- [Yapılandırma](./configuration.md) — `CreateClientOptions`, `DebuggerOptions` ve protokole özgü yapılandırma.
- [API başvurusu](./api-reference.md) — işlev alanına göre gruplandırılmış tüm dışa aktarımlar.
- [Örnekler](./examples.md) — HTTP, SSE, WebSocket, GraphQL, MCP ve gRPC için çalıştırılabilir örnekler.

## Lisans

MIT.
