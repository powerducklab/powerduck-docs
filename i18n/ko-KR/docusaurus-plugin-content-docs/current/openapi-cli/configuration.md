---
sidebar_position: 6
title: "설정"
description: "설정 우선순위는 CLI 인수 > 설정 파일 > 기본값입니다. 해석 결과는 resolveConfig가 반환하는 CliConfig 객체입니다."
---

# 설정

설정 우선순위는 **CLI 인수 > 설정 파일 > 기본값**입니다. 해석 결과는 [`resolveConfig`](./api-reference.md#resolveconfig)가 반환하는 `CliConfig` 객체입니다.

## CliConfig

핵심 설정 타입입니다. `specPath`를 제외한 모든 필드는 선택 사항입니다.

| 필드 | 타입 | 기본값 | 설명 |
|-------|------|---------|-------------|
| `specPath` | `string` | **필수** | OpenAPI 3.2 JSON 명세의 경로 또는 `http(s)://` URL |
| `serverUrl` | `string` | *(명세에서 가져옴)* | 명세의 서버 기본 URL 덮어쓰기 |
| `outputDir` | `string` | `"./openapi-cli-report"` | 보고서 파일을 저장할 디렉터리 |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | 생성할 보고서 형식 |
| `filter` | `FilterConfig` | `undefined` | 테스트할 작업 필터링 |
| `concurrency` | `number` | `5` | 최대 동시 요청 수. 1~100 사이 정수 |
| `timeout` | `number` | `30000` | 요청별 제한 시간(ms). 1~600000 사이 정수. 원격 명세를 가져올 때도 적용 |
| `proxy` | `string` | `undefined` | HTTP(S) 프록시 URL. 예: `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | TLS 및 인증서 설정 |
| `headers` | `Record<string, string>` | `undefined` | 각 요청에 추가로 보내는 헤더 |
| `auth` | `AuthConfig` | `undefined` | 인증 설정 |
| `variables` | `Record<string, string>` | `undefined` | 주입할 Postman `{{name}}` 변수 |
| `failOnError` | `boolean` | `true` | CLI 전용: 테스트 실패 후 0이 아닌 코드 반환. 라이브러리 호출자는 보고서를 검사해야 함 |
| `envFile` | `string` | `undefined` | 줄마다 `KEY=VALUE` 쌍이 있는 `.env` 파일 경로 |
| `grpcReflection` | `boolean` | 자동 | gRPC: 명시적 설정, 작업 확장 순으로 우선 적용. 둘 다 없으면 proto 경로가 없을 때 활성화 |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC: `.proto` 파일 또는 디렉터리 경로 |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP: MCP 작업의 전송 방식 |
| `mcpCommand` | `string` | `undefined` | MCP stdio: 시작할 명령 |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio: 명령 인수 |
| `mcpCwd` | `string` | `undefined` | MCP stdio: 작업 디렉터리 |

`ReportFormat`은 유니언 타입 `"json" | "cli" | "html"`입니다.

## 고급 런타임 옵션

다음 필드도 `CliConfig`에 속합니다. `requester`, `maxEvents`, `maxStreamMs`, `maxResponseSize`는 JSON 설정 파일에 지정할 수 있습니다. `signal`, `httpRuntime`, `resolveTransport`는 JSON 설정이 아닌 런타임 객체이므로 설정을 해석한 뒤 코드에서 `runTests()`에 직접 전달하세요.

```typescript
interface AdvancedRuntimeOptions {
  requester?: {
    followRedirects?: boolean;
    maxRedirects?: number;
    disableCookies?: boolean;
    protocolVersion?: "http1" | "http2" | "auto";
  };
  maxEvents?: number;
  maxStreamMs?: number;
  maxResponseSize?: number;
  signal?: AbortSignal;
  httpRuntime?: { certificates?: unknown; fileResolver?: unknown };
  resolveTransport?: (target: { protocol: string; url?: string }) => Promise<
    Pick<CliConfig, "proxy" | "tls" | "httpRuntime">
  >;
}
```

`requester`는 HTTP 리디렉션, 쿠키, 프로토콜 선택을 제어합니다. HTTP/SSE에서는 `maxEvents`의 기본값이 50이며 `maxStreamMs`가 없으면 `timeout`을 사용합니다. `maxResponseSize`는 요청 런타임으로 전달됩니다. gRPC는 스트림 기한으로 `maxStreamMs`, 그다음 `timeout`, 마지막으로 30000ms를 사용합니다. `signal`은 실행을 취소하고, `httpRuntime`은 HTTP 인증서와 파일 처리를 제공하며, `resolveTransport`는 대상별 전송 설정을 해석합니다.

## DEFAULT_CONFIG

라이브러리가 내보내는 내장 기본 설정 객체입니다.

```ts
export const DEFAULT_CONFIG: Required<
  Pick<
    CliConfig,
    "outputDir" | "formats" | "concurrency" | "timeout" | "failOnError" | "grpcReflection" | "mcpTransport"
  >
> = {
  outputDir: "./openapi-cli-report",
  formats: ["json", "cli", "html"],
  concurrency: 5,
  timeout: 30000,
  failOnError: true,
  grpcReflection: true,
  mcpTransport: "streamable-http",
};
```

## FilterConfig

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `methods` | `string[]` | 지정한 HTTP 메서드만 테스트. 예: `["get","post"]`. 설정 파일에는 소문자를 사용하며 CLI 입력은 정규화됨 |
| `paths` | `string[]` | 정규 표현식 중 하나와 일치하는 경로만 테스트. 표현식이 잘못되면 부분 문자열 비교로 대체 |
| `tags` | `string[]` | 지정한 태그 중 하나가 있는 작업만 테스트 |
| `operationIds` | `string[]` | 지정한 `operationId`와 정확히 일치하는 작업만 테스트 |

키가 없는 필터는 `undefined`로 해석되어 모든 작업을 실행합니다.

## TlsConfig

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `caCert` | `string` | CA 인증서 묶음(PEM) 경로 |
| `clientCert` | `string` | mTLS용 클라이언트 인증서(PEM) 경로 |
| `clientKey` | `string` | mTLS용 클라이언트 개인 키(PEM) 경로 |
| `strictSSL` | `boolean` | `false`이면 TLS 인증서 검증을 건너뜀. 안전하지 않음 |
| `pfx` | `string` | PFX 인증서 묶음 경로. gRPC는 PEM이 필요함 |
| `passphrase` | `string` | 암호화된 인증서 자료의 암호문구 |

> 참고: CLI 옵션 `--insecure`는 `tls.strictSSL = false`에 해당하며 검증을 **비활성화**합니다.

## AuthConfig

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | 인증 방식. 지원 이름은 아래 참조 |
| `parameters` | `Record<string, string \| number \| boolean>` | 요청 런타임에 전달할 인증 방식별 매개변수 |
| `token` | `string` | `type: "bearer"`용 Bearer 토큰 |
| `username` | `string` | `type: "basic"`용 사용자 이름 |
| `password` | `string` | `type: "basic"`용 비밀번호 |
| `key` | `string` | `type: "apikey"`용 API 키 이름 |
| `value` | `string` | `type: "apikey"`용 API 키 값 |
| `in` | `"header" \| "query"` | API 키를 넣을 위치 |

지원하는 `type` 값은 `bearer`, `basic`, `apikey`, `none`, `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap`, `edgegrid`입니다. 사용 가능 여부와 필수 매개변수는 프로토콜 및 요청 런타임에 따라 다릅니다. 이름만 지정해서는 인증 설정이 완료되지 않습니다.

현재 CLI의 `--bearer` 옵션은 `{ type: "bearer", token }`만 생성합니다. 더 자세한 `basic` / `apikey` 설정은 설정 파일에서 제공할 수 있습니다.

## JSON 설정 파일

설정 파일은 `Partial<CliConfig>`에 맞는 일반 JSON입니다. `--config <path>` / `-c`로 전달합니다. CLI 인수가 항상 파일 값보다 우선합니다.

```json
{
  "specPath": "./openapi.json",
  "serverUrl": "https://api.staging.example.com",
  "outputDir": "./reports",
  "formats": ["json", "html"],
  "concurrency": 10,
  "timeout": 15000,
  "failOnError": true,
  "proxy": "http://proxy.corp:8080",
  "tls": {
    "strictSSL": true,
    "caCert": "./ca-bundle.pem",
    "clientCert": "./client.crt",
    "clientKey": "./client.key"
  },
  "headers": {
    "X-API-Key": "${API_KEY}",
    "X-Environment": "staging"
  },
  "auth": {
    "type": "bearer",
    "token": "${BEARER_TOKEN}"
  },
  "variables": {
    "host": "api.staging.example.com"
  },
  "filter": {
    "methods": ["get", "post"],
    "tags": ["v2", "public"],
    "paths": ["^/api/v2"],
    "operationIds": ["getUser", "createUser"]
  },
  "grpcReflection": true,
  "grpcProtoPaths": ["./proto"],
  "mcpTransport": "streamable-http",
  "mcpCommand": "npx",
  "mcpArgs": ["-y", "@modelcontextprotocol/server-everything"],
  "mcpCwd": "./mcp-servers"
}
```

파일이 없으면 `Config file not found: <path>`, JSON이 잘못되면 `Invalid config file (must be JSON)` 오류를 던집니다.

## 환경 변수 확장

`--env` / `envFile`로 `.env` 파일을 로드한 후 다음 문자열 필드에서 `${VAR_NAME}` 참조를 확장합니다.

- `serverUrl`
- `proxy`
- `headers` 값
- `auth.token`
- `variables` 값

예제:

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

`.env` 동작: 기존 `process.env` 항목은 **덮어쓰지 않습니다**. 값을 둘러싼 작은따옴표나 큰따옴표는 제거하고, 빈 줄과 `#` 주석 줄은 무시합니다. 파일이 없으면 알림 없이 건너뜁니다.

## 코드에서 설정 구성

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

명세를 제공하지 않으면 `resolveConfig`는 `"No OpenAPI spec path provided..."`를 던지고, `proxy`가 유효한 URL이 아니면 `Invalid proxy URL: <url>`를 던집니다.
