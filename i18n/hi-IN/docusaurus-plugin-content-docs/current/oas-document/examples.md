---
sidebar_position: 5
title: "उदाहरण"
description: "अपने-आप होने वाला रूपांतरण छोड़ें, React के बिना कोर का उपयोग करें, थीम कस्टमाइज़ करें और रेंडरिंग की प्रदर्शन सीमाएँ समझें।"
---

# उदाहरण

## क्या आपके पास पहले से वैध OAS 3.2 दस्तावेज़ है?

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## केवल कोर मॉड्यूल (React के बिना)

कस्टम इंटरफ़ेस या Node.js के लिए कोर एंट्री पॉइंट का उपयोग करें:

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

## कस्टम स्टाइल

रूट एलिमेंट पर `data-theme="light"` या `data-theme="dark"` सेट होता है। सभी रंग `.pde-oas-root` के अंतर्गत CSS वेरिएबल से निर्धारित होते हैं:

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## प्रदर्शन संबंधी बातें

- कोड उदाहरण तब तक लोड नहीं होते जब तक वे व्यूपोर्ट से 600px के दायरे में न आ जाएँ (IntersectionObserver)
- सिंटैक्स हाइलाइटिंग LRU कैश का उपयोग करती है (64 प्रविष्टियाँ / 1MB)
- स्क्रॉल ट्रैकिंग में पैसिव लिसनर और rAF के ज़रिए निष्पादन की आवृत्ति सीमित की जाती है
- उदाहरण बनाने की सीमा नेस्टिंग के 6 स्तर और 1,000 नोड है
