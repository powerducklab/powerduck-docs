---
sidebar_position: 2
title: "Установка"
description: "Установите @powerduck/x-to-openapi через npm, yarn или pnpm. ESM с поддержкой CommonJS; функции curlToOpenApi и postmanToOpenApi не требуют настройки."
---

# Установка

Установите `@powerduck/x-to-openapi` удобным менеджером пакетов.

## Требования

- **Node.js:** `>= 22.12.0`
- **TypeScript:** необязателен; полные определения типов включены в пакет.

## Установка

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## Зависимости времени выполнения

| Пакет | Версия | Назначение |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Канонические типы OpenAPI и проверка результата |
| `curlconverter` | `^4.12.0` | Разбор команд curl в структурированные запросы |

Обе зависимости устанавливаются автоматически.

---

## Модульная система: ESM с поддержкой CJS

Пакет объявляет `"type": "module"` и предоставляет обе сборки через одну точку входа:

| Сборка | Условие | Файл |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| Типы | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

Пакет объявляет `"sideEffects": false`, поэтому tree shaking удаляет неиспользуемые адаптеры.

---

## Вспомогательные функции без настройки

Большинству пользователей достаточно двух функций. Они создают экземпляр [`XToOpenApi`](/docs/ru-RU/x-to-openapi/api-reference/#xtoopenapi), регистрируют подходящий адаптер и вызывают `convert`:

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

Используйте полный класс [`XToOpenApi`](/docs/ru-RU/x-to-openapi/api-reference/#xtoopenapi), если нужны собственные параметры, несколько адаптеров, определение `"auto"` или свой адаптер.

---

## Проверка

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## Дальнейшие шаги

- [Быстрый старт](/docs/ru-RU/x-to-openapi/quickstart/) — преобразуйте команду curl и коллекцию Postman и зарегистрируйте собственный адаптер.
- [Справочник API](/docs/ru-RU/x-to-openapi/api-reference/) — все экспорты и параметры.
