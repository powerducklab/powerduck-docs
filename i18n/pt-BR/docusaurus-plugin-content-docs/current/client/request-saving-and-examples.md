---
title: "Salvar requisições e exemplos de protocolos"
description: "O Powerduck separa a requisição que você está testando do contrato que publica."
---

# Salvar requisições e exemplos de protocolos

O Powerduck separa a requisição que você está testando do contrato que publica.

| Ação | Resultado |
| --- | --- |
| Salvar na barra de URL | Salva a configuração local de depuração da requisição sem modificar o documento OpenAPI. |
| Requisição rápida: salvar na especificação | Adiciona uma operação ao documento e à pasta selecionados. |
| Requisição da especificação: atualizar especificação | Mostra o método, o caminho de destino e a prévia da definição antes de atualizar o contrato. |
| Salvar documento / Cmd+S ou Ctrl+S | Grava o documento OpenAPI atual no disco. Em uma aba de requisição rápida, o atalho salva essa requisição rápida. |

A requisição local contém o servidor selecionado, URL, método, valores dos parâmetros, corpo, scripts e configurações de transporte. Os rascunhos de requisições da especificação ficam na memória durante a edição; Salvar na barra de URL os persiste no armazenamento do processo de renderização sob `powerduck.debug.v1:`. As entradas são separadas por ID do documento, caminho e método. Limpar os dados do navegador ou do aplicativo remove esse estado local; o arquivo OAS exportado não o inclui. Esse armazenamento **não é um cofre criptografado de segredos**: use referências de ambiente em vez de credenciais em texto simples nas URLs, cabeçalhos ou corpos. Os controles de autenticação usam um mecanismo separado de persistência de credenciais.

`x-powerduck-request` **não é uma extensão oficial do contrato**. Adicionar à especificação e Atualizar especificação não a geram. Ela não deve descrever métodos, parâmetros, corpos de requisição ou respostas. Apenas abrir um documento não reescreve cópias existentes em outras operações.

## Atualizar uma definição explicitamente

Atualizar especificação mostra a prévia do método e do caminho de destino e preserva as respostas e os schemas existentes. As definições de parâmetros só são incluídas se selecionadas; os valores de depuração não são copiados. Um corpo JSON só entra como exemplo mediante seleção explícita. Nomes comuns de campos de credenciais são excluídos, mas **revise textos livres e exemplos antes de publicar**. Scripts e substituições de autenticação não são campos do contrato.

Não é possível sobrescrever uma operação de destino existente alterando o método ou o caminho. As referências locais às operações são ajustadas. Um método personalizado como `PURGE` é armazenado em `paths./cache.additionalOperations.PURGE` e exige OpenAPI 3.2. A prévia informa esse requisito e, ao aplicar a alteração, define a versão do documento como 3.2.0. Verifique também a compatibilidade das ferramentas que consumirão o documento.

A edição de schemas de protocolo continua disponível em Editar documentação. Ela muda a definição explicitamente; enviar ou salvar uma requisição de depuração não reescreve os schemas silenciosamente.

## Exemplos oficiais para download

São **definições de exemplo** mantidas, não serviços de API públicos do Powerduck. Todos os endpoints apontam para serviços locais que você precisa fornecer. Importar um arquivo não inicia esses serviços, não conecta automaticamente nem fornece credenciais.

- [Todos os protocolos](https://www.powerduck.com/docs/examples/protocols/all-protocols.yaml)
- [HTTP e PURGE personalizado](https://www.powerduck.com/docs/examples/protocols/http.yaml)
- [SSE](https://www.powerduck.com/docs/examples/protocols/sse.yaml)
- [WebSocket](https://www.powerduck.com/docs/examples/protocols/websocket.yaml)
- [GraphQL](https://www.powerduck.com/docs/examples/protocols/graphql.yaml)
- [gRPC](https://www.powerduck.com/docs/examples/protocols/grpc.yaml) e [echo.proto](https://www.powerduck.com/docs/examples/protocols/echo.proto)
- [MCP Streamable HTTP](https://www.powerduck.com/docs/examples/protocols/mcp.yaml)
- [A2A 1.0 JSON-RPC](https://www.powerduck.com/docs/examples/protocols/a2a.yaml)

Para gRPC, baixe `echo.proto` ao lado do arquivo YAML e selecione seu caminho local real no cliente, se necessário. O servidor deve implementar `powerduck.examples.Echo/Echo` na porta 50051. Os demais exemplos também precisam de um servidor correspondente; não são demonstrações de validação contra um backend em execução.

## Referência das extensões de contrato

Cada operação tem um método OAS comum, operationId, summary e responses. As vinculações não HTTP usam uma operação OAS como referência documental; `post` no exemplo gRPC não significa que gRPC foi convertido em um endpoint REST.

| Extensão | Significado e campos usados nos exemplos |
| --- | --- |
| `x-protocol` | `sse`, `websocket`, `graphql`, `grpc`, `mcp` ou `a2a`. Pode ser omitida para HTTP. |
| `x-session` | Declara uma sessão de protocolo de longa duração; os exemplos a usam para WebSocket e MCP. |
| `x-websocket` | `url`, `subprotocols` opcional, `headers` e `messages`. Cada mensagem documentada tem `id`, `name`, `type`, `body`, `requestSchema`, `responseSchema`. Não inclua credenciais nos cabeçalhos. |
| `x-graphql` | `endpoint`, `query`, `operationName`, `variablesSchema`, `variables` públicas, `responseSchema`. |
| `x-grpc` | `address`, `service`, `method`, `kind`, `reflection`, `protoPaths`, `includeDirs` e `messages` documentadas. `kind` aceita unary/server_streaming/client_streaming/bidi_streaming. Os caminhos proto locais dependem da implantação. |
| `x-mcp` | `transport`, `endpoint`, `method` e os campos específicos do método `name`, `argumentsSchema`, `arguments` públicos, `responseSchema`. Operações de recursos usam `uri`; não misture campos de métodos sem relação. |
| `x-a2a` | `version`, `binding`, `endpoint`, `method`, `requestSchema`, `responseSchema` explícitos e `example` público. Os payloads de 0.3 e 1.0 são diferentes; consulte [A2A](./a2a.md). |
| `x-response-stream` | Intenção opcional de streaming GraphQL, usada quando o servidor e o transporte reais oferecem streaming. Não é necessária para requisições GraphQL comuns. |

SSE usa o campo padrão `responses.200.content.text/event-stream.itemSchema` para descrever o payload de cada evento. HTTP usa parâmetros, requestBody, responses e esquemas de segurança padrão. Não invente um bloco `x-sse` nem armazene o estado de depuração como extensão do contrato.

Os exemplos incluem configurações completas e utilizáveis para a vinculação escolhida, não todas as opções mutuamente excludentes. MCP stdio exige um executável local configurado separadamente; esses exemplos para download não o iniciam automaticamente, por decisão de projeto.

## Integração de pacotes

A interface de desktop gerencia a persistência local de depuração e as gravações explícitas da especificação. `@powerduck/openapi-parser` já lê métodos personalizados por meio de `additionalOperations`; `@powerduck/tree` e `@powerduck/oas-document` consomem essa estrutura. `@powerduck/openapi-request` recebe argumentos de execução separados da especificação. Executar requisições não exige `x-powerduck-request`.

Essa separação de salvamento não adiciona parâmetros npm públicos. Use as extensões de protocolo existentes para os dados do contrato e passe os valores atuais de depuração à API de execução. Não faça exportadores, geradores ou ferramentas MCP dependerem da estrutura privada do estado das requisições.
