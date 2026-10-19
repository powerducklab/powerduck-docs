---
sidebar_position: 3
title: "तुरंत शुरुआत"
description: "@powerduck/conf-patch से शुरुआत करें: ब्राउज़र-संगत कोर में JSON/YAML स्ट्रिंग बदलें, फिर Node.js या Electron में फ़ाइल संपादित करें।"
---

# तुरंत शुरुआत

यह गाइड दोनों परतें क्रम से समझाती है: पहले हर वातावरण में स्ट्रिंग पर काम करने वाली **कोर परत**, फिर Node.js या Electron में असली फ़ाइलों पर काम करने वाली **फ़ाइल परत**।

ज़रूरी शर्त: पहले पैकेज इंस्टॉल करें। [इंस्टॉल करें](/docs/hi-IN/conf-patch/installation/)

## 1. कोर परत — ब्राउज़र में स्ट्रिंग बदलें

`@powerduck/conf-patch/core` से इम्पोर्ट करें। फ़ाइल सिस्टम इस्तेमाल नहीं होता; नई सामग्री स्ट्रिंग के रूप में मिलती है। उसे localStorage, IndexedDB, स्ट्रिंग कॉन्स्टेंट या अपनी पसंद की जगह रखें।

```typescript
import {
  patchContent,
  setContentValue,
  deleteContentValue,
} from "@powerduck/conf-patch/core";

// --- JSON: apply multiple RFC 6902 operations ---
const json = JSON.stringify({ name: "my-app", version: "1.0.0" }, null, 2);

const updatedJson = patchContent(
  json,
  [
    { op: "add", path: ["description"], value: "My awesome application" },
    { op: "replace", path: ["version"], value: "1.1.0" },
  ],
  "json",
);

console.log(updatedJson);
// {
//   "name": "my-app",
//   "version": "1.1.0",
//   "description": "My awesome application"
// }

// Store it however you like — no fs required.
localStorage.setItem("config", updatedJson);
```

### YAML के साथ भी यही तरीका

```typescript
import { setContentValue, deleteContentValue } from "@powerduck/conf-patch/core";

// Set a nested value in YAML (the "server" parent already exists).
const yaml = "name: my-app\nserver:\n  host: localhost\n";

const updatedYaml = setContentValue(yaml, ["server", "port"], 8080, "yaml");
console.log(updatedYaml);
// name: my-app
// server:
//   host: localhost
//   port: 8080

// Delete a value.
const cleaned = deleteContentValue(updatedYaml, ["server", "host"], "yaml");
```

:::note
`setContentValue` में `add` ऑपरेशन इस्तेमाल होता है, जो ऑब्जेक्ट प्रॉपर्टी **जोड़ता या बदलता** है। `deleteContentValue` में `remove` इस्तेमाल होता है। सभी ऑपरेशन के लिए [`patchContent`](/docs/hi-IN/conf-patch/api-reference/#patchcontent) देखें।
:::

## 2. फ़ाइल परत — डिस्क की फ़ाइल बदलें

मुख्य एंट्री से इम्पोर्ट करें। ये `async` फ़ंक्शन असली फ़ाइलें पढ़ते और लिखते हैं तथा लॉक के साथ एटॉमिक राइट करते हैं।

```typescript
import { setConfigValue, readConfigFile, patchConfigFile } from "@powerduck/conf-patch";

// Set a nested value in a YAML file (atomic, lock-guarded).
await setConfigValue("config.yaml", ["database", "port"], 5432);

// Read the file back.
const content = await readConfigFile("config.yaml");
console.log(content);

// Apply several operations to a JSON file in one locked transaction.
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

फ़ॉर्मैट एक्सटेंशन (`.json`, `.jsonc`, `.yaml`, `.yml`) से अपने-आप पहचाना जाता है। एक्सटेंशन अस्पष्ट हो तो `format` साफ़ तौर पर दें।

## 3. त्रुटि प्रबंधन

अमान्य इनपुट पर दोनों परतें त्रुटि देती हैं। डिफ़ॉल्ट `strict` मोड में पैच ऑपरेशन विफल होने पर भी त्रुटि मिलती है।

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

try {
  // "remove" requires the path to exist.
  patchContent('{"name": "app"}', [{ op: "remove", path: ["missing"] }], "json");
} catch (error) {
  // Error: [confedit] Cannot remove a value that does not exist at path: ["missing"]
  console.error(error instanceof Error ? error.message : error);
}
```

त्रुटि देने के बजाय विफल ऑपरेशन छोड़ने के लिए `strict: false` सेट करें:

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Electron IPC का उदाहरण

एक सामान्य तरीका है कि फ़ाइल परत Electron की मुख्य प्रक्रिया में चले और IPC के ज़रिए उपलब्ध हो:

```javascript
// Electron main process (CommonJS)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

ipcMain.handle("config:set", async (_event, { filePath, path, value }) => {
  try {
    await setConfigValue(filePath, path, value);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("config:read", async (_event, { filePath }) => {
  try {
    const data = await readConfigFile(filePath);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

## अगले कदम

- [API संदर्भ](/docs/hi-IN/conf-patch/api-reference/) — सभी फ़ंक्शन, टाइप और विकल्प।
- [उदाहरण](/docs/hi-IN/conf-patch/examples/) — JSON पैच, YAML, टिप्पणियों वाला JSONC, OpenAPI सत्यापन और फ़ाइल लॉकिंग।
