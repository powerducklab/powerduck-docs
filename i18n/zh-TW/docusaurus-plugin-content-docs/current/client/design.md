---
sidebar_position: 2
title: 用助手進行設計
description: "透過對話式助手設計 OpenAPI。變更以可審閱的補丁卡片呈現，帶有精細的 JSON Patch 操作；聚焦編輯會保留操作的其餘部分。"
---

# 用助手進行設計

規範形態是設計 API 的地方。它把 AI 對話與即時文件和預覽配對，因此你可以用自然語言描述意圖，同時對實際發生的變更保持完全控制。

## 核准閉環

模型不會直接編輯文件。這個閉環被刻意做得很明確：

```text
you describe an intent
        |
the model reads current state and proposes operations
        |
the host validates the proposal
        |
you review a patch card and Apply or Reject
        |
the change is merged into the document
```

這種分離是關鍵的設計決策。**模型**擅長理解意圖並提出結構；**宿主**是確定性的，校驗每個操作；**你**核准每項變更。在你確認之前，提案從不會被視為已套用。

## 補丁卡片

補丁卡片總結變更並列出確切的操作，例如新增一條路徑：

```json
{
  "type": "patch",
  "summary": "Add GET /products endpoint",
  "ops": [
    { "op": "add", "path": ["paths", "/products"], "value": { "get": {} } }
  ],
  "affects": { "paths": ["/paths/~1products"], "resources": ["Product"] }
}
```

路徑段是陣列元素，而不是 JSON Pointer 字串。新增一條全新路徑時目標為 `["paths", "/products"]`，並會自動建立父容器。

### 對已有操作的精細編輯

當你編輯一個已存在的操作時，助手**不會**重新發送整個操作，因為那樣會清除它沒有回顯的每個欄位。它改為產生只觸及你所改部分的小操作，深入操作內部：

- 新增一個查詢參數：

```json
{ "op": "add", "path": ["paths", "/products", "get", "parameters", "-"], "value": {} }
```

- 擴充回應模式：

```json
{ "op": "replace", "path": ["paths", "/products", "get", "responses", "200", "content", "application/json", "schema", "properties", "total"], "value": { "type": "integer" } }
```

- 變更單個欄位：

```json
{ "op": "replace", "path": ["paths", "/products", "get", "summary"], "value": "..." }
```

陣列用 `"-"` 標記追加，而不是整體重發。參數以 `(in, name)` 為鍵，因此已有的參數從不會重複。宿主把提議的值合併進當前操作，並保留你省略的一切。

這正是讓反覆細化變得可靠的原因：當你說「現在加一個 limit 參數」或「把 name 設為必填」時，只有那個欄位變化，操作的其餘部分保持不變。

## 讀取工具為每個提案提供依據

回答之前，模型可以呼叫只讀工具取得確切的當前狀態，而不是猜測：

- `spec.overview`——標題、版本、協定、數量、標籤、servers、安全；
- `spec.listOperations`——每個操作以 `METHOD /path` 呈現，帶摘要和標籤；
- `spec.presentOperations`——渲染一張所有操作的只讀列表卡片；
- `spec.getOperation`——單個操作的完整定義及其引用的模式；
- `spec.getSchema`——單個元件模式，包含必填欄位和描述。

每當操作的完整形態不可見時，模型應在編輯前先讀取該操作。

## 寬泛請求會分階段進行

對於「建構一個電子商務 API」這類大型請求，助手不會一次傾倒所有內容：

1. 它先就關鍵決策提出一個**釐清問題**；
2. 你回答後，它**一次提出一個聚焦補丁**，每張卡片含兩到五個操作；
3. 僅當你最近的請求仍處於該目標之內時它才繼續。

一旦範圍明確，助手還會產生一份它打算建立的介面的 `plan`，這樣你能在補丁到來之前看到工作的形態。

## 避免漂移

宿主強制執行幾條規則以保持工作對齊：

- **當前文件**是權威狀態；如果文件表明並非如此，模型不會假設某個更早的補丁已存在；
- 在聚焦模式下，只修改活動目標（以及顯式引用的元件模式）——不會對同級介面做機會性改動；
- 顯式點名另一個 `METHOD /path` 會被視為有意的任務切換；
- 已套用和已拒絕的提案會從歷史中追蹤，已存在的補丁不會重複。

如果所需細節不可見，助手會提出聚焦問題，而不是憑空捏造。

## 其他卡片

並非每個回應都是補丁：

- **問題卡片**請你在選項之間選擇；
- **校驗卡片**報告品質檢查，含通過、警告和錯誤狀態；
- **動作卡片**提供具體的下一步，例如執行場景或打開某個工作區；
- **資料表卡片**為某個介面或模式呈現具體的範例或測試資料。

相關：[請求工作區](/docs/client/debug)、[場景測試](/docs/client/scenario-testing)、[AI 與模型](/docs/client/ai-models)。
