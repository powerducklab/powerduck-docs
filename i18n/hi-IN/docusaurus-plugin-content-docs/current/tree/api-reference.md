---
sidebar_position: 4
title: "API संदर्भ"
description: "Tree कंपोनेंट प्रॉप्स, अडैप्टर, कोर यूटिलिटी और प्रोग्राम से नियंत्रण के मेथड।"
---

# API संदर्भ

## कोर: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## अडैप्टर

### `buildOpenApiTree(document, options?)`

OpenAPI नेविगेशन ट्री बनाता है।

| विकल्प | टाइप | डिफ़ॉल्ट | विवरण |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | चालू होने पर `x-internal` या `x-scalar-ignore` वाले नोड दिखाता है |
| `showComponents` | `boolean` | `true` | कंपोनेंट सेक्शन दिखाएँ |
| `showWebhooks` | `boolean` | `true` | वेबहुक दिखाएँ |
| `defaultExpandDepth` | `number` | `2` | खोलने की डिफ़ॉल्ट गहराई |

नेविगेशन की प्राथमिकता: OAS 3.2 के मूल नेस्टेड टैग → `x-tagGroups` → सपाट टैग।

### `buildSchemaTree(schema, options?)`

| विकल्प | टाइप | डिफ़ॉल्ट | विवरण |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | नेस्टिंग की अधिकतम गहराई |
| `showDeprecated` | `boolean` | `true` | अप्रचलित प्रॉपर्टी दिखाएँ |
| `expandCombinators` | `boolean` | `true` | oneOf/anyOf/allOf खोलें |
| `showArrayItems` | `boolean` | `true` | ऐरे के आइटम खोलें |

### `buildDocTree(document, options?)`

Stripe जैसा दस्तावेज़ ट्री, जिसमें हर ऑपरेशन खोलने पर पैरामीटर, रिक्वेस्ट बॉडी और रिस्पॉन्स दिखते हैं।

## React `<Tree />` कंपोनेंट

### मुख्य प्रॉप्स

| प्रॉप | टाइप | डिफ़ॉल्ट | विवरण |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | ज़रूरी | रेंडर किए जाने वाले रूट नोड |
| `onSelect` | `(node) => void` | — | नोड चुने जाने पर कॉल होता है |
| `searchable` | `boolean` | `false` | खोज फ़ील्ड दिखाएँ |
| `defaultExpandDepth` | `number` | `1` | खोलने की शुरुआती गहराई |
| `showExpandAll` | `boolean` | `false` | सभी खोलने या समेटने का टॉगल |
| `draggable` | `boolean` | `false` | ड्रैग और ड्रॉप से क्रम बदलना चालू करें |
| `onReorder` | `(result: ReorderResult) => void` | — | एक ही पैरेंट में क्रम बदलने पर कॉल होता है |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | अलग स्तर पर ले जाने पर कॉल होता है |
| `canDrag` | `(node) => boolean` | — | कौन से नोड खींचे जा सकते हैं, यह नियंत्रित करें |
| `canDrop` | `(dragged, target, position) => boolean` | — | कहाँ ड्रॉप किया जा सकता है, यह नियंत्रित करें |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | राइट-क्लिक मेन्यू आइटम |
| `onPatch` | `(ops, context) => void` | — | क्रम बदलने पर RFC 6902 पैच ऑपरेशन |
| `maxHeight` | `number \| string` | — | स्क्रॉल आने से पहले अधिकतम ऊँचाई |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | आकार का विकल्प |

### प्रोग्राम से नियंत्रण (ref के ज़रिए)

| मेथड | विवरण |
|--------|-------------|
| `expandAll()` | सभी नोड खोलें |
| `collapseAll()` | सभी नोड समेटें |
| `expandToDepth(depth)` | निश्चित गहराई तक खोलें |
| `getExpandedIds()` | अभी खुले नोड की ID प्राप्त करें |
| `getSelectedNode()` | अभी चुना गया नोड प्राप्त करें |
| `scrollToNode(id)` | नोड को दृश्य क्षेत्र में लाएँ |
| `locateNode(predicate)` | नोड खोजें, पूर्वज खोलें, चुनें और दृश्य क्षेत्र में लाएँ |

## कोर यूटिलिटी

| फ़ंक्शन | विवरण |
|----------|-------------|
| `findNode(nodes, id)` | ID से नोड खोजें |
| `findPath(nodes, id)` | रूट से पूरा पाथ खोजें |
| `getLeaves(nodes)` | सभी लीफ़ नोड प्राप्त करें |
| `countNodes(nodes)` | सभी नोड गिनें |
| `filterTree(nodes, { query })` | खोज क्वेरी से फ़िल्टर करें |
| `flattenTree(nodes)` | प्रीऑर्डर सूची में बदलें |
| `updateNode(nodes, id, updater)` | मूल डेटा बदले बिना नोड अपडेट करें |
| `removeNode(nodes, id)` | मूल डेटा बदले बिना नोड हटाएँ |
