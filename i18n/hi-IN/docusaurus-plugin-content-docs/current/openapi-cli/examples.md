---
sidebar_position: 5
title: "उदाहरण"
description: "@powerduck/openapi-cli के व्यावहारिक उदाहरण, जो वास्तव में समर्थित CLI विकल्पों और प्रोग्रामिंग API का उपयोग करते हैं।"
---

# उदाहरण

`@powerduck/openapi-cli` के व्यावहारिक उदाहरण, जो वास्तव में समर्थित CLI विकल्पों और प्रोग्रामिंग API का उपयोग करते हैं।

## 1. बुनियादी CLI परीक्षण

स्थानीय OpenAPI दस्तावेज़ देकर उसके सभी ऑपरेशन चलाएँ:

```bash
openapi-cli --spec openapi.json
```

सर्वर बदलें और रिपोर्ट अपनी चुनी हुई डायरेक्टरी में लिखें:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

दूरस्थ URL पर मौजूद स्पेसिफ़िकेशन का परीक्षण करें:

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. प्रमाणीकरण के साथ कोड से चलाना

Bearer टोकन, कस्टम हेडर और समवर्ती अनुरोधों की संख्या सेट करके लाइब्रेरी API का उपयोग करें:

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  timeout: 15000,
  bearer: process.env.BEARER_TOKEN,
  header: ["X-Environment: staging", "X-Team: platform"],
});

const report = await runTests(config);

printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

console.log(
  `Passed ${report.summary.passed}/${report.summary.total} (${report.summary.passRate}%)`,
);
```

## 3. फ़िल्टर किए गए परीक्षण चलाना

मेथड, टैग, पथ के रेगुलर एक्सप्रेशन या operationId से केवल चुने हुए ऑपरेशन चलाएँ:

```bash
# Only GET and POST requests
openapi-cli --spec openapi.json --method get,post

# Only operations tagged "public" or "v2"
openapi-cli --spec openapi.json --tag public,v2

# Only paths under /api/v2
openapi-cli --spec openapi.json --path "^/api/v2"

# Only specific operations
openapi-cli --spec openapi.json --operation-id getUser,createUser
```

इन फ़िल्टरों को जोड़ने वाला कोड कॉन्फ़िगरेशन: अलग-अलग फ़िल्टर श्रेणियाँ AND से जुड़ती हैं; एक ही श्रेणी के टैग OR से मिलाए जाते हैं।

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. JSON और HTML रिपोर्ट बनाना

`--format` से आउटपुट प्रारूप चुनें। डिफ़ॉल्ट रूप से तीनों बनते हैं:

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

कोड में समान उपयोग:

```typescript
import { resolveConfig, runTests, generateJsonReport, generateHtmlReport } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  format: "json,html",
  output: "./reports",
});

const report = await runTests(config);

const jsonPath = generateJsonReport(report, config.outputDir);
const htmlPath = generateHtmlReport(report, config.outputDir);

console.log("Wrote", jsonPath, "and", htmlPath);
```

`generateJsonReport`, `report.json` लिखता है और `generateHtmlReport`, `report.html` लिखता है। दोनों आउटपुट डायरेक्टरी न होने पर उसे बनाते हैं और फ़ाइल पथ लौटाते हैं।

## 5. स्पेसिफ़िकेशन में घोषणात्मक असर्शन

किसी ऑपरेशन में `x-tests` ऐरे जोड़ें। हर प्रविष्टि में `name` और `assert` प्रकार होना चाहिए:

```json
{
  "paths": {
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "content-type is JSON", "assert": "header", "key": "content-type", "contains": "application/json" },
          { "name": "user id exists", "assert": "jsonPath", "path": "$.id", "exists": true },
          { "name": "user is active", "assert": "jsonPath", "path": "$.status", "equals": "active" },
          { "name": "response under 2s", "assert": "responseTime", "max": 2000 },
          { "name": "body contains email", "assert": "bodyContains", "contains": "@" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

असर्शन के प्रकार:

| `assert` | ज़रूरी फ़ील्ड | उद्देश्य |
|----------|-----------------|---------|
| `status` | `value` | HTTP स्टेटस `value` के बराबर हो |
| `header` | `key`; `contains` वैकल्पिक | हेडर मौजूद हो; वैकल्पिक रूप से जाँचें कि उसमें सबस्ट्रिंग है |
| `bodyContains` | `contains` | प्रतिक्रिया बॉडी में सबस्ट्रिंग हो |
| `bodyEquals` | `body` | प्रतिक्रिया बॉडी बिल्कुल `body` के बराबर हो |
| `jsonPath` | `path`; `equals` / `exists` वैकल्पिक | JSONPath हल करके मान की तुलना करें या उसकी मौजूदगी जाँचें |
| `responseTime` | `max` | अवधि `<= max` मिलीसेकंड होनी चाहिए |

## 6. Postman स्क्रिप्ट

`x-postman-scripts` से Postman शैली की परीक्षण स्क्रिप्ट जोड़ें:

```json
{
  "paths": {
    "/users": {
      "get": {
        "operationId": "listUsers",
        "x-postman-scripts": {
          "test": "pm.test('status is 200', () => pm.response.to.have.status(200)); pm.test('users is an array', () => pm.expect(pm.response.json().users).to.be.an('array'));"
        },
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

घोषणात्मक `x-tests` और `x-postman-scripts` एक ही ऑपरेशन में साथ इस्तेमाल हो सकते हैं।

## 7. GitHub Actions के साथ CI एकीकरण

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Run API tests
        run: npx @powerduck/openapi-cli --spec openapi.json --server "$API_URL" --bearer "$BEARER_TOKEN" --output ./reports
        env:
          API_URL: ${{ secrets.API_URL }}
          BEARER_TOKEN: ${{ secrets.BEARER_TOKEN }}
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: openapi-cli-reports
          path: ./reports
```

डिफ़ॉल्ट रूप से, विफल परीक्षण एग्ज़िट कोड `1` लौटाते हैं और कॉन्फ़िगरेशन या गंभीर रनटाइम त्रुटियाँ `2` लौटाती हैं, जिससे CI जॉब विफल होती है। पूरी हो चुकी परीक्षण प्रक्रिया से पाइपलाइन विफल न हो, इसके लिए `--no-fail-on-error` इस्तेमाल करें; यह विकल्प कॉन्फ़िगरेशन या गंभीर त्रुटियों को नहीं दबाता।
