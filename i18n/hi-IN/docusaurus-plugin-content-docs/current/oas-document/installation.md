---
sidebar_position: 2
title: "इंस्टॉल करना"
description: "@powerduck/oas-document और उसकी पीयर डिपेंडेंसी इंस्टॉल करें।"
---

# इंस्टॉल करना

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## पीयर डिपेंडेंसी

```bash
npm install react react-dom
```

## CSS इंपोर्ट करना

```tsx
import "@powerduck/oas-document/react/index.css";
```

कंपोनेंट के साथ उसकी स्टाइलशीट (tree CSS और md-editor CSS) शामिल हैं। पैकेज के एंट्री पॉइंट के अलावा कोई अतिरिक्त CSS इंपोर्ट करने की ज़रूरत नहीं है।

## एंट्री पॉइंट

| इंपोर्ट पाथ | विवरण |
|--------|-------------|
| `@powerduck/oas-document/react` | `<OasDocument />` कंपोनेंट और `useOasDocument` हुक |
| `@powerduck/oas-document` | कोर: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
