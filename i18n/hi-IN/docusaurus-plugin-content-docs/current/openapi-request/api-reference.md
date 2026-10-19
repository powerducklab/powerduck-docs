---
sidebar_position: 5
title: "API संदर्भ"
description: "@powerduck/openapi-request के मुख्य इंटीग्रेशन API का संदर्भ। तालिकाएँ इंटरफ़ेस अनुबंध का सार देती हैं; सभी ओवरलोड और वैकल्पिक पैरामीटर के लिए पैकेज की TypeScript घोषणाएँ पूर्ण स्रोत हैं। मुख्य एंट्री पॉइंट और प्रोटोकॉल के सबपाथ से निर्यात होने वाले घटक समान नहीं हैं।"
---

# API संदर्भ

`@powerduck/openapi-request` के मुख्य इंटीग्रेशन API का संदर्भ। तालिकाएँ इंटरफ़ेस अनुबंध का सार देती हैं; सभी ओवरलोड और वैकल्पिक पैरामीटर के लिए पैकेज की TypeScript घोषणाएँ पूर्ण स्रोत हैं। मुख्य एंट्री पॉइंट और प्रोटोकॉल के सबपाथ से निर्यात होने वाले घटक समान नहीं हैं।

## मुख्य API

### `createClient(options?): ProtoClient`

UI-केंद्रित क्लाइंट बनाता है। `options` आर्ग्युमेंट वैकल्पिक है।

**पैरामीटर:**

| नाम | टाइप | विवरण |
| --- | --- | --- |
| `options` | `CreateClientOptions` | वैकल्पिक कॉन्फ़िगरेशन |
| `options.writeBack` | `WriteBackOptions` | प्रतिक्रियाओं को स्पेसिफ़िकेशन में मर्ज करने का तरीका नियंत्रित करता है |
| `options.response` | `ToResponseOptions` | प्रतिक्रिया ऑब्जेक्ट का सामान्यीकरण नियंत्रित करता है |

**लौटाता है:** इन मेथड वाला `ProtoClient`:

| मेथड | सिग्नेचर | विवरण |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | अनुरोध की योजना बनाकर प्रोटोकॉल, डिस्प्ले मोड और स्ट्रीम का प्रकार लौटाता है |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | अनुरोध चलाता है |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | हर लक्ष्य के अलग परिणाम के साथ बैच निष्पादन; किसी विफलता से दूसरे परिणाम नहीं हटते |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | अभी तक न खुला websocket/mcp/grpc सत्र बनाता है; कनेक्ट करने के लिए `open()` कॉल करें |
| `discover` | `(discoverOptions) => Promise<any>` | MCP और gRPC की क्षमताएँ खोजता है |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | प्राप्त प्रतिक्रिया को दस्तावेज़ में मर्ज करता है |
| `dispose` | `() => void` | फ़िलहाल कोई कार्रवाई नहीं करता; कॉल करने वाले को अपने सत्र बंद करने होंगे |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | Fetch अनुरोध चलाकर प्रतिक्रिया का वर्गीकरण करता है; लौटाई गई प्रतिक्रिया की बॉडी पढ़ें या रद्द करें |

**उदाहरण:**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
});
```

### `createDebugger(config?): ProtoKit`

ऑटोमेशन, स्क्रिप्ट और CI के लिए स्क्रिप्ट से चलने वाला डीबगर बनाता है।

**पैरामीटर:**

| नाम | टाइप | विवरण |
| --- | --- | --- |
| `config` | `DebuggerOptions` | वैकल्पिक कॉन्फ़िगरेशन |
| `config.adapters` | `ProtocolAdapter[]` | डिफ़ॉल्ट अडैप्टर की जगह लेने वाली कस्टम अडैप्टर सूची |
| `config.extraAdapters` | `ProtocolAdapter[]` | डिफ़ॉल्ट सूची में जोड़े जाने वाले अडैप्टर |
| `config.writeBack` | `WriteBackOptions` | स्पेसिफ़िकेशन में वापस लिखने के विकल्प |
| `config.response` | `ToResponseOptions` | प्रतिक्रिया सामान्यीकरण के विकल्प |
| `config.writeBackTruncated` | `boolean` | अधूरी स्ट्रीम से अनुमानित स्कीमा वापस लिखता है; डिफ़ॉल्ट: true |

**लौटाता है:** `prepare`, `send`, `sendMany`, `toCollection` और अन्य मेथड वाला `ProtoKit`।

**उदाहरण:**

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const dbg = createDebugger({
  writeBackTruncated: true,
});

const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

### `createManualSession(options): AnyManualSession`

WebSocket, MCP और gRPC के लिए लंबे समय तक चलने वाला द्विदिश सत्र बनाता है। फ़ैक्टरी कोई I/O नहीं करती; कनेक्शन `open()` से खुलता है।

**पैरामीटर:**

| नाम | टाइप | विवरण |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | इस्तेमाल किया जाने वाला प्रोटोकॉल |
| `options.url` | `string` | WebSocket कनेक्शन URL |
| `options.endpoint` | `string` | MCP Streamable HTTP एंडपॉइंट |
| `options.transport` | `"streamable-http" \| "stdio"` | MCP ट्रांसपोर्ट; डिफ़ॉल्ट Streamable HTTP है |
| `options.command`, `options.args` | `string`, `string[]` | MCP stdio के लिए स्थानीय निष्पादन योग्य फ़ाइल और आर्ग्युमेंट |
| `options.address`, `options.service`, `options.method` | `string` | gRPC पता, सेवा का पूर्ण नाम और मेथड |

gRPC के लिए `protoPaths` या `reflection` से डिस्क्रिप्टर स्रोत भी दें। प्रोटोकॉल-विशिष्ट विकल्प [कॉन्फ़िगरेशन](./configuration.md) में दिए गए हैं।

**लौटाता है:** `open()`, `send()`, `close()`, `onEvent()`, `waitForClose()`, `events` और `state` वाला सत्र। `onEvent()` ऐसा सब्सक्रिप्शन लौटाता है जिसमें `unsubscribe()` होता है।

**उदाहरण:**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

const subscription = session.onEvent((event) => {
  console.log(event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "message", data: "hello" });
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

### `AdapterRegistry`

`ProtocolAdapter` इंस्टेंस की रजिस्ट्री। नई रजिस्ट्री खाली होती है; `createDebugger()` बिल्ट-इन HTTP, WebSocket, gRPC, MCP और GraphQL अडैप्टर रजिस्टर करता है, जब तक उन्हें कस्टम सूची से बदला न जाए। चयन प्रबंधित करने के लिए `register()`, `unregister()`, `get()`, `list()`, `rank()` और `resolve()` इस्तेमाल करें।

### `ProtoKitError`

डीबगर और मुख्य निष्पादन पथों से फेंका जाने वाला टाइप किया हुआ एरर। लाइब्रेरी के एरर और अप्रत्याशित विफलता में अंतर करने के लिए `instanceof ProtoKitError` इस्तेमाल करें।

## मुख्य टाइप

### `SendOptions`

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

### `PreparedRequest`

`createClient().prepare()` इसे लौटाता है। डीबगर की योजना का परिणाम अलग है: `createDebugger().prepare()` ऐसा `PlanResult` लौटाता है जिसमें `located`, `adapter` और `plan` होते हैं।

| फ़ील्ड | टाइप | विवरण |
| --- | --- | --- |
| `protocol` | `string` | तय किया गया प्रोटोकॉल: http, websocket, grpc, graphql, mcp |
| `transport` | `string` | तय किया गया ट्रांसपोर्ट |
| `target` | `OperationTarget` | मूल लक्ष्य |
| `operation` | `any` | तय किया गया OpenAPI ऑपरेशन ऑब्जेक्ट |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | स्ट्रीम का वर्गीकरण (नीचे देखें) |
| `stream.expected` | `boolean` | क्या स्ट्रीमिंग अपेक्षित है |
| `openapi.extensions` | `Record<string, unknown>` | तय किए गए OpenAPI एक्सटेंशन |
| `warnings` | `string[]` | योजना बनाते समय आई चेतावनियाँ |

### `StreamKind`

स्ट्रीम का सटीक वर्गीकरण: `"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## OpenAPI सहायक फ़ंक्शन

| निर्यात | सिग्नेचर | विवरण |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | `OperationTarget` से ऑपरेशन ढूँढता है |
| `inferSchema` | `(value) => Schema` | एक प्राप्त मान से JSON Schema का अनुमान लगाता है |
| `inferSchemaFromMany` | `(values) => Schema` | कई प्राप्त मानों को समेटने वाला स्कीमा बनाता है |
| `mergeSchema` | `(a, b) => Schema` | दो अनुमानित स्कीमा मर्ज करता है (यूनियन या संयोजन) |
| `sampleFromSchema` | `(schema) => unknown` | स्कीमा के लिए वास्तविक जैसा उदाहरण मान बनाता है |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | प्राप्त परिणाम से OpenAPI प्रतिक्रिया ऑब्जेक्ट बनाता है |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | प्राप्त प्रतिक्रिया को दस्तावेज़ में मर्ज करता है |

निर्यात किए गए टाइप: `LocatedOperation`, `WriteBackOptions`, `ToResponseOptions`।

## HTTP / SSE

नीचे दिए गए नाम मुख्य एंट्री पॉइंट से उपलब्ध हैं। `@powerduck/openapi-request/http` सबपाथ `HttpAdapter`, `SseParser`, `buildCollection`, `buildEnvironment`, `resolveServerUrl`, `buildRunOptions` और `runWithPostman` निर्यात करता है; पहचान करने वाले हेल्पर और `BUILTIN_CAPTURE_TEST` मुख्य एंट्री पॉइंट से इम्पोर्ट करें।

| निर्यात | विवरण |
| --- | --- |
| `HttpAdapter` | HTTP/HTTPS के लिए डिफ़ॉल्ट प्रोटोकॉल अडैप्टर |
| `SseParser` | SSE बाइट स्ट्रीम को संरचित इवेंट में बदलने वाला स्ट्रीमिंग पार्सर |
| `isStreamingOperation` | घोषित सामग्री प्रकारों से ऑपरेशन को स्ट्रीमिंग के रूप में पहचानता है |
| `isSseContentType` | जाँचता है कि सामग्री का प्रकार SSE दर्शाता है या नहीं |
| `isStreamingContentType` | जाँचता है कि सामग्री का प्रकार स्ट्रीमिंग दर्शाता है या नहीं |
| `acceptHeaderFor` | ऑपरेशन के लिए उचित Accept हेडर बनाता है |
| `probeStreamingResponse` | Fetch अनुरोध चलाकर प्रतिक्रिया का वर्गीकरण करता है; लौटाई गई प्रतिक्रिया की बॉडी पढ़ें या रद्द करें |
| `BUILTIN_CAPTURE_TEST` | अंतिम प्रतिक्रिया कैप्चर करने की बिल्ट-इन Postman टेस्ट स्क्रिप्ट |

## WebSocket

`@powerduck/openapi-request/ws` से इम्पोर्ट करें।

| निर्यात | विवरण |
| --- | --- |
| `WebSocketAdapter` | WebSocket लक्ष्यों के लिए प्रोटोकॉल अडैप्टर |
| `createWsManualSession` | द्विदिश मैनुअल WebSocket सत्र बनाता है; `runWebSocketSession` और `wsManualSession` नामों से भी उपलब्ध है |

## GraphQL

`@powerduck/openapi-request/graphql` से इम्पोर्ट करें।

| निर्यात | विवरण |
| --- | --- |
| `GraphQLAdapter` | GraphQL लक्ष्यों के लिए प्रोटोकॉल अडैप्टर |
| `resolveGraphQLConfig` | ऑपरेशन से GraphQL कॉन्फ़िगरेशन तय करता है |
| `runGraphQL` | GraphQL ऑपरेशन चलाता है |
| `introspectSchema` | GraphQL एंडपॉइंट का स्कीमा इंट्रोस्पेक्शन से प्राप्त करता है |
| `INTROSPECTION_QUERY` | मानक GraphQL इंट्रोस्पेक्शन क्वेरी |
| `generateOperation` | इंट्रोस्पेक्शन से मिले GraphQL स्कीमा और फ़ील्ड से क्वेरी दस्तावेज़ बनाता है |
| `generateAllOperations` | इंट्रोस्पेक्शन से मिले GraphQL स्कीमा के फ़ील्ड के लिए क्वेरी दस्तावेज़ बनाता है |
| `writeGraphQLOperations` | बनाए गए GraphQL ऑपरेशन स्पेसिफ़िकेशन में लिखता है |
| `discoverAndWriteGraphQLSchema` | GraphQL स्कीमा खोजकर स्पेसिफ़िकेशन में लिखता है |

## MCP (Model Context Protocol)

नीचे दिए गए अधिकांश घटक `@powerduck/openapi-request/mcp` से उपलब्ध हैं। `initializeMcpSession` मुख्य एंट्री पॉइंट से इम्पोर्ट करें; सबपाथ में इसका नाम `initializeSession` है। सबपाथ `runMcp`, `createMcpSessionCore` और `createMcpStdioConnection` भी देता है।

| निर्यात | विवरण |
| --- | --- |
| `McpAdapter` | MCP लक्ष्यों के लिए प्रोटोकॉल अडैप्टर |
| `createMcpManualSession` | मैनुअल MCP सत्र बनाता है; `mcpManualSession` नाम से भी उपलब्ध है |
| `createMcpStdioSession` | stdio से MCP सत्र बनाता है |
| `runMcpManualSession` | अब अनुशंसित नहीं: `createMcpManualSession` इस्तेमाल करें |
| `resolveMcpConfig` | ऑपरेशन से MCP कॉन्फ़िगरेशन तय करता है |
| `initializeMcpSession` | MCP सत्र आरंभ करता है (`initializeSession` का दूसरा नाम) |
| `discoverMcpCapabilities` | MCP सर्वर की क्षमताएँ खोजता है |
| `MCP_PROTOCOL_VERSION` | समर्थित MCP प्रोटोकॉल संस्करण |
| `generateMcpCall` | एक MCP टूल कॉल बनाता है |
| `generateAllMcpCalls` | सभी MCP टूल कॉल बनाता है |
| `writeMcpOperations` | MCP ऑपरेशन स्पेसिफ़िकेशन में लिखता है |
| `discoverAndWriteMcpCapabilities` | MCP क्षमताएँ खोजकर स्पेसिफ़िकेशन में लिखता है |
| `createHttpMcpTransport` | MCP के लिए HTTP ट्रांसपोर्ट बनाता है |
| `createStdioMcpTransport` | MCP के लिए stdio ट्रांसपोर्ट बनाता है |

## gRPC

निम्न-स्तरीय खोज, कॉल और डिस्क्रिप्टर हेल्पर `@powerduck/openapi-request/grpc` से इम्पोर्ट करें। `GrpcProtocolAdapter`, `createGrpcManualSession`, `grpcManualSession`, `grpcDiscover` और `discoverGrpc` मुख्य एंट्री पॉइंट से इम्पोर्ट करें; सबपाथ में खोज फ़ंक्शन का नाम `discover` है। वहाँ `discoverFromCatalog`, `describeMethod` और `describeFromCatalog` भी हैं, ताकि हर मेथड के लिए रिफ़्लेक्शन दोहराने के बजाय कैटलॉग फिर इस्तेमाल कर सकें।

| निर्यात | विवरण |
| --- | --- |
| `GrpcProtocolAdapter` | OpenAPI के लिए gRPC प्रोटोकॉल अडैप्टर |
| `GrpcAdapter` | निम्न-स्तरीय gRPC अडैप्टर |
| `grpcDiscover` / `discoverGrpc` | gRPC सेवाएँ और मेथड खोजता है |
| `createGrpcManualSession` / `grpcManualSession` | मैनुअल gRPC सत्र बनाता है |
| `grpcCall` | एक gRPC कॉल चलाता है |
| `resolveMethod` | gRPC मेथड डिस्क्रिप्टर ढूँढता है |
| `buildMessageTemplate` | डिस्क्रिप्टर से संदेश टेम्पलेट बनाता है |
| `buildCatalog` | सेवाओं और मेथड का कैटलॉग बनाता है |
| `LOADER_OPTIONS` | डिफ़ॉल्ट proto लोडर विकल्प |
| `scanProtoFiles` | डायरेक्टरी में proto फ़ाइलें खोजता है |
| `deriveIncludeDirsDetailed` | proto फ़ाइल पाथ से इन्क्लूड डायरेक्टरी तय करता है |
| `fetchDescriptorSet` | gRPC रिफ़्लेक्शन से डिस्क्रिप्टर सेट प्राप्त करता है |
| `fetchFullDescriptorSet` | सभी निर्भरताओं सहित पूरा डिस्क्रिप्टर सेट प्राप्त करता है |
| `listServices` | डिस्क्रिप्टर सेट की सेवाएँ सूचीबद्ध करता है |
| `listServicesDetailed` | सेवाएँ और मेथड की विस्तृत जानकारी सूचीबद्ध करता है |
| `serializeDescriptorSet` | डिस्क्रिप्टर सेट को बाइट में सीरियलाइज़ करता है |
| `decodeFileDescriptorProto` | एक फ़ाइल डिस्क्रिप्टर proto डिकोड करता है |
| `decodeFileDescriptorSet` | फ़ाइल डिस्क्रिप्टर सेट डिकोड करता है |
| `buildCredentials` | gRPC क्रेडेंशियल सिंक्रोनस रूप से बनाता है |
| `buildCredentialsAsync` | gRPC क्रेडेंशियल एसिंक्रोनस रूप से बनाता है |
| `buildCredentialsChecked` | सत्यापन के साथ क्रेडेंशियल सिंक्रोनस रूप से बनाता है |
| `buildCredentialsCheckedAsync` | सत्यापन के साथ क्रेडेंशियल एसिंक्रोनस रूप से बनाता है |
| `loadGrpc` | `@grpc/grpc-js` पैकेज डायनामिक रूप से लोड करता है |
| `isGrpcAvailable` | जाँचता है कि gRPC निर्भरताएँ उपलब्ध हैं या नहीं |
| `requireCapability` | खास gRPC क्षमता आवश्यक करता है और उपलब्ध न होने पर एरर फेंकता है |

मुख्य एंट्री पॉइंट `GrpcDiscoveryResult`, `GrpcDiscoveredMethod` और `GrpcDiscoveredService` टाइप एलियस निर्यात करता है। gRPC सबपाथ में इनके नाम `DiscoveryResult`, `DiscoveredMethod` और `DiscoveredService` हैं।

एरर टाइप: `ReflectionProtocolError`, `ReflectionUnavailableError`, `DescriptorDecodeError`, `GrpcDependencyBrokenError`, `GrpcDependencyMissingError`।

## अतिरिक्त यूटिलिटी

मुख्य एंट्री पॉइंट OAuth 2.0 हेल्पर `resolveOAuth2Token`, `acquireOAuth2Token`, `isOAuth2TokenExpired`, `oauth2RefreshStatuses` और `authFromOAuth2Token`; कॉपी करने की यूटिलिटी `toCloneable`; बेस क्लास `UnifiedSession`; और gRPC में वापस लिखने वाले हेल्पर `writeGrpcOperations` तथा `discoverAndWriteGrpcOperations` भी निर्यात करता है।

## सबपाथ निर्यात

```typescript
// Main integration entry
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```
