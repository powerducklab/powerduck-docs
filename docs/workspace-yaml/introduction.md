---
sidebar_position: 1
title: "Introduction"
description: "Initialize workspace.yaml and OpenAPI 3.2 YAML files with confidence. Two-layer architecture: browser-safe core for generating YAML content, plus Node.js/Electron file layer with atomic writes and locking."
keywords: ["workspace-yaml", "powerduck", "YAML", "workspace", "OpenAPI", "introduction"]
---

# @powerduck/workspace-yaml

Initialize workspace.yaml and OpenAPI 3.2 YAML files with confidence.

Two-layer architecture:
- **Core layer** (browser-safe): Pure functions that generate YAML content strings. No filesystem access.
- **File layer** (Node.js / Electron): Wraps the core with atomic writes, file locking, and path normalization.

- **Package name:** `@powerduck/workspace-yaml`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **License:** MIT

This library **only initializes files** — the "new file" / "manual creation"
scenario. It does **not** reimplement reading, patching, or updating YAML files.
For those operations, use [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## Next steps

- [Installation](./installation.md)
- [Quickstart](./quickstart.md)
- [API Reference](./api-reference.md)
- [Examples](./examples.md)
