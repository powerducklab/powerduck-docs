---
sidebar_position: 6
title: "Agentes A2A"
description: "Projete, depure e documente A2A com JSON-RPC, REST, gRPC no desktop, verificação JWS e uma demonstração local executável."
---

# Agentes A2A

MCP expõe ferramentas e recursos; A2A permite delegar trabalho entre agentes, trocar mensagens e acompanhar tarefas e artefatos. O Powerduck mantém os dois como protocolos distintos na mesma especificação local.

## Criar e depurar

1. Selecione **Nova requisição → A2A**. O padrão é **1.0 / JSON-RPC**. A versão 1.0 também oferece REST e gRPC no desktop; a 0.3 oferece apenas JSON-RPC. Não há conversão implícita de versões.
2. Configure endpoint e método. Clique em **Gerar corpo da requisição**, confira a prévia e confirme em **Substituir corpo da requisição**. Cancelar ou apenas mudar o método preserva o rascunho.
3. Em JSON-RPC, edite `params`; em REST/gRPC, edite diretamente o objeto, sem o envelope externo `jsonrpc`, `id`, `params`. Configure credenciais em Auth e cabeçalhos. O envio acrescenta `A2A-Version`.
4. Inspecione toda a resposta: HTTP 200 pode conter um `error` RPC. JSON-RPC 1.0 retorna `task` ou `message` dentro de `result`.
5. Salve na especificação. `x-a2a` preserva configuração, exemplos e contratos. JSON-RPC usa o método do corpo; REST/gRPC o método escolhido. IDs de requisição e mensagem são distintos. Para continuar uma conversa, mantenha os identificadores de contexto e tarefa retornados.

## Transportes

A URL REST é a base, como `https://agent.example/rest`. O método determina verbo HTTP e caminho; IDs de tarefa são codificados e filtros e paginação viram parâmetros de consulta. Depuração e documentação compartilham esse mapeamento.

gRPC exige o aplicativo desktop. Use `https://host:port` para TLS com certificados confiáveis do sistema ou `http://localhost:port` em testes locais sem criptografia, sem caminho adicional. Cabeçalhos viram metadados. São usados o descritor oficial `lf.a2a.v1.A2AService` e ProtoJSON. Scripts HTTP, proxies e TLS personalizado são rejeitados nesse transporte.

## Agent Card e JWS

**Obter Agent Card público** consulta normalmente `/.well-known/agent-card.json`. Confira versão, habilidades, capacidades e autenticação antes de aplicar uma interface explicitamente. A consulta não troca o endpoint nem encaminha credenciais a outra origem. A descoberta pública não envia credenciais, não segue redirecionamentos e limita respostas a 1 MiB. No navegador, CORS é necessário.

Abra **Verificar assinatura JWS** e cole um JWKS público recebido por um canal confiável. A verificação é local e nunca acessa URLs de chaves fornecidas pelo cartão. Ela cobre campos padrão A2A 1.0, não campos personalizados. A normalização segue presença de campos A2A e RFC 8785, preservando strings e arrays vazios obrigatórios e booleanos opcionais explicitamente presentes. Assinaturas que removem esses valores são rejeitadas. Uma assinatura válida não confirma por si só a organização dona de uma chave desconhecida.

Salvar o cartão guarda um instantâneo, não uma decisão de confiança. Remova metadados privados antes de compartilhar. Para cartões protegidos, use o método extended-card autenticado.

## Tarefas e streaming

Na versão 1.0, use `SendStreamingMessage` ou `SubscribeToTask`; na 0.3, `message/stream` ou `tasks/resubscribe`. Inspecione eventos SSE ou gRPC nativos, estados e artefatos. **Parar** apenas desconecta a requisição local. Para cancelar remotamente, envie `CancelTask` ou `tasks/cancel` com o ID da tarefa. Uma tarefa encerrada não pode simplesmente ser reiniciada.

Consulta de tarefas, listagem em 1.0, cartões estendidos e configuração de notificações dependem das capacidades do agente. O Powerduck não hospeda um receptor de notificações push.

## Extensão OpenAPI

`x-a2a` é uma extensão Powerduck, não um Agent Card padrão nem uma palavra-chave OpenAPI. O caminho documentado identifica a operação; `endpoint` é o destino real.

```yaml
openapi: 3.2.0
info:
  title: A2A demo
  version: 1.0.0
paths:
  /agents/research/send:
    post:
      summary: SendMessage
      x-protocol: a2a
      x-a2a:
        version: '1.0'
        binding: JSONRPC
        endpoint: https://agent.example.com/rpc
        agentCardUrl: https://agent.example.com/.well-known/agent-card.json
        method: SendMessage
        requestSchema:
          type: object
          description: A2A SendMessage
        responseSchema:
          type: object
          description: JSON-RPC
        example:
          jsonrpc: '2.0'
          id: request-1
          method: SendMessage
          params:
            message:
              messageId: message-1
              role: ROLE_USER
              parts:
                - text: 12 30
      responses:
        '200':
          description: A2A result / error
          content:
            application/json:
              schema:
                type: object
```

`version` é `1.0` ou `0.3`; `binding` é `JSONRPC`, e em 1.0 também `HTTP+JSON` ou `GRPC`. `agentCardUrl` indica a descoberta e `agentCard` um instantâneo opcional. `example` contém o envelope JSON-RPC ou objeto REST/gRPC. `requestSchema` e `responseSchema` são contratos explícitos, não inferidos de uma única resposta. SSE usa `text/event-stream` e `itemSchema` do OAS 3.2. A documentação e Copy for LLM preservam a configuração; gRPC mostra ProtoJSON e os transportes HTTP mostram exemplos de código.

## Gerar servidor

Abra **Gerar servidor → Baixar projeto do servidor** para obter um projeto Node.js 22+. Execute `npm install`, configure `A2A_TOKEN` com pelo menos 32 caracteres aleatórios e `HANDLER_URL`, depois `npm start`. O manipulador HTTP recebe `{message, contextId}` e retorna um Message com `parts` não vazio. Credenciais existentes não são exportadas.

O servidor limita payloads e concorrência, define um prazo de 60 segundos e libera recursos no encerramento. `SIGNING_JWK_FILE` habilita assinatura e `CORS_ORIGINS` autoriza origens de navegador explicitamente. É um adaptador sem estado, sem motor de tarefas persistentes ou entrega push. Antes de publicá-lo, configure URLs, TLS, limites do proxy reverso e autenticação multiusuário.

## Demonstração local executável

O repositório React inclui `examples/a2a-demo`, uma calculadora de somas sem chave de IA nem serviço externo. Requer Node.js 22+.

```bash
cd powerduck-react/examples/a2a-demo
npm ci
npm start
```

```bash
npm test
```

Execute `npm test` em outro terminal no mesmo diretório. Importe `openapi.json` e use o Bearer Token `powerduck-local-demo-token-0123456789`. Enviar `[12,30]` retorna `Sum: 42` e `total: 42` estruturado. JSON-RPC: `http://127.0.0.1:9999/rpc`; REST: `http://127.0.0.1:9999/rest`; gRPC: `http://127.0.0.1:9998`. Cartão: `http://127.0.0.1:9999/.well-known/agent-card.json`. A chave pública local confiável está em `.runtime/trusted-jwks.json` e muda ao reiniciar.

Os testes usam portas isoladas e verificam três transportes, SSE, respostas estruturadas, rejeição de adulteração, autenticação e CORS. A demo escuta apenas localmente e não implementa tarefas persistentes ou push. Não publique usando o token da demo. As origens padrão são `http://localhost:3000` e `http://127.0.0.1:3000`; configure outras com `CORS_ORIGINS`.

[A2A 1.0](https://a2a-protocol.org/v1.0.0/specification/) · [A2A 0.3](https://a2a-protocol.org/v0.3.0/specification/)
