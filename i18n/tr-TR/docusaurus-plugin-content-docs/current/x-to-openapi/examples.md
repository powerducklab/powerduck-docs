---
sidebar_position: 5
title: "Örnekler"
description: "Genel API ile hazırlanmış, çalıştırılabilir pratik örnekler"
---

# Örnekler

Genel API ile hazırlanmış, çalıştırılabilir pratik örnekler. Dönüştürme işlevleri eşzamansızdır; `await` kullanın. Girdi yerel olarak ayrıştırılır ve kaydedilen HTTP istekleri gönderilmez.

---

## 1. Temel curl komutu

Tek bir curl komutunu dönüştürün ve üretilen belgeyi inceleyin.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36,"tags":["admin","user"]}'`,
);

console.log(result.document.openapi);            // "3.2.0"
console.log(result.ok, result.documentValid);    // true true

const post = result.document.paths["/users"].post;
const body = post?.requestBody;
if (!body || !("content" in body)) throw new Error("Expected an inline request body");
const media = body.content["application/json"];
console.log(media && "schema" in media ? media.schema : undefined);
// {
//   type: "object",
//   properties: {
//     name: { type: "string" },
//     age: { type: "integer" },
//     tags: { type: "array", items: { type: "string" } }
//   },
//   required: ["name", "age", "tags"]
// }
```

Başarı durumunda bile tanılama bilgileri döndürülür:

```typescript
for (const d of result.diagnostics) {
  console.log(`[${d.severity}] ${d.code}: ${d.message}`);
}
```

---

## 2. Birden çok curl komutunu toplu dönüştürme

Komut dizisi veya birden çok komut içeren dize iletin. Aynı yöntem ve yolu paylaşan istekler birleştirilir; şemalar yapısal olarak birleştirilir.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users",
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    `curl -X POST https://api.example.com/users \
       -H 'Content-Type: application/json' \
       --data '{"name":"Ada"}'`,
  ],
  {
    title: "User API",
    version: "2.0.0",
    useServerBasePath: false,
    inferPathParameters: true,
  },
);

// The two detail requests are grouped; /users remains a separate path.
console.log(Object.keys(result.document.paths)); // ["/users", "/users/{userId}"]
```

### Tarayıcının “Tümünü cURL olarak kopyala” çıktısı

Bloğun tamamını yapıştırın: [`splitCurlCommands`](./api-reference.md#splitcurlcommands) tırnakları, satır devamlarını, istemleri ve `curl.exe` biçimini işler.

```typescript
const block = `
$ curl 'https://api.example.com/users/1?active=true'
> curl 'https://api.example.com/users/2' -X POST \
  -H 'Content-Type: application/json' --data '{"name":"Ada"}'`;

const result = await curlToOpenApi(block, { title: "Pasted traffic" });
```

---

## 3. Postman koleksiyonu

Koleksiyon nesnesini dönüştürün. İç içe klasörler, kimlik doğrulama mirası ve test betikleri dikkate alınır.

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
  item: [
    {
      name: "Users",
      item: [
        {
          name: "Create user",
          request: {
            method: "POST",
            url: "https://api.example.com/users",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: '{"name":"Ada","role":"admin"}',
              options: { raw: { language: "json" } },
            },
          },
          event: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: ["pm.test('status is 201', () => pm.response.to.have.status(201));"],
              },
            },
          ],
        },
      ],
    },
  ],
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// Collection-level bearer auth becomes a securityScheme + operation security.
console.log(result.document.components?.securitySchemes);
// { bearerAuth: { type: "http", scheme: "bearer" } }

// The Postman test script is preserved:
console.log(result.document.paths["/users"].post["x-postman-scripts"]);
// { test: "pm.test('status is 201', () => ...)" }
```

JSON dizesi de kullanılabilir:

```typescript
const fromText = await postmanToOpenApi(JSON.stringify(collection));
```

---

## 4. Yol parametresi çıkarımı

`inferPathParameters` açıkken (varsayılan), istekler yöntem, kaynak ve yol yapısına göre gruplanır. Bir bölüm ancak grubunda en az `pathParameterMinSamples` istek bulunduğunda, değerler değiştiğinde ve **her** değer bir tanımlayıcıya benzediğinde parametreye dönüştürülür: sayı, UUID, ULID veya en az 8 karakterli onaltılık dize.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    "curl https://api.example.com/users/123/posts/abc12345",
    "curl https://api.example.com/users/456/posts/def45678",
  ],
  { pathParameterMinSamples: 2 },
);

console.log(Object.keys(result.document.paths));
// [ "/users/{userId}", "/users/{userId}/posts/{postId}" ]
```

Parametre adları en yakın önceki sabit bölümden, tekilleştirilip camelCase biçimine dönüştürülerek üretilir:

| Yol kalıbı | Parametre adları |
|---|---|
| `/users/{}` | `userId` |
| `/users/{}/posts/{}` | `userId`, `postId` |
| `/categories/{}/items/{}` | `categoryId`, `itemId` |
| `/{}` | `param1` |

Aynı yoldaki yinelenen adlara sayısal ekler verilir (`userId`, `userId2`).

Yol bölümlerini olduğu gibi korumak için çıkarımı kapatın:

```typescript
await curlToOpenApi(commands, { inferPathParameters: false });
```

---

## 5. Özel bağdaştırıcı

HAR, HTTPie veya Insomnia gibi yeni bir kaynak eklemek için [`SourceAdapter`](./api-reference.md) uygulayın, ardından `XToOpenApi` üzerine kaydedin.

```typescript
import {
  XToOpenApi,
  CurlAdapter,
  type SourceAdapter,
  type NormalizedRequest,
  type AdapterContext,
} from "@powerduck/x-to-openapi";

// A trivial adapter that emits a single GET request.
class PingAdapter implements SourceAdapter<{ url: string }> {
  readonly id = "ping";

  canHandle(input: unknown): boolean {
    return (
      typeof input === "object" &&
      input !== null &&
      "url" in (input as Record<string, unknown>)
    );
  }

  async parse(
    input: { url: string },
    context: AdapterContext,
  ): Promise<NormalizedRequest[]> {
    let url: URL;
    try {
      url = new URL(input.url);
    } catch (cause) {
      context.report({
        code: "ADAPTER_PARSE_FAILED",
        severity: "error",
        source: this.id,
        message: `Invalid URL: ${input.url}`,
        cause,
      });
      return [];
    }

    return [
      {
        source: this.id,
        sourceIndex: 0,
        method: "get",
        url,
        urlString: url.toString(),
        headers: [],
        query: [],
        cookies: [],
      },
    ];
  }
}

const converter = new XToOpenApi()
  .register(new PingAdapter())
  .register(new CurlAdapter());

// Explicit adapter id:
const a = await converter.convert("ping", { url: "https://api.example.com/health" });

// Auto-detect:
const b = await converter.convert("auto", { url: "https://api.example.com/health" });

console.log(a.document.paths["/health"]?.get?.operationId);
```

---

## 6. Hata işleme ve katı mod

Sorunlar `result.diagnostics` içinde toplanır. `strict: true` ayarında hata düzeyindeki tanılar [`ConversionError`](./api-reference.md#conversionerror) fırlatır; yalnızca uyarı olması buna yol açmaz. Geçersiz seçenekler ve bilinmeyen bağdaştırıcı kimlikleri de istisna fırlatabilir.

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

// Soft mode: inspect diagnostics yourself.
const soft = await curlToOpenApi("curl https://api.example.com/health");
if (!soft.ok) {
  for (const d of soft.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}

// Strict mode: throw on the first error-severity diagnostic.
try {
  await curlToOpenApi("not a curl command at all", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Conversion failed:", error.message);
    for (const d of error.diagnostics) console.error(`  ${d.code}`);
  }
}
```

Geçerli boyut denetimi, bir dize veya dizideki dize öğelerinin toplamı 10 × 1024 × 1024 JavaScript dize kod birimini aşarsa `strict` değerinden bağımsız olarak `ConversionError` fırlatır. Bu bir UTF-8 bayt sınırı değildir ve ayrıştırılmış nesneleri ölçmez; güvenilmeyen girdileri kabul etmeden önce kendi bayt sınırınızı uygulayın.

---

## Sonraki adımlar

- [API Başvurusu](./api-reference.md): seçeneklerin varsayılanları ve tanılama kodları.
- [Hızlı başlangıç](./quickstart.md): ilk uçtan uca dönüştürmeniz.
