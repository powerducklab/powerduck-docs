---
sidebar_position: 4
title: "API संदर्भ"
description: "@powerduck/conf-patch का पूरा संदर्भ, जिसमें हर एक्सपोर्ट किए गए प्रतीक के सिग्नेचर और डिफ़ॉल्ट मान शामिल हैं।"
---

# API संदर्भ

`@powerduck/conf-patch` का पूरा संदर्भ, जिसमें हर एक्सपोर्ट किए गए प्रतीक के सिग्नेचर और डिफ़ॉल्ट मान शामिल हैं।

दो प्रवेश बिंदु उपलब्ध हैं:

- **`@powerduck/conf-patch`** — नीचे दिए सभी कार्य: मुख्य स्तर, फ़ाइल स्तर, OpenAPI सत्यापन और उपयोगिताएँ।
- **`@powerduck/conf-patch/core`** — केवल ब्राउज़र-अनुकूल भाग: `patchContent`, `setContentValue`, `deleteContentValue`, `PatchContentOptions`, शर्त जाँचने वाले सहायक फ़ंक्शन और `ConfigFormat`, `JsonPatchOp`, `JsonPathSegment` प्रकार।

---

## मुख्य स्तर (ब्राउज़र के अनुकूल)

### `patchContent`

कॉन्फ़िगरेशन स्ट्रिंग पर RFC 6902 पैच ऑपरेशन का ऐरे लागू करता है। यह शुद्ध फ़ंक्शन है और फ़ाइल सिस्टम तक नहीं पहुँचता।

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| पैरामीटर | प्रकार | विवरण |
|---|---|---|
| `content` | `string` | मूल कॉन्फ़िगरेशन सामग्री। दिए गए `format` के अनुसार मान्य होनी चाहिए। |
| `ops` | `JsonPatchOp[]` | क्रम से लागू किए जाने वाले ऑपरेशन। खाली ऐरे `content` को बिना बदले लौटाता है। |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`। |
| `options.strict` | `boolean` | `true` (डिफ़ॉल्ट) पर विफल ऑपरेशन अपवाद उत्पन्न करता है। `false` पर उसे छोड़ दिया जाता है और `console.warn` से चेतावनी दी जाती है। |

**लौटाता है:** पैच लागू होने के बाद की कॉन्फ़िगरेशन सामग्री (`string`)।

**अपवाद:** `content` स्ट्रिंग न हो या `ops` अमान्य हो तो `TypeError`; `strict` के `true` होने पर विफल ऑपरेशन का विवरण देने वाली त्रुटि।

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

patchContent(
  '{"name": "app"}',
  [{ op: "add", path: ["version"], value: "1.0.0" }],
  "json",
);
// => '{\n  "name": "app",\n  "version": "1.0.0"\n}'
```

---

### `setContentValue`

एक मान सेट करता या बनाता है। अंदर एक `add` ऑपरेशन के साथ `patchContent` बुलाता है। RFC 6902 के अनुसार, `add` मौजूदा ऑब्जेक्ट प्रॉपर्टी बदलता है या ऐरे इंडेक्स पर तत्व डालता है।

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| पैरामीटर | प्रकार | विवरण |
|---|---|---|
| `content` | `string` | मूल कॉन्फ़िगरेशन सामग्री। |
| `path` | `readonly (string \| number)[]` | खंडों में दिया पथ, जैसे `["server", "port"]`। खाली नहीं हो सकता। |
| `value` | `unknown` | लिखा जाने वाला मान। |
| `format` | `ConfigFormat` | कॉन्फ़िगरेशन फ़ॉर्मैट। |

**लौटाता है:** अपडेट की गई सामग्री (`string`)।

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

कुंजी या ऐरे तत्व हटाता है। अंदर एक `remove` ऑपरेशन के साथ `patchContent` बुलाता है। पथ मौजूद होना चाहिए।

```typescript
function deleteContentValue(
  content: string,
  path: readonly (string | number)[],
  format: ConfigFormat,
): string;
```

```typescript
deleteContentValue(
  '{"name": "app", "legacy": true}',
  ["legacy"],
  "json",
);
```

---

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  /** When true, failed operations throw. When false, they are skipped with a warning. Default: true */
  strict?: boolean;
}
```

---

## फ़ाइल स्तर (केवल Node.js / Electron)

### `readConfigFile`

स्थानीय फ़ाइल पथ या `file://` URL से UTF-8 टेक्स्ट पढ़ता है।

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| पैरामीटर | प्रकार | विवरण |
|---|---|---|
| `filePath` | `string` | पूर्ण पथ, सापेक्ष पथ या `file://` URL। खाली नहीं हो सकता। |

**लौटाता है:** मूल UTF-8 सामग्री (`Promise<string>`)।

**अपवाद:** फ़ाइल पढ़ने में विफलता पर मूल फ़ाइल सिस्टम त्रुटि को समाहित करने वाली त्रुटि।

---

### `writeConfigFile`

अस्थायी फ़ाइल और नाम बदलने की प्रक्रिया से **एटॉमिक लेखन** करता है। डिफ़ॉल्ट रूप से अनन्य **फ़ाइल लॉक** उपयोग होता है। लॉक लेने से पहले पैरेंट डायरेक्टरी बनाई जाती हैं।

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| पैरामीटर | प्रकार | विवरण |
|---|---|---|
| `filePath` | `string` | कॉन्फ़िगरेशन फ़ाइल का पथ। |
| `content` | `string` | लिखी जाने वाली सामग्री। स्ट्रिंग होनी चाहिए। |
| `options` | `WriteConfigOptions` | नीचे देखें। |

**अपवाद:** अमान्य इनपुट पर `TypeError`; लेखन की फ़ाइल सिस्टम त्रुटियाँ समाहित करके दी जाती हैं।

#### `WriteConfigOptions`

| विकल्प | प्रकार | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `lock` | `boolean` | `true` | लेखन के दौरान फ़ाइल लॉक चालू करता है। |
| `lockTimeoutMs` | `number` | `withFileLock` का डिफ़ॉल्ट (10 सेकंड) | लॉक लेने के लिए अधिकतम प्रतीक्षा समय, मिलीसेकंड में। |
| `lockRetryDelayMs` | `number` | `withFileLock` का डिफ़ॉल्ट (25 मिलीसेकंड) | तेज़ी से बढ़ती प्रतीक्षा शुरू होने से पहले का प्रारंभिक पुनः प्रयास विलंब, मिलीसेकंड में। |
| `lockStaleThresholdMs` | `number` | `withFileLock` का डिफ़ॉल्ट | लॉक की आयु, मिलीसेकंड में, जिसके बाद उसे पुनर्प्राप्त किया जा सकता है। |
| `allowStaleRecovery` | `boolean` | `false` | पुराने लॉक अपने-आप वापस लेने की अनुमति। |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

फ़ाइल स्तर का मुख्य लेनदेन: लॉक के भीतर फ़ाइल पढ़ता है, `patchContent` लागू करता है और **केवल सामग्री बदलने पर** एटॉमिक रूप से वापस लिखता है। `options.format` न देने पर एक्सटेंशन से फ़ॉर्मैट पहचाना जाता है।

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| पैरामीटर | प्रकार | विवरण |
|---|---|---|
| `filePath` | `string` | कॉन्फ़िगरेशन फ़ाइल का पथ। खाली नहीं हो सकता। |
| `ops` | `JsonPatchOp[]` | लागू किए जाने वाले ऑपरेशन। खाली ऐरे बिना पढ़े या लिखे लौट जाता है। |
| `options` | `PatchConfigOptions` | नीचे देखें। |

**अपवाद:** `filePath` खाली हो, लॉक विकल्प अमान्य हों या फ़ॉर्मैट पहचाना न जा सके और `format` भी न दिया हो तो `TypeError`; `strict` के `true` होने पर ऑपरेशन की त्रुटि।

#### `PatchConfigOptions`

| विकल्प | प्रकार | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `format` | `ConfigFormat` | स्वचालित पहचान | स्पष्ट फ़ॉर्मैट, जिसे एक्सटेंशन की पहचान पर प्राथमिकता मिलती है। |
| `strict` | `boolean` | `true` | विफल ऑपरेशन अपवाद उत्पन्न करते हैं। |
| `lock` | `boolean` | `true` | फ़ाइल लॉक चालू करता है। |
| `lockTimeoutMs` | `number` | 10 सेकंड | गैर-ऋणात्मक मान। लॉक की अधिकतम प्रतीक्षा। |
| `lockRetryDelayMs` | `number` | 25 मिलीसेकंड | धनात्मक मान। प्रारंभिक पुनः प्रयास विलंब। |
| `lockStaleThresholdMs` | `number` | गणना से तय | धनात्मक मान। पुराने लॉक की पुनर्प्राप्ति के लिए आवश्यक आयु। |
| `allowStaleRecovery` | `boolean` | `false` | पुराने लॉक अपने-आप वापस लेता है। |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

फ़ाइल में नेस्टेड मान जोड़ता या बदलता है। एक `add` ऑपरेशन `patchConfigFile` को सौंपता है।

```typescript
function setConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  value: unknown,
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await setConfigValue("config.yaml", ["database", "port"], 5432);
```

---

### `deleteConfigValue`

फ़ाइल से मौजूदा नेस्टेड मान हटाता है। एक `remove` ऑपरेशन `patchConfigFile` को सौंपता है।

```typescript
function deleteConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await deleteConfigValue("config.json", ["features", "betaPreview"]);
```

---

### `withFileLock`

प्रक्रिया के भीतर की कतार **और** अनन्य लॉक फ़ाइल (`<file>.confedit.lock`) के अंतर्गत असिंक्रोनस कॉलबैक चलाता है। लॉक स्वामित्व टोकन उपयोग करते हैं। पुराना लॉक तभी पुनर्प्राप्त होता है जब `allowStaleRecovery`, `true` हो और उसकी आयु `staleThresholdMs` से अधिक हो। PID दोबारा उपयोग किए जा सकते हैं, इसलिए उनकी जाँच नहीं की जाती।

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| पैरामीटर | प्रकार | विवरण |
|---|---|---|
| `filePath` | `string` | लॉक की जाने वाली फ़ाइल। |
| `callback` | `() => Promise<T>` | लॉक बनाए रखते समय चलने वाला कार्य। |
| `options` | `FileLockOptions` | नीचे देखें। |

**लौटाता है:** `callback` का परिणाम (`Promise<T>`)। कॉलबैक अपवाद उत्पन्न करे तब भी लॉक `finally` ब्लॉक में छोड़ा जाता है।

#### `FileLockOptions`

| विकल्प | प्रकार | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | लॉक की अधिकतम प्रतीक्षा, मिलीसेकंड में। गैर-ऋणात्मक होनी चाहिए। |
| `retryDelayMs` | `number` | `25` | प्रारंभिक विलंब, मिलीसेकंड में। धनात्मक होना चाहिए। विलंब 1.5 गुना बढ़ता है, अधिकतम 1000 मिलीसेकंड तक। |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | पुनर्प्राप्ति की अनुमति देने वाली लॉक आयु, मिलीसेकंड में। धनात्मक होनी चाहिए। |
| `allowStaleRecovery` | `boolean` | `false` | पुराने लॉक की स्वचालित पुनर्प्राप्ति। सक्रिय लेनदेन बाधित न हों, इसलिए Electron की एकल मुख्य प्रक्रिया में यह डिफ़ॉल्ट रूप से बंद है। |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

वर्तमान प्रक्रिया की सभी लॉक फ़ाइलें हटाता है। सक्रिय फ़ाइल लेनदेन पूरे होने के बाद, अनुप्रयोग बंद करते समय उपयोग करें। Electron में असिंक्रोनस सफ़ाई के लिए पहला निकास इवेंट रोकें और सफ़ाई पूरी होने पर निकास जारी रखें; उदाहरण देखें। अलग-अलग लॉक की विफलताएँ अनदेखी की जाती हैं।

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## OpenAPI सत्यापन

### `validateOpenAPISpec`

मूल OpenAPI/Swagger सामग्री को JSON या YAML के रूप में सत्यापित करता है। डिफ़ॉल्ट रूप से इनपुट **सामग्री** माना जाता है; केवल `inputKind: "file"` पर फ़ाइल पथ समझा जाता है। सत्यापन `@powerduck/openapi-parser` करता है; यह फ़ंक्शन इनपुट पर सुरक्षा जाँच जोड़ता है।

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| पैरामीटर | प्रकार | विवरण |
|---|---|---|
| `input` | `string` | मूल विनिर्देश सामग्री, या `inputKind: "file"` पर फ़ाइल पथ। |
| `options` | `ValidateOpenApiOptions` | नीचे देखें। |

**लौटाता है:** सफलता पर सत्यापित दस्तावेज़ (`Promise<AnyOpenAPIDocument>`)।

**अपवाद:** खाली या गैर-स्ट्रिंग इनपुट पर `TypeError`; अमान्य विकल्प या सत्यापन विफलता पर [`OpenApiValidationError`](#openapivalidationerror)।

---

### `validateOpenAPIFile`

सहायक फ़ंक्शन जो `inputKind: "file"` और दिए पथ वाले `baseFilePath` के साथ `validateOpenAPISpec` बुलाता है। `allowedRootDirectory` आवश्यक है।

```typescript
function validateOpenAPIFile(
  filePath: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

```typescript
import { validateOpenAPIFile } from "@powerduck/conf-patch";

const doc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
});
```

---

### `ValidateOpenApiOptions`

| विकल्प | प्रकार | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | `input` को कैसे समझना है। |
| `baseFilePath` | `string` | — | संदर्भ समाधान के लिए आधार पथ। |
| `allowedRootDirectory` | `string` | — | फ़ाइल इनपुट की मूल डायरेक्टरी। `inputKind` के `"file"` होने पर **अनिवार्य**। |
| `timeoutMs` | `number` | `15000` | ऑपरेशन की समय-सीमा, मिलीसेकंड में। |
| `maxInputBytes` | `number` | `5242880` (5 MB) | मूल इनपुट का अधिकतम आकार, बाइट में। |
| `maxDocumentNodes` | `number` | `100000` | पार्स किए दस्तावेज़ में अधिकतम नोड, DoS सुरक्षा के लिए। |
| `maxDocumentDepth` | `number` | `100` | अधिकतम नेस्टिंग गहराई, DoS सुरक्षा के लिए। |
| `maxValidationErrors` | `number` | `50` | संदेश में शामिल त्रुटियों की अधिकतम संख्या। |
| `maxErrorMessageLength` | `number` | `1000` | हर सत्यापन त्रुटि में अधिकतम वर्ण। |
| `signal` | `AbortSignal` | — | वैकल्पिक रद्द करने का संकेत। |

---

### `OpenApiValidationError`

सत्यापन विफल होने पर संरचित त्रुटि। क्लाइंट को लौटाने से पहले अनुप्रयोग की सीमा पर त्रुटि का उपयुक्त रूप बनाएँ; संदेश और कारण में स्थानीय पथ या दस्तावेज़ विवरण हो सकते हैं।

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| प्रॉपर्टी | प्रकार | विवरण |
|---|---|---|
| `code` | `string` | प्रोग्राम से पढ़ा जा सकने वाला त्रुटि कोड; नीचे की तालिका देखें। |
| `message` | `string` | उपयोगकर्ता के पढ़ने योग्य विवरण। |
| `cause` | `unknown` | वैकल्पिक मूल त्रुटि। |

#### त्रुटि कोड

| कोड | अर्थ |
|---|---|
| `INVALID_OPTION` | अमान्य विकल्प मान दिया गया। |
| `INPUT_TOO_LARGE` | मूल सामग्री `maxInputBytes` से अधिक है। |
| `INPUT_FILE_TOO_LARGE` | इनपुट फ़ाइल आकार सीमा से बड़ी है। |
| `FILE_INPUT_FORBIDDEN` | `allowedRootDirectory` के बिना फ़ाइल इनपुट उपयोग हुआ। |
| `PATH_OUTSIDE_ROOT` | हल किया गया फ़ाइल पथ `allowedRootDirectory` के बाहर है। |
| `PARSE_ERROR` | JSON/YAML सामग्री पार्स नहीं हो सकी। |
| `INVALID_DOCUMENT_SHAPE` | दस्तावेज़ JSON ऑब्जेक्ट नहीं है। |
| `UNSUPPORTED_VERSION` | दस्तावेज़ समर्थित OpenAPI/Swagger संस्करण घोषित नहीं करता; केवल मुख्य संस्करण `2` और `3` स्वीकार किए जाते हैं। |
| `DOCUMENT_TOO_DEEP` | नेस्टिंग गहराई `maxDocumentDepth` से अधिक है। |
| `DOCUMENT_TOO_LARGE` | नोड की संख्या `maxDocumentNodes` से अधिक है। |
| `SPEC_VALIDATION_FAILED` | विनिर्देश OpenAPI सत्यापन में विफल रहा। |
| `OPERATION_TIMEOUT` | ऑपरेशन ने `timeoutMs` पार कर लिया। |
| `OPERATION_ABORTED` | ऑपरेशन `signal` से रद्द हुआ। |
| `UNKNOWN_ERROR` | अनपेक्षित त्रुटि। |

---

## उपयोगिताएँ

### `detectFormat`

फ़ाइल पथ या `file://` URL के एक्सटेंशन से [`ConfigFormat`](#configformat) पहचानता है।

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| एक्सटेंशन | परिणाम |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| कोई अन्य एक्सटेंशन | त्रुटि उत्पन्न करता है |

---

### `normalizeFilePath`

स्थानीय पथ या `file:` URL को सिस्टम के पूर्ण पथ में बदलता है। मान्य खाली स्थान और Unicode फ़ाइल नाम बनाए रखता है।

```typescript
function normalizeFilePath(filePath: string): string;
```

`file:` URL को `fileURLToPath` से डिकोड किया जाता है; पूर्ण पथ बिना बदले लौटता है; सापेक्ष पथ `process.cwd()` के आधार पर हल होता है।

---

## शर्त जाँचने वाले सहायक फ़ंक्शन

इन्हें उन्नत उपयोग और आंतरिक मॉड्यूल के लिए दोबारा एक्सपोर्ट किया जाता है। अनुप्रयोग कोड को सीधे इनकी कम ही आवश्यकता होती है।

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
`value` खाली न होने वाली स्ट्रिंग न हो तो `TypeError` उत्पन्न करता है।

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
`path` ऐसा गैर-खाली ऐरे न हो जिसके खंड गैर-खाली स्ट्रिंग या सुरक्षित गैर-ऋणात्मक पूर्णांक हों, तो अपवाद उत्पन्न करता है।

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
हर ऑपरेशन जाँचता है: `op`, `"add" | "replace" | "remove"` होना चाहिए; `path` को `assertPatchPath` पास करना चाहिए; `add`/`replace` में अपनी `value` प्रॉपर्टी होनी चाहिए।

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
`format`, `"json"`, `"jsonc"` या `"yaml"` न हो तो अपवाद उत्पन्न करता है।

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
`Error` इंस्टेंस के लिए `error.message`, अन्यथा `String(error)` लौटाता है।

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
`Error` बनाकर `Object.defineProperty` से `cause` प्रॉपर्टी जोड़ता है; पुराने रनटाइम के लिए वैकल्पिक तरीका भी है।

---

## प्रकार

### `ConfigFormat`

```typescript
type ConfigFormat = "json" | "jsonc" | "yaml";
```

### `JsonPathSegment`

```typescript
type JsonPathSegment = string | number;
```

### `JsonPatchOp`

```typescript
interface JsonPatchOp {
  op: "add" | "replace" | "remove";
  path: JsonPathSegment[];
  /** Required for "add" and "replace". */
  value?: unknown;
}
```

:::caution
केवल `"add"`, `"replace"` और `"remove"` समर्थित हैं। `"move"`, `"copy"` और `"test"` जानबूझकर शामिल नहीं किए गए हैं।
:::

### `PatchConfigOptions`

```typescript
interface PatchConfigOptions {
  format?: ConfigFormat;
  strict?: boolean;
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `FileLockOptions`

```typescript
interface FileLockOptions {
  /** Max time to wait for a lock. Defaults to 10 seconds. */
  timeoutMs?: number;
  /** Initial retry delay. Defaults to 25ms. */
  retryDelayMs?: number;
  /** Explicit lock age after which recovery is allowed. */
  staleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `WriteConfigOptions`

```typescript
interface WriteConfigOptions {
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  allowStaleRecovery?: boolean;
}
```

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  strict?: boolean;
}
```

### `OpenApiInputKind`

```typescript
type OpenApiInputKind = "content" | "file";
```

### `AnyOpenAPIDocument`

सत्यापन से लौटने वाली समर्थित OpenAPI/Swagger दस्तावेज़ संरचनाओं का यूनियन प्रकार:

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` अपेक्षाकृत लचीला संरचनात्मक प्रकार है:

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## एक्सपोर्ट सारांश

| प्रतीक | मुख्य प्रवेश | मुख्य स्तर का उपपथ | श्रेणी |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | फ़ंक्शन |
| `setContentValue` | ✓ | ✓ | फ़ंक्शन |
| `deleteContentValue` | ✓ | ✓ | फ़ंक्शन |
| `PatchContentOptions` | ✓ | ✓ | प्रकार |
| `assertNonEmptyString` | ✓ | ✓ | फ़ंक्शन |
| `assertPatchPath` | ✓ | ✓ | फ़ंक्शन |
| `assertPatchOperations` | ✓ | ✓ | फ़ंक्शन |
| `assertConfigFormat` | ✓ | ✓ | फ़ंक्शन |
| `getErrorMessage` | ✓ | ✓ | फ़ंक्शन |
| `createError` | ✓ | ✓ | फ़ंक्शन |
| `ConfigFormat` | ✓ | ✓ | प्रकार |
| `JsonPatchOp` | ✓ | ✓ | प्रकार |
| `JsonPathSegment` | ✓ | ✓ | प्रकार |
| `readConfigFile` | ✓ | — | फ़ंक्शन |
| `writeConfigFile` | ✓ | — | फ़ंक्शन |
| `WriteConfigOptions` | ✓ | — | प्रकार |
| `patchConfigFile` | ✓ | — | फ़ंक्शन |
| `setConfigValue` | ✓ | — | फ़ंक्शन |
| `deleteConfigValue` | ✓ | — | फ़ंक्शन |
| `withFileLock` | ✓ | — | फ़ंक्शन |
| `releaseAllLocalLocks` | ✓ | — | फ़ंक्शन |
| `PatchConfigOptions` | ✓ | — | प्रकार |
| `FileLockOptions` | ✓ | — | प्रकार |
| `detectFormat` | ✓ | — | फ़ंक्शन |
| `normalizeFilePath` | ✓ | — | फ़ंक्शन |
| `validateOpenAPISpec` | ✓ | — | फ़ंक्शन |
| `validateOpenAPIFile` | ✓ | — | फ़ंक्शन |
| `OpenApiValidationError` | ✓ | — | क्लास |
| `ValidateOpenApiOptions` | ✓ | — | प्रकार |
| `OpenApiInputKind` | ✓ | — | प्रकार |
| `AnyOpenAPIDocument` | ✓ | — | प्रकार |