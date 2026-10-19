---
sidebar_position: 1
title: "परिचय"
description: "किसी भी Swagger 2.0, OpenAPI 3.0, 3.1 या 3.2 दस्तावेज़ को एक ही कॉल से OpenAPI 3.2 में बदलें।"
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

किसी भी Swagger 2.0, OpenAPI 3.0, 3.1 या 3.2 दस्तावेज़ को एक ही कॉल से OpenAPI 3.2 में बदलें।

इन दो लाइब्रेरी पर एक हल्का रैपर: [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
यह पार्सिंग, वैलिडेशन या रूपांतरण दोबारा लागू नहीं करता, बल्कि इन्हें जोड़ता है। हर विफलता का एक समान, अनुमानित ढाँचा होता है, जिसमें मशीन-पठनीय त्रुटि कोड शामिल है।

- **पैकेज का नाम:** `@powerduck/openapi-parser`
- **संस्करण:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **लाइसेंस:** MIT
- **Node.js:** >= 22.12.0

## सुविधाएँ

- **सभी संस्करणों के लिए एक फ़ंक्शन** — Swagger 2.0, OpenAPI 3.0.x, 3.1.x और 3.2.x को जाँचे गए 3.2 दस्तावेज़ में बदलता है।
- **JSON और YAML स्ट्रिंग इनपुट** — पहले से पार्स किया गया ऑब्जेक्ट या कच्ची JSON/YAML स्ट्रिंग दें।
- **मशीन-पठनीय त्रुटि कोड** — हर विफलता पर `OpenApiUpgradeError` मिलता है, जिसमें `UpgradeErrorCode` एनम का मान होता है।
- **इनपुट में कोई बदलाव नहीं** — रूपांतरण का कोई चरण चलने से पहले `structuredClone` से इनपुट की डीप कॉपी बनाई जाती है।
- **चक्रीय संदर्भों से सुरक्षा** — स्टैक ओवरफ़्लो होने से पहले इनपुट में चक्र पहचानता है।
- **आउटपुट वैलिडेशन** — बदले गए 3.2 दस्तावेज़ को डिफ़ॉल्ट रूप से स्कीमा के अनुसार जाँचा जाता है।
- **ESM और CJS दोनों** — आधुनिक Node और बंडलर में `import`, तथा Electron की मुख्य प्रक्रिया में `require()` उपयोग करें।

## अगले चरण

- [इंस्टॉलेशन](/docs/hi-IN/openapi-parser/installation/) — इंस्टॉलेशन और आवश्यकताएँ
- [त्वरित शुरुआत](/docs/hi-IN/openapi-parser/quickstart/) — अपना पहला दस्तावेज़ बदलें
- [API संदर्भ](/docs/hi-IN/openapi-parser/api-reference/) — सभी एक्सपोर्ट, त्रुटि कोड और विकल्प
- [उदाहरण](/docs/hi-IN/openapi-parser/examples/) — त्रुटि प्रबंधन, विकल्प और CommonJS का उपयोग
