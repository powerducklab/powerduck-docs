---
sidebar_position: 2
title: "Install and start"
description: "Powerduck helps you understand what changed, inspect the surrounding code, and decide what needs attention as AI produces more code. The desktop app combines an API workspace with code review; either workflow can be opened independently from Home."
---

# Install and start

Download the installer matching your system from the official download page: macOS Apple Silicon or Intel, Windows, or Linux AppImage. Verify its source and publisher; do not disable operating-system security. Sign in on the website and return to the app. From Home, import an API definition or choose a code project. The browser app previews API workflows; filesystem analysis and local commands require the desktop app.

[Powerduck](https://www.powerduck.com/download.html)

## Built-in AI and usage

Sign in with Google or GitHub. Powerduck provides the built-in model; model selectors, custom provider keys and custom endpoints are not offered. Selected source context is sent to managed AI providers only for requested AI work. Local scans exclude common dependency, build and credential paths, but cannot guarantee that your source contains no secrets. Review what you share.

## Plans and task allowances

New task plans count AI conversations and code reviews separately, not upstream tokens. Free: 10 conversations and 2 reviews; Starter $19/month: 300 and 20; Pro $39/month: 700 and 60; Max $99/month: 2,000 and 180. Free resets at the start of each UTC calendar month; paid allowances follow the subscription billing period. Unused tasks do not roll over. Checkout shows the final price and tax.

- [API workspace](../client/introduction.md)
- [Code review](../client/code-quality.md)
- [Built-in AI and usage](../client/ai-models.md)
- [Plans and task allowances](../cloud/billing.md)
- [Install and start](installation.md)
- [Understand every change](quickstart.md)

## macOS · Windows · Linux

macOS 11+ · Windows 10+ · Linux · Electron 37

- macOS: `.dmg` · `arm64` / `x64`
- Windows: NSIS `.exe` · SmartScreen
- Linux: `.AppImage` · `x64`

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```
