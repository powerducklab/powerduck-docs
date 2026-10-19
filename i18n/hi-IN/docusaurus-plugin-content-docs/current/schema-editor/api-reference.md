---
sidebar_position: 4
title: "API संदर्भ"
description: "SchemaEditor प्रॉप्स, कोर एक्सपोर्ट और एडिटर की भाषा के प्रकार।"
---

# API संदर्भ

## `<SchemaEditor />` — प्रॉप

| प्रॉप | टाइप | डिफ़ॉल्ट | विवरण |
|------|------|---------|-------------|
| `value` | `string` | ज़रूरी | एडिटर की सामग्री |
| `onChange` | `(value: string) => void` | — | सामग्री बदलने पर कॉल होता है |
| `language` | `"json" \| "yaml" \| "javascript"` | ज़रूरी | सामग्री की भाषा |
| `schema` | `JsonSchema` | — | ऑटोकम्प्लीट और डायग्नोस्टिक्स के लिए JSON Schema (json/yaml) |
| `snippets` | `string[]` | — | JavaScript के घोस्ट ऑटोकम्प्लीट के लिए स्निपेट स्ट्रिंग |
| `theme` | `"light" \| "dark"` | `"light"` | दृश्य थीम |
| `readOnly` | `boolean` | `false` | एडिटिंग बंद करें |
| `placeholder` | `string` | — | खाली होने पर दिखने वाला प्लेसहोल्डर टेक्स्ट |
| `showDiagnostics` | `boolean` | `true` | डायग्नोस्टिक्स स्टेटस बार दिखाएँ |
| `enableInlineSuggestions` | `boolean` | `true` | घोस्ट टेक्स्ट चालू करें |
| `enableCompletion` | `boolean` | `true` | पॉप-अप ऑटोकम्प्लीट चालू करें |
| `diagnosticsDebounceMs` | `number` | `250` | डायग्नोस्टिक्स का डिबाउंस विलंब |

## कोर एक्सपोर्ट (`@powerduck/schema-editor`)

| फ़ंक्शन | विवरण |
|----------|-------------|
| `resolveSchemas(document)` | स्कीमा दस्तावेज़ में `$ref` पॉइंटर रिज़ॉल्व करें |
| `validateSchema(data, schema)` | स्कीमा के अनुसार डेटा जाँचें |
| `generateSample(schema)` | JSON Schema से उदाहरण डेटा बनाएँ |
| `getCompletionItems(model, position)` | कर्सर की स्थिति पर ऑटोकम्प्लीट आइटम प्राप्त करें |

## टाइप

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
