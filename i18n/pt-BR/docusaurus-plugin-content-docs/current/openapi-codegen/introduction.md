---
sidebar_position: 1
title: "Introdução"
description: "Gere exemplos HTTP executáveis a partir de OpenAPI com @powerduck/openapi-codegen: 21 linguagens, 41 clientes, compatível com navegadores e sem dependências de execução."
---

# Introdução

`@powerduck/openapi-codegen` é uma biblioteca TypeScript que transforma uma operação OpenAPI em **código de exemplo HTTP executável**, na linguagem e com o cliente HTTP escolhidos. Foi projetada para sites de documentação de APIs, portais de desenvolvedores, exploradores de API, ferramentas CLI e geração de código durante o build.

Ela oferece **21 linguagens** e **41 combinações de linguagem e cliente**, é **compatível com navegadores** e não tem **dependências de execução**.

## Por que usar openapi-codegen

- **Sem dependências de execução** — funciona no navegador, Node.js, Electron e ambientes edge sem módulos nativos do Node.
- **Dois formatos de módulos** — builds ESM nativo e CommonJS (`require()`).
- **OpenAPI 3.0 / 3.1 / 3.2** — processa objetos de documento já analisados. JSON e YAML são aceitos se forem analisados antes da chamada a `generate()`.
- **41 geradores integrados** em 21 linguagens, registrados automaticamente na importação.
- **Serialização completa de parâmetros** — caminho, query, header e cookie conforme as regras OpenAPI `style` / `explode` / `allowReserved`.
- **Esquemas de segurança** — chave API em header, query ou cookie, HTTP bearer e HTTP basic.
- **Tipos de corpo** — JSON, texto simples, formulário codificado em URL e `multipart/form-data`.
- **Resolução de `$ref`** — referências JSON Pointer internas ao documento, com cache, encadeamento e detecção de ciclos.
- **Exemplos automáticos** — infere valores a partir de JSON Schema (`example`, `enum`, `default`, tipos, formatos e restrições).
- **Plugins** — registre geradores personalizados com `register()` ou `use()`.

## Como funciona

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize` resolve `$ref`s, combina parâmetros do caminho e da operação, escolhe o tipo de mídia do corpo, gera valores de exemplo, resolve esquemas de segurança e produz um `RequestIR` normalizado.
2. O `Generator` escolhido recebe o `RequestIR` e retorna uma string de código-fonte executável.

Em geral, basta chamar `generate({...})`, que realiza as duas etapas.

## Exemplo básico

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## Próximos passos

- [Instalação](/docs/pt-BR/openapi-codegen/installation/) — npm / yarn / pnpm e uso no navegador.
- [Início rápido](/docs/pt-BR/openapi-codegen/quickstart/) — Gere seu primeiro trecho e liste os geradores.
- [Configuração](/docs/pt-BR/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Referência da API](/docs/pt-BR/openapi-codegen/api-reference/) — Todas as exportações e a lista completa de linguagens e clientes.
- [Exemplos](/docs/pt-BR/openapi-codegen/examples/) — fetch, Python requests, cURL, geradores personalizados, plugins e `RequestIR` direto.
