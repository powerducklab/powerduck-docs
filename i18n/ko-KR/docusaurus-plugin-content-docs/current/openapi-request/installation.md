---
sidebar_position: 2
title: "설치"
description: "@powerduck/openapi-request를 설치하고 프로토콜별 하위 경로와 gRPC·MCP용 선택 패키지를 확인합니다."
---

# 설치

`@powerduck/openapi-request`는 ESM 및 CommonJS 빌드와 TypeScript 선언을 제공합니다. Node.js `>= 22.12.0`이 필요합니다.

## 설치

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

Yarn:

```bash
yarn add @powerduck/openapi-request
```

pnpm:

```bash
pnpm add @powerduck/openapi-request
```

## ESM / CommonJS

```javascript
// ESM
import { createClient } from "@powerduck/openapi-request";

// CommonJS
const { createClient } = require("@powerduck/openapi-request");
```

별도의 `@types/*` 패키지는 필요하지 않습니다.

## 패키지 구조와 하위 경로 내보내기

기본 진입점은 핵심 API를 내보냅니다. 각 프로토콜에도 전용 하위 경로가 있습니다.

| 가져오기 | 내용 |
|---|---|
| `@powerduck/openapi-request` | 핵심: `createClient`, `createDebugger`, `createManualSession`, `AdapterRegistry`, `ProtoKitError`, OpenAPI 헬퍼 및 타입. |
| `@powerduck/openapi-request/http` | `HttpAdapter`, `SseParser`, 스트리밍 감지 함수, HTTP 컬렉션·환경 빌더(`buildCollection`, `buildEnvironment`, `resolveServerUrl`). |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`, `createWsManualSession`, WebSocket 설정 및 세션 헬퍼. |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`, `GrpcAdapter`, `grpcCall`, `createGrpcManualSession`, 검색·리플렉션·디스크립터·카탈로그·인증 정보·로더·템플릿 모듈. |
| `@powerduck/openapi-request/mcp` | `McpAdapter`, `createMcpManualSession`, `createMcpStdioSession`, MCP 전송·설정·검색·생성 모듈. |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`, `resolveGraphQLConfig`, `runGraphQL`, 인트로스펙션, 작업 생성 및 변경 내용 다시 쓰기. |

프로토콜 하위 경로를 가져오면 해당 프로토콜의 타입과 헬퍼가 포함되며 관련 없는 어댑터는 다시 내보내지 않습니다.

## 기능별 선택 패키지

gRPC와 MCP는 의존성 규모가 커서 **처음 사용할 때 지연 로드**됩니다. HTTP만 사용하는 설치에는 필요하지 않습니다. 해당 프로토콜이 필요할 때만 설치하세요.

- **gRPC**는 `@grpc/grpc-js`와 `@grpc/proto-loader`가 필요합니다. 서버 리플렉션에는 `loadFileDescriptorSetFromBuffer`를 위해 `@grpc/proto-loader >= 0.7`이 필요합니다.
- **MCP**는 `@modelcontextprotocol/sdk`가 필요합니다.

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

패키지가 없으면 gRPC 로더가 정확한 설치 명령을 포함한 `GrpcDependencyMissingError`를 발생시킵니다. 설치되어 있지만 손상된 경우에는 `GrpcDependencyBrokenError`가 발생합니다.

## 확인

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

패키지를 설치하면 두 가져오기 경로가 모두 해석됩니다.

## 다음 단계

- [빠른 시작](/docs/ko-KR/openapi-request/quickstart/)
- [설정](/docs/ko-KR/openapi-request/configuration/)
