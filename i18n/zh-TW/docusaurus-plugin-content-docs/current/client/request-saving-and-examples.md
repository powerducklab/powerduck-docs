---
title: "儲存請求與協定範例"
description: "Powerduck 將本機除錯請求與對外發布的介面契約分開管理。"
---

# 儲存請求與協定範例

Powerduck 將本機除錯請求與對外發布的介面契約分開管理。

| 操作 | 結果 |
| --- | --- |
| URL 列儲存 | 儲存此請求的本機除錯設定，不修改 OpenAPI 文件。 |
| 快速請求：儲存至規格 | 將操作加入選定的文件與資料夾。 |
| 規格請求：更新規格 | 更新契約前顯示目標方法、路徑與定義預覽。 |
| 文件儲存 / Cmd+S 或 Ctrl+S | 將目前的 OpenAPI 文件寫入磁碟。在快速請求分頁中，此快捷鍵會儲存該快速請求。 |

本機請求包含所選伺服器、URL、方法、參數值、本文、指令碼與傳輸設定。編輯期間，規格請求草稿保留在記憶體中；點選 URL 列儲存後，以 `powerduck.debug.v1:` 為前綴持久儲存於應用程式的渲染程序儲存空間。項目依文件 ID、路徑與方法區隔。清除瀏覽器或桌面應用程式資料會清除這些本機狀態；匯出的 OAS 檔案不包含它們。此儲存空間**不是加密機密保管庫**：請求 URL、標頭或本文中的憑證應使用環境參照，而非直接填入明文。驗證控制項透過獨立的憑證持久儲存途徑保存。

`x-powerduck-request` **不是官方契約擴充**。「儲存至規格」與「更新規格」不會輸出它，也不應使用它描述方法、參數、請求本文或回應。僅開啟文件不會改寫其他操作中已存在的此擴充。

## 明確更新定義

「更新規格」會預覽目標方法與路徑，並保留現有回應與結構描述。參數定義須主動勾選才會更新；不會複製除錯參數值。JSON 本文也只有在明確選取後才會加入為範例。常見憑證欄位會被排除，但**發布前仍須檢查任意文字及範例**。指令碼與驗證覆寫值不是契約欄位。

變更方法或路徑不能覆寫已存在的目標操作。本機操作參照會隨之調整。`PURGE` 等自訂方法儲存於 `paths./cache.additionalOperations.PURGE`，需要 OpenAPI 3.2。預覽會說明此要求，套用更新時將文件版本設為 3.2.0。也應確認下游工具是否支援此版本。

仍可透過「編輯文件」修改協定結構描述。這是明確的定義變更；傳送或儲存除錯請求不會默默改寫協定結構描述。

## 官方可下載範例

這些是持續維護的**範例定義**，不是 Powerduck 公開 API 服務。所有端點都指向您自行提供的本機服務。匯入檔案不會啟動服務、自動連線或授予憑證。

- [所有協定](https://www.powerduck.com/docs/examples/protocols/all-protocols.yaml)
- [HTTP 與自訂 PURGE](https://www.powerduck.com/docs/examples/protocols/http.yaml)
- [SSE](https://www.powerduck.com/docs/examples/protocols/sse.yaml)
- [WebSocket](https://www.powerduck.com/docs/examples/protocols/websocket.yaml)
- [GraphQL](https://www.powerduck.com/docs/examples/protocols/graphql.yaml)
- [gRPC](https://www.powerduck.com/docs/examples/protocols/grpc.yaml) 與 [echo.proto](https://www.powerduck.com/docs/examples/protocols/echo.proto)
- [MCP Streamable HTTP](https://www.powerduck.com/docs/examples/protocols/mcp.yaml)
- [A2A 1.0 JSON-RPC](https://www.powerduck.com/docs/examples/protocols/a2a.yaml)

使用 gRPC 時，將 `echo.proto` 下載到 YAML 檔案旁，必要時在用戶端選取其實際本機路徑。伺服器須在 50051 連接埠實作 `powerduck.examples.Echo/Echo`。其他範例同樣需要對應的伺服器；這些檔案不是即時後端驗證的示範。

## 契約擴充參考

每個操作都有一般 OAS 方法、operationId、summary 與 responses。非 HTTP 繫結使用 OAS 操作作為文件定位點；gRPC 範例中的 `post` 不代表將 gRPC 轉成 REST 端點。

| 擴充 | 意義與範例使用的欄位 |
| --- | --- |
| `x-protocol` | `sse`、`websocket`、`graphql`、`grpc`、`mcp` 或 `a2a`。HTTP 可省略。 |
| `x-session` | 宣告長時間存續的協定工作階段；範例用於 WebSocket 與 MCP。 |
| `x-websocket` | `url`、選用的 `subprotocols`、`headers` 與 `messages`。每則已記錄的訊息包含 `id`、`name`、`type`、`body`、`requestSchema`、`responseSchema`。標頭中不要保存憑證。 |
| `x-graphql` | `endpoint`、`query`、`operationName`、`variablesSchema`、可公開的 `variables`、`responseSchema`。 |
| `x-grpc` | `address`、`service`、`method`、`kind`、`reflection`、`protoPaths`、`includeDirs` 與文件中的 `messages`。`kind` 支援 unary/server_streaming/client_streaming/bidi_streaming。本機 proto 路徑依部署環境而定。 |
| `x-mcp` | `transport`、`endpoint`、`method`，以及對應方法的 `name`、`argumentsSchema`、可公開的 `arguments`、`responseSchema`。資源操作使用 `uri`；不要混用無關方法的欄位。 |
| `x-a2a` | 明確的 `version`、`binding`、`endpoint`、`method`、`requestSchema`、`responseSchema` 與可公開的 `example`。0.3 與 1.0 的承載資料不同，請參閱 [A2A](./a2a.md)。 |
| `x-response-stream` | 選用的 GraphQL 串流意圖宣告，在實際伺服器與傳輸支援串流時使用。一般 GraphQL 請求不需要。 |

SSE 使用標準的 `responses.200.content.text/event-stream.itemSchema` 描述每個事件的承載資料。HTTP 使用標準參數、requestBody、responses 與安全方案。不要自行新增 `x-sse` 設定區塊，也不要將除錯狀態儲存為契約擴充。

範例提供所選繫結的完整可用設定，而非所有互斥選項。MCP stdio 需要另行設定本機執行檔；這些可下載範例刻意不自動啟動它。

## 套件整合

桌面 UI 負責本機除錯狀態的持久儲存及明確的規格寫入。`@powerduck/openapi-parser` 已透過 `additionalOperations` 讀取自訂方法；`@powerduck/tree` 與 `@powerduck/oas-document` 使用此契約結構。`@powerduck/openapi-request` 獨立於規格接收執行階段參數。執行請求不需要 `x-powerduck-request`。

此儲存職責分離未引入新的公開 npm 參數。契約資料使用現有協定擴充，將目前除錯值傳給請求執行 API。不要讓匯出器、產生器或 MCP 工具依賴私有的請求狀態封裝。
