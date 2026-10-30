---
sidebar_position: 2
title: Installation
description: "Powerduck · Google OAuth / GitHub · Free / Pro / Max"
---

# Installation

Sign in with Google OAuth or GitHub before using Powerduck, including the desktop client. Local files remain on disk. AI analysis sends the selected context to Powerduck’s managed providers; custom model endpoints and API keys are no longer supported.

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

Sign in with Google OAuth or GitHub before using Powerduck, including the desktop client. Local files remain on disk. AI analysis sends the selected context to Powerduck’s managed providers; custom model endpoints and API keys are no longer supported.

## System requirements

- macOS 11 or later, Windows 10 or later, or a mainstream Linux desktop distribution compatible with Electron 37;
- Enough disk for the application; the specifications you open remain in their original locations;
- Sign in with Google OAuth or GitHub before using Powerduck, including the desktop client. Local files remain on disk. AI analysis sends the selected context to Powerduck’s managed providers; custom model endpoints and API keys are no longer supported.

## Powerduck · Free / Pro / Max

Free includes 300,000 credits, reset daily at 00:00 UTC. Pro is $39/month with 18,000,000 credits per 7 days; Max is $99/month with 60,000,000 credits per 7 days. Paid resets are anchored to the original subscription start, separately from monthly billing. Unused credits do not roll over. Desktop and AI Chat share the personal account plan; software licenses and activation keys are no longer sold.

Next: take the [Quickstart](./quickstart.md).
