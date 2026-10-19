---
sidebar_position: 2
title: "Установка"
description: "Установите @powerduck/md-editor через npm, yarn или pnpm и узнайте о путях импорта, peer-зависимостях и поддержке TypeScript."
---

# Установка

Установите `@powerduck/md-editor` с помощью выбранного менеджера пакетов.

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## Пути импорта

В `package.json` явно определены экспорты подпутей:

| Путь импорта | Содержимое |
|---|---|
| `@powerduck/md-editor` | Основной вход: класс `MarkdownEditor`, все самостоятельные вспомогательные средства, типы и функции. |
| `@powerduck/md-editor/react` | Подпуть React: компонент `MarkdownEditorReact`, типы `MarkdownEditorProps` и `MarkdownEditorHandle`. |
| `@powerduck/md-editor/dist/style.css` | Скомпилированная таблица стилей редактора; её нужно импортировать один раз. |
| `@powerduck/md-editor/styles/tokens.css` | Исходные пользовательские свойства CSS для дизайн-токенов. |

Пакет поставляется как ECMAScript-модуль (`"type": "module"`) с двумя сборками: `dist/index.mjs` (ESM) и `dist/index.cjs` (CommonJS). Декларации типов находятся в `dist/index.d.ts`.

```ts
// Vanilla JS main entry
import { MarkdownEditor, renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';
```

```tsx
// React subpath
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';
```

## Peer-зависимости

`react` и `react-dom` объявлены **необязательными** peer-зависимостями (`>=17`). Они нужны только при импорте подпути `./react`:

```bash
npm install react react-dom
```

Класс `MarkdownEditor` без привязки к фреймворку и самостоятельная функция `renderMarkdown` не зависят от React и работают в любом браузерном проекте без его установки.

## Поддержка TypeScript

Пакет содержит собственные декларации типов; дополнительные пакеты `@types/*` не нужны. Основной вход экспортирует `MarkdownEditorOptions`, `EditorMode`, `EditorTheme`, `ToolbarConfig`, `RendererOptions` и все вспомогательные типы. Подпуть `./react` экспортирует `MarkdownEditorProps` и `MarkdownEditorHandle`.

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## Побочные эффекты CSS

Файлы `*.css` отмечены в `package.json` как имеющие побочные эффекты, поэтому сборщики не удаляют их при tree-shaking. Импортируйте `dist/style.css` один раз во входном модуле приложения: он включает оформление редактора, предпросмотра через `github-markdown-css`, KaTeX и всех плагинов.

## Следующие шаги

- [Быстрый старт](/docs/ru-RU/md-editor/quickstart/) — подключите свой первый редактор.
- [Настройка](/docs/ru-RU/md-editor/configuration/) — все параметры `MarkdownEditorOptions`.
