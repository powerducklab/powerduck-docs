---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi विस्तार योग्य TypeScript फ़्रेमवर्क है, जो curl कमांड और Postman कलेक्शन (v2.0 / v2.1.0) को OpenAPI 3.2 दस्तावेज़ों में बदलता है। यह CI पाइपलाइन, API दस्तावेज़ बनाने और HTTP अनुरोधों से इंटरफ़ेस पुनर्निर्मित करने के लिए उपयुक्त है।"
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** विस्तार योग्य TypeScript फ़्रेमवर्क है, जो **curl कमांड** और **Postman कलेक्शन (v2.0 / v2.1.0)** को **OpenAPI 3.2** दस्तावेज़ों में बदलता है। यह CI पाइपलाइन, API दस्तावेज़ बनाने और HTTP अनुरोधों से इंटरफ़ेस पुनर्निर्मित करने के लिए उपयुक्त है।

दस्तावेज़ सत्यापन के लिए यह [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) उपयोग करता है।

- **संस्करण:** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **लाइसेंस:** MIT
- **Node.js की आवश्यकता:** `>= 22.12.0`
- **आउटपुट:** केवल OpenAPI **3.2.0**
- **स्रोत कोड:** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## यह कैसे काम करता है

```text
curl कमांड → CurlAdapter
Postman कलेक्शन → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → OpenAPI 3.2 दस्तावेज़
             ↓
     validateOpenApi32() → निदान
```

1. **एडैप्टर** curl टेक्स्ट या Postman कलेक्शन जैसे स्रोत को पार्स करके [`NormalizedRequest`](./api-reference.md#normalizedrequest) ऑब्जेक्ट की सूची बनाता है।
2. **बिल्डर** मेथड और पथ के अनुसार अनुरोध जोड़ता है, स्कीमा, पथ पैरामीटर और सुरक्षा परिभाषाएँ अनुमानित करता है, और OpenAPI 3.2 दस्तावेज़ बनाता है।
3. **वैलिडेटर** `@powerduck/openapi-parser` के माध्यम से OpenAPI स्कीमा के अनुसार आउटपुट जाँचता है और निदान जानकारी लौटाता है।

---

## सुविधाएँ

- **दो अंतर्निहित एडैप्टर:** [`CurlAdapter`](./api-reference.md#curladapter) एकल या कई कमांड और ब्राउज़र का “Copy all as cURL” आउटपुट संभालता है; [`PostmanAdapter`](./api-reference.md#postmanadapter) v2.0/v2.1.0, नेस्टेड फ़ोल्डर और विरासत में मिली प्रमाणीकरण सेटिंग का समर्थन करता है।
- **बिना कॉन्फ़िगरेशन के सहायक फ़ंक्शन:** [`curlToOpenApi`](./api-reference.md#curltoopenapi) और [`postmanToOpenApi`](./api-reference.md) एक कॉल में एडैप्टर पंजीकृत करके रूपांतरण करते हैं।
- **OpenAPI 3.2 आउटपुट:** हर दस्तावेज़ `openapi: "3.2.0"` घोषित करता है। सत्यापन डिफ़ॉल्ट रूप से चालू है। निदान जाँचें या त्रुटियों को अस्वीकार करने के लिए सख्त मोड चालू करें।
- **कई अनुरोधों का विलय:** समान मेथड और पथ वाले ऑपरेशन जोड़े जाते हैं; क्वेरी, हेडर, कुकी पैरामीटर और बॉडी स्कीमा संरचना के अनुसार मिलाए जाते हैं।
- **पथ पैरामीटर का अनुमान:** संख्यात्मक ID, UUID, ULID और लंबे हेक्साडेसिमल खंड कम-से-कम N नमूनों में बदलें तो उन्हें `/users/{userId}` जैसे टेम्पलेट में बदला जाता है।
- **सुरक्षा का अनुमान:** Bearer, Basic और हेडर, क्वेरी या कुकी में API कुंजी की पहचान कर संबंधित `securitySchemes` बनाए जाते हैं।
- **कई बॉडी प्रकार:** JSON, XML, form-urlencoded, टेक्स्ट और फ़ाइल वाला multipart/form-data, GraphQL, टेक्स्ट और बाइनरी।
- **Postman टेस्ट स्क्रिप्ट सुरक्षित रखना:** `pm.test()` / `pm.expect()` हर ऑपरेशन में `x-postman-scripts` के रूप में दिए जाते हैं।
- **निदान:** हर समस्या में गंभीरता, कोड और उपलब्ध होने पर स्रोत विवरण शामिल होता है; [`strict`](./api-reference.md#convertoptions) मोड त्रुटि पर अपवाद उत्पन्न करता है।
- **विस्तार योग्य:** HAR, HTTPie या Insomnia स्रोत जोड़ने के लिए [`SourceAdapter`](./api-reference.md) लागू करें।

---

## प्लगइन संरचना

फ़्रेमवर्क एक छोटे एडैप्टर इंटरफ़ेस पर आधारित है:

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

एडैप्टर [`AdapterRegistry`](./api-reference.md#adapterregistry) के माध्यम से [`XToOpenApi`](./api-reference.md#xtoopenapi) इंस्टेंस पर पंजीकृत किए जाते हैं:

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

बिना कॉन्फ़िगरेशन वाले सहायक फ़ंक्शन दोनों अंतर्निहित एडैप्टर पहले से जोड़ते हैं, इसलिए सामान्यतः रजिस्ट्री को सीधे इस्तेमाल करने की आवश्यकता नहीं होती।

---

## सहायक फ़ंक्शन या क्लास चुनना

| उपयोग | API |
|---|---|
| एक या कई curl कमांड बदलना | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| Postman कलेक्शन ऑब्जेक्ट या स्ट्रिंग बदलना | [`postmanToOpenApi`](./api-reference.md) |
| कस्टम विकल्प, कई एडैप्टर, `"auto"` पहचान या कस्टम एडैप्टर | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## अगले कदम

- [स्थापना](./installation.md) — पैकेज जोड़ें और बिना कॉन्फ़िगरेशन वाले सहायक फ़ंक्शन समझें।
- [त्वरित शुरुआत](./quickstart.md) — curl कमांड, Postman कलेक्शन बदलें और कस्टम एडैप्टर उपयोग करें।
- [API संदर्भ](./api-reference.md) — सभी एक्सपोर्ट, प्रकार, विकल्प, डिफ़ॉल्ट मान और निदान कोड।
- [उदाहरण](./examples.md) — curl, कई कमांड, Postman कलेक्शन, कस्टम एडैप्टर और पथ का अनुमान।
