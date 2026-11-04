---
sidebar_position: 2
title: "설치 및 시작"
description: "Powerduck은 AI가 만든 변경과 주변 코드를 읽고 처리할 문제를 판단하도록 돕습니다. 데스크톱 홈에서 API 작업 공간과 코드 검토를 각각 열 수 있습니다."
---

# 설치 및 시작

공식 사이트에서 macOS Apple Silicon/Intel, Windows 또는 Linux AppImage를 받으세요. 출처와 게시자를 확인하고 보안을 끄지 마세요. 사이트 로그인 후 앱으로 돌아와 API나 코드 프로젝트를 선택합니다. 브라우저는 API 체험용이며 파일 분석과 로컬 명령은 데스크톱이 필요합니다.

[Powerduck](https://www.powerduck.com/download.html)

## 내장 AI와 사용 범위

Google 또는 GitHub로 로그인하며 내장 모델만 제공합니다. 모델 선택, 개인 키와 사용자 지정 엔드포인트는 없습니다. 요청한 AI 작업에 선택된 문맥이 관리 제공자로 전송됩니다. 일반 의존성, 빌드, 자격 증명 경로를 제외해도 소스의 비밀 정보를 보장해 제거하지는 못합니다.

## 요금제와 작업 횟수

새 요금제의 대화/검토 횟수: Free 10/2, Starter 월 $19 300/20, Pro 월 $39 700/60, Max 월 $99 2,000/180. Free는 UTC 월초, 유료는 구독 청구 기간에 초기화하며 이월하지 않습니다. 최종 금액과 세금은 결제 화면을 확인하세요.

- [API 작업 공간](../client/introduction.md)
- [코드 검토](../client/code-quality.md)
- [내장 AI와 사용 범위](../client/ai-models.md)
- [요금제와 작업 횟수](../cloud/billing.md)
- [설치 및 시작](installation.md)
- [모든 변경 이해하기](quickstart.md)

## macOS · Windows · Linux

macOS 11+ · Windows 10+ · Linux · Electron 37

- macOS: `.dmg` · `arm64` / `x64`
- Windows: NSIS `.exe` · SmartScreen
- Linux: `.AppImage` · `x64`

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```
