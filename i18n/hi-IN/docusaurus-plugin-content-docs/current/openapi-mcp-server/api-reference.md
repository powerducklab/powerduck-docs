---
sidebar_position: 5
title: "API संदर्भ"
description: "@powerduck/openapi-mcp-server का पूरा API संदर्भ: स्पेसिफ़िकेशन लोड करना, टूल, प्रॉम्प्ट और रिसोर्स बनाना, रिक्वेस्ट बनाना और चलाना, MCP सर्वर, ट्रांसपोर्ट, एडमिन सर्वर, प्रमाणीकरण, सेवा रजिस्ट्री और CLI।"
---

# API संदर्भ

`@powerduck/openapi-mcp-server` के सभी सार्वजनिक एक्सपोर्ट, कार्य के अनुसार व्यवस्थित।

## स्पेसिफ़िकेशन लोड करना

| एक्सपोर्ट | सिग्नेचर | विवरण |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | JSON या YAML फ़ाइल पढ़ता है, वैलिडेशन और रेफ़रेंस रिज़ॉल्यूशन करता है तथा ऑपरेशन ID की अद्वितीयता जाँचता है। YAML की पहचान `.ya?ml` एक्सटेंशन से होती है। |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | स्ट्रिंग से दस्तावेज़ पार्स करता है। खाली या अमान्य इनपुट पर अपवाद फेंकता है। |

## टूल जनरेशन

| एक्सपोर्ट | सिग्नेचर | विवरण |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | हर ऑपरेशन के लिए MCP `Tool` परिभाषाएँ बनाता है। |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | `{ tools, bindings, issues }` लौटाता है। |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | जनरेट हुए टूल नामों को उनके `ToolBinding` से मैप करता है; यह `getBindingIndex` का उपनाम है। |

टाइप एक्सपोर्ट: `ToolBinding`, `GeneratedToolWithBinding` (पैकेज में `GeneratedTool` का उपनाम)।

## प्रॉम्प्ट और रिसोर्स

| एक्सपोर्ट | सिग्नेचर | विवरण |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | जनरेट हुए सभी प्रॉम्प्ट सूचीबद्ध करता है। |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | नाम से प्रॉम्प्ट खोजता है; अज्ञात होने पर `null` लौटाता है। |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | कैटलॉग के रिसोर्स सूचीबद्ध करता है। |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | URI से एक रिसोर्स पढ़ता है। |

## रिक्वेस्ट बनाना और चलाना

| एक्सपोर्ट | सिग्नेचर | विवरण |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | आर्ग्युमेंट को `{ url, query, headers, body, dropped }` में सीरियलाइज़ करता है। स्थान-आधारित आर्ग्युमेंट इस्तेमाल होते हैं। |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | जनरेट किए गए टूल को अपस्ट्रीम API पर चलाता है। गैर-2xx रिस्पॉन्स डेटा के रूप में लौटते हैं; ट्रांसपोर्ट विफलता पर अपवाद आता है। |

`ToolCallResult` के फ़ील्ड: `status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`।

## स्पेसिफ़िकेशन यूटिलिटी

| एक्सपोर्ट | विवरण |
| --- | --- |
| `iterateOperations(spec, issues?)` | सभी रिज़ॉल्व किए गए ऑपरेशन देने वाला जनरेटर, जिसमें OpenAPI 3.2 के `additionalOperations` भी शामिल हैं। |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | `(name, in)` कुंजी के आधार पर पाथ आइटम और ऑपरेशन के पैरामीटर जोड़ता है। |
| `normalizeParameter(candidate)` | कच्चे पैरामीटर को सामान्य रूप देता है; उपयोग योग्य न होने पर `null` लौटाता है। |
| `synthesizeOperationId(method, pathTemplate)` | ऑपरेशन में `operationId` न होने पर नियतात्मक वैकल्पिक ID बनाता है। |
| `ensureUniqueName(candidate, taken)` | नाम अद्वितीय रखने के लिए संख्यात्मक प्रत्यय जोड़ता है। |
| `extractPathTemplateVariables(pathTemplate)` | `{name}` वैरिएबल निकालता है और पहली उपस्थिति को रखते हुए दोहराव हटाता है। |
| `effectiveStyle(parameter)` | स्पेसिफ़िकेशन का डिफ़ॉल्ट `style` लागू करता है। |
| `effectiveExplode(parameter)` | स्पेसिफ़िकेशन का डिफ़ॉल्ट `explode` लागू करता है। |
| `findOperationById(spec, operationId)` | पहली बार बनाने के बाद O(1) लुकअप; अज्ञात ID पर `null` लौटाता है। |
| `findDuplicateOperationIds(spec)` | लेखक द्वारा घोषित डुप्लिकेट ID की जानकारी देता है। |
| `assertUniqueOperationIds(spec)` | डुप्लिकेट ऑपरेशन ID पर अपवाद फेंकता है। |
| `isPlainObject(value)` | टाइप को सामान्य ऑब्जेक्ट तक सीमित करता है। |
| `truncateGeneratedName(name, limit=64)` | अद्वितीयता बनाए रखते हुए नाम छोटा करता है। |

टाइप एक्सपोर्ट: `OperationEntry`, `DuplicateOperationId`।

## MCP सर्वर और ट्रांसपोर्ट

| एक्सपोर्ट | विवरण |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | टूल, प्रॉम्प्ट और रिसोर्स हैंडलर जोड़कर SDK का `Server` बनाता है। स्थान-आधारित आर्ग्युमेंट इस्तेमाल होते हैं। |
| `startStdioServer(spec, context?, options?)` | stdio पर एक दस्तावेज़ उपलब्ध कराता है; `{ closed, close() }` लौटाता है। |
| `attachMcpRoutes(app, options)` | Streamable HTTP (`/mcp`) और वैकल्पिक पुराने SSE (`/sse`) रूट माउंट करता है। `AttachMcpRoutesOptions` स्वीकार करके `McpRouteHandle` लौटाता है। |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | अप्रचलित स्थान-आधारित रैपर। `{ activeSessionCount, closeAll }` लौटाता है। |
| `createStreamableSessionHost(options)` | कस्टम ट्रांसपोर्ट इंटीग्रेशन के लिए स्वतंत्र Streamable HTTP सेशन होस्ट बनाता है। |

टाइप: `SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`।

`attachMcpRoutes` पैकेज के रूट से एक्सपोर्ट होता है। इसके विकल्पों में `maxSessions`, `allowedOrigins`, `sessionIdleMs` और DNS रीबाइंडिंग सुरक्षा सेट करें। हैंडल में `activeSessionCount`, `pendingSessionCount`, `listSessions`, `closeSession`, `closeAll` और `dispose` उपलब्ध हैं। बंद करते समय `dispose()` से आवधिक सफ़ाई रोकें और सत्र बंद करें।

## एडमिन सर्वर और प्रमाणीकरण (`./server` सबपाथ) {#admin-server-and-auth-server-subpath}

`startAdminServer` को `@powerduck/openapi-mcp-server/server` या पैकेज रूट से इम्पोर्ट करें। `createAuthMiddleware` को रूट से इम्पोर्ट करें; यह `./server` सबपाथ से एक्सपोर्ट नहीं होता।

| एक्सपोर्ट | सिग्नेचर | विवरण |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | वेब UI और MCP रूट वाला Express एडमिन ऐप शुरू करता है। `{ app, server, port, close() }` लौटाता है। |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Bearer या `x-api-key` एक्सेस सुरक्षा। कुंजी न देने पर बंद हो जाती है। स्थान-आधारित आर्ग्युमेंट लेता है। |

## रनटाइम और यूटिलिटी

| एक्सपोर्ट | विवरण |
| --- | --- |
| `ServiceRegistry` | `ManagedServiceRecord` के लिए क्लास: `upsert`, `list`, `get`, `remove`, `clear`, `start`, `stop`, `fail`। |
| `isAbortError(error)` | `AbortError` या axios `CanceledError` होने पर सत्य। |
| `newId()` | UUID बनाता है, और वैकल्पिक रूप में टाइमस्टैम्प इस्तेमाल करता है। |

## CLI

एक्ज़ीक्यूटेबल **`openapi-mcp`** है। केवल एक कमांड `serve` उपलब्ध है:

```
openapi-mcp serve [options]
```

| विकल्प | डिफ़ॉल्ट | विवरण |
| --- | --- | --- |
| `--port <n>` | `3000` | वेब ट्रांसपोर्ट का HTTP पोर्ट। |
| `--host <host>` | `127.0.0.1` | HTTP होस्ट। |
| `--transport <mode>` | `web` | `stdio` या `web`। |
| `--spec <path>` | — | OpenAPI फ़ाइल पाथ; stdio मोड में अनिवार्य। |
| `--base-url <url>` | — | अपस्ट्रीम बेस URL ओवरराइड करता है। |
| `--api-key <key>` | — | एडमिन API कुंजी। |
| `--upstream-header "Name: value"` | — | अपस्ट्रीम हेडर; कई बार दिया जा सकता है। |
| `--timeout <ms>` | `30000` | अपस्ट्रीम टाइमआउट। |
| `--no-persist` | — | स्टेट को स्थायी रूप से सहेजना बंद करता है। |

## टाइप (`types` से दोबारा एक्सपोर्ट)

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`; `ResolvedPrompt` अप्रचलित है। टाइप गार्ड: `isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`।

## त्रुटियाँ और व्यवहार

- अज्ञात टूल, प्रॉम्प्ट या रिसोर्स ID सामान्य परिणाम के भीतर विफलता देने के बजाय MCP `InvalidParams` त्रुटि देते हैं।
- सक्रिय सत्र में स्पेसिफ़िकेशन न मिलने पर `InternalError` आता है।
- अपस्ट्रीम 4xx/5xx रिस्पॉन्स बिना अपवाद के `isError: true` वाले कंटेंट के रूप में मॉडल को लौटते हैं। केवल ट्रांसपोर्ट विफलताएँ (DNS, TLS, टाइमआउट, रद्द करना) अपवाद फेंकती हैं।

## यह भी देखें

- [कॉन्फ़िगरेशन](../configuration/)
- [उदाहरण](../examples/)
