---
sidebar_position: 6
title: "उदाहरण"
description: "ये इंटीग्रेशन उदाहरण सार्वजनिक API का उपयोग करते हैं। हर उदाहरण में इस्तेमाल ऑपरेशन ID और पाथ वाला लोड किया गया OpenAPI 3.2 दस्तावेज़ spec के रूप में दें। उदाहरण के URL, टोकन और स्थानीय फ़ाइल पाथ को अपने मानों से बदलें। नेटवर्क उदाहरणों के लिए पहुँच योग्य सेवा आवश्यक है; ये स्वतंत्र मॉक सर्वर नहीं हैं।"
---

# उदाहरण

ये इंटीग्रेशन उदाहरण सार्वजनिक API का उपयोग करते हैं। हर उदाहरण में इस्तेमाल ऑपरेशन ID और पाथ वाला लोड किया गया OpenAPI 3.2 दस्तावेज़ `spec` के रूप में दें। उदाहरण के URL, टोकन और स्थानीय फ़ाइल पाथ को अपने मानों से बदलें। नेटवर्क उदाहरणों के लिए पहुँच योग्य सेवा आवश्यक है; ये स्वतंत्र मॉक सर्वर नहीं हैं।

## 1. SendOptions के साथ HTTP अनुरोध

`prepare()` और `send()` दोनों `spec`, `target` और `values` वाला `SendOptions` ऑब्जेक्ट लेते हैं।

```typescript
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Create client and debugger (options are optional)
const client = createClient();
const dbg = createDebugger();

// Plan a request by operationId
const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

console.log(plan.protocol);      // "http"
console.log(plan.display.mode);  // "response"
console.log(plan.stream.kind);   // "none"

// Send the request with concrete values
const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: {
    path: { id: "42" },
    query: { include: "profile" },
  },
  serverUrl: "https://api.example.com",
  auth: { type: "bearer", token: "your-token" },
  timeout: 15000,
});

console.log(result.response.status);   // e.g. 200
console.log(result.response.body);     // body value returned by the adapter
console.log(result.response.headers);  // response headers
console.log(result.response.timings.durationMs); // request duration in ms
```

### मेथड और पाथ से लक्ष्य चुनें

```typescript
const plan2 = client.prepare({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

### sendMany से बैच निष्पादन

```typescript
const batch = await dbg.sendMany(
  spec,
  [
    { target: { operationId: "listUsers" } },
    { target: { operationId: "getUserById" }, values: { path: { id: "1" } } },
    { target: { operationId: "getUserById" }, values: { path: { id: "2" } } },
  ],
  {
    serverUrl: "https://api.example.com",
    auth: { type: "bearer", token: "your-token" },
  },
);

batch.results.forEach((r, i) => {
  if ("error" in r) {
    console.log(`Request ${i} failed:`, r.error);
  } else {
    console.log(`Request ${i} status:`, r.response.status);
  }
});
```

## 2. SSE स्ट्रीमिंग

जब प्रतिक्रिया में `text/event-stream` घोषित हो, तो क्लाइंट अपने-आप `event-list` डिस्प्ले मोड की योजना बनाता है।

```typescript
const plan = client.prepare({
  spec,
  target: { operationId: "streamEvents" },
});

console.log(plan.stream.kind);   // "sse"
console.log(plan.display.mode);   // "event-list"
```

### वास्तविक एंडपॉइंट की जाँच करें

```typescript
import { probeStreamingResponse } from "@powerduck/openapi-request";

const probe = await probeStreamingResponse("https://api.example.com/events");
console.log(probe.kind, probe.status); // "sse" | "ndjson" | "chunked" | "none"
// The probe performs a request; consume or cancel its response body.
await probe.response.body?.cancel();
```

### SSE स्ट्रीम पार्स करें

```typescript
import { SseParser } from "@powerduck/openapi-request/http";

const response = await fetch("https://api.example.com/events");
if (!response.ok || !response.body) throw new Error("SSE response unavailable");
const parser = new SseParser();
const reader = response.body.getReader();
try {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const event of parser.push(value)) console.log(event.event, event.data);
  }
  for (const event of parser.flush()) console.log(event.event, event.data);
} finally {
  await reader.cancel();
  reader.releaseLock();
}
```

## 3. WebSocket सत्र

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

// Subscribe before opening so connection events are included.
const subscription = session.onEvent((event) => {
  console.log("Event:", event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "subscribe", channel: "updates" });
  // Keep the session open for as long as your application needs it.
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

## 4. GraphQL ऑपरेशन

```typescript
import {
  discoverAndWriteGraphQLSchema,
  runGraphQL,
} from "@powerduck/openapi-request/graphql";

const endpoint = "https://api.example.com/graphql";
const headers = { Authorization: `Bearer ${token}` };

// Returns a new spec; introspection must be enabled by the server.
const discovered = await discoverAndWriteGraphQLSchema(spec, endpoint, { headers });
console.log(discovered.spec, discovered.warnings);

// Execute an explicit query with a matching server schema.
const result = await runGraphQL({
  endpoint,
  headers,
  query: "query GetUser($id: ID!) { user(id: $id) { id name } }",
  operationName: "GetUser",
  variables: { id: "42" },
  useGet: false,
}, {
  spec,
  target: { operationId: "getUserById" },
  timeout: 15000,
});
console.log(result.response.body);
```

## 5. MCP टूल कॉल (HTTP और stdio)

```typescript
import { createManualSession } from "@powerduck/openapi-request";

// Streamable HTTP
const httpSession = createManualSession({
  kind: "mcp",
  endpoint: "https://mcp.example.com/mcp",
  headers: { Authorization: `Bearer ${token}` },
});

// stdio child process
const stdioSession = createManualSession({
  kind: "mcp",
  transport: "stdio",
  command: "node",
  args: ["./mcp-server.js"],
});

// Only the HTTP session is opened here. Opening stdioSession starts its process.
try {
  await httpSession.open();
  const outcome = await httpSession.send({
    method: "tools/call",
    params: { name: "get_user", arguments: { id: "42" } },
  });
  console.log(outcome);
} finally {
  await httpSession.close();
}
```

## 6. gRPC यूनरी कॉल

```typescript
import { grpcCall } from "@powerduck/openapi-request/grpc";

const result = await grpcCall({
  address: "grpc.example.com:50051",
  service: "helloworld.Greeter",
  method: "SayHello",
  protoPaths: ["./protos/helloworld.proto"],
  metadata: { "x-tenant": "acme" },
  deadlineMs: 5000,
}, {
  messages: [{ name: "World" }],
});

console.log(result.messages); // decoded response(s)
console.log(result.status);   // { code, codeName, details }
```

यही फ़ंक्शन `options.messages` और `maxMessages`, `idleTimeoutMs`, `maxSessionMs` जैसी सीमाओं के साथ सर्वर स्ट्रीमिंग, क्लाइंट स्ट्रीमिंग और द्विदिश स्ट्रीमिंग भी चलाता है। लंबे समय तक चलने वाली स्ट्रीम के लिए `createGrpcManualSession()` इस्तेमाल करें।

## 7. प्रतिक्रिया को स्पेसिफ़िकेशन में वापस लिखना

```typescript
import { writeBackResponse, toResponseObject, locateOperation } from "@powerduck/openapi-request";

// Locate the operation
const located = locateOperation(spec, { operationId: "getUserById" });

// Build a response object from the result
const fragment = toResponseObject(result, {
  // Optional: response normalization options
});

// Write back into the spec
const updated = writeBackResponse(
  spec,
  located.path,
  located.method,
  fragment,
  {
    // Optional: WriteBackOptions
    overwriteExamples: true,
  },
);
```

`writeBackResponse()` संशोधित कॉपी लौटाता है; यह फ़ाइल नहीं सहेजता। कैप्चर किए गए उदाहरण प्रकाशित करने से पहले जाँचें। डीबगर की भेजने वाली पाइपलाइन के विपरीत, यह निम्न-स्तरीय फ़ंक्शन `requirePassingTests` लागू नहीं करता।

### प्रतिक्रिया से स्कीमा का अनुमान और नमूना बनाना

```typescript
import { inferSchema, sampleFromSchema } from "@powerduck/openapi-request";

// Use this for JSON responses; handle parse errors for non-JSON bodies.
const body = result.response.body;
const schema = inferSchema(typeof body === "string" ? JSON.parse(body) : body);

// Generate a realistic sample from the schema
const sample = sampleFromSchema(schema);
```

## यह भी देखें

- [त्वरित शुरुआत](./quickstart.md)
- [API संदर्भ](./api-reference.md)
- [कॉन्फ़िगरेशन](./configuration.md)
