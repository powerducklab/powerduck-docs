---
sidebar_position: 1
title: "مقدمة"
description: "تحويل OpenAPI إلى خدمات MCP: أدوات وموجّهات وموارد، ولوحة إدارة ويب وstdio وHTTP وواجهة openapi-mcp لسطر الأوامر."
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — مقدمة

تحوّل `@powerduck/openapi-mcp-server` مستند OpenAPI إلى خدمة MCP (Model Context Protocol) قيد التشغيل. تولّد **الأدوات** من العمليات، و**الموجّهات** من بيانات API الوصفية وعملياتها، و**الموارد** من دليل API، ثم تتيحها عبر بروتوكول MCP مع واجهة إدارة ويب مدمجة.

- **اسم الحزمة:** `@powerduck/openapi-mcp-server`
- **الإصدار:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **الترخيص:** MIT
- **متطلبات Node:** `>=22.12.0`
- **أمر CLI:** `openapi-mcp`
- **تنسيق الوحدات:** إصداران بصيغتي ESM وCommonJS مع تعريفات الأنواع المضمّنة.

تعتمد على `@powerduck/openapi-parser` للتحقق وحل المراجع، وعلى `@modelcontextprotocol/sdk` لتنفيذ البروتوكول.

## المحتوى المُولَّد

- **Tools** — أداة MCP لكل عملية OpenAPI، مع تسلسل كامل للمعلمات (أنماط path/query/header/cookie وقواعد explode)، وترميز جسم الطلب (JSON وform-urlencoded وmultipart والنص والبيانات الثنائية)، وتعليقات أدوات MCP (`readOnlyHint` و`destructiveHint` و`idempotentHint`).
- **Prompts** — موجّهات عامة (`spec_overview` و`integration_guardrails`) وموجّهات لكل عملية (`explain_*` و`plan_*` و`sample_*`).
- **Resources** — موارد ثابتة للدليل، مثل `openapi://spec/summary` و`openapi://catalog/tools` و`openapi://spec/document`.

## وسائل النقل

- **stdio** — توفّر `startStdioServer()` مستندًا واحدًا لعميل MCP محلي، مثل Claude Desktop أو تكامل محرّر.
- **HTTP** — تربط `attachMcpRoutes(app, options)` نقل Streamable HTTP بالمسار `/mcp`، ونقل SSE القديم الاختياري بالمسار `/sse` في تطبيق Express. تتحكم خياراتها في حدود الجلسات ومهلة الخمول وCORS والحماية من إعادة ربط DNS. تضيف `startAdminServer()` واجهة الإدارة وتستخدم حدود الجلسات الافتراضية. وتبقى `attachSseRoutes()` متاحة كدالة تغليف مهملة تستخدم وسائط موضعية.

## خادم الإدارة

تشغّل `startAdminServer()` تطبيق Express يوفّر:

- لوحة إدارة ويب لرفع المواصفات أو لصقها، وفحص الأدوات والموجّهات والموارد، وعرض الخدمات الجارية وسجلات الطلبات؛
- وسائل نقل MCP عبر HTTP؛
- المصادقة بمفتاح API، وتسجيل الطلبات مع إخفاء الترويسات الحساسة، وحفظ الحالة بشكل دائم اختياريًا.

## التثبيت

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## البدء السريع

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## الخطوات التالية

- [التثبيت](../installation/) — npm/yarn/pnpm والتثبيت العام والمسار الفرعي `./server` والاعتماديات.
- [البدء السريع](../quickstart/) — الاستخدام عبر CLI ومن داخل الشيفرة.
- [الإعدادات](../configuration/) — الوصف الكامل لـ `ServerConfig`.
- [مرجع API](../api-reference/) — جميع العناصر المُصدَّرة وأوامر CLI.
- [أمثلة](../examples/) — أمثلة عملية.

## الترخيص

MIT.
