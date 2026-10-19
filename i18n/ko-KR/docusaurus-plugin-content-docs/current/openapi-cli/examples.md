---
sidebar_position: 5
title: "예제"
description: "실제로 지원되는 CLI 옵션과 프로그래밍 API를 사용하는 @powerduck/openapi-cli 실용 예제입니다."
---

# 예제

실제로 지원되는 CLI 옵션과 프로그래밍 API를 사용하는 `@powerduck/openapi-cli` 실용 예제입니다.

## 1. 기본 CLI 테스트

로컬 OpenAPI 문서를 지정해 모든 작업을 실행합니다.

```bash
openapi-cli --spec openapi.json
```

서버를 덮어쓰고 보고서를 사용자 지정 디렉터리에 저장합니다.

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

원격 URL에 호스팅된 명세를 테스트합니다.

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. 인증을 사용한 코드 실행

Bearer 토큰, 사용자 지정 헤더, 동시 실행 수를 설정해 라이브러리 API를 사용합니다.

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  timeout: 15000,
  bearer: process.env.BEARER_TOKEN,
  header: ["X-Environment: staging", "X-Team: platform"],
});

const report = await runTests(config);

printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

console.log(
  `Passed ${report.summary.passed}/${report.summary.total} (${report.summary.passRate}%)`,
);
```

## 3. 테스트 대상 필터링

메서드, 태그, 경로 정규 표현식 또는 operationId로 일부 작업만 실행합니다.

```bash
# Only GET and POST requests
openapi-cli --spec openapi.json --method get,post

# Only operations tagged "public" or "v2"
openapi-cli --spec openapi.json --tag public,v2

# Only paths under /api/v2
openapi-cli --spec openapi.json --path "^/api/v2"

# Only specific operations
openapi-cli --spec openapi.json --operation-id getUser,createUser
```

이 필터들을 조합한 코드 설정입니다. 서로 다른 필터 범주는 AND로 결합하고, 같은 범주의 태그는 OR로 비교합니다.

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. JSON 및 HTML 보고서 생성

`--format`으로 출력 형식을 선택합니다. 기본적으로 세 가지 형식을 모두 출력합니다.

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

동일한 기능을 코드로 구현한 예제:

```typescript
import { resolveConfig, runTests, generateJsonReport, generateHtmlReport } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  format: "json,html",
  output: "./reports",
});

const report = await runTests(config);

const jsonPath = generateJsonReport(report, config.outputDir);
const htmlPath = generateHtmlReport(report, config.outputDir);

console.log("Wrote", jsonPath, "and", htmlPath);
```

`generateJsonReport`는 `report.json`을, `generateHtmlReport`는 `report.html`을 작성합니다. 두 함수 모두 출력 디렉터리가 없으면 생성하고 파일 경로를 반환합니다.

## 5. 명세의 선언형 어설션

작업에 `x-tests` 배열을 추가합니다. 각 항목에는 `name`과 `assert` 유형이 필요합니다.

```json
{
  "paths": {
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "content-type is JSON", "assert": "header", "key": "content-type", "contains": "application/json" },
          { "name": "user id exists", "assert": "jsonPath", "path": "$.id", "exists": true },
          { "name": "user is active", "assert": "jsonPath", "path": "$.status", "equals": "active" },
          { "name": "response under 2s", "assert": "responseTime", "max": 2000 },
          { "name": "body contains email", "assert": "bodyContains", "contains": "@" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

어설션 유형:

| `assert` | 필수 필드 | 용도 |
|----------|-----------------|---------|
| `status` | `value` | HTTP 상태가 `value`와 같음 |
| `header` | `key`; `contains`는 선택 사항 | 헤더 존재 여부를 확인하고 선택적으로 부분 문자열 포함 여부도 검사 |
| `bodyContains` | `contains` | 응답 본문이 부분 문자열을 포함함 |
| `bodyEquals` | `body` | 응답 본문이 `body`와 정확히 같음 |
| `jsonPath` | `path`; `equals` / `exists`는 선택 사항 | JSONPath를 해석한 뒤 값을 비교하거나 존재 여부를 확인 |
| `responseTime` | `max` | 소요 시간이 `<= max` ms여야 함 |

## 6. Postman 스크립트

`x-postman-scripts`로 Postman 스타일 테스트 스크립트를 삽입합니다.

```json
{
  "paths": {
    "/users": {
      "get": {
        "operationId": "listUsers",
        "x-postman-scripts": {
          "test": "pm.test('status is 200', () => pm.response.to.have.status(200)); pm.test('users is an array', () => pm.expect(pm.response.json().users).to.be.an('array'));"
        },
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

선언형 `x-tests`와 `x-postman-scripts`를 같은 작업에 함께 사용할 수 있습니다.

## 7. CI 통합(GitHub Actions)

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Run API tests
        run: npx @powerduck/openapi-cli --spec openapi.json --server "$API_URL" --bearer "$BEARER_TOKEN" --output ./reports
        env:
          API_URL: ${{ secrets.API_URL }}
          BEARER_TOKEN: ${{ secrets.BEARER_TOKEN }}
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: openapi-cli-reports
          path: ./reports
```

기본적으로 테스트 실패 시 종료 코드 `1`, 설정 오류나 치명적 런타임 오류 시 `2`를 반환해 CI 작업이 실패합니다. 완료된 테스트 실행으로 파이프라인이 실패하지 않게 하려면 `--no-fail-on-error`를 사용하세요. 이 옵션은 설정 오류나 치명적 오류를 무시하지 않습니다.
