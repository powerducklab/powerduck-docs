---
sidebar_position: 4
title: "API リファレンス"
description: "SchemaEditor のプロパティ、コアのエクスポート、エディターの言語型。"
---

# API リファレンス

## `<SchemaEditor />` — プロパティ

| プロパティ | 型 | 既定値 | 説明 |
|------|------|---------|-------------|
| `value` | `string` | 必須 | エディターの内容 |
| `onChange` | `(value: string) => void` | — | 内容の変更時に呼び出す |
| `language` | `"json" \| "yaml" \| "javascript"` | 必須 | コンテンツの言語 |
| `schema` | `JsonSchema` | — | 補完と診断に使用する JSON Schema（json/yaml） |
| `snippets` | `string[]` | — | JavaScript のゴースト補完に使うスニペット文字列 |
| `theme` | `"light" \| "dark"` | `"light"` | 表示テーマ |
| `readOnly` | `boolean` | `false` | 編集を無効にする |
| `placeholder` | `string` | — | 空のときに表示するプレースホルダーテキスト |
| `showDiagnostics` | `boolean` | `true` | 診断ステータスバーを表示する |
| `enableInlineSuggestions` | `boolean` | `true` | ゴーストテキストを有効にする |
| `enableCompletion` | `boolean` | `true` | 補完ポップアップを有効にする |
| `diagnosticsDebounceMs` | `number` | `250` | 診断のデバウンス遅延 |

## コアのエクスポート (`@powerduck/schema-editor`)

| 関数 | 説明 |
|----------|-------------|
| `resolveSchemas(document)` | スキーマドキュメント内の `$ref` ポインターを解決する |
| `validateSchema(data, schema)` | スキーマに対してデータを検証する |
| `generateSample(schema)` | JSON Schema からサンプルデータを生成する |
| `getCompletionItems(model, position)` | カーソル位置での補完候補を取得する |

## 型

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
