---
sidebar_position: 4
title: "مرجع API"
description: "مرجع API لمشغّل الدفعات ومشغّل السيناريوهات والإعدادات والتحققات ومولّدات التقارير في @powerduck/openapi-cli. يمكن استيراد العناصر التالية من جذر الحزمة."
---

# مرجع API

مرجع API لمشغّل الدفعات ومشغّل السيناريوهات والإعدادات والتحققات ومولّدات التقارير في `@powerduck/openapi-cli`. يمكن استيراد العناصر التالية من جذر الحزمة.

## نظرة عامة على العناصر المصدّرة

| العنصر المصدّر | النوع | الوصف |
|--------|------|-------------|
| `runTests` | دالة | تشغّل جميع العمليات المجمّعة وتُرجع `TestReport` |
| `resolveConfig` | دالة | تُنشئ `CliConfig` من الوسائط وملف الإعدادات والقيم الافتراضية |
| `loadSpec` | دالة غير متزامنة | تحمّل المواصفة من مسار محلي أو عنوان URL بعيد وتحلّ مراجعها |
| `isRemoteSpec` | دالة | تتحقق مما إذا كان مسار المواصفة يبدأ بـ `http(s)://` |
| `DEFAULT_CONFIG` | ثابت | القيم الافتراضية المضمّنة |
| `runDeclarativeAssertions` | دالة | تقيّم مصفوفة `DeclarativeAssertion` بناءً على الاستجابة |
| `extractAssertions` | دالة | تستخرج التحققات التصريحية `x-tests` من العملية |
| `extractPostmanScripts` | دالة | تستخرج نص برنامج اختبار Postman من العملية |
| `resolveJsonPath` | دالة | محلّل JSONPath مبسّط يدعم صيغة النقاط وفهارس المصفوفات |
| `generateJsonReport` | دالة | تكتب `report.json` على القرص وتُرجع مسار الملف |
| `generateCliReport` | دالة | تُنشئ نص تقرير CLI الملوّن دون طباعته |
| `printCliReport` | دالة | تطبع تقرير CLI في المخرجات القياسية وتُرجع النص |
| `generateHtmlReport` | دالة | تكتب `report.html` على القرص وتُرجع مسار الملف |
| `CliArgs` | نوع | بنية المدخلات المستخدمة لمعالجة وسائط CLI والإعدادات |
| `DeclarativeAssertion` | نوع | كائن تحقق تصريحي واحد |
| `CliConfig` | نوع | واجهة الإعدادات الأساسية |
| `TestReport` | نوع | التقرير الكامل الذي تُرجعه `runTests` |
| `TestResult` | نوع | نتيجة اختبار عملية واحدة |
| `TestSummary` | نوع | الأعداد الإجمالية للاختبارات الناجحة والفاشلة |
| `AssertionResult` | نوع | نتيجة تحقق واحد |
| `ReportFormat` | نوع | `"json" \| "cli" \| "html"` |
| `ProtocolName` | نوع | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | نوع | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | نوع | إعدادات المصادقة |
| `TlsConfig` | نوع | إعدادات TLS والشهادات |
| `FilterConfig` | نوع | مرشّح العمليات |
| `collectOperations` | دالة | تجمع العمليات مع تطبيق مرشّح تشغيل الدفعات |
| `executeStep` | دالة غير متزامنة | تشغّل عملية واحدة بإعدادات خاصة بالخطوة |
| `buildSummary` | دالة | تحسب الأعداد ونسبة النجاح من نتائج الاختبار |
| `formatAssertionError` | دالة | تحوّل خطأ التحقق إلى نص واضح |
| `buildImplicitAssertions` | دالة | تُنشئ التحققات الافتراضية الخاصة بالبروتوكول |
| `runScenario` | دالة غير متزامنة | تشغّل الخطوات بالترتيب باستخدام متغيرات مشتركة وتكرارات تستند إلى البيانات |
| `resolveSteps` | دالة | تحلّ جميع مراجع السيناريو قبل إرسال الطلبات |
| `applyExtracts` | دالة | تستخرج قيم الاستجابة إلى متغيرات نصية |
| `stepRef` | دالة | توحّد صيغة مرجع الخطوة |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | أنواع | تعريفات مدخلات السيناريو واستخراج القيم |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | أنواع | نتائج السيناريو والأحداث الفورية وخيارات التنفيذ |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

تحمّل المواصفة باستخدام `loadSpec`، وتجمع العمليات وفقًا لـ `config.filter`، ثم تنفّذها بتزامن محدود (`min(config.concurrency ?? 5, queue.length)`). تشغّل التحققات التصريحية وتحققات Postman، وتضيف تحققات ضمنية خاصة بالبروتوكول عند غياب تحققات المستخدم، ثم ترتّب النتائج حسب المسار ثم الطريقة وتُرجع `TestReport`.

تكون بنية `TestReport` المُرجع كما يلي:

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

تدمج `args` (خيارات CLI) وملف إعدادات JSON اختياريًا (`args.config`) و`DEFAULT_CONFIG`. تحمّل `envFile` الذي تحدده الإعدادات إن وُجد، ثم توسّع مراجع `${ENV_VAR}` في `serverUrl` و`proxy` وقيم الترويسات و`auth.token` وقيم المتغيرات. تُلقي `"No OpenAPI spec path provided..."` إذا لم تُحدَّد مواصفة، و`Invalid proxy URL: <url>` إذا تعذّر تحليل `proxy`.

تتوافق `CliArgs` مع خيارات CLI:

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

تقرأ `config.specPath`. إذا كانت `isRemoteSpec` صحيحة، تجلب المحتوى عبر HTTP(S) مع اتباع ما يصل إلى 5 عمليات إعادة توجيه وتطبيق `config.timeout` وإرسال `User-Agent: @powerduck/openapi-cli`؛ وإلا فتقرأ الملف المحلي. يُحلَّل المحتوى بوصفه JSON ويجب أن يكون كائنًا يحتوي على كائن `paths`. بعد ذلك تحاول حلّ مراجع `$ref` الداخلية؛ وإذا فشلت تبقى المواصفة دون تغيير.

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

تُرجع `true` إذا طابق `specPath` التعبير `/^https?:\/\//i` بعد إزالة المسافات من طرفيه.

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

## محرّك التحقق

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

تقيّم كل تحقق تصريحي في سياق الاستجابة. تُسجَّل أخطاء التقييم بوصفها `AssertionResult` فاشلة.

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

تجمع مصفوفات `x-tests` من عنصر المسار أولًا ثم من العملية، وتحتفظ فقط بالكائنات التي تتضمن `name` و`assert` معًا.

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

تُرجع النص الموجود في `operation["x-postman-scripts"].test` إن وُجد.

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

محلّل مبسّط يدعم البادئة `$.` أو `$` وصيغة النقاط وفهارس المصفوفات الرقمية، مثل `$.data.items[0].id`. يُرجع `undefined` إذا كان أحد أجزاء المسار غير موجود.

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

## مولّدات التقارير

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

قد يتضمن التقرير ترويسات الطلبات وأجسامها والمتغيرات وإعدادات المصادقة؛ أزل القيم الحساسة قبل مشاركته أو حفظه.

تُنشئ `outputDir` مع المجلدات الأب اللازمة، وتكتب `report.json` باستخدام `JSON.stringify(report, null, 2)`. تُرجع المسار المطلق للملف.

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

تُنشئ نص تقرير CLI الملوّن باستخدام تسلسلات الهروب ANSI، ويشمل العنوان والملخص وشريط التقدم وصفوف النتائج وتفاصيل التحققات، دون طباعته.

### printCliReport

```ts
printCliReport(report: TestReport): string
```

تستدعي `generateCliReport`، وتطبع النتيجة باستخدام `console.log`، ثم تُرجع النص.

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

تُنشئ `outputDir` وتكتب ملف `report.html` مستقلًا يحتوي على ملخص وشريط تقدم وأزرار تصفية وصفوف قابلة للتوسيع ووضعين فاتح وداكن. تُرجع مسار الملف.

## أنواع النتائج

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

## مشغّل السيناريوهات

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

يشغّل الخطوات بالترتيب باستخدام نطاق متغيرات مشترك لكل تكرار للسيناريو. يحلّ جميع مراجع العمليات قبل التنفيذ ويتجاهل مرشّح الدفعات، لذا يمكن استهداف أي عملية في المواصفة. تبدأ المتغيرات بقيم الإعدادات والسيناريو، وتصبح القيم المستخرجة متاحة للخطوات اللاحقة. القيمة الافتراضية لـ `stopOnFailure` هي `true`. يُلغي `options.signal` التشغيل وتُسجَّل الخطوات المتبقية على أنها متخطّاة؛ ولا توقف استثناءات مستمعي `onEvent` التنفيذ.

يشغّل `data` على مستوى السيناريو التسلسل كاملًا بنطاق جديد لكل صف. يمكن لـ `iterations` طلب تكرارات إضافية؛ والعدد الفعلي هو الأكبر بين العدد المحدد وعدد الصفوف، بحد أقصى 1000. يكرّر `request.data` على مستوى الخطوة تلك الخطوة، ولا تبقى في النطاق المشترك إلا القيم المستخرجة من التنفيذ الأخير.

### أنواع السيناريوهات

تصف التعريفات التالية مدخلات السيناريوهات ومخرجاتها. `ScenarioDataRow` و`ScenarioIterations` بنيتان مساعدتان معروضتان للتوضيح؛ وليستا عنصرين مُصدَّرين بالاسم من جذر الحزمة. يمكن الوصول إلى بنيتيهما عبر الواجهات العامة.

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

### stepRef وresolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

تُفضّل `stepRef` قيمتي `method` و`path` المحددتين صراحةً؛ وإلا فتوحّد صيغة `ref` مع الإبقاء على operationId المنفرد. تُرجع `resolveSteps` عناصر تتضمن `step` و`op` و`ref` بصيغته الموحّدة، وتُلقي استثناءً إذا تعذّر العثور على أي مرجع، حتى في الخطوات المتخطّاة.

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

تقرأ قيم الجسم عبر JSONPath، أو الترويسات دون تمييز حالة الأحرف، أو حالة الاستجابة. تُهمل القيم المفقودة وnull، وتحوّل بقية القيم إلى نصوص مع تسلسل الكائنات بصيغة JSON.

## الدوال المساعدة للمشغّل

تستخدم تواقيع الدوال المساعدة أنواعًا ليست مُصدَّرة بالاسم من الجذر. استنتجها من الدوال العامة بدلًا من استيراد الملفات الداخلية:

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

تجمع العمليات القياسية والإضافية، وتعيّن operationId بديلًا عند الحاجة، وتستنتج البروتوكول وتطبّق `config.filter`. يتضمن كل عنصر `path` و`method` و`operation` و`pathItem` و`operationId` و`protocol`.

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

يأتي `client` من `createClient` في `@powerduck/openapi-request`. تتطلب الخيارات `config` و`spec`، بينما تكون `signal` و`variables` و`values` و`serverUrl` و`extraAssertions` اختيارية. تتضمن النتيجة `result` و`response` الموحّدة و`request` الاختيارية ونطاق المتغيرات `env` الناتج عن البرامج النصية. يشترك مشغّل الدفعات ومشغّل السيناريوهات في مسار التنفيذ هذا.

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

تحسب النتائج الناجحة والفاشلة وذات الأخطاء والمتخطّاة. نسبة النجاح هي عدد النتائج الناجحة مقسومًا على الإجمالي، مع التقريب إلى منزلة عشرية واحدة؛ وتساوي صفرًا إذا لم توجد نتائج.

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

تستخرج رسالة واضحة من نص أو Error أو حقل `message` أو `msg`، ثم تلجأ إلى التسلسل عند تعذّر ذلك. إذا كانت قيمة المدخل تُعدّ خاطئة في السياق المنطقي، تُرجع `undefined`.

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

تُنشئ الفحوص الواردة في [التحققات الضمنية](#implicit-assertions). لا تُنشئ فحوصًا ضمنية للبروتوكولات غير المعروفة.

## التحققات الضمنية {#implicit-assertions}

عندما لا تعرّف العملية `x-tests` ولا برنامج Postman نصيًا، يضيف المشغّل تحققًا ضمنيًا واحدًا خاصًا بالبروتوكول:

| البروتوكول | الفحص الضمني |
|----------|----------------|
| `http`, `sse` | حالة HTTP هي `2xx` |
| `graphql` | حالة HTTP هي `2xx` **ولا** توجد مصفوفة `errors` غير فارغة في المستوى الأعلى |
| `grpc` | رمز حالة gRPC هو `0` (OK) |
| `mcp` | تتضمن استجابة JSON-RPC الحقل `result` ولا تتضمن `error` |
| `websocket` | وصل الاتصال إلى الحالة `open` دون حدث خطأ |