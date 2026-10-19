---
sidebar_position: 1
title: "@powerduck/conf-patch"
description: "@powerduck/conf-patch é uma biblioteca de edição de configurações com arquitetura em duas camadas. Aplica a semântica de RFC 6902 JSON Patch a strings JSON, JSONC e YAML, preserva comentários e formatação e oferece gravações atômicas e bloqueios entre processos para Node.js e Electron."
---

# @powerduck/conf-patch

**@powerduck/conf-patch** é uma biblioteca de edição de configurações com **arquitetura em duas camadas**. Aplica a semântica de [RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) a strings JSON, JSONC e YAML, preserva comentários e formatação e oferece gravações atômicas e bloqueios entre processos para Node.js e Electron.

- **Versão:** <img src="https://img.shields.io/npm/v/@powerduck/conf-patch"/>
- **Licença:** MIT
- **Requisito do Node.js:** `>= 22.12.0`
- **Código-fonte:** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## Por que usar conf-patch?

Editar arquivos de configuração por código geralmente exige escolher entre serializar o documento inteiro, o que pode alterar comentários e formatação, ou fazer manipulações frágeis de texto. conf-patch oferece:

- **Edições incrementais que preservam comentários** em JSON/JSONC com `jsonc-parser` e alterações na AST para YAML com `yaml`. JSON/JSONC evita a serialização completa; YAML serializa novamente a AST modificada.
- **Gravações atômicas** por meio de um arquivo temporário seguido de renomeação, evitando arquivos de destino parcialmente gravados.
- **Bloqueios entre processos** com tokens de propriedade, tentativas com espera exponencial e recuperação de bloqueios obsoletos.
- **Uma API versátil:** a camada principal também funciona em navegadores, funções Edge e aplicações com armazenamento IndexedDB.

---

## Arquitetura em duas camadas

```
┌──────────────────────────────────────────────────────────────┐
│                     Application code                          │
├──────────────────────────────────────────────────────────────┤
│  File layer (Node.js / Electron only)                         │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐  │
│  │ readConfigFile │ │ writeConfigFile│ │ patchConfigFile   │  │
│  │ setConfigValue │ │ deleteConfig…  │ │ withFileLock     │  │
│  └──────┬────────┘ └───────┬────────┘ └────────┬─────────┘  │
│         │                  │                   │            │
│  ┌──────▼──────────────────▼───────────────────▼───────────┐ │
│  │           Core layer (browser-safe, zero Node deps)      │ │
│  │  patchContent   setContentValue   deleteContentValue     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Camada principal — `@powerduck/conf-patch/core` (compatível com navegadores)

Funções puras que operam sobre **strings**, sem `node:fs`, `node:path` ou APIs específicas do Node.js. Esse subcaminho pode ser incluído em código de navegador, funções Edge e service workers.

| Função | Finalidade |
|---|---|
| [`patchContent`](../api-reference/#patchcontent) | Aplicar operações RFC 6902 a uma string de configuração |
| [`setContentValue`](../api-reference/#setcontentvalue) | Definir ou criar um valor aninhado (com `add`) |
| [`deleteContentValue`](../api-reference/#deletecontentvalue) | Remover uma chave ou um elemento de array (com `remove`) |

### Camada de arquivos — `@powerduck/conf-patch` (Node.js / Electron)

Funções assíncronas de leitura e gravação de arquivos que acrescentam gravações atômicas e bloqueios à camada principal.

| Função | Finalidade |
|---|---|
| [`readConfigFile`](../api-reference/#readconfigfile) | Ler texto UTF-8 de um caminho ou de uma URL `file://` |
| [`writeConfigFile`](../api-reference/#writeconfigfile) | Gravar conteúdo de forma atômica, com bloqueio opcional |
| [`patchConfigFile`](../api-reference/#patchconfigfile) | Executar uma transação de leitura, alteração e gravação sob bloqueio |
| [`setConfigValue`](../api-reference/#setconfigvalue) | Definir um valor aninhado em um arquivo |
| [`deleteConfigValue`](../api-reference/#deleteconfigvalue) | Excluir um valor aninhado de um arquivo |
| [`withFileLock`](../api-reference/#withfilelock) | Executar uma tarefa sob bloqueio exclusivo |
| [`releaseAllLocalLocks`](../api-reference/#releasealllocallocks) | Liberar todos os bloqueios do processo atual |

---

## Formatos compatíveis

| Formato | Extensão | Comportamento |
|---|---|---|
| **JSON** | `.json` | JSON padrão. Edições incrementais com `jsonc-parser`. |
| **JSONC** | `.jsonc` | JSON com comentários e vírgulas finais. Os comentários são preservados. |
| **YAML** | `.yaml`, `.yml` | YAML 1.2. Alterações na AST preservam comentários, âncoras e indentação. |

[`detectFormat`](../api-reference/#detectformat) associa extensões a um [`ConfigFormat`](../api-reference/#configformat). Outras extensões geram um erro, a menos que `format` seja informado explicitamente.

---

## Operações RFC 6902

conf-patch implementa um subconjunto de RFC 6902. Somente estas operações são aceitas:

| `op` | Comportamento |
|---|---|
| `"add"` | Inserir em um índice de array ou adicionar/substituir uma propriedade de objeto |
| `"replace"` | Substituir um valor existente; o caminho precisa existir |
| `"remove"` | Remover uma chave ou um elemento existente; o caminho precisa existir |

:::caution
`"move"`, `"copy"` e `"test"` **não são aceitos**. O tipo [`JsonPatchOp`](../api-reference/#jsonpatchop) restringe `op` a `"add" | "replace" | "remove"`.
:::

Observações sobre o comportamento:

- `add` em um índice de array **insere** um elemento (RFC 6902). Para substituir um elemento existente, use `replace`.
- `add` exige que o caminho pai já exista. Crie os pais antes dos filhos.
- `replace` e `remove` exigem que o caminho de destino exista.
- Com `strict: true` (padrão), uma operação com falha lança uma exceção. Com `strict: false`, ela é ignorada e um aviso é registrado.

---

## Preservação de comentários e formatação

- **JSON/JSONC:** as alterações são calculadas como intervalos de texto a partir da árvore sintática, preservando comentários próximos, vírgulas finais e indentação.
- **YAML:** a AST de `yaml` é modificada e serializada novamente, preservando comentários, âncoras, aliases e indentação.

---

## Validação de OpenAPI

conf-patch valida documentos OpenAPI/Swagger por meio de uma interface protegida para `@powerduck/openapi-parser`:

- [`validateOpenAPISpec`](../api-reference/#validateopenapispec) valida conteúdo bruto JSON ou YAML.
- [`validateOpenAPIFile`](../api-reference/#validateopenapifile) valida um documento a partir do caminho do arquivo.
- O tratamento de entradas aplica limites de tamanho, restrições de caminhos (`allowedRootDirectory`), verificações de complexidade, prazos e cancelamento por `AbortSignal`.
- Falhas lançam [`OpenApiValidationError`](../api-reference/#openapivalidationerror) com um `code` que pode ser tratado pelo programa.

---

## Próximos passos

- [Instalação](../installation/) — adicionar conf-patch e conhecer os dois pontos de entrada.
- [Início rápido](../quickstart/) — modificar uma string no navegador e um arquivo em disco.
- [Referência da API](../api-reference/) — todas as exportações, tipos e opções.
- [Exemplos](../examples/) — exemplos executáveis de JSON, YAML, JSONC, validação OpenAPI e bloqueios.
