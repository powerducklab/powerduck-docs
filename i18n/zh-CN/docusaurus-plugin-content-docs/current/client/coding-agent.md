---
title: "让编程 Agent 读取并验证 OpenAPI"
description: "让编程 Agent 读取并验证 OpenAPI"
---

# 让编程 Agent 读取并验证 OpenAPI

**开发者 MCP** 提供契约事实和后端验证工具；**API 转 MCP** 将接口暴露为可调用工具，两者不是同一件事。

1. 在桌面客户端通过“打开”选择 YAML/JSON。实验前保留独立副本。
2. 打开当前规范的 **MCP & Coding**。也可以在开发者 MCP 仓库执行 `npm ci` 和 `npm run build`。
3. 在编程 Agent 中添加 stdio MCP：可执行文件为 `node`，参数依次为 `/绝对路径/dev-mcp-server/dist/cli.mjs`、`--spec`、`/绝对路径/openapi.yaml`。请替换为真实路径。
4. 先让 Agent 读取接口及响应 schema，再修改后端。修改后调用 `run_contract_tests`，显式传入真实后端的本地 `baseUrl`。
5. 审查断言结果及代码补丁，接受修改后重新验证。

开发者 MCP 需要 Node.js 20.11+。Agent 可能向其远程模型发送代码上下文和工具结果。手动请求和契约验证无需模型；自带 Key 由模型提供者计费，托管模型额度另行计费。本地功能不需要购买 Cloud。

[Download desktop](https://www.powerduck.com/download.html) · [Quickstart](../overview/quickstart.md)
