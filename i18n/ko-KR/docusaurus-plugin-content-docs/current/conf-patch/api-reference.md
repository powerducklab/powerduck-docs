---
sidebar_position: 4
title: "API 참조"
description: "@powerduck/conf-patch의 모든 내보내기 기호에 대한 시그니처와 기본값을 정리한 참조 문서입니다."
---

# API 참조

`@powerduck/conf-patch`의 모든 내보내기 기호에 대한 시그니처와 기본값을 정리한 참조 문서입니다.

진입점은 두 가지입니다.

- **`@powerduck/conf-patch`** — 아래의 모든 기능: 핵심 계층, 파일 계층, OpenAPI 검증, 유틸리티.
- **`@powerduck/conf-patch/core`** — 브라우저 호환 부분만 포함: `patchContent`, `setContentValue`, `deleteContentValue`, `PatchContentOptions`, 어설션 도우미와 `ConfigFormat`, `JsonPatchOp`, `JsonPathSegment` 타입.

---

## 핵심 계층(브라우저 호환)

### `patchContent`

설정 문자열에 RFC 6902 패치 작업 배열을 적용합니다. 파일 시스템에 접근하지 않는 순수 함수입니다.

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| `content` | `string` | 원본 설정 내용. 지정한 `format`에 맞는 유효한 내용이어야 합니다. |
| `ops` | `JsonPatchOp[]` | 순서대로 적용할 작업. 빈 배열이면 `content`를 그대로 반환합니다. |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`. |
| `options.strict` | `boolean` | `true`(기본값)이면 실패한 작업에서 예외가 발생합니다. `false`이면 해당 작업을 건너뛰고 `console.warn`으로 경고합니다. |

**반환:** 패치가 적용된 설정 내용(`string`).

**예외:** `content`가 문자열이 아니거나 `ops`가 유효하지 않으면 `TypeError`. `strict`가 `true`이면 실패한 작업을 설명하는 오류.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

patchContent(
  '{"name": "app"}',
  [{ op: "add", path: ["version"], value: "1.0.0" }],
  "json",
);
// => '{\n  "name": "app",\n  "version": "1.0.0"\n}'
```

---

### `setContentValue`

단일 값을 설정하거나 생성합니다. 내부적으로 `patchContent`에 하나의 `add` 작업을 전달합니다. RFC 6902에 따라 `add`는 기존 객체 속성을 교체하거나 배열 인덱스에 요소를 삽입합니다.

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| `content` | `string` | 원본 설정 내용. |
| `path` | `readonly (string \| number)[]` | `["server", "port"]`와 같은 구간별 경로. 비어 있으면 안 됩니다. |
| `value` | `unknown` | 쓸 값. |
| `format` | `ConfigFormat` | 설정 형식. |

**반환:** 업데이트된 내용(`string`).

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

키 또는 배열 요소를 제거합니다. 내부적으로 `patchContent`에 하나의 `remove` 작업을 전달합니다. 경로가 존재해야 합니다.

```typescript
function deleteContentValue(
  content: string,
  path: readonly (string | number)[],
  format: ConfigFormat,
): string;
```

```typescript
deleteContentValue(
  '{"name": "app", "legacy": true}',
  ["legacy"],
  "json",
);
```

---

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  /** When true, failed operations throw. When false, they are skipped with a warning. Default: true */
  strict?: boolean;
}
```

---

## 파일 계층(Node.js / Electron 전용)

### `readConfigFile`

로컬 파일 경로나 `file://` URL에서 UTF-8 텍스트를 읽습니다.

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| `filePath` | `string` | 절대 경로, 상대 경로 또는 `file://` URL. 비어 있으면 안 됩니다. |

**반환:** 원본 UTF-8 내용(`Promise<string>`).

**예외:** 파일을 읽을 수 없으면 하위 파일 시스템 오류를 포함한 오류가 발생합니다.

---

### `writeConfigFile`

임시 파일과 이름 변경으로 **원자적 쓰기**를 수행하며, 기본적으로 배타적 **파일 잠금**을 사용합니다. 잠금을 얻기 전에 부모 디렉터리를 생성합니다.

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| `filePath` | `string` | 설정 파일 경로. |
| `content` | `string` | 쓸 내용. 문자열이어야 합니다. |
| `options` | `WriteConfigOptions` | 아래 설명을 참고하세요. |

**예외:** 잘못된 입력에는 `TypeError`. 쓰기 중 파일 시스템 오류는 감싸서 전달합니다.

#### `WriteConfigOptions`

| 옵션 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `lock` | `boolean` | `true` | 쓰기 중 파일 잠금을 사용합니다. |
| `lockTimeoutMs` | `number` | `withFileLock` 기본값(10초) | 잠금 획득을 기다리는 최대 시간(밀리초). |
| `lockRetryDelayMs` | `number` | `withFileLock` 기본값(25밀리초) | 지수 백오프 전의 초기 재시도 지연(밀리초). |
| `lockStaleThresholdMs` | `number` | `withFileLock` 기본값 | 잠금 복구를 허용하기까지 필요한 경과 시간(밀리초). |
| `allowStaleRecovery` | `boolean` | `false` | 오래된 잠금의 자동 회수를 허용할지 여부. |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

파일 계층의 주요 트랜잭션입니다. 잠금 안에서 파일을 읽고 `patchContent`를 적용하며, **내용이 변경된 경우에만** 원자적으로 다시 씁니다. `options.format`이 없으면 확장자로 형식을 감지합니다.

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| `filePath` | `string` | 설정 파일 경로. 비어 있으면 안 됩니다. |
| `ops` | `JsonPatchOp[]` | 적용할 작업. 빈 배열이면 읽거나 쓰지 않고 반환합니다. |
| `options` | `PatchConfigOptions` | 아래 설명을 참고하세요. |

**예외:** `filePath`가 비어 있거나 잠금 옵션이 잘못되었거나, 형식을 감지할 수 없고 `format`도 없으면 `TypeError`. `strict`가 `true`이면 작업 오류.

#### `PatchConfigOptions`

| 옵션 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `format` | `ConfigFormat` | 자동 감지 | 명시적 형식. 확장자 감지 결과보다 우선합니다. |
| `strict` | `boolean` | `true` | 실패한 작업에서 예외를 발생시킵니다. |
| `lock` | `boolean` | `true` | 파일 잠금을 사용합니다. |
| `lockTimeoutMs` | `number` | 10초 | 0 이상. 잠금을 기다리는 최대 시간. |
| `lockRetryDelayMs` | `number` | 25밀리초 | 양수. 초기 재시도 지연. |
| `lockStaleThresholdMs` | `number` | 계산된 값 | 양수. 오래된 잠금 복구에 필요한 경과 시간. |
| `allowStaleRecovery` | `boolean` | `false` | 오래된 잠금을 자동 회수합니다. |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

파일의 중첩 값을 추가하거나 교체합니다. 하나의 `add` 작업을 `patchConfigFile`에 위임합니다.

```typescript
function setConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  value: unknown,
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await setConfigValue("config.yaml", ["database", "port"], 5432);
```

---

### `deleteConfigValue`

파일의 기존 중첩 값을 제거합니다. 하나의 `remove` 작업을 `patchConfigFile`에 위임합니다.

```typescript
function deleteConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await deleteConfigValue("config.json", ["features", "betaPreview"]);
```

---

### `withFileLock`

프로세스 내부 큐**와** 배타적 잠금 파일(`<file>.confedit.lock`)을 통해 비동기 콜백을 실행합니다. 잠금은 소유권 토큰을 사용합니다. `allowStaleRecovery`가 `true`이고 잠금 경과 시간이 `staleThresholdMs`를 넘을 때만 오래된 잠금을 복구합니다. PID는 재사용될 수 있어 검사하지 않습니다.

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| `filePath` | `string` | 잠글 파일. |
| `callback` | `() => Promise<T>` | 잠금을 보유한 동안 실행할 작업. |
| `options` | `FileLockOptions` | 아래 설명을 참고하세요. |

**반환:** `callback`의 결과(`Promise<T>`). 콜백에서 예외가 발생해도 `finally` 블록에서 잠금을 해제합니다.

#### `FileLockOptions`

| 옵션 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | 잠금을 기다리는 최대 시간(밀리초). 0 이상이어야 합니다. |
| `retryDelayMs` | `number` | `25` | 초기 재시도 지연(밀리초). 양수여야 합니다. 지연은 1.5배씩 증가하며 최대 1000밀리초입니다. |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | 복구를 허용하는 잠금 경과 시간(밀리초). 양수여야 합니다. |
| `allowStaleRecovery` | `boolean` | `false` | 오래된 잠금의 자동 회수. 진행 중인 트랜잭션을 중단하지 않도록 Electron의 단일 메인 프로세스에서는 기본적으로 꺼져 있습니다. |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

현재 프로세스가 소유한 잠금 파일을 모두 삭제합니다. 활성 파일 트랜잭션이 끝난 뒤 애플리케이션 종료 시 사용하세요. Electron에서 비동기 정리가 필요하면 첫 종료 이벤트를 막고, 정리 완료 후 종료를 다시 진행합니다. 예제를 참고하세요. 개별 잠금의 정리 실패는 무시합니다.

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## OpenAPI 검증

### `validateOpenAPISpec`

원본 OpenAPI/Swagger 내용(JSON 또는 YAML)을 검증합니다. 기본적으로 입력을 **내용**으로 처리하며, `inputKind: "file"`일 때만 파일 경로로 해석합니다. 검증은 `@powerduck/openapi-parser`에 위임하고 이 함수는 입력 안전장치를 추가합니다.

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| `input` | `string` | 원본 명세 내용. `inputKind: "file"`이면 파일 경로. |
| `options` | `ValidateOpenApiOptions` | 아래 설명을 참고하세요. |

**반환:** 성공 시 검증된 문서(`Promise<AnyOpenAPIDocument>`).

**예외:** 비어 있거나 문자열이 아닌 입력에는 `TypeError`. 잘못된 옵션이나 검증 실패에는 [`OpenApiValidationError`](#openapivalidationerror).

---

### `validateOpenAPIFile`

`inputKind: "file"`과 지정 경로로 설정한 `baseFilePath`를 사용하여 `validateOpenAPISpec`을 호출하는 편의 함수입니다. `allowedRootDirectory`가 필요합니다.

```typescript
function validateOpenAPIFile(
  filePath: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

```typescript
import { validateOpenAPIFile } from "@powerduck/conf-patch";

const doc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
});
```

---

### `ValidateOpenApiOptions`

| 옵션 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | `input`을 해석하는 방식. |
| `baseFilePath` | `string` | — | 참조 확인 컨텍스트의 기준 경로. |
| `allowedRootDirectory` | `string` | — | 파일 입력의 루트 디렉터리. `inputKind`가 `"file"`이면 **필수**입니다. |
| `timeoutMs` | `number` | `15000` | 작업 제한 시간(밀리초). |
| `maxInputBytes` | `number` | `5242880`(5 MB) | 원본 입력의 최대 바이트 수. |
| `maxDocumentNodes` | `number` | `100000` | 파싱된 문서의 최대 노드 수. DoS 방어용. |
| `maxDocumentDepth` | `number` | `100` | 최대 중첩 깊이. DoS 방어용. |
| `maxValidationErrors` | `number` | `50` | 오류 메시지에 포함할 최대 오류 수. |
| `maxErrorMessageLength` | `number` | `1000` | 검증 오류당 최대 문자 수. |
| `signal` | `AbortSignal` | — | 선택적 취소 신호. |

---

### `OpenApiValidationError`

검증 실패 시 발생하는 구조화된 오류입니다. 클라이언트에 반환하기 전에 애플리케이션 경계에서 오류를 변환하세요. 메시지와 원인에 로컬 경로나 문서 세부 정보가 포함될 수 있습니다.

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| 속성 | 타입 | 설명 |
|---|---|---|
| `code` | `string` | 프로그램에서 처리할 오류 코드. 아래 표 참고. |
| `message` | `string` | 사용자가 읽을 수 있는 상세 설명. |
| `cause` | `unknown` | 선택적 하위 오류. |

#### 오류 코드

| 코드 | 의미 |
|---|---|
| `INVALID_OPTION` | 잘못된 옵션 값이 제공되었습니다. |
| `INPUT_TOO_LARGE` | 원본 내용이 `maxInputBytes`를 초과합니다. |
| `INPUT_FILE_TOO_LARGE` | 입력 파일이 크기 제한을 초과합니다. |
| `FILE_INPUT_FORBIDDEN` | `allowedRootDirectory` 없이 파일 입력을 사용했습니다. |
| `PATH_OUTSIDE_ROOT` | 확인된 파일 경로가 `allowedRootDirectory` 밖에 있습니다. |
| `PARSE_ERROR` | JSON/YAML 내용을 파싱하지 못했습니다. |
| `INVALID_DOCUMENT_SHAPE` | 문서가 JSON 객체가 아닙니다. |
| `UNSUPPORTED_VERSION` | 문서가 지원되는 OpenAPI/Swagger 버전을 선언하지 않았습니다. 주 버전 `2`와 `3`만 허용합니다. |
| `DOCUMENT_TOO_DEEP` | 중첩 깊이가 `maxDocumentDepth`를 초과합니다. |
| `DOCUMENT_TOO_LARGE` | 노드 수가 `maxDocumentNodes`를 초과합니다. |
| `SPEC_VALIDATION_FAILED` | 명세가 OpenAPI 검증을 통과하지 못했습니다. |
| `OPERATION_TIMEOUT` | 작업이 `timeoutMs`를 초과했습니다. |
| `OPERATION_ABORTED` | `signal`로 작업이 취소되었습니다. |
| `UNKNOWN_ERROR` | 예기치 않은 오류. |

---

## 유틸리티

### `detectFormat`

파일 경로나 `file://` URL의 확장자로 [`ConfigFormat`](#configformat)을 감지합니다.

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| 확장자 | 결과 |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| 그 밖의 확장자 | 오류 발생 |

---

### `normalizeFilePath`

로컬 경로나 `file:` URL을 네이티브 절대 경로로 변환합니다. 유효한 공백과 Unicode 파일 이름을 보존합니다.

```typescript
function normalizeFilePath(filePath: string): string;
```

`file:` URL은 `fileURLToPath`로 디코딩하고, 절대 경로는 그대로 반환하며, 상대 경로는 `process.cwd()`를 기준으로 확인합니다.

---

## 어설션 도우미

고급 사용과 내부 모듈을 위해 다시 내보내는 함수입니다. 애플리케이션 코드에서 직접 사용할 일은 드뭅니다.

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
`value`가 비어 있지 않은 문자열이 아니면 `TypeError`를 발생시킵니다.

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
`path`가 비어 있지 않은 배열이고 각 구간이 비어 있지 않은 문자열 또는 안전한 0 이상의 정수라는 조건을 충족하지 않으면 예외를 발생시킵니다.

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
각 작업을 검증합니다. `op`는 `"add" | "replace" | "remove"`여야 하고, `path`는 `assertPatchPath`를 통과해야 하며, `add`/`replace`에는 자체 `value` 속성이 있어야 합니다.

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
`format`이 `"json"`, `"jsonc"`, `"yaml"` 중 하나가 아니면 예외를 발생시킵니다.

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
`Error` 인스턴스에는 `error.message`를, 그 외에는 `String(error)`를 반환합니다.

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
`Error`를 생성하고 `Object.defineProperty`로 `cause` 속성을 추가합니다. 이전 실행 환경을 위한 대체 처리도 제공합니다.

---

## 타입

### `ConfigFormat`

```typescript
type ConfigFormat = "json" | "jsonc" | "yaml";
```

### `JsonPathSegment`

```typescript
type JsonPathSegment = string | number;
```

### `JsonPatchOp`

```typescript
interface JsonPatchOp {
  op: "add" | "replace" | "remove";
  path: JsonPathSegment[];
  /** Required for "add" and "replace". */
  value?: unknown;
}
```

:::caution
`"add"`, `"replace"`, `"remove"`만 지원합니다. `"move"`, `"copy"`, `"test"`는 의도적으로 제외됩니다.
:::

### `PatchConfigOptions`

```typescript
interface PatchConfigOptions {
  format?: ConfigFormat;
  strict?: boolean;
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `FileLockOptions`

```typescript
interface FileLockOptions {
  /** Max time to wait for a lock. Defaults to 10 seconds. */
  timeoutMs?: number;
  /** Initial retry delay. Defaults to 25ms. */
  retryDelayMs?: number;
  /** Explicit lock age after which recovery is allowed. */
  staleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `WriteConfigOptions`

```typescript
interface WriteConfigOptions {
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  allowStaleRecovery?: boolean;
}
```

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  strict?: boolean;
}
```

### `OpenApiInputKind`

```typescript
type OpenApiInputKind = "content" | "file";
```

### `AnyOpenAPIDocument`

검증이 반환하는 지원 OpenAPI/Swagger 문서 구조의 유니온 타입:

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document`는 허용 범위가 넓은 구조적 타입입니다.

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## 내보내기 요약

| 기호 | 기본 진입점 | 핵심 하위 경로 | 종류 |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | 함수 |
| `setContentValue` | ✓ | ✓ | 함수 |
| `deleteContentValue` | ✓ | ✓ | 함수 |
| `PatchContentOptions` | ✓ | ✓ | 타입 |
| `assertNonEmptyString` | ✓ | ✓ | 함수 |
| `assertPatchPath` | ✓ | ✓ | 함수 |
| `assertPatchOperations` | ✓ | ✓ | 함수 |
| `assertConfigFormat` | ✓ | ✓ | 함수 |
| `getErrorMessage` | ✓ | ✓ | 함수 |
| `createError` | ✓ | ✓ | 함수 |
| `ConfigFormat` | ✓ | ✓ | 타입 |
| `JsonPatchOp` | ✓ | ✓ | 타입 |
| `JsonPathSegment` | ✓ | ✓ | 타입 |
| `readConfigFile` | ✓ | — | 함수 |
| `writeConfigFile` | ✓ | — | 함수 |
| `WriteConfigOptions` | ✓ | — | 타입 |
| `patchConfigFile` | ✓ | — | 함수 |
| `setConfigValue` | ✓ | — | 함수 |
| `deleteConfigValue` | ✓ | — | 함수 |
| `withFileLock` | ✓ | — | 함수 |
| `releaseAllLocalLocks` | ✓ | — | 함수 |
| `PatchConfigOptions` | ✓ | — | 타입 |
| `FileLockOptions` | ✓ | — | 타입 |
| `detectFormat` | ✓ | — | 함수 |
| `normalizeFilePath` | ✓ | — | 함수 |
| `validateOpenAPISpec` | ✓ | — | 함수 |
| `validateOpenAPIFile` | ✓ | — | 함수 |
| `OpenApiValidationError` | ✓ | — | 클래스 |
| `ValidateOpenApiOptions` | ✓ | — | 타입 |
| `OpenApiInputKind` | ✓ | — | 타입 |
| `AnyOpenAPIDocument` | ✓ | — | 타입 |