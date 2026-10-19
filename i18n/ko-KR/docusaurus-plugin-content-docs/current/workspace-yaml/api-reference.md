---
sidebar_position: 4
title: "API 참조"
description: "코어 계층과 파일 계층의 함수, 옵션 및 오류 코드."
---

# API 참조

## 코어 계층 (`@powerduck/workspace-yaml/core`)

| 함수 | 설명 |
|----------|-------------|
| `createWorkspaceYaml(options?)` | workspace.yaml 콘텐츠 문자열 생성 |
| `createOpenApiYaml(options)` | OpenAPI 3.2 YAML 콘텐츠 문자열 생성 |
| `createWorkspaceWithApi(options)` | 작업 공간과 OpenAPI 콘텐츠를 함께 생성 |
| `parseWorkspaceYaml(content)` | workspace.yaml 문자열 파싱 및 검증 |

### `createOpenApiYaml(options)` — 옵션

| 옵션 | 타입 | 필수 | 설명 |
|--------|------|----------|-------------|
| `title` | `string` | 예 | API 제목 |
| `version` | `string` | 아니요 | 기본값 `"1.0.0"` |
| `description` | `string` | 아니요 | API 설명 |
| `contact` | `{ name?, url?, email? }` | 아니요 | 연락처 정보 |
| `license` | `{ name, url? }` | 아니요 | 라이선스 정보 |
| `servers` | `Array<{ url, description? }>` | 아니요 | 서버 목록 |

## 파일 계층 (`@powerduck/workspace-yaml`)

| 함수 | 설명 |
|----------|-------------|
| `initializeWorkspace(options)` | 디스크에 workspace.yaml 파일 생성 |
| `initializeOpenApi(options)` | 디스크에 OpenAPI YAML 파일 생성 |
| `createWorkspaceApi(options)` | 두 파일을 원자적으로 생성(실패 시 롤백) |

### `createWorkspaceApi(options)` — 옵션

| 옵션 | 타입 | 필수 | 설명 |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | 예 | 대상 디렉터리 |
| `oasId` | `string` | 예 | 고유 API 식별자 |
| `name` | `string` | 예 | 표시 이름 |
| `file` | `string` | 아니요 | 상대 경로(기본값: `oasFiles/${oasId}.openapi.yaml`) |
| `title` | `string` | 아니요 | API 제목(기본값은 `name`) |
| `version` | `string` | 아니요 | API 버전(기본값: `"1.0.0"`) |
| `overwriteOpenApi` | `boolean` | 아니요 | 기본값 `false` |

## 오류

모든 오류는 기계가 읽을 수 있는 `code`를 포함하는 `WorkspaceYamlError` 인스턴스입니다:

| 코드 | 설명 |
|------|-------------|
| `INVALID_ARGUMENT` | 잘못된 입력 매개변수 |
| `ALREADY_EXISTS` | 파일이 이미 존재함(덮어쓰기 옵션이 false) |
| `NOT_FOUND` | 파일을 찾을 수 없음 |
| `IO_ERROR` | 파일 시스템 작업 실패 |
| `INVALID_WORKSPACE` | 잘못된 작업 공간 설정 |
| `INVALID_OPENAPI` | 잘못된 OpenAPI 문서 |
| `ROLLBACK_FAILED` | 트랜잭션 롤백 실패 |
