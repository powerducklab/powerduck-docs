---
title: "將 OpenAPI 連接至程式開發代理"
description: "將 OpenAPI 連接至程式開發代理"
---

# 將 OpenAPI 連接至程式開發代理

使用**開發者 MCP**，讓程式開發代理檢視契約並驗證後端。**API-to-MCP** 則將 API 操作公開為可呼叫的工具，兩者用途不同。

1. 在桌面應用程式中按一下**開啟**，載入 YAML/JSON 檔案。開始嘗試前，請先另存一份獨立副本。
2. 為目前的規格開啟 **MCP 與程式開發**。也可以在開發者 MCP 儲存庫的本機副本中執行 `npm ci` 和 `npm run build`。
3. 在代理中設定 stdio MCP 伺服器，執行檔使用 `node`，引數為 `/absolute/path/dev-mcp-server/dist/cli.mjs`、`--spec`、`/absolute/path/openapi.yaml`。請換成實際的絕對路徑，不要直接照貼範例中的預留文字。
4. 請代理先閱讀操作及其回應結構描述，再修改後端。修改完成後，請它呼叫 `run_contract_tests`，並明確指定後端的本機 `baseUrl`。
5. 檢查回報的斷言與建議的程式碼修補內容。套用經您接受的修正後，重新執行測試。

開發者 MCP 伺服器需要 Node.js 22.12.0 以上版本。代理可能將工具結果或程式碼上下文傳送至您設定的遠端模型。手動執行本機請求與契約測試不需要模型。使用您自己的金鑰時，由模型供應商計費；託管模型額度另計。本機作業不需要訂閱 Cloud。

[下載桌面應用程式](https://www.powerduck.com/zh-TW/download/) · [快速入門](https://www.powerduck.com/docs/zh-TW/overview/quickstart/)
