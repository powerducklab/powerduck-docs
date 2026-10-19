---
sidebar_position: 3
title: "Guida rapida"
description: "Genera il tuo primo esempio di richiesta eseguibile con @powerduck/openapi-codegen ed esplora i generatori disponibili."
---

# Guida rapida

Questa guida spiega come generare un esempio di richiesta eseguibile e trovare i generatori disponibili.

## 1. Installazione

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. Generare da un documento

Passa un documento OpenAPI **già analizzato** insieme a `path`, `method`, `language` e `client`. `generate()` restituisce il codice sorgente come stringa.

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

Esempio equivalente in CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. Elencare i generatori disponibili

`list()` restituisce il descrittore di ogni generatore registrato:

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

Ogni descrittore ha la forma `{ language: string; client: string }`. Gli identificatori distinguono maiuscole e minuscole: usa esattamente quelli riportati nell’elenco dei generatori del riferimento API. [Riferimento API](/docs/it-IT/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

Puoi anche scegliere un generatore tramite codice:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. Fornire le credenziali

Usa `securityValues` per valorizzare gli schemi di sicurezza con nome. Le chiavi devono corrispondere ai nomi degli schemi nel documento:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. Sovrascrivere l’URL del server

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## Gestione degli errori

`generate()` genera un’eccezione se mancano dati in ingresso o se il generatore non è supportato. Gestisci le eccezioni quando elabori documenti non attendibili:

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## Passaggi successivi

- [Configurazione](/docs/it-IT/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Esempi](/docs/it-IT/openapi-codegen/examples/) — JavaScript fetch, Python requests, cURL, generatore personalizzato, plugin e uso diretto di `RequestIR`.
- [Riferimento API](/docs/it-IT/openapi-codegen/api-reference/) — Tutte le esportazioni.
