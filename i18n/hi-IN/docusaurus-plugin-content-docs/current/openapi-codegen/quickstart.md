---
sidebar_position: 3
title: "तुरंत शुरुआत"
description: "@powerduck/openapi-codegen से अपना पहला चलने योग्य अनुरोध उदाहरण बनाएँ और उपलब्ध जनरेटर देखें।"
---

# तुरंत शुरुआत

इस गाइड में चलने योग्य अनुरोध उदाहरण बनाने और उपलब्ध जनरेटर खोजने का तरीका बताया गया है।

## 1. इंस्टॉल करें

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. दस्तावेज़ से कोड बनाएँ

**पहले से पार्स किया हुआ** OpenAPI दस्तावेज़ और लक्ष्य `path`, `method`, `language` तथा `client` दें। `generate()` सोर्स कोड को स्ट्रिंग के रूप में लौटाता है।

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

CommonJS में समान उदाहरण:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. उपलब्ध जनरेटर की सूची देखें

`list()` सभी पंजीकृत जनरेटर के विवरण लौटाता है:

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

हर विवरण का स्वरूप `{ language: string; client: string }` होता है। पहचानकर्ताओं में बड़े और छोटे अक्षरों का अंतर मायने रखता है; API संदर्भ की जनरेटर सूची में दिए गए मान ठीक वैसे ही इस्तेमाल करें। [API संदर्भ](/docs/hi-IN/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

कोड के ज़रिए भी जनरेटर चुन सकते हैं:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. प्रमाणीकरण जानकारी दें

नाम वाले सुरक्षा स्कीमा में मान भरने के लिए `securityValues` इस्तेमाल करें। कुंजियाँ दस्तावेज़ में सुरक्षा स्कीमा के नामों से मेल खानी चाहिए:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. सर्वर URL बदलें

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## त्रुटि प्रबंधन

इनपुट गायब हो या जनरेटर समर्थित न हो तो `generate()` अपवाद देता है। अविश्वसनीय दस्तावेज़ों को संसाधित करते समय अपवाद पकड़ें:

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## अगले कदम

- [कॉन्फ़िगरेशन](/docs/hi-IN/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [उदाहरण](/docs/hi-IN/openapi-codegen/examples/) — JavaScript fetch, Python requests, cURL, कस्टम जनरेटर, प्लगइन और `RequestIR` का सीधे इस्तेमाल।
- [API संदर्भ](/docs/hi-IN/openapi-codegen/api-reference/) — सभी एक्सपोर्ट।
