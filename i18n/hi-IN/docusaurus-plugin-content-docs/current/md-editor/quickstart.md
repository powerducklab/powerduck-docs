---
sidebar_position: 3
title: "तुरंत शुरुआत"
description: "साधारण JavaScript में MarkdownEditor जोड़ें, React कंपोनेंट इस्तेमाल करें या renderMarkdown से Markdown को स्वतंत्र रूप से रेंडर करें।"
---

# तुरंत शुरुआत

`@powerduck/md-editor` को तीन तरीकों से इस्तेमाल किया जा सकता है: साधारण JavaScript एडिटर, React कंपोनेंट और स्वतंत्र Markdown रेंडरर के रूप में। हर ऐप में स्टाइलशीट एक बार इम्पोर्ट करें।

## साधारण JavaScript

कन्स्ट्रक्टर का सिग्नेचर `new MarkdownEditor(container, options?)` है। पहला आर्ग्युमेंट `HTMLElement` या CSS सेलेक्टर स्ट्रिंग हो सकता है।

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

माउंट करने के लिए कंटेनर न मिलने पर कन्स्ट्रक्टर `MarkdownEditor: mount container not found` त्रुटि देता है।

## React

`./react` सबपाथ से `MarkdownEditorReact` इम्पोर्ट करें। यह `forwardRef` कंपोनेंट नियंत्रित (`value`) और अनियंत्रित (`defaultValue`) दोनों तरीके समर्थन करता है और `ref` के ज़रिए प्रोग्राम से नियंत्रित करने का इंटरफ़ेस देता है।

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

संरचना से जुड़े विकल्प (`mode`, `math`, `mindmap`, `preview`, `autoPreview`, `renderDebounce`) बदलने पर अंदरूनी इंस्टेंस दोबारा बनता है। `value`, `onChange` और `theme` हल्के सिंक के ज़रिए अपडेट होते हैं; इंस्टेंस दोबारा नहीं बनता। इससे बड़े दस्तावेज़ों में भी नियंत्रित एडिटर तेज़ी से प्रतिक्रिया देता है।

## स्वतंत्र रेंडरिंग

एडिटर माउंट किए बिना Markdown को HTML में बदलने के लिए `renderMarkdown(source, options?)` इस्तेमाल करें। इसमें एडिटर प्रीव्यू वाले ही प्लगइन और स्टाइल इस्तेमाल होते हैं।

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` एक स्ट्रिंग लौटाता है। इससे बने माइंड मैप प्लेसहोल्डर अपने-आप इंटरैक्टिव SVG नहीं बनते। यह प्रक्रिया केवल सक्रिय एडिटर के प्रीव्यू में `Renderer.hydrate` के ज़रिए होती है।

## अगले कदम

- [कॉन्फ़िगरेशन](/docs/hi-IN/md-editor/configuration/) — `MarkdownEditorOptions` के सभी फ़ील्ड।
- [सुविधाएँ](/docs/hi-IN/md-editor/features/) — फ़ॉर्मूले, माइंड मैप, टूलबार और कीबोर्ड शॉर्टकट कैसे काम करते हैं।
- [API संदर्भ](/docs/hi-IN/md-editor/api-reference/) — पूरा सार्वजनिक API।
- [उदाहरण](/docs/hi-IN/md-editor/examples/) — कॉपी करके इस्तेमाल करने योग्य पूरे उदाहरण।
