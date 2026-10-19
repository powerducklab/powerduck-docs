---
sidebar_position: 2
title: "Установка"
description: "Установите @powerduck/oas-document и его одноранговые зависимости."
---

# Установка

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## Одноранговые зависимости

```bash
npm install react react-dom
```

## Импорт CSS

```tsx
import "@powerduck/oas-document/react/index.css";
```

Компонент включает собственные таблицы стилей (CSS пакетов tree и md-editor). Дополнительный импорт CSS, кроме точки входа пакета, не требуется.

## Точки входа

| Импорт | Описание |
|--------|-------------|
| `@powerduck/oas-document/react` | Компонент `<OasDocument />` и хук `useOasDocument` |
| `@powerduck/oas-document` | Ядро: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
