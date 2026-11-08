---
sidebar_position: 2
title: "安装与开始使用"
description: "AI 生成代码越来越快，Powerduck 帮助你看清改了什么、结合上下文审查代码，并决定哪些问题需要处理。桌面端提供 API 工作台与代码审阅，两条工作流都能从首页独立进入。"
---

# 安装与开始使用

从官网下载适合系统的安装包：macOS Apple Silicon 或 Intel、Windows，或 Linux AppImage。核对来源与发布者，不要关闭系统安全保护。前往官网登录后返回应用，从首页导入接口文件或选择代码项目。浏览器 App 用于体验 API 工作流，文件系统分析与本地命令需要桌面端。

[Powerduck](https://www.powerduck.com/download.html)

## 内置 AI 与使用范围

使用 Google 或 GitHub 登录。产品仅提供内置模型，不提供模型选择、自带密钥或自定义端点。只有请求 AI 工作时才向托管模型服务发送所选代码上下文。本地扫描排除常见依赖、构建和凭据路径，但不能保证源码中没有秘密信息，请核对分享范围。

## 套餐与任务次数

新任务套餐分别统计 AI 对话和代码审阅，不按上游 token 扣费。Free：20 次对话、5 次审阅；Starter 每月 $19：300 次、30 次；Pro 每月 $39：700 次、90 次；Max 每月 $99：2,000 次、270 次。Free 在 UTC 每月月初重置，付费次数跟随订阅账期；剩余次数不结转。最终价格与税费以结账页面为准。

- [API 工作台](../client/introduction.md)
- [代码审阅](../client/code-quality.md)
- [内置 AI 与使用范围](../client/ai-models.md)
- [套餐与任务次数](../cloud/billing.md)
- [安装与开始使用](installation.md)
- [看清每一次改动](quickstart.md)

## macOS · Windows · Linux

macOS 11+ · Windows 10+ · Linux · Electron 37

- macOS: `.dmg` · `arm64` / `x64`
- Windows: NSIS `.exe` · SmartScreen
- Linux: `.AppImage` · `x64`

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```
