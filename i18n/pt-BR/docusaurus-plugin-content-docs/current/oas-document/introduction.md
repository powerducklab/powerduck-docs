---
sidebar_position: 1
title: "Introdução"
description: "Componente de documentação OpenAPI para React pronto para produção. Passe um documento OAS para obter uma interface completa no estilo Stripe, com navegação no cabeçalho, temas claro e escuro, árvore de navegação, acompanhamento da rolagem, exploração de esquemas e exemplos de código em várias linguagens."
keywords: ["oas-document", "powerduck", "React", "OpenAPI"]
---

# @powerduck/oas-document

Componente de documentação OpenAPI para React pronto para produção. Passe um documento OAS para obter uma interface completa no estilo Stripe, com navegação no cabeçalho, temas claro e escuro, árvore de navegação, acompanhamento da rolagem, exploração de esquemas e exemplos de código em várias linguagens.

- **Nome do pacote:** `@powerduck/oas-document`
- **Versão:** <img src="https://img.shields.io/npm/v/@powerduck/oas-document"/>
- **Licença:** MIT

Bibliotecas utilizadas: `@powerduck/openapi-parser` (validação e conversão automática), `@powerduck/tree` (navegação), `@powerduck/md-editor` (renderização de Markdown), `@powerduck/openapi-codegen` (geração de código de requisições).

## Recursos

- **Documentação de API pronta para integrar** — Aceita um objeto interpretado, uma string JSON ou uma string YAML
- **Layout no estilo Stripe** — Cabeçalho configurável, árvore lateral e visualização de operações em duas colunas
- **Temas claro e escuro** — Alternância no cabeçalho, com a escolha salva no localStorage
- **Conversão automática para OAS 3.2** — Valida e converte com `@powerduck/openapi-parser`
- **Navegação sincronizada com a rolagem** — Listener de rolagem passivo com busca binária
- **renderização de Markdown** — Descrições renderizadas com `@powerduck/md-editor`
- **Exemplos de código em várias linguagens** — Gerados com `@powerduck/openapi-codegen`
- **Exploração de esquemas** — Tabelas de propriedades aninhadas que podem ser expandidas e recolhidas
- **Layout responsivo** — Em dispositivos móveis, a barra lateral vira um painel sobreposto

## Próximos passos

- [Instalação](/docs/pt-BR/oas-document/installation/)
- [Início rápido](/docs/pt-BR/oas-document/quickstart/)
- [Referência da API](/docs/pt-BR/oas-document/api-reference/)
- [Exemplos](/docs/pt-BR/oas-document/examples/)
