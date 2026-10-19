---
sidebar_position: 4
title: "कॉन्फ़िगरेशन"
description: "कॉन्फ़िगरेशन की तीन परतें हैं: क्लाइंट/डीबगर बनाने वाले फ़ंक्शन के विकल्प, prepare() और send() को दिया जाने वाला SendOptions ऑब्जेक्ट, और प्रोटोकॉल-विशिष्ट विकल्प।"
---

# कॉन्फ़िगरेशन

कॉन्फ़िगरेशन की तीन परतें हैं: क्लाइंट/डीबगर बनाने वाले फ़ंक्शन के विकल्प, `prepare()` और `send()` को दिया जाने वाला `SendOptions` ऑब्जेक्ट, और प्रोटोकॉल-विशिष्ट विकल्प।

## फ़ैक्टरी विकल्प

### `CreateClientOptions`

इन्हें `createClient(options?)` को दिया जाता है। सभी फ़ील्ड वैकल्पिक हैं।

| फ़ील्ड | टाइप | विवरण |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | प्रतिक्रियाओं को स्पेसिफ़िकेशन में मर्ज करने का तरीका नियंत्रित करता है |
| `response` | `ToResponseOptions` | प्रतिक्रिया ऑब्जेक्ट का सामान्यीकरण नियंत्रित करता है |

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: {
    overwriteExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    includeExamples: false,
    // ... other ToResponseOptions
  },
});
```

### `DebuggerOptions`

इन्हें `createDebugger(config?)` को दिया जाता है। सभी फ़ील्ड वैकल्पिक हैं।

| फ़ील्ड | टाइप | विवरण |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | कस्टम अडैप्टर सूची; यह सभी डिफ़ॉल्ट अडैप्टर की जगह लेती है |
| `extraAdapters` | `ProtocolAdapter[]` | डिफ़ॉल्ट रजिस्ट्री में जोड़े जाने वाले अतिरिक्त अडैप्टर |
| `writeBack` | `WriteBackOptions` | स्पेसिफ़िकेशन में वापस लिखने के विकल्प |
| `response` | `ToResponseOptions` | प्रतिक्रिया सामान्यीकरण के विकल्प |
| `writeBackTruncated` | `boolean` | अधूरी स्ट्रीम से अनुमानित स्कीमा को वापस लिखें; डिफ़ॉल्ट: `true` |

```typescript
import { createDebugger, HttpAdapter, WebSocketAdapter } from "@powerduck/openapi-request";

// Use only HTTP and WebSocket adapters
const debugger1 = createDebugger({
  adapters: [new HttpAdapter(), new WebSocketAdapter()],
});

// Add a custom adapter to the defaults
const debugger2 = createDebugger({
  extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});
```

### स्पेसिफ़िकेशन में वापस लिखना और कैप्चर किए गए उदाहरण

`WriteBackOptions` में `strategy` (`"merge"` या `"replace"`, डिफ़ॉल्ट `"merge"`), `keepExistingDescription` (डिफ़ॉल्ट `true`), `allowedStatusCodes` (खाली होने पर सभी), `protectComponentRefs` (डिफ़ॉल्ट `true`), `overwriteExamples` (डिफ़ॉल्ट `true`) और `requirePassingTests` उपलब्ध हैं। भेजने की पाइपलाइन टेस्ट पास होने की शर्त लागू करती है; सीधे `writeBackResponse` कॉल करने पर यह शर्त लागू नहीं होती।

`ToResponseOptions` में `includeExamples` (डिफ़ॉल्ट `true`), `maxExampleChars` (डिफ़ॉल्ट `4000`) और `maxEventPreviewChars` (डिफ़ॉल्ट `200`) उपलब्ध हैं। उदाहरण कैप्चर करना बंद करें या प्रकाशित करने से पहले उनकी समीक्षा करें: वास्तविक प्रतिक्रियाओं में क्रेडेंशियल या निजी डेटा हो सकता है।

भेजने की पाइपलाइन आम तौर पर संशोधित कॉपी को `patchedSpec` में लौटाती है; यह इनपुट दस्तावेज़ नहीं बदलती और न ही फ़ाइल सहेजती है। इस चरण को छोड़ने के लिए संबंधित कॉल में `writeBack: false` सेट करें। फ़ैक्टरी का `writeBack` ऑब्जेक्ट मर्ज करने का तरीका तय करता है, जबकि हर कॉल का boolean मान इसे चालू या बंद करता है।

## `SendOptions`

`prepare()` और `send()` का मुख्य इनपुट ऑब्जेक्ट। इसमें स्पेसिफ़िकेशन, लक्ष्य, मान और अनुरोध स्तर के सभी कॉन्फ़िगरेशन दिए जाते हैं।

| फ़ील्ड | टाइप | आवश्यक | विवरण |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | हाँ | पूरा OpenAPI 3.2 दस्तावेज़ |
| `target` | `OperationTarget` | हाँ | ऑपरेशन की पहचान (नीचे देखें) |
| `values` | `RequestValues` | नहीं | पाथ/क्वेरी/हेडर/कुकी/बॉडी के वास्तविक मान |
| `serverUrl` | `string` | नहीं | `spec.servers[0].url` को ओवरराइड करता है |
| `serverVariables` | `Record<string, string>` | नहीं | सर्वर URL टेम्पलेट के वेरिएबल |
| `variables` | `Record<string, string>` | नहीं | `{{name}}` के रूप में संदर्भित एनवायरनमेंट वेरिएबल |
| `globals` | `Record<string, string>` | नहीं | Postman शैली के ग्लोबल वेरिएबल |
| `localVariables` | `Record<string, string>` | नहीं | स्थानीय वेरिएबल |
| `collectionVariables` | `Record<string, string>` | नहीं | कलेक्शन स्तर के वेरिएबल |
| `auth` | `AuthConfig` | नहीं | प्रमाणीकरण कॉन्फ़िगरेशन |
| `scripts` | `ScriptConfig` | नहीं | अनुरोध से पहले की स्क्रिप्ट और टेस्ट स्क्रिप्ट |
| `runner` | `RuntimeRunOptions` | नहीं | सभी postman-runtime विकल्प सीधे आगे भेजता है; सबसे अधिक प्राथमिकता |
| `websocket` | `WebSocketOptions` | नहीं | WebSocket-विशिष्ट विकल्प |
| `graphql` | `GraphQLOptions` | नहीं | GraphQL-विशिष्ट विकल्प |
| `mcp` | `McpOptions` | नहीं | MCP-विशिष्ट विकल्प |
| `grpc` | `any` | नहीं | gRPC-विशिष्ट विकल्प |
| `timeout` | `number` | नहीं | हर अनुरोध का टाइमआउट, मिलीसेकंड में; `runner.timeout.request` का सुविधाजनक शॉर्टकट |

`SendOptions` में निष्पादन और स्ट्रीमिंग के ये नियंत्रण भी उपलब्ध हैं:

| फ़ील्ड | टाइप | विवरण |
| --- | --- | --- |
| `fetch` | `typeof fetch` | जहाँ समर्थित हो, होस्ट द्वारा दिया गया अलग fetch ट्रांसपोर्ट; HTTP/SSE अभी भी postman-runtime का उपयोग करते हैं। |
| `writeBack` | `boolean` | `false` सेट करने पर `responseFragment` बनता रहेगा, लेकिन `patchedSpec` undefined रहेगा। |
| `signal` | `AbortSignal` | निष्पादन या सैंपलिंग रद्द करें; इसके बाद भी आंशिक परिणाम लौट सकता है। |
| `maxEvents` | `number` | रखे जाने वाले स्ट्रीमिंग इवेंट की अधिकतम संख्या। |
| `maxStreamMs` | `number` | स्ट्रीमिंग सैंपलिंग की अधिकतम अवधि, मिलीसेकंड में। |
| `maxResponseSize` | `number` | प्रतिक्रिया की बाइट सीमा। |
| `maxBufferChars` | `number` | इवेंट सीमा तक पहुँचने से पहले SSE पार्सर के बफ़र की सीमा; डिफ़ॉल्ट `4194304` वर्ण। |
| `maxEventChars` | `number` | हर SSE इवेंट में रखे जाने वाले डेटा की सीमा; डिफ़ॉल्ट `1048576` वर्ण। |
| `inheritEventId` | `boolean` | ID न मिलने पर पिछले SSE इवेंट का ID लें; डिफ़ॉल्ट `true`। अधिक सख्त स्कीमा अनुमान के लिए `false` सेट करें। |
| `onEvent` | `(event: StreamEvent) => void` | स्ट्रीमिंग इवेंट प्राप्त करें। |
| `onConsole` | `(log: ConsoleLog) => void` | स्क्रिप्ट के कंसोल आउटपुट प्राप्त करें। |
| `onAssertion` | `(assertion: AssertionResult) => void` | असर्शन के परिणाम प्राप्त करें। |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | शुरुआती HTTP/SSE हेडर और `streaming` वर्गीकरण देखें। |
| `onOpen` | `(info) => void` | WebSocket कनेक्शन के विवरण प्राप्त करें: URL, प्रोटोकॉल और हेडर। |

अलग-अलग प्रोटोकॉल अडैप्टर सीमाओं को अलग तरह से लागू कर सकते हैं। UI कॉलबैक हल्के रखें; कॉलबैक से फेंके गए अपवाद निष्पादन परत में पकड़े जाते हैं। HTTP अनुरोध भेजने वाले घटक की सेटिंग के लिए `runner.requester` इस्तेमाल करें; यदि `maxResponseSize` दिया जाए तो वह धनात्मक होना चाहिए, शून्य नहीं।

### `OperationTarget`

एक ऑपरेशन की पहचान करता है। `operationId` या `method` + `path` में से एक तरीका चुनें। दोनों दिए जाने पर `operationId` को प्राथमिकता मिलती है।

| फ़ील्ड | टाइप | विवरण |
| --- | --- | --- |
| `operationId` | `string` | वैकल्पिक खोज कुंजी; पाथ + मेथड से अधिक प्राथमिकता |
| `method` | `string` | HTTP मेथड, जिसमें अक्षरों का केस मायने नहीं रखता। `path` आवश्यक है। |
| `path` | `string` | टेम्पलेट वाला पाथ, जैसे `/users/{id}`। `method` आवश्यक है। |

```typescript
// By operationId (recommended)
const result1 = await client.send({
  spec,
  target: { operationId: "getUserById" },
});

// By method + path
const result2 = await client.send({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

### `RequestValues`

बनाए गए अनुरोध में डाले जाने वाले वास्तविक मान।

| फ़ील्ड | टाइप | विवरण |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | पाथ पैरामीटर के मान |
| `query` | `Record<string, unknown>` | क्वेरी पैरामीटर के मान |
| `header` | `Record<string, unknown>` | हेडर के मान |
| `cookie` | `Record<string, unknown>` | कुकी के मान |
| `querystring` | `string` | पहले से एन्कोड की गई रॉ क्वेरी स्ट्रिंग; OpenAPI 3.2 का `querystring` स्थान |
| `body` | `unknown` | अनुरोध की बॉडी |
| `contentType` | `string` | ऑपरेशन में कई अनुरोध मीडिया टाइप घोषित हों तो किसी एक को अनिवार्य रूप से चुनें |

```typescript
const result = await client.send({
  spec,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { version: "2" },
    header: { "X-Request-Id": "abc-123" },
    body: { name: "Alice", email: "alice@example.com" },
    contentType: "application/json",
  },
});
```

### `AuthConfig`

| फ़ील्ड | टाइप | विवरण |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | प्रमाणीकरण का प्रकार |
| `token` | `string` | Bearer टोकन (`type: "bearer"` के लिए) |
| `username` | `string` | Basic प्रमाणीकरण का उपयोगकर्ता नाम (`type: "basic"` के लिए) |
| `password` | `string` | Basic प्रमाणीकरण का पासवर्ड (`type: "basic"` के लिए) |
| `key` | `string` | API कुंजी का नाम (`type: "apikey"` के लिए) |
| `value` | `string` | API कुंजी का मान (`type: "apikey"` के लिए) |
| `in` | `"header" \| "query"` | API कुंजी का स्थान (`type: "apikey"` के लिए) |

```typescript
// Bearer token
const result1 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "bearer", token: "your-jwt-token" },
});

// Basic auth
const result2 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "basic", username: "admin", password: "secret" },
});

// API key in header
const result3 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "apikey", key: "X-API-Key", value: "key-123", in: "header" },
});
```

उन्नत प्रमाणीकरण प्रकार हैं: `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` और `edgegrid`। HTTP/SSE/GraphQL के Postman हेल्पर फ़ील्ड `parameters: Record<string, string | boolean | number>` से दें। वैकल्पिक `oauth2: OAuth2FlowConfig`, OAuth 2.0 प्रकार के लिए टोकन प्राप्त करना और रीफ़्रेश करना सक्षम करता है; यह न मानें कि हर प्रमाणीकरण हेल्पर सभी प्रोटोकॉल पर लागू होता है।

### `ScriptConfig`

| फ़ील्ड | टाइप | विवरण |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | कलेक्शन स्तर की अनुरोध-पूर्व स्क्रिप्ट |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | कलेक्शन स्तर की टेस्ट स्क्रिप्ट |
| `preRequest` | `ScriptSource \| ScriptSource[]` | अनुरोध स्तर की अनुरोध-पूर्व स्क्रिप्ट |
| `test` | `ScriptSource \| ScriptSource[]` | अनुरोध स्तर की टेस्ट स्क्रिप्ट |
| `fromSpecExtensions` | `boolean` | स्पेसिफ़िकेशन से `x-postman-scripts` पढ़ें; डिफ़ॉल्ट: `true` |
| `captureLastResponse` | `boolean` | अंतिम प्रतिक्रिया को बाद के अनुरोधों के लिए उपलब्ध कराने वाला बिल्ट-इन हेल्पर जोड़ें |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

यदि आप आयात किए गए स्पेसिफ़िकेशन में शामिल स्क्रिप्ट नहीं चलाना चाहते, तो `scripts.fromSpecExtensions: false` सेट करें। वर्तमान डिफ़ॉल्ट `true` है; भविष्य में डिफ़ॉल्ट बदलने की धारणा पर निर्भर न रहें।

## प्रोटोकॉल-विशिष्ट विकल्प

### HTTP / SSE

HTTP डिफ़ॉल्ट अडैप्टर है। घोषित `text/event-stream` सामग्री SSE उपयोग करने का संकेत देती है; हेडर आने पर निष्पादन वास्तविक प्रतिक्रिया का भी वर्गीकरण करता है। `probeStreamingResponse()` अलग से स्पष्ट रूप से चलाया जाने वाला जाँच फ़ंक्शन है; यह हर कॉल से पहले अपने-आप नहीं चलता।

साधारण HTTP अनुरोधों के लिए अतिरिक्त कॉन्फ़िगरेशन आवश्यक नहीं है। उन्नत postman-runtime कॉन्फ़िगरेशन के लिए `SendOptions.runner` इस्तेमाल करें।

### WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
  // Manual-session options are distinct from SendOptions.websocket.
});
```

### MCP

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "mcp",
  endpoint: "https://api.example.com/mcp",
});
```

डिफ़ॉल्ट मैनुअल MCP सत्र Streamable HTTP और `endpoint` इस्तेमाल करता है। stdio के लिए `kind: "mcp"`, `transport: "stdio"`, स्थानीय `command` और वैकल्पिक `args` दें; सत्र शुरू करने पर कॉन्फ़िगर की गई प्रक्रिया शुरू होती है।

### gRPC

gRPC के लिए पता, डिस्क्रिप्टर स्रोत (`.proto` फ़ाइलें या सर्वर रिफ़्लेक्शन), सेवा का पूर्ण नाम और मेथड आवश्यक हैं:

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "grpc",
  address: "localhost:50051",
  service: "powerduck.examples.Echo",
  method: "Echo",
  protoPaths: ["./echo.proto"],
});
```

मैनुअल सत्र बनाने वाले फ़ंक्शन ऐसा सत्र लौटाते हैं जो अभी खुला नहीं है। भेजने से पहले `open()` और संसाधन छोड़ते समय `close()` कॉल करें। gRPC उदाहरण के लिए मेल खाता स्थानीय सर्वर और proto फ़ाइल आवश्यक हैं; मैनुअल सत्र के विकल्प `SendOptions.grpc` वाले ऑब्जेक्ट से अलग हैं।

## पूरा उदाहरण

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const result = await client.send({
  spec: openApiDocument,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { verbose: "true" },
    header: { "X-Request-Id": "req-abc" },
    body: { name: "Alice", email: "alice@example.com" },
  },
  serverUrl: "https://api.staging.example.com",
  auth: { type: "bearer", token: "staging-token" },
  timeout: 10000,
  variables: {
    environment: "staging",
  },
});

console.log(result.response.status);
console.log(result.response.body);
console.log(result.response.headers);
```

## अगले चरण

- निर्यात किए गए सभी टाइप के लिए [API संदर्भ](./api-reference.md) देखें
- प्रोटोकॉल-विशिष्ट उपयोग के लिए [उदाहरण](./examples.md) देखें
