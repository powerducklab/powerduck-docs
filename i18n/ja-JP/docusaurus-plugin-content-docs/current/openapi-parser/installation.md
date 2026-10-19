---
sidebar_position: 2
title: "インストール"
description: "@powerduck/openapi-parser をインストールし、ESM/CJS ビルドを確認します。"
---

# インストール

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

Node.js 22.12.0 以降が必要です。

## パッケージ構成

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM（Node.js 22.12.0 以降、最新のバンドラー）

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS（Electron のメインプロセス）

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## ピア依存関係なし

このパッケージにはピア依存関係がありません。`@scalar/openapi-parser` と `@scalar/openapi-upgrader` は内部にバンドルされています。
