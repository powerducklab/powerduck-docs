---
sidebar_position: 5
title: "उदाहरण"
description: "@powerduck/openapi-codegen के व्यावहारिक उदाहरण: JavaScript fetch, Python requests, cURL, कस्टम जनरेटर, प्लगइन और सीधे RequestIR का उपयोग।"
---

# उदाहरण

`@powerduck/openapi-codegen` के व्यावहारिक उदाहरण। सभी उदाहरण मानते हैं कि `document` नाम का पार्स किया गया OpenAPI दस्तावेज़ ऑब्जेक्ट मौजूद है।

## 1. JavaScript `fetch`

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

अन्य JavaScript क्लाइंट: `axios`, `ofetch`, `jquery`, `xhr`। सर्वर-साइड Node विकल्पों के लिए `node/fetch`, `node/axios`, `node/ofetch` या `node/undici` इस्तेमाल करें।

## 2. Python `requests`

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

अन्य Python क्लाइंट: `aiohttp`, `http-client`, `httpx-sync`, `httpx-async`।

## 3. cURL (shell)

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
  securityValues: { bearerAuth: "YOUR_ACCESS_TOKEN" },
});

console.log(code);
```

अन्य shell क्लाइंट: `wget` और `httpie`। `multipart/form-data` अपलोड के लिए `shell/wget` के बजाय `shell/curl` या `shell/httpie` को प्राथमिकता दें।

## 4. जनरेटर खोजें और चुनें

उपलब्ध जनरेटर देखने के लिए `list()` इस्तेमाल करें, फिर चुने गए भाषा-क्लाइंट जोड़े से कोड बनाएँ:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const all = list();
console.log(all.length, "generators available");

const picked = all.find(
  (g) => g.language === "python" && g.client === "requests",
);

if (!picked) throw new Error("generator unavailable");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 5. कस्टम जनरेटर रजिस्टर करें

`Generator` इंटरफ़ेस लागू करें और `register` कॉल करें:

```typescript
import { register, generate } from "@powerduck/openapi-codegen";
import type { RequestIR } from "@powerduck/openapi-codegen";

register({
  language: "mylang",
  client: "my-client",
  generate(request: RequestIR): string {
    return [
      `// ${request.method} ${request.baseUrl}${request.path}`,
      `mylang.request(${JSON.stringify({
        method: request.method,
        url: request.baseUrl + request.path,
      })})`,
    ].join("\n");
  },
});

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "mylang",
  client: "my-client",
});

console.log(code);
```

## 6. प्लगइन इस्तेमाल करें

प्लगइन `use()` के ज़रिए एक या अधिक जनरेटर का रजिस्ट्रेशन एक साथ करता है:

```typescript
import { use, generate } from "@powerduck/openapi-codegen";

use({
  name: "internal-generators",
  register(api) {
    api.register({
      language: "go",
      client: "our-wrapper",
      generate(request) {
        return `// go wrapper for ${request.method} ${request.path}`;
      },
    });
    api.register({
      language: "ruby",
      client: "our-wrapper",
      generate(request) {
        return `# ruby wrapper for ${request.method} ${request.path}`;
      },
    });
  },
});

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "go",
  client: "our-wrapper",
});
```

## 7. सीधे `RequestIR` से बनाएँ

खुद `RequestIR` बनाकर `normalize` पूरी तरह छोड़ सकते हैं:

```typescript
import { generate } from "@powerduck/openapi-codegen";
import type { RequestIR } from "@powerduck/openapi-codegen";

const request: RequestIR = {
  method: "GET",
  baseUrl: "https://api.example.com",
  path: "/users/{id}",
  parameters: [
    { name: "id", in: "path", value: 123 },
    { name: "limit", in: "query", value: 10, style: "form", explode: true },
  ],
  headers: [
    { name: "Accept", in: "header", value: "application/json" },
  ],
  body: undefined,
  security: [
    { name: "bearerAuth", type: "http", scheme: "bearer", value: "token-abc" },
  ],
};

const code = generate({
  request,
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

## 8. त्रुटि प्रबंधन

इनपुट न होने, अज्ञात जनरेटर या अनसुलझे रेफ़रेंस पर `generate()` त्रुटि देता है। अविश्वसनीय इनपुट संसाधित करते समय त्रुटियाँ हमेशा पकड़ें:

```typescript
try {
  const code = generate({
    document,
    path: "/does-not-exist",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Failed:", error instanceof Error ? error.message : error);
}
```

संभावित त्रुटि संदेशों में `Unsupported generator: ...`, `Path not found: ...` और `Operation not found: METHOD /path` शामिल हैं।

## 9. `$ref` का सहनशील मोड

दस्तावेज़ में टूटे या चक्रीय रेफ़रेंस हो सकते हों तो `softRefMode: true` दें। इससे त्रुटि के बजाय आंशिक परिणामों के साथ प्रक्रिया आगे बढ़ती है:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "python",
  client: "requests",
  softRefMode: true,
});
```
