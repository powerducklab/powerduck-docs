---
sidebar_position: 4
title: "مرجع API"
description: "دوال الطبقتين الأساسية والملفات وخياراتهما ورموز الأخطاء."
---

# مرجع API

## الطبقة الأساسية (`@powerduck/workspace-yaml/core`)

| الدالة | الوصف |
|----------|-------------|
| `createWorkspaceYaml(options?)` | إنشاء سلسلة نصية لمحتوى workspace.yaml |
| `createOpenApiYaml(options)` | إنشاء سلسلة محتوى YAML بتنسيق OpenAPI 3.2 |
| `createWorkspaceWithApi(options)` | إنشاء محتوى مساحة العمل وOpenAPI معًا |
| `parseWorkspaceYaml(content)` | تحليل سلسلة workspace.yaml والتحقق منها |

### `createOpenApiYaml(options)` — الخيار

| الخيار | النوع | مطلوب | الوصف |
|--------|------|----------|-------------|
| `title` | `string` | نعم | عنوان API |
| `version` | `string` | لا | القيمة الافتراضية `"1.0.0"` |
| `description` | `string` | لا | وصف API |
| `contact` | `{ name?, url?, email? }` | لا | معلومات الاتصال |
| `license` | `{ name, url? }` | لا | معلومات الترخيص |
| `servers` | `Array<{ url, description? }>` | لا | قائمة الخوادم |

## طبقة الملفات (`@powerduck/workspace-yaml`)

| الدالة | الوصف |
|----------|-------------|
| `initializeWorkspace(options)` | إنشاء ملف workspace.yaml على القرص |
| `initializeOpenApi(options)` | إنشاء ملف YAML بتنسيق OpenAPI على القرص |
| `createWorkspaceApi(options)` | إنشاء الملفين ذريًا (مع التراجع عند الفشل) |

### `createWorkspaceApi(options)` — الخيار

| الخيار | النوع | مطلوب | الوصف |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | نعم | المجلد الهدف |
| `oasId` | `string` | نعم | معرّف API فريد |
| `name` | `string` | نعم | اسم العرض |
| `file` | `string` | لا | المسار النسبي (الافتراضي: `oasFiles/${oasId}.openapi.yaml`) |
| `title` | `string` | لا | عنوان API (الافتراضي: `name`) |
| `version` | `string` | لا | إصدار API (الافتراضي: `"1.0.0"`) |
| `overwriteOpenApi` | `boolean` | لا | القيمة الافتراضية `false` |

## الأخطاء

جميع الأخطاء مثيلات من `WorkspaceYamlError` تتضمن `code` قابلًا للقراءة آليًا:

| الرمز | الوصف |
|------|-------------|
| `INVALID_ARGUMENT` | معامل إدخال غير صالح |
| `ALREADY_EXISTS` | الملف موجود بالفعل وخيار الاستبدال هو false |
| `NOT_FOUND` | الملف غير موجود |
| `IO_ERROR` | فشلت عملية نظام الملفات |
| `INVALID_WORKSPACE` | إعداد مساحة العمل غير صالح |
| `INVALID_OPENAPI` | مستند OpenAPI غير صالح |
| `ROLLBACK_FAILED` | فشل التراجع عن المعاملة |
