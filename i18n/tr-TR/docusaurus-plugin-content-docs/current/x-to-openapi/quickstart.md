---
sidebar_position: 3
title: "Hızlı başlangıç"
description: "@powerduck/x-to-openapi ile başlayın: curl komutlarını ve Postman koleksiyonlarını dönüştürün, XToOpenApi ile özel bağdaştırıcılar kaydedin."
---

# Hızlı başlangıç

Bu kılavuz en yaygın üç yolu ele alır: `curlToOpenApi` yardımcısı, `postmanToOpenApi` yardımcısı ve özel kurulumlar için `XToOpenApi` sınıfı.

Ön koşul: paketi kurun. [Kurulum](/docs/tr-TR/x-to-openapi/installation/)

:::note
Tüm dönüştürme işlevleri **asenkron** çalışır ve bir [`ConvertResult`](/docs/tr-TR/x-to-openapi/api-reference/#convertresult) döndürür. Her zaman `await` kullanın.
:::

## 1. curl komutunu dönüştürme

Tek bir curl komutunu [`curlToOpenApi`](/docs/tr-TR/x-to-openapi/api-reference/#curltoopenapi) işlevine iletin. Sonucun `document` alanı, oluşturulan OpenAPI 3.2 nesnesidir.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

Oluşturulan belgenin kısaltılmış hâli şöyledir:

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

Dönüştürmenin başarılı olup olmadığını ve tanılama iletilerini inceleyin:

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. Postman koleksiyonunu dönüştürme

Ayrıştırılmış koleksiyon nesnesini veya JSON dizesini [`postmanToOpenApi`](/docs/tr-TR/x-to-openapi/api-reference/) işlevine iletin. Test betikleri `x-postman-scripts` olarak korunur.

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

JSON dizesi de kullanılabilir:

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. Özel seçeneklerle `XToOpenApi` sınıfını kullanma

Kayıtlı bağdaştırıcıları ve [`ConvertOptions`](/docs/tr-TR/x-to-openapi/api-reference/#convertoptions) değerlerini açıkça denetlemek için sınıfı kullanın.

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

### Birden fazla bağdaştırıcı kaydetme ve `"auto"` kullanma

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. Tanılama ve katı mod

Varsayılan olarak dönüştürme, sorunları [`Diagnostic`](/docs/tr-TR/x-to-openapi/api-reference/) kayıtları olarak toplar ve yine de sonuç döndürür. Hata düzeyindeki ilk tanılamada [`ConversionError`](/docs/tr-TR/x-to-openapi/api-reference/#conversionerror) fırlatmak için `strict: true` ayarlayın.

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

## Sonraki adımlar

- [Örnekler](/docs/tr-TR/x-to-openapi/examples/) — Toplu curl, yol parametresi çıkarımı, Postman kimlik doğrulaması ve özel bağdaştırıcı.
- [API başvurusu](/docs/tr-TR/x-to-openapi/api-reference/) — Tüm dışa aktarımlar, seçenekler ve tanılama kodları.
