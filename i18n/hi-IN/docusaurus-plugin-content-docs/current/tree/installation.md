---
sidebar_position: 2
title: "इंस्टॉल करना"
description: "@powerduck/tree और उसकी पीयर डिपेंडेंसी इंस्टॉल करें।"
---

# इंस्टॉल करना

```bash npm2yarn2pnpm
npm install @powerduck/tree
```

## पीयर डिपेंडेंसी

```bash
npm install react react-dom react-icons
```

## CSS इंपोर्ट करना

```tsx
import "@powerduck/tree/react/index.css";
```

## एंट्री पॉइंट

| इंपोर्ट पाथ | विवरण |
|--------|-------------|
| `@powerduck/tree` | मुख्य टाइप, यूटिलिटी और सभी अडैप्टर |
| `@powerduck/tree/react` | React का Tree कंपोनेंट और हुक |
| `@powerduck/tree/adapters` | OpenAPI, JSON Schema और दस्तावेज़ों के अडैप्टर |
| `@powerduck/tree/core` | केवल मुख्य टाइप और यूटिलिटी |
