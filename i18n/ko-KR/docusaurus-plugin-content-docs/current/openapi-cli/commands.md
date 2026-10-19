---
sidebar_position: 5
title: "CLI 명령"
description: "이 패키지는 실행 명령 openapi-cli 하나만 제공합니다. 옵션을 직접 나열하며 run / validate / init 하위 명령은 없습니다."
---

# CLI 명령

이 패키지는 실행 명령 `openapi-cli` 하나만 제공합니다. 옵션을 직접 나열하며 `run` / `validate` / `init` 하위 명령은 **없습니다**.

```
openapi-cli [options]
```

## 구문

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

명세는 **필수**입니다. `--spec`(또는 `-s`)을 전달하거나 `--config`로 로드하는 JSON 설정 파일에 `specPath`를 지정하세요. 나머지 옵션은 선택 사항입니다.

## 기본 옵션

| 옵션 | 짧은 옵션 | 기본값 | 설명 |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | OpenAPI 3.2 JSON 명세의 경로 또는 `http(s)://` URL |
| `--server <url>` | `-S` | *(명세에서 가져옴)* | 명세의 서버 URL 덮어쓰기 |
| `--output <dir>` | `-o` | `./openapi-cli-report` | 보고서 출력 디렉터리 |
| `--format <formats>` | `-f` | `json,cli,html` | 쉼표로 구분한 보고서 형식: `json`, `cli`, `html` |
| `--config <path>` | `-c` | — | JSON 설정 파일 경로. CLI 인수가 우선함 |

## 실행 옵션

| 옵션 | 짧은 옵션 | 기본값 | 설명 |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | 최대 동시 요청 수. 1~100 사이 정수 |
| `--timeout <ms>` | `-t` | `30000` | 요청별 제한 시간(ms). 1~600000 사이 정수. 원격 명세를 가져올 때도 사용 |
| `--no-fail-on-error` | — | 꺼짐 | 실행이 완료되면 테스트가 실패해도 `0` 반환. 설정 오류와 치명적 오류는 여전히 실패로 처리 |

## 필터 옵션

| 옵션 | 기본값 | 설명 |
|--------|---------|-------------|
| `--method <methods>` | — | 포함할 HTTP 메서드를 쉼표로 구분. 예: `get,post` |
| `--path <patterns>` | — | 각 경로와 비교할 정규 표현식을 쉼표로 구분 |
| `--tag <tags>` | — | 포함할 OpenAPI 태그를 쉼표로 구분 |
| `--operation-id <ids>` | — | 포함할 `operationId` 값을 쉼표로 구분 |

## 네트워크 및 TLS 옵션

| 옵션 | 짧은 옵션 | 기본값 | 설명 |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | HTTP(S) 프록시 URL. 예: `http://proxy.corp:8080` |
| `--ca <path>` | — | — | CA 인증서 묶음(PEM) |
| `--cert <path>` | — | — | mTLS용 클라이언트 인증서(PEM) |
| `--key <path>` | — | — | mTLS용 클라이언트 개인 키(PEM) |
| `--insecure` | `-k` | 꺼짐 | TLS 인증서 검증 건너뛰기 |

## 인증, 헤더 및 변수

| 옵션 | 짧은 옵션 | 설명 |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | `Key: Value` 형식의 추가 헤더. 반복 지정 가능 |
| `--bearer <token>` | — | `Authorization` 헤더로 전송할 Bearer 토큰 |
| `--variable <vars...>` | `-v` | `KEY=VALUE` 형식의 Postman 변수. 반복 지정 가능 |
| `--env <path>` | — | `.env` 파일 경로. 기존 환경 변수는 덮어쓰지 않음 |

## gRPC 옵션

| 옵션 | 기본값 | 설명 |
|--------|---------|-------------|
| `--grpc-no-reflection` | 꺼짐 | gRPC 서버 리플렉션을 비활성화하고 proto 파일 사용 |
| `--grpc-proto <paths...>` | — | `.proto` 파일 또는 해당 파일을 포함한 디렉터리 경로 |

## MCP 옵션

| 옵션 | 기본값 | 설명 |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | MCP 전송 방식: `streamable-http` 또는 `stdio` |
| `--mcp-command <command>` | — | MCP stdio 명령. 예: `npx` |
| `--mcp-args <args>` | — | 공백 또는 쉼표로 구분한 MCP stdio 인수 |
| `--mcp-cwd <dir>` | — | MCP stdio 하위 프로세스의 작업 디렉터리 |

## 정보 옵션

| 옵션 | 짧은 옵션 | 설명 |
|--------|-------|-------------|
| `--help` | `-h` | 도움말 표시 |
| `--version` | `-V` | 버전 표시 |

## 종료 코드

| 코드 | 의미 |
|------|---------|
| `0` | 모든 테스트 통과 또는 `--no-fail-on-error` 설정 |
| `1` | 하나 이상의 테스트 실패 또는 오류, 혹은 CLI 인수 파싱 실패 |
| `2` | 설정 오류, 명세 로드 실패 또는 치명적인 런타임 오류 |

`--spec`도 설정된 `specPath`도 없는 경우처럼 `resolveConfig`가 예외를 던지면 CLI는 빨간색으로 `Error:`를 출력하고 `2`로 종료합니다. `runTests`가 예외를 던지면 `Fatal error:`를 출력하고 `2`로 종료합니다. 실행이 완료된 뒤에는 `report.summary.failed > 0 || report.summary.errors > 0`이면서 `failOnError !== false`일 때만 `1`을 반환합니다.

## 환경 변수

전용 `OPENAPI_CLI_*` 변수는 없습니다. 옵션, 설정 파일과 다음 방식으로 설정을 제공합니다.

- **`.env` 파일** — `--env .env`를 전달하면 `KEY=VALUE` 쌍을 `process.env`로 로드합니다. 기존 변수는 덮어쓰지 않습니다.
- **`${VAR}` 확장** — 로드 후 `serverUrl`, `proxy`, `headers` 값, `auth.token`, `variables` 값의 `${VAR_NAME}`을 치환합니다.

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## 실행 예제

```bash
# Test a local spec against its first server URL
openapi-cli --spec openapi.json

# Override the server and write JSON + HTML reports
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --format json,html --output ./reports

# Only GET requests, 10 workers, with a bearer token
openapi-cli --spec openapi.json --method get --concurrency 10 --bearer "$TOKEN"

# Use a config file
openapi-cli --config openapi-cli.config.json
```
