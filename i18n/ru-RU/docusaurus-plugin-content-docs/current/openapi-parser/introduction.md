---
sidebar_position: 1
title: "Введение"
description: "Преобразуйте любой документ Swagger 2.0, OpenAPI 3.0, 3.1 или 3.2 в OpenAPI 3.2 одним вызовом."
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

Преобразуйте любой документ Swagger 2.0, OpenAPI 3.0, 3.1 или 3.2 в OpenAPI 3.2 одним вызовом.

Тонкая обёртка над двумя библиотеками: [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
Она не реализует заново разбор, проверку или преобразование, а объединяет их и придаёт каждой ошибке единую предсказуемую структуру с машиночитаемым кодом.

- **Имя пакета:** `@powerduck/openapi-parser`
- **Версия:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **Лицензия:** MIT
- **Node.js:** >= 22.12.0

## Возможности

- **Одна функция для всех версий** — Swagger 2.0, OpenAPI 3.0.x, 3.1.x и 3.2.x преобразуются в проверенный документ 3.2.
- **Ввод в виде строк JSON и YAML** — Передайте уже разобранный объект или исходную строку JSON/YAML.
- **Машиночитаемые коды ошибок** — Каждый сбой представлен ошибкой `OpenApiUpgradeError` со значением перечисления `UpgradeErrorCode`.
- **Входные данные не изменяются** — Перед началом преобразования выполняется глубокое копирование входных данных через `structuredClone`.
- **Защита от циклических ссылок** — Циклы во входных данных обнаруживаются до того, как вызовут переполнение стека.
- **Проверка результата** — Преобразованный документ 3.2 по умолчанию проверяется по схеме.
- **ESM и CJS** — Используйте `import` в современном Node и сборщиках, а `require()` — в главном процессе Electron.

## Дальнейшие шаги

- [Установка](/docs/ru-RU/openapi-parser/installation/) — установка и требования
- [Быстрый старт](/docs/ru-RU/openapi-parser/quickstart/) — преобразование первого документа
- [Справочник API](/docs/ru-RU/openapi-parser/api-reference/) — все экспорты, коды ошибок и параметры
- [Примеры](/docs/ru-RU/openapi-parser/examples/) — обработка ошибок, параметры и использование CommonJS
