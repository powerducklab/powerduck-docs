---
sidebar_position: 3
title: "Быстрый старт"
description: "Запустите первый набор тестов с @powerduck/openapi-cli через CLI и из Node.js."
---

# Быстрый старт

Это руководство поможет протестировать первый документ OpenAPI.

## Предварительные требования

- Node.js `>= 22.12.0`.
- Документ OpenAPI 3.2 в формате **JSON**. YAML не принимается: сначала преобразуйте его в JSON. На верхнем уровне должен быть объект `paths`.

## 1. Запуск через CLI

Самый простой запуск загружает локальную спецификацию и тестирует все операции по первому URL сервера, указанному в документе:

```bash
openapi-cli --spec openapi.json
```

Переопределите целевой сервер и сохраните отчёты в выбранный каталог:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Протестируйте только операции `GET` удалённой спецификации с 10 параллельными исполнителями:

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

Для сложных настроек используйте конфигурационный файл JSON:

```bash
openapi-cli --config openapi-cli.config.json
```

Все флаги описаны в разделе [Команды](/docs/ru-RU/openapi-cli/commands/).

## 2. Создание минимальной спецификации

Минимальный документ OpenAPI с декларативными проверками:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Demo API", "version": "1.0.0" },
  "servers": [{ "url": "https://httpbin.org" }],
  "paths": {
    "/get": {
      "get": {
        "operationId": "getGet",
        "responses": { "200": { "description": "ok" } },
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "response under 5s", "assert": "responseTime", "max": 5000 }
        ]
      }
    }
  }
}
```

Если у операции **нет** проверок, исполнитель добавляет неявную проверку успеха протокола. Для HTTP требуется статус `2xx`, чтобы ответы 4xx/5xx не считались успешными без предупреждения.

## 3. Запуск из Node.js (программный API)

Библиотека предоставляет тот же процесс в виде функций: `resolveConfig` → `runTests` → генераторы отчётов.

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

// 1. Build a CliConfig from CLI-style args.
const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
});

// 2. Run all collected tests.
const report = await runTests(config);

// 3. Emit the reports you need.
printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

// 4. Exit with the correct code for CI.
if (report.summary.failed > 0 || report.summary.errors > 0) {
  process.exit(1);
}
```

`resolveConfig` принимает ту же структуру параметров, что и CLI. `runTests` возвращает `TestReport` с полями `summary`, `results`, `config`, `generatedAt` и `version`. [Настройка](/docs/ru-RU/openapi-cli/configuration/).

## 4. Коды завершения для CI

| Код | Значение |
|---|---|
| `0` | Все тесты пройдены либо задан `--no-fail-on-error`. |
| `1` | Один или несколько тестов не пройдены либо завершились с ошибкой. |
| `2` | Ошибка конфигурации, загрузки спецификации или критическая ошибка выполнения. |

## Следующие шаги

- [Настройка](/docs/ru-RU/openapi-cli/configuration/) — все поля `CliConfig` и значения по умолчанию.
- [Команды](/docs/ru-RU/openapi-cli/commands/) — все флаги CLI.
- [Примеры](/docs/ru-RU/openapi-cli/examples/) — аутентификация, фильтрация, отчёты и проверки.
- [Справочник API](/docs/ru-RU/openapi-cli/api-reference/) — все экспортируемые функции и типы.
