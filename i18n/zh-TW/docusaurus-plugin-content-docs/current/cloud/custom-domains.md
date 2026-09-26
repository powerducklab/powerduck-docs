---
sidebar_position: 6
title: 自訂網域
description: "把主機名稱（或主機名稱加子路徑）綁定到文件。用 DNS TXT 記錄驗證所有權，然後從你自己的網域提供文件和 MCP。"
---

# 自訂網域

預設情況下，文件從 Powerduck 的共享位址提供。自訂網域讓文件和 MCP 出現在**你自己的主機名稱**下，這對以你的品牌而非共享連結發布 API 至關重要。

自訂網域是付費能力，在 **Pro 和 Team** 計畫上可用（透過 `oas.custom_domain` 權益檢查）。

## 整主機綁定與子路徑綁定

綁定可以面向：

- **整主機**——`api.example.com` 在根路徑提供一個文件；
- **主機加子路徑**——`example.com/v1` 在 `/v1` 下提供一個文件。

子路徑綁定讓一個主機名可以服務多個文件：

```text
example.com/v1  -> document A
example.com/v2  -> document B
```

這避免了每個文件只能用一個主機名的限制，並支援帶版本的基礎路徑。

## 在自訂網域上

共享位址上可用的同樣形態，以簡短穩定的路徑在綁定網域下提供：

| 形態 | 整主機 | 子路徑 |
|---|---|---|
| 當前規範 | `/oas` | `/v1/oas` |
| 版本固定規範 | `/v/:version/oas` | `/v1/v/:version/oas` |
| MCP | `/mcp` | `/v1/mcp` |

主機從請求的主機名和路徑解析，然後路由到綁定文件。這些路徑都會處理 CORS 預檢。

## 新增並驗證網域

所有權驗證之前網域不被信任，因此流程很明確：

1. 向文件**新增**主機名稱（或主機名稱加路徑）；
2. 服務回傳綁定和一條 **DNS 指令**；
3. 建立 DNS 記錄並**驗證**它；
4. 綁定從待處理變為已驗證並開始提供服務。

所有權檢查使用 **TXT 記錄**：

| 欄位 | 值 |
|---|---|
| 記錄類型 | `TXT` |
| 主機 | `_powerduck-challenge.<your-domain>` |
| 值 | `powerduck-verify=<verification-token>` |

驗證透過 DNS 讀取 TXT 記錄，並用恆定時間匹配比較權杖。已驗證的綁定保持已驗證，無需重複檢查。

### 範例

對於 `api.example.com`，新增一條 TXT 記錄：

```text
_powerduck-challenge.api.example.com
TXT "powerduck-verify=<the-token-shown-for-the-binding>"
```

然後在文件工作區選擇**驗證**。報告已驗證後，文件和 MCP 從該網域提供（前提是文件活動且各形態啟用）。

## 管理綁定

- **列出**綁定到文件的網域，包括狀態和基礎路徑；
- 新增 DNS 記錄後**驗證**待處理綁定；
- **刪除**綁定，停止從該網域提供文件。

存取標記的變更會使快取的主機解析失效，因此更新即時生效，不會提供陳舊綁定。

## 存取控制仍然適用

自訂網域是一個額外位址，而不是繞過。同樣的關卡仍然適用：

- 文件必須為 `ACTIVE`；
- 文件和 MCP 各有啟用標記；
- 檢視密碼仍為文件把關，MCP 存取密鑰仍為 MCP 把關。

參見[存取控制](./access-control.md)。

相關：[文件與版本](./documents-versions.md)、[帳單](./billing.md)。
