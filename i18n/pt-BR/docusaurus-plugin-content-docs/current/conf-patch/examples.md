---
sidebar_position: 5
title: "Exemplos"
description: "Exemplos práticos e executáveis baseados na API pública. Use a camada adequada: @powerduck/conf-patch/core, compatível com navegadores, para strings, ou @powerduck/conf-patch para arquivos."
---

# Exemplos

Exemplos práticos e executáveis baseados na API pública. Use a camada adequada: `@powerduck/conf-patch/core`, compatível com navegadores, para strings, ou `@powerduck/conf-patch` para arquivos.

---

## 1. Operações JSON Patch (camada principal)

Aplique várias operações RFC 6902 a uma string JSON. `add` insere em arrays ou adiciona/substitui propriedades de objetos; `replace` e `remove` exigem que o destino exista.

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

Resultado:

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

Defina `strict: false` para ignorar operações que falharem em vez de lançar exceções:

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. Definir um valor YAML aninhado (camada de arquivos)

Defina `database.port` em um arquivo YAML. O caminho pai (`database`) deve existir; a escrita é atômica e protegida por bloqueio.

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

Para criar um objeto aninhado que ainda não existe, crie primeiro o pai:

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### Operações com arrays em YAML

Use segmentos numéricos para índices de sequência. `add` **insere**, `replace` substitui na mesma posição e `remove` exclui:

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. JSONC com comentários preservados

As edições JSONC usam intervalos de texto, preservando comentários e vírgulas finais ao redor das linhas alteradas.

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

Resultado com os comentários preservados:

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. Validar um documento OpenAPI

Valide o conteúdo bruto e depois um arquivo. O modo de arquivo exige `allowedRootDirectory` para restringir os caminhos permitidos.

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

Cancelamento com `AbortSignal`:

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

## 5. Acesso concorrente seguro com bloqueio de arquivos

Quando vários processos, ou várias operações simultâneas em um processo, acessam o mesmo arquivo, `patchConfigFile` já serializa o acesso. Use `withFileLock` diretamente para agrupar várias operações em uma seção crítica.

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

Notas:

- `withFileLock` enfileira operações no **mesmo arquivo** dentro de um processo e usa um arquivo exclusivo `.confedit.lock` entre processos.
- A liberação verifica um token de propriedade antes de remover o bloqueio. Assim, uma liberação antiga nunca exclui um novo bloqueio que tenha substituído um obsoleto.
- Ao encerrar, por exemplo com Electron `will-quit`, libere os bloqueios restantes:

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

## 6. Exemplo completo: editar uma especificação OpenAPI em disco

O padrão de demonstração da biblioteca: ler a especificação, definir valores, adicionar uma resposta e validar.

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

## Próximos passos

- [Referência da API](../api-reference/) — assinaturas completas e valores padrão de todas as opções.
- [Início rápido](../quickstart/) — primeira execução de ponta a ponta.
