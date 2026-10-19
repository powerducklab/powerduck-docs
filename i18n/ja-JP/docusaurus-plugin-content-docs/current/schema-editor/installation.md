---
sidebar_position: 2
title: "インストール"
description: "@powerduck/schema-editor とそのピア依存関係をインストールします。"
---

# インストール

```bash npm2yarn2pnpm
npm install @powerduck/schema-editor
```

## ピア依存関係

```bash
npm install react react-dom monaco-editor @monaco-editor/react
```

## エントリーポイント

| インポート先 | 説明 |
|--------|-------------|
| `@powerduck/schema-editor` | コア API：スキーマの解決、診断、サンプル生成 |
| `@powerduck/schema-editor/react` | React の `<SchemaEditor />` コンポーネント |
| `@powerduck/schema-editor/core` | React に依存せず、ブラウザーで利用できるコア |
