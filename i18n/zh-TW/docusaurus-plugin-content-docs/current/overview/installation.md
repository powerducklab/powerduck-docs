---
sidebar_position: 2
title: 安裝
description: "在 macOS、Windows 或 Linux 上安裝 Powerduck 桌面用戶端。應用程式本機優先，開始使用無需帳號。"
---

# 安裝

Powerduck 桌面用戶端是一個本機優先的應用程式。它像任何其他桌面程式一樣安裝，打開磁碟上的真實檔案，開始使用無需帳號。

## 下載

從 [Powerduck 官網](https://www.powerduck.com/#download)取得對應平台的安裝檔。以下建構均由 `electron-builder` 產出：

| 平台 | 安裝檔 | 架構 |
|---|---|---|
| macOS | `.dmg`（以及用於自動更新的 `.zip`） | Apple Silicon（`arm64`）和 Intel（`x64`） |
| Windows | NSIS 安裝程式（`.exe`） | `x64` |
| Linux | AppImage（`.AppImage`） | `x64` |

## macOS

1. 打開 `.dmg`，把 Powerduck 拖入**應用程式**。
2. 首次啟動時，macOS 可能會請你確認是否要打開從 App Store 之外下載的應用程式。在對話框中允許，或右鍵點按應用程式並選擇**打開**。
3. 發布有兩個建構：面向 Apple Silicon（M 系列）的 `arm64` 建構和面向 Intel Mac 的 `x64` 建構。下載與你機器相符的那個。

## Windows

1. 執行 NSIS 安裝程式（`.exe`）並按步驟完成安裝。
2. 如果 SmartScreen 提示無法識別的發行者，選擇**更多資訊**，然後**仍要執行**。

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

這種劃分對安全和可靠性很重要：需要網路或檔案系統存取的請求由主程序處理，而不是網頁檢視，因此提示詞和 API 密鑰不會出現在瀏覽器主控台中，也不存在瀏覽器到服務商的直接 CORS 限制。參見 [AI 與模型](/docs/client/ai-models)。

## 系統需求

- 目前仍在維護的 macOS、Windows 10 或更新版本，或主流 Linux 桌面發行版；
- 有足夠磁碟容納應用程式；你打開的規範仍保留在其原始位置；
- 僅當你發送請求、同步 Git 來源或呼叫託管 AI 模型時才需要網路——其餘情況下應用程式可離線工作。

## 授權方式

你可以隨意長期試用桌面用戶端。它以一次性、**永久**授權的方式出售——一次購買，永久擁有，無需訂閱。授權碼在購買時產生並僅展示一次。Cloud 託管是另一項基於訂閱的獨立服務。兩者的區別參見 [Cloud 帳單](/docs/cloud/billing)。

下一步：進行[快速開始](/docs/overview/quickstart)。
