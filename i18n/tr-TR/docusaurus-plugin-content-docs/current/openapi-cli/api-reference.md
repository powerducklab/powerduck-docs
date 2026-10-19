---
sidebar_position: 4
title: "API başvurusu"
description: "@powerduck/openapi-cli paketindeki toplu çalıştırıcı, senaryo çalıştırıcısı, yapılandırma, doğrulamalar ve rapor oluşturucular için API başvurusu. Aşağıdaki dışa aktarımlar paket kökünden kullanılabilir."
---

# API başvurusu

`@powerduck/openapi-cli` paketindeki toplu çalıştırıcı, senaryo çalıştırıcısı, yapılandırma, doğrulamalar ve rapor oluşturucular için API başvurusu. Aşağıdaki dışa aktarımlar paket kökünden kullanılabilir.

## Dışa aktarımlara genel bakış

| Dışa aktarım | Tür | Açıklama |
|--------|------|-------------|
| `runTests` | işlev | Toplanan tüm işlemleri çalıştırır ve bir `TestReport` döndürür |
| `resolveConfig` | işlev | Bağımsız değişkenler, yapılandırma dosyası ve varsayılanlardan `CliConfig` oluşturur |
| `loadSpec` | asenkron işlev | Yerel yoldan veya uzak URL'den belirtimi yükler ve başvuruları çözümler |
| `isRemoteSpec` | işlev | Belirtim yolunun `http(s)://` ile başlayıp başlamadığını denetler |
| `DEFAULT_CONFIG` | sabit | Yerleşik varsayılan değerler |
| `runDeclarativeAssertions` | işlev | Bir `DeclarativeAssertion` dizisini yanıta göre değerlendirir |
| `extractAssertions` | işlev | İşlemden `x-tests` bildirimsel doğrulamalarını alır |
| `extractPostmanScripts` | işlev | İşlemden Postman test betiğinin metnini alır |
| `resolveJsonPath` | işlev | Temel JSONPath çözümleyicisi (nokta gösterimi ve dizi indeksleri) |
| `generateJsonReport` | işlev | `report.json` dosyasını diske yazar ve dosya yolunu döndürür |
| `generateCliReport` | işlev | Renkli CLI rapor metnini oluşturur, ancak yazdırmaz |
| `printCliReport` | işlev | CLI raporunu standart çıktıya yazdırır ve metni döndürür |
| `generateHtmlReport` | işlev | `report.html` dosyasını diske yazar ve dosya yolunu döndürür |
| `CliArgs` | tür | CLI ve yapılandırma çözümlemesinin girdi yapısı |
| `DeclarativeAssertion` | tür | Tek bir bildirimsel doğrulama nesnesi |
| `CliConfig` | tür | Temel yapılandırma arayüzü |
| `TestReport` | tür | `runTests` tarafından döndürülen tam rapor |
| `TestResult` | tür | Bir işlemin test sonucu |
| `TestSummary` | tür | Toplam başarılı ve başarısız test sayıları |
| `AssertionResult` | tür | Bir doğrulamanın sonucu |
| `ReportFormat` | tür | `"json" \| "cli" \| "html"` |
| `ProtocolName` | tür | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | tür | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | tür | Kimlik doğrulama yapılandırması |
| `TlsConfig` | tür | TLS ve sertifika yapılandırması |
| `FilterConfig` | tür | İşlem filtresi |
| `collectOperations` | işlev | Toplu çalıştırma filtresini uygulayarak işlemleri toplar |
| `executeStep` | asenkron işlev | Adıma özgü ayarlarla tek bir işlemi çalıştırır |
| `buildSummary` | işlev | Test sonuçlarından sayıları ve başarı oranını hesaplar |
| `formatAssertionError` | işlev | Doğrulama hatasını okunabilir metne dönüştürür |
| `buildImplicitAssertions` | işlev | Protokole özgü varsayılan doğrulamaları oluşturur |
| `runScenario` | asenkron işlev | Paylaşılan değişkenler ve veri odaklı yinelemelerle adımları sırayla çalıştırır |
| `resolveSteps` | işlev | İstekleri göndermeden önce tüm senaryo başvurularını çözümler |
| `applyExtracts` | işlev | Yanıt değerlerini metin değişkenlerine çıkarır |
| `stepRef` | işlev | Adım başvurusunu normalleştirir |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | türler | Senaryo girdisi ve değer çıkarma tanımları |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | türler | Senaryo sonuçları, anlık olaylar ve çalıştırma seçenekleri |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

Belirtimi `loadSpec` ile yükler, `config.filter` ayarına göre işlemleri toplar ve sınırlı eşzamanlılıkla çalıştırır (`min(config.concurrency ?? 5, queue.length)`). Bildirimsel ve Postman doğrulamalarını çalıştırır; kullanıcı doğrulaması yoksa protokole özgü örtük doğrulamalar ekler. Sonuçları önce yola, sonra yönteme göre sıralar ve bir `TestReport` döndürür.

Döndürülen `TestReport` şu yapıdadır:

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

`args` (CLI seçenekleri), isteğe bağlı JSON yapılandırma dosyası (`args.config`) ve `DEFAULT_CONFIG` değerlerini birleştirir. Çözümlenen `envFile` varsa yükler; ardından `serverUrl`, `proxy`, üstbilgi değerleri, `auth.token` ve değişken değerlerindeki `${ENV_VAR}` başvurularını genişletir. Belirtim verilmezse `"No OpenAPI spec path provided..."`, `proxy` ayrıştırılamazsa `Invalid proxy URL: <url>` hatasını fırlatır.

`CliArgs`, CLI seçeneklerine karşılık gelir:

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

`config.specPath` değerini okur. `isRemoteSpec` doğruysa HTTP(S) üzerinden içeriği alır, en fazla 5 yönlendirmeyi izler, `config.timeout` uygular ve `User-Agent: @powerduck/openapi-cli` gönderir; değilse yerel dosyayı okur. İçerik JSON olarak ayrıştırılır ve bir `paths` nesnesi içeren nesne olmalıdır. Ardından dahili `$ref` başvurularını çözümlemeyi dener; başarısız olursa belirtimi değiştirmez.

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

Başındaki ve sonundaki boşluklar kaldırılmış `specPath`, `/^https?:\/\//i` ile eşleşirse `true` döndürür.

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

## Doğrulama motoru

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

Her bildirimsel doğrulamayı yanıt bağlamında değerlendirir. Değerlendirme hataları başarısız bir `AssertionResult` olarak kaydedilir.

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

Önce yol öğesinden, sonra işlemden `x-tests` dizilerini toplar; yalnızca hem `name` hem de `assert` içeren nesneleri tutar.

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

Varsa `operation["x-postman-scripts"].test` konumundaki metni döndürür.

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

`$.` veya `$` önekini, nokta gösterimini ve sayısal dizi indekslerini (örneğin `$.data.items[0].id`) destekleyen temel çözümleyicidir. Bir bölüm yoksa `undefined` döndürür.

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

## Rapor oluşturucular

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

Rapor; istek üstbilgileri, gövdeler, değişkenler ve kimlik doğrulama ayarları içerebilir. Paylaşmadan veya kaydetmeden önce hassas değerleri kaldırın.

`outputDir` dizinini alt dizinleriyle birlikte oluşturur ve `JSON.stringify(report, null, 2)` kullanarak `report.json` yazar. Mutlak dosya yolunu döndürür.

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

ANSI kaçış dizileriyle renkli CLI rapor metni oluşturur: başlık, özet, ilerleme çubuğu, sonuç satırları ve doğrulama ayrıntıları. Metni yazdırmaz.

### printCliReport

```ts
printCliReport(report: TestReport): string
```

`generateCliReport` işlevini çağırır, sonucu `console.log` ile yazdırır ve metni döndürür.

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

`outputDir` dizinini oluşturur ve özet, ilerleme çubuğu, filtre düğmeleri, genişletilebilir satırlar ve açık/koyu mod içeren bağımsız bir `report.html` yazar. Dosya yolunu döndürür.

## Sonuç türleri

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

## Senaryo çalıştırıcısı

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

Her senaryo yinelemesinde paylaşılan bir değişken kapsamıyla adımları sırayla çalıştırır. Çalıştırmadan önce tüm işlem başvurularını çözümler ve toplu çalıştırma filtresini yok sayar; böylece belirtimdeki herhangi bir işlem hedeflenebilir. Başlangıç değişkenleri yapılandırma ve senaryodan alınır; çıkarılan değerler sonraki adımlarda kullanılabilir. `stopOnFailure` varsayılan olarak `true` değerindedir. `options.signal` çalıştırmayı iptal eder ve kalan adımlar atlandı olarak kaydedilir; `onEvent` dinleyicilerinin istisnaları çalıştırmayı durdurmaz.

Senaryo düzeyindeki `data`, her satır için yeni bir kapsamla tüm diziyi çalıştırır. `iterations` ek yinelemeler isteyebilir; gerçek sayı, belirtilen sayı ile satır sayısının büyük olanıdır ve en fazla 1000 olabilir. Adım düzeyindeki `request.data` ilgili adımı tekrarlar; yalnızca son çalıştırmada çıkarılan değerler paylaşılan kapsamda kalır.

### Senaryo türleri

Aşağıdaki bildirimler senaryo girdilerini ve çıktılarını açıklar. `ScenarioDataRow` ve `ScenarioIterations`, açıklık sağlamak için gösterilen yardımcı yapılardır; paket kökünden adlandırılmış olarak dışa aktarılmazlar. Yapılarına genel arayüzler üzerinden erişilebilir.

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

### stepRef ve resolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

`stepRef`, açıkça belirtilen `method` ve `path` değerlerine öncelik verir; aksi durumda öneksiz operationId değerini koruyarak `ref` değerini normalleştirir. `resolveSteps`; `step`, `op` ve normalleştirilmiş `ref` içeren girdiler döndürür. Atlanan adımlar dahil herhangi bir başvuru bulunamazsa istisna fırlatır.

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

Gövde değerlerini JSONPath ile, üstbilgileri büyük/küçük harf ayrımı olmadan veya yanıt durumunu okur. Eksik ve null değerleri atlar; diğerlerini metne dönüştürür, nesneleri JSON olarak serileştirir.

## Çalıştırıcı yardımcıları

Yardımcı işlev imzaları, kökten adlandırılmış olarak dışa aktarılmayan türler kullanır. Dahili dosyaları içe aktarmak yerine türleri genel işlevlerden çıkarın:

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

Standart ve ek işlemleri toplar, gerekirse yedek bir operationId atar, protokolü belirler ve `config.filter` uygular. Her girdi `path`, `method`, `operation`, `pathItem`, `operationId` ve `protocol` içerir.

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

`client`, `@powerduck/openapi-request` paketindeki `createClient` ile oluşturulur. Seçeneklerde `config` ve `spec` zorunludur; `signal`, `variables`, `values`, `serverUrl` ve `extraAssertions` isteğe bağlıdır. Çıktı; `result`, normalleştirilmiş `response`, isteğe bağlı `request` ve betiklerin ürettiği `env` değişken kapsamını içerir. Toplu ve senaryo çalıştırıcıları bu yürütme yolunu paylaşır.

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

Başarılı, başarısız, hatalı ve atlanan sonuçları sayar. Başarı oranı, başarılı sonuç sayısının toplam sayıya bölünüp bir ondalık basamağa yuvarlanmasıyla hesaplanır; sonuç yoksa oran sıfırdır.

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

Metin, Error, `message` veya `msg` alanından okunabilir bir ileti alır; son çare olarak serileştirme kullanır. Boolean bağlamında yanlış kabul edilen girdiler için `undefined` döndürür.

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

[Örtük doğrulamalar](#implicit-assertions) bölümündeki denetimleri oluşturur. Bilinmeyen protokoller için örtük denetim oluşturulmaz.

## Örtük doğrulamalar {#implicit-assertions}

Bir işlemde ne `x-tests` ne de Postman betiği tanımlıysa çalıştırıcı protokole özgü bir örtük doğrulama ekler:

| Protokol | Örtük denetim |
|----------|----------------|
| `http`, `sse` | HTTP durumu `2xx` olmalıdır |
| `graphql` | HTTP durumu `2xx` olmalı **ve** en üst düzeyde boş olmayan bir `errors` dizisi bulunmamalıdır |
| `grpc` | gRPC durum kodu `0` (OK) olmalıdır |
| `mcp` | JSON-RPC yanıtında `result` bulunmalı, `error` bulunmamalıdır |
| `websocket` | Bağlantı, hata olayı olmadan `open` durumuna ulaşmış olmalıdır |