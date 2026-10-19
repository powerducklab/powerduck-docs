---
sidebar_position: 1
title: "Introdução"
description: "Inicialize arquivos workspace.yaml e YAML do OpenAPI 3.2 com segurança. Compatível com o navegador: funções puras geram strings de conteúdo YAML, sem acesso ao sistema de arquivos. No Node.js / Electron, adiciona gravações atômicas, bloqueio de arquivos e normalização de caminhos à camada principal."
keywords: ["workspace-yaml", "powerduck", "YAML", "OpenAPI"]
---

# @powerduck/workspace-yaml

Inicialize arquivos workspace.yaml e YAML do OpenAPI 3.2 com segurança.

Arquitetura de duas camadas:
- **Camada principal**: Compatível com o navegador: funções puras geram strings de conteúdo YAML, sem acesso ao sistema de arquivos.
- **Camada de arquivos**: No Node.js / Electron, adiciona gravações atômicas, bloqueio de arquivos e normalização de caminhos à camada principal.

- **Nome do pacote:** `@powerduck/workspace-yaml`
- **Versão:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **Licença:** MIT

Esta biblioteca **apenas inicializa arquivos**, para criar arquivos novos ou realizar a criação manual. Ela **não** reimplementa a leitura, a aplicação de patches ou a atualização de arquivos YAML. Para essas operações, use [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## Próximos passos

- [Instalação](/docs/pt-BR/workspace-yaml/installation/)
- [Início rápido](/docs/pt-BR/workspace-yaml/quickstart/)
- [Referência da API](/docs/pt-BR/workspace-yaml/api-reference/)
- [Exemplos](/docs/pt-BR/workspace-yaml/examples/)
