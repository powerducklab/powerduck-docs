---
sidebar_position: 2
title: "التثبيت"
description: "ثبّت @powerduck/openapi-mcp-server باستخدام npm أو yarn أو pnpm، أو على مستوى النظام. تعرّف على openapi-mcp والمسار ./server والاعتماديات. يتطلب Node.js 22.12.0 أو أحدث."
---

# التثبيت

## المتطلبات

- **Node.js `>=22.12.0`** (محدد في `engines`).

## التثبيت

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

تسجّل الحزمة الملف التنفيذي `openapi-mcp`.

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

تحتوي واجهة سطر الأوامر على أمر واحد هو `serve` (انظر [البدء السريع](/docs/ar-SA/openapi-mcp-server/quickstart/)).

## ESM / CommonJS

تتوفر بنيتان مع تعريفات الأنواع المضمّنة. لا تحتاج إلى `@types/*` إضافية:

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## تصدير المسار الفرعي

| الاستيراد | المحتوى |
| --- | --- |
| `@powerduck/openapi-mcp-server` | المكتبة الأساسية: تحميل المواصفات، وإنشاء الأدوات والموجّهات والموارد، وتنفيذ الطلبات، وبناء خادم MCP، ونقل stdio وHTTP. |
| `@powerduck/openapi-mcp-server/server` | خادم HTTP للإدارة وبرمجيات وسيطة للمصادقة (`startAdminServer`، `createAuthMiddleware`). |

## اعتماديات وقت التشغيل

تُثبّت هذه الاعتماديات تلقائيًا مع الحزمة:

- `@modelcontextprotocol/sdk` — تنفيذ بروتوكول MCP.
- `@powerduck/openapi-parser` — التحقق من OpenAPI وحل المراجع وترقية الإصدار.
- `express` و `cors` — خادم HTTP للإدارة وCORS.
- `axios` — عميل HTTP للوصول إلى الخادم المستهدف عند تنفيذ الأدوات.
- `commander` — إطار عمل سطر الأوامر.
- `js-yaml` — تحليل YAML.
- `multer` — معالجة رفع المواصفات.
- `terser` — تصغير ملفات واجهة الويب المضمّنة.

## التحقق

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## الخطوات التالية

- [البدء السريع](/docs/ar-SA/openapi-mcp-server/quickstart/)
- [الإعدادات](/docs/ar-SA/openapi-mcp-server/configuration/)
