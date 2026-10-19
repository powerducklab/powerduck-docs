---
sidebar_position: 4
title: "Referensi API"
description: "Referensi API untuk pelaksana batch, pelaksana skenario, konfigurasi, asersi, dan pembuat laporan di @powerduck/openapi-cli. Ekspor berikut tersedia dari akar paket."
---

# Referensi API

Referensi API untuk pelaksana batch, pelaksana skenario, konfigurasi, asersi, dan pembuat laporan di `@powerduck/openapi-cli`. Ekspor berikut tersedia dari akar paket.

## Ringkasan ekspor

| Ekspor | Jenis | Deskripsi |
|--------|------|-------------|
| `runTests` | fungsi | Menjalankan semua operasi yang dikumpulkan dan mengembalikan `TestReport` |
| `resolveConfig` | fungsi | Menyusun `CliConfig` dari argumen, berkas konfigurasi, dan nilai bawaan |
| `loadSpec` | fungsi asinkron | Memuat spesifikasi dari jalur lokal atau URL jarak jauh dan menyelesaikan referensinya |
| `isRemoteSpec` | fungsi | Memeriksa apakah jalur spesifikasi diawali `http(s)://` |
| `DEFAULT_CONFIG` | konstanta | Nilai bawaan yang disertakan |
| `runDeclarativeAssertions` | fungsi | Mengevaluasi array `DeclarativeAssertion` terhadap respons |
| `extractAssertions` | fungsi | Mengambil asersi deklaratif `x-tests` dari operasi |
| `extractPostmanScripts` | fungsi | Mengambil string skrip pengujian Postman dari operasi |
| `resolveJsonPath` | fungsi | Resolver JSONPath sederhana (notasi titik dan indeks array) |
| `generateJsonReport` | fungsi | Menulis `report.json` ke disk dan mengembalikan jalur berkasnya |
| `generateCliReport` | fungsi | Membuat string laporan CLI berwarna tanpa mencetaknya |
| `printCliReport` | fungsi | Mencetak laporan CLI ke keluaran standar dan mengembalikan stringnya |
| `generateHtmlReport` | fungsi | Menulis `report.html` ke disk dan mengembalikan jalur berkasnya |
| `CliArgs` | tipe | Struktur masukan untuk menyelesaikan argumen CLI dan konfigurasi |
| `DeclarativeAssertion` | tipe | Objek satu asersi deklaratif |
| `CliConfig` | tipe | Antarmuka konfigurasi utama |
| `TestReport` | tipe | Laporan lengkap yang dikembalikan `runTests` |
| `TestResult` | tipe | Hasil pengujian satu operasi |
| `TestSummary` | tipe | Jumlah keseluruhan pengujian lulus dan gagal |
| `AssertionResult` | tipe | Hasil satu asersi |
| `ReportFormat` | tipe | `"json" \| "cli" \| "html"` |
| `ProtocolName` | tipe | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | tipe | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | tipe | Konfigurasi autentikasi |
| `TlsConfig` | tipe | Konfigurasi TLS dan sertifikat |
| `FilterConfig` | tipe | Filter operasi |
| `collectOperations` | fungsi | Mengumpulkan operasi dengan menerapkan filter batch |
| `executeStep` | fungsi asinkron | Menjalankan satu operasi dengan pengaturan khusus langkah |
| `buildSummary` | fungsi | Menghitung jumlah dan tingkat kelulusan dari hasil pengujian |
| `formatAssertionError` | fungsi | Mengubah kesalahan asersi menjadi teks yang mudah dibaca |
| `buildImplicitAssertions` | fungsi | Membuat asersi bawaan khusus protokol |
| `runScenario` | fungsi asinkron | Menjalankan langkah berurutan dengan variabel bersama dan iterasi berbasis data |
| `resolveSteps` | fungsi | Menyelesaikan semua referensi skenario sebelum mengirim permintaan |
| `applyExtracts` | fungsi | Mengekstrak nilai respons ke variabel string |
| `stepRef` | fungsi | Menormalkan referensi langkah |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | tipe | Definisi masukan dan ekstraksi skenario |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | tipe | Hasil skenario, peristiwa langsung, dan opsi eksekusi |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

Memuat spesifikasi dengan `loadSpec`, mengumpulkan operasi sesuai `config.filter`, lalu menjalankannya dengan konkurensi terbatas (`min(config.concurrency ?? 5, queue.length)`). Menjalankan asersi deklaratif dan Postman, menambahkan asersi implisit protokol jika tidak ada asersi pengguna, mengurutkan hasil menurut jalur lalu metode, dan mengembalikan `TestReport`.

`TestReport` yang dikembalikan memiliki struktur berikut:

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

Menggabungkan `args` (opsi CLI), berkas konfigurasi JSON opsional (`args.config`), dan `DEFAULT_CONFIG`. Memuat `envFile` hasil resolusi jika ada, lalu memperluas referensi `${ENV_VAR}` pada `serverUrl`, `proxy`, nilai header, `auth.token`, dan nilai variabel. Melempar `"No OpenAPI spec path provided..."` jika spesifikasi tidak diberikan, serta `Invalid proxy URL: <url>` jika `proxy` tidak dapat diurai.

`CliArgs` sesuai dengan opsi CLI:

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

Membaca `config.specPath`. Jika `isRemoteSpec` bernilai benar, mengambil konten melalui HTTP(S), mengikuti hingga 5 pengalihan, menerapkan `config.timeout`, dan mengirim `User-Agent: @powerduck/openapi-cli`; jika tidak, membaca berkas lokal. Konten diurai sebagai JSON dan harus berupa objek dengan objek `paths`. Selanjutnya, fungsi mencoba menyelesaikan `$ref` internal; jika gagal, spesifikasi dibiarkan tanpa perubahan.

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

Mengembalikan `true` jika `specPath`, setelah spasi di awal dan akhir dihapus, cocok dengan `/^https?:\/\//i`.

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

## Mesin asersi

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

Mengevaluasi setiap asersi deklaratif terhadap konteks respons. Kesalahan evaluasi dicatat sebagai `AssertionResult` yang gagal.

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

Mengumpulkan array `x-tests` dari item jalur lalu operasi, dengan hanya menyertakan objek yang memiliki `name` dan `assert`.

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

Mengembalikan string pada `operation["x-postman-scripts"].test`, jika ada.

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

Resolver sederhana yang mendukung awalan `$.` atau `$`, notasi titik, dan indeks array numerik, misalnya `$.data.items[0].id`. Mengembalikan `undefined` jika suatu segmen tidak ada.

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

## Pembuat laporan

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

Laporan dapat berisi header, isi permintaan, variabel, dan pengaturan autentikasi; hapus nilai sensitif sebelum membagikan atau menyimpannya.

Membuat `outputDir` secara rekursif dan menulis `report.json` dengan `JSON.stringify(report, null, 2)`. Mengembalikan jalur absolut.

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

Membuat string laporan CLI berwarna menggunakan urutan escape ANSI: judul, ringkasan, bilah progres, baris hasil, dan detail asersi. String tidak dicetak.

### printCliReport

```ts
printCliReport(report: TestReport): string
```

Memanggil `generateCliReport`, mencetak hasil dengan `console.log`, lalu mengembalikan stringnya.

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

Membuat `outputDir` dan menulis `report.html` mandiri yang memuat ringkasan, bilah progres, tombol filter, baris yang dapat diperluas, serta mode terang dan gelap. Mengembalikan jalur berkas.

## Tipe hasil

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

## Pelaksana skenario

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

Menjalankan langkah secara berurutan dengan cakupan variabel bersama untuk setiap iterasi skenario. Semua referensi operasi diselesaikan sebelum eksekusi dan filter batch diabaikan, sehingga operasi mana pun dalam spesifikasi dapat digunakan. Variabel awal berasal dari konfigurasi dan skenario; nilai hasil ekstraksi tersedia bagi langkah berikutnya. Nilai bawaan `stopOnFailure` adalah `true`. `options.signal` membatalkan eksekusi dan langkah yang tersisa dicatat sebagai dilewati; pengecualian dari listener `onEvent` tidak menghentikan eksekusi.

`data` pada tingkat skenario menjalankan seluruh rangkaian dengan cakupan baru untuk setiap baris. `iterations` dapat meminta pengulangan tambahan; jumlah efektif adalah nilai yang lebih besar antara jumlah yang ditetapkan dan jumlah baris, dengan maksimum 1000. `request.data` pada tingkat langkah mengulang langkah tersebut, dan hanya ekstraksi dari eksekusi terakhir yang dipertahankan dalam cakupan bersama.

### Tipe skenario

Deklarasi berikut menjelaskan masukan dan keluaran skenario. `ScenarioDataRow` dan `ScenarioIterations` adalah struktur pendukung yang ditampilkan agar lebih jelas; keduanya bukan ekspor bernama dari akar paket. Strukturnya dapat diakses melalui antarmuka publik.

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

### stepRef dan resolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

`stepRef` mengutamakan `method` dan `path` eksplisit; jika tidak tersedia, fungsi menormalkan `ref` sambil mempertahankan operationId tanpa awalan. `resolveSteps` mengembalikan entri berisi `step`, `op`, dan `ref` yang dinormalkan; fungsi melempar pengecualian jika ada referensi yang tidak ditemukan, termasuk pada langkah yang dilewati.

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

Membaca nilai isi melalui JSONPath, header tanpa membedakan huruf besar dan kecil, atau status respons. Nilai yang tidak ada dan null diabaikan; nilai lainnya diubah menjadi string, sedangkan objek diserialisasi sebagai JSON.

## Fungsi pembantu pelaksana

Tanda tangan fungsi pembantu menggunakan tipe pendukung yang bukan ekspor bernama dari akar paket. Inferensikan tipe tersebut dari fungsi publik alih-alih mengimpor berkas internal:

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

Mengumpulkan operasi standar dan tambahan, memberikan operationId pengganti jika perlu, menyimpulkan protokol, dan menerapkan `config.filter`. Setiap entri berisi `path`, `method`, `operation`, `pathItem`, `operationId`, dan `protocol`.

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

`client` berasal dari `createClient` di `@powerduck/openapi-request`. Opsi wajib adalah `config` dan `spec`, sedangkan `signal`, `variables`, `values`, `serverUrl`, dan `extraAssertions` bersifat opsional. Hasil berisi `result`, `response` yang dinormalkan, `request` opsional, serta cakupan variabel `env` yang dihasilkan skrip. Pelaksana batch dan skenario menggunakan alur eksekusi yang sama.

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

Menghitung hasil lulus, gagal, kesalahan, dan dilewati. Tingkat kelulusan adalah jumlah lulus dibagi total, dibulatkan ke satu angka desimal; tanpa hasil, nilainya nol.

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

Mengambil pesan yang mudah dibaca dari string, Error, atau bidang `message` maupun `msg`, lalu menggunakan serialisasi sebagai pilihan terakhir. Masukan yang bernilai salah dalam konteks boolean menghasilkan `undefined`.

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

Membuat pemeriksaan yang tercantum pada [Asersi implisit](#implicit-assertions). Protokol yang tidak dikenal tidak menghasilkan pemeriksaan implisit.

## Asersi implisit {#implicit-assertions}

Jika operasi tidak mendefinisikan `x-tests` maupun skrip Postman, pelaksana menambahkan satu asersi implisit khusus protokol:

| Protokol | Pemeriksaan implisit |
|----------|----------------|
| `http`, `sse` | Status HTTP adalah `2xx` |
| `graphql` | Status HTTP `2xx` **dan** tidak ada array `errors` yang tidak kosong pada tingkat teratas |
| `grpc` | Kode status gRPC adalah `0` (OK) |
| `mcp` | Respons JSON-RPC memiliki `result` tanpa `error` |
| `websocket` | Koneksi mencapai `open` tanpa peristiwa kesalahan |