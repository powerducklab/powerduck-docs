---
sidebar_position: 5
title: "예제"
description: "공개 API를 사용하는 실용적이고 실행 가능한 예제입니다. 문자열 작업에는 브라우저에서 안전한 @powerduck/conf-patch/core를, 파일 작업에는 @powerduck/conf-patch를 가져오세요."
---

# 예제

공개 API를 사용하는 실용적이고 실행 가능한 예제입니다. 문자열 작업에는 브라우저에서 안전한 `@powerduck/conf-patch/core`를, 파일 작업에는 `@powerduck/conf-patch`를 가져오세요.

---

## 1. JSON Patch 작업 (핵심 계층)

JSON 문자열에 여러 RFC 6902 작업을 적용합니다. `add`는 배열에 삽입하거나 객체 속성을 추가·교체합니다. `replace`와 `remove`는 대상이 이미 존재해야 합니다.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

const source = JSON.stringify(
  {
    name: "my-app",
    version: "1.0.0",
    tags: ["web"],
  },
  null,
  2,
);

const patched = patchContent(
  source,
  [
    { op: "add", path: ["description"], value: "Demos patchContent" },
    { op: "replace", path: ["version"], value: "1.1.0" },
    { op: "add", path: ["tags", 1], value: "api" }, // inserts, does not overwrite
  ],
  "json",
);

console.log(patched);
```

결과:

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

`strict: false`를 설정하면 실패한 작업에서 예외를 던지는 대신 건너뜁니다.

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. 중첩된 YAML 값 설정 (파일 계층)

YAML 파일의 `database.port`를 설정합니다. 부모 경로(`database`)가 이미 존재해야 합니다. 쓰기는 원자적이며 잠금으로 보호됩니다.

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

아직 없는 중첩 객체를 만들려면 부모를 먼저 만드세요.

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### YAML 배열 작업

시퀀스 인덱스에는 숫자 경로 세그먼트를 사용합니다. `add`는 **삽입**, `replace`는 같은 위치에서 교체, `remove`는 삭제합니다.

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. 주석을 보존하는 JSONC 편집

JSONC 편집은 텍스트 범위를 기준으로 하므로 수정한 줄 주변의 주석과 후행 쉼표가 보존됩니다.

```typescript
import { patchContent, deleteContentValue } from "@powerduck/conf-patch/core";

const jsonc = `{
  // Application name
  "name": "my-app",
  // Legacy feature flag
  "legacyFeature": true,
  "version": "1.0.0",
}`;

// Replace a value — the surrounding comments stay put.
const updated = patchContent(
  jsonc,
  [{ op: "replace", path: ["version"], value: "1.2.0" }],
  "jsonc",
);

// Delete a key — its own line is removed, other comments remain.
const cleaned = deleteContentValue(updated, ["legacyFeature"], "jsonc");

console.log(cleaned);
```

주석이 보존된 결과:

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. OpenAPI 문서 검증

원시 명세 내용을 검증한 다음 파일을 검증합니다. 파일 모드에서는 경로 접근을 제한하기 위해 `allowedRootDirectory`가 필요합니다.

```typescript
import {
  validateOpenAPISpec,
  validateOpenAPIFile,
  OpenApiValidationError,
} from "@powerduck/conf-patch";

// (a) Validate raw content (JSON or YAML)
const specContent = `openapi: 3.0.0
info:
  title: Demo API
  version: 1.0.0
paths: {}`;

try {
  const doc = await validateOpenAPISpec(specContent);
  console.log("Valid. openapi =", doc.openapi);
} catch (error) {
  if (error instanceof OpenApiValidationError) {
    console.error(`Validation failed [${error.code}]:`, error.message);
  } else {
    throw error;
  }
}

// (b) Validate from a file (requires allowedRootDirectory)
const fileDoc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
  // Optional hardening:
  // timeoutMs: 10000,
  // maxInputBytes: 2 * 1024 * 1024,
});
```

`AbortSignal`로 취소:

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

await validateOpenAPISpec(specContent, { signal: controller.signal }).catch(
  (error) => {
    // Throws OpenApiValidationError with code "OPERATION_ABORTED" on abort.
    console.error(error.code);
  },
);
```

---

## 5. 파일 잠금으로 안전한 동시 접근

여러 프로세스 또는 한 프로세스의 여러 동시 작업이 같은 파일에 접근하면 `patchConfigFile`이 이미 접근을 직렬화합니다. 여러 파일 작업을 하나의 임계 구역으로 묶어야 한다면 `withFileLock`을 직접 사용하세요.

```typescript
import { readConfigFile, writeConfigFile, withFileLock } from "@powerduck/conf-patch";

async function bumpCounter(file: string): Promise<number> {
  return withFileLock(
    file,
    async () => {
      // Read-inside-lock prevents a lost read between workers.
      const raw = await readConfigFile(file);
      const data = JSON.parse(raw);
      data.count = (data.count ?? 0) + 1;
      await writeConfigFile(file, JSON.stringify(data, null, 2), { lock: false });
      return data.count;
    },
    {
      timeoutMs: 5000, // give up after 5s
      retryDelayMs: 25, // initial delay; grows by 1.5x up to 1s
      allowStaleRecovery: false,
    },
  );
}
```

참고:

- `withFileLock`은 한 프로세스에서 **같은 파일**에 대한 작업을 큐에 넣고, 프로세스 간에는 배타적인 `.confedit.lock` 파일을 사용합니다.
- 잠금을 해제할 때 파일을 삭제하기 전에 소유권 토큰을 확인하므로, 오래된 잠금을 인계받은 새 잠금을 이전 해제 작업이 삭제하지 않습니다.
- 종료 시, 예를 들어 Electron의 `will-quit` 이벤트에서 남아 있는 잠금을 해제하세요.

```typescript
import { app } from "electron";
import { releaseAllLocalLocks } from "@powerduck/conf-patch";

let locksReleased = false;
app.on("will-quit", (event) => {
  if (locksReleased) return;
  event.preventDefault();
  void releaseAllLocalLocks()
    .catch((error) => console.error("Lock cleanup failed", error))
    .finally(() => {
      locksReleased = true;
      app.quit();
    });
});
```

---

## 6. 종합 예제: 디스크의 OpenAPI 명세 편집

라이브러리 자체의 예제 흐름에 따라 명세를 읽고, 값을 설정하고, 응답을 추가한 뒤 검증합니다.

```typescript
import {
  readConfigFile,
  setConfigValue,
  patchConfigFile,
  validateOpenAPIFile,
} from "@powerduck/conf-patch";

const specPath = "./openapi.yaml";

// Read the raw text.
await readConfigFile(specPath);

// Set info.version and the first server URL.
await setConfigValue(specPath, ["info", "version"], "1.1.0");
await setConfigValue(specPath, ["servers", 0, "url"], "https://api.prod.example.com/v1");

// Add a 404 response to GET /pets.
await patchConfigFile(specPath, [
  {
    op: "add",
    path: ["paths", "/pets", "get", "responses", "404"],
    value: { description: "Resource not found" },
  },
]);

// Confirm the edited document still validates.
await validateOpenAPIFile(specPath, { allowedRootDirectory: "." });
```

---

## 다음 단계

- [API 레퍼런스](../api-reference/) — 전체 시그니처와 모든 옵션의 기본값.
- [빠른 시작](../quickstart/) — 처음부터 끝까지 실행하는 첫 예제.
