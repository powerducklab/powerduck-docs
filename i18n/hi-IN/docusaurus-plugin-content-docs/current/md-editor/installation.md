---
sidebar_position: 2
title: "इंस्टॉल करें"
description: "npm, yarn या pnpm से @powerduck/md-editor इंस्टॉल करें और इम्पोर्ट पाथ, पीयर निर्भरताएँ तथा TypeScript समर्थन समझें।"
---

# इंस्टॉल करें

अपने पसंदीदा पैकेज मैनेजर से `@powerduck/md-editor` इंस्टॉल करें।

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## इम्पोर्ट पाथ

पैकेज अपने `package.json` में उप-पाथ एक्सपोर्ट स्पष्ट रूप से घोषित करता है:

| इम्पोर्ट पाथ | सामग्री |
|---|---|
| `@powerduck/md-editor` | मुख्य प्रवेश: `MarkdownEditor` क्लास और सभी स्वतंत्र हेल्पर, टाइप तथा फ़ंक्शन। |
| `@powerduck/md-editor/react` | React उप-पाथ: `MarkdownEditorReact` कॉम्पोनेंट और `MarkdownEditorProps`, `MarkdownEditorHandle` टाइप। |
| `@powerduck/md-editor/dist/style.css` | एडिटर की संकलित स्टाइलशीट; इसे एक बार इम्पोर्ट करना ज़रूरी है। |
| `@powerduck/md-editor/styles/tokens.css` | डिज़ाइन टोकन की मूल CSS कस्टम प्रॉपर्टी। |

पैकेज ECMAScript मॉड्यूल (`"type": "module"`) के रूप में दो बिल्ड देता है: `dist/index.mjs` (ESM) और `dist/index.cjs` (CommonJS)। टाइप घोषणाएँ `dist/index.d.ts` में होती हैं।

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

## पीयर निर्भरताएँ

`react` और `react-dom` **वैकल्पिक** पीयर निर्भरताएँ (`>=17`) हैं। इन्हें केवल `./react` उप-पाथ इम्पोर्ट करने पर चाहिए:

```bash
npm install react react-dom
```

फ़्रेमवर्क से स्वतंत्र `MarkdownEditor` क्लास और स्वतंत्र `renderMarkdown` फ़ंक्शन React पर निर्भर नहीं हैं। इन्हें React इंस्टॉल किए बिना किसी भी ब्राउज़र प्रोजेक्ट में इस्तेमाल कर सकते हैं।

## TypeScript समर्थन

पैकेज में अपनी टाइप घोषणाएँ शामिल हैं; अतिरिक्त `@types/*` पैकेज नहीं चाहिए। मुख्य प्रवेश `MarkdownEditorOptions`, `EditorMode`, `EditorTheme`, `ToolbarConfig`, `RendererOptions` और सभी हेल्पर टाइप देता है। `./react` उप-पाथ `MarkdownEditorProps` और `MarkdownEditorHandle` देता है।

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## CSS के साइड इफ़ेक्ट

`package.json` में `*.css` फ़ाइलों को साइड इफ़ेक्ट वाला चिह्नित किया गया है, ताकि बंडलर उन्हें tree-shaking में न हटाएँ। ऐप के प्रवेश बिंदु में `dist/style.css` एक बार इम्पोर्ट करें। इसमें एडिटर UI, `github-markdown-css` से प्रीव्यू, KaTeX और सभी प्लगइन की स्टाइल शामिल हैं।

## अगले कदम

- [तुरंत शुरुआत](/docs/hi-IN/md-editor/quickstart/) — अपना पहला एडिटर जोड़ें।
- [कॉन्फ़िगरेशन](/docs/hi-IN/md-editor/configuration/) — `MarkdownEditorOptions` के सभी विकल्प।
