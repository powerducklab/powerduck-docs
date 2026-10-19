---
sidebar_position: 4
title: "API-Referenz"
description: "Referenz für Batch-Runner, Szenario-Runner, Konfiguration, Assertions und Berichtsgeneratoren in @powerduck/openapi-cli. Die aufgeführten Exporte sind über den Paketwurzelpfad verfügbar."
---

# API-Referenz

Referenz für Batch-Runner, Szenario-Runner, Konfiguration, Assertions und Berichtsgeneratoren in `@powerduck/openapi-cli`. Die aufgeführten Exporte sind über den Paketwurzelpfad verfügbar.

## Exportübersicht

| Export | Art | Beschreibung |
|--------|------|-------------|
| `runTests` | Funktion | Alle gesammelten Operationen ausführen und einen `TestReport` liefern |
| `resolveConfig` | Funktion | `CliConfig` aus Argumenten, Datei und Standardwerten auflösen |
| `loadSpec` | Asynchrone Funktion | Spezifikation von lokalem Pfad oder entfernter URL laden und Referenzen auflösen |
| `isRemoteSpec` | Funktion | Prüfen, ob ein Spezifikationspfad mit `http(s)://` beginnt |
| `DEFAULT_CONFIG` | Konstante | Integrierte Standardwerte |
| `runDeclarativeAssertions` | Funktion | Ein Array von `DeclarativeAssertion` anhand einer Antwort auswerten |
| `extractAssertions` | Funktion | Deklarative `x-tests`-Assertions aus einer Operation lesen |
| `extractPostmanScripts` | Funktion | Postman-Testskript als Zeichenfolge aus einer Operation lesen |
| `resolveJsonPath` | Funktion | Minimaler JSONPath-Resolver mit Punktnotation und Array-Indizes |
| `generateJsonReport` | Funktion | `report.json` auf die Festplatte schreiben und den Pfad zurückgeben |
| `generateCliReport` | Funktion | Farbigen CLI-Bericht als Zeichenfolge erzeugen, ohne Ausgabe |
| `printCliReport` | Funktion | CLI-Bericht auf stdout ausgeben und Zeichenfolge zurückgeben |
| `generateHtmlReport` | Funktion | `report.html` auf die Festplatte schreiben und den Pfad zurückgeben |
| `CliArgs` | Typ | Eingabestruktur der CLI- und Konfigurationsauflösung |
| `DeclarativeAssertion` | Typ | Ein deklaratives Assertion-Objekt |
| `CliConfig` | Typ | Zentrale Konfigurationsschnittstelle |
| `TestReport` | Typ | Vollständiger Bericht von `runTests` |
| `TestResult` | Typ | Testergebnis einer Operation |
| `TestSummary` | Typ | Zusammengefasste Erfolgs- und Fehlerzahlen |
| `AssertionResult` | Typ | Ergebnis einer Assertion |
| `ReportFormat` | Typ | `"json" \| "cli" \| "html"` |
| `ProtocolName` | Typ | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | Typ | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | Typ | Authentifizierungskonfiguration |
| `TlsConfig` | Typ | TLS- und Zertifikatskonfiguration |
| `FilterConfig` | Typ | Operationsfilter |
| `collectOperations` | Funktion | Operationen unter Anwendung des Batch-Filters sammeln |
| `executeStep` | Asynchrone Funktion | Eine Operation mit schrittspezifischen Überschreibungen ausführen |
| `buildSummary` | Funktion | Anzahlen und Erfolgsquote aus Testergebnissen berechnen |
| `formatAssertionError` | Funktion | Assertion-Fehler in lesbaren Text umwandeln |
| `buildImplicitAssertions` | Funktion | Protokollspezifische Standard-Assertions erzeugen |
| `runScenario` | Asynchrone Funktion | Geordnete Schritte mit gemeinsamen Variablen und datengetriebenen Iterationen ausführen |
| `resolveSteps` | Funktion | Alle Szenarioreferenzen vor dem Senden von Anfragen auflösen |
| `applyExtracts` | Funktion | Antwortwerte in Zeichenfolgenvariablen extrahieren |
| `stepRef` | Funktion | Schrittreferenz normalisieren |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | Typen | Szenarioeingaben und Extraktionsdefinitionen |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | Typen | Szenarioergebnisse, Live-Ereignisse und Ausführungsoptionen |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

Lädt die Spezifikation mit `loadSpec`, sammelt Operationen unter Beachtung von `config.filter` und führt sie mit begrenzter Parallelität `min(config.concurrency ?? 5, queue.length)` aus. Wertet deklarative und Postman-Assertions aus und ergänzt ohne Benutzer-Assertions die impliziten Protokollprüfungen. Sortiert Ergebnisse nach Pfad und Methode und liefert einen `TestReport`.

Der zurückgegebene `TestReport` hat folgende Struktur:

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

Führt `args` (CLI-Optionen), eine optionale JSON-Datei `args.config` und `DEFAULT_CONFIG` zusammen. Lädt die aufgelöste `envFile`, falls vorhanden, und ersetzt `${ENV_VAR}` in `serverUrl`, `proxy`, Headerwerten, `auth.token` und Variablenwerten. Ohne Spezifikation wird `"No OpenAPI spec path provided..."` ausgelöst, bei nicht lesbarer `proxy`-URL `Invalid proxy URL: <url>`.

`CliArgs` entspricht den CLI-Optionen:

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

Liest `config.specPath`. Bei wahrem `isRemoteSpec` erfolgt der Abruf über HTTP(S) mit höchstens fünf Weiterleitungen, `config.timeout` und `User-Agent: @powerduck/openapi-cli`; andernfalls wird die lokale Datei gelesen. Der JSON-Inhalt muss ein Objekt mit einem `paths`-Objekt sein. Interne `$ref`-Verweise werden anschließend bestmöglich aufgelöst; bei Fehlern bleibt die Spezifikation unverändert.

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

Liefert `true`, wenn `specPath` nach Entfernen äußerer Leerzeichen auf `/^https?:\/\//i` passt.

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

## Assertion-Engine

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

Wertet jede deklarative Assertion anhand des Antwortkontexts aus. Auswertungsfehler werden als fehlgeschlagenes `AssertionResult` erfasst.

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

Sammelt `x-tests`-Arrays zunächst vom Pfadeintrag und danach von der Operation. Behält nur Objekte mit sowohl `name` als auch `assert`.

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

Liefert die Zeichenfolge unter `operation["x-postman-scripts"].test`, falls vorhanden.

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

Minimaler Resolver für führendes `$.` oder `$`, Punktnotation und numerische Array-Indizes, etwa `$.data.items[0].id`. Bei fehlenden Segmenten wird `undefined` geliefert.

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

## Berichtsgeneratoren

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

Der Bericht kann Anfrage-Header, Anfragekörper, Variablen und Authentifizierungseinstellungen enthalten. Entfernen Sie sensible Werte vor dem Teilen oder dauerhaften Speichern.

Erstellt `outputDir` rekursiv, schreibt `report.json` mit `JSON.stringify(report, null, 2)` und liefert den absoluten Dateipfad.

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

Erzeugt den farbigen CLI-Bericht mit ANSI-Sequenzen als Zeichenfolge, ohne ihn auszugeben: Kopf, Zusammenfassung, Fortschrittsbalken, Ergebniszeilen und Assertion-Details.

### printCliReport

```ts
printCliReport(report: TestReport): string
```

Ruft `generateCliReport` auf, gibt das Ergebnis mit `console.log` aus und liefert die Zeichenfolge.

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

Erstellt `outputDir` und einen eigenständigen `report.html` mit Zusammenfassung, Fortschritt, Filtern, aufklappbaren Zeilen und hellem/dunklem Modus. Liefert den Dateipfad.

## Ergebnistypen

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

## Szenario-Runner

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

Führt Schritte geordnet mit einem gemeinsamen Variablenbereich je Szenarioiteration aus. Alle Operationsreferenzen werden vorab aufgelöst; der Batch-Filter wird ignoriert, sodass jede Operation der Spezifikation angesprochen werden kann. Ausgangswerte stammen aus Konfiguration und Szenario; extrahierte Werte stehen Folgeschritten zur Verfügung. `stopOnFailure` ist standardmäßig `true`. `options.signal` bricht den Lauf ab und markiert verbleibende Schritte als übersprungen. Ausnahmen in `onEvent`-Listenern unterbrechen den Lauf nicht.

Szenario-`data` führt die gesamte Folge pro Datenzeile mit neuem Variablenbereich aus. `iterations` kann zusätzliche Wiederholungen verlangen; die effektive Anzahl ist das Maximum aus Vorgabe und Zeilenzahl, höchstens 1000. Schrittbezogenes `request.data` wiederholt diesen Schritt; nur die Extraktionen des letzten Durchlaufs verbleiben im gemeinsamen Bereich.

### Szenariotypen

Die folgenden Deklarationen beschreiben Ein- und Ausgaben. `ScenarioDataRow` und `ScenarioIterations` sind hier zur Erläuterung gezeigte Hilfsstrukturen, keine benannten Exporte vom Paketwurzelpfad. Ihre Strukturen sind über öffentliche Schnittstellen zugänglich.

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

### stepRef und resolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

`stepRef` bevorzugt explizite `method`- und `path`-Werte; andernfalls normalisiert es `ref` und erhält eine alleinstehende operationId. `resolveSteps` liefert Einträge mit `step`, `op` und normalisiertem `ref`. Eine nicht auffindbare Referenz löst eine Ausnahme aus, auch bei übersprungenen Schritten.

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

Liest Körperwerte per JSONPath, Header ohne Beachtung der Großschreibung oder den Antwortstatus. Fehlende und null-Werte werden ausgelassen; andere Werte werden in Zeichenfolgen umgewandelt, Objekte dabei als JSON serialisiert.

## Runner-Hilfsfunktionen

Die Signaturen verwenden Hilfstypen, die nicht als benannte Root-Exporte verfügbar sind. Leiten Sie sie aus öffentlichen Funktionen ab, statt interne Dateien zu importieren:

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

Sammelt Standard- und zusätzliche Operationen, vergibt fehlende operationIds, ermittelt Protokolle und wendet `config.filter` an. Jeder Eintrag enthält `path`, `method`, `operation`, `pathItem`, `operationId` und `protocol`.

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

Der `client` stammt von `createClient` aus `@powerduck/openapi-request`. Optionen erfordern `config` und `spec`; optional sind `signal`, `variables`, `values`, `serverUrl` und `extraAssertions`. Das Ergebnis enthält `result`, die normalisierte `response`, optional `request` und den von Skripten erzeugten Variablenbereich `env`. Batch- und Szenario-Runner teilen diesen Ausführungsweg.

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

Zählt bestandene, fehlgeschlagene, fehlerhafte und übersprungene Ergebnisse. Die Erfolgsquote ist bestanden geteilt durch gesamt, auf eine Dezimalstelle gerundet; bei leerem Ergebnis ist sie null.

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

Liest eine verständliche Meldung aus einer Zeichenfolge, einem Error oder den Feldern `message` oder `msg`; ersatzweise wird serialisiert. Falsy-Eingaben ergeben `undefined`.

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

Erzeugt die unter [Implizite Assertions](#implicit-assertions) aufgeführten Prüfungen. Unbekannte Protokolle erzeugen keine impliziten Prüfungen.

## Implizite Assertions {#implicit-assertions}

Wenn eine Operation weder `x-tests` noch ein Postman-Skript definiert, ergänzt der Runner eine protokollspezifische implizite Assertion:

| Protokoll | Implizite Prüfung |
|----------|----------------|
| `http`, `sse` | HTTP-Status `2xx` |
| `graphql` | HTTP-Status `2xx` **und** kein nichtleeres `errors`-Array auf oberster Ebene |
| `grpc` | gRPC-Statuscode `0` (OK) |
| `mcp` | JSON-RPC-Antwort besitzt `result` und kein `error` |
| `websocket` | Verbindung erreicht `open` ohne Fehlerereignis |