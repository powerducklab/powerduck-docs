---
sidebar_position: 2
title: "Установка"
description: "Установите @powerduck/schema-editor и его одноранговые зависимости."
---

# Установка

```bash npm2yarn2pnpm
npm install @powerduck/schema-editor
```

## Одноранговые зависимости

```bash
npm install react react-dom monaco-editor @monaco-editor/react
```

## Точки входа

| Импорт | Описание |
|--------|-------------|
| `@powerduck/schema-editor` | Основной API: разрешение схем, диагностика и генерация примеров |
| `@powerduck/schema-editor/react` | Компонент React `<SchemaEditor />` |
| `@powerduck/schema-editor/core` | Ядро для браузера без зависимости от React |
