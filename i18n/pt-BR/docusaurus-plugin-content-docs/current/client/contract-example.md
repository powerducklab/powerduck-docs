---
title: "Encontrar erros de implementação com testes de contrato"
description: "Encontrar erros de implementação com testes de contrato"
---

# Encontrar erros de implementação com testes de contrato

Este exemplo usa o executor MCP para desenvolvedores, com validação do esquema de resposta disponível desde a versão 0.7.6. Requer Node.js 22.12.0 ou posterior. Usa dados fictícios e um backend que escuta apenas na interface de loopback; após instalar as dependências, não exige conta, modelo nem API pública.

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

A resposta é `{"total":"42"}`, mas o esquema exige um número. O validador real informa `/total must be number` e termina com código 1.

```sh
node examples/contract-total/verify.mjs --correct
```

O backend agora retorna `{"total":42}`; a mesma verificação passa e termina com código 0. Para corrigir a implementação por conta própria, altere a expressão `total` em `examples/contract-total/server.mjs` para retornar um número. Não enfraqueça o contrato para esconder o erro.

Cada execução reserva uma porta local livre e encerra seu servidor ao terminar. Os arquivos e comandos estão no [projeto de exemplo](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total). As verificações de esquema cobrem atualmente respostas JSON, sem validação de formatos nem busca de esquemas remotos. Tipos de conteúdo não suportados que exijam validação são informados como limitações, em vez de passarem silenciosamente.

Isso verifica um backend real. Uma requisição Mock bem-sucedida demonstra apenas o fluxo de exemplo. Opcionalmente, um agente de programação pode usar `run_contract_tests` com um `baseUrl` explícito para executar a mesma verificação; revise o patch antes de aplicá-lo.

[Baixar aplicativo desktop](https://www.powerduck.com/pt-BR/download/) · [Início rápido](https://www.powerduck.com/docs/pt-BR/overview/quickstart/)
