---
sidebar_position: 1
title: "Introdução"
description: "Componente de árvore extensível para navegação de APIs, exploração de esquemas e documentação. Baseado em um núcleo genérico com adaptadores para OpenAPI, JSON Schema e fontes de dados personalizadas."
keywords: ["tree", "powerduck", "React", "OpenAPI", "JSON Schema"]
---

# @powerduck/tree

Componente de árvore extensível para navegação de APIs, exploração de esquemas e documentação. Baseado em um núcleo genérico com adaptadores para OpenAPI, JSON Schema e fontes de dados personalizadas.

- **Nome do pacote:** `@powerduck/tree`
- **Versão:** <img src="https://img.shields.io/npm/v/@powerduck/tree"/>
- **Licença:** MIT

## Recursos

- **Núcleo genérico** — `TreeNode<TMetadata>` funciona com qualquer fonte de dados
- **Adaptador OpenAPI** — Navegação por tags com tags aninhadas do OAS 3.2, `x-tagGroups`, `x-order`, `x-displayName` e `x-internal`
- **Adaptador JSON Schema** — Expansão profunda de propriedades aninhadas, arrays e combinadores com metadados `jsonPath`
- **Adaptador de documentação** — Árvore de documentação no estilo Stripe com indicadores da quantidade de operações
- **Componente React** — Busca, expansão e recolhimento, navegação por teclado, indicadores de métodos e props de renderização personalizada
- **Arrastar e soltar** — Reordenação dentro do mesmo pai e movimentação para pastas de outros níveis
- **Menu de contexto** — Ações por nó com clique direito ou botão de mais opções
- **Localização imperativa** — `locateNode(predicate)` encontra um nó, expande seus ancestrais, seleciona-o e o leva à área visível
- **Integração com JSON Patch** — O callback `onPatch` emite operações RFC 6902
- **Temas por variáveis CSS** — Compatível com `tokens.css` do Powerduck e modos claro e escuro

## Próximos passos

- [Instalação](/docs/pt-BR/tree/installation/)
- [Início rápido](/docs/pt-BR/tree/quickstart/)
- [Referência da API](/docs/pt-BR/tree/api-reference/)
- [Exemplos](/docs/pt-BR/tree/examples/)
