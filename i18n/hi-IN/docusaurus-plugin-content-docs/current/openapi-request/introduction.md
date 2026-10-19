---
sidebar_position: 1
title: "@powerduck/openapi-request का परिचय"
description: "@powerduck/openapi-request, OpenAPI 3.2 के लिए कलेक्शन डीबगर और अनुरोध रनटाइम है। यह OpenAPI दस्तावेज़ से अनुरोध तैयार करके भेजता है, स्ट्रीमिंग प्रतिक्रियाओं की पहचान करता है और प्राप्त प्रतिक्रियाओं के आधार पर अद्यतन दस्तावेज़ बना सकता है। एक छोटे इंटरफ़ेस से छह संचार प्रोटोकॉल का उपयोग किया जा सकता है।"
---

# @powerduck/openapi-request का परिचय

`@powerduck/openapi-request`, OpenAPI 3.2 के लिए कलेक्शन डीबगर और अनुरोध रनटाइम है। यह OpenAPI दस्तावेज़ से अनुरोध तैयार करके भेजता है, स्ट्रीमिंग प्रतिक्रियाओं की पहचान करता है और प्राप्त प्रतिक्रियाओं के आधार पर अद्यतन दस्तावेज़ बना सकता है। एक छोटे इंटरफ़ेस से छह संचार प्रोटोकॉल का उपयोग किया जा सकता है।

- **पैकेज का नाम:** `@powerduck/openapi-request`
- **संस्करण:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **लाइसेंस:** MIT
- **मॉड्यूल प्रारूप:** टाइप घोषणाओं सहित ESM और CommonJS, दोनों बिल्ड उपलब्ध हैं।

## उपयोग

यह लाइब्रेरी एक ही दस्तावेज़ को आधार बनाकर तीन ज़रूरतें पूरी करती है:

- **ग्राफ़िकल इंटरफ़ेस के लिए क्लाइंट** — `createClient()` ऐसा ऑब्जेक्ट लौटाता है जिसके `prepare()`, `send()`, `connect()`, `discover()` और `writeback()` मेथड ग्राफ़िकल अनुरोध एडिटर के अलग-अलग चरणों से मेल खाते हैं।
- **स्क्रिप्ट से नियंत्रित डीबगर** — `createDebugger()` ऑटोमेशन, स्क्रिप्ट और CI के लिए `send()`, `sendMany()` तथा `toCollection()` वाला `ProtoKit` लौटाता है।
- **मैन्युअल रूप से प्रबंधित लंबे सत्र** — `createManualSession()` खोलने, भेजने और बंद करने की क्रियाओं तथा इवेंट स्ट्रीम वाला दोतरफ़ा सत्र ऑब्जेक्ट लौटाता है। WebSocket, MCP और gRPC में इसकी संरचना एक जैसी है, इसलिए एक ही इंटरफ़ेस तीनों को संभाल सकता है।

## प्रोटोकॉल एडैप्टर

मुख्य लाइब्रेरी किसी विशेष ट्रांसपोर्ट पर निर्भर नहीं है; प्रोटोकॉल का व्यवहार `AdapterRegistry` में पंजीकृत एडैप्टर प्रदान करते हैं।

- **HTTP / SSE** — डिफ़ॉल्ट रूप से समर्थित। सामान्य JSON अनुरोधों और Server-Sent Events स्ट्रीम की पहचान घोषित सामग्री प्रकार या वास्तविक प्रतिक्रिया हेडर के आधार पर अपने-आप होती है।
- **WebSocket** — एक समान इवेंट संरचना के साथ टेक्स्ट या बाइनरी डेटा के दोतरफ़ा सत्र।
- **gRPC** — `.proto` फ़ाइलों या सर्वर रिफ़्लेक्शन के आधार पर यूनरी, सर्वर-स्ट्रीमिंग, क्लाइंट-स्ट्रीमिंग और दोतरफ़ा स्ट्रीमिंग कॉल।
- **MCP** — Streamable HTTP या stdio के ज़रिए Model Context Protocol टूल को कॉल करना।
- **GraphQL** — इंट्रोस्पेक्शन, ऑपरेशन बनाना और उन्हें चलाना।

## मुख्य सुविधाएँ

- **OpenAPI 3.2 कलेक्शन मॉडल** — `operationId` या `method`+`path` से ऑपरेशन ढूँढता है और पैरामीटर, अनुरोध बॉडी तथा उदाहरणों से अनुरोध तैयार करता है।
- **स्ट्रीमिंग की पहचान** — `isStreamingOperation()`, `isSseContentType()` और `isStreamingContentType()` घोषित सामग्री प्रकार से प्रतिक्रियाओं का वर्गीकरण करते हैं; `probeStreamingResponse()` वास्तविक प्रतिक्रिया हेडर जाँचता है।
- **प्रतिक्रियाओं को दस्तावेज़ में वापस लिखना** — `inferSchema()`, `mergeSchema()`, `toResponseObject()` और `writeBackResponse()` प्रतिक्रिया स्कीमा का अनुमान लगाकर अद्यतन दस्तावेज़ लौटाते हैं। डिफ़ॉल्ट रूप से, वापस लिखना सफल होने पर `send()` उसे `patchedSpec` में लौटाता है; इसे बंद करने के लिए `writeBack: false` सेट करें। इनपुट दस्तावेज़ नहीं बदलता और कोई फ़ाइल अपने-आप सेव नहीं होती। परिणाम को स्थायी रूप से सेव करने से पहले `writeBackSkippedReason` और `writeBackWarnings` जाँचें।
- **स्कीमा सहायक** — `sampleFromSchema()` स्कीमा से नमूना डेटा बनाता है।
- **बड़ी निर्भरताओं की विलंबित लोडिंग** — gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`) और MCP (`@modelcontextprotocol/sdk`) पहली बार उपयोग होने पर लोड होते हैं। केवल HTTP इस्तेमाल करने वालों को इनकी लोडिंग का अतिरिक्त खर्च नहीं उठाना पड़ता।

## इंस्टॉलेशन

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## त्वरित शुरुआत

```typescript
import { createClient } from "@powerduck/openapi-request";

const spec = {
  openapi: "3.2.0",
  info: { title: "Users", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User" } },
      },
    },
  },
};

const client = createClient();

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

## अगले चरण

- [इंस्टॉलेशन](./installation.md) — पैकेज संरचना, उपपथ एक्सपोर्ट और प्रोटोकॉल सुविधाओं की पीयर निर्भरताएँ।
- [त्वरित शुरुआत](./quickstart.md) — पहला अनुरोध, डीबगर चलाना और मैन्युअल सत्र।
- [कॉन्फ़िगरेशन](./configuration.md) — `CreateClientOptions`, `DebuggerOptions` और हर प्रोटोकॉल की सेटिंग।
- [API संदर्भ](./api-reference.md) — सुविधा के अनुसार व्यवस्थित सभी एक्सपोर्ट।
- [उदाहरण](./examples.md) — HTTP, SSE, WebSocket, GraphQL, MCP और gRPC के चलाने योग्य उदाहरण।

## लाइसेंस

MIT.
