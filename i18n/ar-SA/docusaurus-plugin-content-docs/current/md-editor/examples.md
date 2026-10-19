---
sidebar_position: 7
title: "أمثلة"
description: "تستخدم الأمثلة التالية التصديرات وأسماء الخيارات الفعلية"
---

# أمثلة

تستخدم الأمثلة التالية التصديرات وأسماء الخيارات الفعلية. استورد `@powerduck/md-editor/dist/style.css` مرة واحدة قبل تشغيلها. أنشئ عناصر الحاويات المشار إليها في صفحتك، ووفّر نقطة نهاية خاصة بك لأمثلة رفع الملفات.

## 1. محرر أساسي بخيارات شائعة

محرر `MarkdownEditor` بلغة JavaScript العادية في وضع `complex`، مع ضبط الخيارات الشائعة:

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const options: MarkdownEditorOptions = {
  value: '# Hello\n\nStart writing here...',
  mode: 'complex',
  theme: 'light',
  math: true,
  mindmap: true,
  codeHighlight: true,
  tips: true,
  preview: true,
  autoPreview: true,
  renderDebounce: false, // render synchronously for this demo
  onChange: (value) => console.log('changed:', value.length, 'chars'),
  onImageUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url as string;
  },
  toolbar: ['heading', 'bold', 'italic', 'link', 'image', 'code'],
};

const editor = new MarkdownEditor('#editor', options);
// Call editor.destroy() when removing this editor from the page.

document.querySelector('#save')?.addEventListener('click', () => {
  console.log(editor.getValue());
});
```

## 2. مكوّن React بقيمة متحكَّم بها

```tsx
import { useRef, useState } from 'react';
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';

function NoteEditor() {
  const [value, setValue] = useState('# Draft\n\nWrite something...');
  const handleRef = useRef<MarkdownEditorHandle>(null);

  return (
    <div>
      <button onClick={() => handleRef.current?.getHtml()}>Render HTML</button>
      <MarkdownEditorReact
        ref={handleRef}
        value={value}
        onChange={setValue}
        mode="complex"
        theme="light"
      />
    </div>
  );
}

export default NoteEditor;
```

لا يؤدي `value` و`onChange` إلى إعادة إنشاء المثيل، لذلك لا تُدمّر الكتابة مثيل CodeMirror.

## 3. شريط أدوات مخصص (بصيغة مصفوفة أو سجل)

```ts
import { MarkdownEditor } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

// Array form: an include-list. Actions retain the built-in toolbar order.
new MarkdownEditor('#editor-array', {
  mode: 'complex',
  toolbar: ['bold', 'italic', 'link', 'code', 'math'],
});

// Record form: per-item overrides. Everything not listed stays visible.
new MarkdownEditor('#editor-record', {
  mode: 'complex',
  toolbar: {
    bold: { label: 'Make bold' },
    image: { show: false },
    youtube: { show: false },
    theme: { icon: '<svg>...</svg>' },
  },
});
```

أسماء الإجراءات الصالحة هي الأسماء الـ 22 الواردة في [الميزات](./features.md#toolbar-actions).

## 4. دمج رفع الصور

```ts
import { MarkdownEditor } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const editor = new MarkdownEditor('#editor', {
  mode: 'complex',
  onImageUpload: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error('Upload failed');
    const { url } = await res.json();
    return url; // inserted as ![filename](url)
  },
});
```

الصق ملف صورة أو أفلته في المحرر؛ تُستدعى الدالة تلقائيًا. يُدرَج نص Markdown الناتج عند موضع المؤشر.

## 5. دمج @mention

```ts
import { MarkdownEditor, type MentionItem } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const USERS: MentionItem[] = [
  { id: '1', label: 'Alice', avatar: 'https://example.com/a.png', description: 'alice@example.com' },
  { id: '2', label: 'Bob', description: 'bob@example.com' },
];

new MarkdownEditor('#editor', {
  mode: 'complex',
  mention: {
    onMentionSearch: async (query) =>
      USERS.filter((u) => u.label.toLowerCase().includes(query.toLowerCase())),
    onMentionSelect: (item) => `[@${item.label}](mention:${item.id})`,
    minChars: 0,
    maxItems: 8,
  },
});
```

تفتح كتابة `@` القائمة المنسدلة. يؤدي اختيار عنصر إلى إدراج النص `[@label](mention:id)` الذي يظهر كشارة منسّقة في المعاينة.

## 6. استخدام `renderMarkdown` بصورة مستقلة

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const source = [
  '# Hello',
  '',
  'Inline: $E=mc^2$.',
  '',
  '```ts',
  'const x: number = 1;',
  '```',
  '',
  ':::tip',
  'Callout block.',
  ':::',
].join('\n');

const html = renderMarkdown(source, { math: true, tips: true });
document.getElementById('output')!.innerHTML = html;
```

تعيد `renderMarkdown` سلسلة نصية ولا تُنشئ محررًا في الصفحة. تُخرَج الخرائط الذهنية كعناصر نائبة `<div>` غير نشطة؛ استدعِ `Renderer.hydrate` بنفسك إذا احتجت إلى مخططات تفاعلية خارج المحرر.

## 7. الوضع البسيط (دون شريط أدوات)

```ts
import { MarkdownEditor } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const editor = new MarkdownEditor('#editor', {
  value: '# Minimal editor\n\nNo toolbar, no status bar.',
  mode: 'simple',   // default; pure edit + preview
  theme: 'dark',
  preview: true,
});
```

لا يحتوي وضع `simple` على شريط أدوات أو شريط حالة أو أرقام أسطر. يمكنك مع ذلك التحويل إلى `complex` أثناء التشغيل باستخدام `editor.setMode('complex')`.

## الخطوات التالية

- [مرجع API](./api-reference.md) — تواقيع جميع الأساليب.
- [الإعدادات](./configuration.md) — القيم الافتراضية للخيارات.
