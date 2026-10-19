---
sidebar_position: 5
title: "예제"
description: "@powerduck/openapi-codegen 실전 예제: JavaScript fetch, Python requests, cURL, 사용자 정의 생성기, 플러그인, 직접 구성한 RequestIR."
---

# 예제

`@powerduck/openapi-codegen` 실전 예제입니다. 모든 예제는 `document`라는 파싱된 OpenAPI 문서 객체가 있다고 가정합니다.

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

다른 JavaScript 클라이언트로 `axios`, `ofetch`, `jquery`, `xhr`가 있습니다. 서버 측 Node에서는 `node/fetch`, `node/axios`, `node/ofetch`, `node/undici`를 사용하세요.

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

다른 Python 클라이언트로 `aiohttp`, `http-client`, `httpx-sync`, `httpx-async`가 있습니다.

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

다른 shell 클라이언트로 `wget`과 `httpie`가 있습니다. `multipart/form-data` 업로드에는 `shell/wget`보다 `shell/curl`이나 `shell/httpie`를 권장합니다.

## 4. 생성기 검색 및 선택

`list()`로 사용할 수 있는 생성기를 확인한 다음 선택한 조합으로 생성하세요.

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

## 5. 사용자 정의 생성기 등록

`Generator` 인터페이스를 구현하고 `register`를 호출하세요.

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

## 6. 플러그인 사용

플러그인은 `use()`를 통해 하나 이상의 생성기 등록을 묶습니다.

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

## 7. `RequestIR`에서 직접 생성

`RequestIR`을 직접 만들면 `normalize`를 완전히 건너뛸 수 있습니다.

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

## 8. 오류 처리

`generate()`는 입력 누락, 알 수 없는 생성기, 해석되지 않은 참조에 오류를 발생시킵니다. 신뢰할 수 없는 입력을 처리할 때는 항상 오류를 잡으세요.

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

예상되는 오류 메시지로 `Unsupported generator: ...`, `Path not found: ...`, `Operation not found: METHOD /path`가 있습니다.

## 9. `$ref` 허용 모드

문서에 잘못되거나 순환하는 참조가 있을 수 있다면 `softRefMode: true`를 전달하세요. 오류 대신 부분 결과로 처리를 계속합니다.

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
