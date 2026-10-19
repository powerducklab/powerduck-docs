---
sidebar_position: 4
title: "API 参考"
description: "SchemaEditor 属性、核心导出和编辑器语言类型。"
---

# API 参考

## `<SchemaEditor />` — 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|-------------|
| `value` | `string` | 必填 | 编辑器内容 |
| `onChange` | `(value: string) => void` | — | 内容变化时调用 |
| `language` | `"json" \| "yaml" \| "javascript"` | 必填 | 内容语言 |
| `schema` | `JsonSchema` | — | 用于补全和诊断的 JSON Schema（json/yaml） |
| `snippets` | `string[]` | — | 用于 JavaScript 行内预览补全的代码片段字符串 |
| `theme` | `"light" \| "dark"` | `"light"` | 界面主题 |
| `readOnly` | `boolean` | `false` | 禁止编辑 |
| `placeholder` | `string` | — | 内容为空时的占位文本 |
| `showDiagnostics` | `boolean` | `true` | 显示诊断状态栏 |
| `enableInlineSuggestions` | `boolean` | `true` | 启用行内预览建议 |
| `enableCompletion` | `boolean` | `true` | 启用弹出补全 |
| `diagnosticsDebounceMs` | `number` | `250` | 诊断防抖延迟 |

## 核心导出 (`@powerduck/schema-editor`)

| 函数 | 说明 |
|----------|-------------|
| `resolveSchemas(document)` | 解析模式文档中的 `$ref` 指针 |
| `validateSchema(data, schema)` | 根据模式验证数据 |
| `generateSample(schema)` | 根据 JSON Schema 生成示例数据 |
| `getCompletionItems(model, position)` | 获取光标位置处的补全项 |

## 类型

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
