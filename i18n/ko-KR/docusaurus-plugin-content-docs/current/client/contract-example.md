---
title: "계약 테스트로 구현 오류 찾기"
description: "계약 테스트로 구현 오류 찾기"
---

# 계약 테스트로 구현 오류 찾기

이 예제는 개발자 MCP 실행기를 사용하며 응답 스키마 검증은 0.7.6부터 지원됩니다. Node.js 22.12.0 이상이 필요합니다. 가상 데이터와 루프백 인터페이스에서만 실행되는 백엔드를 사용하므로 의존성을 설치한 뒤에는 계정, 모델 또는 공개 API가 필요하지 않습니다.

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

응답은 `{"total":"42"}`이지만 스키마는 숫자를 요구합니다. 실제 검증기는 `/total must be number`를 출력하고 종료 코드 1로 종료합니다.

```sh
node examples/contract-total/verify.mjs --correct
```

이제 백엔드는 `{"total":42}`를 반환합니다. 동일한 검사가 통과하며 종료 코드 0으로 종료합니다. 직접 구현을 고치려면 `examples/contract-total/server.mjs`의 `total` 표현식이 숫자를 반환하도록 수정하세요. 오류를 숨기려고 계약을 느슨하게 만들지 마세요.

각 실행은 사용 가능한 로컬 포트를 할당하고 작업이 끝나면 서버를 종료합니다. 소스 파일과 명령은 [예제 프로젝트](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total)에 있습니다. 현재 스키마 검사는 JSON 응답을 대상으로 하며 형식 검증이나 원격 스키마 가져오기는 수행하지 않습니다. 지원하지 않는 콘텐츠 유형에 스키마 검증이 필요하면 검사를 조용히 통과시키지 않고 제한 사항을 보고합니다.

이 테스트는 실제 백엔드를 검증합니다. Mock 요청이 성공했다는 것은 예제 워크플로가 작동한다는 의미일 뿐입니다. 필요하면 코딩 에이전트가 명시적인 `baseUrl`과 함께 `run_contract_tests`를 사용하여 같은 검증을 실행할 수 있습니다. 패치를 적용하기 전에 검토하세요.

[데스크톱 앱 다운로드](https://www.powerduck.com/ko-KR/download/) · [빠른 시작](https://www.powerduck.com/docs/ko-KR/overview/quickstart/)
