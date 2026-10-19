---
title: "透過契約測試找出實作錯誤"
description: "透過契約測試找出實作錯誤"
---

# 透過契約測試找出實作錯誤

此範例使用開發者 MCP 執行器，自 0.7.6 版起支援回應結構描述驗證。需要 Node.js 22.12.0 或更新版本。範例使用虛構資料，後端僅監聽本機迴送介面；安裝相依套件後，不需要帳號、模型或公開 API。

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

回應是 `{"total":"42"}`，但結構描述要求數字。實際驗證器會回報 `/total must be number`，並以狀態碼 1 結束。

```sh
node examples/contract-total/verify.mjs --correct
```

後端現在回傳 `{"total":42}`；相同檢查會通過，並以狀態碼 0 結束。若要自行修正實作，請修改 `examples/contract-total/server.mjs` 中的 `total` 運算式，使其回傳數字。不要放寬契約來掩蓋錯誤。

每次執行都會配置可用的本機連接埠，並在結束時關閉伺服器。原始碼與指令位於[範例專案](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total)。目前的結構描述檢查涵蓋 JSON 回應，不包含格式驗證或遠端結構描述擷取。若不支援的內容類型需要結構描述驗證，會回報限制，而不是默默判定通過。

這會驗證真正的後端。Mock 請求成功只代表範例流程可運作。程式開發代理也可透過明確的 `baseUrl` 呼叫 `run_contract_tests` 來執行相同驗證；套用修補前，請先檢查。

[下載桌面應用程式](https://www.powerduck.com/zh-TW/download/) · [快速入門](https://www.powerduck.com/docs/zh-TW/overview/quickstart/)
