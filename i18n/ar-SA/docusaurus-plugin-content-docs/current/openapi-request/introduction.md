---
sidebar_position: 1
title: "مقدمة إلى @powerduck/openapi-request"
description: "@powerduck/openapi-request مكتبة لتصحيح مجموعات الطلبات وتنفيذها باستخدام OpenAPI 3.2. تبني الطلبات انطلاقًا من مستند OpenAPI وترسلها، وتتعرف على الاستجابات المتدفقة، ويمكنها إنشاء مستند محدّث من الاستجابات المرصودة. وتتيح واجهة موجزة واحدة استخدام ستة بروتوكولات اتصال."
---

# مقدمة إلى @powerduck/openapi-request

`@powerduck/openapi-request` مكتبة لتصحيح مجموعات الطلبات وتنفيذها باستخدام OpenAPI 3.2. تبني الطلبات انطلاقًا من مستند OpenAPI وترسلها، وتتعرف على الاستجابات المتدفقة، ويمكنها إنشاء مستند محدّث من الاستجابات المرصودة. وتتيح واجهة موجزة واحدة استخدام ستة بروتوكولات اتصال.

- **اسم الحزمة:** `@powerduck/openapi-request`
- **الإصدار:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **الترخيص:** MIT
- **صيغة الوحدات:** نسختا ESM وCommonJS مع تضمين تعريفات الأنواع.

## استخدامات المكتبة

تلبي المكتبة ثلاث حاجات اعتمادًا على المستند نفسه بوصفه المرجع الأساسي:

- **عميل مخصص للواجهات الرسومية** — تعيد `createClient()` كائنًا يتضمن الطرق `prepare()` و`send()` و`connect()` و`discover()` و`writeback()`، بما يتوافق مع مراحل العمل في محرر الطلبات الرسومي.
- **مصحح أخطاء قابل للتحكم بالبرامج النصية** — تعيد `createDebugger()` كائن `ProtoKit` يتضمن `send()` و`sendMany()` و`toCollection()` للأتمتة والبرامج النصية والتكامل المستمر.
- **جلسات طويلة الأمد تُدار يدويًا** — تعيد `createManualSession()` كائن جلسة ثنائية الاتجاه يتضمن الفتح والإرسال والإغلاق وتدفق الأحداث. وتكون بنيته موحّدة في WebSocket وMCP وgRPC، مما يتيح لواجهة واحدة إدارة البروتوكولات الثلاثة.

## محوّلات البروتوكولات

لا يعتمد الجزء الأساسي على وسيلة نقل محددة؛ إذ توفر محوّلات البروتوكولات المسجلة في `AdapterRegistry` السلوك الخاص بكل بروتوكول.

- **HTTP / SSE** — مدعومان افتراضيًا. يجري التعرف تلقائيًا على طلبات JSON العادية وتدفقات الأحداث المرسلة من الخادم، اعتمادًا على أنواع المحتوى المعلنة أو ترويسات الاستجابة الفعلية.
- **WebSocket** — جلسات نصية أو ثنائية ثنائية الاتجاه، مع بنية موحّدة للأحداث.
- **gRPC** — استدعاءات أحادية، وتدفق من الخادم، وتدفق من العميل، وتدفق ثنائي الاتجاه، باستخدام ملفات `.proto` أو الاستكشاف الانعكاسي للخادم.
- **MCP** — استدعاء أدوات Model Context Protocol عبر Streamable HTTP أو stdio.
- **GraphQL** — استكشاف البنية وتوليد العمليات وتنفيذها.

## الميزات الأساسية

- **نموذج مجموعات OpenAPI 3.2** — تحديد العمليات بواسطة `operationId` أو `method`+`path`، وبناء الطلبات من المعاملات وأجسام الطلبات والأمثلة.
- **اكتشاف التدفق** — تصنّف `isStreamingOperation()` و`isSseContentType()` و`isStreamingContentType()` الاستجابات وفق أنواع المحتوى المعلنة، بينما تفحص `probeStreamingResponse()` ترويسات الاستجابة الفعلية.
- **إعادة كتابة الاستجابات في المستند** — تستنتج `inferSchema()` و`mergeSchema()` و`toResponseObject()` و`writeBackResponse()` مخططات الاستجابة وتعيد مستندًا محدّثًا. افتراضيًا، تعيده `send()` ضمن `patchedSpec` عند نجاح إعادة الكتابة؛ ويمكن تعطيل ذلك بضبط `writeBack: false`. لا يُعدّل المستند الأصلي ولا يُحفظ أي ملف تلقائيًا. افحص `writeBackSkippedReason` و`writeBackWarnings` قبل حفظ النتيجة بشكل دائم.
- **أدوات مساعدة للمخططات** — تولّد `sampleFromSchema()` بيانات نموذجية من مخطط.
- **تحميل التبعيات الكبيرة عند الحاجة** — تُحمّل تبعيات gRPC، وهي `@grpc/grpc-js` و`@grpc/proto-loader`، وتبعية MCP، وهي `@modelcontextprotocol/sdk`، عند أول استخدام؛ فلا يتحمل من يستخدم HTTP وحده كلفة تحميلها.

## التثبيت

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## البدء السريع

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

## الخطوات التالية

- [التثبيت](./installation.md) — بنية الحزمة، والتصديرات عبر المسارات الفرعية، والتبعيات النظيرة اللازمة لقدرات البروتوكولات.
- [البدء السريع](./quickstart.md) — أول طلب، وتشغيل مصحح الأخطاء، وجلسة يدوية.
- [الإعدادات](./configuration.md) — `CreateClientOptions` و`DebuggerOptions` وإعدادات كل بروتوكول.
- [مرجع API](./api-reference.md) — جميع التصديرات مرتبة حسب الوظيفة.
- [الأمثلة](./examples.md) — أمثلة قابلة للتشغيل على HTTP وSSE وWebSocket وGraphQL وMCP وgRPC.

## الترخيص

MIT.
