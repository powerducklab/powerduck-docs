---
sidebar_position: 3
title: "البدء السريع"
description: "ابدأ باستخدام MarkdownEditor في JavaScript أو React، أو حوّل Markdown إلى HTML مباشرة باستخدام renderMarkdown."
---

# البدء السريع

يمكن استخدام `@powerduck/md-editor` بثلاث طرق: محرر JavaScript دون إطار عمل، أو مكوّن React، أو محرّك مستقل لعرض Markdown. استورد ورقة الأنماط مرة واحدة لكل تطبيق.

## JavaScript دون إطار عمل

توقيع المُنشئ هو `new MarkdownEditor(container, options?)`. الوسيط الأول إما عنصر `HTMLElement` أو سلسلة نصية لمحدّد CSS.

```ts
import { MarkdownEditor } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const editor = new MarkdownEditor('#editor', {
  value: '# Hello\n\nStart typing...',
  mode: 'complex', // 'simple' (default) | 'complex'
  theme: 'light',  // 'light' (default) | 'dark'
  math: true,
  mindmap: true,
  onChange: (value) => console.log(value),
});

// Read and write content
const markdown = editor.getValue();
editor.setValue('# Updated content');
```

إذا تعذّر العثور على حاوية التركيب، يُطلق المُنشئ الخطأ `MarkdownEditor: mount container not found`.

## React

استورد `MarkdownEditorReact` من المسار الفرعي `./react`. يستخدم المكوّن `forwardRef` ويدعم النمط المُتحكَّم فيه (`value`) وغير المُتحكَّم فيه (`defaultValue`)، ويتيح واجهة للتحكم البرمجي عبر `ref`.

```tsx
import { useRef, useState } from 'react';
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';

function App() {
  const [value, setValue] = useState('# Hello');
  const editorRef = useRef<MarkdownEditorHandle>(null);

  return (
    <MarkdownEditorReact
      ref={editorRef}
      value={value}
      onChange={setValue}
      mode="complex"
      theme="light"
    />
  );
}
```

عند تغيير الخيارات البنيوية (`mode` و`math` و`mindmap` و`preview` و`autoPreview` و`renderDebounce`)، يُعاد إنشاء النسخة الداخلية. أما `value` و`onChange` و`theme` فتُحدَّث بمزامنة خفيفة دون إعادة الإنشاء، للحفاظ على استجابة المحرر مع المستندات الكبيرة.

## العرض المستقل

استخدم `renderMarkdown(source, options?)` لتحويل Markdown إلى HTML دون تركيب محرر، مع الإضافات والأنماط نفسها المستخدمة في معاينة المحرر.

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

تعيد `renderMarkdown` سلسلة نصية. لا تتحول العناصر النائبة للخرائط الذهنية تلقائيًا إلى مخططات SVG تفاعلية؛ إذ تتم تهيئتها للتفاعل داخل معاينة المحرر فقط عبر `Renderer.hydrate`.

## الخطوات التالية

- [الإعدادات](/docs/ar-SA/md-editor/configuration/) — جميع حقول `MarkdownEditorOptions`.
- [الميزات](/docs/ar-SA/md-editor/features/) — آلية عمل المعادلات والخرائط الذهنية وأشرطة الأدوات واختصارات لوحة المفاتيح.
- [مرجع API](/docs/ar-SA/md-editor/api-reference/) — واجهة API العامة كاملة.
- [أمثلة](/docs/ar-SA/md-editor/examples/) — أمثلة كاملة جاهزة للنسخ.
