---
sidebar_position: 4
title: "Referência da API"
description: "Referência da API dos executores em lote e de cenários, da configuração, das asserções e dos geradores de relatórios de @powerduck/openapi-cli. As exportações abaixo estão disponíveis na raiz do pacote."
---

# Referência da API

Referência da API dos executores em lote e de cenários, da configuração, das asserções e dos geradores de relatórios de `@powerduck/openapi-cli`. As exportações abaixo estão disponíveis na raiz do pacote.

## Visão geral das exportações

| Exportação | Tipo | Descrição |
|--------|------|-------------|
| `runTests` | função | Executa todas as operações coletadas e retorna um `TestReport` |
| `resolveConfig` | função | Resolve um `CliConfig` a partir dos argumentos, do arquivo de configuração e dos padrões |
| `loadSpec` | função assíncrona | Carrega uma especificação de um caminho local ou URL remota e resolve suas referências |
| `isRemoteSpec` | função | Indica se o caminho da especificação começa com `http(s)://` |
| `DEFAULT_CONFIG` | constante | Valores padrão integrados |
| `runDeclarativeAssertions` | função | Avalia um array de `DeclarativeAssertion` com base em uma resposta |
| `extractAssertions` | função | Extrai as asserções declarativas `x-tests` de uma operação |
| `extractPostmanScripts` | função | Extrai o texto do script de testes do Postman de uma operação |
| `resolveJsonPath` | função | Resolvedor básico de JSONPath (notação de ponto e índices de arrays) |
| `generateJsonReport` | função | Grava `report.json` no disco e retorna o caminho |
| `generateCliReport` | função | Gera o texto colorido do relatório da CLI sem imprimi-lo |
| `printCliReport` | função | Imprime o relatório da CLI na saída padrão e retorna o texto |
| `generateHtmlReport` | função | Grava `report.html` no disco e retorna o caminho |
| `CliArgs` | tipo | Estrutura de entrada para resolver argumentos da CLI e configuração |
| `DeclarativeAssertion` | tipo | Objeto de uma asserção declarativa |
| `CliConfig` | tipo | Interface central de configuração |
| `TestReport` | tipo | Relatório completo retornado por `runTests` |
| `TestResult` | tipo | Resultado dos testes de uma operação |
| `TestSummary` | tipo | Contagens agregadas de aprovações e falhas |
| `AssertionResult` | tipo | Resultado de uma asserção |
| `ReportFormat` | tipo | `"json" \| "cli" \| "html"` |
| `ProtocolName` | tipo | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | tipo | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | tipo | Configuração de autenticação |
| `TlsConfig` | tipo | Configuração de TLS e certificados |
| `FilterConfig` | tipo | Filtro de operações |
| `collectOperations` | função | Coleta operações aplicando o filtro de execução em lote |
| `executeStep` | função assíncrona | Executa uma operação com substituições específicas do passo |
| `buildSummary` | função | Calcula contagens e taxa de aprovação a partir dos resultados |
| `formatAssertionError` | função | Converte um erro de asserção em texto legível |
| `buildImplicitAssertions` | função | Cria asserções padrão específicas de cada protocolo |
| `runScenario` | função assíncrona | Executa passos em ordem com variáveis compartilhadas e iterações orientadas por dados |
| `resolveSteps` | função | Resolve todas as referências do cenário antes de enviar requisições |
| `applyExtracts` | função | Extrai valores da resposta para variáveis de texto |
| `stepRef` | função | Normaliza a referência de um passo |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | tipos | Definições de entrada e extração do cenário |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | tipos | Resultados, eventos em tempo real e opções de execução do cenário |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

Carrega a especificação com `loadSpec`, coleta operações respeitando `config.filter` e as executa com concorrência limitada (`min(config.concurrency ?? 5, queue.length)`). Executa asserções declarativas e do Postman, adiciona asserções implícitas do protocolo quando não há asserções do usuário, ordena os resultados por caminho e depois por método e retorna um `TestReport`.

O `TestReport` retornado tem a seguinte estrutura:

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

Combina `args` (opções da CLI), um arquivo JSON de configuração opcional (`args.config`) e `DEFAULT_CONFIG`. Carrega o `envFile` resolvido, se houver, e expande referências `${ENV_VAR}` em `serverUrl`, `proxy`, valores de cabeçalhos, `auth.token` e valores de variáveis. Lança `"No OpenAPI spec path provided..."` quando nenhuma especificação é informada e `Invalid proxy URL: <url>` quando `proxy` não pode ser interpretado.

`CliArgs` corresponde às opções da CLI:

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

Lê `config.specPath`. Se `isRemoteSpec` for verdadeiro, busca o conteúdo por HTTP(S), seguindo até 5 redirecionamentos, aplicando `config.timeout` e enviando `User-Agent: @powerduck/openapi-cli`; caso contrário, lê o arquivo local. O conteúdo é interpretado como JSON e deve ser um objeto com um objeto `paths`. Em seguida, tenta resolver os `$ref` internos; se isso falhar, mantém a especificação intacta.

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

Retorna `true` quando `specPath`, sem espaços nas extremidades, corresponde a `/^https?:\/\//i`.

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

## Motor de asserções

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

Avalia cada asserção declarativa no contexto de uma resposta. Erros de avaliação são registrados como um `AssertionResult` com falha.

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

Coleta os arrays `x-tests` do item de caminho e da operação, nessa ordem, mantendo apenas objetos com `name` e `assert`.

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

Retorna o texto em `operation["x-postman-scripts"].test`, se existir.

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

Resolvedor básico com suporte ao prefixo `$.` ou `$`, à notação de ponto e a índices numéricos de arrays, como `$.data.items[0].id`. Retorna `undefined` quando um segmento não existe.

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

## Geradores de relatórios

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

O relatório pode conter cabeçalhos, corpos de requisições, variáveis e configurações de autenticação; remova valores sensíveis antes de compartilhá-lo ou salvá-lo.

Cria `outputDir` recursivamente e grava `report.json` usando `JSON.stringify(report, null, 2)`. Retorna o caminho absoluto.

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

Gera o texto colorido do relatório da CLI com sequências de escape ANSI: cabeçalho, resumo, barra de progresso, linhas de resultados e detalhes das asserções. Não imprime o texto.

### printCliReport

```ts
printCliReport(report: TestReport): string
```

Chama `generateCliReport`, imprime o resultado com `console.log` e retorna o texto.

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

Cria `outputDir` e grava um `report.html` autossuficiente com resumo, barra de progresso, botões de filtro, linhas expansíveis e modos claro e escuro. Retorna o caminho do arquivo.

## Tipos de resultado

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

## Executor de cenários

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

Executa os passos em ordem, com um escopo de variáveis compartilhado em cada iteração. Resolve todas as referências de operações antes da execução e ignora o filtro em lote, permitindo usar qualquer operação da especificação. As variáveis iniciais vêm da configuração e do cenário; os valores extraídos ficam disponíveis nos passos seguintes. `stopOnFailure` é `true` por padrão. `options.signal` cancela a execução e os passos restantes são registrados como ignorados; exceções nos ouvintes de `onEvent` não interrompem a execução.

O campo `data` do cenário executa toda a sequência com um novo escopo por linha. `iterations` permite solicitar repetições adicionais; a contagem efetiva é o maior valor entre a quantidade declarada e o número de linhas, limitada a 1000. O campo `request.data` de um passo repete esse passo, e apenas as extrações da última execução permanecem no escopo compartilhado.

### Tipos de cenário

As declarações abaixo descrevem as entradas e saídas dos cenários. `ScenarioDataRow` e `ScenarioIterations` são estruturas auxiliares apresentadas para facilitar a leitura; não são exportações nomeadas da raiz do pacote. Suas estruturas podem ser acessadas pelas interfaces públicas.

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

### stepRef e resolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

`stepRef` prioriza `method` e `path` explícitos; caso contrário, normaliza `ref` preservando um operationId sem prefixo. `resolveSteps` retorna entradas com `step`, `op` e a referência `ref` normalizada; lança uma exceção se qualquer referência não for encontrada, inclusive em passos ignorados.

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

Lê valores do corpo via JSONPath, cabeçalhos sem diferenciar maiúsculas de minúsculas ou o status da resposta. Omite valores ausentes e nulos; converte os demais em texto, serializando objetos como JSON.

## Funções auxiliares do executor

As assinaturas auxiliares usam tipos que não são exportações nomeadas da raiz. Infira esses tipos a partir das funções públicas em vez de importar arquivos internos:

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

Coleta operações padrão e adicionais, atribui um operationId alternativo quando necessário, infere o protocolo e aplica `config.filter`. Cada entrada contém `path`, `method`, `operation`, `pathItem`, `operationId` e `protocol`.

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

O `client` vem de `createClient` em `@powerduck/openapi-request`. As opções exigem `config` e `spec`; `signal`, `variables`, `values`, `serverUrl` e `extraAssertions` são opcionais. A saída contém `result`, a resposta `response` normalizada, `request` opcional e o escopo de variáveis `env` produzido pelos scripts. Os executores em lote e de cenários compartilham esse fluxo de execução.

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

Conta os resultados aprovados, reprovados, com erro e ignorados. A taxa de aprovação é a quantidade de aprovados dividida pelo total, arredondada para uma casa decimal; sem resultados, a taxa é zero.

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

Obtém uma mensagem legível de um texto, Error ou campo `message` ou `msg`; como último recurso, serializa o valor. Uma entrada falsa em contexto booleano retorna `undefined`.

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

Cria as verificações descritas em [Asserções implícitas](#implicit-assertions). Protocolos desconhecidos não geram verificações implícitas.

## Asserções implícitas {#implicit-assertions}

Quando uma operação não define `x-tests` nem um script do Postman, o executor adiciona uma asserção implícita específica do protocolo:

| Protocolo | Verificação implícita |
|----------|----------------|
| `http`, `sse` | O status HTTP é `2xx` |
| `graphql` | O status HTTP é `2xx` **e** não há um array `errors` não vazio no nível superior |
| `grpc` | O código de status gRPC é `0` (OK) |
| `mcp` | A resposta JSON-RPC contém `result` e não contém `error` |
| `websocket` | A conexão atingiu o estado `open` sem eventos de erro |