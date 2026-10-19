---
sidebar_position: 3
title: "빠른 시작"
description: "@powerduck/conf-patch 시작하기: 브라우저용 코어에서 JSON/YAML 문자열을 수정한 뒤 Node.js나 Electron에서 파일을 편집합니다."
---

# 빠른 시작

이 가이드에서는 두 계층을 차례로 살펴봅니다. 먼저 어디서나 문자열만 다루는 **코어 계층**, 다음으로 Node.js와 Electron에서 실제 파일을 다루는 **파일 계층**을 사용합니다.

사전 요구 사항: 먼저 패키지를 설치하세요. [설치](/docs/ko-KR/conf-patch/installation/)

## 1. 코어 계층 — 브라우저에서 문자열 수정

`@powerduck/conf-patch/core`에서 가져오세요. 파일 시스템에 접근하지 않고 새 내용을 문자열로 반환하므로 localStorage, IndexedDB, 문자열 상수 등 원하는 곳에 저장할 수 있습니다.

```typescript
import {
  patchContent,
  setContentValue,
  deleteContentValue,
} from "@powerduck/conf-patch/core";

// --- JSON: apply multiple RFC 6902 operations ---
const json = JSON.stringify({ name: "my-app", version: "1.0.0" }, null, 2);

const updatedJson = patchContent(
  json,
  [
    { op: "add", path: ["description"], value: "My awesome application" },
    { op: "replace", path: ["version"], value: "1.1.0" },
  ],
  "json",
);

console.log(updatedJson);
// {
//   "name": "my-app",
//   "version": "1.1.0",
//   "description": "My awesome application"
// }

// Store it however you like — no fs required.
localStorage.setItem("config", updatedJson);
```

### YAML에도 같은 방식 적용

```typescript
import { setContentValue, deleteContentValue } from "@powerduck/conf-patch/core";

// Set a nested value in YAML (the "server" parent already exists).
const yaml = "name: my-app\nserver:\n  host: localhost\n";

const updatedYaml = setContentValue(yaml, ["server", "port"], 8080, "yaml");
console.log(updatedYaml);
// name: my-app
// server:
//   host: localhost
//   port: 8080

// Delete a value.
const cleaned = deleteContentValue(updatedYaml, ["server", "host"], "yaml");
```

:::note
`setContentValue`는 `add`를 사용해 객체 속성을 **추가하거나 바꿉니다**. `deleteContentValue`는 `remove`를 사용합니다. 전체 연산은 [`patchContent`](/docs/ko-KR/conf-patch/api-reference/#patchcontent)를 참고하세요.
:::

## 2. 파일 계층 — 디스크 파일 수정

기본 진입점에서 가져오세요. 이 함수들은 `async`이며 실제 파일을 읽고 쓰고, 잠금과 원자적 쓰기를 사용합니다.

```typescript
import { setConfigValue, readConfigFile, patchConfigFile } from "@powerduck/conf-patch";

// Set a nested value in a YAML file (atomic, lock-guarded).
await setConfigValue("config.yaml", ["database", "port"], 5432);

// Read the file back.
const content = await readConfigFile("config.yaml");
console.log(content);

// Apply several operations to a JSON file in one locked transaction.
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

형식은 확장자(`.json`, `.jsonc`, `.yaml`, `.yml`)로 자동 감지됩니다. 확장자로 판단하기 어렵다면 `format`을 명시하세요.

## 3. 오류 처리

두 계층 모두 잘못된 입력에 대해 오류를 발생시킵니다. 기본값인 `strict` 모드에서는 패치 연산 실패도 오류를 발생시킵니다.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

try {
  // "remove" requires the path to exist.
  patchContent('{"name": "app"}', [{ op: "remove", path: ["missing"] }], "json");
} catch (error) {
  // Error: [confedit] Cannot remove a value that does not exist at path: ["missing"]
  console.error(error instanceof Error ? error.message : error);
}
```

`strict: false`를 지정하면 오류를 발생시키는 대신 실패한 연산을 건너뜁니다.

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Electron IPC 예제

보통 Electron 메인 프로세스에서 파일 계층을 실행하고 IPC를 통해 제공하는 방식을 사용합니다.

```javascript
// Electron main process (CommonJS)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

ipcMain.handle("config:set", async (_event, { filePath, path, value }) => {
  try {
    await setConfigValue(filePath, path, value);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("config:read", async (_event, { filePath }) => {
  try {
    const data = await readConfigFile(filePath);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

## 다음 단계

- [API 참조](/docs/ko-KR/conf-patch/api-reference/) — 모든 함수, 타입, 옵션.
- [예제](/docs/ko-KR/conf-patch/examples/) — JSON 패치, YAML, 주석이 있는 JSONC, OpenAPI 검증, 파일 잠금.
