---
sidebar_position: 1
title: "परिचय"
description: "@powerduck/openapi-codegen से OpenAPI के चलने योग्य HTTP उदाहरण बनाएँ: 21 भाषाएँ, 41 क्लाइंट संयोजन, ब्राउज़र-संगत और बिना रनटाइम निर्भरता के।"
---

# परिचय

`@powerduck/openapi-codegen` एक TypeScript लाइब्रेरी है जो OpenAPI ऑपरेशन को चुनी गई भाषा और HTTP क्लाइंट के **चलने योग्य HTTP अनुरोध उदाहरण** में बदलती है। यह API डॉक्यूमेंटेशन साइट, डेवलपर पोर्टल, API एक्सप्लोरर, CLI टूल और बिल्ड के समय कोड बनाने के लिए डिज़ाइन की गई है।

यह **21 भाषाएँ** और **41 भाषा/क्लाइंट संयोजन** समर्थन करती है, **ब्राउज़र-संगत** है और इसकी **कोई रनटाइम निर्भरता नहीं है**।

## openapi-codegen क्यों चुनें

- **कोई रनटाइम निर्भरता नहीं** — Node के बिल्ट-इन मॉड्यूल के बिना ब्राउज़र, Node.js, Electron और एज रनटाइम में चलती है।
- **दो मॉड्यूल फ़ॉर्मैट** — नेटिव ESM और CommonJS (`require()`) बिल्ड।
- **OpenAPI 3.0 / 3.1 / 3.2** — पार्स किए हुए दस्तावेज़ ऑब्जेक्ट पर काम करती है। `generate()` कॉल करने से पहले पार्स करके JSON और YAML, दोनों इस्तेमाल किए जा सकते हैं।
- **41 बिल्ट-इन जनरेटर** — 21 भाषाओं के लिए; इम्पोर्ट के समय अपने-आप रजिस्टर होते हैं।
- **पूरी पैरामीटर सीरियलाइज़ेशन** — पाथ, क्वेरी, हेडर और कुकी पैरामीटर पर OpenAPI के `style` / `explode` / `allowReserved` नियम लागू होते हैं।
- **सुरक्षा स्कीम** — API कुंजी (header/query/cookie), HTTP bearer और HTTP basic।
- **बॉडी के प्रकार** — JSON, साधारण टेक्स्ट, URL-एन्कोडेड फ़ॉर्म और `multipart/form-data`।
- **`$ref` समाधान** — दस्तावेज़ के अंदर JSON Pointer रेफ़रेंस, कैश, रेफ़रेंस शृंखला और चक्र की पहचान के साथ।
- **अपने-आप उदाहरण** — JSON Schema के `example`, `enum`, `default`, टाइप, फ़ॉर्मैट और सीमाओं से मानों का अनुमान।
- **प्लगइन सिस्टम** — `register()` या `use()` से कस्टम जनरेटर रजिस्टर करें।

## यह कैसे काम करता है

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize` में `$ref` सुलझाए जाते हैं, पाथ और ऑपरेशन के पैरामीटर मिलाए जाते हैं, बॉडी का मीडिया टाइप चुना जाता है, उदाहरण मान बनते हैं और सुरक्षा स्कीम संसाधित होती हैं। इससे मानकीकृत `RequestIR` बनता है।
2. चुना गया `Generator`, `RequestIR` लेकर चलने योग्य सोर्स कोड स्ट्रिंग लौटाता है।

आम तौर पर केवल `generate({...})` कॉल करना होता है; यह दोनों चरण पूरा करता है।

## बुनियादी उदाहरण

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## अगले कदम

- [इंस्टॉल करें](/docs/hi-IN/openapi-codegen/installation/) — npm / yarn / pnpm और ब्राउज़र में उपयोग।
- [तुरंत शुरुआत](/docs/hi-IN/openapi-codegen/quickstart/) — पहला कोड अंश बनाएँ और जनरेटर की सूची देखें।
- [कॉन्फ़िगरेशन](/docs/hi-IN/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`।
- [API संदर्भ](/docs/hi-IN/openapi-codegen/api-reference/) — सभी एक्सपोर्ट और भाषा/क्लाइंट की पूरी सूची।
- [उदाहरण](/docs/hi-IN/openapi-codegen/examples/) — fetch, Python requests, cURL, कस्टम जनरेटर, प्लगइन और सीधे `RequestIR` का उपयोग।
