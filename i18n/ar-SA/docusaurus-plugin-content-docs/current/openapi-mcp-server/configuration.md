---
sidebar_position: 4
title: "الإعدادات"
description: "الإعدادات الكاملة لـ @powerduck/openapi-mcp-server: ServerConfig وSecurityContext وExecutionContext وTransportMode، واتحادات القيم الحرفية للمصادر والحالات والبروتوكولات ومستويات السجل وترميزات الجسم."
---

# الإعدادات

كائن الإعدادات الأساسي هو `ServerConfig` الذي تقبله `startAdminServer()`. وتُستخدم أنواع السياق المرتبطة به أثناء تنفيذ الأدوات.

## `ServerConfig`

الحقل الوحيد الإلزامي هو `port`.

| الحقل | النوع | القيمة الافتراضية | الوصف |
| --- | --- | --- | --- |
| `port` | `number` | — (إلزامي) | منفذ TCP للاستماع، عدد صحيح من 0 إلى 65535. |
| `host` | `string` | `"127.0.0.1"` | واجهة الشبكة للاستماع؛ تُستخدم واجهة الاسترجاع افتراضيًا لتجنب إتاحتها خارجيًا دون قصد. |
| `apiKey` | `string` | undefined | سر مشترك تطلبه واجهة API للإدارة والنقل عبر HTTP عند ضبطه. |
| `specPath` | `string` | undefined | مواصفة تُحمّل مرة واحدة عند بدء التشغيل. |
| `baseUrlOverride` | `string` | undefined | يستبدل عنوان URL الأساسي للخدمة المستهدفة المشتق من `servers[0].url`. |
| `upstreamHeaders` | `Record<string, string>` | undefined | ترويسات تُدمج في كل طلب إلى الخدمة المستهدفة. |
| `requestTimeoutMs` | `number` | undefined | مهلة كل طلب إلى الخدمة المستهدفة بالمللي ثانية. |
| `persistState` | `boolean` | `true` | يحفظ المواصفة المحمّلة بين مرات إعادة التشغيل. |
| `stateFilePath` | `string` | undefined | موقع ملف الحالة الدائم. |
| `allowedOrigins` | `string[]` | undefined | مصادر CORS المسموح بها؛ تركها فارغة أو حذفها يعطّل الوصول عبر المصادر. |
| `allowedHosts` | `string[]` | undefined | قيم ترويسة `Host` المسموح بها. |
| `maxLogEntries` | `number` | 200 | الحد الأقصى لعدد إدخالات السجل المحفوظة في الذاكرة. |
| `redactSensitiveHeaders` | `boolean` | `true` | يخفي قيم الترويسات الحساسة قبل تسجيلها. |
| `redactHeaderNames` | `string[]` | undefined | أسماء ترويسات إضافية لإخفائها إلى جانب القائمة المدمجة. |
| `security` | `SecurityContext` | undefined | بيانات الاعتماد المُمرَّرة إلى API المستهدفة مع كل استدعاء أداة. |

## `SecurityContext`

| الحقل | النوع | صيغة الإرسال |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | أزواج دقيقة من اسم الترويسة وقيمتها. |

يُدرج المنفّذ بيانات الاعتماد، ولا يكشفها مطلقًا كوسائط أدوات متاحة للنموذج.

## `ExecutionContext`

سياق كل استدعاء، يُمرَّر إلى `executeToolCall` ويُعاد من `ContextProvider`:

| الحقل | النوع | الوصف |
| --- | --- | --- |
| `baseUrlOverride` | `string` | يستبدل عنوان URL لخادم المواصفة في هذا الاستدعاء. |
| `upstreamHeaders` | `Record<string, string>` | ترويسات إضافية للخدمة المستهدفة. |
| `requestTimeoutMs` | `number` | مهلة كل استدعاء، بحد أدنى ثانية واحدة. |
| `security` | `SecurityContext` | بيانات اعتماد خاصة بكل استدعاء. |
| `correlationId` | `string` | يربط إدخالات السجل الخاصة بالاستدعاء نفسه. |
| `protocol` | `ProtocolHint` | وسيلة النقل التي بدأت الاستدعاء. |
| `onLog` | `(entry) => void` | يتلقى إدخالات سجل الطلبات والاستجابات؛ يجب ألا يرمي استثناءات. |
| `signal` | `AbortSignal` | يلغي طلبًا جاريًا إلى الخدمة المستهدفة. |

## اتحادات القيم الحرفية ودوال التحقق من الأنواع

| الاتحاد | القيم | دالة التحقق |
| --- | --- | --- |
| `TransportMode` | `"stdio" \| "web"` | — |
| `SpecSource` | `"startup-file" \| "upload" \| "paste" \| "runtime"` | `isSpecSource()` |
| `ServiceStatus` | `"running" \| "stopped" \| "error"` | `isServiceStatus()` |
| `ProtocolHint` | `"streamable-http" \| "sse" \| "stdio"` | `isProtocolHint()` |
| `LogDirection` | `"request" \| "response" \| "internal"` | — |
| `LogLevel` | `"debug" \| "info" \| "warn" \| "error"` | — |
| `ParameterLocation` | `"path" \| "query" \| "header" \| "cookie"` | `isParameterLocation()` |
| `BodyEncoding` | `"json" \| "form-urlencoded" \| "multipart" \| "text" \| "binary"` | `isBodyEncoding()` |

## `BuildMcpServerOptions`

يُمرَّر بوصفه الوسيط الثالث إلى `buildMcpServer()`:

| الحقل | النوع | القيمة الافتراضية | الوصف |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | تلميح البروتوكول المُعلَن. |
| `name` | `string` | `"openapi-mcp"` | اسم الخادم المُعلَن. |
| `version` | `string` | `"1.1.0"` | إصدار الخادم المُعلَن. |
| `pageSize` | `number` | 100 | الحد الأقصى للعناصر في كل استجابة قائمة، بما لا يتجاوز 500. |
| `instructions` | `string` | مدمج | إرشادات استخدام تُتاح عبر MCP `instructions`. |

## خيارات طبقة النقل (`AttachMcpRoutesOptions`)

استورد `attachMcpRoutes` من `@powerduck/openapi-mcp-server` ومرّر كائن الخيارات بوصفه الوسيط الثاني. لا تقبل دالة التغليف القديمة `attachSseRoutes()` إلا الوسائط الموضعية `(app, specProvider, contextProvider, routeGuard?)`.

| الحقل | النوع | القيمة الافتراضية | الوصف |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | — (إلزامي) | يوفّر المستند للجلسات الجديدة. |
| `contextProvider` | `ContextProvider` | — (إلزامي) | يوفّر سياق الخدمة المستهدفة لكل استدعاء. |
| `routeGuard` | `RequestHandler` | undefined | وسيط يُطبّق على كل مسارات MCP. |
| `maxSessions` | `number` | 64 | الحد الأقصى للجلسات المتزامنة. |
| `sessionIdleMs` | `number` | 600000 | مهلة الخمول بالمللي ثانية؛ القيمة 0 تعطّلها. |
| `allowedOrigins` | `string[]` | undefined | المصادر المسموح بها؛ تفعّل القائمة غير الفارغة الحماية من إعادة ربط DNS. |
| `allowedHosts` | `string[]` | undefined | قيم ترويسة `Host` المسموح بها. |
| `enableLegacySse` | `boolean` | `true` | يربط وسيلة النقل HTTP+SSE المهملة. |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | يتلقى أحداث دورة الحياة؛ يجب ألا يرمي استثناءات. |

> هذه خيارات `attachMcpRoutes` وليست حقولًا إضافية في `ServerConfig`. يمرّر خادم الإدارة إعدادات المصادر والمضيفين، لكنه يستخدم حد الجلسات ومهلة الخمول الافتراضيين لطبقة النقل. استخدم دالة النقل العامة مباشرةً إذا أردت تخصيص هذه الحدود.

## انظر أيضًا

- [مرجع API](../api-reference/)
- [أمثلة](../examples/)
