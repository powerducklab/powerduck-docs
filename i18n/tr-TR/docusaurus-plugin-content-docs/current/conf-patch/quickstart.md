---
sidebar_position: 3
title: "Hızlı başlangıç"
description: "@powerduck/conf-patch ile başlayın: tarayıcı uyumlu çekirdekte JSON/YAML dizelerini, ardından Node.js veya Electron'da dosyaları düzenleyin."
---

# Hızlı başlangıç

Bu kılavuz iki katmanı sırayla ele alır: önce her ortamda yalnızca dizelerle çalışan **çekirdek**, ardından Node.js veya Electron'da gerçek dosyalarla çalışan **dosya katmanı**.

Ön koşul: önce paketi kurun. [Kurulum](/docs/tr-TR/conf-patch/installation/)

## 1. Çekirdek — tarayıcıda dize düzenleme

`@powerduck/conf-patch/core` üzerinden içe aktarın. Dosya sistemine erişilmez; yeni içerik dize olarak döner. Bunu localStorage, IndexedDB, dize sabiti veya istediğiniz başka bir yerde saklayabilirsiniz.

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

### YAML için aynı yaklaşım

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
`setContentValue`, nesne özelliğini **ekleyen veya değiştiren** `add` işlemini kullanır. `deleteContentValue` ise `remove` kullanır. Tüm işlemler için [`patchContent`](/docs/tr-TR/conf-patch/api-reference/#patchcontent) bölümüne bakın.
:::

## 2. Dosya katmanı — diskteki dosyayı düzenleme

Ana giriş noktasından içe aktarın. Bu işlevler `async` yapıdadır, gerçek dosyaları okur ve yazar; kilitlemeli atomik yazma kullanır.

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

Biçim, uzantıdan otomatik algılanır (`.json`, `.jsonc`, `.yaml`, `.yml`). Uzantı belirsizse `format` değerini açıkça iletin.

## 3. Hata yönetimi

Her iki katman da geçersiz girdide hata fırlatır. Varsayılan `strict` modunda, başarısız bir yama işlemi de hata fırlatır.

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

Hata fırlatmak yerine başarısız işlemleri atlamak için `strict: false` ayarlayın:

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Electron IPC örneği

Yaygın bir yaklaşım, dosya katmanını Electron ana sürecinde çalıştırıp IPC üzerinden erişime açmaktır:

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

## Sonraki adımlar

- [API başvurusu](/docs/tr-TR/conf-patch/api-reference/) — Tüm işlevler, türler ve seçenekler.
- [Örnekler](/docs/tr-TR/conf-patch/examples/) — JSON yamaları, YAML, yorumlu JSONC, OpenAPI doğrulaması ve dosya kilitleme.
