---
sidebar_position: 2
title: "التثبيت"
description: "ثبّت @powerduck/oas-document والاعتماديات النظيرة له."
---

# التثبيت

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## الاعتماديات النظيرة

```bash
npm install react react-dom
```

## استيراد CSS

```tsx
import "@powerduck/oas-document/react/index.css";
```

يتضمن المكوّن أوراق الأنماط الخاصة به (CSS لكلٍّ من tree وmd-editor)، لذلك لا يلزم استيراد أي ملفات CSS إضافية بخلاف نقطة دخول الحزمة.

## نقاط الدخول

| مسار الاستيراد | الوصف |
|--------|-------------|
| `@powerduck/oas-document/react` | المكوّن `<OasDocument />` والخطاف `useOasDocument` |
| `@powerduck/oas-document` | النواة: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
