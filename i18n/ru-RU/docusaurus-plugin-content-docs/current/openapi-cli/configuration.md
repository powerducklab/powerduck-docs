---
sidebar_position: 6
title: "Настройка"
description: "Приоритет настройки: аргументы CLI > файл конфигурации > значения по умолчанию. Результат — объект CliConfig, возвращаемый resolveConfig."
---

# Настройка

Приоритет настройки: **аргументы CLI > файл конфигурации > значения по умолчанию**. Результат — объект `CliConfig`, возвращаемый [`resolveConfig`](./api-reference.md#resolveconfig).

## CliConfig

Основной тип конфигурации. Все поля, кроме `specPath`, необязательны.

| Поле | Тип | По умолчанию | Описание |
|-------|------|---------|-------------|
| `specPath` | `string` | **обязательно** | Путь или URL `http(s)://` к JSON-спецификации OpenAPI 3.2 |
| `serverUrl` | `string` | *(из спецификации)* | Переопределить базовый URL сервера из спецификации |
| `outputDir` | `string` | `"./openapi-cli-report"` | Каталог для файлов отчётов |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | Форматы создаваемых отчётов |
| `filter` | `FilterConfig` | `undefined` | Фильтр тестируемых операций |
| `concurrency` | `number` | `5` | Максимум одновременных запросов; целое число от 1 до 100 |
| `timeout` | `number` | `30000` | Тайм-аут запроса в мс, целое число от 1 до 600000; также применяется при загрузке удалённой спецификации |
| `proxy` | `string` | `undefined` | URL HTTP(S)-прокси, например `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | Настройка TLS и сертификатов |
| `headers` | `Record<string, string>` | `undefined` | Дополнительные заголовки для каждого запроса |
| `auth` | `AuthConfig` | `undefined` | Настройка аутентификации |
| `variables` | `Record<string, string>` | `undefined` | Подставляемые переменные Postman `{{name}}` |
| `failOnError` | `boolean` | `true` | Только CLI: ненулевой код после провала тестов; вызывающий код библиотеки проверяет отчёт |
| `envFile` | `string` | `undefined` | Путь к файлу `.env` с одной парой `KEY=VALUE` на строку |
| `grpcReflection` | `boolean` | автоматически | gRPC: сначала явная конфигурация, затем расширение операции; иначе включено при отсутствии путей proto |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC: пути к файлам `.proto` или каталогам |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP: транспорт операций MCP |
| `mcpCommand` | `string` | `undefined` | MCP stdio: запускаемая команда |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio: аргументы команды |
| `mcpCwd` | `string` | `undefined` | MCP stdio: рабочий каталог |

`ReportFormat` — объединение `"json" | "cli" | "html"`.

## Расширенные параметры выполнения

Следующие поля также входят в `CliConfig`. `requester`, `maxEvents`, `maxStreamMs` и `maxResponseSize` можно задать в JSON-файле. После разрешения конфигурации передайте `signal`, `httpRuntime` и `resolveTransport` непосредственно в `runTests()` из кода: это объекты времени выполнения, а не JSON-конфигурация.

```typescript
interface AdvancedRuntimeOptions {
  requester?: {
    followRedirects?: boolean;
    maxRedirects?: number;
    disableCookies?: boolean;
    protocolVersion?: "http1" | "http2" | "auto";
  };
  maxEvents?: number;
  maxStreamMs?: number;
  maxResponseSize?: number;
  signal?: AbortSignal;
  httpRuntime?: { certificates?: unknown; fileResolver?: unknown };
  resolveTransport?: (target: { protocol: string; url?: string }) => Promise<
    Pick<CliConfig, "proxy" | "tls" | "httpRuntime">
  >;
}
```

`requester` управляет HTTP-перенаправлениями, cookies и выбором протокола. Для HTTP/SSE значение `maxEvents` по умолчанию равно 50, а `maxStreamMs` при отсутствии заменяется на `timeout`; `maxResponseSize` передаётся среде выполнения запросов. gRPC использует `maxStreamMs` как срок завершения потока, затем `timeout`, затем 30000 мс. `signal` отменяет запуск; `httpRuntime` обеспечивает обработку HTTP-сертификатов и файлов; `resolveTransport` определяет параметры транспорта для каждой цели.

## DEFAULT_CONFIG

Объект встроенных значений по умолчанию, экспортируемый библиотекой:

```ts
export const DEFAULT_CONFIG: Required<
  Pick<
    CliConfig,
    "outputDir" | "formats" | "concurrency" | "timeout" | "failOnError" | "grpcReflection" | "mcpTransport"
  >
> = {
  outputDir: "./openapi-cli-report",
  formats: ["json", "cli", "html"],
  concurrency: 5,
  timeout: 30000,
  failOnError: true,
  grpcReflection: true,
  mcpTransport: "streamable-http",
};
```

## FilterConfig

| Поле | Тип | Описание |
|-------|------|-------------|
| `methods` | `string[]` | Тестировать только эти HTTP-методы, например `["get","post"]`; в файлах используйте нижний регистр, ввод CLI нормализуется |
| `paths` | `string[]` | Тестировать только пути, соответствующие одному из регулярных выражений; при некорректном выражении выполняется поиск подстроки |
| `tags` | `string[]` | Тестировать только операции с любым из этих тегов |
| `operationIds` | `string[]` | Тестировать только точные значения `operationId` |

Фильтр без ключей преобразуется в `undefined`: выполняются все операции.

## TlsConfig

| Поле | Тип | Описание |
|-------|------|-------------|
| `caCert` | `string` | Путь к набору сертификатов CA в формате PEM |
| `clientCert` | `string` | Путь к клиентскому сертификату PEM для mTLS |
| `clientKey` | `string` | Путь к закрытому ключу клиента PEM для mTLS |
| `strictSSL` | `boolean` | Пропустить проверку TLS-сертификата при `false`; небезопасно |
| `pfx` | `string` | Путь к набору сертификатов PFX; gRPC требует PEM |
| `passphrase` | `string` | Парольная фраза для зашифрованных материалов сертификата |

> Примечание: параметр CLI `--insecure` соответствует `tls.strictSSL = false`, то есть **отключает** проверку.

## AuthConfig

| Поле | Тип | Описание |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | Схема аутентификации; поддерживаемые имена указаны ниже |
| `parameters` | `Record<string, string \| number \| boolean>` | Параметры конкретной схемы для среды выполнения запросов |
| `token` | `string` | Токен Bearer для `type: "bearer"` |
| `username` | `string` | Имя пользователя для `type: "basic"` |
| `password` | `string` | Пароль для `type: "basic"` |
| `key` | `string` | Имя API-ключа для `type: "apikey"` |
| `value` | `string` | Значение API-ключа для `type: "apikey"` |
| `in` | `"header" \| "query"` | Место передачи API-ключа |

Поддерживаемые значения `type`: `bearer`, `basic`, `apikey`, `none`, `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` и `edgegrid`. Доступность и обязательные параметры зависят от протокола и среды выполнения запросов; одного имени недостаточно для настройки аутентификации.

Параметр CLI `--bearer` сейчас создаёт только `{ type: "bearer", token }`. Более подробные настройки `basic` / `apikey` задаются в файле конфигурации.

## JSON-файл конфигурации

Файл содержит обычный JSON, соответствующий `Partial<CliConfig>`. Передайте его через `--config <path>` / `-c`. Аргументы CLI всегда имеют приоритет над значениями файла.

```json
{
  "specPath": "./openapi.json",
  "serverUrl": "https://api.staging.example.com",
  "outputDir": "./reports",
  "formats": ["json", "html"],
  "concurrency": 10,
  "timeout": 15000,
  "failOnError": true,
  "proxy": "http://proxy.corp:8080",
  "tls": {
    "strictSSL": true,
    "caCert": "./ca-bundle.pem",
    "clientCert": "./client.crt",
    "clientKey": "./client.key"
  },
  "headers": {
    "X-API-Key": "${API_KEY}",
    "X-Environment": "staging"
  },
  "auth": {
    "type": "bearer",
    "token": "${BEARER_TOKEN}"
  },
  "variables": {
    "host": "api.staging.example.com"
  },
  "filter": {
    "methods": ["get", "post"],
    "tags": ["v2", "public"],
    "paths": ["^/api/v2"],
    "operationIds": ["getUser", "createUser"]
  },
  "grpcReflection": true,
  "grpcProtoPaths": ["./proto"],
  "mcpTransport": "streamable-http",
  "mcpCommand": "npx",
  "mcpArgs": ["-y", "@modelcontextprotocol/server-everything"],
  "mcpCwd": "./mcp-servers"
}
```

Отсутствие файла вызывает `Config file not found: <path>`, а некорректный JSON — `Invalid config file (must be JSON)`.

## Подстановка переменных окружения

После загрузки файла `.env` через `--env` / `envFile` ссылки `${VAR_NAME}` подставляются в следующие строковые поля:

- `serverUrl`
- `proxy`
- Значения `headers`
- `auth.token`
- Значения `variables`

Пример:

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

Поведение `.env`: существующие записи `process.env` **не** перезаписываются; обрамляющие одинарные и двойные кавычки удаляются; пустые строки и комментарии `#` игнорируются; отсутствующий файл молча пропускается.

## Создание конфигурации в коде

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

`resolveConfig` выбрасывает `"No OpenAPI spec path provided..."`, если спецификация не задана, и `Invalid proxy URL: <url>`, если `proxy` не является корректным URL.
