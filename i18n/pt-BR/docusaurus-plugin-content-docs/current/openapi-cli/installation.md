---
sidebar_position: 2
title: "Instalação"
description: "Instale @powerduck/openapi-cli globalmente, como dependência de desenvolvimento ou com npx. Requer Node.js 22.12.0 ou superior."
---

# Instalação

## Requisitos

- **Node.js**: `>= 22.12.0` (declarado no campo `engines` do pacote).
- Um gerenciador de pacotes: npm, yarn ou pnpm.

O pacote inclui versões ESM (`dist/index.js`) e CommonJS (`dist/index.cjs`), com declarações TypeScript (`dist/index.d.ts`). Não são necessários pacotes `@types` adicionais.

## Instalação global (recomendada para a CLI)

A instalação global disponibiliza o executável `openapi-cli` no seu `PATH`:

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

Verifique o executável:

```bash
openapi-cli --help
```

## Instalação no projeto (recomendada para CI)

Fixe a versão no projeto para que a CI use uma versão conhecida:

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

Depois, invoque o executável pelo gerenciador de pacotes:

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## Execução avulsa com npx

Sem instalação prévia:

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## Estrutura do pacote

| Entrada | Caminho |
|-------|------|
| Entrada ESM | `dist/index.js` |
| Entrada CommonJS | `dist/index.cjs` |
| Definições de tipos | `dist/index.d.ts` |
| Entrada CLI (bin) | `dist/cli.js` |
| Nome do executável | `openapi-cli` |

O pacote declara `"type": "module"` e expõe apenas os subcaminhos `.` e `./package.json`.

## Importação programática

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## Dependências de execução

O pacote publicado depende de:

- `@powerduck/openapi-parser` (`^0.3.12`) — resolução de referências `$ref` internas.
- `@powerduck/openapi-request` (`0.2.22`) — execução de requisições de protocolo.
- `commander` (`^12.1.0`) — análise de argumentos da CLI.
- `https-proxy-agent` (`^5.0.1`) — suporte a proxy no transporte HTTP.

## Próximos passos

- [Início rápido](/docs/pt-BR/openapi-cli/quickstart/) — execute sua primeira suíte de testes.
- [Comandos](/docs/pt-BR/openapi-cli/commands/) — referência completa das opções.
