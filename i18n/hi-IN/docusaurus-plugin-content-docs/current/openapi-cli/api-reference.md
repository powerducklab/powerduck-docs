---
sidebar_position: 4
title: "API संदर्भ"
description: "@powerduck/openapi-cli के बैच रनर, परिदृश्य रनर, कॉन्फ़िगरेशन, जाँचों और रिपोर्ट जनरेटर का API संदर्भ। नीचे दिए गए एक्सपोर्ट पैकेज के रूट से उपलब्ध हैं।"
---

# API संदर्भ

`@powerduck/openapi-cli` के बैच रनर, परिदृश्य रनर, कॉन्फ़िगरेशन, जाँचों और रिपोर्ट जनरेटर का API संदर्भ। नीचे दिए गए एक्सपोर्ट पैकेज के रूट से उपलब्ध हैं।

## एक्सपोर्ट का अवलोकन

| एक्सपोर्ट | प्रकार | विवरण |
|--------|------|-------------|
| `runTests` | फ़ंक्शन | संग्रहित सभी ऑपरेशन चलाता है और `TestReport` लौटाता है |
| `resolveConfig` | फ़ंक्शन | आर्ग्युमेंट, कॉन्फ़िगरेशन फ़ाइल और डिफ़ॉल्ट मानों से `CliConfig` तैयार करता है |
| `loadSpec` | एसिंक्रोनस फ़ंक्शन | स्थानीय पथ या दूरस्थ URL से स्पेसिफ़िकेशन लोड करके उसके संदर्भ हल करता है |
| `isRemoteSpec` | फ़ंक्शन | जाँचता है कि स्पेसिफ़िकेशन का पथ `http(s)://` से शुरू होता है या नहीं |
| `DEFAULT_CONFIG` | स्थिरांक | अंतर्निहित डिफ़ॉल्ट मान |
| `runDeclarativeAssertions` | फ़ंक्शन | रिस्पॉन्स के आधार पर `DeclarativeAssertion` की ऐरे का मूल्यांकन करता है |
| `extractAssertions` | फ़ंक्शन | ऑपरेशन से `x-tests` की घोषणात्मक जाँचें निकालता है |
| `extractPostmanScripts` | फ़ंक्शन | ऑपरेशन से Postman टेस्ट स्क्रिप्ट की स्ट्रिंग निकालता है |
| `resolveJsonPath` | फ़ंक्शन | सरल JSONPath रिज़ॉल्वर (डॉट नोटेशन और ऐरे इंडेक्स) |
| `generateJsonReport` | फ़ंक्शन | `report.json` को डिस्क पर लिखता है और फ़ाइल का पथ लौटाता है |
| `generateCliReport` | फ़ंक्शन | रंगीन CLI रिपोर्ट की स्ट्रिंग बनाता है, लेकिन प्रिंट नहीं करता |
| `printCliReport` | फ़ंक्शन | CLI रिपोर्ट को मानक आउटपुट पर प्रिंट करता है और स्ट्रिंग लौटाता है |
| `generateHtmlReport` | फ़ंक्शन | `report.html` को डिस्क पर लिखता है और फ़ाइल का पथ लौटाता है |
| `CliArgs` | टाइप | CLI आर्ग्युमेंट और कॉन्फ़िगरेशन हल करने वाले इनपुट की संरचना |
| `DeclarativeAssertion` | टाइप | एक घोषणात्मक जाँच का ऑब्जेक्ट |
| `CliConfig` | टाइप | मुख्य कॉन्फ़िगरेशन इंटरफ़ेस |
| `TestReport` | टाइप | `runTests` द्वारा लौटाई गई पूरी रिपोर्ट |
| `TestResult` | टाइप | एक ऑपरेशन के टेस्ट का परिणाम |
| `TestSummary` | टाइप | सफल और असफल टेस्ट की कुल संख्या |
| `AssertionResult` | टाइप | एक जाँच का परिणाम |
| `ReportFormat` | टाइप | `"json" \| "cli" \| "html"` |
| `ProtocolName` | टाइप | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | टाइप | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | टाइप | प्रमाणीकरण कॉन्फ़िगरेशन |
| `TlsConfig` | टाइप | TLS और प्रमाणपत्र कॉन्फ़िगरेशन |
| `FilterConfig` | टाइप | ऑपरेशन फ़िल्टर |
| `collectOperations` | फ़ंक्शन | बैच फ़िल्टर लागू करके ऑपरेशन संग्रहित करता है |
| `executeStep` | एसिंक्रोनस फ़ंक्शन | चरण-विशिष्ट सेटिंग के साथ एक ऑपरेशन चलाता है |
| `buildSummary` | फ़ंक्शन | टेस्ट परिणामों से संख्या और सफलता दर की गणना करता है |
| `formatAssertionError` | फ़ंक्शन | जाँच की त्रुटि को पढ़ने योग्य टेक्स्ट में बदलता है |
| `buildImplicitAssertions` | फ़ंक्शन | प्रोटोकॉल-विशिष्ट डिफ़ॉल्ट जाँचें बनाता है |
| `runScenario` | एसिंक्रोनस फ़ंक्शन | साझा वेरिएबल और डेटा-आधारित पुनरावृत्तियों के साथ चरण क्रम से चलाता है |
| `resolveSteps` | फ़ंक्शन | रिक्वेस्ट भेजने से पहले परिदृश्य के सभी संदर्भ हल करता है |
| `applyExtracts` | फ़ंक्शन | रिस्पॉन्स के मान स्ट्रिंग वेरिएबल में निकालता है |
| `stepRef` | फ़ंक्शन | चरण के संदर्भ को सामान्य रूप देता है |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | टाइप | परिदृश्य के इनपुट और मान निकालने की परिभाषाएँ |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | टाइप | परिदृश्य के परिणाम, लाइव इवेंट और निष्पादन विकल्प |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

`loadSpec` से स्पेसिफ़िकेशन लोड करता है, `config.filter` के अनुसार ऑपरेशन संग्रहित करता है और सीमित समवर्तिता (`min(config.concurrency ?? 5, queue.length)`) के साथ चलाता है। घोषणात्मक और Postman जाँचें चलाता है, उपयोगकर्ता की जाँचें न होने पर प्रोटोकॉल की अंतर्निहित जाँचें जोड़ता है, परिणामों को पहले पथ और फिर मेथड के अनुसार क्रमबद्ध करता है और `TestReport` लौटाता है।

लौटाए गए `TestReport` की संरचना यह है:

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

`args` (CLI विकल्प), वैकल्पिक JSON कॉन्फ़िगरेशन फ़ाइल (`args.config`) और `DEFAULT_CONFIG` को मिलाता है। तय किए गए `envFile` को, यदि मौजूद हो, लोड करता है; फिर `serverUrl`, `proxy`, हेडर के मानों, `auth.token` और वेरिएबल के मानों में `${ENV_VAR}` संदर्भों का विस्तार करता है। स्पेसिफ़िकेशन न दिए जाने पर `"No OpenAPI spec path provided..."` और `proxy` पार्स न हो पाने पर `Invalid proxy URL: <url>` त्रुटि देता है।

`CliArgs` CLI विकल्पों के अनुरूप है:

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

`config.specPath` पढ़ता है। यदि `isRemoteSpec` सही है, तो HTTP(S) से सामग्री लाता है, अधिकतम 5 रीडायरेक्ट का अनुसरण करता है, `config.timeout` लागू करता है और `User-Agent: @powerduck/openapi-cli` भेजता है; अन्यथा स्थानीय फ़ाइल पढ़ता है। सामग्री JSON के रूप में पार्स की जाती है और उसमें `paths` ऑब्जेक्ट वाला एक ऑब्जेक्ट होना चाहिए। इसके बाद आंतरिक `$ref` हल करने की कोशिश करता है; विफल होने पर स्पेसिफ़िकेशन अपरिवर्तित रहता है।

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

आगे और पीछे की खाली जगह हटाने के बाद `specPath`, `/^https?:\/\//i` से मेल खाए तो `true` लौटाता है।

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

## जाँच इंजन

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

रिस्पॉन्स के संदर्भ में हर घोषणात्मक जाँच का मूल्यांकन करता है। मूल्यांकन की त्रुटियाँ असफल `AssertionResult` के रूप में दर्ज की जाती हैं।

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

पहले पथ आइटम और फिर ऑपरेशन से `x-tests` ऐरे संग्रहित करता है; केवल वे ऑब्जेक्ट रखता है जिनमें `name` और `assert` दोनों हों।

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

`operation["x-postman-scripts"].test` मौजूद हो तो उसकी स्ट्रिंग लौटाता है।

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

सरल रिज़ॉल्वर जो शुरुआती `$.` या `$`, डॉट नोटेशन और संख्यात्मक ऐरे इंडेक्स, जैसे `$.data.items[0].id`, का समर्थन करता है। कोई हिस्सा मौजूद न हो तो `undefined` लौटाता है।

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

## रिपोर्ट जनरेटर

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

रिपोर्ट में रिक्वेस्ट के हेडर, बॉडी, वेरिएबल और प्रमाणीकरण सेटिंग हो सकती हैं; साझा करने या सहेजने से पहले संवेदनशील मान हटा दें।

ज़रूरी पैरेंट डायरेक्टरी सहित `outputDir` बनाता है और `JSON.stringify(report, null, 2)` से `report.json` लिखता है। पूर्ण फ़ाइल पथ लौटाता है।

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

ANSI एस्केप सीक्वेंस वाली रंगीन CLI रिपोर्ट स्ट्रिंग बनाता है, जिसमें शीर्षक, सारांश, प्रगति पट्टी, परिणामों की पंक्तियाँ और जाँचों का विवरण होता है। इसे प्रिंट नहीं करता।

### printCliReport

```ts
printCliReport(report: TestReport): string
```

`generateCliReport` को कॉल करता है, `console.log` से परिणाम प्रिंट करता है और स्ट्रिंग लौटाता है।

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

`outputDir` बनाता है और सारांश, प्रगति पट्टी, फ़िल्टर बटन, विस्तार योग्य पंक्तियों तथा हल्के/गहरे मोड वाली स्वतंत्र `report.html` फ़ाइल लिखता है। फ़ाइल का पथ लौटाता है।

## परिणाम के टाइप

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

## परिदृश्य रनर

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

हर परिदृश्य पुनरावृत्ति में साझा वेरिएबल स्कोप के साथ चरण क्रम से चलाता है। निष्पादन से पहले सभी ऑपरेशन संदर्भ हल करता है और बैच फ़िल्टर को अनदेखा करता है, इसलिए स्पेसिफ़िकेशन के किसी भी ऑपरेशन को लक्ष्य बनाया जा सकता है। शुरुआती वेरिएबल कॉन्फ़िगरेशन और परिदृश्य से लिए जाते हैं; निकाले गए मान अगले चरणों में उपलब्ध होते हैं। `stopOnFailure` का डिफ़ॉल्ट `true` है। `options.signal` रन रद्द करता है और बाकी चरण छोड़े गए के रूप में दर्ज होते हैं; `onEvent` लिसनर के अपवाद निष्पादन नहीं रोकते।

परिदृश्य स्तर का `data` हर पंक्ति के लिए नए स्कोप के साथ पूरा क्रम चलाता है। `iterations` से अतिरिक्त दोहराव माँगे जा सकते हैं; वास्तविक संख्या घोषित संख्या और पंक्तियों की संख्या में से बड़ी होती है, अधिकतम 1000। चरण स्तर का `request.data` उस चरण को दोहराता है और केवल अंतिम निष्पादन से निकाले गए मान साझा स्कोप में रहते हैं।

### परिदृश्य के टाइप

नीचे की घोषणाएँ परिदृश्य के इनपुट और आउटपुट बताती हैं। `ScenarioDataRow` और `ScenarioIterations` स्पष्टता के लिए दिखाई गई सहायक संरचनाएँ हैं; ये पैकेज रूट से नामित एक्सपोर्ट नहीं हैं। इनकी संरचनाएँ सार्वजनिक इंटरफ़ेस के माध्यम से उपलब्ध हैं।

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

### stepRef और resolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

`stepRef` स्पष्ट रूप से दिए गए `method` और `path` को प्राथमिकता देता है; अन्यथा बिना उपसर्ग वाले operationId को बनाए रखते हुए `ref` को सामान्य रूप देता है। `resolveSteps` ऐसे आइटम लौटाता है जिनमें `step`, `op` और सामान्यीकृत `ref` होते हैं; छोड़े गए चरणों सहित कोई भी संदर्भ न मिले तो अपवाद देता है।

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

JSONPath से बॉडी के मान, अक्षरों के बड़े-छोटे रूप का भेद किए बिना हेडर, या रिस्पॉन्स स्टेटस पढ़ता है। गायब और null मान छोड़ देता है; बाकी को स्ट्रिंग में बदलता है और ऑब्जेक्ट को JSON में सीरियलाइज़ करता है।

## रनर के सहायक फ़ंक्शन

सहायक फ़ंक्शन के सिग्नेचर ऐसे टाइप इस्तेमाल करते हैं जो रूट से नामित एक्सपोर्ट नहीं हैं। आंतरिक फ़ाइलें इम्पोर्ट करने के बजाय सार्वजनिक फ़ंक्शन से उनके टाइप निकालें:

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

मानक और अतिरिक्त ऑपरेशन संग्रहित करता है, ज़रूरत पर वैकल्पिक operationId देता है, प्रोटोकॉल निर्धारित करता है और `config.filter` लागू करता है। हर आइटम में `path`, `method`, `operation`, `pathItem`, `operationId` और `protocol` होते हैं।

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

`client`, `@powerduck/openapi-request` के `createClient` से बनता है। विकल्पों में `config` और `spec` आवश्यक हैं; `signal`, `variables`, `values`, `serverUrl` और `extraAssertions` वैकल्पिक हैं। परिणाम में `result`, सामान्यीकृत `response`, वैकल्पिक `request` और स्क्रिप्ट से बना वेरिएबल स्कोप `env` होता है। बैच और परिदृश्य रनर इसी निष्पादन मार्ग का उपयोग करते हैं।

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

सफल, असफल, त्रुटिपूर्ण और छोड़े गए परिणाम गिनता है। सफलता दर सफल परिणामों की संख्या को कुल से भाग देकर, एक दशमलव स्थान तक राउंड करके निकाली जाती है; कोई परिणाम न हो तो दर शून्य होती है।

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

स्ट्रिंग, Error, `message` या `msg` फ़ील्ड से पढ़ने योग्य संदेश लेता है; अंत में सीरियलाइज़ेशन का सहारा लेता है। बूलियन संदर्भ में गलत माने जाने वाले इनपुट पर `undefined` लौटाता है।

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

[अंतर्निहित जाँचें](#implicit-assertions) में दी गई जाँचें बनाता है। अज्ञात प्रोटोकॉल के लिए कोई अंतर्निहित जाँच नहीं बनती।

## अंतर्निहित जाँचें {#implicit-assertions}

जब किसी ऑपरेशन में न `x-tests` परिभाषित हो और न Postman स्क्रिप्ट, रनर एक प्रोटोकॉल-विशिष्ट अंतर्निहित जाँच जोड़ता है:

| प्रोटोकॉल | अंतर्निहित जाँच |
|----------|----------------|
| `http`, `sse` | HTTP स्टेटस `2xx` हो |
| `graphql` | HTTP स्टेटस `2xx` हो **और** शीर्ष स्तर पर कोई गैर-खाली `errors` ऐरे न हो |
| `grpc` | gRPC स्टेटस कोड `0` (OK) हो |
| `mcp` | JSON-RPC रिस्पॉन्स में `result` हो और `error` न हो |
| `websocket` | बिना किसी त्रुटि इवेंट के कनेक्शन `open` स्थिति तक पहुँचा हो |