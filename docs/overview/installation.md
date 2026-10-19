---
sidebar_position: 2
title: Installation
description: "Install the Powerduck desktop client on macOS, Windows, or Linux. The app is local-first and needs no account to start."
---

# Installation

The Powerduck desktop client is a local-first application. It installs like any other desktop program, opens real files on disk, and does not require an account to start.

## Download

Get the installer for your platform from the [Powerduck website](https://www.powerduck.com/#download). The following builds are produced with `electron-builder`:

| Platform | Installer | Architecture |
|---|---|---|
| macOS | `.dmg` (and a `.zip` for auto-update) | Apple Silicon (`arm64`) and Intel (`x64`) |
| Windows | NSIS setup (`.exe`) | `x64` |
| Linux | AppImage (`.AppImage`) | `x64` |

## macOS

1. Open the `.dmg` and drag Powerduck into **Applications**.
2. On first launch, macOS may ask you to confirm an app downloaded outside the App Store. Verify that it came from the official download page before opening it; do not disable system security checks.
3. Two builds are published: an `arm64` build for Apple Silicon (M-series) and an `x64` build for Intel Macs. Download the one that matches your machine.

## Windows

1. Run the NSIS installer (`.exe`) and follow the setup steps.
2. If SmartScreen shows an unrecognized-publisher prompt, first check that the installer came from the official download page. Continue only after verifying the source; do not bypass the warning for an untrusted download.

## Linux

1. Download the `.AppImage`.
2. Make it executable and run it:

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```

AppImage runs without a system-wide installation. On some distributions you may need FUSE installed to mount it.

## What runs on your machine

The desktop client is an Electron application with two parts:

- A **main process** (Node.js) that owns file access, outbound HTTP requests, the local mock server, database connections, and the integrated terminal;
- A **renderer** (the React workspace) that renders the specification, the AI chat, and every tool.

The desktop AI transport sends completion requests through the main process, so browser-to-provider CORS restrictions do not apply. Prompts, relevant context, and credentials are still sent to the model endpoint you configure; using a hosted model is not an offline operation. This process boundary is not a guarantee that secrets can never appear in logs or developer tools. See [AI and models](../client/ai-models.md).

## System requirements

- macOS 11 or later, Windows 10 or later, or a mainstream Linux desktop distribution compatible with Electron 37;
- Enough disk for the application; the specifications you open remain in their original locations;
- Network access only when you send requests, sync a Git source, or call a hosted AI model — the app otherwise works offline.

## Licensing

You can evaluate the desktop client for as long as you like. It is sold as a one-time, **perpetual** license — buy once, own it, with no subscription. A license key is issued at purchase and shown once. Cloud hosting is a separate, subscription-based service. See [Cloud billing](../cloud/billing.md) for the distinction.

Next: take the [Quickstart](./quickstart.md).
