---
title: "Conectar o OpenAPI a um agente de programação"
description: "Conectar o OpenAPI a um agente de programação"
---

# Conectar o OpenAPI a um agente de programação

Use o **MCP para desenvolvedores** para permitir que um agente de programação examine um contrato e verifique um backend. O **API-to-MCP** expõe operações de API como ferramentas que podem ser chamadas; trata-se de outro fluxo de trabalho.

1. Abra seu arquivo YAML/JSON com **Abrir** no aplicativo para desktop. Salve uma cópia independente antes de experimentar.
2. Abra **MCP e programação** para a especificação atual. Como alternativa, execute `npm ci` e `npm run build` em uma cópia local do repositório do MCP para desenvolvedores.
3. Configure um servidor MCP stdio no agente usando o executável `node` e os argumentos `/absolute/path/dev-mcp-server/dist/cli.mjs`, `--spec`, `/absolute/path/openapi.yaml`. Use caminhos absolutos reais; não cole os exemplos literalmente.
4. Peça ao agente que leia uma operação e seu esquema de resposta antes de alterar o backend. Após a alteração, peça que ele chame `run_contract_tests` com a `baseUrl` local do backend informada explicitamente.
5. Revise as asserções do relatório e o patch de código proposto. Execute os testes novamente depois de aplicar uma correção aceita.

O servidor MCP para desenvolvedores exige Node.js 22.12.0 ou superior. Seu agente pode enviar resultados de ferramentas ou contexto de código ao modelo remoto configurado. Não é necessário um modelo para requisições locais manuais e testes de contrato. Seu provedor cobra pelo uso da sua chave; os créditos de modelos hospedados são separados. Não é necessária uma assinatura do Cloud para trabalhar localmente.

[Baixar o aplicativo para desktop](https://www.powerduck.com/pt-BR/download/) · [Início rápido](https://www.powerduck.com/docs/pt-BR/overview/quickstart/)
