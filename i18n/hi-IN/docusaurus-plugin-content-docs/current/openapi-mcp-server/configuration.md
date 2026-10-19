---
sidebar_position: 4
title: "कॉन्फ़िगरेशन"
description: "@powerduck/openapi-mcp-server का पूरा कॉन्फ़िगरेशन: ServerConfig, SecurityContext, ExecutionContext, TransportMode, और स्रोत, स्थिति, प्रोटोकॉल, लॉग स्तर व बॉडी एन्कोडिंग के लिटरल यूनियन।"
---

# कॉन्फ़िगरेशन

मुख्य कॉन्फ़िगरेशन ऑब्जेक्ट `ServerConfig` है, जिसे `startAdminServer()` स्वीकार करता है। संबंधित कॉन्टेक्स्ट टाइप टूल चलाते समय इस्तेमाल होते हैं।

## `ServerConfig`

केवल `port` अनिवार्य है।

| फ़ील्ड | टाइप | डिफ़ॉल्ट | विवरण |
| --- | --- | --- | --- |
| `port` | `number` | — (अनिवार्य) | सुनने के लिए TCP पोर्ट; 0–65535 के बीच पूर्णांक। |
| `host` | `string` | `"127.0.0.1"` | सुनने वाला नेटवर्क इंटरफ़ेस। अनजाने में बाहरी पहुँच खुलने से बचाने के लिए डिफ़ॉल्ट लूपबैक है। |
| `apiKey` | `string` | undefined | सेट करने पर एडमिन API और HTTP ट्रांसपोर्ट के लिए आवश्यक साझा सीक्रेट। |
| `specPath` | `string` | undefined | स्टार्टअप पर एक बार लोड किया जाने वाला स्पेसिफ़िकेशन। |
| `baseUrlOverride` | `string` | undefined | `servers[0].url` से मिले अपस्ट्रीम बेस URL को ओवरराइड करता है। |
| `upstreamHeaders` | `Record<string, string>` | undefined | हर अपस्ट्रीम रिक्वेस्ट में जोड़े जाने वाले हेडर। |
| `requestTimeoutMs` | `number` | undefined | हर अपस्ट्रीम रिक्वेस्ट का टाइमआउट, मिलीसेकंड में। |
| `persistState` | `boolean` | `true` | लोड किए गए स्पेसिफ़िकेशन को रीस्टार्ट के बाद भी बनाए रखता है। |
| `stateFilePath` | `string` | undefined | स्थायी स्टेट फ़ाइल का स्थान। |
| `allowedOrigins` | `string[]` | undefined | अनुमत CORS ओरिजिन। खाली छोड़ने या न देने पर क्रॉस-ओरिजिन एक्सेस बंद हो जाता है। |
| `allowedHosts` | `string[]` | undefined | `Host` हेडर के अनुमत मान। |
| `maxLogEntries` | `number` | 200 | मेमोरी में रखी जाने वाली अधिकतम लॉग प्रविष्टियाँ। |
| `redactSensitiveHeaders` | `boolean` | `true` | लॉग करने से पहले संवेदनशील हेडर मान छिपाता है। |
| `redactHeaderNames` | `string[]` | undefined | अंतर्निहित सूची के अलावा छिपाए जाने वाले हेडर के नाम। |
| `security` | `SecurityContext` | undefined | हर टूल कॉल में अपस्ट्रीम API को भेजे जाने वाले क्रेडेंशियल। |

## `SecurityContext`

| फ़ील्ड | टाइप | भेजने का स्वरूप |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | सटीक हेडर नाम और मान के जोड़े। |

क्रेडेंशियल एक्ज़ीक्यूटर द्वारा डाले जाते हैं और मॉडल को मिलने वाले टूल आर्ग्युमेंट के रूप में कभी उपलब्ध नहीं होते।

## `ExecutionContext`

हर कॉल का कॉन्टेक्स्ट, जिसे `executeToolCall` को दिया जाता है और `ContextProvider` लौटाता है:

| फ़ील्ड | टाइप | विवरण |
| --- | --- | --- |
| `baseUrlOverride` | `string` | इस कॉल के लिए स्पेसिफ़िकेशन का सर्वर URL ओवरराइड करता है। |
| `upstreamHeaders` | `Record<string, string>` | अतिरिक्त अपस्ट्रीम हेडर। |
| `requestTimeoutMs` | `number` | प्रति-कॉल टाइमआउट; न्यूनतम 1 सेकंड। |
| `security` | `SecurityContext` | इस कॉल के क्रेडेंशियल। |
| `correlationId` | `string` | एक ही कॉल की लॉग प्रविष्टियों को जोड़ता है। |
| `protocol` | `ProtocolHint` | कॉल शुरू करने वाला ट्रांसपोर्ट। |
| `onLog` | `(entry) => void` | रिक्वेस्ट/रिस्पॉन्स लॉग प्रविष्टियाँ प्राप्त करता है; अपवाद नहीं फेंकना चाहिए। |
| `signal` | `AbortSignal` | चल रही अपस्ट्रीम रिक्वेस्ट रद्द करता है। |

## लिटरल यूनियन और टाइप गार्ड

| यूनियन | मान | गार्ड फ़ंक्शन |
| --- | --- | --- |
| `TransportMode` | `"stdio" \| "web"` | — |
| `SpecSource` | `"startup-file" \| "upload" \| "paste" \| "runtime"` | `isSpecSource()` |
| `ServiceStatus` | `"running" \| "stopped" \| "error"` | `isServiceStatus()` |
| `ProtocolHint` | `"streamable-http" \| "sse" \| "stdio"` | `isProtocolHint()` |
| `LogDirection` | `"request" \| "response" \| "internal"` | — |
| `LogLevel` | `"debug" \| "info" \| "warn" \| "error"` | — |
| `ParameterLocation` | `"path" \| "query" \| "header" \| "cookie"` | `isParameterLocation()` |
| `BodyEncoding` | `"json" \| "form-urlencoded" \| "multipart" \| "text" \| "binary"` | `isBodyEncoding()` |

## `BuildMcpServerOptions`

`buildMcpServer()` को तीसरे आर्ग्युमेंट के रूप में दिया जाता है:

| फ़ील्ड | टाइप | डिफ़ॉल्ट | विवरण |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | घोषित प्रोटोकॉल संकेत। |
| `name` | `string` | `"openapi-mcp"` | घोषित सर्वर नाम। |
| `version` | `string` | `"1.1.0"` | घोषित सर्वर संस्करण। |
| `pageSize` | `number` | 100 | हर सूची रिस्पॉन्स में अधिकतम प्रविष्टियाँ; ऊपरी सीमा 500 है। |
| `instructions` | `string` | अंतर्निहित | MCP `instructions` के माध्यम से उपलब्ध उपयोग संबंधी मार्गदर्शन। |

## ट्रांसपोर्ट लेयर के विकल्प (`AttachMcpRoutesOptions`)

`@powerduck/openapi-mcp-server` से `attachMcpRoutes` इम्पोर्ट करें और दूसरे आर्ग्युमेंट में विकल्पों का ऑब्जेक्ट दें। पुराना `attachSseRoutes()` रैपर केवल स्थान-आधारित `(app, specProvider, contextProvider, routeGuard?)` आर्ग्युमेंट स्वीकार करता है।

| फ़ील्ड | टाइप | डिफ़ॉल्ट | विवरण |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | — (अनिवार्य) | नए सत्रों के लिए दस्तावेज़ उपलब्ध कराता है। |
| `contextProvider` | `ContextProvider` | — (अनिवार्य) | हर कॉल के लिए अपस्ट्रीम कॉन्टेक्स्ट उपलब्ध कराता है। |
| `routeGuard` | `RequestHandler` | undefined | हर MCP रूट पर लागू होने वाला मिडलवेयर। |
| `maxSessions` | `number` | 64 | एक साथ चलने वाले सत्रों की अधिकतम संख्या। |
| `sessionIdleMs` | `number` | 600000 | निष्क्रियता टाइमआउट, मिलीसेकंड में; 0 इसे बंद करता है। |
| `allowedOrigins` | `string[]` | undefined | अनुमत ओरिजिन। गैर-खाली सूची DNS रीबाइंडिंग सुरक्षा चालू करती है। |
| `allowedHosts` | `string[]` | undefined | `Host` हेडर के अनुमत मान। |
| `enableLegacySse` | `boolean` | `true` | अप्रचलित HTTP+SSE ट्रांसपोर्ट माउंट करता है। |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | लाइफ़साइकल इवेंट प्राप्त करता है; अपवाद नहीं फेंकना चाहिए। |

> ये `attachMcpRoutes` के विकल्प हैं, `ServerConfig` के अतिरिक्त फ़ील्ड नहीं। एडमिन सर्वर ओरिजिन और होस्ट सेटिंग आगे भेजता है, लेकिन ट्रांसपोर्ट की डिफ़ॉल्ट सत्र सीमा और निष्क्रियता टाइमआउट इस्तेमाल करता है। इन सीमाओं को बदलने के लिए सार्वजनिक ट्रांसपोर्ट फ़ंक्शन का सीधे उपयोग करें।

## यह भी देखें

- [API संदर्भ](../api-reference/)
- [उदाहरण](../examples/)
