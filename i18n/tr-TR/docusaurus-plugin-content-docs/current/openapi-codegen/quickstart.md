---
sidebar_position: 3
title: "Hızlı başlangıç"
description: "@powerduck/openapi-codegen ile ilk çalıştırılabilir istek örneğinizi oluşturun ve kullanılabilir üreticileri listeleyin."
---

# Hızlı başlangıç

Bu kılavuz, çalıştırılabilir bir istek örneği oluşturmayı ve kullanılabilir üreticileri bulmayı gösterir.

## 1. Kurulum

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. Belgeden kod üretme

**Ayrıştırılmış** bir OpenAPI belgesiyle birlikte hedef `path`, `method`, `language` ve `client` değerlerini verin. `generate()`, kaynak kodunu bir dize olarak döndürür.

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

CommonJS karşılığı:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. Kullanılabilir üreticileri listeleme

`list()`, kayıtlı tüm üreticilerin tanımlayıcılarını döndürür:

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

Her tanımlayıcı `{ language: string; client: string }` biçimindedir. Kimlikler büyük/küçük harfe duyarlıdır; API başvurusundaki üretici listesinde yer alan değerleri aynen kullanın. [API başvurusu](/docs/tr-TR/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

Üreticiyi kod aracılığıyla da seçebilirsiniz:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. Kimlik bilgilerini sağlama

Adlandırılmış güvenlik şemalarının değerlerini doldurmak için `securityValues` kullanın. Anahtarlar belgedeki güvenlik şeması adlarıyla eşleşmelidir:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. Sunucu URL’sini geçersiz kılma

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## Hata yönetimi

Girdi eksik olduğunda veya üretici desteklenmediğinde `generate()` istisna fırlatır. Güvenilmeyen belgeleri işlerken istisnaları yakalayın:

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## Sonraki adımlar

- [Yapılandırma](/docs/tr-TR/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Örnekler](/docs/tr-TR/openapi-codegen/examples/) — JavaScript fetch, Python requests, cURL, özel üretici, eklenti ve doğrudan `RequestIR` kullanımı.
- [API başvurusu](/docs/tr-TR/openapi-codegen/api-reference/) — Dışa aktarılan tüm öğeler.
