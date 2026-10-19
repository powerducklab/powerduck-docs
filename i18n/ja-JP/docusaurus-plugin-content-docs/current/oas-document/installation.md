---
sidebar_position: 2
title: "インストール"
description: "@powerduck/oas-document とそのピア依存関係をインストールします。"
---

# インストール

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## ピア依存関係

```bash
npm install react react-dom
```

## CSS のインポート

```tsx
import "@powerduck/oas-document/react/index.css";
```

コンポーネントには必要なスタイルシート（tree CSS、md-editor CSS）が同梱されています。パッケージのエントリーポイント以外から CSS を追加でインポートする必要はありません。

## エントリーポイント

| インポート先 | 説明 |
|--------|-------------|
| `@powerduck/oas-document/react` | `<OasDocument />` コンポーネントと `useOasDocument` フック |
| `@powerduck/oas-document` | コア: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
