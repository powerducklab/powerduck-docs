---
sidebar_position: 4
title: "Справочник API"
description: "Справочник API пакетного запуска, запуска сценариев, конфигурации, проверок и генераторов отчётов в @powerduck/openapi-cli. Перечисленные ниже экспорты доступны из корня пакета."
---

# Справочник API

Справочник API пакетного запуска, запуска сценариев, конфигурации, проверок и генераторов отчётов в `@powerduck/openapi-cli`. Перечисленные ниже экспорты доступны из корня пакета.

## Обзор экспортов

| Экспорт | Вид | Описание |
|--------|------|-------------|
| `runTests` | функция | Выполняет все собранные операции и возвращает `TestReport` |
| `resolveConfig` | функция | Формирует `CliConfig` из аргументов, файла конфигурации и значений по умолчанию |
| `loadSpec` | асинхронная функция | Загружает спецификацию по локальному пути или удалённому URL и разрешает ссылки |
| `isRemoteSpec` | функция | Проверяет, начинается ли путь спецификации с `http(s)://` |
| `DEFAULT_CONFIG` | константа | Встроенные значения по умолчанию |
| `runDeclarativeAssertions` | функция | Выполняет массив проверок `DeclarativeAssertion` для ответа |
| `extractAssertions` | функция | Извлекает декларативные проверки `x-tests` из операции |
| `extractPostmanScripts` | функция | Извлекает строку тестового скрипта Postman из операции |
| `resolveJsonPath` | функция | Простой обработчик JSONPath: точечная запись и индексы массивов |
| `generateJsonReport` | функция | Записывает `report.json` на диск и возвращает путь к файлу |
| `generateCliReport` | функция | Формирует цветной текст отчёта CLI без вывода на экран |
| `printCliReport` | функция | Выводит отчёт CLI в стандартный поток вывода и возвращает строку |
| `generateHtmlReport` | функция | Записывает `report.html` на диск и возвращает путь к файлу |
| `CliArgs` | тип | Структура входных данных для обработки аргументов CLI и конфигурации |
| `DeclarativeAssertion` | тип | Объект одной декларативной проверки |
| `CliConfig` | тип | Основной интерфейс конфигурации |
| `TestReport` | тип | Полный отчёт, возвращаемый `runTests` |
| `TestResult` | тип | Результат тестирования одной операции |
| `TestSummary` | тип | Суммарное число успешных и неуспешных тестов |
| `AssertionResult` | тип | Результат одной проверки |
| `ReportFormat` | тип | `"json" \| "cli" \| "html"` |
| `ProtocolName` | тип | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | тип | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | тип | Настройки аутентификации |
| `TlsConfig` | тип | Настройки TLS и сертификатов |
| `FilterConfig` | тип | Фильтр операций |
| `collectOperations` | функция | Собирает операции с учётом фильтра пакетного запуска |
| `executeStep` | асинхронная функция | Выполняет одну операцию с настройками отдельного шага |
| `buildSummary` | функция | Вычисляет количество результатов и долю успешных тестов |
| `formatAssertionError` | функция | Преобразует ошибку проверки в понятный текст |
| `buildImplicitAssertions` | функция | Создаёт стандартные проверки для конкретного протокола |
| `runScenario` | асинхронная функция | Последовательно выполняет шаги с общими переменными и итерациями по данным |
| `resolveSteps` | функция | Разрешает все ссылки сценария до отправки запросов |
| `applyExtracts` | функция | Извлекает значения ответа в строковые переменные |
| `stepRef` | функция | Нормализует ссылку шага |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | типы | Определения входных данных сценария и извлечения значений |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | типы | Результаты сценария, события в реальном времени и параметры выполнения |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

Загружает спецификацию через `loadSpec`, собирает операции с учётом `config.filter` и выполняет их с ограничением параллелизма (`min(config.concurrency ?? 5, queue.length)`). Выполняет декларативные проверки и проверки Postman, добавляет неявные проверки протокола при отсутствии пользовательских проверок, сортирует результаты по пути, затем по методу и возвращает `TestReport`.

Возвращаемый `TestReport` имеет следующую структуру:

```ts
interface TestReport {
  summary: TestSummary;
  results: TestResult[];
  config: CliConfig;
  generatedAt: string; // ISO timestamp
  version: string;     // runner version string
}
```

## resolveConfig

```ts
resolveConfig(args: CliArgs): CliConfig
```

Объединяет `args` (параметры CLI), необязательный файл конфигурации JSON (`args.config`) и `DEFAULT_CONFIG`. Загружает определённый настройками `envFile`, если он есть, затем раскрывает ссылки `${ENV_VAR}` в `serverUrl`, `proxy`, значениях заголовков, `auth.token` и значениях переменных. Выбрасывает `"No OpenAPI spec path provided..."`, если спецификация не указана, и `Invalid proxy URL: <url>`, если `proxy` невозможно разобрать.

`CliArgs` соответствует параметрам CLI:

```ts
interface CliArgs {
  spec?: string;
  server?: string;
  output?: string;
  format?: string;
  method?: string;
  path?: string;
  tag?: string;
  operationId?: string;
  concurrency?: number;
  timeout?: number;
  proxy?: string;
  ca?: string;
  cert?: string;
  key?: string;
  insecure?: boolean;
  header?: string[];
  bearer?: string;
  variable?: string[];
  config?: string;
  env?: string;
  failOnError?: boolean;
  grpcReflection?: boolean;
  grpcProto?: string[];
  mcpTransport?: string;
  mcpCommand?: string;
  mcpArgs?: string;
  mcpCwd?: string;
}
```

## loadSpec

```ts
loadSpec(config: CliConfig): Promise<unknown>
```

Читает `config.specPath`. Если `isRemoteSpec` возвращает истину, загружает содержимое по HTTP(S), следуя не более чем 5 перенаправлениям, применяя `config.timeout` и отправляя `User-Agent: @powerduck/openapi-cli`; иначе читает локальный файл. Содержимое разбирается как JSON и должно быть объектом с объектом `paths`. Затем предпринимается попытка разрешить внутренние `$ref`; при неудаче спецификация остаётся без изменений.

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

Возвращает `true`, если `specPath` после удаления пробельных символов по краям соответствует `/^https?:\/\//i`.

## DEFAULT_CONFIG

```ts
const DEFAULT_CONFIG = {
  outputDir: "./openapi-cli-report",
  formats: ["json", "cli", "html"],
  concurrency: 5,
  timeout: 30000,
  failOnError: true,
  grpcReflection: true,
  mcpTransport: "streamable-http",
};
```

## Механизм проверок

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

Выполняет каждую декларативную проверку в контексте ответа. Ошибки вычисления записываются как неуспешный `AssertionResult`.

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

Собирает массивы `x-tests` сначала из элемента пути, затем из операции, оставляя только объекты с обоими полями `name` и `assert`.

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

Возвращает строку из `operation["x-postman-scripts"].test`, если она есть.

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

Простой обработчик с поддержкой префикса `$.` или `$`, точечной записи и числовых индексов массивов, например `$.data.items[0].id`. Возвращает `undefined`, если сегмент пути отсутствует.

### DeclarativeAssertion

```ts
interface DeclarativeAssertion {
  name: string;
  assert: "status" | "header" | "bodyContains" | "jsonPath" | "responseTime" | "bodyEquals";
  value?: number;     // assert=status
  key?: string;       // assert=header
  contains?: string;  // assert=header / bodyContains
  path?: string;      // assert=jsonPath
  equals?: unknown;   // assert=jsonPath
  exists?: boolean;   // assert=jsonPath
  max?: number;       // assert=responseTime
  body?: string;      // assert=bodyEquals
}
```

## Генераторы отчётов

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

Отчёт может содержать заголовки и тела запросов, переменные и настройки аутентификации; удалите конфиденциальные значения перед передачей или сохранением отчёта.

Рекурсивно создаёт `outputDir` и записывает `report.json` с помощью `JSON.stringify(report, null, 2)`. Возвращает абсолютный путь к файлу.

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

Формирует цветной текст отчёта CLI с управляющими последовательностями ANSI: заголовок, сводка, индикатор выполнения, строки результатов и подробности проверок. Не выводит текст на экран.

### printCliReport

```ts
printCliReport(report: TestReport): string
```

Вызывает `generateCliReport`, выводит результат через `console.log` и возвращает строку.

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

Создаёт `outputDir` и записывает автономный `report.html` со сводкой, индикатором выполнения, кнопками фильтрации, раскрываемыми строками и светлой/тёмной темой. Возвращает путь к файлу.

## Типы результатов

### TestResult

```ts
interface TestResult {
  operationId: string;
  path: string;
  method: string;
  protocol: ProtocolName | string;
  status: TestStatus;
  durationMs: number;
  request?: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: unknown;
    target?: string;
  };
  response?: {
    status?: number;
    statusText?: string;
    contentType?: string;
    sizeBytes?: number;
    body?: unknown;
    text?: string;
    headers?: Record<string, string>;
    events?: unknown[];
    streaming?: boolean;
  };
  assertions?: AssertionResult[];
  error?: string;
  timestamp: string;
}
```

### TestSummary

```ts
interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  errors: number;
  skipped: number;
  durationMs: number;
  passRate: number; // rounded to one decimal
}
```

### AssertionResult

```ts
interface AssertionResult {
  name: string;
  passed: boolean;
  error?: string;
}
```

## Запуск сценариев

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

Выполняет шаги по порядку с общей областью переменных для каждой итерации сценария. До выполнения разрешает все ссылки на операции и игнорирует фильтр пакетного запуска, поэтому можно использовать любую операцию спецификации. Начальные переменные берутся из конфигурации и сценария; извлечённые значения становятся доступны следующим шагам. `stopOnFailure` по умолчанию равен `true`. `options.signal` отменяет запуск, а оставшиеся шаги отмечаются как пропущенные; исключения в обработчиках `onEvent` не прерывают выполнение.

Поле `data` на уровне сценария запускает всю последовательность с новой областью переменных для каждой строки. `iterations` позволяет запросить дополнительные повторы; фактическое количество равно большему из указанного числа и числа строк, но не превышает 1000. Поле `request.data` на уровне шага повторяет этот шаг; в общей области сохраняются только значения, извлечённые при последнем выполнении.

### Типы сценариев

Следующие объявления описывают входные и выходные данные сценариев. `ScenarioDataRow` и `ScenarioIterations` — вспомогательные структуры, приведённые для ясности; они не являются именованными экспортами из корня пакета. Их структуры доступны через публичные интерфейсы.

```ts
import type { RequestValues } from "@powerduck/openapi-request";

interface ScenarioExtract {
  name: string;
  from: "body" | "header" | "status";
  path?: string;
  key?: string;
}

type ScenarioDataRow = Record<string, string>;

interface ScenarioStepRequest {
  values?: RequestValues;
  serverUrl?: string;
  extract?: ScenarioExtract[];
  assertions?: DeclarativeAssertion[];
  data?: ScenarioDataRow[];
}

interface ScenarioStep {
  ref?: string;
  method?: string;
  path?: string;
  name?: string;
  request?: ScenarioStepRequest;
  skip?: boolean;
}

interface ScenarioDefinition {
  name: string;
  description?: string;
  steps: ScenarioStep[];
  variables?: Record<string, string>;
  stopOnFailure?: boolean;
  data?: ScenarioDataRow[];
  iterations?: number;
}

type ScenarioStatus = "passed" | "failed" | "error" | "cancelled";

interface ScenarioStepResult extends TestResult {
  index: number;
  ref: string;
  name?: string;
  scenarioIteration?: number;
  scenarioIterations?: number;
  stepIteration?: number;
  stepIterations?: number;
  extracted?: Record<string, string>;
  variablesAfter?: Record<string, string>;
  notRun?: boolean;
  notRunReason?: string;
}

type ScenarioEventType =
  | "scenario:start"
  | "step:start"
  | "step:finish"
  | "step:skip"
  | "scenario:finish"
  | "scenario:cancel";

interface ScenarioEvent {
  type: ScenarioEventType;
  scenario: string;
  stepIndex?: number;
  step?: ScenarioStepResult;
  status?: ScenarioStatus;
  message?: string;
  scenarioIteration?: number;
  scenarioIterations?: number;
  stepIteration?: number;
  stepIterations?: number;
}

interface ScenarioIterations {
  scenarioCount: number;
  stepCounts: number[];
}

interface ScenarioReport {
  name: string;
  description?: string;
  status: ScenarioStatus;
  summary: TestSummary;
  steps: ScenarioStepResult[];
  variables: Record<string, string>;
  iterations?: ScenarioIterations;
  config: CliConfig;
  startedAt: string;
  durationMs: number;
  generatedAt: string;
  version: string;
}

interface RunScenarioOptions {
  config: CliConfig;
  spec?: unknown;
  onEvent?: (event: ScenarioEvent) => void;
  signal?: AbortSignal;
}
```

### stepRef и resolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

`stepRef` отдаёт приоритет явно указанным `method` и `path`; иначе нормализует `ref`, сохраняя operationId без префикса. `resolveSteps` возвращает элементы с `step`, `op` и нормализованным `ref`; выбрасывает исключение, если не найдена хотя бы одна ссылка, в том числе у пропускаемых шагов.

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

Читает значения тела через JSONPath, заголовки без учёта регистра или статус ответа. Отсутствующие значения и null пропускаются; остальные преобразуются в строки, а объекты сериализуются в JSON.

## Вспомогательные функции запуска

Сигнатуры вспомогательных функций используют типы, которые не экспортируются по имени из корня пакета. Выводите их из публичных функций, а не импортируйте внутренние файлы:

```ts
import { collectOperations, executeStep, resolveSteps } from "@powerduck/openapi-cli";

type OperationInfo = ReturnType<typeof collectOperations>[number];
type StepExecutionOptions = Parameters<typeof executeStep>[2];
type StepExecution = Awaited<ReturnType<typeof executeStep>>;
type ResolvedStep = ReturnType<typeof resolveSteps>[number];
```

### collectOperations

```ts
collectOperations(spec: any, config: CliConfig): OperationInfo[]
```

Собирает стандартные и дополнительные операции, при необходимости назначает запасной operationId, определяет протокол и применяет `config.filter`. Каждый элемент содержит `path`, `method`, `operation`, `pathItem`, `operationId` и `protocol`.

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

`client` создаётся функцией `createClient` из `@powerduck/openapi-request`. В параметрах обязательны `config` и `spec`; `signal`, `variables`, `values`, `serverUrl` и `extraAssertions` необязательны. Результат содержит `result`, нормализованный `response`, необязательный `request` и область переменных `env`, созданную скриптами. Пакетный запуск и запуск сценариев используют один и тот же механизм выполнения.

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

Подсчитывает успешные, неуспешные, ошибочные и пропущенные результаты. Доля успешных тестов равна числу успешных результатов, делённому на общее число, с округлением до одного десятичного знака; для пустого набора она равна нулю.

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

Получает понятное сообщение из строки, Error, поля `message` или `msg`; в крайнем случае использует сериализацию. Для входного значения, ложного в логическом контексте, возвращает `undefined`.

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

Создаёт проверки из раздела [Неявные проверки](#implicit-assertions). Для неизвестных протоколов неявные проверки не создаются.

## Неявные проверки {#implicit-assertions}

Если операция не определяет ни `x-tests`, ни скрипт Postman, исполнитель добавляет одну неявную проверку для соответствующего протокола:

| Протокол | Неявная проверка |
|----------|----------------|
| `http`, `sse` | Статус HTTP — `2xx` |
| `graphql` | Статус HTTP — `2xx` **и** на верхнем уровне нет непустого массива `errors` |
| `grpc` | Код статуса gRPC — `0` (OK) |
| `mcp` | Ответ JSON-RPC содержит `result` и не содержит `error` |
| `websocket` | Соединение достигло состояния `open` без события ошибки |