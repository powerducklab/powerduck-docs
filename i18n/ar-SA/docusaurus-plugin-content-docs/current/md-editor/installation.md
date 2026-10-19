---
sidebar_position: 2
title: "التثبيت"
description: "ثبّت @powerduck/md-editor عبر npm أو yarn أو pnpm وتعرّف إلى مسارات الاستيراد والاعتماديات النظيرة ودعم TypeScript."
---

# التثبيت

ثبّت `@powerduck/md-editor` باستخدام مدير الحزم الذي تفضله.

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## مسارات الاستيراد

تعرّف الحزمة تصديرات المسارات الفرعية صراحةً في `package.json`:

| مسار الاستيراد | المحتوى |
|---|---|
| `@powerduck/md-editor` | نقطة الدخول الرئيسية: الصنف `MarkdownEditor` وجميع الأدوات المساعدة والأنواع والدوال المستقلة. |
| `@powerduck/md-editor/react` | مسار React الفرعي: المكوّن `MarkdownEditorReact` والنوعان `MarkdownEditorProps` و`MarkdownEditorHandle`. |
| `@powerduck/md-editor/dist/style.css` | ملف تنسيق المحرر المبني؛ يجب استيراده مرة واحدة. |
| `@powerduck/md-editor/styles/tokens.css` | خصائص CSS المخصصة الأصلية لرموز التصميم. |

تُنشر الحزمة كوحدة ECMAScript (`"type": "module"`) ببناءين: `dist/index.mjs` لـ ESM و`dist/index.cjs` لـ CommonJS. تُنتج تعريفات الأنواع في `dist/index.d.ts`.

```ts
// Vanilla JS main entry
import { MarkdownEditor, renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';
```

```tsx
// React subpath
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';
```

## الاعتماديات النظيرة

تُعلن `react` و`react-dom` كاعتماديات نظيرة **اختيارية** (`>=17`). تحتاج إليهما فقط عند استيراد المسار الفرعي `./react`:

```bash
npm install react react-dom
```

لا يعتمد الصنف `MarkdownEditor` المستقل عن الأطر ولا الدالة المستقلة `renderMarkdown` على React، لذا يعملان في أي مشروع متصفح دون تثبيته.

## دعم TypeScript

تتضمن الحزمة تعريفات الأنواع، ولا تحتاج إلى حزم `@types/*` إضافية. تتيح نقطة الدخول الرئيسية `MarkdownEditorOptions` و`EditorMode` و`EditorTheme` و`ToolbarConfig` و`RendererOptions` وجميع الأنواع المساعدة. ويتيح المسار `./react` النوعين `MarkdownEditorProps` و`MarkdownEditorHandle`.

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## الآثار الجانبية لملفات CSS

تُعلّم ملفات `*.css` في `package.json` بأنها ذات آثار جانبية، كي لا تحذفها أدوات التجميع أثناء tree-shaking. استورد `dist/style.css` مرة واحدة في نقطة دخول التطبيق؛ فهو يجمع تنسيق واجهة المحرر والمعاينة عبر `github-markdown-css` وتنسيق KaTeX وجميع الإضافات.

## الخطوات التالية

- [البدء السريع](/docs/ar-SA/md-editor/quickstart/) — أضف أول محرر إلى تطبيقك.
- [الإعدادات](/docs/ar-SA/md-editor/configuration/) — جميع خيارات `MarkdownEditorOptions`.
