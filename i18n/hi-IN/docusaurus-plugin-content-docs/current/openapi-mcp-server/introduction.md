---
sidebar_position: 1
title: "परिचय"
description: "OpenAPI को MCP सेवाओं में बदलें: टूल, प्रॉम्प्ट, रिसोर्स, वेब एडमिन कंसोल, stdio, HTTP और openapi-mcp CLI।"
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — परिचय

`@powerduck/openapi-mcp-server` किसी OpenAPI दस्तावेज़ को चलने वाली MCP (Model Context Protocol) सेवा में बदलता है। यह ऑपरेशन से **टूल**, API के मेटाडेटा और ऑपरेशन से **प्रॉम्प्ट**, और API कैटलॉग से **रिसोर्स** बनाता है। इन्हें MCP प्रोटोकॉल से उपलब्ध कराया जाता है और एक अंतर्निहित वेब एडमिन UI भी मिलता है।

- **पैकेज का नाम:** `@powerduck/openapi-mcp-server`
- **संस्करण:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **लाइसेंस:** MIT
- **Node की आवश्यकता:** `>=22.12.0`
- **CLI कमांड:** `openapi-mcp`
- **मॉड्यूल फ़ॉर्मैट:** टाइप घोषणाओं सहित ESM और CommonJS दोनों बिल्ड उपलब्ध हैं।

वैलिडेशन और रेफ़रेंस हल करने के लिए `@powerduck/openapi-parser`, तथा प्रोटोकॉल के लिए `@modelcontextprotocol/sdk` का उपयोग होता है।

## क्या जनरेट होता है

- **Tools** — हर OpenAPI ऑपरेशन के लिए एक MCP टूल। इसमें पूरे पैरामीटर सीरियलाइज़ेशन (path/query/header/cookie स्टाइल और explode नियम), रिक्वेस्ट बॉडी एन्कोडिंग (JSON, form-urlencoded, multipart, टेक्स्ट, बाइनरी) और MCP टूल एनोटेशन (`readOnlyHint`, `destructiveHint`, `idempotentHint`) का समर्थन है।
- **Prompts** — ग्लोबल प्रॉम्प्ट (`spec_overview`, `integration_guardrails`) और हर ऑपरेशन के प्रॉम्प्ट (`explain_*`, `plan_*`, `sample_*`)।
- **Resources** — कैटलॉग के निश्चित रिसोर्स, जैसे `openapi://spec/summary`, `openapi://catalog/tools` और `openapi://spec/document`।

## ट्रांसपोर्ट

- **stdio** — `startStdioServer()` स्थानीय MCP क्लाइंट, जैसे Claude Desktop या एडिटर इंटीग्रेशन, को एक दस्तावेज़ उपलब्ध कराता है।
- **HTTP** — `attachMcpRoutes(app, options)` आपके Express ऐप में `/mcp` पर Streamable HTTP और वैकल्पिक रूप से `/sse` पर पुराना SSE माउंट करता है। इसके विकल्प सत्रों की सीमा, निष्क्रियता टाइमआउट, CORS और DNS रीबाइंडिंग सुरक्षा नियंत्रित करते हैं। `startAdminServer()` एडमिन UI जोड़ता है और डिफ़ॉल्ट सत्र सीमाओं का उपयोग करता है। `attachSseRoutes()` स्थान-आधारित आर्ग्युमेंट लेने वाले अप्रचलित रैपर के रूप में उपलब्ध है।

## एडमिन सर्वर

`startAdminServer()` एक Express ऐप शुरू करता है, जिसमें ये सुविधाएँ हैं:

- स्पेसिफ़िकेशन अपलोड या पेस्ट करने, टूल, प्रॉम्प्ट और रिसोर्स देखने तथा चल रही सेवाओं और रिक्वेस्ट लॉग की जाँच के लिए वेब एडमिन कंसोल;
- MCP HTTP ट्रांसपोर्ट;
- API कुंजी से प्रमाणीकरण, संवेदनशील हेडर छिपाकर रिक्वेस्ट लॉगिंग, और वैकल्पिक रूप से स्टेट को स्थायी रूप से सहेजना।

## इंस्टॉलेशन

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## त्वरित शुरुआत

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## अगले चरण

- [इंस्टॉलेशन](../installation/) — npm/yarn/pnpm, ग्लोबल इंस्टॉलेशन, `./server` सबपाथ और डिपेंडेंसी।
- [त्वरित शुरुआत](../quickstart/) — CLI और कोड से उपयोग।
- [कॉन्फ़िगरेशन](../configuration/) — पूरा `ServerConfig` विवरण।
- [API संदर्भ](../api-reference/) — सभी एक्सपोर्ट और CLI कमांड।
- [उदाहरण](../examples/) — व्यावहारिक उदाहरण।

## लाइसेंस

MIT.
