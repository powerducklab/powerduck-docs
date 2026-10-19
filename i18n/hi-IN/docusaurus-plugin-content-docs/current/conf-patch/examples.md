---
sidebar_position: 5
title: "उदाहरण"
description: "सार्वजनिक API पर आधारित व्यावहारिक, चलने योग्य उदाहरण। स्ट्रिंग के लिए ब्राउज़र-सुरक्षित @powerduck/conf-patch/core और फ़ाइलों के लिए @powerduck/conf-patch इम्पोर्ट करें।"
---

# उदाहरण

सार्वजनिक API पर आधारित व्यावहारिक, चलने योग्य उदाहरण। स्ट्रिंग के लिए ब्राउज़र-सुरक्षित `@powerduck/conf-patch/core` और फ़ाइलों के लिए `@powerduck/conf-patch` इम्पोर्ट करें।

---

## 1. JSON Patch ऑपरेशन (मुख्य लेयर)

JSON स्ट्रिंग पर कई RFC 6902 ऑपरेशन लागू करें। `add` ऐरे में जोड़ता है या ऑब्जेक्ट की प्रॉपर्टी जोड़ता/बदलता है; `replace` और `remove` के लिए लक्ष्य पहले से मौजूद होना चाहिए।

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

const source = JSON.stringify(
  {
    name: "my-app",
    version: "1.0.0",
    tags: ["web"],
  },
  null,
  2,
);

const patched = patchContent(
  source,
  [
    { op: "add", path: ["description"], value: "Demos patchContent" },
    { op: "replace", path: ["version"], value: "1.1.0" },
    { op: "add", path: ["tags", 1], value: "api" }, // inserts, does not overwrite
  ],
  "json",
);

console.log(patched);
```

परिणाम:

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

असफल ऑपरेशन पर अपवाद फेंकने के बजाय उसे छोड़ने के लिए `strict: false` सेट करें:

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. नेस्टेड YAML मान सेट करना (फ़ाइल लेयर)

YAML फ़ाइल में `database.port` सेट करें। पैरेंट पाथ (`database`) मौजूद होना चाहिए। लिखना एटॉमिक है और लॉक से सुरक्षित है।

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

ऐसा नेस्टेड ऑब्जेक्ट बनाने के लिए जो अभी मौजूद नहीं है, पहले पैरेंट बनाएँ:

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### YAML में ऐरे ऑपरेशन

सीक्वेंस इंडेक्स के लिए संख्यात्मक पाथ खंड इस्तेमाल करें। `add` **बीच में जोड़ता है**, `replace` उसी स्थान पर बदलता है और `remove` हटाता है:

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. टिप्पणियाँ बनाए रखने वाला JSONC

JSONC संपादन टेक्स्ट रेंज पर आधारित होता है, इसलिए बदली गई पंक्तियों के आसपास की टिप्पणियाँ और अंतिम कॉमा सुरक्षित रहते हैं।

```typescript
import { patchContent, deleteContentValue } from "@powerduck/conf-patch/core";

const jsonc = `{
  // Application name
  "name": "my-app",
  // Legacy feature flag
  "legacyFeature": true,
  "version": "1.0.0",
}`;

// Replace a value — the surrounding comments stay put.
const updated = patchContent(
  jsonc,
  [{ op: "replace", path: ["version"], value: "1.2.0" }],
  "jsonc",
);

// Delete a key — its own line is removed, other comments remain.
const cleaned = deleteContentValue(updated, ["legacyFeature"], "jsonc");

console.log(cleaned);
```

टिप्पणियाँ सुरक्षित रखते हुए परिणाम:

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. OpenAPI दस्तावेज़ वैलिडेट करना

पहले स्पेसिफ़िकेशन की मूल सामग्री, फिर फ़ाइल वैलिडेट करें। फ़ाइल मोड में अनुमत पाथ सीमित करने के लिए `allowedRootDirectory` आवश्यक है।

```typescript
import {
  validateOpenAPISpec,
  validateOpenAPIFile,
  OpenApiValidationError,
} from "@powerduck/conf-patch";

// (a) Validate raw content (JSON or YAML)
const specContent = `openapi: 3.0.0
info:
  title: Demo API
  version: 1.0.0
paths: {}`;

try {
  const doc = await validateOpenAPISpec(specContent);
  console.log("Valid. openapi =", doc.openapi);
} catch (error) {
  if (error instanceof OpenApiValidationError) {
    console.error(`Validation failed [${error.code}]:`, error.message);
  } else {
    throw error;
  }
}

// (b) Validate from a file (requires allowedRootDirectory)
const fileDoc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
  // Optional hardening:
  // timeoutMs: 10000,
  // maxInputBytes: 2 * 1024 * 1024,
});
```

`AbortSignal` से रद्द करना:

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

await validateOpenAPISpec(specContent, { signal: controller.signal }).catch(
  (error) => {
    // Throws OpenApiValidationError with code "OPERATION_ABORTED" on abort.
    console.error(error.code);
  },
);
```

---

## 5. फ़ाइल लॉक से सुरक्षित समवर्ती एक्सेस

जब कई प्रोसेस, या एक ही प्रोसेस के कई समवर्ती ऑपरेशन, एक फ़ाइल पर काम करते हैं, तो `patchConfigFile` एक्सेस को क्रमबद्ध कर देता है। कई फ़ाइल ऑपरेशन एक क्रिटिकल सेक्शन में रखने के लिए सीधे `withFileLock` इस्तेमाल करें।

```typescript
import { readConfigFile, writeConfigFile, withFileLock } from "@powerduck/conf-patch";

async function bumpCounter(file: string): Promise<number> {
  return withFileLock(
    file,
    async () => {
      // Read-inside-lock prevents a lost read between workers.
      const raw = await readConfigFile(file);
      const data = JSON.parse(raw);
      data.count = (data.count ?? 0) + 1;
      await writeConfigFile(file, JSON.stringify(data, null, 2), { lock: false });
      return data.count;
    },
    {
      timeoutMs: 5000, // give up after 5s
      retryDelayMs: 25, // initial delay; grows by 1.5x up to 1s
      allowStaleRecovery: false,
    },
  );
}
```

ध्यान दें:

- `withFileLock` एक प्रोसेस में **उसी फ़ाइल** के ऑपरेशन कतार में रखता है और अलग-अलग प्रोसेस के बीच एक्सक्लूसिव `.confedit.lock` फ़ाइल इस्तेमाल करता है।
- लॉक हटाने से पहले उसका स्वामित्व टोकन जाँचा जाता है, इसलिए पुराने लॉक को छोड़ने की प्रक्रिया बासी लॉक की जगह बने नए लॉक को नहीं हटाती।
- बंद करते समय, जैसे Electron के `will-quit` इवेंट में, बचे हुए लॉक छोड़ें:

```typescript
import { app } from "electron";
import { releaseAllLocalLocks } from "@powerduck/conf-patch";

let locksReleased = false;
app.on("will-quit", (event) => {
  if (locksReleased) return;
  event.preventDefault();
  void releaseAllLocalLocks()
    .catch((error) => console.error("Lock cleanup failed", error))
    .finally(() => {
      locksReleased = true;
      app.quit();
    });
});
```

---

## 6. पूरा उदाहरण: डिस्क पर OpenAPI स्पेसिफ़िकेशन संपादित करना

लाइब्रेरी का अपना उदाहरण क्रम: स्पेसिफ़िकेशन पढ़ें, मान सेट करें, रिस्पॉन्स जोड़ें और वैलिडेट करें।

```typescript
import {
  readConfigFile,
  setConfigValue,
  patchConfigFile,
  validateOpenAPIFile,
} from "@powerduck/conf-patch";

const specPath = "./openapi.yaml";

// Read the raw text.
await readConfigFile(specPath);

// Set info.version and the first server URL.
await setConfigValue(specPath, ["info", "version"], "1.1.0");
await setConfigValue(specPath, ["servers", 0, "url"], "https://api.prod.example.com/v1");

// Add a 404 response to GET /pets.
await patchConfigFile(specPath, [
  {
    op: "add",
    path: ["paths", "/pets", "get", "responses", "404"],
    value: { description: "Resource not found" },
  },
]);

// Confirm the edited document still validates.
await validateOpenAPIFile(specPath, { allowedRootDirectory: "." });
```

---

## अगले चरण

- [API संदर्भ](../api-reference/) — पूरे सिग्नेचर और हर विकल्प का डिफ़ॉल्ट मान।
- [त्वरित शुरुआत](../quickstart/) — पहली शुरुआत से अंत तक की प्रक्रिया।
