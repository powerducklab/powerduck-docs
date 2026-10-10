---
title: "从已有代码生成 OpenAPI"
description: "从已有代码生成 OpenAPI"
---

# 从已有代码生成 OpenAPI

在桌面客户端选择“从代码生成 OpenAPI”（Beta），选择本地源码目录，再点击“开始扫描”。先扫描一个小服务，逐项检查识别出的路由、参数及响应。

静态扫描遇到动态逻辑或缺少依赖时，响应 schema 可能未知。“人工确认”只记录审核结果，不代表缺失类型已被补齐。应根据证据编辑契约；也可主动选择 AI 审查，它会向配置的模型服务发送所选处理器源码和相关上下文。

将结果另存为新文件，审查差异后再考虑替换原规范。然后使用[契约测试示例](./contract-example.md)验证真实后端，或[连接编程 Agent](./coding-agent.md)。扫描成功不代表实现符合规范。

此流程需要桌面版，不同语言和框架支持范围不同。静态扫描无需模型 Key；未能确定的字段应保留未知状态。

[Download desktop](https://www.powerduck.com/download.html) · [Quickstart](../overview/quickstart.md)
