---
sidebar_position: 6
title: "A2A 智能體"
description: "在本機 OpenAPI 規範中設計、除錯和記錄 A2A，支援 JSON-RPC、REST、桌面版 gRPC 與 JWS 驗證。"
---

# A2A 智能體

MCP 提供工具與資源，A2A 用於智能體之間委派工作、交換訊息、追蹤任務與產物。Powerduck 將兩者作為獨立協議保存在同一份本機規範中。

## 建立與除錯

1. 選擇 **新增請求 → A2A**，預設為 **1.0 / JSON-RPC**。1.0 另支援 REST 與桌面版 gRPC；0.3 僅支援 JSON-RPC，不會自動轉換版本。
2. 填寫端點並選擇方法。點擊 **產生請求主體**，確認預覽後選擇 **取代請求主體**。取消或僅切換方法會保留草稿。
3. JSON-RPC 在主體中編輯 `params`；REST/gRPC 直接編輯請求物件，不使用 `jsonrpc`、`id`、`params` 外層封裝。在驗證與標頭頁設定憑證，傳送時設定 `A2A-Version`。
4. 檢查完整回應：HTTP 200 仍可能包含 RPC `error`。1.0 的 JSON-RPC `result` 包含 `task` 或 `message`。
5. 儲存至規範後，`x-a2a` 保留版本、端點、方法、範例與契約。JSON-RPC 使用主體中的方法，REST/gRPC 使用選取的方法。請求 ID 和訊息 ID 不同；延續對話時保留服務端回傳的上下文與任務識別碼。

## 傳輸綁定

REST 端點是基礎掛載網址，例如 `https://agent.example/rest`。方法決定 HTTP 動詞與路徑，任務 ID 會編碼，篩選和分頁轉成查詢參數。除錯與文件範例共用此對應。

gRPC 僅限桌面版。使用 `https://host:port` 搭配系統憑證信任，或以 `http://localhost:port` 進行本機明文測試，不可附帶路徑。標頭轉為 metadata，使用官方 `lf.a2a.v1.A2AService` 與 ProtoJSON。此綁定不支援 HTTP 腳本、代理與自訂 TLS，設定不相容時會拒絕執行。

## Agent Card 與 JWS

從 `/.well-known/agent-card.json` **取得公開 Agent Card**。先確認技能、版本、驗證與能力，再明確選擇使用其中的介面；取得卡片不會自動改端點或轉送憑證。公開探索不帶憑證、不跟隨重新導向，限制 1 MiB；瀏覽器需要 CORS。

展開 **驗證 JWS 簽章**，貼上從可信管道取得的公開 JWKS。本機驗證只涵蓋 A2A 1.0 標準欄位，不涵蓋自訂欄位，也不會存取卡片指定的金鑰 URL。正規化遵循 A2A 欄位存在性與 RFC 8785，保留必要空字串、空陣列和明確存在的可選布林值。不合規的簽章會被拒絕。有效簽章不等於未知金鑰的組織身分可信。

儲存卡片只保留快照，不保留信任判定；分享或託管前移除私密中繼資料。受保護的卡片請使用已驗證的 extended-card 方法。

## 任務與串流

1.0 使用 `SendStreamingMessage`、`SubscribeToTask`；0.3 使用 `message/stream`、`tasks/resubscribe`。可檢查 SSE 或原生 gRPC 事件、狀態與產物。**停止**只中斷本機連線；取消遠端任務需以任務 ID 呼叫 `CancelTask` 或 `tasks/cancel`。終止的任務不能直接重新啟動。

任務查詢、1.0 任務清單、擴充卡片與推播設定均依服務端能力決定是否可用。Powerduck 不託管推播接收器。

## OpenAPI 擴充

`x-a2a` 是 Powerduck 擴充，不是標準 Agent Card 或 OpenAPI 關鍵字。文件路徑識別操作，`endpoint` 才是實際端點。

```yaml
openapi: 3.2.0
info:
  title: A2A demo
  version: 1.0.0
paths:
  /agents/research/send:
    post:
      summary: SendMessage
      x-protocol: a2a
      x-a2a:
        version: '1.0'
        binding: JSONRPC
        endpoint: https://agent.example.com/rpc
        agentCardUrl: https://agent.example.com/.well-known/agent-card.json
        method: SendMessage
        requestSchema:
          type: object
          description: A2A SendMessage
        responseSchema:
          type: object
          description: JSON-RPC
        example:
          jsonrpc: '2.0'
          id: request-1
          method: SendMessage
          params:
            message:
              messageId: message-1
              role: ROLE_USER
              parts:
                - text: 12 30
      responses:
        '200':
          description: A2A result / error
          content:
            application/json:
              schema:
                type: object
```

`version` 為 `1.0` 或 `0.3`；`binding` 為 `JSONRPC`，1.0 另支援 `HTTP+JSON`、`GRPC`。`agentCardUrl` 為探索網址，`agentCard` 是可選快照；`example` 是完整 JSON-RPC 封裝或 REST/gRPC 物件。`requestSchema`、`responseSchema` 明確描述契約，不能把單次回應當成完整契約。SSE 使用 `text/event-stream` 和 OAS 3.2 `itemSchema`。文件與 Copy for LLM 保留擴充欄位；gRPC 顯示 ProtoJSON，HTTP 綁定顯示對應程式碼。

## 產生伺服器

展開 **產生伺服器 → 下載伺服器專案**，取得 Node.js 22+ 專案。執行 `npm install`，設定至少 32 個隨機字元的 `A2A_TOKEN` 與 `HANDLER_URL`，再執行 `npm start`。HTTP 處理器接收 `{message, contextId}`，回傳包含非空 `parts` 的 Message。匯出不含現有憑證。

服務有負載大小限制、60 秒處理期限、並行上限和關閉清理，可用 `SIGNING_JWK_FILE` 簽署卡片、`CORS_ORIGINS` 指定瀏覽器來源。這是無狀態轉接服務，不含持久任務與推播引擎。公開部署前設定公開網址、TLS、反向代理限流與適合多使用者的身分驗證。

## 可執行的本機範例

React 倉庫的 `examples/a2a-demo` 提供求和服務，不需 AI 金鑰或外部服務。

```bash
cd powerduck-react/examples/a2a-demo
npm ci
npm start
```

```bash
npm test
```

匯入 `openapi.json` 可建立三種綁定。使用 Bearer Token `powerduck-local-demo-token-0123456789`，傳送 `[12,30]` 應得到 `Sum: 42` 與 `total: 42`。JSON-RPC：`http://127.0.0.1:9999/rpc`；REST：`http://127.0.0.1:9999/rest`；gRPC：`http://127.0.0.1:9998`。卡片位於 `http://127.0.0.1:9999/.well-known/agent-card.json`。貼上本機 `.runtime/trusted-jwks.json` 進行驗證，重啟後需重新取得金鑰。

`npm test` 使用獨立連接埠驗證三種傳輸、SSE、結構化回應、防竄改、驗證與 CORS。Demo 僅限本機，沒有持久任務或推播，不能使用演示 token 公開部署。瀏覽器預設允許 `http://localhost:3000` 與 `http://127.0.0.1:3000`，其他來源以 `CORS_ORIGINS` 設定。

[A2A 1.0](https://a2a-protocol.org/v1.0.0/specification/) · [A2A 0.3](https://a2a-protocol.org/v0.3.0/specification/)
