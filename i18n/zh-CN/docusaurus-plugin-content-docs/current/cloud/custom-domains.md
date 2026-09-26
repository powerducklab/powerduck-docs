---
sidebar_position: 6
title: 自定义域名
description: "把主机名（或主机名加子路径）绑定到文档。用 DNS TXT 记录验证所有权，然后从你自己的域名提供文档和 MCP。"
---

# 自定义域名

默认情况下，文档从 Powerduck 的共享地址提供。自定义域名让文档和 MCP 出现在**你自己的主机名**下，这对以你的品牌而非共享链接发布 API 至关重要。

自定义域名是付费能力，在 **Pro 和 Team** 计划上可用（通过 `oas.custom_domain` 权益检查）。

## 整主机绑定与子路径绑定

绑定可以面向：

- **整主机**——`api.example.com` 在根路径提供一个文档；
- **主机加子路径**——`example.com/v1` 在 `/v1` 下提供一个文档。

子路径绑定让一个主机名可以服务多个文档：

```text
example.com/v1  -> document A
example.com/v2  -> document B
```

这避免了每个文档只能用一个主机名的限制，并支持带版本的基础路径。

## 在自定义域名上

共享地址上可用的同样形态，以简短稳定的路径在绑定域名下提供：

| 形态 | 整主机 | 子路径 |
|---|---|---|
| 当前规范 | `/oas` | `/v1/oas` |
| 版本固定规范 | `/v/:version/oas` | `/v1/v/:version/oas` |
| MCP | `/mcp` | `/v1/mcp` |

主机从请求的主机名和路径解析，然后路由到绑定文档。这些路径都会处理 CORS 预检。

## 添加并验证域名

所有权验证之前域名不被信任，因此流程很明确：

1. 向文档**添加**主机名（或主机名加路径）；
2. 服务返回绑定和一条 **DNS 指令**；
3. 创建 DNS 记录并**验证**它；
4. 绑定从待处理变为已验证并开始提供服务。

所有权检查使用 **TXT 记录**：

| 字段 | 值 |
|---|---|
| 记录类型 | `TXT` |
| 主机 | `_powerduck-challenge.<your-domain>` |
| 值 | `powerduck-verify=<verification-token>` |

验证通过 DNS 读取 TXT 记录，并用恒定时间匹配比较令牌。已验证的绑定保持已验证，无需重复检查。

### 示例

对于 `api.example.com`，添加一条 TXT 记录：

```text
_powerduck-challenge.api.example.com
TXT "powerduck-verify=<the-token-shown-for-the-binding>"
```

然后在文档工作区选择**验证**。报告已验证后，文档和 MCP 从该域名提供（前提是文档活动且各形态启用）。

## 管理绑定

- **列出**绑定到文档的域名，包括状态和基础路径；
- 添加 DNS 记录后**验证**待处理绑定；
- **删除**绑定，停止从该域名提供文档。

访问标记的更改会使缓存的主机解析失效，因此更新即时生效，不会提供陈旧绑定。

## 访问控制仍然适用

自定义域名是一个额外地址，而不是绕过。同样的关卡仍然适用：

- 文档必须为 `ACTIVE`；
- 文档和 MCP 各有启用标记；
- 查看密码仍为文档把关，MCP 访问密钥仍为 MCP 把关。

参见[访问控制](./access-control.md)。

相关：[文档与版本](./documents-versions.md)、[账单](./billing.md)。
