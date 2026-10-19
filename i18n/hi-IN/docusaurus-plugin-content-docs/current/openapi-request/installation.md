---
sidebar_position: 2
title: "इंस्टॉल करें"
description: "@powerduck/openapi-request इंस्टॉल करें, प्रोटोकॉल के उप-पाथ समझें और gRPC तथा MCP के वैकल्पिक पैकेज जोड़ें।"
---

# इंस्टॉल करें

`@powerduck/openapi-request` ESM और CommonJS बिल्ड के साथ TypeScript घोषणाएँ देता है। Node.js `>= 22.12.0` चाहिए।

## इंस्टॉल करें

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

Yarn:

```bash
yarn add @powerduck/openapi-request
```

pnpm:

```bash
pnpm add @powerduck/openapi-request
```

## ESM / CommonJS

```javascript
// ESM
import { createClient } from "@powerduck/openapi-request";

// CommonJS
const { createClient } = require("@powerduck/openapi-request");
```

अतिरिक्त `@types/*` पैकेज नहीं चाहिए।

## पैकेज की संरचना और उप-पाथ एक्सपोर्ट

डिफ़ॉल्ट प्रवेश मुख्य API देता है। हर प्रोटोकॉल का अपना उप-पाथ भी है:

| इम्पोर्ट | सामग्री |
|---|---|
| `@powerduck/openapi-request` | मुख्य API: `createClient`, `createDebugger`, `createManualSession`, `AdapterRegistry`, `ProtoKitError`, OpenAPI हेल्पर और टाइप। |
| `@powerduck/openapi-request/http` | `HttpAdapter`, `SseParser`, स्ट्रीमिंग पहचानने वाले फ़ंक्शन और HTTP कलेक्शन व एनवायरनमेंट बिल्डर (`buildCollection`, `buildEnvironment`, `resolveServerUrl`)। |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`, `createWsManualSession`, WebSocket कॉन्फ़िगरेशन और सत्र हेल्पर। |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`, `GrpcAdapter`, `grpcCall`, `createGrpcManualSession` तथा खोज, रिफ़्लेक्शन, डिस्क्रिप्टर, कैटलॉग, प्रमाणीकरण जानकारी, लोडर और टेम्पलेट मॉड्यूल। |
| `@powerduck/openapi-request/mcp` | `McpAdapter`, `createMcpManualSession`, `createMcpStdioSession` तथा MCP ट्रांसपोर्ट, कॉन्फ़िगरेशन, खोज और जनरेशन मॉड्यूल। |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`, `resolveGraphQLConfig`, `runGraphQL`, इंट्रोस्पेक्शन, ऑपरेशन जनरेशन और बदलाव वापस लिखना। |

प्रोटोकॉल का उप-पाथ इम्पोर्ट करने पर उसी के टाइप और हेल्पर आते हैं; असंबंधित अडैप्टर दोबारा एक्सपोर्ट नहीं होते।

## वैकल्पिक सुविधा पैकेज

gRPC और MCP की निर्भरताएँ बड़ी हैं और **पहली बार इस्तेमाल होने पर लोड** होती हैं। केवल HTTP वाली स्थापना इनके बिना काम करती है। संबंधित प्रोटोकॉल चाहिए तभी इंस्टॉल करें:

- **gRPC** को `@grpc/grpc-js` और `@grpc/proto-loader` चाहिए। सर्वर रिफ़्लेक्शन के लिए `loadFileDescriptorSetFromBuffer` उपलब्ध कराने वाला `@grpc/proto-loader >= 0.7` भी ज़रूरी है।
- **MCP** को `@modelcontextprotocol/sdk` चाहिए।

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

पैकेज गायब होने पर gRPC लोडर सही इंस्टॉलेशन कमांड के साथ `GrpcDependencyMissingError` देता है। पैकेज मौजूद लेकिन खराब हो तो `GrpcDependencyBrokenError` मिलता है।

## सत्यापन

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

पैकेज इंस्टॉल होने पर दोनों इम्पोर्ट काम करते हैं।

## अगले कदम

- [तुरंत शुरुआत](/docs/hi-IN/openapi-request/quickstart/)
- [कॉन्फ़िगरेशन](/docs/hi-IN/openapi-request/configuration/)
