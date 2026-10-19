---
sidebar_position: 1
title: "Introdução"
description: "Converta OpenAPI em serviços MCP: ferramentas, prompts e recursos, console web, stdio, HTTP e CLI openapi-mcp."
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — Introdução

`@powerduck/openapi-mcp-server` transforma um documento OpenAPI em um serviço MCP (Model Context Protocol) em execução. Gera **ferramentas** a partir das operações, **prompts** a partir dos metadados e operações da API e **recursos** a partir do catálogo. Disponibiliza esses elementos pelo protocolo MCP e inclui uma interface web de administração.

- **Nome do pacote:** `@powerduck/openapi-mcp-server`
- **Versão:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **Licença:** MIT
- **Versão do Node:** `>=22.12.0`
- **Executável CLI:** `openapi-mcp`
- **Formato dos módulos:** Builds ESM e CommonJS com declarações de tipos incluídas.

Usa `@powerduck/openapi-parser` para validação e resolução de referências e `@modelcontextprotocol/sdk` para o protocolo.

## Conteúdo gerado

- **Tools** — Uma ferramenta MCP por operação OpenAPI, com serialização completa dos parâmetros (estilos path/query/header/cookie e regras explode), codificação do corpo (JSON, form-urlencoded, multipart, texto e binário) e anotações MCP (`readOnlyHint`, `destructiveHint`, `idempotentHint`).
- **Prompts** — Prompts globais (`spec_overview`, `integration_guardrails`) e por operação (`explain_*`, `plan_*`, `sample_*`).
- **Resources** — Recursos fixos do catálogo, como `openapi://spec/summary`, `openapi://catalog/tools` e `openapi://spec/document`.

## Transportes

- **stdio** — `startStdioServer()` fornece um documento a um cliente MCP local, como Claude Desktop ou uma integração com editor.
- **HTTP** — `attachMcpRoutes(app, options)` monta Streamable HTTP em `/mcp` e, opcionalmente, SSE legado em `/sse` no seu aplicativo Express. As opções controlam limites de sessões, tempos de inatividade, CORS e proteção contra DNS rebinding. `startAdminServer()` adiciona a interface de administração e usa os limites de sessões padrão. `attachSseRoutes()` continua disponível como wrapper descontinuado com argumentos posicionais.

## Servidor de administração

`startAdminServer()` inicia um aplicativo Express que fornece:

- o console web para carregar ou colar especificações, inspecionar ferramentas, prompts e recursos e consultar serviços ativos e logs de requisições;
- os transportes HTTP do MCP;
- autenticação por chave de API, logs de requisições com ocultação de cabeçalhos sensíveis e persistência opcional do estado.

## Instalação

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## Início rápido

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## Próximos passos

- [Instalação](../installation/) — npm/yarn/pnpm, instalação global, subcaminho `./server` e dependências.
- [Início rápido](../quickstart/) — Uso pela CLI e pelo código.
- [Configuração](../configuration/) — Descrição completa de `ServerConfig`.
- [Referência da API](../api-reference/) — Todas as exportações e comandos da CLI.
- [Exemplos](../examples/) — Exemplos práticos.

## Licença

MIT.
