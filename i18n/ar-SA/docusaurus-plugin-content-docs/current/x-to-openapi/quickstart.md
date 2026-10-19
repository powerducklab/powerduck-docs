---
sidebar_position: 3
title: "البدء السريع"
description: "ابدأ مع @powerduck/x-to-openapi: حوّل أوامر curl ومجموعات Postman وسجّل محوّلات مخصصة باستخدام XToOpenApi."
---

# البدء السريع

يغطي الدليل الطرق الثلاث الأكثر شيوعًا: الدالة المساعدة `curlToOpenApi`، والدالة `postmanToOpenApi`، والفئة `XToOpenApi` للتركيب المخصص.

المتطلب السابق: ثبّت الحزمة. [التثبيت](/docs/ar-SA/x-to-openapi/installation/)

:::note
جميع دوال التحويل **غير متزامنة** وتعيد [`ConvertResult`](/docs/ar-SA/x-to-openapi/api-reference/#convertresult). استخدم `await` دائمًا.
:::

## 1. تحويل أمر curl

مرّر أمر curl واحدًا إلى [`curlToOpenApi`](/docs/ar-SA/x-to-openapi/api-reference/#curltoopenapi). يحتوي الحقل `document` في النتيجة على كائن OpenAPI 3.2 المُنشأ.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

يبدو المستند الناتج كما يلي، مع اختصار بعض أجزائه:

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

تحقق من نجاح التحويل وافحص رسائل التشخيص:

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. تحويل مجموعة Postman

مرّر كائن مجموعة محلّلًا أو سلسلة JSON إلى [`postmanToOpenApi`](/docs/ar-SA/x-to-openapi/api-reference/). تُحفَظ برامج الاختبار النصية ضمن `x-postman-scripts`.

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

يمكن استخدام سلسلة JSON أيضًا:

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. استخدام الفئة `XToOpenApi` مع خيارات مخصصة

استخدم الفئة للتحكم الصريح في المحوّلات المسجّلة و[`ConvertOptions`](/docs/ar-SA/x-to-openapi/api-reference/#convertoptions).

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

### تسجيل عدة محوّلات واستخدام `"auto"`

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. التشخيص والوضع الصارم

افتراضيًا، يجمع التحويل المشكلات في عناصر [`Diagnostic`](/docs/ar-SA/x-to-openapi/api-reference/) ويعيد نتيجة رغم ذلك. اضبط `strict: true` لإطلاق [`ConversionError`](/docs/ar-SA/x-to-openapi/api-reference/#conversionerror) عند أول تشخيص بمستوى خطأ.

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

## الخطوات التالية

- [أمثلة](/docs/ar-SA/x-to-openapi/examples/) — تحويل دفعات curl، واستنتاج معاملات المسار، ومصادقة Postman، ومحوّل مخصص.
- [مرجع API](/docs/ar-SA/x-to-openapi/api-reference/) — جميع العناصر المصدَّرة والخيارات ورموز التشخيص.
