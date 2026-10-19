---
sidebar_position: 2
title: "Instalação"
description: "Instale @powerduck/x-to-openapi com npm, yarn ou pnpm. ESM com compatibilidade CommonJS e funções curlToOpenApi e postmanToOpenApi sem configuração."
---

# Instalação

Instale `@powerduck/x-to-openapi` com seu gerenciador de pacotes preferido.

## Requisitos

- **Node.js:** `>= 22.12.0`
- **TypeScript:** opcional; o pacote inclui todas as definições de tipos.

## Instalação

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## Dependências de execução

| Pacote | Versão | Uso |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Tipos canônicos de OpenAPI e validação da saída |
| `curlconverter` | `^4.12.0` | Análise de comandos curl como requisições estruturadas |

As duas dependências são instaladas automaticamente.

---

## Sistema de módulos: ESM com compatibilidade CJS

O pacote declara `"type": "module"` e fornece ambos os builds por um único ponto de entrada:

| Build | Condição | Arquivo |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| Tipos | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

O pacote declara `"sideEffects": false`, permitindo que tree shaking remova adaptadores não utilizados.

---

## Funções sem configuração

A maioria dos usuários precisa de apenas duas funções. Elas criam uma instância de [`XToOpenApi`](/docs/pt-BR/x-to-openapi/api-reference/#xtoopenapi), registram o adaptador correspondente e chamam `convert`:

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

Use a classe [`XToOpenApi`](/docs/pt-BR/x-to-openapi/api-reference/#xtoopenapi) completa para opções personalizadas, vários adaptadores, detecção `"auto"` ou um adaptador próprio.

---

## Verificação

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## Próximos passos

- [Início rápido](/docs/pt-BR/x-to-openapi/quickstart/) — converta um comando curl e uma coleção Postman, e registre um adaptador personalizado.
- [Referência da API](/docs/pt-BR/x-to-openapi/api-reference/) — todas as exportações e opções.
