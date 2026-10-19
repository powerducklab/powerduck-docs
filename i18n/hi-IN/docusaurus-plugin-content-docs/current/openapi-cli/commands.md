---
sidebar_position: 5
title: "CLI कमांड"
description: "पैकेज में एक ही निष्पादन योग्य कमांड है: openapi-cli। यह सीधे विकल्पों की सूची लेता है; run / validate / init जैसे सबकमांड नहीं हैं:"
---

# CLI कमांड

पैकेज में एक ही निष्पादन योग्य कमांड है: `openapi-cli`। यह सीधे विकल्पों की सूची लेता है; `run` / `validate` / `init` जैसे सबकमांड **नहीं हैं**:

```
openapi-cli [options]
```

## सिंटैक्स

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

स्पेसिफ़िकेशन देना **ज़रूरी** है: `--spec` (या `-s`) दें, या `--config` से लोड होने वाली JSON कॉन्फ़िगरेशन फ़ाइल में `specPath` सेट करें। बाकी विकल्प वैकल्पिक हैं।

## मुख्य विकल्प

| विकल्प | छोटा रूप | डिफ़ॉल्ट | विवरण |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | OpenAPI 3.2 JSON स्पेसिफ़िकेशन का फ़ाइल पथ या `http(s)://` URL |
| `--server <url>` | `-S` | *(स्पेसिफ़िकेशन से)* | स्पेसिफ़िकेशन में दिया सर्वर URL बदलें |
| `--output <dir>` | `-o` | `./openapi-cli-report` | रिपोर्ट का आउटपुट फ़ोल्डर |
| `--format <formats>` | `-f` | `json,cli,html` | कॉमा से अलग किए गए रिपोर्ट प्रारूप: `json`, `cli`, `html` |
| `--config <path>` | `-c` | — | JSON कॉन्फ़िगरेशन फ़ाइल का पथ; CLI आर्ग्युमेंट को प्राथमिकता मिलती है |

## निष्पादन विकल्प

| विकल्प | छोटा रूप | डिफ़ॉल्ट | विवरण |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | अधिकतम समवर्ती अनुरोध; 1 से 100 के बीच पूर्णांक |
| `--timeout <ms>` | `-t` | `30000` | हर अनुरोध का टाइमआउट मिलीसेकंड में, 1 से 600000 के बीच पूर्णांक; दूरस्थ स्पेसिफ़िकेशन लाते समय भी यही लागू होता है |
| `--no-fail-on-error` | — | बंद | प्रक्रिया पूरी होने पर परीक्षण विफल होने के बावजूद `0` लौटाएँ; कॉन्फ़िगरेशन और गंभीर त्रुटियों पर अब भी विफलता लौटती है |

## फ़िल्टर विकल्प

| विकल्प | डिफ़ॉल्ट | विवरण |
|--------|---------|-------------|
| `--method <methods>` | — | शामिल करने वाले HTTP मेथड, कॉमा से अलग, जैसे `get,post` |
| `--path <patterns>` | — | हर पथ से मिलान करने वाले रेगुलर एक्सप्रेशन, कॉमा से अलग |
| `--tag <tags>` | — | शामिल करने वाले OpenAPI टैग, कॉमा से अलग |
| `--operation-id <ids>` | — | शामिल करने वाले `operationId` मान, कॉमा से अलग |

## नेटवर्क और TLS विकल्प

| विकल्प | छोटा रूप | डिफ़ॉल्ट | विवरण |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | HTTP(S) प्रॉक्सी URL, जैसे `http://proxy.corp:8080` |
| `--ca <path>` | — | — | PEM प्रारूप में CA प्रमाणपत्र बंडल |
| `--cert <path>` | — | — | mTLS के लिए PEM क्लाइंट प्रमाणपत्र |
| `--key <path>` | — | — | mTLS के लिए PEM क्लाइंट निजी कुंजी |
| `--insecure` | `-k` | बंद | TLS प्रमाणपत्र सत्यापन छोड़ें |

## प्रमाणीकरण, हेडर और वैरिएबल

| विकल्प | छोटा रूप | विवरण |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | `Key: Value` रूप में अतिरिक्त हेडर; बार-बार दे सकते हैं |
| `--bearer <token>` | — | `Authorization` हेडर में भेजा जाने वाला Bearer टोकन |
| `--variable <vars...>` | `-v` | `KEY=VALUE` रूप में Postman वैरिएबल; बार-बार दे सकते हैं |
| `--env <path>` | — | `.env` फ़ाइल का पथ; मौजूदा पर्यावरण वैरिएबल नहीं बदलता |

## gRPC विकल्प

| विकल्प | डिफ़ॉल्ट | विवरण |
|--------|---------|-------------|
| `--grpc-no-reflection` | बंद | gRPC सर्वर रिफ़्लेक्शन बंद करें और proto फ़ाइलों का उपयोग करें |
| `--grpc-proto <paths...>` | — | `.proto` फ़ाइलों या उन्हें रखने वाले फ़ोल्डर के पथ |

## MCP विकल्प

| विकल्प | डिफ़ॉल्ट | विवरण |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | MCP ट्रांसपोर्ट: `streamable-http` या `stdio` |
| `--mcp-command <command>` | — | MCP stdio कमांड, जैसे `npx` |
| `--mcp-args <args>` | — | स्पेस या कॉमा से अलग किए गए MCP stdio आर्ग्युमेंट |
| `--mcp-cwd <dir>` | — | MCP stdio सबप्रोसेस की कार्य डायरेक्टरी |

## जानकारी के विकल्प

| विकल्प | छोटा रूप | विवरण |
|--------|-------|-------------|
| `--help` | `-h` | सहायता दिखाएँ |
| `--version` | `-V` | संस्करण दिखाएँ |

## एग्ज़िट कोड

| कोड | अर्थ |
|------|---------|
| `0` | सभी परीक्षण पास हुए या `--no-fail-on-error` सेट था |
| `1` | एक या अधिक परीक्षण विफल हुए या उनमें त्रुटि आई, या CLI आर्ग्युमेंट पार्स नहीं हो पाए |
| `2` | कॉन्फ़िगरेशन त्रुटि, स्पेसिफ़िकेशन लोड होने में विफलता या गंभीर रनटाइम त्रुटि |

`resolveConfig` के अपवाद फेंकने पर CLI लाल रंग में `Error:` दिखाकर `2` के साथ बंद होती है; उदाहरण के लिए, जब न `--spec` दिया हो और न `specPath` कॉन्फ़िगर हो। `runTests` के अपवाद फेंकने पर वह `Fatal error:` दिखाकर `2` के साथ बंद होती है। प्रक्रिया पूरी होने के बाद केवल तभी `1` लौटता है जब `report.summary.failed > 0 || report.summary.errors > 0` और `failOnError !== false` हों।

## पर्यावरण वैरिएबल

कोई विशेष `OPENAPI_CLI_*` वैरिएबल नहीं हैं। कॉन्फ़िगरेशन विकल्पों, कॉन्फ़िगरेशन फ़ाइल और इन तरीकों से दिया जाता है:

- **`.env` फ़ाइल** — `KEY=VALUE` जोड़ियों को `process.env` में लोड करने के लिए `--env .env` दें। मौजूदा वैरिएबल नहीं बदले जाते।
- **`${VAR}` विस्तार** — लोड होने के बाद `serverUrl`, `proxy`, `headers` के मान, `auth.token` और `variables` के मानों में `${VAR_NAME}` को बदला जाता है।

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## चलाने के उदाहरण

```bash
# Test a local spec against its first server URL
openapi-cli --spec openapi.json

# Override the server and write JSON + HTML reports
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --format json,html --output ./reports

# Only GET requests, 10 workers, with a bearer token
openapi-cli --spec openapi.json --method get --concurrency 10 --bearer "$TOKEN"

# Use a config file
openapi-cli --config openapi-cli.config.json
```
