---
sidebar_position: 1
title: "@powerduck/openapi-request 소개"
description: "@powerduck/openapi-request는 OpenAPI 3.2 컬렉션 디버거이자 요청 실행 라이브러리입니다. OpenAPI 문서를 바탕으로 요청을 구성하고 전송하며, 스트리밍 응답을 식별하고 실제 응답으로부터 갱신된 문서를 생성할 수 있습니다. 간결한 인터페이스 하나로 여섯 가지 통신 프로토콜을 지원합니다."
---

# @powerduck/openapi-request 소개

`@powerduck/openapi-request`는 OpenAPI 3.2 컬렉션 디버거이자 요청 실행 라이브러리입니다. OpenAPI 문서를 바탕으로 요청을 구성하고 전송하며, 스트리밍 응답을 식별하고 실제 응답으로부터 갱신된 문서를 생성할 수 있습니다. 간결한 인터페이스 하나로 여섯 가지 통신 프로토콜을 지원합니다.

- **패키지 이름:** `@powerduck/openapi-request`
- **버전:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **라이선스:** MIT
- **모듈 형식:** 타입 선언을 포함한 ESM 및 CommonJS 빌드를 모두 제공합니다.

## 용도

이 라이브러리는 하나의 문서를 기준으로 세 가지 요구 사항을 충족합니다.

- **그래픽 UI용 클라이언트** — `createClient()`는 `prepare()`, `send()`, `connect()`, `discover()`, `writeback()` 메서드를 가진 객체를 반환합니다. 각 메서드는 그래픽 요청 편집기의 작업 단계에 대응합니다.
- **스크립트 기반 디버거** — `createDebugger()`는 자동화, 스크립트, CI에 사용할 수 있는 `send()`, `sendMany()`, `toCollection()`을 갖춘 `ProtoKit`을 반환합니다.
- **수동으로 관리하는 장기 세션** — `createManualSession()`은 열기, 전송, 닫기와 이벤트 스트림을 포함하는 양방향 세션 객체를 반환합니다. WebSocket, MCP, gRPC에서 객체 구조가 같으므로 하나의 UI로 세 프로토콜을 모두 처리할 수 있습니다.

## 프로토콜 어댑터

코어는 특정 전송 방식에 의존하지 않습니다. 프로토콜별 동작은 `AdapterRegistry`에 등록된 어댑터가 제공합니다.

- **HTTP / SSE** — 기본으로 지원합니다. 선언된 콘텐츠 유형이나 실제 응답 헤더를 바탕으로 일반 JSON 요청과 Server-Sent Events 스트림을 자동으로 식별합니다.
- **WebSocket** — 공통 이벤트 형식으로 텍스트 및 바이너리 양방향 세션을 처리합니다.
- **gRPC** — `.proto` 파일이나 서버 리플렉션을 사용해 단항, 서버 스트리밍, 클라이언트 스트리밍, 양방향 스트리밍 호출을 수행합니다.
- **MCP** — Streamable HTTP 또는 stdio를 통해 Model Context Protocol 도구를 호출합니다.
- **GraphQL** — 인트로스펙션, 작업 생성 및 실행을 지원합니다.

## 주요 기능

- **OpenAPI 3.2 컬렉션 모델** — `operationId` 또는 `method`+`path`로 작업을 찾고 매개변수, 요청 본문, 예제를 바탕으로 요청을 구성합니다.
- **스트리밍 감지** — `isStreamingOperation()`, `isSseContentType()`, `isStreamingContentType()`은 선언된 콘텐츠 유형으로 응답을 분류하며, `probeStreamingResponse()`는 실제 응답 헤더를 검사합니다.
- **응답을 문서에 반영** — `inferSchema()`, `mergeSchema()`, `toResponseObject()`, `writeBackResponse()`는 응답 스키마를 추론하고 갱신된 문서를 반환합니다. 기본적으로 반영에 성공하면 `send()`가 해당 문서를 `patchedSpec`으로 반환합니다. `writeBack: false`로 이 동작을 비활성화할 수 있습니다. 입력 문서는 변경하지 않으며 파일도 자동으로 저장하지 않습니다. 결과를 저장하기 전에 `writeBackSkippedReason`과 `writeBackWarnings`를 확인하세요.
- **스키마 도우미** — `sampleFromSchema()`는 스키마에서 예제 데이터를 생성합니다.
- **큰 의존성 지연 로딩** — gRPC(`@grpc/grpc-js`, `@grpc/proto-loader`)와 MCP(`@modelcontextprotocol/sdk`)는 처음 사용할 때 로드하므로 HTTP만 사용하는 경우에는 해당 로딩 비용이 발생하지 않습니다.

## 설치

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## 빠른 시작

```typescript
import { createClient } from "@powerduck/openapi-request";

const spec = {
  openapi: "3.2.0",
  info: { title: "Users", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User" } },
      },
    },
  },
};

const client = createClient();

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

## 다음 단계

- [설치](./installation.md) — 패키지 구조, 하위 경로 내보내기, 프로토콜 기능용 피어 의존성.
- [빠른 시작](./quickstart.md) — 첫 요청, 디버거 실행, 수동 세션.
- [설정](./configuration.md) — `CreateClientOptions`, `DebuggerOptions`, 프로토콜별 설정.
- [API 참조](./api-reference.md) — 기능별로 정리한 모든 내보내기.
- [예제](./examples.md) — HTTP, SSE, WebSocket, GraphQL, MCP, gRPC용 실행 가능한 예제.

## 라이선스

MIT.
