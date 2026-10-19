---
sidebar_position: 4
title: "Справочник API"
description: "Свойства SchemaEditor, экспорты ядра и типы языков редактора."
---

# Справочник API

## `<SchemaEditor />` — Свойство

| Свойство | Тип | По умолчанию | Описание |
|------|------|---------|-------------|
| `value` | `string` | обязательно | Содержимое редактора |
| `onChange` | `(value: string) => void` | — | Вызывается при изменении содержимого |
| `language` | `"json" \| "yaml" \| "javascript"` | обязательно | Язык содержимого |
| `schema` | `JsonSchema` | — | JSON Schema для автодополнения и диагностики (json/yaml) |
| `snippets` | `string[]` | — | Строки фрагментов для призрачного автодополнения JavaScript |
| `theme` | `"light" \| "dark"` | `"light"` | Визуальная тема |
| `readOnly` | `boolean` | `false` | Отключает редактирование |
| `placeholder` | `string` | — | Текст-подсказка при пустом содержимом |
| `showDiagnostics` | `boolean` | `true` | Показывает строку состояния диагностики |
| `enableInlineSuggestions` | `boolean` | `true` | Включает призрачный текст |
| `enableCompletion` | `boolean` | `true` | Включает всплывающее автодополнение |
| `diagnosticsDebounceMs` | `number` | `250` | Задержка диагностики после прекращения изменений |

## Экспорты ядра (`@powerduck/schema-editor`)

| Функция | Описание |
|----------|-------------|
| `resolveSchemas(document)` | Разрешает указатели `$ref` в документе схемы |
| `validateSchema(data, schema)` | Проверяет данные по схеме |
| `generateSample(schema)` | Создаёт примеры данных из JSON Schema |
| `getCompletionItems(model, position)` | Возвращает варианты автодополнения в позиции курсора |

## Типы

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
