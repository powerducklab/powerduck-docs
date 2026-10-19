---
sidebar_position: 1
title: "Введение"
description: "Надёжное создание файлов workspace.yaml и YAML-файлов OpenAPI 3.2. Совместим с браузером: чистые функции создают строки YAML без доступа к файловой системе. В Node.js / Electron дополняет основной уровень атомарной записью, блокировкой файлов и нормализацией путей."
keywords: ["workspace-yaml", "powerduck", "YAML", "OpenAPI"]
---

# @powerduck/workspace-yaml

Надёжное создание файлов workspace.yaml и YAML-файлов OpenAPI 3.2.

Двухуровневая архитектура:
- **Основной уровень**: Совместим с браузером: чистые функции создают строки YAML без доступа к файловой системе.
- **Файловый уровень**: В Node.js / Electron дополняет основной уровень атомарной записью, блокировкой файлов и нормализацией путей.

- **Имя пакета:** `@powerduck/workspace-yaml`
- **Версия:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **Лицензия:** MIT

Эта библиотека **только создаёт файлы** и предназначена для создания новых файлов, в том числе вручную. Она **не** реализует повторно чтение, применение патчей или обновление YAML-файлов. Для этих операций используйте [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## Дальнейшие шаги

- [Установка](/docs/ru-RU/workspace-yaml/installation/)
- [Быстрый старт](/docs/ru-RU/workspace-yaml/quickstart/)
- [Справочник API](/docs/ru-RU/workspace-yaml/api-reference/)
- [Примеры](/docs/ru-RU/workspace-yaml/examples/)
