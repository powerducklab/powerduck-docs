---
sidebar_position: 4
title: "Referencia de la API"
description: "Referencia de la API del ejecutor por lotes, el ejecutor de escenarios, la configuración, las aserciones y los generadores de informes de @powerduck/openapi-cli. Las exportaciones siguientes están disponibles desde la raíz del paquete."
---

# Referencia de la API

Referencia de la API del ejecutor por lotes, el ejecutor de escenarios, la configuración, las aserciones y los generadores de informes de `@powerduck/openapi-cli`. Las exportaciones siguientes están disponibles desde la raíz del paquete.

## Resumen de exportaciones

| Exportación | Tipo | Descripción |
|--------|------|-------------|
| `runTests` | función | Ejecuta todas las operaciones recopiladas y devuelve un `TestReport` |
| `resolveConfig` | función | Resuelve un `CliConfig` a partir de argumentos, archivo de configuración y valores predeterminados |
| `loadSpec` | función asíncrona | Carga una especificación desde una ruta local o una URL remota y resuelve sus referencias |
| `isRemoteSpec` | función | Indica si la ruta de la especificación empieza por `http(s)://` |
| `DEFAULT_CONFIG` | constante | Valores predeterminados integrados |
| `runDeclarativeAssertions` | función | Evalúa un array de `DeclarativeAssertion` frente a una respuesta |
| `extractAssertions` | función | Extrae las aserciones declarativas `x-tests` de una operación |
| `extractPostmanScripts` | función | Extrae el script de pruebas de Postman de una operación |
| `resolveJsonPath` | función | Resolución básica de JSONPath (notación de puntos e índices de arrays) |
| `generateJsonReport` | función | Escribe `report.json` en disco y devuelve su ruta |
| `generateCliReport` | función | Genera el texto del informe de CLI con colores, sin imprimirlo |
| `printCliReport` | función | Imprime el informe de CLI en la salida estándar y devuelve el texto |
| `generateHtmlReport` | función | Escribe `report.html` en disco y devuelve su ruta |
| `CliArgs` | tipo | Estructura de la entrada para resolver la configuración y los argumentos de CLI |
| `DeclarativeAssertion` | tipo | Objeto de una aserción declarativa |
| `CliConfig` | tipo | Interfaz principal de configuración |
| `TestReport` | tipo | Informe completo devuelto por `runTests` |
| `TestResult` | tipo | Resultado de las pruebas de una operación |
| `TestSummary` | tipo | Recuento total de pruebas superadas y fallidas |
| `AssertionResult` | tipo | Resultado de una aserción |
| `ReportFormat` | tipo | `"json" \| "cli" \| "html"` |
| `ProtocolName` | tipo | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | tipo | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | tipo | Configuración de autenticación |
| `TlsConfig` | tipo | Configuración de TLS y certificados |
| `FilterConfig` | tipo | Filtro de operaciones |
| `collectOperations` | función | Recopila las operaciones aplicando el filtro por lotes |
| `executeStep` | función asíncrona | Ejecuta una operación con valores específicos del paso |
| `buildSummary` | función | Calcula los recuentos y la tasa de éxito a partir de los resultados |
| `formatAssertionError` | función | Convierte un error de aserción en texto legible |
| `buildImplicitAssertions` | función | Crea las aserciones predeterminadas de cada protocolo |
| `runScenario` | función asíncrona | Ejecuta pasos ordenados con variables compartidas e iteraciones basadas en datos |
| `resolveSteps` | función | Resuelve todas las referencias del escenario antes de enviar solicitudes |
| `applyExtracts` | función | Extrae valores de la respuesta en variables de texto |
| `stepRef` | función | Normaliza la referencia de un paso |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | tipos | Definiciones de entrada y extracción del escenario |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | tipos | Resultados, eventos en tiempo real y opciones de ejecución del escenario |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

Carga la especificación con `loadSpec`, recopila las operaciones respetando `config.filter` y las ejecuta con concurrencia limitada (`min(config.concurrency ?? 5, queue.length)`). Ejecuta las aserciones declarativas y de Postman, añade aserciones implícitas del protocolo cuando no hay aserciones del usuario, ordena los resultados por ruta y luego por método y devuelve un `TestReport`.

El `TestReport` devuelto tiene esta estructura:

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

Combina `args` (opciones de CLI), un archivo JSON de configuración opcional (`args.config`) y `DEFAULT_CONFIG`. Carga el `envFile` resuelto, si existe, y después expande las referencias `${ENV_VAR}` en `serverUrl`, `proxy`, los valores de las cabeceras, `auth.token` y los valores de las variables. Lanza `"No OpenAPI spec path provided..."` si no se indica ninguna especificación e `Invalid proxy URL: <url>` si no puede interpretar `proxy`.

`CliArgs` representa las opciones de CLI:

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

Lee `config.specPath`. Si `isRemoteSpec` es verdadero, obtiene el contenido mediante HTTP(S), siguiendo hasta 5 redirecciones, aplicando `config.timeout` y enviando `User-Agent: @powerduck/openapi-cli`. En caso contrario, lee el archivo local. El contenido se interpreta como JSON y debe ser un objeto con un objeto `paths`. Después intenta resolver las referencias `$ref` internas; si falla, conserva la especificación sin modificar.

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

Devuelve `true` si `specPath`, tras eliminar los espacios iniciales y finales, coincide con `/^https?:\/\//i`.

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

## Motor de aserciones

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

Evalúa cada aserción declarativa frente al contexto de la respuesta. Los errores de evaluación se registran como un `AssertionResult` fallido.

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

Recopila los arrays `x-tests` del elemento de ruta y de la operación, en ese orden. Solo conserva los objetos que contienen tanto `name` como `assert`.

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

Devuelve el texto de `operation["x-postman-scripts"].test`, si existe.

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

Resolución básica que admite el prefijo `$.` o `$`, la notación de puntos y los índices numéricos de arrays, como `$.data.items[0].id`. Devuelve `undefined` cuando no existe un segmento.

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

## Generadores de informes

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

El informe puede contener cabeceras, cuerpos de solicitudes, variables y configuración de autenticación; elimina los valores sensibles antes de compartirlo o guardarlo.

Crea `outputDir` de forma recursiva y escribe `report.json` mediante `JSON.stringify(report, null, 2)`. Devuelve la ruta absoluta.

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

Genera el texto del informe de CLI con colores y secuencias de escape ANSI: cabecera, resumen, barra de progreso, filas de resultados y detalles de las aserciones. No lo imprime.

### printCliReport

```ts
printCliReport(report: TestReport): string
```

Llama a `generateCliReport`, imprime el resultado con `console.log` y devuelve el texto.

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

Crea `outputDir` y escribe un `report.html` autónomo con resumen, barra de progreso, botones de filtro, filas desplegables y modos claro y oscuro. Devuelve la ruta del archivo.

## Tipos de resultados

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

## Ejecutor de escenarios

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

Ejecuta los pasos en orden con un ámbito de variables compartido por iteración. Resuelve todas las referencias de operaciones antes de ejecutar e ignora el filtro por lotes, de modo que puede utilizar cualquier operación de la especificación. Las variables iniciales proceden de la configuración y del escenario; los valores extraídos quedan disponibles para los pasos posteriores. `stopOnFailure` es `true` de forma predeterminada. `options.signal` cancela la ejecución y los pasos restantes se registran como omitidos; las excepciones de los receptores de `onEvent` no detienen la ejecución.

El campo `data` del escenario ejecuta toda la secuencia con un ámbito nuevo por fila. `iterations` permite solicitar más repeticiones; el número efectivo es el mayor entre el declarado y el número de filas, con un máximo de 1000. El campo `request.data` de un paso repite ese paso, y solo las extracciones de la última ejecución se conservan en el ámbito compartido.

### Tipos de escenarios

Las declaraciones siguientes describen las entradas y salidas de los escenarios. `ScenarioDataRow` y `ScenarioIterations` son estructuras auxiliares incluidas para mayor claridad; no se exportan con nombre desde la raíz del paquete. Sus estructuras están disponibles a través de las interfaces públicas.

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

### stepRef y resolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

`stepRef` da prioridad a `method` y `path` explícitos; en caso contrario, normaliza `ref` conservando los identificadores operationId sin prefijo. `resolveSteps` devuelve entradas con `step`, `op` y la referencia `ref` normalizada; lanza una excepción si no encuentra alguna referencia, incluso en pasos omitidos.

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

Lee valores del cuerpo mediante JSONPath, cabeceras sin distinguir mayúsculas y minúsculas o el estado de la respuesta. Omite los valores ausentes y nulos; convierte los demás en texto y serializa los objetos como JSON.

## Funciones auxiliares del ejecutor

Las firmas auxiliares usan tipos que no se exportan con nombre desde la raíz. Dedúcelos a partir de las funciones públicas en lugar de importar archivos internos:

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

Recopila las operaciones estándar y adicionales, asigna un operationId alternativo cuando falta, deduce el protocolo y aplica `config.filter`. Cada entrada contiene `path`, `method`, `operation`, `pathItem`, `operationId` y `protocol`.

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

El `client` procede de `createClient` de `@powerduck/openapi-request`. Las opciones requieren `config` y `spec`; `signal`, `variables`, `values`, `serverUrl` y `extraAssertions` son opcionales. La salida contiene `result`, la respuesta `response` normalizada, `request` opcional y el ámbito de variables `env` generado por los scripts. Los ejecutores por lotes y de escenarios comparten esta vía de ejecución.

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

Cuenta los resultados superados, fallidos, con error y omitidos. La tasa de éxito es el número de resultados superados dividido por el total, redondeado a un decimal; si no hay resultados, es cero.

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

Obtiene un mensaje legible de un texto, un Error o un campo `message` o `msg`; como último recurso, serializa el valor. Si la entrada es falsa en contexto booleano, devuelve `undefined`.

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

Crea las comprobaciones indicadas en [Aserciones implícitas](#implicit-assertions). Los protocolos desconocidos no generan comprobaciones implícitas.

## Aserciones implícitas {#implicit-assertions}

Cuando una operación no define `x-tests` ni un script de Postman, el ejecutor añade una aserción implícita específica del protocolo:

| Protocolo | Comprobación implícita |
|----------|----------------|
| `http`, `sse` | El estado HTTP es `2xx` |
| `graphql` | El estado HTTP es `2xx` **y** no hay un array `errors` no vacío en el nivel superior |
| `grpc` | El código de estado gRPC es `0` (OK) |
| `mcp` | La respuesta JSON-RPC contiene `result` y no contiene `error` |
| `websocket` | La conexión alcanzó el estado `open` sin eventos de error |