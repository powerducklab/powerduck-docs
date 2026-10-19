---
title: "OpenAPI를 코딩 에이전트에 연결하기"
description: "OpenAPI를 코딩 에이전트에 연결하기"
---

# OpenAPI를 코딩 에이전트에 연결하기

**개발자용 MCP**를 사용하면 코딩 에이전트가 계약을 살펴보고 백엔드를 검증할 수 있습니다. **API-to-MCP**는 API 작업을 호출 가능한 도구로 노출하는 별도의 워크플로입니다.

1. 데스크톱 앱에서 **열기**를 눌러 YAML/JSON 파일을 여세요. 실험하기 전에 별도의 복사본을 저장하세요.
2. 현재 명세의 **MCP 및 코딩**을 여세요. 또는 개발자용 MCP 저장소의 로컬 복사본에서 `npm ci`와 `npm run build`를 실행하세요.
3. 에이전트에 stdio MCP 서버를 설정하세요. 실행 파일은 `node`로, 인수는 `/absolute/path/dev-mcp-server/dist/cli.mjs`, `--spec`, `/absolute/path/openapi.yaml`로 지정합니다. 예시를 그대로 붙여 넣지 말고 실제 절대 경로로 바꾸세요.
4. 백엔드를 변경하기 전에 에이전트에게 작업과 응답 스키마를 읽도록 요청하세요. 변경 후에는 백엔드의 로컬 `baseUrl`을 명시하여 `run_contract_tests`를 호출하도록 요청하세요.
5. 보고된 단언문과 제안된 코드 패치를 검토하세요. 승인한 수정 사항을 적용한 뒤 테스트를 다시 실행하세요.

개발자용 MCP 서버에는 Node.js 22.12.0 이상이 필요합니다. 에이전트가 도구 결과나 코드 컨텍스트를 설정된 원격 모델에 보낼 수 있습니다. 수동 로컬 요청과 계약 테스트에는 모델이 필요하지 않습니다. 본인 키의 사용료는 해당 공급자가 청구하며, 호스팅 모델 크레딧은 별도로 계산됩니다. 로컬 작업에는 Cloud 구독이 필요하지 않습니다.

[데스크톱 앱 다운로드](https://www.powerduck.com/ko-KR/download/) · [빠른 시작](https://www.powerduck.com/docs/ko-KR/overview/quickstart/)
