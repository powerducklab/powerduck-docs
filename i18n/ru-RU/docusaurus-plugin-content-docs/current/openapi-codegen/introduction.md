---
sidebar_position: 1
title: "Введение"
description: "Создавайте исполняемые HTTP-примеры из OpenAPI с @powerduck/openapi-codegen: 21 язык, 41 клиент, поддержка браузера, без зависимостей времени выполнения."
---

# Введение

`@powerduck/openapi-codegen` — библиотека TypeScript, преобразующая операцию OpenAPI в **исполняемый пример HTTP-запроса** на выбранном языке и с выбранным HTTP-клиентом. Она предназначена для сайтов API-документации, порталов разработчиков, обозревателей API, CLI-инструментов и генерации кода при сборке.

Поддерживает **21 язык** и **41 комбинацию языка и клиента**, **работает в браузере** и **не имеет зависимостей времени выполнения**.

## Зачем нужен openapi-codegen

- **Без зависимостей времени выполнения** — работает в браузере, Node.js, Electron и edge-средах без встроенных модулей Node.
- **Два формата модулей** — сборки для нативного ESM и CommonJS (`require()`).
- **OpenAPI 3.0 / 3.1 / 3.2** — обрабатывает разобранный объект документа. JSON и YAML поддерживаются после разбора перед вызовом `generate()`.
- **41 встроенный генератор** для 21 языка; автоматически регистрируются при импорте.
- **Полная сериализация параметров** — путь, query, header и cookie по правилам OpenAPI `style` / `explode` / `allowReserved`.
- **Схемы безопасности** — API-ключ в header/query/cookie, HTTP bearer и HTTP basic.
- **Типы тела** — JSON, обычный текст, URL-кодированная форма и `multipart/form-data`.
- **Разрешение `$ref`** — JSON Pointer внутри документа с кешированием, цепочками ссылок и обнаружением циклов.
- **Автоматические примеры** — значения выводятся из JSON Schema: `example`, `enum`, `default`, типов, форматов и ограничений.
- **Плагины** — регистрация собственных генераторов через `register()` или `use()`.

## Как это работает

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize` разрешает `$ref`, объединяет параметры пути и операции, выбирает тип содержимого тела, создаёт примеры значений, разрешает схемы безопасности и формирует нормализованный `RequestIR`.
2. Выбранный `Generator` получает `RequestIR` и возвращает строку исполняемого исходного кода.

Обычно достаточно вызвать `generate({...})`: он выполнит оба шага.

## Базовый пример

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## Следующие шаги

- [Установка](/docs/ru-RU/openapi-codegen/installation/) — npm / yarn / pnpm и использование в браузере.
- [Быстрый старт](/docs/ru-RU/openapi-codegen/quickstart/) — Создание первого фрагмента и просмотр списка генераторов.
- [Настройка](/docs/ru-RU/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Справочник API](/docs/ru-RU/openapi-codegen/api-reference/) — Все экспорты и полный список языков и клиентов.
- [Примеры](/docs/ru-RU/openapi-codegen/examples/) — fetch, Python requests, cURL, собственные генераторы, плагины и прямой `RequestIR`.
