---
sidebar_position: 4
title: "API संदर्भ"
description: "OasDocument प्रॉप्स, useOasDocument हुक और कोर फ़ंक्शन।"
---

# API संदर्भ

## `<OasDocument />` — प्रॉप

| प्रॉप | टाइप | डिफ़ॉल्ट | विवरण |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | ज़रूरी | OpenAPI/Swagger दस्तावेज़ (ऑब्जेक्ट, JSON स्ट्रिंग या YAML स्ट्रिंग) |
| `autoUpgrade` | `boolean` | `true` | `@powerduck/openapi-parser` से जाँच करके OAS 3.2 में बदलें |
| `defaultOperationId` | `string` | — | पहले रेंडर पर चुने जाने वाले ऑपरेशन की ID |
| `onOperationChange` | `(operation) => void` | — | उपयोगकर्ता के चयन बदलने पर कॉलबैक |
| `className` | `string` | — | रूट एलिमेंट की अतिरिक्त CSS क्लास |
| `style` | `React.CSSProperties` | — | रूट एलिमेंट की इनलाइन स्टाइल |
| `theme` | `"light" \| "dark"` | `"light"` | शुरुआती थीम। localStorage में सहेजी जाती है। |
| `header` | `OasDocumentHeaderConfig` | — | हेडर कॉन्फ़िगरेशन (लोगो, शीर्षक, नेविगेशन लिंक) |
| `showTree` | `boolean` | `true` | साइडबार ट्री दिखाएँ |
| `treeWidth` | `number` | `340` | साइडबार की चौड़ाई, पिक्सेल में (240–480) |

### हेडर कॉन्फ़िगरेशन

| फ़ील्ड | टाइप | डिफ़ॉल्ट |
|-------|------|---------|
| `logo` | `string \| ReactNode` | — |
| `title` | `string` | `"API Documentation"` |
| `navItems` | `Array<{ label, href?, onClick? }>` | `[]` |
| `showThemeToggle` | `boolean` | `true` |

## `useOasDocument(input, options?)`

```typescript
const {
  document,          // Oas32Document | null
  loading,           // boolean
  error,             // Error | null
  operations,        // OasOperation[]
  navigationGroups,  // OasNavigationGroup[]
  tree,              // TreeNode[]
  selectedOperation, // OasOperation | undefined
  setSelectedOperation,
  theme,             // "light" | "dark"
  setTheme,
} = useOasDocument(spec, { autoUpgrade: true });
```

## कोर फ़ंक्शन

| फ़ंक्शन | विवरण |
|----------|-------------|
| `loadOasDocument(input, options?)` | दस्तावेज़ लोड करके बदलता है। `{ document, operations, navigationGroups, tree, warnings, error }` लौटाता है |
| `parseOperations(document)` | OAS दस्तावेज़ से ऑपरेशन निकालें |
| `buildNavigationGroups(document)` | समूहों में बँटी नेविगेशन संरचना बनाएँ |
