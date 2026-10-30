---
sidebar_position: 2
title: 安裝
description: "Powerduck · Google OAuth / GitHub · Free / Pro / Max"
---

# 安裝

Powerduck 桌面端與瀏覽器工作區均須先使用 Google OAuth 或 GitHub 登入。本機檔案仍保存在磁碟。AI 分析會將選定內容傳送給平台管理的模型供應商；不再支援自訂模型網址或 API Key。

## 下載

從 [Powerduck 官網](https://www.powerduck.com/#download)取得對應平台的安裝檔。以下建構均由 `electron-builder` 產出：

| 平台 | 安裝檔 | 架構 |
|---|---|---|
| macOS | `.dmg`（以及用於自動更新的 `.zip`） | Apple Silicon（`arm64`）和 Intel（`x64`） |
| Windows | NSIS 安裝程式（`.exe`） | `x64` |
| Linux | AppImage（`.AppImage`） | `x64` |

## macOS

1. 打開 `.dmg`，把 Powerduck 拖入**應用程式**。
2. 首次啟動時，macOS 可能要求確認開啟從 App Store 以外下載的應用程式。開啟前請確認安裝程式來自官方下載頁面；不要關閉系統安全檢查。
3. 發布有兩個建構：面向 Apple Silicon（M 系列）的 `arm64` 建構和面向 Intel Mac 的 `x64` 建構。下載與你機器相符的那個。

## Windows

1. 執行 NSIS 安裝程式（`.exe`）並按步驟完成安裝。
2. 若 SmartScreen 顯示無法識別的發行者，請先確認安裝程式來自官方下載頁面。核實來源後再繼續；不要為不可信的下載略過警告。

## Linux

1. 下載 `.AppImage`。
2. 賦予可執行權限並執行：

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```

AppImage 無需系統級安裝即可執行。在某些發行版上，你可能需要安裝 FUSE 才能掛載它。

## 你的機器上執行了什麼

桌面用戶端是一個 Electron 應用程式，分為兩部分：

- 一個**主程序**（Node.js），負責檔案存取、對外 HTTP 請求、本機 Mock 伺服器、資料庫連線和整合式終端機；
- 一個**渲染程序**（React 工作區），負責渲染規範、AI 對話和每個工具。

Powerduck 桌面端與瀏覽器工作區均須先使用 Google OAuth 或 GitHub 登入。本機檔案仍保存在磁碟。AI 分析會將選定內容傳送給平台管理的模型供應商；不再支援自訂模型網址或 API Key。

## 系統需求

- macOS 11 或更新版本、Windows 10 或更新版本，或相容 Electron 37 的主流 Linux 桌面發行版；
- 有足夠磁碟容納應用程式；你打開的規範仍保留在其原始位置；
- Powerduck 桌面端與瀏覽器工作區均須先使用 Google OAuth 或 GitHub 登入。本機檔案仍保存在磁碟。AI 分析會將選定內容傳送給平台管理的模型供應商；不再支援自訂模型網址或 API Key。

## Powerduck · Free / Pro / Max

Free 每日提供 300,000 credits，UTC 00:00 重設。Pro 為 $39/月，每 7 日 18,000,000 credits；Max 為 $99/月，每 7 日 60,000,000 credits。額度從首次訂閱時間起每 7 日重設，與每月計費分開；未用額度不累計。桌面端與 AI Chat 共用個人帳戶方案，不再出售軟體授權或啟用碼。

下一步：進行[快速開始](./quickstart.md)。
