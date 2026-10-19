---
sidebar_position: 5
title: "أمثلة"
description: "أمثلة عملية لـ @powerduck/openapi-codegen: JavaScript fetch وPython requests وcURL والمولّدات المخصصة والإضافات واستخدام RequestIR مباشرة."
---

# أمثلة

أمثلة عملية لـ `@powerduck/openapi-codegen`. تفترض جميعها وجود كائن مستند OpenAPI محلّل باسم `document`.

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

عملاء JavaScript الآخرون: `axios` و`ofetch` و`jquery` و`xhr`. وللبدائل على خادم Node، استخدم `node/fetch` أو `node/axios` أو `node/ofetch` أو `node/undici`.

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

عملاء Python الآخرون: `aiohttp` و`http-client` و`httpx-sync` و`httpx-async`.

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

عملاء shell الآخرون: `wget` و`httpie`. لرفع `multipart/form-data`، يُفضَّل `shell/curl` أو `shell/httpie` على `shell/wget`.

## 4. اكتشاف مولّد واختياره

استخدم `list()` لمعرفة المولّدات المتاحة، ثم ولّد الشيفرة بزوج اللغة والعميل المختار:

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

## 5. تسجيل مولّد مخصص

نفّذ الواجهة `Generator` واستدعِ `register`:

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

## 6. استخدام إضافة

تجمع الإضافة تسجيل مولّد واحد أو أكثر عبر `use()`:

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

## 7. التوليد مباشرة من `RequestIR`

أنشئ `RequestIR` بنفسك لتجاوز `normalize` بالكامل:

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

## 8. معالجة الأخطاء

تطلق `generate()` أخطاء عند غياب المدخلات أو عدم معرفة المولّد أو تعذّر حل المراجع. التقط الأخطاء دائمًا عند معالجة مدخلات غير موثوقة:

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

تشمل رسائل الخطأ المتوقعة `Unsupported generator: ...` و`Path not found: ...` و`Operation not found: METHOD /path`.

## 9. الوضع المتسامح مع `$ref`

إذا احتمل وجود مراجع معطوبة أو دائرية، مرّر `softRefMode: true` لمتابعة الحل بنتائج جزئية بدلًا من إطلاق خطأ:

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
