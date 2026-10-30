---
sidebar_position: 2
title: 설치
description: "Powerduck · Google OAuth / GitHub · Free / Pro / Max"
---

# 설치

데스크톱을 포함한 Powerduck은 Google OAuth 또는 GitHub 로그인이 필요합니다. 파일은 로컬에 저장됩니다. AI 분석은 선택한 컨텍스트를 플랫폼이 관리하는 공급자에게 전송합니다. 사용자 지정 모델 주소와 API 키는 지원하지 않습니다.

## 다운로드

[Powerduck 웹사이트](https://www.powerduck.com/#download)에서 플랫폼용 설치 프로그램을 받으세요. 다음 빌드가 `electron-builder`로 생성됩니다.

| 플랫폼 | 설치 프로그램 | 아키텍처 |
|---|---|---|
| macOS | `.dmg`(자동 업데이트용 `.zip`도) | Apple Silicon(`arm64`)과 Intel(`x64`) |
| Windows | NSIS 설치 프로그램(`.exe`) | `x64` |
| Linux | AppImage(`.AppImage`) | `x64` |

## macOS

1. `.dmg`를 열고 Powerduck을 **응용 프로그램**으로 드래그합니다.
2. 첫 실행 시 macOS가 App Store 외부에서 다운로드한 앱을 열지 확인할 수 있습니다. 열기 전에 공식 다운로드 페이지에서 받은 파일인지 확인하고 시스템 보안 검사를 끄지 마세요.
3. Apple Silicon(M 시리즈)용 `arm64` 빌드와 Intel Mac용 `x64` 빌드 두 개가 게시됩니다. 머신에 맞는 것을 다운로드하세요.

## Windows

1. NSIS 설치 프로그램(`.exe`)을 실행하고 설정 절차를 따릅니다.
2. SmartScreen이 알 수 없는 게시자 경고를 표시하면 먼저 공식 다운로드 페이지에서 받은 설치 파일인지 확인하세요. 출처를 확인한 뒤에만 계속하고 신뢰할 수 없는 다운로드의 경고를 무시하지 마세요.

## Linux

1. `.AppImage`를 다운로드합니다.
2. 실행 권한을 부여하고 실행합니다.

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```

AppImage는 시스템 전체 설치 없이 동작합니다. 일부 배포판에서는 마운트를 위해 FUSE 설치가 필요할 수 있습니다.

## 머신에서 동작하는 것

데스크톱 클라이언트는 두 부분으로 구성된 Electron 앱입니다.

- 파일 접근, 외부 HTTP 요청, 로컬 모크 서버, 데이터베이스 연결, 통합 터미널을 담당하는 **메인 프로세스**(Node.js).
- 스펙, AI 채팅, 각 도구를 렌더링하는 **렌더러**(React 워크스페이스).

데스크톱을 포함한 Powerduck은 Google OAuth 또는 GitHub 로그인이 필요합니다. 파일은 로컬에 저장됩니다. AI 분석은 선택한 컨텍스트를 플랫폼이 관리하는 공급자에게 전송합니다. 사용자 지정 모델 주소와 API 키는 지원하지 않습니다.

## 시스템 요구 사항

- macOS 11 이상, Windows 10 이상 또는 Electron 37과 호환되는 주요 Linux 데스크톱 배포판.
- 앱을 둘 충분한 디스크 공간. 여는 스펙은 원래 위치에 남습니다.
- 데스크톱을 포함한 Powerduck은 Google OAuth 또는 GitHub 로그인이 필요합니다. 파일은 로컬에 저장됩니다. AI 분석은 선택한 컨텍스트를 플랫폼이 관리하는 공급자에게 전송합니다. 사용자 지정 모델 주소와 API 키는 지원하지 않습니다.

## Powerduck · Free / Pro / Max

Free는 매일 300,000 credits를 제공하며 UTC 00:00에 초기화됩니다. Pro는 월 $39에 7일마다 18,000,000 credits, Max는 월 $99에 7일마다 60,000,000 credits를 제공합니다. 최초 구독 시작을 기준으로 초기화하며 월 결제와 별개입니다. 이월되지 않습니다. 데스크톱과 AI Chat은 개인 계정 요금제를 공유하며 영구 라이선스와 활성화 키는 판매하지 않습니다.

다음은 [빠른 시작](./quickstart.md)으로 진행하세요.
