---
sidebar_position: 5
title: "예제"
description: "자동 업그레이드 건너뛰기, React 없이 코어 사용하기, 테마 사용자 정의 및 렌더링 성능 제한을 살펴봅니다."
---

# 예제

## 이미 유효한 OAS 3.2 문서가 있나요?

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## 코어만 사용하기(React 불필요)

사용자 정의 UI나 Node.js에서는 코어 진입점을 사용하세요.

```typescript
import { loadOasDocument } from "@powerduck/oas-document";

const result = await loadOasDocument(spec, { autoUpgrade: true });

if (result.error) {
  console.error("Failed:", result.error);
} else {
  console.log("Operations:", result.operations.length);
  console.log("Tree nodes:", result.tree.length);
}
```

## 스타일 사용자 정의

루트 요소에는 `data-theme="light"` 또는 `data-theme="dark"`가 설정됩니다. 모든 색상은 `.pde-oas-root` 아래의 CSS 변수를 통해 결정됩니다.

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## 성능 참고 사항

- 코드 예제는 뷰포트에서 600px 이내로 들어올 때까지 로딩을 지연합니다(IntersectionObserver)
- 구문 강조에는 LRU 캐시를 사용합니다(64개 항목 / 1MB)
- 스크롤 위치 추적에는 패시브 이벤트 리스너와 rAF 기반 스로틀링을 사용합니다
- 예제 생성은 중첩 6단계와 노드 1,000개로 제한됩니다
