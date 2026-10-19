---
sidebar_position: 4
title: "Référence API"
description: "Référence du lanceur de tests par lots, du moteur de scénarios, de la configuration, des assertions et des rapports de @powerduck/openapi-cli. Les exports ci-dessous sont accessibles depuis la racine du paquet."
---

# Référence API

Référence du lanceur de tests par lots, du moteur de scénarios, de la configuration, des assertions et des rapports de `@powerduck/openapi-cli`. Les exports ci-dessous sont accessibles depuis la racine du paquet.

## Vue d’ensemble des exports

| Export | Nature | Description |
|--------|------|-------------|
| `runTests` | fonction | Exécuter les opérations collectées et renvoyer un `TestReport` |
| `resolveConfig` | fonction | Résoudre un `CliConfig` à partir des arguments, du fichier et des valeurs par défaut |
| `loadSpec` | fonction asynchrone | Charger une spécification locale ou distante et résoudre ses références |
| `isRemoteSpec` | fonction | Vérifier si le chemin commence par `http(s)://` |
| `DEFAULT_CONFIG` | constante | Valeurs par défaut intégrées |
| `runDeclarativeAssertions` | fonction | Évaluer un tableau de `DeclarativeAssertion` sur une réponse |
| `extractAssertions` | fonction | Extraire les assertions déclaratives `x-tests` d’une opération |
| `extractPostmanScripts` | fonction | Extraire la chaîne du script de test Postman d’une opération |
| `resolveJsonPath` | fonction | Résolveur JSONPath minimal : notation pointée et indices de tableau |
| `generateJsonReport` | fonction | Écrire `report.json` sur disque et renvoyer son chemin |
| `generateCliReport` | fonction | Construire le rapport CLI coloré sans l’afficher |
| `printCliReport` | fonction | Afficher le rapport CLI sur la sortie standard et renvoyer la chaîne |
| `generateHtmlReport` | fonction | Écrire `report.html` sur disque et renvoyer son chemin |
| `CliArgs` | type | Structure d’entrée de la résolution CLI/configuration |
| `DeclarativeAssertion` | type | Objet d’assertion déclarative |
| `CliConfig` | type | Interface de configuration centrale |
| `TestReport` | type | Rapport complet renvoyé par `runTests` |
| `TestResult` | type | Résultat du test d’une opération |
| `TestSummary` | type | Totaux de réussite et d’échec |
| `AssertionResult` | type | Résultat d’une assertion |
| `ReportFormat` | type | `"json" \| "cli" \| "html"` |
| `ProtocolName` | type | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | type | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | type | Configuration de l’authentification |
| `TlsConfig` | type | Configuration TLS et certificats |
| `FilterConfig` | type | Filtre d’opérations |
| `collectOperations` | fonction | Collecter les opérations en appliquant le filtre des tests par lots |
| `executeStep` | fonction asynchrone | Exécuter une opération avec des options propres à l’étape |
| `buildSummary` | fonction | Calculer les totaux et le taux de réussite |
| `formatAssertionError` | fonction | Convertir une erreur d’assertion en texte lisible |
| `buildImplicitAssertions` | fonction | Construire les assertions par défaut propres au protocole |
| `runScenario` | fonction asynchrone | Exécuter des étapes ordonnées avec variables partagées et itérations fondées sur des données |
| `resolveSteps` | fonction | Résoudre toutes les références du scénario avant d’envoyer les requêtes |
| `applyExtracts` | fonction | Extraire des valeurs de réponse dans des variables textuelles |
| `stepRef` | fonction | Normaliser une référence d’étape |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | types | Définitions d’entrée et d’extraction des scénarios |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | types | Résultats, événements en direct et options d’exécution des scénarios |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

Charge la spécification avec `loadSpec`, collecte les opérations selon `config.filter`, les exécute avec une concurrence limitée à `min(config.concurrency ?? 5, queue.length)`, puis évalue les assertions déclaratives et Postman. En l’absence d’assertions utilisateur, ajoute les assertions implicites du protocole. Trie les résultats par chemin puis méthode et renvoie un `TestReport`.

Structure du `TestReport` renvoyé :

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

Fusionne `args` (options CLI), un éventuel fichier JSON `args.config` et `DEFAULT_CONFIG`. Charge le `envFile` résolu s’il existe, puis développe les références `${ENV_VAR}` dans `serverUrl`, `proxy`, les valeurs des en-têtes, `auth.token` et les valeurs des variables. Lève `"No OpenAPI spec path provided..."` sans spécification, ou `Invalid proxy URL: <url>` si `proxy` ne peut pas être analysé.

`CliArgs` reprend les options CLI :

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

Lit `config.specPath`. Si `isRemoteSpec` est vrai, récupère le document via HTTP(S), avec au plus 5 redirections, `config.timeout` et `User-Agent: @powerduck/openapi-cli` ; sinon lit le fichier local. Le contenu JSON doit être un objet contenant un objet `paths`. Les références internes `$ref` sont ensuite résolues dans la mesure du possible ; en cas d’échec, la spécification reste intacte.

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

Renvoie `true` si `specPath`, débarrassé des espaces aux extrémités, correspond à `/^https?:\/\//i`.

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

## Moteur d’assertions

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

Évalue chaque assertion déclarative sur le contexte de réponse. Les erreurs d’évaluation sont enregistrées comme un `AssertionResult` en échec.

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

Collecte les tableaux `x-tests` de l’élément de chemin puis de l’opération. Seuls les objets possédant à la fois `name` et `assert` sont conservés.

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

Renvoie la chaîne `operation["x-postman-scripts"].test` si elle existe.

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

Résolveur minimal prenant en charge les préfixes `$.` ou `$`, la notation pointée et les indices numériques, par exemple `$.data.items[0].id`. Renvoie `undefined` si un segment n’existe pas.

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

## Générateurs de rapports

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

Le rapport peut contenir des en-têtes et corps de requête, des variables et des paramètres d’authentification. Masquez les valeurs sensibles avant de le partager ou de l’enregistrer.

Crée `outputDir` récursivement, écrit `report.json` avec `JSON.stringify(report, null, 2)` et renvoie le chemin absolu.

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

Construit, sans l’afficher, une chaîne de rapport CLI colorée par séquences ANSI : en-tête, résumé, progression, lignes de résultat et détails des assertions.

### printCliReport

```ts
printCliReport(report: TestReport): string
```

Appelle `generateCliReport`, affiche le résultat avec `console.log` et renvoie la chaîne.

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

Crée `outputDir` et écrit un `report.html` autonome avec résumé, progression, filtres, lignes dépliables et modes clair/sombre. Renvoie le chemin du fichier.

## Types de résultats

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

## Moteur de scénarios

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

Exécute les étapes dans l’ordre avec une portée de variables partagée par itération. Toutes les références sont résolues avant l’exécution ; le filtre des tests par lots est ignoré, ce qui permet de viser toute opération de la spécification. Les variables sont initialisées depuis la configuration et le scénario ; les valeurs extraites servent aux étapes suivantes. `stopOnFailure` vaut `true` par défaut. `options.signal` annule l’exécution et les étapes restantes sont marquées comme ignorées. Les exceptions des écouteurs `onEvent` n’interrompent pas l’exécution.

Le `data` du scénario exécute toute la séquence avec une portée neuve pour chaque ligne. `iterations` peut demander des répétitions supplémentaires ; le nombre effectif est le maximum entre le nombre déclaré et le nombre de lignes, limité à 1000. Le `request.data` d’une étape répète cette étape ; seules les extractions de la dernière exécution restent dans la portée partagée.

### Types de scénarios

Les déclarations suivantes décrivent les entrées et sorties. `ScenarioDataRow` et `ScenarioIterations` sont des structures auxiliaires présentées pour clarifier l’ensemble ; ce ne sont pas des exports nommés de la racine. Leurs structures sont accessibles à travers les interfaces publiques.

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

### stepRef et resolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

`stepRef` privilégie les champs explicites `method` et `path`, sinon normalise `ref` tout en conservant un operationId seul. `resolveSteps` renvoie des entrées contenant `step`, `op` et le `ref` normalisé. Une référence introuvable provoque une exception, même pour une étape ignorée.

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

Lit les valeurs du corps par JSONPath, les en-têtes sans tenir compte de la casse, ou le statut de réponse. Les valeurs absentes et nulles sont omises ; les autres sont converties en chaînes, les objets étant sérialisés en JSON.

## Fonctions auxiliaires du lanceur

Les signatures utilisent des types auxiliaires qui ne sont pas des exports nommés de la racine. Déduisez-les des fonctions publiques plutôt que d’importer des fichiers internes :

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

Collecte les opérations standard et supplémentaires, attribue un operationId de repli, déduit le protocole et applique `config.filter`. Chaque entrée contient `path`, `method`, `operation`, `pathItem`, `operationId` et `protocol`.

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

Le `client` vient de `createClient` dans `@powerduck/openapi-request`. Les options exigent `config` et `spec`, avec `signal`, `variables`, `values`, `serverUrl` et `extraAssertions` facultatifs. Le retour contient `result`, la `response` normalisée, un `request` facultatif et la portée de variables `env` produite par les scripts. Les tests par lots et les scénarios partagent cette exécution.

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

Compte les résultats réussis, échoués, en erreur et ignorés. Le taux est le nombre de réussites divisé par le total, arrondi à une décimale ; il vaut zéro pour un ensemble vide.

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

Extrait un message lisible d’une chaîne, d’un Error ou des champs `message` ou `msg`, puis se rabat sur la sérialisation. Une entrée falsy donne `undefined`.

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

Construit les contrôles de la section [Assertions implicites](#implicit-assertions). Les protocoles inconnus ne produisent aucun contrôle implicite.

## Assertions implicites {#implicit-assertions}

Lorsqu’une opération ne définit ni `x-tests` ni script Postman, le lanceur ajoute une assertion implicite propre au protocole :

| Protocole | Contrôle implicite |
|----------|----------------|
| `http`, `sse` | Statut HTTP `2xx` |
| `graphql` | Statut HTTP `2xx` **et** absence de tableau `errors` non vide à la racine |
| `grpc` | Code de statut gRPC `0` (OK) |
| `mcp` | La réponse JSON-RPC possède `result` et aucun `error` |
| `websocket` | La connexion atteint `open` sans événement d’erreur |