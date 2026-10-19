---
sidebar_position: 2
title: "インストール"
description: "@powerduck/tree とそのピア依存関係をインストールします。"
---

# インストール

```bash npm2yarn2pnpm
npm install @powerduck/tree
```

## ピア依存関係

```bash
npm install react react-dom react-icons
```

## CSS のインポート

```tsx
import "@powerduck/tree/react/index.css";
```

## エントリーポイント

| インポート先 | 説明 |
|--------|-------------|
| `@powerduck/tree` | コアの型、ユーティリティ、すべてのアダプター |
| `@powerduck/tree/react` | React の Tree コンポーネントとフック |
| `@powerduck/tree/adapters` | OpenAPI、JSON Schema、ドキュメント用のアダプター |
| `@powerduck/tree/core` | コアの型とユーティリティのみ |
