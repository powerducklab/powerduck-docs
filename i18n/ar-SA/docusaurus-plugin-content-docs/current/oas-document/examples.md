---
sidebar_position: 5
title: "أمثلة"
description: "تجاوز التحويل التلقائي، واستخدم الوحدة الأساسية دون React، وخصص السمات، وتعرّف على حدود أداء العرض."
---

# أمثلة

## هل لديك مستند OAS 3.2 صالح بالفعل؟

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## الوحدة الأساسية فقط (دون React)

استخدم نقطة دخول الوحدة الأساسية لواجهاتك المخصصة أو في Node.js:

```typescript
import { loadOasDocument } from "@powerduck/oas-document";

const result = await loadOasDocument(spec, { autoUpgrade: true });

if (result.error) {
  console.error("Failed:", result.error);
} else {
  console.log("Operations:", result.operations.length);
  console.log("Tree nodes:", result.tree.length);
}
```

## تخصيص الأنماط

يحصل العنصر الجذر على `data-theme="light"` أو `data-theme="dark"`. تُحدَّد جميع الألوان عبر متغيرات CSS ضمن `.pde-oas-root`:

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## ملاحظات حول الأداء

- يؤجَّل تحميل أمثلة الشيفرة حتى تصبح ضمن مسافة 600px من المنطقة المرئية (IntersectionObserver)
- يستخدم تمييز الصياغة ذاكرة تخزين مؤقت من نوع LRU (64 إدخالًا / 1MB)
- يستخدم تتبع التمرير مستمعات أحداث سلبية مع تقييد معدل التنفيذ عبر rAF
- يقتصر إنشاء الأمثلة على 6 مستويات تداخل و1,000 عقدة
