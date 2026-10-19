---
title: "從現有程式碼產生 OpenAPI"
description: "從現有程式碼產生 OpenAPI"
---

# 從現有程式碼產生 OpenAPI

在桌面應用程式中選擇**掃描程式碼並產生 OpenAPI**（Beta），選取本機原始碼資料夾，再按**開始掃描**。建議先從小型服務開始。採用產生的規格前，請檢查偵測到的路由、參數與回應。

若處理函式依賴動態程式碼或無法取得的相依套件，靜態掃描可能無法判定回應的結構描述。「手動確認」只會記錄您的檢查，不會還原缺失的型別。請根據證據編輯 API 契約，或視需要請 AI 檢查選取的處理函式。此 AI 操作會將選取的原始碼與相關內容傳送給設定的模型供應商。

請將結果儲存為新檔案。檢查變更前，不要取代現有契約。接著，對執行中的後端執行[契約範例](/docs/zh-TW/client/contract-example/)，或連接[程式開發代理](/docs/zh-TW/client/coding-agent/)。掃描成功不代表實作符合契約。

此流程僅適用於桌面應用程式；掃描器支援的語言與框架各有不同。靜態掃描不需要模型金鑰。請將未解決的結果視為未知，不要當成已推定的事實。

[下載桌面應用程式](https://www.powerduck.com/zh-TW/download/) · [快速入門](https://www.powerduck.com/docs/zh-TW/overview/quickstart/)
