---
sidebar_position: 3
title: "Início rápido"
description: "Primeiros passos com @powerduck/conf-patch: altere strings JSON/YAML no núcleo compatível com navegadores e depois arquivos no Node.js ou Electron."
---

# Início rápido

Este guia percorre as duas camadas: primeiro o **núcleo**, que trabalha com strings em qualquer ambiente, e depois a **camada de arquivos**, para arquivos reais no Node.js ou Electron.

Pré-requisito: instale o pacote primeiro. [Instalação](/docs/pt-BR/conf-patch/installation/)

## 1. Núcleo — alterar uma string no navegador

Importe de `@powerduck/conf-patch/core`. O sistema de arquivos não é acessado: você recebe o novo conteúdo como string e pode salvá-lo onde preferir, como localStorage, IndexedDB ou uma constante.

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

### A mesma ideia com YAML

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
`setContentValue` usa `add`, que **adiciona ou substitui** uma propriedade do objeto. `deleteContentValue` usa `remove`. Veja [`patchContent`](/docs/pt-BR/conf-patch/api-reference/#patchcontent) para todas as operações.
:::

## 2. Camada de arquivos — alterar um arquivo em disco

Importe da entrada principal. Essas funções são `async`, leem e gravam arquivos reais e usam gravações atômicas com bloqueio.

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

O formato é detectado pela extensão (`.json`, `.jsonc`, `.yaml`, `.yml`). Informe `format` explicitamente quando a extensão for ambígua.

## 3. Tratamento de erros

As duas camadas lançam erros para entradas inválidas. No modo `strict`, ativo por padrão, uma operação de patch que falha também lança um erro.

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

Defina `strict: false` para pular as operações que falham em vez de lançar um erro:

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Exemplo de IPC no Electron

Um padrão comum é executar a camada de arquivos no processo principal do Electron e disponibilizá-la via IPC:

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

## Próximos passos

- [Referência da API](/docs/pt-BR/conf-patch/api-reference/) — Todas as funções, os tipos e as opções.
- [Exemplos](/docs/pt-BR/conf-patch/examples/) — Patches JSON, YAML, JSONC com comentários, validação OpenAPI e bloqueio de arquivos.
