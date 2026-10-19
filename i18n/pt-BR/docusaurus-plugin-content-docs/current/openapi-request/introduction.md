---
sidebar_position: 1
title: "Introdução ao @powerduck/openapi-request"
description: "@powerduck/openapi-request é um depurador de coleções e um mecanismo de execução de requisições para OpenAPI 3.2. Ele prepara e envia requisições com base em um documento OpenAPI, identifica respostas em streaming e pode gerar um documento atualizado a partir das respostas observadas. Uma interface compacta dá acesso a seis protocolos de comunicação."
---

# Introdução ao @powerduck/openapi-request

`@powerduck/openapi-request` é um depurador de coleções e um mecanismo de execução de requisições para OpenAPI 3.2. Ele prepara e envia requisições com base em um documento OpenAPI, identifica respostas em streaming e pode gerar um documento atualizado a partir das respostas observadas. Uma interface compacta dá acesso a seis protocolos de comunicação.

- **Nome do pacote:** `@powerduck/openapi-request`
- **Versão:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **Licença:** MIT
- **Formato dos módulos:** distribuições ESM e CommonJS com declarações de tipos incluídas.

## Para que serve

A biblioteca atende a três necessidades usando o mesmo documento como referência:

- **Cliente voltado a interfaces gráficas** — `createClient()` retorna um objeto com `prepare()`, `send()`, `connect()`, `discover()` e `writeback()`, que correspondem às etapas de um editor gráfico de requisições.
- **Depurador controlado por scripts** — `createDebugger()` retorna um `ProtoKit` com `send()`, `sendMany()` e `toCollection()` para automação, scripts e CI.
- **Sessões persistentes com controle manual** — `createManualSession()` retorna um objeto de sessão bidirecional com abertura, envio, fechamento e fluxo de eventos. A estrutura é a mesma para WebSocket, MCP e gRPC, permitindo que uma única interface controle os três.

## Adaptadores de protocolo

O núcleo é independente do transporte; os adaptadores de protocolo registrados em um `AdapterRegistry` fornecem o comportamento específico.

- **HTTP / SSE** — suporte padrão. Requisições JSON convencionais e fluxos Server-Sent Events são identificados automaticamente pelos tipos de conteúdo declarados ou pelos cabeçalhos das respostas reais.
- **WebSocket** — sessões bidirecionais de texto ou dados binários com uma estrutura de evento comum.
- **gRPC** — chamadas unárias, streaming do servidor, streaming do cliente e streaming bidirecional com base em arquivos `.proto` ou reflexão do servidor.
- **MCP** — chamadas a ferramentas do Model Context Protocol via Streamable HTTP ou stdio.
- **GraphQL** — introspecção, geração e execução de operações.

## Recursos principais

- **Modelo de coleções OpenAPI 3.2** — localiza operações por `operationId` ou `method`+`path` e prepara requisições a partir de parâmetros, corpos de requisição e exemplos.
- **Detecção de streaming** — `isStreamingOperation()`, `isSseContentType()` e `isStreamingContentType()` classificam respostas pelos tipos de conteúdo declarados; `probeStreamingResponse()` examina os cabeçalhos das respostas reais.
- **Incorporação de respostas ao documento** — `inferSchema()`, `mergeSchema()`, `toResponseObject()` e `writeBackResponse()` inferem esquemas de resposta e retornam um documento atualizado. Por padrão, `send()` o retorna em `patchedSpec` quando a incorporação é bem-sucedida; `writeBack: false` desativa esse comportamento. O documento de entrada não é alterado e nenhum arquivo é salvo automaticamente. Verifique `writeBackSkippedReason` e `writeBackWarnings` antes de persistir o resultado.
- **Utilitários de esquema** — `sampleFromSchema()` gera dados de exemplo a partir de um esquema.
- **Carregamento sob demanda de dependências pesadas** — gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`) e MCP (`@modelcontextprotocol/sdk`) são carregados no primeiro uso. Aplicações que usam apenas HTTP não arcam com esse custo de carregamento.

## Instalação

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## Início rápido

```typescript
import { createClient } from "@powerduck/openapi-request";

const spec = {
  openapi: "3.2.0",
  info: { title: "Users", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User" } },
      },
    },
  },
};

const client = createClient();

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

## Próximos passos

- [Instalação](./installation.md) — estrutura do pacote, exportações de subcaminhos e dependências pares para os recursos de protocolo.
- [Início rápido](./quickstart.md) — primeira requisição, execução do depurador e sessão manual.
- [Configuração](./configuration.md) — `CreateClientOptions`, `DebuggerOptions` e configuração por protocolo.
- [Referência da API](./api-reference.md) — todas as exportações agrupadas por funcionalidade.
- [Exemplos](./examples.md) — exemplos executáveis de HTTP, SSE, WebSocket, GraphQL, MCP e gRPC.

## Licença

MIT.
