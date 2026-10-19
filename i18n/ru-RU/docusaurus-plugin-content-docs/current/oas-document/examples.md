---
sidebar_position: 5
title: "Примеры"
description: "Отключите автоматическое преобразование, используйте основной модуль без React, настройте темы и изучите ограничения производительности отрисовки."
---

# Примеры

## Уже есть корректный документ OAS 3.2?

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## Только основной модуль (без React)

Используйте основную точку входа для собственного интерфейса или Node.js:

```typescript
import { loadOasDocument } from "@powerduck/oas-document";

const result = await loadOasDocument(spec, { autoUpgrade: true });

if (result.error) {
  console.error("Failed:", result.error);
} else {
  console.log("Operations:", result.operations.length);
  console.log("Tree nodes:", result.tree.length);
}
```

## Собственные стили

Корневой элемент получает `data-theme="light"` или `data-theme="dark"`. Все цвета определяются через CSS-переменные внутри `.pde-oas-root`:

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## Замечания о производительности

- Загрузка примеров кода откладывается до момента, когда они окажутся не дальше 600px от видимой области (IntersectionObserver)
- Подсветка синтаксиса использует LRU-кеш (64 записи / 1MB)
- Отслеживание прокрутки использует пассивные обработчики с ограничением частоты через rAF
- Генерация примеров ограничена 6 уровнями вложенности и 1 000 узлами
