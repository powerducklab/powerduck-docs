---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi — расширяемый TypeScript-фреймворк, который преобразует команды curl и коллекции Postman (v2.0 / v2.1.0) в документы OpenAPI 3.2. Он подходит для CI-конвейеров, генерации документации API и восстановления интерфейсов по HTTP-запросам."
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** — расширяемый TypeScript-фреймворк, который преобразует **команды curl** и **коллекции Postman (v2.0 / v2.1.0)** в документы **OpenAPI 3.2**. Он подходит для CI-конвейеров, генерации документации API и восстановления интерфейсов по HTTP-запросам.

Для проверки документов используется [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser).

- **Версия:** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **Лицензия:** MIT
- **Требования к Node.js:** `>= 22.12.0`
- **Результат:** только OpenAPI **3.2.0**
- **Исходный код:** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## Как это работает

```text
команда curl → CurlAdapter
коллекция Postman → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → документ OpenAPI 3.2
             ↓
     validateOpenApi32() → диагностика
```

1. **Адаптер** разбирает источник, например текст curl или коллекцию Postman, в список объектов [`NormalizedRequest`](./api-reference.md#normalizedrequest).
2. **Генератор** объединяет запросы по методу и пути, выводит схемы, параметры пути и определения безопасности, затем создаёт документ OpenAPI 3.2.
3. **Валидатор** проверяет результат по схеме OpenAPI через `@powerduck/openapi-parser` и возвращает диагностические сообщения.

---

## Возможности

- **Два встроенных адаптера:** [`CurlAdapter`](./api-reference.md#curladapter) поддерживает отдельные команды, наборы команд и результат браузерной команды «Copy all as cURL»; [`PostmanAdapter`](./api-reference.md#postmanadapter) поддерживает v2.0/v2.1.0, вложенные папки и наследование аутентификации.
- **Функции без настройки:** [`curlToOpenApi`](./api-reference.md#curltoopenapi) и [`postmanToOpenApi`](./api-reference.md) регистрируют адаптер и выполняют преобразование одним вызовом.
- **Вывод OpenAPI 3.2:** каждый документ объявляет `openapi: "3.2.0"`. Проверка включена по умолчанию. Проверяйте диагностику или включите строгий режим, чтобы отклонять результат при ошибках.
- **Объединение запросов:** операции с одинаковыми методом и путём объединяются; параметры строки запроса, заголовков, cookie и схемы тела объединяются структурно.
- **Вывод параметров пути:** числовые ID, UUID, ULID и длинные шестнадцатеричные сегменты превращаются в шаблоны вроде `/users/{userId}`, если различаются минимум в N образцах.
- **Вывод настроек безопасности:** обнаруживаются Bearer, Basic и ключи API в заголовках, строке запроса или cookie, создаются соответствующие `securitySchemes`.
- **Разные типы тела:** JSON, XML, form-urlencoded, multipart/form-data с текстом и файлами, GraphQL, текст и двоичные данные.
- **Сохранение тестов Postman:** `pm.test()` / `pm.expect()` выводятся как `x-postman-scripts` у каждой операции.
- **Диагностика:** каждая проблема содержит уровень серьёзности, код и сведения об источнике, если они доступны; режим [`strict`](./api-reference.md#convertoptions) вызывает исключение при ошибках.
- **Расширяемость:** реализуйте [`SourceAdapter`](./api-reference.md), чтобы добавить источники HAR, HTTPie или Insomnia.

---

## Архитектура плагинов

Фреймворк построен вокруг небольшого интерфейса адаптера:

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

Адаптеры регистрируются в экземпляре [`XToOpenApi`](./api-reference.md#xtoopenapi) через [`AdapterRegistry`](./api-reference.md#adapterregistry):

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

Функции без настройки уже подключают оба встроенных адаптера, поэтому обычно обращаться к реестру напрямую не требуется.

---

## Вспомогательные функции или класс?

| Задача | API |
|---|---|
| Преобразовать одну или несколько команд curl | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| Преобразовать коллекцию Postman в виде объекта или строки | [`postmanToOpenApi`](./api-reference.md) |
| Свои параметры, несколько адаптеров, определение `"auto"` или собственный адаптер | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## Далее

- [Установка](./installation.md) — добавьте пакет и изучите функции без настройки.
- [Быстрый старт](./quickstart.md) — преобразуйте команды curl, коллекции Postman и используйте собственный адаптер.
- [Справочник API](./api-reference.md) — все экспорты, типы, параметры, значения по умолчанию и диагностические коды.
- [Примеры](./examples.md) — curl, наборы команд, коллекции Postman, собственные адаптеры и вывод параметров пути.
