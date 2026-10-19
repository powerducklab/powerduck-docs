---
sidebar_position: 5
title: "Örnekler"
description: "@powerduck/openapi-codegen uygulama örnekleri: JavaScript fetch, Python requests, cURL, özel üreticiler, eklentiler ve doğrudan RequestIR."
---

# Örnekler

`@powerduck/openapi-codegen` için uygulama örnekleri. Tüm örneklerde `document` adlı ayrıştırılmış bir OpenAPI belge nesnesinin bulunduğu varsayılır.

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

Diğer JavaScript istemcileri: `axios`, `ofetch`, `jquery`, `xhr`. Sunucu tarafındaki Node karşılıkları için `node/fetch`, `node/axios`, `node/ofetch` veya `node/undici` kullanın.

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

Diğer Python istemcileri: `aiohttp`, `http-client`, `httpx-sync`, `httpx-async`.

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

Diğer shell istemcileri: `wget` ve `httpie`. `multipart/form-data` yüklemelerinde `shell/wget` yerine `shell/curl` veya `shell/httpie` tercih edin.

## 4. Üreticileri bulma ve seçme

Kullanılabilir üreticileri görmek için `list()` kullanın, ardından seçilen dil ve istemci çiftiyle üretin:

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

## 5. Özel üretici kaydetme

`Generator` arayüzünü uygulayıp `register` çağırın:

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

## 6. Eklenti kullanma

Eklenti, bir veya daha fazla üretici kaydını `use()` üzerinden bir araya getirir:

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

## 7. Doğrudan `RequestIR` üzerinden üretme

`RequestIR` nesnesini kendiniz oluşturarak `normalize` adımını tamamen atlayın:

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

## 8. Hata yönetimi

`generate()` eksik girdi, bilinmeyen üretici ve çözümlenemeyen başvurularda hata fırlatır. Güvenilmeyen girdiyi işlerken hataları her zaman yakalayın:

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

Olası hata iletileri arasında `Unsupported generator: ...`, `Path not found: ...` ve `Operation not found: METHOD /path` bulunur.

## 9. Esnek `$ref` modu

Belgede bozuk veya döngüsel başvurular bulunabilecekse `softRefMode: true` iletin. Böylece hata fırlatmak yerine kısmi sonuçlarla çözümleme sürer:

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
