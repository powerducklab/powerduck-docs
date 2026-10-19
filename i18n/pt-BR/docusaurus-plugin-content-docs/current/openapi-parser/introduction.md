---
sidebar_position: 1
title: "Introdução"
description: "Converta qualquer documento Swagger 2.0, OpenAPI 3.0, 3.1 ou 3.2 para OpenAPI 3.2 com uma única chamada."
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

Converta qualquer documento Swagger 2.0, OpenAPI 3.0, 3.1 ou 3.2 para OpenAPI 3.2 com uma única chamada.

Uma camada leve sobre estas duas bibliotecas: [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
Ela não reimplementa análise, validação ou conversão; conecta essas funções e apresenta todas as falhas em uma estrutura uniforme e previsível, com um código de erro legível por máquina.

- **Nome do pacote:** `@powerduck/openapi-parser`
- **Versão:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **Licença:** MIT
- **Node.js:** >= 22.12.0

## Recursos

- **Uma função para todas as versões** — Swagger 2.0, OpenAPI 3.0.x, 3.1.x e 3.2.x são convertidos em um documento 3.2 validado.
- **Entrada como string JSON ou YAML** — Passe um objeto já interpretado ou uma string JSON/YAML bruta.
- **Códigos de erro legíveis por máquina** — Cada falha gera um `OpenApiUpgradeError` com um valor da enumeração `UpgradeErrorCode`.
- **Sem alterar a entrada** — A entrada é copiada em profundidade por `structuredClone` antes de qualquer etapa da conversão.
- **Proteção contra referências circulares** — Detecta ciclos na entrada antes que causem estouro de pilha.
- **Validação da saída** — Por padrão, o documento 3.2 convertido é validado em relação ao esquema.
- **ESM e CJS** — Use `import` no Node moderno e em bundlers, e `require()` no processo principal do Electron.

## Próximos passos

- [Instalação](/docs/pt-BR/openapi-parser/installation/) — instalação e requisitos
- [Início rápido](/docs/pt-BR/openapi-parser/quickstart/) — converta seu primeiro documento
- [Referência da API](/docs/pt-BR/openapi-parser/api-reference/) — todas as exportações, códigos de erro e opções
- [Exemplos](/docs/pt-BR/openapi-parser/examples/) — tratamento de erros, opções e uso com CommonJS
