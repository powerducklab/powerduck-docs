---
sidebar_position: 2
title: "Instalação"
description: "Instale @powerduck/openapi-mcp-server com npm, yarn ou pnpm, ou globalmente. Inclui a CLI openapi-mcp e o subcaminho ./server; requer Node.js 22.12.0 ou superior."
---

# Instalação

## Requisitos

- **Node.js `>=22.12.0`** (declarado em `engines`).

## Instalação

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

O pacote registra o executável `openapi-mcp`.

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

A CLI tem um único comando, `serve` (consulte [Início rápido](/docs/pt-BR/openapi-mcp-server/quickstart/)).

## ESM / CommonJS

Os dois formatos de build incluem declarações de tipos. Não são necessários pacotes `@types/*` adicionais:

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## Exportação de subcaminho

| Importação | Conteúdo |
| --- | --- |
| `@powerduck/openapi-mcp-server` | Biblioteca principal: carregamento de especificações, geração de ferramentas, prompts e recursos, execução de requisições, construção do servidor MCP e transportes stdio e HTTP. |
| `@powerduck/openapi-mcp-server/server` | Servidor HTTP de administração e middleware de autenticação (`startAdminServer`, `createAuthMiddleware`). |

## Dependências de execução

Estas dependências são instaladas automaticamente com o pacote:

- `@modelcontextprotocol/sdk` — implementação do protocolo MCP.
- `@powerduck/openapi-parser` — validação, resolução de referências e atualização de OpenAPI.
- `express` e `cors` — servidor HTTP de administração e CORS.
- `axios` — cliente HTTP para executar ferramentas contra o servidor de destino.
- `commander` — framework da CLI.
- `js-yaml` — análise de YAML.
- `multer` — processamento do upload de especificações.
- `terser` — minificação dos recursos da interface web integrada.

## Verificação

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## Próximos passos

- [Início rápido](/docs/pt-BR/openapi-mcp-server/quickstart/)
- [Configuração](/docs/pt-BR/openapi-mcp-server/configuration/)
