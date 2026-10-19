---
sidebar_position: 7
title: "उदाहरण"
description: "नीचे दिए उदाहरण वास्तविक एक्सपोर्ट और विकल्प नामों का उपयोग करते हैं। चलाने से पहले @powerduck/md-editor/dist/style.css को एक बार आयात करें। पृष्ठ में संदर्भित कंटेनर एलिमेंट बनाएँ और अपलोड के उदाहरणों के लिए अपना अपलोड एंडपॉइंट दें।"
---

# उदाहरण

नीचे दिए उदाहरण वास्तविक एक्सपोर्ट और विकल्प नामों का उपयोग करते हैं। चलाने से पहले `@powerduck/md-editor/dist/style.css` को एक बार आयात करें। पृष्ठ में संदर्भित कंटेनर एलिमेंट बनाएँ और अपलोड के उदाहरणों के लिए अपना अपलोड एंडपॉइंट दें।

## 1. सामान्य विकल्पों वाला बुनियादी संपादक

सामान्य विकल्पों के साथ साधारण JavaScript में `complex` मोड का `MarkdownEditor`:

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

## 2. नियंत्रित मान वाला React कंपोनेंट

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

`value` और `onChange` इंस्टेंस को फिर से नहीं बनाते, इसलिए टाइप करते समय CodeMirror इंस्टेंस नष्ट नहीं होता।

## 3. कस्टम टूलबार (ऐरे और रिकॉर्ड रूप)

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

मान्य क्रियाओं के 22 नाम [सुविधाएँ](./features.md#toolbar-actions) में दिए गए हैं।

## 4. छवि अपलोड जोड़ना

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

छवि फ़ाइल को संपादक में पेस्ट या ड्रॉप करें; हुक अपने आप चलेगा। बना हुआ Markdown कर्सर की जगह जोड़ा जाता है।

## 5. @mention जोड़ना

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

`@` टाइप करने से ड्रॉपडाउन खुलता है। आइटम चुनने पर `[@label](mention:id)` पाठ जुड़ता है, जो पूर्वावलोकन में शैलीबद्ध बैज के रूप में दिखता है।

## 6. `renderMarkdown` का स्वतंत्र उपयोग

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

`renderMarkdown` एक स्ट्रिंग लौटाता है और संपादक माउंट नहीं करता। माइंडमैप निष्क्रिय `<div>` प्लेसहोल्डर के रूप में बनते हैं; संपादक के बाहर इंटरैक्टिव आरेख चाहिए तो `Renderer.hydrate` खुद कॉल करें।

## 7. सरल मोड (टूलबार के बिना)

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

`simple` मोड में टूलबार, स्टेटस बार और पंक्ति संख्याएँ नहीं होतीं। रनटाइम पर `editor.setMode('complex')` से फिर भी `complex` में बदला जा सकता है।

## अगले चरण

- [API संदर्भ](./api-reference.md) — सभी मेथड के सिग्नेचर।
- [कॉन्फ़िगरेशन](./configuration.md) — विकल्पों के डिफ़ॉल्ट मान।
