---
sidebar_position: 1
title: "Bibliotecas de código aberto"
description: "Os pacotes npm @powerduck/* são a base do cliente desktop e do Cloud: análise e atualização, CLI multiprotocolo, geração de código, MCP, requisições, conversão e editores incorporáveis."
---

# Bibliotecas de código aberto

O Powerduck é composto por pequenos pacotes npm combináveis. O cliente desktop e o serviço de nuvem usam as mesmas bibliotecas, permitindo que os mesmos componentes funcionem localmente, pela rede ou nas suas próprias ferramentas.

Cada pacote é publicado de forma independente, com instalação, referência da API e exemplos próprios. Esta página explica o papel de cada um e como se relacionam.

## Organização em camadas

```text
Powerduck / Cloud
        ↓
Interfaces incorporáveis
        ↓
Fluxos de trabalho
        ↓
Base
```

O parser e os conversores formam a base. Os fluxos de trabalho se apoiam nela, e as interfaces incorporáveis ficam na camada superior. Compartilhar a base evita reimplementar a análise em cada pacote e mantém o comportamento consistente.

## Os pacotes

### Base

| Pacote | Finalidade |
|---|---|
| [`@powerduck/openapi-parser`](../openapi-parser/introduction.md) | Analisar, validar e atualizar documentos OpenAPI/Swagger |
| [`@powerduck/conf-patch`](../conf-patch/introduction.md) | Aplicar alterações de configuração estruturadas e validadas |
| [`@powerduck/x-to-openapi`](../x-to-openapi/introduction.md) | Converter outros formatos, como cURL e Postman, para OpenAPI |

### Fluxos de trabalho

| Pacote | Finalidade |
|---|---|
| [`@powerduck/openapi-cli`](../openapi-cli/introduction.md) | Fluxos multiprotocolo pela linha de comando, incluindo execução de cenários |
| [`@powerduck/openapi-codegen`](../openapi-codegen/introduction.md) | Gerar código cliente e outros artefatos a partir de uma especificação |
| [`@powerduck/openapi-mcp-server`](../openapi-mcp-server/introduction.md) | Disponibilizar uma especificação OpenAPI como servidor MCP |
| [`@powerduck/openapi-request`](../openapi-request/introduction.md) | Executar requisições descritas por uma especificação |

### Interfaces incorporáveis

| Pacote | Finalidade |
|---|---|
| [`@powerduck/oas-document`](../oas-document/introduction.md) | Renderizar OpenAPI como documentação legível, com ponto de entrada React |
| [`@powerduck/md-editor`](../md-editor/introduction.md) | Editor Markdown incorporável |
| [`@powerduck/schema-editor`](../schema-editor/introduction.md) | Editor JSON Schema incorporável |
| [`@powerduck/tree`](../tree/introduction.md) | Componente de árvore para dados estruturados |
| [`@powerduck/workspace-yaml`](../workspace-yaml/introduction.md) | Integração do YAML do espaço de trabalho |

## Escolher o pacote adequado

- **Ler, validar ou atualizar um arquivo OpenAPI:** comece com `openapi-parser`.
- **Converter cURL ou uma coleção Postman para OpenAPI:** use `x-to-openapi`.
- **Executar cenários ou fluxos multiprotocolo pela linha de comando ou em CI:** use `openapi-cli`.
- **Gerar código cliente:** use `openapi-codegen`.
- **Expor uma API como ferramentas para um agente de IA:** use `openapi-mcp-server`.
- **Incorporar documentação renderizada em um aplicativo React:** use `oas-document`, sua entrada React e o CSS correspondente.
- **Incorporar um editor:** use `md-editor` ou `schema-editor`.

## Compartilhar capacidades com agentes

O pacote de servidor MCP também permite que agentes de IA externos usem as capacidades do Powerduck. Uma especificação servida por `openapi-mcp-server` expõe suas operações como ferramentas MCP. Assim, o mesmo contrato usado pela documentação e pela geração de código pode ser chamado diretamente por um agente. O cliente desktop, o Cloud e outras ferramentas compatíveis com MCP compartilham a mesma definição de referência.

## Sobre os exemplos

Os exemplos de código seguem a API real do pacote e foram escritos para funcionar como apresentados. Após atualizar um pacote, consulte as notas da versão para os parâmetros atuais, em vez de copiar trechos de versões anteriores.

Use a barra lateral para acessar instalação, configuração e referência completa da API de cada pacote.
