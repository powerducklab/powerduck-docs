---
sidebar_position: 5
title: "Örnekler"
description: "Genel API ile hazırlanmış, çalıştırılabilir uygulama örnekleri. Dize işlemleri için tarayıcıda güvenli @powerduck/conf-patch/core, dosyalar için @powerduck/conf-patch katmanını içe aktarın."
---

# Örnekler

Genel API ile hazırlanmış, çalıştırılabilir uygulama örnekleri. Dize işlemleri için tarayıcıda güvenli `@powerduck/conf-patch/core`, dosyalar için `@powerduck/conf-patch` katmanını içe aktarın.

---

## 1. JSON Patch işlemleri (çekirdek katman)

Bir JSON dizesine birden fazla RFC 6902 işlemi uygulayın. `add` diziye öğe ekler veya nesne özelliği ekler/değiştirir; `replace` ve `remove` için hedef mevcut olmalıdır.

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

Sonuç:

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

Başarısız işlemlerde istisna fırlatmak yerine atlamak için `strict: false` ayarlayın:

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. İç içe YAML değeri ayarlama (dosya katmanı)

YAML dosyasında `database.port` değerini ayarlayın. Üst yol (`database`) mevcut olmalıdır; yazma atomiktir ve kilitle korunur.

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

Henüz bulunmayan iç içe bir nesne oluşturmak için önce üst nesneyi oluşturun:

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### YAML dizi işlemleri

Sıra indeksleri için sayısal yol parçaları kullanın. `add` **araya ekler**, `replace` yerinde değiştirir, `remove` siler:

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. Yorumları korunan JSONC

JSONC düzenlemeleri metin aralıkları üzerinde yapılır; değiştirilen satırların çevresindeki yorumlar ve sondaki virgüller korunur.

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

Yorumların korunduğu sonuç:

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. OpenAPI belgesi doğrulama

Önce ham belirtim içeriğini, sonra dosyayı doğrulayın. Dosya modu, izin verilen yolları sınırlamak için `allowedRootDirectory` gerektirir.

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

`AbortSignal` ile iptal:

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

## 5. Dosya kilidiyle güvenli eşzamanlı erişim

Birden fazla süreç veya tek süreçte birden fazla eşzamanlı işlem aynı dosyaya eriştiğinde `patchConfigFile` erişimi zaten sıraya koyar. Birkaç dosya işlemini tek bir kritik bölümde toplamak için `withFileLock` kullanın.

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

Notlar:

- `withFileLock`, aynı süreçte **aynı dosyaya** yönelik işlemleri kuyruğa alır; süreçler arasında özel erişimli `.confedit.lock` dosyasını kullanır.
- Kilit silinmeden önce sahiplik belirteci doğrulanır; böylece eski bir bırakma işlemi, süresi dolmuş kilidin yerine geçen yeni kilidi silemez.
- Kapanışta, örneğin Electron `will-quit` olayında, kalan kilitleri serbest bırakın:

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

## 6. Tam örnek: diskteki OpenAPI belirtimini düzenleme

Kitaplığın örnek akışı: belirtimi okuyun, değerleri ayarlayın, yanıt ekleyin ve doğrulayın.

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

## Sonraki adımlar

- [API başvurusu](../api-reference/) — tüm imzalar ve seçeneklerin varsayılan değerleri.
- [Hızlı başlangıç](../quickstart/) — ilk uçtan uca çalıştırma.
