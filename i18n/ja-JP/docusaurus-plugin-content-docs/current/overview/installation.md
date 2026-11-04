---
sidebar_position: 2
title: "インストールと開始"
description: "Powerduck は、AI が大量のコードを生成する中で、変更内容と周辺コードを確認し、対応すべき問題を判断するためのデスクトップアプリです。ホームから API ワークスペースとコードレビューを個別に開けます。"
---

# インストールと開始

公式サイトから macOS Apple Silicon／Intel、Windows、Linux AppImage を取得し、配布元を確認してください。安全機能を無効化せず、サイトでログインしてアプリへ戻ります。ホームから API 定義またはコードを選びます。ブラウザー App は API 操作の体験用で、ローカル解析とコマンドにはデスクトップが必要です。

[Powerduck](https://www.powerduck.com/download.html)

## 内蔵 AI と利用範囲

Google／GitHub でログインし、内蔵モデルを利用します。モデル選択、独自キーやエンドポイントはありません。AI 要求時に選択した文脈を管理されたプロバイダーへ送信します。一般的な依存・ビルド・認証情報パスを除外しても、ソース内の秘密情報を完全には検出できません。

## プランとタスク回数

新プランは対話／レビューを別々に計数します。Free 10／2 回、Starter $19／月 300／20 回、Pro $39／月 700／60 回、Max $99／月 2,000／180 回。Free は UTC 月初、 有料は購読期間でリセットし繰り越しません。税金を含む最終額は決済画面で確認します。

- [API ワークスペース](../client/introduction.md)
- [コードレビュー](../client/code-quality.md)
- [内蔵 AI と利用範囲](../client/ai-models.md)
- [プランとタスク回数](../cloud/billing.md)
- [インストールと開始](installation.md)
- [変更を理解する](quickstart.md)

## macOS · Windows · Linux

macOS 11+ · Windows 10+ · Linux · Electron 37

- macOS: `.dmg` · `arm64` / `x64`
- Windows: NSIS `.exe` · SmartScreen
- Linux: `.AppImage` · `x64`

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```
