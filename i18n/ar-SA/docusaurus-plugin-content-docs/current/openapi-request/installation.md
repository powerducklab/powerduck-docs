---
sidebar_position: 2
title: "التثبيت"
description: "ثبّت @powerduck/openapi-request وتعرّف إلى المسارات الفرعية للبروتوكولات وحزم gRPC وMCP الاختيارية."
---

# التثبيت

تتضمن `@powerduck/openapi-request` بناءي ESM وCommonJS مع تعريفات TypeScript. يلزم Node.js `>= 22.12.0`.

## التثبيت

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

Yarn:

```bash
yarn add @powerduck/openapi-request
```

pnpm:

```bash
pnpm add @powerduck/openapi-request
```

## ESM / CommonJS

```javascript
// ESM
import { createClient } from "@powerduck/openapi-request";

// CommonJS
const { createClient } = require("@powerduck/openapi-request");
```

لا تحتاج إلى حزم `@types/*` إضافية.

## بنية الحزمة وتصديرات المسارات الفرعية

تصدّر نقطة الدخول الافتراضية الواجهة الأساسية. ولكل بروتوكول مساره الفرعي أيضًا:

| الاستيراد | المحتوى |
|---|---|
| `@powerduck/openapi-request` | الواجهة الأساسية: `createClient` و`createDebugger` و`createManualSession` و`AdapterRegistry` و`ProtoKitError` وأدوات OpenAPI المساعدة والأنواع. |
| `@powerduck/openapi-request/http` | `HttpAdapter` و`SseParser` ودوال اكتشاف البث وأدوات إنشاء مجموعات HTTP والبيئات (`buildCollection` و`buildEnvironment` و`resolveServerUrl`). |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter` و`createWsManualSession` وأدوات إعداد WebSocket وجلساته. |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter` و`GrpcAdapter` و`grpcCall` و`createGrpcManualSession` ووحدات الاكتشاف والانعكاس والواصفات والفهرس وبيانات الاعتماد والتحميل والقوالب. |
| `@powerduck/openapi-request/mcp` | `McpAdapter` و`createMcpManualSession` و`createMcpStdioSession` ووحدات نقل MCP وإعداده واكتشافه وتوليده. |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter` و`resolveGraphQLConfig` و`runGraphQL` والاستبطان وتوليد العمليات وإعادة كتابة التغييرات. |

يستورد المسار الفرعي أنواع البروتوكول وأدواته المساعدة دون إعادة تصدير المحولات غير المرتبطة به.

## حزم القدرات الاختيارية

اعتماديات gRPC وMCP كبيرة، لذا **تُحمّل عند أول استخدام**. يعمل التثبيت الخاص بـ HTTP وحده دونها. ثبّتها فقط عند الحاجة إلى البروتوكول:

- يتطلب **gRPC** حزمتَي `@grpc/grpc-js` و`@grpc/proto-loader`. ويتطلب انعكاس الخادم أيضًا `@grpc/proto-loader >= 0.7` لتوفير `loadFileDescriptorSetFromBuffer`.
- يتطلب **MCP** الحزمة `@modelcontextprotocol/sdk`.

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

إذا غابت حزمة، يرمي محمّل gRPC الخطأ `GrpcDependencyMissingError` مع أمر التثبيت الدقيق. وإذا كانت موجودة لكنها معطوبة، يظهر `GrpcDependencyBrokenError`.

## التحقق

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

يعمل الاستيرادان بعد تثبيت الحزمة.

## الخطوات التالية

- [البدء السريع](/docs/ar-SA/openapi-request/quickstart/)
- [الإعدادات](/docs/ar-SA/openapi-request/configuration/)
