---
sidebar_position: 3
title: "Início rápido"
description: "Gere seu primeiro exemplo de requisição executável com @powerduck/openapi-codegen e consulte os geradores disponíveis."
---

# Início rápido

Este guia mostra como gerar um exemplo de requisição executável e descobrir os geradores disponíveis.

## 1. Instalação

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. Gerar a partir de um documento

Passe um documento OpenAPI **já analisado**, além de `path`, `method`, `language` e `client`. `generate()` retorna o código-fonte como uma string.

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

Equivalente em CommonJS:

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

## 3. Listar os geradores disponíveis

`list()` retorna o descritor de cada gerador registrado:

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

Cada descritor tem o formato `{ language: string; client: string }`. Os identificadores diferenciam maiúsculas de minúsculas; use exatamente os valores da lista de geradores na referência da API. [Referência da API](/docs/pt-BR/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

Você também pode selecionar um gerador por código:

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

## 4. Fornecer credenciais

Use `securityValues` para preencher os esquemas de segurança nomeados. As chaves devem corresponder aos nomes dos esquemas no documento:

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

## 5. Substituir a URL do servidor

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

## Tratamento de erros

`generate()` lança uma exceção quando faltam entradas ou o gerador não é compatível. Capture as exceções ao processar documentos não confiáveis:

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

## Próximos passos

- [Configuração](/docs/pt-BR/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Exemplos](/docs/pt-BR/openapi-codegen/examples/) — JavaScript fetch, Python requests, cURL, gerador personalizado, plugin e uso direto de `RequestIR`.
- [Referência da API](/docs/pt-BR/openapi-codegen/api-reference/) — Todas as exportações.
