---
sidebar_position: 4
title: "الإعدادات"
description: "تنقسم الإعدادات إلى ثلاث طبقات: خيارات دوال إنشاء العميل أو مصحح الأخطاء، وكائن SendOptions الممرَّر إلى prepare() وsend()، والخيارات الخاصة بكل بروتوكول."
---

# الإعدادات

تنقسم الإعدادات إلى ثلاث طبقات: خيارات دوال إنشاء العميل أو مصحح الأخطاء، وكائن `SendOptions` الممرَّر إلى `prepare()` و`send()`، والخيارات الخاصة بكل بروتوكول.

## خيارات دوال الإنشاء

### `CreateClientOptions`

تُمرَّر إلى `createClient(options?)`. جميع الحقول اختيارية.

| الحقل | النوع | الوصف |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | التحكم في كيفية دمج الاستجابات في المواصفة |
| `response` | `ToResponseOptions` | التحكم في كيفية توحيد بنية كائنات الاستجابة |

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: {
    overwriteExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    includeExamples: false,
    // ... other ToResponseOptions
  },
});
```

### `DebuggerOptions`

تُمرَّر إلى `createDebugger(config?)`. جميع الحقول اختيارية.

| الحقل | النوع | الوصف |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | قائمة محولات مخصصة تستبدل جميع المحولات الافتراضية |
| `extraAdapters` | `ProtocolAdapter[]` | محولات إضافية تُضاف إلى السجل الافتراضي |
| `writeBack` | `WriteBackOptions` | خيارات الكتابة في المواصفة |
| `response` | `ToResponseOptions` | خيارات توحيد بنية الاستجابة |
| `writeBackTruncated` | `boolean` | كتابة المخطط المستنتج من التدفقات المبتورة في المواصفة؛ القيمة الافتراضية: `true` |

```typescript
import { createDebugger, HttpAdapter, WebSocketAdapter } from "@powerduck/openapi-request";

// Use only HTTP and WebSocket adapters
const debugger1 = createDebugger({
  adapters: [new HttpAdapter(), new WebSocketAdapter()],
});

// Add a custom adapter to the defaults
const debugger2 = createDebugger({
  extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});
```

### الكتابة في المواصفة والأمثلة الملتقطة

يدعم `WriteBackOptions` الخيارات `strategy` (إما `"merge"` أو `"replace"`، والافتراضي `"merge"`)، و`keepExistingDescription` (الافتراضي `true`)، و`allowedStatusCodes` (القيمة الفارغة تعني جميع الرموز)، و`protectComponentRefs` (الافتراضي `true`)، و`overwriteExamples` (الافتراضي `true`)، و`requirePassingTests`. يطبق مسار الإرسال شرط اجتياز الاختبارات، أما استدعاء `writeBackResponse` مباشرة فلا يطبقه.

يدعم `ToResponseOptions` الخيارات `includeExamples` (الافتراضي `true`)، و`maxExampleChars` (الافتراضي `4000`)، و`maxEventPreviewChars` (الافتراضي `200`). عطّل التقاط الأمثلة أو راجعها قبل النشر، فقد تتضمن الاستجابات الفعلية بيانات اعتماد أو بيانات شخصية.

يعيد مسار الإرسال عادةً نسخة معدلة في `patchedSpec`؛ ولا يعدّل مستند الإدخال أو يحفظ ملفًا. اضبط `writeBack: false` لكل استدعاء تريد فيه تجاوز هذه الخطوة. يحدد كائن `writeBack` في دالة الإنشاء كيفية الدمج، بينما تتيح القيمة المنطقية الخاصة بكل استدعاء تفعيل الكتابة أو تعطيلها.

## `SendOptions`

كائن الإدخال الرئيسي للدالتين `prepare()` و`send()`. تُمرَّر من خلاله المواصفة والهدف والقيم وجميع إعدادات الطلب.

| الحقل | النوع | مطلوب | الوصف |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | نعم | مستند OpenAPI 3.2 كامل |
| `target` | `OperationTarget` | نعم | معرّف العملية؛ انظر أدناه |
| `values` | `RequestValues` | لا | القيم الفعلية للمسار والاستعلام والترويسات وملفات تعريف الارتباط والمحتوى |
| `serverUrl` | `string` | لا | يتجاوز `spec.servers[0].url` |
| `serverVariables` | `Record<string, string>` | لا | متغيرات قالب عنوان URL للخادم |
| `variables` | `Record<string, string>` | لا | متغيرات البيئة المشار إليها بصيغة `{{name}}` |
| `globals` | `Record<string, string>` | لا | متغيرات عامة بأسلوب Postman |
| `localVariables` | `Record<string, string>` | لا | متغيرات محلية |
| `collectionVariables` | `Record<string, string>` | لا | متغيرات على مستوى المجموعة |
| `auth` | `AuthConfig` | لا | إعدادات المصادقة |
| `scripts` | `ScriptConfig` | لا | البرامج النصية السابقة للطلب وبرامج الاختبار |
| `runner` | `RuntimeRunOptions` | لا | تمرير جميع خيارات postman-runtime مباشرةً، بأعلى أولوية |
| `websocket` | `WebSocketOptions` | لا | خيارات خاصة بـ WebSocket |
| `graphql` | `GraphQLOptions` | لا | خيارات خاصة بـ GraphQL |
| `mcp` | `McpOptions` | لا | خيارات خاصة بـ MCP |
| `grpc` | `any` | لا | خيارات خاصة بـ gRPC |
| `timeout` | `number` | لا | مهلة كل طلب بالمللي ثانية؛ اختصار للإعداد `runner.timeout.request` |

يقبل `SendOptions` أيضًا خيارات التحكم التالية للتنفيذ والتدفق:

| الحقل | النوع | الوصف |
| --- | --- | --- |
| `fetch` | `typeof fetch` | وسيلة نقل fetch معزولة يوفرها التطبيق المضيف حيث تكون مدعومة؛ يظل HTTP/SSE معتمدًا على postman-runtime. |
| `writeBack` | `boolean` | اضبطه على `false` لإبقاء `patchedSpec` غير معرّف مع الاستمرار في إنشاء `responseFragment`. |
| `signal` | `AbortSignal` | إلغاء التنفيذ أو أخذ العينات؛ قد تُعاد نتيجة جزئية مع ذلك. |
| `maxEvents` | `number` | الحد الأقصى لعدد أحداث التدفق المحتفظ بها. |
| `maxStreamMs` | `number` | المدة القصوى لأخذ عينات التدفق بالمللي ثانية. |
| `maxResponseSize` | `number` | الحد الأقصى لحجم الاستجابة بالبايت. |
| `maxBufferChars` | `number` | حد ذاكرة التخزين المؤقت لمحلل SSE قبل حدّ الحدث؛ الافتراضي `4194304` محرفًا. |
| `maxEventChars` | `number` | حد البيانات المحتفظ بها لكل حدث SSE؛ الافتراضي `1048576` محرفًا. |
| `inheritEventId` | `boolean` | وراثة معرّف آخر حدث SSE عند غياب المعرّف؛ الافتراضي `true`. اضبطه على `false` لاستنتاج مخطط أكثر صرامة. |
| `onEvent` | `(event: StreamEvent) => void` | تلقي أحداث التدفق. |
| `onConsole` | `(log: ConsoleLog) => void` | تلقي مخرجات وحدة تحكم البرامج النصية. |
| `onAssertion` | `(assertion: AssertionResult) => void` | تلقي نتائج التحققات. |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | فحص ترويسات HTTP/SSE المبكرة وتصنيف `streaming`. |
| `onOpen` | `(info) => void` | تلقي تفاصيل اتصال WebSocket: عنوان URL والبروتوكول والترويسات. |

قد تفسر محولات البروتوكولات الحدود بطرق مختلفة. اجعل دوال رد النداء الخاصة بالواجهة خفيفة؛ تلتقط طبقة التنفيذ الاستثناءات التي تطرحها هذه الدوال. لإعدادات مرسل طلبات HTTP، استخدم `runner.requester`؛ ويجب أن تكون قيمة `maxResponseSize` موجبة وليست صفرًا عند تحديدها.

### `OperationTarget`

يحدد عملية واحدة. يُفضَّل استخدام `operationId` أو `method` + `path`. عند توفير الاثنين، تكون الأولوية لـ `operationId`.

| الحقل | النوع | الوصف |
| --- | --- | --- |
| `operationId` | `string` | مفتاح بحث بديل له أولوية على المسار والطريقة |
| `method` | `string` | طريقة HTTP غير حساسة لحالة الأحرف. تتطلب `path`. |
| `path` | `string` | مسار بقالب مثل `/users/{id}`. يتطلب `method`. |

```typescript
// By operationId (recommended)
const result1 = await client.send({
  spec,
  target: { operationId: "getUserById" },
});

// By method + path
const result2 = await client.send({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

### `RequestValues`

القيم الفعلية التي تُدرج في الطلب المُنشأ.

| الحقل | النوع | الوصف |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | قيم معاملات المسار |
| `query` | `Record<string, unknown>` | قيم معاملات الاستعلام |
| `header` | `Record<string, unknown>` | قيم الترويسات |
| `cookie` | `Record<string, unknown>` | قيم ملفات تعريف الارتباط |
| `querystring` | `string` | سلسلة استعلام خام مرمَّزة مسبقًا؛ موضع `querystring` في OpenAPI 3.2 |
| `body` | `unknown` | محتوى الطلب |
| `contentType` | `string` | فرض نوع وسائط محدد للطلب عندما تعلن العملية عن عدة أنواع |

```typescript
const result = await client.send({
  spec,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { version: "2" },
    header: { "X-Request-Id": "abc-123" },
    body: { name: "Alice", email: "alice@example.com" },
    contentType: "application/json",
  },
});
```

### `AuthConfig`

| الحقل | النوع | الوصف |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | نوع المصادقة |
| `token` | `string` | رمز Bearer عند استخدام `type: "bearer"` |
| `username` | `string` | اسم المستخدم للمصادقة Basic عند استخدام `type: "basic"` |
| `password` | `string` | كلمة المرور للمصادقة Basic عند استخدام `type: "basic"` |
| `key` | `string` | اسم مفتاح API عند استخدام `type: "apikey"` |
| `value` | `string` | قيمة مفتاح API عند استخدام `type: "apikey"` |
| `in` | `"header" \| "query"` | موضع مفتاح API عند استخدام `type: "apikey"` |

```typescript
// Bearer token
const result1 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "bearer", token: "your-jwt-token" },
});

// Basic auth
const result2 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "basic", username: "admin", password: "secret" },
});

// API key in header
const result3 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "apikey", key: "X-API-Key", value: "key-123", in: "header" },
});
```

تشمل أنواع المصادقة المتقدمة `digest` و`oauth1` و`oauth2` و`jwt` و`hawk` و`aws4` و`ntlm` و`asap` و`edgegrid`. مرّر حقول مساعدات Postman الخاصة بـ HTTP/SSE/GraphQL عبر `parameters: Record<string, string | boolean | number>`. يتيح الخيار `oauth2: OAuth2FlowConfig` الحصول على الرموز وتجديدها لنوع OAuth 2.0؛ لا تفترض أن كل مساعد مصادقة ينطبق على جميع البروتوكولات.

### `ScriptConfig`

| الحقل | النوع | الوصف |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | برامج نصية سابقة للطلب على مستوى المجموعة |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | برامج اختبار على مستوى المجموعة |
| `preRequest` | `ScriptSource \| ScriptSource[]` | برامج نصية سابقة للطلب على مستوى الطلب |
| `test` | `ScriptSource \| ScriptSource[]` | برامج اختبار على مستوى الطلب |
| `fromSpecExtensions` | `boolean` | قراءة `x-postman-scripts` من المواصفة؛ الافتراضي: `true` |
| `captureLastResponse` | `boolean` | إضافة مساعد مدمج يتيح للطلبات اللاحقة الوصول إلى آخر استجابة |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

اضبط `scripts.fromSpecExtensions: false` إذا لم تكن تنوي تنفيذ البرامج النصية المضمّنة في مواصفة مستوردة. القيمة الافتراضية الحالية هي `true`؛ لا تعتمد على احتمال تغييرها مستقبلًا.

## خيارات خاصة بالبروتوكولات

### HTTP / SSE

HTTP هو المحول الافتراضي. يشير المحتوى المعلن من النوع `text/event-stream` إلى نية استخدام SSE؛ ويصنّف التنفيذ أيضًا الاستجابة الفعلية عند وصول الترويسات. الدالة `probeStreamingResponse()` فحص مستقل يُستدعى صراحةً، وليست خطوة تلقائية تسبق كل استدعاء.

لا تتطلب طلبات HTTP الأساسية إعدادات إضافية. استخدم `SendOptions.runner` لإعدادات postman-runtime المتقدمة.

### WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
  // Manual-session options are distinct from SendOptions.websocket.
});
```

### MCP

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "mcp",
  endpoint: "https://api.example.com/mcp",
});
```

تستخدم جلسة MCP اليدوية الافتراضية Streamable HTTP و`endpoint`. لاستخدام stdio، مرّر `kind: "mcp"` و`transport: "stdio"` وأمرًا محليًا في `command` مع `args` اختيارية؛ يؤدي بدء الجلسة إلى تشغيل العملية المحددة.

### gRPC

يتطلب gRPC عنوانًا ومصدرًا للواصفات، سواء ملفات `.proto` أو انعكاس الخادم، إضافةً إلى اسم الخدمة المؤهل بالكامل والطريقة:

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "grpc",
  address: "localhost:50051",
  service: "powerduck.examples.Echo",
  method: "Echo",
  protoPaths: ["./echo.proto"],
});
```

تعيد دوال إنشاء الجلسات اليدوية جلسة لم تُفتح بعد. استدعِ `open()` قبل الإرسال و`close()` عند تحرير الموارد. يتطلب مثال gRPC خادمًا محليًا وملف proto متوافقين؛ خيارات الجلسة اليدوية ليست هي كائن `SendOptions.grpc`.

## مثال كامل

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const result = await client.send({
  spec: openApiDocument,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { verbose: "true" },
    header: { "X-Request-Id": "req-abc" },
    body: { name: "Alice", email: "alice@example.com" },
  },
  serverUrl: "https://api.staging.example.com",
  auth: { type: "bearer", token: "staging-token" },
  timeout: 10000,
  variables: {
    environment: "staging",
  },
});

console.log(result.response.status);
console.log(result.response.body);
console.log(result.response.headers);
```

## الخطوات التالية

- راجع [مرجع API](./api-reference.md) للاطلاع على جميع الأنواع المصدَّرة
- تصفح [الأمثلة](./examples.md) للاطلاع على طرق الاستخدام الخاصة بكل بروتوكول
