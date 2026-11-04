---
sidebar_position: 2
title: "安裝與開始使用"
description: "AI 產生程式碼越來越快，Powerduck 協助你看清變更、結合上下文審閱，並決定哪些問題需要處理。桌面版提供 API 工作台與程式碼審閱，可從首頁分別進入。"
---

# 安裝與開始使用

從官網下載對應系統的 macOS Apple Silicon／Intel、Windows 或 Linux AppImage。確認來源與發布者，不關閉安全保護。到官網登入後返回應用，匯入介面定義或選擇程式碼專案。瀏覽器 App 可體驗 API 工作流；檔案系統分析與本機命令需桌面版。

[Powerduck](https://www.powerduck.com/download.html)

## 內建 AI 與使用範圍

以 Google 或 GitHub 登入，僅使用內建模型，不提供模型選擇、自備金鑰或自訂端點。要求 AI 工作時才傳送選取的上下文至託管服務。掃描排除常見依賴、建置與憑證路徑，但不能保證原始碼不含機密。

## 方案與任務次數

新方案分別統計 AI 對話與程式碼審閱，不按上游 token 扣費。Free：10／2 次；Starter 每月 $19：300／20 次；Pro 每月 $39：700／60 次；Max 每月 $99：2,000／180 次。Free 在 UTC 每月月初重置，付費次數依訂閱帳期，未用次數不結轉。最終價格及稅費以結帳為準。

- [API 工作台](../client/introduction.md)
- [程式碼審閱](../client/code-quality.md)
- [內建 AI 與使用範圍](../client/ai-models.md)
- [方案與任務次數](../cloud/billing.md)
- [安裝與開始使用](installation.md)
- [看清每一次變更](quickstart.md)

## macOS · Windows · Linux

macOS 11+ · Windows 10+ · Linux · Electron 37

- macOS: `.dmg` · `arm64` / `x64`
- Windows: NSIS `.exe` · SmartScreen
- Linux: `.AppImage` · `x64`

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```
