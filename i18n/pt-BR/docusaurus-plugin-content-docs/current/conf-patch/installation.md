---
sidebar_position: 2
title: "Instalação"
description: "Instale @powerduck/conf-patch e escolha entre a entrada de arquivos para Node.js e o subcaminho ./core compatível com navegadores."
---

# Instalação

Instale `@powerduck/conf-patch` com seu gerenciador de pacotes preferido.

## Requisitos

- **Node.js:** `>= 22.12.0`
- **TypeScript:** opcional; o pacote inclui todas as declarações de tipos, sem precisar de `@types/...`.

## Instalação

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## Dependências de execução

conf-patch inclui três dependências de execução instaladas automaticamente:

| Pacote | Versão | Uso |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Validação OpenAPI/Swagger (`validateOpenAPISpec`, `validateOpenAPIFile`). |
| `jsonc-parser` | `^3.3.1` | Edições incrementais de texto para JSON e JSONC. |
| `yaml` | `^2.9.0` | Análise e alteração da AST de YAML. |

Você não precisa usar essas dependências diretamente.

## Dois pontos de entrada

O pacote oferece **duas exportações de subcaminhos**. Escolha de acordo com seu ambiente.

### Entrada principal — `@powerduck/conf-patch`

Inclui a **camada de arquivos** (`readConfigFile`, `writeConfigFile`, `patchConfigFile`, `setConfigValue`, `deleteConfigValue`, `withFileLock`, `releaseAllLocalLocks`), o núcleo e a validação OpenAPI. Use no Node.js e Electron. Depende de `node:fs`, `node:path` e `node:crypto`.

### Subcaminho do núcleo — `@powerduck/conf-patch/core`

Exporta **somente o núcleo compatível com navegadores**: `patchContent`, `setContentValue`, `deleteContentValue`, utilitários de asserção e tipos do núcleo. Não tem dependências Node.js e pode ser empacotado para navegadores, Edge Functions e service workers.

:::tip
Para o navegador, sempre importe de `@powerduck/conf-patch/core`. Assim, a camada de arquivos e sua dependência `node:fs` ficam fora do bundle.
:::

## Sistema de módulos: CJS e ESM

O pacote **não** define `"type": "module"`; portanto, arquivos `.js` são CommonJS por padrão. O mapa `exports` em `package.json` direciona explicitamente `import` e `require` ao build correto.

| Entrada | CJS (`require`) | ESM (`import`) | Tipos |
|---|---|---|---|
| Entrada principal | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| Subcaminho do núcleo | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS (Node.js ou processo principal do Electron)

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules (Node.js moderno, navegadores e empacotadores)

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## Verificar a instalação

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## Próximos passos

- [Início rápido](/docs/pt-BR/conf-patch/quickstart/) — altere uma string no navegador e um arquivo no disco.
- [Referência da API](/docs/pt-BR/conf-patch/api-reference/) — todas as exportações, tipos e opções.
