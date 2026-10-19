---
sidebar_position: 1
title: "简介"
description: "可靠地初始化 workspace.yaml 和 OpenAPI 3.2 YAML 文件。 可在浏览器中安全运行：通过纯函数生成 YAML 内容字符串，不访问文件系统。 在 Node.js / Electron 中为核心层提供原子写入、文件锁定和路径规范化。"
keywords: ["workspace-yaml", "powerduck", "YAML", "OpenAPI"]
---

# @powerduck/workspace-yaml

可靠地初始化 workspace.yaml 和 OpenAPI 3.2 YAML 文件。

双层架构：
- **核心层**: 可在浏览器中安全运行：通过纯函数生成 YAML 内容字符串，不访问文件系统。
- **文件层**: 在 Node.js / Electron 中为核心层提供原子写入、文件锁定和路径规范化。

- **包名:** `@powerduck/workspace-yaml`
- **版本:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **许可证:** MIT

此库**仅初始化文件**，适用于“新建文件”或“手动创建”场景。它**不**重复实现 YAML 文件的读取、修补或更新。这些操作请使用 [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## 后续步骤

- [安装](/docs/zh-CN/workspace-yaml/installation/)
- [快速开始](/docs/zh-CN/workspace-yaml/quickstart/)
- [API 参考](/docs/zh-CN/workspace-yaml/api-reference/)
- [示例](/docs/zh-CN/workspace-yaml/examples/)
