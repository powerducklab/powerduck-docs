---
sidebar_position: 2
title: "इंस्टॉल करना"
description: "@powerduck/schema-editor और उसकी पीयर डिपेंडेंसी इंस्टॉल करें।"
---

# इंस्टॉल करना

```bash npm2yarn2pnpm
npm install @powerduck/schema-editor
```

## पीयर डिपेंडेंसी

```bash
npm install react react-dom monaco-editor @monaco-editor/react
```

## एंट्री पॉइंट

| इंपोर्ट पाथ | विवरण |
|--------|-------------|
| `@powerduck/schema-editor` | मुख्य API: स्कीमा रिज़ॉल्यूशन, डायग्नोस्टिक्स और उदाहरण बनाना |
| `@powerduck/schema-editor/react` | React का `<SchemaEditor />` कंपोनेंट |
| `@powerduck/schema-editor/core` | React के बिना ब्राउज़र में इस्तेमाल किया जा सकने वाला कोर |
