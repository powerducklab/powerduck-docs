---
sidebar_position: 6
title: "A2A 에이전트"
description: "로컬 OpenAPI에서 A2A를 설계하고 디버깅하며 문서화합니다. JSON-RPC, REST, 데스크톱 gRPC, JWS 검증 및 실행 가능한 데모를 지원합니다."
---

# A2A 에이전트

MCP는 도구와 리소스를 제공하고, A2A는 에이전트 간 작업 위임, 메시지, 작업 상태 및 산출물을 다룹니다. Powerduck은 두 프로토콜을 구분하여 같은 로컬 명세에 저장합니다.

## 생성 및 디버깅

1. **새 요청 → A2A**를 선택합니다. 기본값은 **1.0 / JSON-RPC**입니다. 1.0은 REST와 데스크톱 gRPC도 지원하며, 0.3은 JSON-RPC만 지원합니다. 버전을 자동 변환하지 않습니다.
2. 엔드포인트와 메서드를 선택하고 **요청 본문 생성**으로 미리 본 후 **요청 본문 교체**를 눌러 적용합니다. 취소하거나 메서드만 변경하면 초안이 유지됩니다.
3. JSON-RPC에서는 `params`를, REST/gRPC에서는 요청 객체를 직접 편집합니다. REST/gRPC에 `jsonrpc`, `id`, `params` 외부 봉투를 넣지 않습니다. 인증과 헤더를 설정하면 전송 시 `A2A-Version`이 추가됩니다.
4. HTTP 200에도 RPC `error`가 있을 수 있습니다. 1.0 JSON-RPC 성공 응답은 `result`에 `task` 또는 `message`를 포함합니다.
5. 명세에 저장하면 `x-a2a`가 버전, 엔드포인트, 메서드, 예제와 계약을 보존합니다. JSON-RPC는 본문의 메서드, REST/gRPC는 선택한 메서드를 사용합니다. 요청 ID와 메시지 ID는 다릅니다. 대화를 이어가려면 서버가 반환한 컨텍스트 및 작업 ID를 유지하세요.

## 전송 바인딩

REST URL은 `https://agent.example/rest` 같은 기본 경로입니다. 메서드가 HTTP 동사와 경로를 결정하며 작업 ID는 인코딩되고 필터와 페이지 정보는 쿼리로 변환됩니다. 디버깅과 문서는 같은 매핑을 사용합니다.

gRPC는 데스크톱 전용입니다. 시스템 인증서 신뢰를 사용하는 TLS는 `https://host:port`, 로컬 평문 테스트는 `http://localhost:port`를 사용하며 경로를 붙이지 않습니다. 헤더는 metadata로 전달되며 공식 `lf.a2a.v1.A2AService`와 ProtoJSON을 사용합니다. HTTP 스크립트, 프록시 및 사용자 정의 TLS 설정은 이 바인딩에서 거부됩니다.

## Agent Card 및 JWS

일반적으로 `/.well-known/agent-card.json`에서 **공개 Agent Card 가져오기**를 실행합니다. 기능, 기술, 버전과 인증을 확인한 다음 인터페이스를 명시적으로 적용하세요. 카드를 가져오는 것만으로 URL을 변경하거나 다른 출처로 자격 증명을 보내지 않습니다. 공개 검색은 인증 정보와 리디렉션을 사용하지 않으며 1 MiB로 제한됩니다. 브라우저에서는 CORS가 필요합니다.

**JWS 서명 검증**을 펼치고 신뢰할 수 있는 경로로 받은 공개 JWKS를 붙여 넣습니다. 검증은 로컬에서 수행하며 카드의 키 URL에 접근하지 않습니다. A2A 1.0 표준 필드만 검증하며 사용자 정의 필드는 제외합니다. A2A 필드 존재 규칙과 RFC 8785에 따라 필수 빈 문자열·배열 및 명시된 선택적 불리언을 보존합니다. 이를 제거한 서명은 거부됩니다. 유효한 서명만으로 알 수 없는 키의 소유 조직을 신뢰할 수는 없습니다.

카드를 저장해도 신뢰 판단은 저장되지 않습니다. 공유 전에 비공개 메타데이터를 제거하세요. 보호된 카드는 인증된 extended-card 메서드로 가져옵니다.

## 작업 및 스트리밍

1.0은 `SendStreamingMessage`와 `SubscribeToTask`, 0.3은 `message/stream`과 `tasks/resubscribe`를 사용합니다. SSE 또는 네이티브 gRPC 이벤트, 상태 및 산출물을 검사할 수 있습니다. **중지**는 로컬 연결만 끊습니다. 원격 취소는 작업 ID로 `CancelTask` 또는 `tasks/cancel`을 호출해야 합니다. 종료된 작업은 그대로 다시 시작할 수 없습니다.

작업 조회, 1.0 목록, 확장 카드 및 푸시 설정은 에이전트가 제공하는 기능에 따라 지원됩니다. Powerduck은 푸시 수신 서버를 호스팅하지 않습니다.

## OpenAPI 확장

`x-a2a`는 Powerduck 확장이며 표준 Agent Card나 OpenAPI 키워드가 아닙니다. 명세의 경로는 작업 식별자이고 실제 주소는 `endpoint`입니다.

```yaml
openapi: 3.2.0
info:
  title: A2A demo
  version: 1.0.0
paths:
  /agents/research/send:
    post:
      summary: SendMessage
      x-protocol: a2a
      x-a2a:
        version: '1.0'
        binding: JSONRPC
        endpoint: https://agent.example.com/rpc
        agentCardUrl: https://agent.example.com/.well-known/agent-card.json
        method: SendMessage
        requestSchema:
          type: object
          description: A2A SendMessage
        responseSchema:
          type: object
          description: JSON-RPC
        example:
          jsonrpc: '2.0'
          id: request-1
          method: SendMessage
          params:
            message:
              messageId: message-1
              role: ROLE_USER
              parts:
                - text: 12 30
      responses:
        '200':
          description: A2A result / error
          content:
            application/json:
              schema:
                type: object
```

`version`은 `1.0` 또는 `0.3`, `binding`은 `JSONRPC`이며 1.0에는 `HTTP+JSON`과 `GRPC`도 있습니다. `agentCardUrl`은 검색 주소, `agentCard`는 선택적 스냅샷입니다. `example`은 JSON-RPC 봉투 또는 REST/gRPC 요청 객체입니다. `requestSchema`와 `responseSchema`는 명시적 계약이며 단일 응답으로 전체 계약을 추정하지 않습니다. SSE는 `text/event-stream`과 OAS 3.2 `itemSchema`를 사용합니다. 문서와 Copy for LLM은 설정을 유지하며 gRPC는 ProtoJSON을, HTTP 바인딩은 코드 예제를 표시합니다.

## 서버 생성

**서버 생성 → 서버 프로젝트 다운로드**에서 Node.js 22+ 프로젝트를 받습니다. `npm install` 후 최소 32자의 임의 `A2A_TOKEN`과 `HANDLER_URL`을 설정하고 `npm start`를 실행합니다. HTTP 핸들러는 `{message, contextId}`를 받아 비어 있지 않은 `parts`가 포함된 Message를 반환합니다. 기존 자격 증명은 내보내지 않습니다.

페이로드 제한, 60초 처리 기한, 동시 실행 제한 및 종료 정리를 제공합니다. `SIGNING_JWK_FILE`로 서명하고 `CORS_ORIGINS`로 브라우저 출처를 허용할 수 있습니다. 상태를 저장하지 않는 어댑터로 영구 작업이나 푸시 엔진을 포함하지 않습니다. 공개 배포 전 URL, TLS, 프록시 속도 제한 및 다중 사용자 인증을 구성하세요.

## 실행 가능한 로컬 데모

React 저장소의 `examples/a2a-demo`는 숫자를 더하는 서비스입니다. AI 키나 외부 서비스가 필요하지 않습니다.

```bash
cd powerduck-react/examples/a2a-demo
npm ci
npm start
```

```bash
npm test
```

`openapi.json`을 가져오고 Bearer Token `powerduck-local-demo-token-0123456789`를 설정합니다. `[12,30]`을 보내면 `Sum: 42`와 구조화된 `total: 42`를 반환합니다. JSON-RPC는 `http://127.0.0.1:9999/rpc`, REST는 `http://127.0.0.1:9999/rest`, gRPC는 `http://127.0.0.1:9998`입니다. 카드는 `http://127.0.0.1:9999/.well-known/agent-card.json`에 있습니다. 로컬 `.runtime/trusted-jwks.json`으로 검증하고 재시작 후 새 키를 읽으세요.

`npm test`는 별도 포트에서 세 전송 방식, SSE, 구조화 응답, 변조 거부, 인증 및 CORS를 검증합니다. 데모는 로컬 전용이며 영구 작업과 푸시를 구현하지 않습니다. 데모 token으로 공개 배포하지 마세요. 브라우저 기본 출처는 `http://localhost:3000`과 `http://127.0.0.1:3000`이며 다른 출처는 `CORS_ORIGINS`로 설정합니다.

[A2A 1.0](https://a2a-protocol.org/v1.0.0/specification/) · [A2A 0.3](https://a2a-protocol.org/v0.3.0/specification/)
