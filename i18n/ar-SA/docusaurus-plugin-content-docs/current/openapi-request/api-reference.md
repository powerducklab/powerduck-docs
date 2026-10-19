---
sidebar_position: 5
title: "مرجع API"
description: "مرجع واجهات التكامل الرئيسية في @powerduck/openapi-request"
---

# مرجع API

مرجع واجهات التكامل الرئيسية في `@powerduck/openapi-request`. تلخص الجداول العقود، بينما تتضمن تصريحات TypeScript في الحزمة جميع الصيغ المحمّلة والوسائط الاختيارية. لا تتطابق صادرات نقطة الدخول الرئيسية مع صادرات المسارات الفرعية للبروتوكولات.

## الواجهات الأساسية

### `createClient(options?): ProtoClient`

ينشئ العميل المخصص لواجهات المستخدم. الوسيط `options` اختياري.

**الوسائط:**

| الاسم | النوع | الوصف |
| --- | --- | --- |
| `options` | `CreateClientOptions` | إعدادات اختيارية |
| `options.writeBack` | `WriteBackOptions` | التحكم في كيفية دمج الاستجابات في المواصفة |
| `options.response` | `ToResponseOptions` | التحكم في كيفية توحيد بنية كائنات الاستجابة |

**القيمة المعادة:** كائن `ProtoClient` بالأساليب التالية:

| الأسلوب | التوقيع | الوصف |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | يخطط للطلب ويعيد البروتوكول ونمط العرض ونوع التدفق |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | ينفذ طلبًا |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | ينفذ مجموعة طلبات بنتائج مستقلة لكل هدف؛ لا يؤدي فشل طلب إلى إسقاط النتائج الأخرى |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | ينشئ جلسة websocket/mcp/grpc لم تُفتح بعد؛ استدعِ `open()` للاتصال |
| `discover` | `(discoverOptions) => Promise<any>` | يكتشف إمكانات MCP وgRPC |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | يدمج الاستجابة المرصودة في المستند |
| `dispose` | `() => void` | لا ينفذ إجراءً حاليًا؛ على المستدعين إغلاق جلساتهم بأنفسهم |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | ينفذ طلب fetch ويصنف استجابته؛ اقرأ محتوى الاستجابة المعادة أو ألغِه |

**مثال:**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
});
```

### `createDebugger(config?): ProtoKit`

ينشئ مصحح أخطاء قابلًا للبرمجة للأتمتة والبرامج النصية والتكامل المستمر.

**الوسائط:**

| الاسم | النوع | الوصف |
| --- | --- | --- |
| `config` | `DebuggerOptions` | إعدادات اختيارية |
| `config.adapters` | `ProtocolAdapter[]` | قائمة محولات مخصصة تستبدل المحولات الافتراضية |
| `config.extraAdapters` | `ProtocolAdapter[]` | محولات إضافية إلى المحولات الافتراضية |
| `config.writeBack` | `WriteBackOptions` | خيارات الكتابة في المواصفة |
| `config.response` | `ToResponseOptions` | خيارات توحيد بنية الاستجابة |
| `config.writeBackTruncated` | `boolean` | يكتب المخطط المستنتج من التدفقات المبتورة؛ الافتراضي: true |

**القيمة المعادة:** كائن `ProtoKit` يتضمن `prepare` و`send` و`sendMany` و`toCollection` وغيرها.

**مثال:**

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const dbg = createDebugger({
  writeBackTruncated: true,
});

const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

### `createManualSession(options): AnyManualSession`

ينشئ جلسة مزدوجة الاتجاه طويلة الأمد لـ WebSocket أو MCP أو gRPC. لا تنفذ دالة الإنشاء عمليات إدخال أو إخراج؛ يُفتح الاتصال عند استدعاء `open()`.

**الوسائط:**

| الاسم | النوع | الوصف |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | البروتوكول المطلوب |
| `options.url` | `string` | عنوان URL لاتصال WebSocket |
| `options.endpoint` | `string` | نقطة نهاية MCP Streamable HTTP |
| `options.transport` | `"streamable-http" \| "stdio"` | وسيلة نقل MCP؛ الافتراضية هي Streamable HTTP |
| `options.command`, `options.args` | `string`, `string[]` | الملف التنفيذي المحلي ووسائطه لاستخدام MCP عبر stdio |
| `options.address`, `options.service`, `options.method` | `string` | عنوان gRPC واسم الخدمة المؤهل بالكامل والطريقة |

في gRPC، وفّر أيضًا مصدرًا للواصفات عبر `protoPaths` أو `reflection`. خيارات كل بروتوكول موضحة في [الإعدادات](./configuration.md).

**القيمة المعادة:** جلسة تتضمن `open()` و`send()` و`close()` و`onEvent()` و`waitForClose()` و`events` و`state`. تعيد `onEvent()` اشتراكًا يحتوي على `unsubscribe()`.

**مثال:**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

const subscription = session.onEvent((event) => {
  console.log(event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "message", data: "hello" });
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

### `AdapterRegistry`

سجل لكائنات `ProtocolAdapter`. يبدأ السجل الجديد فارغًا؛ وتسجل `createDebugger()` محولات HTTP وWebSocket وgRPC وMCP وGraphQL المدمجة ما لم تستبدلها قائمة مخصصة. استخدم `register()` و`unregister()` و`get()` و`list()` و`rank()` و`resolve()` لإدارة الاختيار.

### `ProtoKitError`

خطأ ذو نوع محدد تطرحه مسارات مصحح الأخطاء والتنفيذ الأساسية. استخدم `instanceof ProtoKitError` لتمييز أخطاء المكتبة عن الأعطال غير المتوقعة.

## الأنواع الأساسية

### `SendOptions`

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

### `PreparedRequest`

تعيده `createClient().prepare()`. لمصحح الأخطاء نتيجة تخطيط مختلفة: تعيد `createDebugger().prepare()` كائن `PlanResult` الذي يحتوي على `located` و`adapter` و`plan`.

| الحقل | النوع | الوصف |
| --- | --- | --- |
| `protocol` | `string` | البروتوكول المحدد: http أو websocket أو grpc أو graphql أو mcp |
| `transport` | `string` | وسيلة النقل المحددة |
| `target` | `OperationTarget` | الهدف الأصلي |
| `operation` | `any` | كائن عملية OpenAPI المحدد |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | تصنيف التدفق؛ انظر أدناه |
| `stream.expected` | `boolean` | ما إذا كان التدفق متوقعًا |
| `openapi.extensions` | `Record<string, unknown>` | امتدادات OpenAPI المحددة |
| `warnings` | `string[]` | التحذيرات التي ظهرت أثناء التخطيط |

### `StreamKind`

التصنيف التفصيلي للتدفقات: `"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## دوال OpenAPI المساعدة

| العنصر المصدّر | التوقيع | الوصف |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | يحدد عملية باستخدام `OperationTarget` |
| `inferSchema` | `(value) => Schema` | يستنتج JSON Schema من قيمة مرصودة واحدة |
| `inferSchemaFromMany` | `(values) => Schema` | يستنتج مخططًا يشمل عدة قيم مرصودة |
| `mergeSchema` | `(a, b) => Schema` | يدمج مخططين مستنتجين باتحاد أو تركيب |
| `sampleFromSchema` | `(schema) => unknown` | ينتج قيمة نموذجية واقعية للمخطط |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | ينشئ كائن استجابة OpenAPI من نتيجة مرصودة |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | يدمج استجابة مرصودة في المستند |

الأنواع المصدّرة: `LocatedOperation` و`WriteBackOptions` و`ToResponseOptions`.

## HTTP / SSE

تتوفر الأسماء التالية من نقطة الدخول الرئيسية. يصدّر المسار الفرعي `@powerduck/openapi-request/http` العناصر `HttpAdapter` و`SseParser` و`buildCollection` و`buildEnvironment` و`resolveServerUrl` و`buildRunOptions` و`runWithPostman`؛ استورد دوال الكشف و`BUILTIN_CAPTURE_TEST` من نقطة الدخول الرئيسية.

| العنصر المصدّر | الوصف |
| --- | --- |
| `HttpAdapter` | محول البروتوكول الافتراضي لـ HTTP/HTTPS |
| `SseParser` | محلل تدفق يحول تدفق بايتات SSE إلى أحداث منظّمة |
| `isStreamingOperation` | يصنف العملية كتدفق اعتمادًا على أنواع المحتوى المعلنة |
| `isSseContentType` | يتحقق مما إذا كان نوع المحتوى يشير إلى SSE |
| `isStreamingContentType` | يتحقق مما إذا كان نوع المحتوى يشير إلى تدفق |
| `acceptHeaderFor` | ينشئ ترويسة Accept المناسبة للعملية |
| `probeStreamingResponse` | ينفذ طلب fetch ويصنف استجابته؛ اقرأ محتوى الاستجابة المعادة أو ألغِه |
| `BUILTIN_CAPTURE_TEST` | برنامج اختبار Postman مدمج لالتقاط آخر استجابة |

## WebSocket

استورد من `@powerduck/openapi-request/ws`.

| العنصر المصدّر | الوصف |
| --- | --- |
| `WebSocketAdapter` | محول بروتوكول لأهداف WebSocket |
| `createWsManualSession` | ينشئ جلسة WebSocket يدوية مزدوجة الاتجاه، ويتوفر أيضًا بالاسمين `runWebSocketSession` و`wsManualSession` |

## GraphQL

استورد من `@powerduck/openapi-request/graphql`.

| العنصر المصدّر | الوصف |
| --- | --- |
| `GraphQLAdapter` | محول بروتوكول لأهداف GraphQL |
| `resolveGraphQLConfig` | يستخلص إعدادات GraphQL من العملية |
| `runGraphQL` | ينفذ عملية GraphQL |
| `introspectSchema` | يستكشف مخطط نقطة نهاية GraphQL بالاستبطان |
| `INTROSPECTION_QUERY` | استعلام استبطان GraphQL القياسي |
| `generateOperation` | ينشئ مستند استعلام من مخطط GraphQL مستكشف وحقل محدد |
| `generateAllOperations` | ينشئ مستندات استعلام لحقول مخطط GraphQL مستكشف |
| `writeGraphQLOperations` | يكتب عمليات GraphQL المولّدة في المواصفة |
| `discoverAndWriteGraphQLSchema` | يكتشف مخطط GraphQL ويكتبه في المواصفة |

## MCP (بروتوكول سياق النموذج)

تتوفر معظم العناصر التالية من `@powerduck/openapi-request/mcp`. استورد `initializeMcpSession` من نقطة الدخول الرئيسية؛ اسمها في المسار الفرعي هو `initializeSession`. يوفّر المسار الفرعي أيضًا `runMcp` و`createMcpSessionCore` و`createMcpStdioConnection`.

| العنصر المصدّر | الوصف |
| --- | --- |
| `McpAdapter` | محول بروتوكول لأهداف MCP |
| `createMcpManualSession` | ينشئ جلسة MCP يدوية، ويتوفر أيضًا باسم `mcpManualSession` |
| `createMcpStdioSession` | ينشئ جلسة MCP عبر stdio |
| `runMcpManualSession` | مهمل: استخدم `createMcpManualSession` |
| `resolveMcpConfig` | يستخلص إعدادات MCP من العملية |
| `initializeMcpSession` | يهيئ جلسة MCP؛ اسم بديل لـ `initializeSession` |
| `discoverMcpCapabilities` | يكتشف إمكانات خادم MCP |
| `MCP_PROTOCOL_VERSION` | إصدار بروتوكول MCP المدعوم |
| `generateMcpCall` | ينشئ استدعاء أداة MCP واحدًا |
| `generateAllMcpCalls` | ينشئ جميع استدعاءات أدوات MCP |
| `writeMcpOperations` | يكتب عمليات MCP في المواصفة |
| `discoverAndWriteMcpCapabilities` | يكتشف إمكانات MCP ويكتبها في المواصفة |
| `createHttpMcpTransport` | ينشئ وسيلة نقل HTTP لـ MCP |
| `createStdioMcpTransport` | ينشئ وسيلة نقل stdio لـ MCP |

## gRPC

استورد دوال الاكتشاف والاستدعاء والواصفات منخفضة المستوى من `@powerduck/openapi-request/grpc`. استورد `GrpcProtocolAdapter` و`createGrpcManualSession` و`grpcManualSession` و`grpcDiscover` و`discoverGrpc` من نقطة الدخول الرئيسية؛ يستخدم المسار الفرعي الاسم `discover` للاكتشاف. ويوفر أيضًا `discoverFromCatalog` و`describeMethod` و`describeFromCatalog` لإعادة استخدام الكتالوج بدل تكرار الانعكاس لكل طريقة.

| العنصر المصدّر | الوصف |
| --- | --- |
| `GrpcProtocolAdapter` | محول بروتوكول gRPC موجّه إلى OpenAPI |
| `GrpcAdapter` | محول gRPC منخفض المستوى |
| `grpcDiscover` / `discoverGrpc` | يكتشف خدمات gRPC وطرقها |
| `createGrpcManualSession` / `grpcManualSession` | ينشئ جلسة gRPC يدوية |
| `grpcCall` | ينفذ استدعاء gRPC واحدًا |
| `resolveMethod` | يحدد واصف طريقة gRPC |
| `buildMessageTemplate` | ينشئ قالب رسالة من واصف |
| `buildCatalog` | ينشئ كتالوجًا للخدمات والطرق |
| `LOADER_OPTIONS` | خيارات محمّل proto الافتراضية |
| `scanProtoFiles` | يفحص المجلدات بحثًا عن ملفات proto |
| `deriveIncludeDirsDetailed` | يستنتج مجلدات التضمين من مسارات ملفات proto |
| `fetchDescriptorSet` | يجلب مجموعة واصفات عبر انعكاس gRPC |
| `fetchFullDescriptorSet` | يجلب مجموعة واصفات كاملة مع جميع التبعيات |
| `listServices` | يسرد الخدمات من مجموعة واصفات |
| `listServicesDetailed` | يسرد الخدمات مع تفاصيل الطرق |
| `serializeDescriptorSet` | يسلسل مجموعة واصفات إلى بايتات |
| `decodeFileDescriptorProto` | يفك ترميز proto لواصف ملف واحد |
| `decodeFileDescriptorSet` | يفك ترميز مجموعة واصفات ملفات |
| `buildCredentials` | ينشئ بيانات اعتماد gRPC بشكل متزامن |
| `buildCredentialsAsync` | ينشئ بيانات اعتماد gRPC بشكل غير متزامن |
| `buildCredentialsChecked` | ينشئ بيانات اعتماد مع التحقق بشكل متزامن |
| `buildCredentialsCheckedAsync` | ينشئ بيانات اعتماد مع التحقق بشكل غير متزامن |
| `loadGrpc` | يحمّل الحزمة `@grpc/grpc-js` ديناميكيًا |
| `isGrpcAvailable` | يتحقق من توفر تبعيات gRPC |
| `requireCapability` | يشترط إمكانية gRPC محددة ويطرح خطأ إذا لم تتوفر |

تصدّر نقطة الدخول الرئيسية الأسماء البديلة للأنواع `GrpcDiscoveryResult` و`GrpcDiscoveredMethod` و`GrpcDiscoveredService`. أسماؤها في المسار الفرعي gRPC هي `DiscoveryResult` و`DiscoveredMethod` و`DiscoveredService`.

أنواع الأخطاء: `ReflectionProtocolError` و`ReflectionUnavailableError` و`DescriptorDecodeError` و`GrpcDependencyBrokenError` و`GrpcDependencyMissingError`.

## أدوات إضافية

تصدّر نقطة الدخول الرئيسية أيضًا دوال OAuth 2.0 المساعدة `resolveOAuth2Token` و`acquireOAuth2Token` و`isOAuth2TokenExpired` و`oauth2RefreshStatuses` و`authFromOAuth2Token`، وأداة النسخ `toCloneable`، والفئة الأساسية `UnifiedSession`، ودالتي الكتابة الخاصة بـ gRPC وهما `writeGrpcOperations` و`discoverAndWriteGrpcOperations`.

## صادرات المسارات الفرعية

```typescript
// Main integration entry
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```
