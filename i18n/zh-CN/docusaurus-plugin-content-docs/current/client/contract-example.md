---
title: "用契约测试发现真实实现错误"
description: "用契约测试发现真实实现错误"
---

# 用契约测试发现真实实现错误

此例使用开发者 MCP 的契约执行器，响应 schema 校验已在当前源码中补齐。需要 Node.js 20.11 或更新版本。数据均为虚构，后端只监听本机；依赖安装后无需账号、模型或公网 API。

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

规范要求 `total` 为 number，后端却返回 `{"total":"42"}`。真实校验结果为 `/total must be number`，退出码 1。

```sh
node examples/contract-total/verify.mjs --correct
```

后端改为返回 `{"total":42}`，同一检查通过，退出码 0。手动修复可修改 `examples/contract-total/server.mjs` 中的 `total` 表达式，不能放宽规范掩盖实现错误。

脚本自动分配空闲端口并关闭后端。[示例源码](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total)包含完整流程。当前校验覆盖 JSON 响应，不验证 format，也不远程拉取 schema；不支持的响应媒体类型会明确报告限制。

本例检查真实后端。Mock 请求成功只能证明示例工作流可用。可选的编程 Agent 使用 `run_contract_tests` 并显式传入 `baseUrl` 执行相同检查；应用修改前先审查补丁。

[Download desktop](https://www.powerduck.com/download.html) · [Quickstart](../overview/quickstart.md)
