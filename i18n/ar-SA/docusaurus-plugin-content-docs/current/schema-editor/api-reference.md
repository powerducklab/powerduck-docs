---
sidebar_position: 4
title: "مرجع API"
description: "خصائص SchemaEditor، وصادرات الوحدة الأساسية، وأنواع لغات المحرر."
---

# مرجع API

## `<SchemaEditor />` — الخاصية

| الخاصية | النوع | القيمة الافتراضية | الوصف |
|------|------|---------|-------------|
| `value` | `string` | مطلوب | محتوى المحرر |
| `onChange` | `(value: string) => void` | — | يُستدعى عند تغيير المحتوى |
| `language` | `"json" \| "yaml" \| "javascript"` | مطلوب | لغة المحتوى |
| `schema` | `JsonSchema` | — | مخطط JSON Schema المستخدم للإكمال والتشخيص (json/yaml) |
| `snippets` | `string[]` | — | سلاسل نصية للمقتطفات المستخدمة في الإكمال بالنص الاقتراحي في JavaScript |
| `theme` | `"light" \| "dark"` | `"light"` | السمة المرئية |
| `readOnly` | `boolean` | `false` | تعطيل التحرير |
| `placeholder` | `string` | — | نص العنصر النائب عندما يكون المحتوى فارغًا |
| `showDiagnostics` | `boolean` | `true` | عرض شريط حالة التشخيص |
| `enableInlineSuggestions` | `boolean` | `true` | تمكين النص الاقتراحي |
| `enableCompletion` | `boolean` | `true` | تمكين الإكمال المنبثق |
| `diagnosticsDebounceMs` | `number` | `250` | مدة تأخير التشخيص بعد توقف التغييرات |

## صادرات الوحدة الأساسية (`@powerduck/schema-editor`)

| الدالة | الوصف |
|----------|-------------|
| `resolveSchemas(document)` | حل مؤشرات `$ref` في مستند المخطط |
| `validateSchema(data, schema)` | التحقق من البيانات وفقًا للمخطط |
| `generateSample(schema)` | إنشاء بيانات نموذجية من JSON Schema |
| `getCompletionItems(model, position)` | جلب عناصر الإكمال عند موضع المؤشر |

## الأنواع

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
