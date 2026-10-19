---
sidebar_position: 4
title: "Справочник API"
description: "Функции, параметры и коды ошибок основного и файлового уровней."
---

# Справочник API

## Основной уровень (`@powerduck/workspace-yaml/core`)

| Функция | Описание |
|----------|-------------|
| `createWorkspaceYaml(options?)` | Создаёт строку содержимого workspace.yaml |
| `createOpenApiYaml(options)` | Создаёт строку YAML для OpenAPI 3.2 |
| `createWorkspaceWithApi(options)` | Создаёт содержимое рабочей области и OpenAPI |
| `parseWorkspaceYaml(content)` | Разбирает и проверяет строку workspace.yaml |

### `createOpenApiYaml(options)` — Параметр

| Параметр | Тип | Обязателен | Описание |
|--------|------|----------|-------------|
| `title` | `string` | Да | Название API |
| `version` | `string` | Нет | По умолчанию `"1.0.0"` |
| `description` | `string` | Нет | Описание API |
| `contact` | `{ name?, url?, email? }` | Нет | Контактные данные |
| `license` | `{ name, url? }` | Нет | Информация о лицензии |
| `servers` | `Array<{ url, description? }>` | Нет | Список серверов |

## Файловый уровень (`@powerduck/workspace-yaml`)

| Функция | Описание |
|----------|-------------|
| `initializeWorkspace(options)` | Создаёт файл workspace.yaml на диске |
| `initializeOpenApi(options)` | Создаёт YAML-файл OpenAPI на диске |
| `createWorkspaceApi(options)` | Создаёт оба файла атомарно (откат при ошибке) |

### `createWorkspaceApi(options)` — Параметр

| Параметр | Тип | Обязателен | Описание |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | Да | Целевой каталог |
| `oasId` | `string` | Да | Уникальный идентификатор API |
| `name` | `string` | Да | Отображаемое имя |
| `file` | `string` | Нет | Относительный путь (по умолчанию: `oasFiles/${oasId}.openapi.yaml`) |
| `title` | `string` | Нет | Название API (по умолчанию: `name`) |
| `version` | `string` | Нет | Версия API (по умолчанию: `"1.0.0"`) |
| `overwriteOpenApi` | `boolean` | Нет | По умолчанию `false` |

## Ошибки

Все ошибки — экземпляры `WorkspaceYamlError` с машиночитаемым полем `code`:

| Код | Описание |
|------|-------------|
| `INVALID_ARGUMENT` | Недопустимый входной параметр |
| `ALREADY_EXISTS` | Файл уже существует, перезапись отключена (false) |
| `NOT_FOUND` | Файл не найден |
| `IO_ERROR` | Ошибка операции файловой системы |
| `INVALID_WORKSPACE` | Некорректная конфигурация рабочей области |
| `INVALID_OPENAPI` | Некорректный документ OpenAPI |
| `ROLLBACK_FAILED` | Ошибка отката транзакции |
