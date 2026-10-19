---
sidebar_position: 6
title: "कॉन्फ़िगरेशन"
description: "प्राथमिकता का क्रम है: CLI आर्ग्युमेंट > कॉन्फ़िगरेशन फ़ाइल > डिफ़ॉल्ट मान। परिणाम resolveConfig द्वारा लौटाया गया CliConfig ऑब्जेक्ट होता है।"
---

# कॉन्फ़िगरेशन

प्राथमिकता का क्रम है: **CLI आर्ग्युमेंट > कॉन्फ़िगरेशन फ़ाइल > डिफ़ॉल्ट मान**। परिणाम [`resolveConfig`](./api-reference.md#resolveconfig) द्वारा लौटाया गया `CliConfig` ऑब्जेक्ट होता है।

## CliConfig

मुख्य कॉन्फ़िगरेशन टाइप। `specPath` को छोड़कर सभी फ़ील्ड वैकल्पिक हैं।

| फ़ील्ड | टाइप | डिफ़ॉल्ट | विवरण |
|-------|------|---------|-------------|
| `specPath` | `string` | **ज़रूरी** | OpenAPI 3.2 JSON स्पेसिफ़िकेशन का पथ या `http(s)://` URL |
| `serverUrl` | `string` | *(स्पेसिफ़िकेशन से)* | स्पेसिफ़िकेशन का सर्वर बेस URL बदलें |
| `outputDir` | `string` | `"./openapi-cli-report"` | रिपोर्ट फ़ाइलें लिखने की डायरेक्टरी |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | बनाए जाने वाले रिपोर्ट प्रारूप |
| `filter` | `FilterConfig` | `undefined` | परीक्षण के लिए ऑपरेशन फ़िल्टर करें |
| `concurrency` | `number` | `5` | अधिकतम समवर्ती अनुरोध; 1 से 100 के बीच पूर्णांक |
| `timeout` | `number` | `30000` | हर अनुरोध का टाइमआउट मिलीसेकंड में, 1 से 600000 के बीच पूर्णांक; दूरस्थ स्पेसिफ़िकेशन लाने पर भी लागू |
| `proxy` | `string` | `undefined` | HTTP(S) प्रॉक्सी URL, जैसे `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | TLS और प्रमाणपत्र कॉन्फ़िगरेशन |
| `headers` | `Record<string, string>` | `undefined` | हर अनुरोध के साथ भेजे जाने वाले अतिरिक्त हेडर |
| `auth` | `AuthConfig` | `undefined` | प्रमाणीकरण कॉन्फ़िगरेशन |
| `variables` | `Record<string, string>` | `undefined` | जोड़ने के लिए Postman `{{name}}` वैरिएबल |
| `failOnError` | `boolean` | `true` | केवल CLI: परीक्षण विफल होने पर शून्य से अलग कोड लौटाएँ; लाइब्रेरी के कॉलर को रिपोर्ट जाँचनी चाहिए |
| `envFile` | `string` | `undefined` | हर पंक्ति में `KEY=VALUE` वाले `.env` फ़ाइल का पथ |
| `grpcReflection` | `boolean` | स्वचालित | gRPC: पहले स्पष्ट कॉन्फ़िगरेशन, फिर ऑपरेशन एक्सटेंशन; दोनों न हों तो proto पथ न दिए जाने पर चालू |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC: `.proto` फ़ाइलों या डायरेक्टरी के पथ |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP: MCP ऑपरेशन का ट्रांसपोर्ट |
| `mcpCommand` | `string` | `undefined` | MCP stdio: शुरू करने वाली कमांड |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio: कमांड आर्ग्युमेंट |
| `mcpCwd` | `string` | `undefined` | MCP stdio: कार्य डायरेक्टरी |

`ReportFormat`, `"json" | "cli" | "html"` का यूनियन है।

## उन्नत रनटाइम विकल्प

ये फ़ील्ड भी `CliConfig` का हिस्सा हैं। `requester`, `maxEvents`, `maxStreamMs` और `maxResponseSize` JSON फ़ाइल में दिए जा सकते हैं। कॉन्फ़िगरेशन हल करने के बाद `signal`, `httpRuntime` और `resolveTransport` को कोड से सीधे `runTests()` में दें; ये रनटाइम ऑब्जेक्ट हैं, JSON कॉन्फ़िगरेशन नहीं।

```typescript
interface AdvancedRuntimeOptions {
  requester?: {
    followRedirects?: boolean;
    maxRedirects?: number;
    disableCookies?: boolean;
    protocolVersion?: "http1" | "http2" | "auto";
  };
  maxEvents?: number;
  maxStreamMs?: number;
  maxResponseSize?: number;
  signal?: AbortSignal;
  httpRuntime?: { certificates?: unknown; fileResolver?: unknown };
  resolveTransport?: (target: { protocol: string; url?: string }) => Promise<
    Pick<CliConfig, "proxy" | "tls" | "httpRuntime">
  >;
}
```

`requester`, HTTP रीडायरेक्ट, कुकी और प्रोटोकॉल चयन नियंत्रित करता है। HTTP/SSE के लिए `maxEvents` का डिफ़ॉल्ट 50 है और `maxStreamMs` न होने पर `timeout` इस्तेमाल होता है; `maxResponseSize` अनुरोध रनटाइम को दिया जाता है। gRPC स्ट्रीम की समय-सीमा के लिए पहले `maxStreamMs`, फिर `timeout`, और अंत में 30000 मिलीसेकंड इस्तेमाल करता है। `signal` प्रक्रिया रद्द करता है; `httpRuntime`, HTTP प्रमाणपत्र और फ़ाइल प्रबंधन देता है; `resolveTransport` हर लक्ष्य का ट्रांसपोर्ट कॉन्फ़िगरेशन हल करता है।

## DEFAULT_CONFIG

लाइब्रेरी से एक्सपोर्ट किया गया अंतर्निहित डिफ़ॉल्ट कॉन्फ़िगरेशन ऑब्जेक्ट:

```ts
export const DEFAULT_CONFIG: Required<
  Pick<
    CliConfig,
    "outputDir" | "formats" | "concurrency" | "timeout" | "failOnError" | "grpcReflection" | "mcpTransport"
  >
> = {
  outputDir: "./openapi-cli-report",
  formats: ["json", "cli", "html"],
  concurrency: 5,
  timeout: 30000,
  failOnError: true,
  grpcReflection: true,
  mcpTransport: "streamable-http",
};
```

## FilterConfig

| फ़ील्ड | टाइप | विवरण |
|-------|------|-------------|
| `methods` | `string[]` | केवल इन HTTP मेथड का परीक्षण करें, जैसे `["get","post"]`; फ़ाइलों में छोटे अक्षर इस्तेमाल करें, CLI इनपुट सामान्यीकृत किया जाता है |
| `paths` | `string[]` | केवल उन पथों का परीक्षण करें जो किसी दिए रेगुलर एक्सप्रेशन से मेल खाते हैं; अमान्य एक्सप्रेशन पर सबस्ट्रिंग मिलान होता है |
| `tags` | `string[]` | केवल उन ऑपरेशन का परीक्षण करें जिनमें इनमें से कोई टैग है |
| `operationIds` | `string[]` | केवल इन सटीक `operationId` मानों का परीक्षण करें |

बिना किसी कुंजी वाला फ़िल्टर `undefined` बनता है, यानी सभी ऑपरेशन चलते हैं।

## TlsConfig

| फ़ील्ड | टाइप | विवरण |
|-------|------|-------------|
| `caCert` | `string` | PEM प्रारूप में CA प्रमाणपत्र बंडल का पथ |
| `clientCert` | `string` | mTLS के लिए PEM क्लाइंट प्रमाणपत्र का पथ |
| `clientKey` | `string` | mTLS के लिए PEM क्लाइंट निजी कुंजी का पथ |
| `strictSSL` | `boolean` | `false` होने पर TLS प्रमाणपत्र सत्यापन छोड़ें; असुरक्षित |
| `pfx` | `string` | PFX प्रमाणपत्र बंडल का पथ; gRPC को इसके बजाय PEM चाहिए |
| `passphrase` | `string` | एन्क्रिप्ट किए गए प्रमाणपत्र डेटा का पासफ़्रेज़ |

> ध्यान दें: CLI विकल्प `--insecure`, `tls.strictSSL = false` के बराबर है, यानी सत्यापन **बंद** करता है।

## AuthConfig

| फ़ील्ड | टाइप | विवरण |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | प्रमाणीकरण योजना; समर्थित नाम नीचे दिए गए हैं |
| `parameters` | `Record<string, string \| number \| boolean>` | अनुरोध रनटाइम को दिए जाने वाले योजना-विशिष्ट पैरामीटर |
| `token` | `string` | `type: "bearer"` के लिए Bearer टोकन |
| `username` | `string` | `type: "basic"` के लिए उपयोगकर्ता नाम |
| `password` | `string` | `type: "basic"` के लिए पासवर्ड |
| `key` | `string` | `type: "apikey"` के लिए API कुंजी का नाम |
| `value` | `string` | `type: "apikey"` के लिए API कुंजी का मान |
| `in` | `"header" \| "query"` | API कुंजी रखने का स्थान |

समर्थित `type` मान हैं: `bearer`, `basic`, `apikey`, `none`, `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` और `edgegrid`। उपलब्धता और ज़रूरी पैरामीटर प्रोटोकॉल तथा अनुरोध रनटाइम पर निर्भर हैं; केवल नाम देने से प्रमाणीकरण कॉन्फ़िगर नहीं होता।

अभी CLI का `--bearer` विकल्प केवल `{ type: "bearer", token }` बनाता है। अधिक विस्तृत `basic` / `apikey` कॉन्फ़िगरेशन फ़ाइल से दिए जाते हैं।

## JSON कॉन्फ़िगरेशन फ़ाइल

फ़ाइल सामान्य JSON होती है जो `Partial<CliConfig>` से मेल खाती है। इसे `--config <path>` / `-c` से दें। CLI आर्ग्युमेंट हमेशा फ़ाइल के मानों से ऊपर रहते हैं।

```json
{
  "specPath": "./openapi.json",
  "serverUrl": "https://api.staging.example.com",
  "outputDir": "./reports",
  "formats": ["json", "html"],
  "concurrency": 10,
  "timeout": 15000,
  "failOnError": true,
  "proxy": "http://proxy.corp:8080",
  "tls": {
    "strictSSL": true,
    "caCert": "./ca-bundle.pem",
    "clientCert": "./client.crt",
    "clientKey": "./client.key"
  },
  "headers": {
    "X-API-Key": "${API_KEY}",
    "X-Environment": "staging"
  },
  "auth": {
    "type": "bearer",
    "token": "${BEARER_TOKEN}"
  },
  "variables": {
    "host": "api.staging.example.com"
  },
  "filter": {
    "methods": ["get", "post"],
    "tags": ["v2", "public"],
    "paths": ["^/api/v2"],
    "operationIds": ["getUser", "createUser"]
  },
  "grpcReflection": true,
  "grpcProtoPaths": ["./proto"],
  "mcpTransport": "streamable-http",
  "mcpCommand": "npx",
  "mcpArgs": ["-y", "@modelcontextprotocol/server-everything"],
  "mcpCwd": "./mcp-servers"
}
```

फ़ाइल न होने पर `Config file not found: <path>` और अमान्य JSON होने पर `Invalid config file (must be JSON)` त्रुटि आती है।

## पर्यावरण वैरिएबल विस्तार

`--env` / `envFile` से `.env` फ़ाइल लोड होने के बाद इन स्ट्रिंग फ़ील्ड में `${VAR_NAME}` संदर्भों का विस्तार होता है:

- `serverUrl`
- `proxy`
- `headers` के मान
- `auth.token`
- `variables` के मान

उदाहरण:

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

`.env` का व्यवहार: मौजूदा `process.env` प्रविष्टियाँ **नहीं** बदली जातीं; मान के दोनों ओर के एकल या दोहरे उद्धरण हटते हैं; खाली पंक्तियाँ और `#` टिप्पणी पंक्तियाँ अनदेखी होती हैं; फ़ाइल न होने पर बिना सूचना दिए छोड़ दी जाती है।

## कोड से कॉन्फ़िगरेशन बनाना

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

स्पेसिफ़िकेशन न देने पर `resolveConfig`, `"No OpenAPI spec path provided..."` फेंकता है और `proxy` के वैध URL न होने पर `Invalid proxy URL: <url>` फेंकता है।
