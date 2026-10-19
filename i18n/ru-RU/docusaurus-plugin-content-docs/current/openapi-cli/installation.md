---
sidebar_position: 2
title: "Установка"
description: "Установите @powerduck/openapi-cli глобально, как зависимость разработки или запускайте через npx. Требуется Node.js 22.12.0 или новее."
---

# Установка

## Требования

- **Node.js**: `>= 22.12.0` (указано в поле `engines` пакета).
- Менеджер пакетов: npm, yarn или pnpm.

Пакет содержит сборки ESM (`dist/index.js`) и CommonJS (`dist/index.cjs`), а также декларации TypeScript (`dist/index.d.ts`). Дополнительные пакеты `@types` не нужны.

## Глобальная установка (рекомендуется для CLI)

Глобальная установка делает программу `openapi-cli` доступной через `PATH`:

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

Проверьте программу:

```bash
openapi-cli --help
```

## Установка в проект (рекомендуется для CI)

Зафиксируйте версию в проекте, чтобы CI использовала известный выпуск:

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

Затем запустите команду через менеджер пакетов:

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## Разовый запуск через npx

Без предварительной установки:

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## Структура пакета

| Точка входа | Путь |
|-------|------|
| Вход ESM | `dist/index.js` |
| Вход CommonJS | `dist/index.cjs` |
| Определения типов | `dist/index.d.ts` |
| Вход CLI (bin) | `dist/cli.js` |
| Имя программы | `openapi-cli` |

Пакет объявляет `"type": "module"` и экспортирует только подпути `.` и `./package.json`.

## Импорт в коде

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## Зависимости времени выполнения

Опубликованный пакет зависит от:

- `@powerduck/openapi-parser` (`^0.3.12`) — разыменование внутренних ссылок `$ref`.
- `@powerduck/openapi-request` (`0.2.22`) — выполнение запросов по протоколам.
- `commander` (`^12.1.0`) — разбор аргументов CLI.
- `https-proxy-agent` (`^5.0.1`) — поддержка прокси для транспорта HTTP.

## Дальнейшие шаги

- [Быстрый старт](/docs/ru-RU/openapi-cli/quickstart/) — запустите первый набор тестов.
- [Команды](/docs/ru-RU/openapi-cli/commands/) — полный справочник параметров.
