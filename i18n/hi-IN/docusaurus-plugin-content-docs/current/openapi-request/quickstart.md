---
sidebar_position: 3
title: "तुरंत शुरुआत"
description: "createClient, createDebugger और createManualSession से अनुरोध तैयार करके भेजें, बैच चलाएँ और लंबे समय तक सक्रिय रहने वाले सत्र संभालें।"
---

# तुरंत शुरुआत

इस गाइड में तीन प्रवेश बिंदु क्रम से समझाए गए हैं: UI के लिए क्लाइंट, स्क्रिप्ट के लिए डीबगर और लंबे समय तक चलने वाले मैनुअल सत्र।

## ज़रूरी शर्तें

- Node.js 22.12.0 या नया संस्करण
- JavaScript ऑब्जेक्ट के रूप में लोड किया गया OpenAPI 3.2 दस्तावेज़

## 1. UI के लिए क्लाइंट

`createClient(options?)` एक `ProtoClient` लौटाता है। वैकल्पिक `options` आर्ग्युमेंट नतीजों को स्पेसिफ़िकेशन में वापस लिखने और रिस्पॉन्स को मानकीकृत करने का तरीका नियंत्रित करता है।

```typescript
import { createClient } from "@powerduck/openapi-request";

// Create a client (options are optional)
const client = createClient({
  writeBack: {
    // Optional: control how responses are merged back into the spec
    mergeExamples: true,
  },
  response: {
    // Optional: control how response objects are normalized
    preserveOriginalBody: false,
  },
});
```

### अनुरोध तैयार करें

`prepare(sendOptions)` में `spec` और `target` वाला `SendOptions` ऑब्जेक्ट दिया जाता है। यह प्रोटोकॉल, डिस्प्ले मोड और स्ट्रीम के प्रकार का विवरण देने वाला `PreparedRequest` लौटाता है।

```typescript
const spec = {
  openapi: "3.2.0",
  info: { title: "Example API", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "OK" } },
      },
    },
  },
};

// Target by operationId (recommended)
const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

// Or target by method + path
const plan2 = client.prepare({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});

console.log(plan.protocol);      // "http"
console.log(plan.display.mode);  // "response"
console.log(plan.stream.kind);   // "none"
```

### अनुरोध भेजें

`send(sendOptions)` भी `SendOptions` ऑब्जेक्ट लेता है। वास्तविक मान `values` के ज़रिए दें।

```typescript
const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: {
    path: { id: "42" },
    query: { include: "profile" },
    header: { "X-Request-Id": "abc-123" },
  },
  serverUrl: "https://api.example.com",
  auth: {
    type: "bearer",
    token: "your-token-here",
  },
  timeout: 15000,
});

console.log(result.response.status);   // e.g. 200
console.log(result.response.body);     // parsed response body
console.log(result.response.headers);  // response headers
console.log(result.response.timings.durationMs); // duration in ms
```

### बैच भेजें

`sendMany(spec, targets, shared?)` कई अनुरोध चलाता है और हर लक्ष्य का नतीजा लौटाता है। कुछ अनुरोध विफल होने पर भी दूसरे सफल अनुरोधों के नतीजे नहीं हटते।

```typescript
const batchResult = await client.sendMany(
  spec,
  [
    { target: { operationId: "getUserById" }, values: { path: { id: "1" } } },
    { target: { operationId: "getUserById" }, values: { path: { id: "2" } } },
    { target: { operationId: "getUserById" }, values: { path: { id: "3" } } },
  ],
  {
    serverUrl: "https://api.example.com",
    auth: { type: "bearer", token: "your-token" },
  },
);

batchResult.results.forEach((r, i) => {
  if ("error" in r) {
    console.log(`Request ${i} failed:`, r.error);
  } else {
    console.log(`Request ${i} status:`, r.response.status);
  }
});
```

## 2. स्क्रिप्ट के लिए डीबगर

`createDebugger(config?)` ऑटोमेशन, स्क्रिप्ट और CI के लिए `ProtoKit` लौटाता है।

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const requestDebugger = createDebugger({
  // Optional: custom adapter list
  // adapters: [new HttpAdapter(), new WebSocketAdapter()],
  // Optional: extra adapters added to the defaults
  // extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});

// Single request
const result = await requestDebugger.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});

// Batch request
const batch = await requestDebugger.sendMany(
  spec,
  [
    { target: { operationId: "listUsers" } },
    { target: { operationId: "getUserById" }, values: { path: { id: "1" } } },
  ],
  { serverUrl: "https://api.example.com" },
);

// Export as Postman-compatible collection
const collection = requestDebugger.toCollection(spec, {
  name: "My API Collection",
});
```

## 3. लंबे समय तक चलने वाले मैनुअल सत्र

`createManualSession(options)` WebSocket, MCP और gRPC के लिए दोतरफ़ा सत्र लौटाता है।

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  protocol: "websocket",
  url: "wss://api.example.com/ws",
  // For MCP:
  // protocol: "mcp",
  // transport: "http", // or "stdio"
  // url: "https://api.example.com/mcp",
  // For gRPC:
  // protocol: "grpc",
  // url: "localhost:50051",
});

// Open the connection
await session.open();

// Send a message
await session.send({ type: "message", data: "hello" });

// Subscribe to events
const unsubscribe = session.subscribe((event) => {
  console.log("Event:", event.type, event.data);
});

// Close when done
await session.close();
unsubscribe();
```

## अगले कदम

- [API संदर्भ](/docs/hi-IN/openapi-request/api-reference/) — एक्सपोर्ट किए गए सभी फ़ंक्शन और टाइप।
- [कॉन्फ़िगरेशन](/docs/hi-IN/openapi-request/configuration/) — `SendOptions` के सभी फ़ील्ड।
- [उदाहरण](/docs/hi-IN/openapi-request/examples/) — हर प्रोटोकॉल के लिए इस्तेमाल के उदाहरण।
