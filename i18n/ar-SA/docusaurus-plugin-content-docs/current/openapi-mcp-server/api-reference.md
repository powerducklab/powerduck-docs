---
sidebar_position: 5
title: "مرجع API"
description: "المرجع الكامل لـ @powerduck/openapi-mcp-server: تحميل المواصفات وتوليد الأدوات والموجّهات والموارد، وبناء الطلبات وتنفيذها، وخادم MCP ووسائل النقل والإدارة والمصادقة وسجل الخدمات وCLI."
---

# مرجع API

جميع العناصر العامة المُصدَّرة من `@powerduck/openapi-mcp-server`، مرتبة حسب الوظيفة.

## تحميل المواصفات

| العنصر المُصدَّر | التوقيع | الوصف |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | يقرأ ملف JSON أو YAML، ويتحقق منه، ويحل المراجع، ويتأكد من تفرّد معرّفات العمليات. يُكتشف YAML عبر الامتداد `.ya?ml`. |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | يحلّل مستندًا من سلسلة نصية. يرمي استثناءً إذا كان الإدخال فارغًا أو غير صالح. |

## توليد الأدوات

| العنصر المُصدَّر | التوقيع | الوصف |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | يولّد تعريفات MCP `Tool` لكل عملية. |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | يعيد `{ tools, bindings, issues }`. |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | يربط أسماء الأدوات المُولَّدة بكائن `ToolBinding` المقابل؛ وهو اسم بديل لـ `getBindingIndex`. |

الأنواع المُصدَّرة: `ToolBinding` و`GeneratedToolWithBinding`، وهو الاسم البديل لـ `GeneratedTool` داخل الحزمة.

## الموجّهات والموارد

| العنصر المُصدَّر | التوقيع | الوصف |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | يسرد جميع الموجّهات المُولَّدة. |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | يحل الموجّه بالاسم؛ يعيد `null` إذا كان غير معروف. |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | يسرد موارد الدليل. |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | يقرأ موردًا واحدًا بواسطة URI. |

## بناء الطلبات وتنفيذها

| العنصر المُصدَّر | التوقيع | الوصف |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | يسلسل الوسائط إلى `{ url, query, headers, body, dropped }`. يستخدم وسائط موضعية. |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | ينفّذ أداة مولّدة على API المستهدفة. تُعاد الاستجابات غير 2xx كبيانات؛ أما إخفاقات النقل فترمي استثناءات. |

حقول `ToolCallResult`: `status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`.

## أدوات مساعدة للمواصفات

| العنصر المُصدَّر | الوصف |
| --- | --- |
| `iterateOperations(spec, issues?)` | مولّد يعيد جميع العمليات بعد حلّها، بما فيها `additionalOperations` في OpenAPI 3.2. |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | يدمج معلمات عنصر المسار والعملية باستخدام المفتاح `(name, in)`. |
| `normalizeParameter(candidate)` | يوحّد صيغة المعلمة الخام؛ يعيد `null` إذا كانت غير قابلة للاستخدام. |
| `synthesizeOperationId(method, pathTemplate)` | معرّف بديل حتمي عندما تحذف العملية `operationId`. |
| `ensureUniqueName(candidate, taken)` | يضيف لاحقة رقمية للحفاظ على تفرّد الاسم. |
| `extractPathTemplateVariables(pathTemplate)` | يستخرج متغيرات `{name}` ويزيل التكرار مع الاحتفاظ بأول ظهور. |
| `effectiveStyle(parameter)` | يطبّق القيمة الافتراضية لـ `style` حسب المواصفة. |
| `effectiveExplode(parameter)` | يطبّق القيمة الافتراضية لـ `explode` حسب المواصفة. |
| `findOperationById(spec, operationId)` | بحث بتعقيد O(1) بعد البناء الأول؛ يعيد `null` إذا كان المعرّف غير معروف. |
| `findDuplicateOperationIds(spec)` | يبلّغ عن المعرّفات المكررة التي أعلنها المؤلف. |
| `assertUniqueOperationIds(spec)` | يرمي استثناءً عند تكرار معرّفات العمليات. |
| `isPlainObject(value)` | يضيّق النوع إلى كائن عادي. |
| `truncateGeneratedName(name, limit=64)` | يختصر الاسم مع الحفاظ على تفرّده. |

الأنواع المُصدَّرة: `OperationEntry` و`DuplicateOperationId`.

## خادم MCP ووسائل النقل

| العنصر المُصدَّر | الوصف |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | ينشئ `Server` من SDK ويربط معالجات الأدوات والموجّهات والموارد. يستخدم وسائط موضعية. |
| `startStdioServer(spec, context?, options?)` | يوفّر مستندًا واحدًا عبر stdio؛ يعيد `{ closed, close() }`. |
| `attachMcpRoutes(app, options)` | يربط مسارات Streamable HTTP (`/mcp`) وSSE القديم الاختياري (`/sse`). يقبل `AttachMcpRoutesOptions` ويعيد `McpRouteHandle`. |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | دالة تغليف مهملة بوسائط موضعية. تعيد `{ activeSessionCount, closeAll }`. |
| `createStreamableSessionHost(options)` | ينشئ مضيف جلسات Streamable HTTP مستقلًا لتكاملات النقل المخصصة. |

الأنواع: `SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`.

تُصدَّر `attachMcpRoutes` من جذر الحزمة. اضبط `maxSessions` و`allowedOrigins` و`sessionIdleMs` والحماية من إعادة ربط DNS ضمن خياراتها. يوفّر الكائن المُعاد `activeSessionCount` و`pendingSessionCount` و`listSessions` و`closeSession` و`closeAll` و`dispose`. استخدم `dispose()` عند الإيقاف لإيقاف التنظيف الدوري وإغلاق الجلسات.

## خادم الإدارة والمصادقة (المسار الفرعي `./server`) {#admin-server-and-auth-server-subpath}

استورد `startAdminServer` من `@powerduck/openapi-mcp-server/server` أو جذر الحزمة. استورد `createAuthMiddleware` من الجذر؛ فهو غير مُصدَّر من المسار الفرعي `./server`.

| العنصر المُصدَّر | التوقيع | الوصف |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | يشغّل تطبيق الإدارة Express مع واجهة ويب ومسارات MCP. يعيد `{ app, server, port, close() }`. |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | حماية وصول عبر Bearer أو `x-api-key`. احذف المفتاح لتعطيلها. يستخدم وسيطًا موضعيًا. |

## بيئة التشغيل والأدوات المساعدة

| العنصر المُصدَّر | الوصف |
| --- | --- |
| `ServiceRegistry` | صنف لإدارة `ManagedServiceRecord`: `upsert` و`list` و`get` و`remove` و`clear` و`start` و`stop` و`fail`. |
| `isAbortError(error)` | صحيح عند `AbortError` أو `CanceledError` من axios. |
| `newId()` | معرّف UUID مع بديل يستند إلى طابع زمني. |

## CLI

البرنامج التنفيذي **`openapi-mcp`**، بأمر واحد هو `serve`:

```
openapi-mcp serve [options]
```

| الخيار | القيمة الافتراضية | الوصف |
| --- | --- | --- |
| `--port <n>` | `3000` | منفذ HTTP للنقل عبر الويب. |
| `--host <host>` | `127.0.0.1` | مضيف HTTP. |
| `--transport <mode>` | `web` | `stdio` أو `web`. |
| `--spec <path>` | — | مسار ملف OpenAPI، إلزامي في وضع stdio. |
| `--base-url <url>` | — | يستبدل عنوان URL الأساسي للخدمة المستهدفة. |
| `--api-key <key>` | — | مفتاح API للإدارة. |
| `--upstream-header "Name: value"` | — | ترويسة للخدمة المستهدفة يمكن تكرارها. |
| `--timeout <ms>` | `30000` | مهلة الخدمة المستهدفة. |
| `--no-persist` | — | يعطّل الحفظ الدائم للحالة. |

## الأنواع (المُعاد تصديرها من `types`)

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`؛ النوع `ResolvedPrompt` مهمل. دوال التحقق: `isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`.

## الأخطاء والسلوك

- تؤدي معرّفات الأدوات أو الموجّهات أو الموارد غير المعروفة إلى أخطاء MCP `InvalidParams`، لا إلى إخفاقات ضمن النتيجة العادية.
- يؤدي غياب المواصفة أثناء جلسة نشطة إلى `InternalError`.
- تُعاد استجابات 4xx/5xx من الخدمة المستهدفة إلى النموذج كمحتوى يتضمن `isError: true` دون رمي استثناء. وحدها إخفاقات النقل، مثل DNS وTLS وانتهاء المهلة والإلغاء، ترمي استثناءات.

## انظر أيضًا

- [الإعدادات](../configuration/)
- [أمثلة](../examples/)
