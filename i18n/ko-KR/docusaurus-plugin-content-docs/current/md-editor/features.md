---
sidebar_position: 5
title: "기능"
description: "이 페이지는 실제 구현을 기준으로 각 내장 기능을 설명합니다."
---

# 기능

이 페이지는 실제 구현을 기준으로 각 내장 기능을 설명합니다.

## 증분 렌더링

미리보기는 블록 단위 증분 렌더링으로 큰 문서에서도 빠르게 반응합니다.

- **블록 분할**(`splitIntoBlocks`): ATX 제목 줄(`#`에서 `######`)을 기준으로 소스를 나눕니다. 백틱이나 물결표 코드 펜스 안의 내용은 분할 지점으로 사용하지 않으며, `:::` 사용자 정의 컨테이너 안의 제목도 보존합니다. 제목이 없는 문서는 하나의 블록으로 처리합니다.
- **블록별 렌더링:** 콘텐츠 해시가 바뀐 블록만 markdown-it / KaTeX로 다시 처리합니다. 나머지는 초기화된 마인드맵 SVG를 포함한 기존 DOM 노드를 직접 재사용합니다.
- **콘텐츠 해시 캐시:** 빠른 djb2 방식 해시와 길이를 조합하여 결과를 저장합니다. 실행 취소, 다시 실행, 동일한 단락 붙여넣기도 캐시를 활용합니다. 800개 항목을 넘으면 현재 문서에 없는 해시를 제거합니다. 현재 블록의 항목은 유지하므로 서로 다른 블록이 800개를 넘는 문서는 이 기준을 초과할 수 있습니다.
- **순서 변경:** 기존 노드를 `DocumentFragment`에 추가하여 브라우저가 직접 이동하도록 합니다.
- **적응형 디바운스**(`adaptiveDebounceMs(docLength, base = 120, max = 600)`): 대기 시간은 `base + floor(docLength / 20000) * 60`이며 최대 `max`입니다. `renderDebounce`로 바꾸거나 `renderDebounce: false`로 동기 렌더링을 사용합니다.
- **`content-visibility: auto`:** 각 블록을 `.md-editor-block` 요소로 감싸 화면 밖 블록의 레이아웃과 그리기를 생략할 수 있게 합니다.

한 블록의 렌더링이 실패해도 전체 미리보기가 비워지지는 않습니다. 해당 블록의 소스를 이스케이프하여 `<pre>`로 표시합니다.

## KaTeX 수식

독립적인 markdown-it 수식 플러그인은 KaTeX를 사용하며 `markdown-it-texmath`에 의존하지 않습니다.

- **인라인 수식:** `$E=mc^2$`. 내용은 비어 있거나 `$`, 줄바꿈을 포함할 수 없습니다. `$5`, `$10.50` 같은 금액은 휴리스틱 규칙으로 제외합니다.
- **블록 수식:**
  ```markdown
  $$
  \int_0^1 x^2 \, dx
  $$
  ```
  한 줄(`$$ ... $$`)과 여러 줄 형식을 모두 지원합니다. KaTeX CSS는 패키지에 포함됩니다. `math: false`로 끌 수 있습니다.

## Markmap 마인드맵

```` ```mindmap ```` 코드 블록 안에 Markdown 개요를 작성합니다.

````markdown
```mindmap
# Root topic
## Branch one
- Child A
- Child B
## Branch two
- Child C
```
````

블록 규칙은 펜스의 중첩 깊이를 추적해 마인드맵 안의 코드 펜스를 보존합니다. 동기 렌더링은 자리표시자 `<div>`를 만들고, `Renderer.hydrate(container)`는 `markmap-lib`와 `markmap-view`를 비동기로 가져와 대화형 SVG로 변환합니다. 초기화 실패는 치명적 오류가 아닙니다. `mindmap: false`로 끌 수 있습니다.

## 코드 강조와 복사 버튼

코드 블록은 highlight.js로 강조합니다. 배포본에는 JavaScript, TypeScript, Python, JSON, Bash/Shell, CSS, XML/HTML/SVG, SQL, YAML, Markdown, Go, Rust, Java, C, C++와 `js`, `ts`, `py`, `sh`, `yml`, `md`, `rs`, `c++` 같은 별칭이 등록됩니다. 알 수 없는 언어는 자동 감지하며, 실패하면 이스케이프한 일반 텍스트를 표시합니다.

각 블록은 세 가지 색 점, 언어 레이블, **복사** 버튼이 있는 macOS 스타일 컨테이너로 감쌉니다. 복사는 미리보기 패널의 이벤트 위임을 사용하고, Clipboard API가 없으면 `document.execCommand('copy')`로 대체합니다. `codeHighlight: false`로 끌 수 있습니다.

## 도구 모음 작업 {#toolbar-actions}

`complex` 모드에서는 다음 22개 작업을 아래 순서로 제공합니다.

| # | 작업 이름 | 용도 |
|---|-------------|---------------|
| 1 | `heading` | 제목 |
| 2 | `bold` | 굵게(Ctrl+B) |
| 3 | `italic` | 기울임꼴(Ctrl+I) |
| 4 | `link` | 링크(Ctrl+K) |
| 5 | `image` | 이미지 삽입 |
| 6 | `video` | 동영상 삽입 |
| 7 | `youtube` | YouTube 동영상 삽입 |
| 8 | `quote` | 인용 |
| 9 | `ul` | 글머리 기호 목록 |
| 10 | `ol` | 번호 목록 |
| 11 | `tasklist` | 작업 목록 |
| 12 | `mention` | 멘션(@) |
| 13 | `doclink` | 문서 링크 삽입 |
| 14 | `code` | 코드 블록 |
| 15 | `table` | 표 |
| 16 | `math` | 수식 |
| 17 | `mindmap` | 마인드맵 삽입 |
| 18 | `hr` | 가로 구분선 |
| 19 | `tips` | 알림 삽입 |
| 20 | `preview` | 미리보기 전환 |
| 21 | `help` | 키보드 단축키 |
| 22 | `theme` | 테마 전환 |

내장 레이블은 영어입니다. 항목별 `label`을 재정의하여 도구 설명과 접근성 이름을 번역할 수 있습니다. 이미지, 동영상, YouTube, 표, 수식 템플릿, 마인드맵 템플릿, 알림 유형, 도움말 작업은 대화상자나 선택기를 엽니다. `toolbar` 설정은 [설정](./configuration.md#toolbarconfig)을 참고하세요.

## 키보드 단축키

내장 단축키는 `DEFAULT_SHORTCUTS`에 정의됩니다. `Mod`는 Windows/Linux에서 Ctrl, macOS에서 Cmd에 해당합니다.

| 키 | 작업 | 설명 |
|-----|--------|-------------|
| `Mod-b` | `bold` | 굵게 |
| `Mod-i` | `italic` | 기울임꼴 |
| `Mod-Alt-1` | `heading` | 제목 |
| `Mod-k` | `link` | 링크 삽입 |
| `Mod-Alt-c` | `code` | 코드 블록 |
| `Mod-Shift-.` | `quote` | 인용 블록 |
| `Mod-Shift-8` | `ul` | 글머리 기호 목록 |
| `Mod-Shift-7` | `ol` | 번호 목록 |
| `Mod-Shift-9` | `tasklist` | 작업 목록 |
| `Mod-Alt-m` | `math` | 수식 |
| `Mod-Alt-p` | `preview` | 미리보기 전환 |
| `Mod-Shift-l` | `theme` | 테마 전환 |

**도움말** 버튼은 단축키를 키 모양으로 표시하고 작업 목록, 멘션, 문서 링크, 수식, 마인드맵, 알림 문법의 빠른 참고를 제공하는 대화상자를 엽니다.

## 이미지 업로드

`onImageUpload: (file: File) => Promise<string>`를 지정합니다. 이미지 파일을 편집기에 붙여넣거나 드롭하면 호출됩니다. 이미지 대화상자는 URL을 받으며 파일 선택 기능은 없습니다. 공개 이미지 URL을 반환하면 편집기는 확장자를 뺀 파일 이름을 대체 텍스트로 사용해 커서에 `![alt](url)`을 삽입합니다. 업로드 실패는 오류 표시 없이 처리되며 사용자는 다시 시도할 수 있습니다.

## @멘션

`mention` 옵션으로 `@` 입력 시 검색 가능한 드롭다운을 설정합니다.

- `onMentionSearch(query)`는 일치하는 `MentionItem`을 반환합니다.
- `onMentionSelect(item)`은 삽입할 텍스트를 반환합니다. 기본값은 `[@label](mention:id)`이며 미리보기에서 배지로 표시합니다.
- `minChars`(기본값 `0`)와 `maxItems`(기본값 `8`)로 드롭다운을 조정합니다.

드롭다운은 위/아래 화살표, Enter/Tab, Escape를 지원하며 편집기가 포커스를 잃으면 닫힙니다. 미리보기에서 `@media` 같은 일반 `@` 텍스트는 배지가 되지 않고 `mention:` 스킴의 링크만 변환됩니다. 편집기에서는 이런 텍스트도 설정된 검색 훅을 호출할 수 있습니다.

## 문서 링크

`docLink` 옵션으로 트리거 문자(기본값 `/`) 뒤에 문서 검색 드롭다운을 활성화합니다.

- `onDocSearch(query)`는 일치하는 `DocItem`을 반환합니다.
- `onFetchDocMeta(url)`는 제목, 썸네일, 설명을 가져옵니다. 내장 구현은 `fetch`와 `DOMParser`로 Open Graph 태그를 읽으며, 다른 출처의 서버가 CORS를 허용하지 않으면 실패할 수 있습니다. 필요하면 사용자 정의 백엔드 프록시를 사용하세요.
- `insertStyle`은 삽입 형식을 제어합니다. `'auto'`는 메타데이터가 있으면 카드를 사용하며, `'card'` 또는 `'link'`도 선택할 수 있습니다.

선택한 문서는 일반 링크 또는 제목, 썸네일, 설명, 호스트 이름을 표시하는 클릭 가능한 `:::doc-link` 카드로 삽입됩니다.

## 알림 블록

`:::` 컨테이너에 여섯 가지 유형 중 하나를 지정합니다. 시작 줄의 유형 뒤에 제목을 추가할 수 있습니다.

```markdown
:::notice
This is a notice.
:::

:::warning Title here
Warning content.
:::
```

지원 유형은 `notice`, `info`, `tip`, `success`, `warning`, `danger`입니다. 아이콘, 색상이 있는 왼쪽 테두리, 헤더를 표시합니다. 도구 모음의 알림 버튼은 여섯 유형을 고르는 시각적 선택기를 엽니다. `tips: false`로 끌 수 있습니다.

## 작업 목록

`- [ ]` 또는 `- [x]`와 일치하는 항목은 비활성 체크박스로 표시되며 대괄호 안의 공백은 허용됩니다. 이 프로젝트의 규칙에 유의하세요. **`- [ ]`는 녹색으로 선택됨, `- [x]`는 선택되지 않음으로 표시**되어 GitHub Flavored Markdown과 반대입니다. 도구 모음의 작업 목록 버튼은 현재 줄이나 선택한 줄의 표시를 전환합니다.

## 다음 단계

- [설정](./configuration.md) — 옵션으로 기능을 조정합니다.
- [API 레퍼런스](./api-reference.md) — 코드에서 편집기를 제어합니다.
