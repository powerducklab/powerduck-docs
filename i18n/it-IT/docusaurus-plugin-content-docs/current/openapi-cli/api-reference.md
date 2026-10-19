---
sidebar_position: 4
title: "Riferimento API"
description: "Riferimento API per l'esecutore batch, l'esecutore di scenari, la configurazione, le asserzioni e i generatori di report di @powerduck/openapi-cli. Le esportazioni elencate di seguito sono disponibili dalla radice del pacchetto."
---

# Riferimento API

Riferimento API per l'esecutore batch, l'esecutore di scenari, la configurazione, le asserzioni e i generatori di report di `@powerduck/openapi-cli`. Le esportazioni elencate di seguito sono disponibili dalla radice del pacchetto.

## Panoramica delle esportazioni

| Esportazione | Tipo | Descrizione |
|--------|------|-------------|
| `runTests` | funzione | Esegue tutte le operazioni raccolte e restituisce un `TestReport` |
| `resolveConfig` | funzione | Risolve un `CliConfig` da argomenti, file di configurazione e valori predefiniti |
| `loadSpec` | funzione asincrona | Carica una specifica da un percorso locale o un URL remoto e ne risolve i riferimenti |
| `isRemoteSpec` | funzione | Indica se il percorso della specifica inizia con `http(s)://` |
| `DEFAULT_CONFIG` | costante | Valori predefiniti incorporati |
| `runDeclarativeAssertions` | funzione | Valuta un array di `DeclarativeAssertion` rispetto a una risposta |
| `extractAssertions` | funzione | Estrae le asserzioni dichiarative `x-tests` da un'operazione |
| `extractPostmanScripts` | funzione | Estrae il testo dello script di test Postman da un'operazione |
| `resolveJsonPath` | funzione | Risoluzione essenziale di JSONPath (notazione con punti e indici di array) |
| `generateJsonReport` | funzione | Scrive `report.json` su disco e ne restituisce il percorso |
| `generateCliReport` | funzione | Genera il testo colorato del report CLI senza stamparlo |
| `printCliReport` | funzione | Stampa il report CLI sullo standard output e restituisce il testo |
| `generateHtmlReport` | funzione | Scrive `report.html` su disco e ne restituisce il percorso |
| `CliArgs` | tipo | Struttura dell'input per la risoluzione di argomenti CLI e configurazione |
| `DeclarativeAssertion` | tipo | Oggetto di una singola asserzione dichiarativa |
| `CliConfig` | tipo | Interfaccia principale di configurazione |
| `TestReport` | tipo | Report completo restituito da `runTests` |
| `TestResult` | tipo | Esito dei test di un'operazione |
| `TestSummary` | tipo | Conteggi aggregati dei test superati e non superati |
| `AssertionResult` | tipo | Esito di un'asserzione |
| `ReportFormat` | tipo | `"json" \| "cli" \| "html"` |
| `ProtocolName` | tipo | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | tipo | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | tipo | Configurazione dell'autenticazione |
| `TlsConfig` | tipo | Configurazione TLS e certificati |
| `FilterConfig` | tipo | Filtro delle operazioni |
| `collectOperations` | funzione | Raccoglie le operazioni applicando il filtro batch |
| `executeStep` | funzione asincrona | Esegue un'operazione con impostazioni specifiche del passaggio |
| `buildSummary` | funzione | Calcola conteggi e percentuale di successo dai risultati |
| `formatAssertionError` | funzione | Converte un errore di asserzione in testo leggibile |
| `buildImplicitAssertions` | funzione | Crea le asserzioni predefinite per ciascun protocollo |
| `runScenario` | funzione asincrona | Esegue passaggi ordinati con variabili condivise e iterazioni basate sui dati |
| `resolveSteps` | funzione | Risolve tutti i riferimenti dello scenario prima di inviare richieste |
| `applyExtracts` | funzione | Estrae i valori della risposta in variabili di testo |
| `stepRef` | funzione | Normalizza il riferimento di un passaggio |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | tipi | Definizioni degli input e delle estrazioni dello scenario |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | tipi | Risultati, eventi in tempo reale e opzioni di esecuzione dello scenario |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

Carica la specifica con `loadSpec`, raccoglie le operazioni rispettando `config.filter` e le esegue con concorrenza limitata (`min(config.concurrency ?? 5, queue.length)`). Esegue le asserzioni dichiarative e Postman, aggiunge asserzioni implicite del protocollo quando non sono presenti asserzioni dell'utente, ordina i risultati per percorso e poi per metodo e restituisce un `TestReport`.

Il `TestReport` restituito ha questa struttura:

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

Unisce `args` (opzioni CLI), un eventuale file JSON di configurazione (`args.config`) e `DEFAULT_CONFIG`. Carica l'`envFile` risolto, se presente, quindi espande i riferimenti `${ENV_VAR}` in `serverUrl`, `proxy`, nei valori degli header, in `auth.token` e nei valori delle variabili. Genera `"No OpenAPI spec path provided..."` se non viene indicata una specifica e `Invalid proxy URL: <url>` se `proxy` non è interpretabile.

`CliArgs` rispecchia le opzioni CLI:

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

Legge `config.specPath`. Se `isRemoteSpec` è vero, recupera il contenuto tramite HTTP(S), seguendo fino a 5 reindirizzamenti, applicando `config.timeout` e inviando `User-Agent: @powerduck/openapi-cli`; altrimenti legge il file locale. Il contenuto viene interpretato come JSON e deve essere un oggetto contenente un oggetto `paths`. Tenta quindi di risolvere i riferimenti `$ref` interni; in caso di errore, lascia la specifica invariata.

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

Restituisce `true` quando `specPath`, dopo la rimozione degli spazi iniziali e finali, corrisponde a `/^https?:\/\//i`.

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

## Motore delle asserzioni

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

Valuta ogni asserzione dichiarativa nel contesto di una risposta. Gli errori di valutazione vengono registrati come un `AssertionResult` non superato.

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

Raccoglie gli array `x-tests` dall'elemento del percorso e dall'operazione, in quest'ordine, mantenendo solo gli oggetti con entrambi i campi `name` e `assert`.

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

Restituisce il testo in `operation["x-postman-scripts"].test`, se presente.

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

Risoluzione essenziale con supporto per il prefisso `$.` o `$`, la notazione con punti e gli indici numerici degli array, ad esempio `$.data.items[0].id`. Restituisce `undefined` se un segmento non esiste.

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

## Generatori di report

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

Il report può contenere header, corpi delle richieste, variabili e impostazioni di autenticazione; rimuovi i valori sensibili prima di condividerlo o salvarlo.

Crea `outputDir` ricorsivamente e scrive `report.json` usando `JSON.stringify(report, null, 2)`. Restituisce il percorso assoluto.

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

Genera il testo colorato del report CLI con sequenze di escape ANSI: intestazione, riepilogo, barra di avanzamento, righe dei risultati e dettagli delle asserzioni. Non lo stampa.

### printCliReport

```ts
printCliReport(report: TestReport): string
```

Chiama `generateCliReport`, stampa il risultato con `console.log` e restituisce il testo.

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

Crea `outputDir` e scrive un `report.html` autonomo con riepilogo, barra di avanzamento, pulsanti di filtro, righe espandibili e modalità chiara e scura. Restituisce il percorso del file.

## Tipi dei risultati

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

## Esecutore di scenari

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

Esegue i passaggi in ordine con un ambito di variabili condiviso per ogni iterazione. Risolve tutti i riferimenti alle operazioni prima dell'esecuzione e ignora il filtro batch, quindi può utilizzare qualsiasi operazione della specifica. Le variabili iniziali provengono dalla configurazione e dallo scenario; i valori estratti diventano disponibili per i passaggi successivi. `stopOnFailure` è `true` per impostazione predefinita. `options.signal` annulla l'esecuzione e i passaggi rimanenti vengono registrati come saltati; le eccezioni nei listener di `onEvent` non interrompono l'esecuzione.

Il campo `data` dello scenario esegue l'intera sequenza con un nuovo ambito per ogni riga. `iterations` permette di richiedere ulteriori ripetizioni; il conteggio effettivo è il maggiore tra quello dichiarato e il numero di righe, fino a un massimo di 1000. Il campo `request.data` di un passaggio ripete quel passaggio e solo le estrazioni dell'ultima esecuzione rimangono nell'ambito condiviso.

### Tipi degli scenari

Le dichiarazioni seguenti descrivono gli input e gli output degli scenari. `ScenarioDataRow` e `ScenarioIterations` sono strutture ausiliarie riportate per chiarezza; non sono esportazioni denominate dalla radice del pacchetto. Le loro strutture sono accessibili tramite le interfacce pubbliche.

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

`stepRef` privilegia `method` e `path` espliciti; altrimenti normalizza `ref` conservando un operationId senza prefisso. `resolveSteps` restituisce elementi con `step`, `op` e il riferimento `ref` normalizzato; genera un'eccezione se un riferimento non viene trovato, anche nei passaggi saltati.

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

Legge valori del corpo tramite JSONPath, header senza distinzione tra maiuscole e minuscole oppure lo stato della risposta. Omette valori mancanti e null; converte gli altri in testo, serializzando gli oggetti come JSON.

## Funzioni ausiliarie dell'esecutore

Le firme delle funzioni ausiliarie usano tipi che non sono esportazioni denominate dalla radice. Deducili dalle funzioni pubbliche invece di importare file interni:

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

Raccoglie operazioni standard e aggiuntive, assegna un operationId di riserva, deduce il protocollo e applica `config.filter`. Ogni elemento contiene `path`, `method`, `operation`, `pathItem`, `operationId` e `protocol`.

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

Il `client` proviene da `createClient` in `@powerduck/openapi-request`. Le opzioni richiedono `config` e `spec`; `signal`, `variables`, `values`, `serverUrl` ed `extraAssertions` sono facoltativi. L'output contiene `result`, la risposta `response` normalizzata, l'eventuale `request` e l'ambito di variabili `env` prodotto dagli script. Gli esecutori batch e di scenari condividono questo flusso di esecuzione.

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

Conta i risultati superati, non superati, con errore e saltati. La percentuale di successo è il rapporto tra risultati superati e totale, arrotondato a una cifra decimale; senza risultati, è zero.

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

Ricava un messaggio leggibile da una stringa, un Error o un campo `message` o `msg`; come ultima risorsa, serializza il valore. Un input falso in contesto booleano restituisce `undefined`.

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

Crea i controlli elencati in [Asserzioni implicite](#implicit-assertions). I protocolli sconosciuti non generano controlli impliciti.

## Asserzioni implicite {#implicit-assertions}

Quando un'operazione non definisce né `x-tests` né uno script Postman, l'esecutore aggiunge un'asserzione implicita specifica del protocollo:

| Protocollo | Controllo implicito |
|----------|----------------|
| `http`, `sse` | Lo stato HTTP è `2xx` |
| `graphql` | Lo stato HTTP è `2xx` **e** non è presente un array `errors` non vuoto al livello principale |
| `grpc` | Il codice di stato gRPC è `0` (OK) |
| `mcp` | La risposta JSON-RPC contiene `result` e non contiene `error` |
| `websocket` | La connessione ha raggiunto lo stato `open` senza eventi di errore |