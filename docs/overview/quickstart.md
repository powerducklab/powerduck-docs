---
sidebar_position: 3
title: "Quickstart"
description: "Powerduck helps you understand what changed, inspect the surrounding code, and decide what needs attention as AI produces more code. The desktop app combines an API workspace with code review; either workflow can be opened independently from Home."
---

# Quickstart

Download the installer matching your system from the official download page: macOS Apple Silicon or Intel, Windows, or Linux AppImage. Verify its source and publisher; do not disable operating-system security. Sign in on the website and return to the app. From Home, import an API definition or choose a code project. The browser app previews API workflows; filesystem analysis and local commands require the desktop app.

## API workspace

Import an OpenAPI YAML or JSON file to design operations, send requests, inspect responses, run scenarios, serve local mocks, explore data models and render documentation. MCP and publishing are separate workflows. Importing an API definition does not deploy your business backend.

## Code review

Choose a code folder. The project structure opens first; select a file to read its full source. Switch between source only, full comparison and changes only. Added and removed lines, inline character highlights, change navigation and search help locate the actual edit without losing context.

## Comparison and round history

The current round compares the saved round baseline with files on disk. Opening a folder establishes a starting point; existing content is not automatically new work. Use all uncommitted changes for a Git HEAD comparison. Start a new round deliberately and select previous rounds to inspect their captured differences. History is local, not a Git backup; save edits to disk before expecting them to appear.

## Run checks

Run checks explicitly to execute detected project commands. Inspect each command, exit code and raw output; missing scripts are unverified, not passed. Project scripts execute code on your computer, so use trusted projects. Reading files, static analysis and AI review do not themselves establish execution evidence. Marking a block read records reading progress only.

- [API workspace](../client/introduction.md)
- [Code review](../client/code-quality.md)
- [Built-in AI and usage](../client/ai-models.md)
- [Plans and task allowances](../cloud/billing.md)
- [Install and start](installation.md)
- [Understand every change](quickstart.md)
