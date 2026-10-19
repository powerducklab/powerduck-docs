---
sidebar_position: 5
title: "Примеры"
description: "Практические примеры @powerduck/openapi-cli на основе реально поддерживаемых параметров CLI и программного API."
---

# Примеры

Практические примеры `@powerduck/openapi-cli` на основе реально поддерживаемых параметров CLI и программного API.

## 1. Базовый тест через CLI

Укажите локальный документ OpenAPI, чтобы выполнить все операции:

```bash
openapi-cli --spec openapi.json
```

Переопределите сервер и сохраните отчёты в выбранный каталог:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Проверьте спецификацию по удалённому URL:

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. Запуск из кода с аутентификацией

Используйте API библиотеки с токеном Bearer, собственными заголовками и настройкой параллелизма:

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  timeout: 15000,
  bearer: process.env.BEARER_TOKEN,
  header: ["X-Environment: staging", "X-Team: platform"],
});

const report = await runTests(config);

printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

console.log(
  `Passed ${report.summary.passed}/${report.summary.total} (${report.summary.passRate}%)`,
);
```

## 3. Запуск с фильтрацией

Выполните только часть операций по методу, тегу, регулярному выражению пути или operationId:

```bash
# Only GET and POST requests
openapi-cli --spec openapi.json --method get,post

# Only operations tagged "public" or "v2"
openapi-cli --spec openapi.json --tag public,v2

# Only paths under /api/v2
openapi-cli --spec openapi.json --path "^/api/v2"

# Only specific operations
openapi-cli --spec openapi.json --operation-id getUser,createUser
```

Конфигурация в коде, объединяющая эти фильтры: разные категории объединяются условием И, а теги внутри одной категории — условием ИЛИ.

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. Создание отчётов JSON и HTML

Выберите форматы вывода через `--format`. По умолчанию создаются все три:

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

Эквивалентный код:

```typescript
import { resolveConfig, runTests, generateJsonReport, generateHtmlReport } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  format: "json,html",
  output: "./reports",
});

const report = await runTests(config);

const jsonPath = generateJsonReport(report, config.outputDir);
const htmlPath = generateHtmlReport(report, config.outputDir);

console.log("Wrote", jsonPath, "and", htmlPath);
```

`generateJsonReport` записывает `report.json`, а `generateHtmlReport` — `report.html`. Обе функции создают выходной каталог при его отсутствии и возвращают путь к файлу.

## 5. Декларативные проверки в спецификации

Добавьте массив `x-tests` к операции. Каждая запись требует `name` и тип `assert`:

```json
{
  "paths": {
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "content-type is JSON", "assert": "header", "key": "content-type", "contains": "application/json" },
          { "name": "user id exists", "assert": "jsonPath", "path": "$.id", "exists": true },
          { "name": "user is active", "assert": "jsonPath", "path": "$.status", "equals": "active" },
          { "name": "response under 2s", "assert": "responseTime", "max": 2000 },
          { "name": "body contains email", "assert": "bodyContains", "contains": "@" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

Типы проверок:

| `assert` | Обязательные поля | Назначение |
|----------|-----------------|---------|
| `status` | `value` | HTTP-статус равен `value` |
| `header` | `key`; необязательно `contains` | Заголовок существует; при необходимости проверяется наличие подстроки |
| `bodyContains` | `contains` | Тело ответа содержит подстроку |
| `bodyEquals` | `body` | Тело ответа в точности равно `body` |
| `jsonPath` | `path`; необязательно `equals` / `exists` | Разрешить JSONPath и сравнить значение либо проверить его наличие |
| `responseTime` | `max` | Длительность должна быть `<= max` мс |

## 6. Скрипты Postman

Встройте тестовый скрипт в стиле Postman через `x-postman-scripts`:

```json
{
  "paths": {
    "/users": {
      "get": {
        "operationId": "listUsers",
        "x-postman-scripts": {
          "test": "pm.test('status is 200', () => pm.response.to.have.status(200)); pm.test('users is an array', () => pm.expect(pm.response.json().users).to.be.an('array'));"
        },
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

Декларативные `x-tests` и `x-postman-scripts` могут использоваться одновременно в одной операции.

## 7. Интеграция с CI через GitHub Actions

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Run API tests
        run: npx @powerduck/openapi-cli --spec openapi.json --server "$API_URL" --bearer "$BEARER_TOKEN" --output ./reports
        env:
          API_URL: ${{ secrets.API_URL }}
          BEARER_TOKEN: ${{ secrets.BEARER_TOKEN }}
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: openapi-cli-reports
          path: ./reports
```

По умолчанию провал тестов возвращает код завершения `1`, а ошибки конфигурации или фатальные ошибки выполнения — `2`, что приводит к сбою задания CI. Используйте `--no-fail-on-error`, чтобы завершённый запуск тестов не приводил к сбою конвейера; эта опция не подавляет ошибки конфигурации и фатальные ошибки.
