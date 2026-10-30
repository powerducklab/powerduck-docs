---
sidebar_position: 2
title: 安装
description: "Powerduck · Google OAuth / GitHub · Free / Pro / Max"
---

# 安装

Powerduck 桌面端与浏览器工作台均须先使用 Google OAuth 或 GitHub 登录。本地文件仍保存在磁盘。AI 分析会将选定上下文发送给平台管理的模型供应商；不再支持自定义模型地址或 API Key。

## 下载

从 [Powerduck 官网](https://www.powerduck.com/#download)获取对应平台的安装包。以下构建均由 `electron-builder` 产出：

| 平台 | 安装包 | 架构 |
|---|---|---|
| macOS | `.dmg`（以及用于自动更新的 `.zip`） | Apple Silicon（`arm64`）和 Intel（`x64`） |
| Windows | NSIS 安装程序（`.exe`） | `x64` |
| Linux | AppImage（`.AppImage`） | `x64` |

## macOS

1. 打开 `.dmg`，把 Powerduck 拖入**应用程序**。
2. 首次启动时，macOS 可能会要求确认打开 App Store 之外下载的应用。打开前请确认安装包来自官方下载页面；不要关闭系统安全检查。
3. 发布有两个构建：面向 Apple Silicon（M 系列）的 `arm64` 构建和面向 Intel Mac 的 `x64` 构建。下载与你机器匹配的那个。

## Windows

1. 运行 NSIS 安装程序（`.exe`）并按步骤完成安装。
2. 如果 SmartScreen 提示无法识别的发布者，请先确认安装包来自官方下载页面。核实来源后再继续；不要为不可信的下载绕过警告。

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

Powerduck 桌面端与浏览器工作台均须先使用 Google OAuth 或 GitHub 登录。本地文件仍保存在磁盘。AI 分析会将选定上下文发送给平台管理的模型供应商；不再支持自定义模型地址或 API Key。

## 系统要求

- macOS 11 或更高版本、Windows 10 或更高版本，或兼容 Electron 37 的主流 Linux 桌面发行版；
- 有足够磁盘容纳应用；你打开的规范仍保留在其原始位置；
- Powerduck 桌面端与浏览器工作台均须先使用 Google OAuth 或 GitHub 登录。本地文件仍保存在磁盘。AI 分析会将选定上下文发送给平台管理的模型供应商；不再支持自定义模型地址或 API Key。

## Powerduck · Free / Pro / Max

Free 每日赠送 300,000 credits，UTC 00:00 重置。Pro 为 $39/月，每 7 日 18,000,000 credits；Max 为 $99/月，每 7 日 60,000,000 credits。付费额度以首次订阅时间为起点每 7 日重置，与按月计费独立；剩余额度不结转。桌面端与 AI Chat 共用个人账户套餐，不再出售软件授权或激活码。

下一步：进行[快速开始](./quickstart.md)。
