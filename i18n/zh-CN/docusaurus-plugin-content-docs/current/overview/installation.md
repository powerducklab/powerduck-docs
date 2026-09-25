---
sidebar_position: 2
title: 安装
description: "在 macOS、Windows 或 Linux 上安装 Powerduck 桌面客户端。应用本地优先，开始使用无需账号。"
---

# 安装

Powerduck 桌面客户端是一个本地优先的应用。它像任何其他桌面程序一样安装，打开磁盘上的真实文件，开始使用无需账号。

## 下载

从 [Powerduck 官网](https://www.powerduck.com/#download)获取对应平台的安装包。以下构建均由 `electron-builder` 产出：

| 平台 | 安装包 | 架构 |
|---|---|---|
| macOS | `.dmg`（以及用于自动更新的 `.zip`） | Apple Silicon（`arm64`）和 Intel（`x64`） |
| Windows | NSIS 安装程序（`.exe`） | `x64` |
| Linux | AppImage（`.AppImage`） | `x64` |

## macOS

1. 打开 `.dmg`，把 Powerduck 拖入**应用程序**。
2. 首次启动时，macOS 可能会请你确认是否要打开从 App Store 之外下载的应用。在对话框中允许，或右键点按应用并选择**打开**。
3. 发布有两个构建：面向 Apple Silicon（M 系列）的 `arm64` 构建和面向 Intel Mac 的 `x64` 构建。下载与你机器匹配的那个。

## Windows

1. 运行 NSIS 安装程序（`.exe`）并按步骤完成安装。
2. 如果 SmartScreen 提示无法识别的发布者，选择**更多信息**，然后**仍要运行**。

## Linux

1. 下载 `.AppImage`。
2. 赋予可执行权限并运行：

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```

AppImage 无需系统级安装即可运行。在某些发行版上，你可能需要安装 FUSE 才能挂载它。

## 你的机器上运行了什么

桌面客户端是一个 Electron 应用，分为两部分：

- 一个**主进程**（Node.js），负责文件访问、对外 HTTP 请求、本地 Mock 服务器、数据库连接和集成终端；
- 一个**渲染进程**（React 工作区），负责渲染规范、AI 对话和每个工具。

这种划分对安全和可靠性很重要：需要网络或文件系统访问的请求由主进程处理，而不是网页视图，因此提示词和 API 密钥不会出现在浏览器控制台中，也不存在浏览器到服务商的直接 CORS 限制。参见 [AI 与模型](../client/ai-models)。

## 系统要求

- 当前仍在维护的 macOS、Windows 10 或更高版本，或主流 Linux 桌面发行版；
- 有足够磁盘容纳应用；你打开的规范仍保留在其原始位置；
- 仅当你发送请求、同步 Git 来源或调用托管 AI 模型时才需要网络——其余情况下应用可离线工作。

## 授权方式

你可以随意长期试用桌面客户端。它以一次性、**永久**授权的方式出售——一次购买，永久拥有，无需订阅。授权码在购买时生成并仅展示一次。Cloud 托管是另一项基于订阅的独立服务。两者的区别参见 [Cloud 账单](../cloud/billing)。

下一步：进行[快速开始](./quickstart)。
