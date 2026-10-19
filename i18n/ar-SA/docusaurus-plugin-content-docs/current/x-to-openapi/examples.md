---
sidebar_position: 5
title: "أمثلة"
description: "أمثلة عملية قابلة للتنفيذ باستخدام API العامة"
---

# أمثلة

أمثلة عملية قابلة للتنفيذ باستخدام API العامة. دوال التحويل غير متزامنة، لذا استخدم `await`. تحلل هذه التحويلات المدخلات محليًا ولا ترسل طلبات HTTP المسجلة.

---

## 1. أمر curl أساسي

حوّل أمر curl واحدًا وافحص المستند الناتج.

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

تُعاد معلومات التشخيص دائمًا، حتى عند النجاح:

```typescript
for (const d of result.diagnostics) {
  console.log(`[${d.severity}] ${d.code}: ${d.message}`);
}
```

---

## 2. عدة أوامر curl دفعة واحدة

مرّر مصفوفة أوامر أو سلسلة تتضمن عدة أوامر. تُدمج الطلبات ذات الطريقة والمسار نفسيهما، وتُدمج المخططات وفق بنيتها.

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

### مخرجات «نسخ الكل بصيغة cURL» في المتصفح

ألصق الكتلة كاملة؛ تتعامل [`splitCurlCommands`](./api-reference.md#splitcurlcommands) مع علامات الاقتباس واستمرار الأسطر ومحارف المطالبة و`curl.exe`.

```typescript
const block = `
$ curl 'https://api.example.com/users/1?active=true'
> curl 'https://api.example.com/users/2' -X POST \
  -H 'Content-Type: application/json' --data '{"name":"Ada"}'`;

const result = await curlToOpenApi(block, { title: "Pasted traffic" });
```

---

## 3. مجموعة Postman

حوّل كائن مجموعة. تُراعى المجلدات المتداخلة ووراثة المصادقة وبرامج الاختبار.

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

يمكن استخدام سلسلة JSON أيضًا:

```typescript
const fromText = await postmanToOpenApi(JSON.stringify(collection));
```

---

## 4. استنتاج معاملات المسار

عند تفعيل `inferPathParameters`، وهو الإعداد الافتراضي، تُجمع الطلبات بحسب الطريقة والأصل وبنية المسار. لا يتحول المقطع إلى معامل إلا إذا تضمنت مجموعته `pathParameterMinSamples` طلبات على الأقل، وكانت القيم مختلفة، وبدت **كل** قيمة معرّفًا: رقمًا أو UUID أو ULID أو سلسلة سداسية عشرية من 8 محارف على الأقل.

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

تُشتق أسماء المعاملات من أقرب مقطع ثابت سابق، بعد تحويله إلى المفرد وصيغة camelCase:

| نمط المسار | أسماء المعاملات |
|---|---|
| `/users/{}` | `userId` |
| `/users/{}/posts/{}` | `userId`, `postId` |
| `/categories/{}/items/{}` | `categoryId`, `itemId` |
| `/{}` | `param1` |

تُضاف لواحق رقمية للأسماء المتكررة في المسار نفسه، مثل `userId` و`userId2`.

عطّل الاستنتاج للإبقاء على مقاطع المسار الأصلية:

```typescript
await curlToOpenApi(commands, { inferPathParameters: false });
```

---

## 5. محول مخصص

نفّذ [`SourceAdapter`](./api-reference.md) لإضافة مصدر مثل HAR أو HTTPie أو Insomnia، ثم سجّله في `XToOpenApi`.

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

## 6. معالجة الأخطاء والوضع الصارم

تُجمع المشكلات في `result.diagnostics`. عند ضبط `strict: true`، تطرح التشخيصات بمستوى خطأ استثناء [`ConversionError`](./api-reference.md#conversionerror)، أما التحذيرات وحدها فلا تفعل ذلك. قد تطرح الخيارات غير الصالحة ومعرّفات المحولات المجهولة استثناءات أيضًا.

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

يطرح فحص الحجم الحالي `ConversionError` عندما تتجاوز سلسلة أو مجموع عناصر السلاسل في مصفوفة 10 × 1024 × 1024 وحدة ترميز لسلاسل JavaScript، بصرف النظر عن `strict`. هذا ليس حدًا لبايتات UTF-8 ولا يقيس الكائنات المحللة مسبقًا؛ طبّق حدًا خاصًا بك بالبايت قبل قبول مدخلات غير موثوقة.

---

## الخطوات التالية

- [مرجع API](./api-reference.md): القيم الافتراضية للخيارات ورموز التشخيص.
- [البدء السريع](./quickstart.md): أول عملية تحويل كاملة.
