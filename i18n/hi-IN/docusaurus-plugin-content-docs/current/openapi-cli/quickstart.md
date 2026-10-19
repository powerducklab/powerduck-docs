---
sidebar_position: 3
title: "तुरंत शुरुआत"
description: "@powerduck/openapi-cli से CLI और Node.js में अपना पहला बैच टेस्ट चलाएँ।"
---

# तुरंत शुरुआत

यह गाइड आपके पहले OpenAPI दस्तावेज़ का टेस्ट करने की प्रक्रिया बताती है।

## आवश्यकताएँ

- Node.js `>= 22.12.0`.
- OpenAPI 3.2 का **JSON** दस्तावेज़। YAML स्वीकार नहीं होता; पहले JSON में बदलें। दस्तावेज़ के सबसे ऊपरी स्तर पर `paths` ऑब्जेक्ट होना चाहिए।

## 1. CLI से चलाएँ

सबसे सरल तरीका स्थानीय स्पेसिफिकेशन लोड करता है और दस्तावेज़ में घोषित पहले सर्वर URL पर सभी ऑपरेशन टेस्ट करता है:

```bash
openapi-cli --spec openapi.json
```

लक्ष्य सर्वर बदलें और रिपोर्ट अपनी चुनी डायरेक्टरी में लिखें:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

रिमोट स्पेसिफिकेशन के केवल `GET` ऑपरेशन 10 समांतर वर्कर के साथ टेस्ट करें:

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

जटिल सेटअप के लिए JSON कॉन्फ़िगरेशन फ़ाइल इस्तेमाल करें:

```bash
openapi-cli --config openapi-cli.config.json
```

सभी फ़्लैग यहाँ देखें: [कमांड](/docs/hi-IN/openapi-cli/commands/).

## 2. टेस्ट के लिए न्यूनतम स्पेसिफिकेशन लिखें

घोषणात्मक असर्शन वाला न्यूनतम OpenAPI दस्तावेज़:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Demo API", "version": "1.0.0" },
  "servers": [{ "url": "https://httpbin.org" }],
  "paths": {
    "/get": {
      "get": {
        "operationId": "getGet",
        "responses": { "200": { "description": "ok" } },
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "response under 5s", "assert": "responseTime", "max": 5000 }
        ]
      }
    }
  }
}
```

किसी ऑपरेशन में **कोई** असर्शन न हो तो रनर प्रोटोकॉल की सफलता की अंतर्निहित जाँच जोड़ता है। HTTP में `2xx` स्टेटस ज़रूरी होता है, ताकि 4xx/5xx जवाब चुपचाप सफल न माने जाएँ।

## 3. Node.js से चलाएँ (प्रोग्रामिंग API)

लाइब्रेरी वही प्रक्रिया फ़ंक्शन के रूप में देती है: `resolveConfig` → `runTests` → रिपोर्ट जनरेटर।

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

// 1. Build a CliConfig from CLI-style args.
const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
});

// 2. Run all collected tests.
const report = await runTests(config);

// 3. Emit the reports you need.
printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

// 4. Exit with the correct code for CI.
if (report.summary.failed > 0 || report.summary.errors > 0) {
  process.exit(1);
}
```

`resolveConfig` CLI जैसी ही विकल्प संरचना लेता है। `runTests` एक `TestReport` लौटाता है, जिसमें `summary`, `results`, `config`, `generatedAt` और `version` होते हैं। [कॉन्फ़िगरेशन](/docs/hi-IN/openapi-cli/configuration/).

## 4. CI के लिए एग्ज़िट कोड

| कोड | अर्थ |
|---|---|
| `0` | सभी टेस्ट सफल हुए या `--no-fail-on-error` सेट है। |
| `1` | एक या अधिक टेस्ट विफल हुए या उनमें त्रुटि आई। |
| `2` | कॉन्फ़िगरेशन त्रुटि, स्पेसिफिकेशन लोड करने में विफलता या गंभीर रनटाइम त्रुटि। |

## अगले कदम

- [कॉन्फ़िगरेशन](/docs/hi-IN/openapi-cli/configuration/) — `CliConfig` के सभी फ़ील्ड और डिफ़ॉल्ट मान।
- [कमांड](/docs/hi-IN/openapi-cli/commands/) — सभी CLI फ़्लैग।
- [उदाहरण](/docs/hi-IN/openapi-cli/examples/) — प्रमाणीकरण, फ़िल्टर, रिपोर्ट और असर्शन।
- [API संदर्भ](/docs/hi-IN/openapi-cli/api-reference/) — सभी एक्सपोर्ट किए गए फ़ंक्शन और टाइप।
