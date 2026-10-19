---
sidebar_position: 3
title: "빠른 시작"
description: "@powerduck/openapi-cli로 CLI와 Node.js에서 첫 배치 테스트를 실행합니다."
---

# 빠른 시작

이 가이드에서는 첫 OpenAPI 문서를 테스트하는 과정을 설명합니다.

## 사전 요구 사항

- Node.js `>= 22.12.0`.
- OpenAPI 3.2 **JSON** 문서. YAML은 허용되지 않으므로 먼저 JSON으로 변환하세요. 문서 최상위에 `paths` 객체가 있어야 합니다.

## 1. CLI에서 실행

가장 간단한 실행은 로컬 명세를 불러와 문서에 선언된 첫 서버 URL을 대상으로 모든 작업을 테스트합니다.

```bash
openapi-cli --spec openapi.json
```

대상 서버를 재정의하고 원하는 디렉터리에 보고서를 저장합니다.

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

원격 명세에서 `GET` 작업만 10개의 동시 워커로 테스트합니다.

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

설정이 복잡하면 JSON 설정 파일을 사용하세요.

```bash
openapi-cli --config openapi-cli.config.json
```

모든 플래그는 다음 문서를 참고하세요: [명령어](/docs/ko-KR/openapi-cli/commands/).

## 2. 최소 테스트 명세 작성

선언적 검증을 포함한 최소 OpenAPI 문서:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Demo API", "version": "1.0.0" },
  "servers": [{ "url": "https://httpbin.org" }],
  "paths": {
    "/get": {
      "get": {
        "operationId": "getGet",
        "responses": { "200": { "description": "ok" } },
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "response under 5s", "assert": "responseTime", "max": 5000 }
        ]
      }
    }
  }
}
```

작업에 검증이 **정의되지 않은** 경우 실행기가 암묵적인 프로토콜 성공 검사를 추가합니다. HTTP에서는 `2xx` 상태를 요구하므로 4xx/5xx 응답이 조용히 통과 처리되는 것을 방지합니다.

## 3. Node.js에서 실행(프로그래밍 API)

라이브러리는 같은 파이프라인을 함수로 제공합니다. 일반적인 흐름은 `resolveConfig` → `runTests` → 보고서 생성기입니다.

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

// 1. Build a CliConfig from CLI-style args.
const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
});

// 2. Run all collected tests.
const report = await runTests(config);

// 3. Emit the reports you need.
printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

// 4. Exit with the correct code for CI.
if (report.summary.failed > 0 || report.summary.errors > 0) {
  process.exit(1);
}
```

`resolveConfig`는 CLI와 같은 형태의 옵션을 받습니다. `runTests`는 `summary`, `results`, `config`, `generatedAt`, `version`이 포함된 `TestReport`를 반환합니다. [설정](/docs/ko-KR/openapi-cli/configuration/).

## 4. CI 종료 코드

| 코드 | 의미 |
|---|---|
| `0` | 모든 테스트가 통과했거나 `--no-fail-on-error`가 설정되었습니다. |
| `1` | 하나 이상의 테스트가 실패하거나 오류가 발생했습니다. |
| `2` | 설정 오류, 명세 로드 실패 또는 치명적인 런타임 오류입니다. |

## 다음 단계

- [설정](/docs/ko-KR/openapi-cli/configuration/) — `CliConfig`의 모든 필드와 기본값.
- [명령어](/docs/ko-KR/openapi-cli/commands/) — 모든 CLI 플래그.
- [예제](/docs/ko-KR/openapi-cli/examples/) — 인증, 필터링, 보고서, 검증.
- [API 참조](/docs/ko-KR/openapi-cli/api-reference/) — 내보내는 모든 함수와 타입.
