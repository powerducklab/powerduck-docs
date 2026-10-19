---
sidebar_position: 2
title: "Instalação"
description: "Instale @powerduck/openapi-codegen com npm, yarn ou pnpm e use no Node.js ou no navegador. Requer Node.js 22.12.0 ou superior."
---

# Instalação

## Requisitos

- **Node.js**: `>= 22.12.0` (declarado no campo `engines` do pacote), para uso no Node.js.
- Um documento OpenAPI **já analisado**, como objeto JavaScript, não uma string JSON/YAML bruta.
- Um navegador moderno com a API Fetch para uso no navegador.

O pacote inclui builds ESM (`dist/index.js`) e CommonJS (`dist/index.cjs`), com declarações TypeScript. Não possui **dependências de execução**.

## npm

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## pnpm

```bash npm2yarn2pnpm
pnpm add @powerduck/openapi-codegen
```

## Yarn

```bash npm2yarn2pnpm
yarn add @powerduck/openapi-codegen
```

## Uso no Node.js

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

Os geradores integrados são **registrados automaticamente na importação do módulo**, portanto `generate` funciona imediatamente, sem configuração adicional.

## Uso no navegador

A biblioteca é totalmente compatível com navegadores e não usa módulos internos do Node.js. Carregue-a por uma CDN ESM e faça a chamada diretamente:

```html
<script type="module">
  import { generate, list } from "https://esm.sh/@powerduck/openapi-codegen";

  const document = {
    openapi: "3.1.0",
    info: { title: "Example API", version: "1.0.0" },
    servers: [{ url: "https://api.example.com" }],
    paths: {
      "/hello": { get: { responses: { "200": { description: "OK" } } } },
    },
  };

  const code = generate({
    document,
    path: "/hello",
    method: "get",
    language: "javascript",
    client: "fetch",
  });

  console.log(code);
</script>
```

Vite, esbuild e webpack também funcionam sem configuração adicional; o build ESM permite remover código não utilizado com tree shaking.

## Fornecer o documento

Passe um objeto já analisado. Para JSON:

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

Para YAML, primeiro analise o conteúdo com um pacote YAML separado:

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## Estrutura do pacote

| Entrada | Caminho |
|-------|------|
| Entrada ESM | `dist/index.js` |
| Entrada CommonJS | `dist/index.cjs` |
| Definições de tipos | `dist/index.d.ts` |

Não há executável CLI; a biblioteca é usada apenas por código.

## Próximos passos

- [Início rápido](/docs/pt-BR/openapi-codegen/quickstart/) — gere seu primeiro trecho de código.
- [Configuração](/docs/pt-BR/openapi-codegen/configuration/) — todas as opções de geração.
