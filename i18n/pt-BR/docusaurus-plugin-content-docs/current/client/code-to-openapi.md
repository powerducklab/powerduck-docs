---
title: "Gerar OpenAPI a partir de um projeto existente"
description: "Gerar OpenAPI a partir de um projeto existente"
---

# Gerar OpenAPI a partir de um projeto existente

No aplicativo desktop, escolha **Analisar código para OpenAPI** (Beta), selecione uma pasta de código local e clique em **Iniciar análise**. Comece com um serviço pequeno. Revise as rotas, os parâmetros e as respostas detectados antes de adotar a especificação gerada.

Uma análise estática pode deixar esquemas de resposta desconhecidos quando os handlers dependem de código dinâmico ou de dependências indisponíveis. “Confirmar manualmente” registra sua revisão; não reconstrói tipos ausentes. Edite o contrato da API com base em evidências ou peça à IA que revise o handler selecionado. Essa ação envia o código selecionado e seu contexto ao provedor de modelos configurado.

Salve o resultado em um novo arquivo. Não substitua um contrato existente sem revisar as alterações. Depois, execute o [exemplo de contrato](/docs/pt-BR/client/contract-example/) contra um backend em execução ou conecte um [agente de programação](/docs/pt-BR/client/coding-agent/). Uma análise bem-sucedida não comprova que a implementação atende ao contrato.

Esse fluxo está disponível apenas no desktop; o suporte a linguagens e frameworks varia conforme o analisador. A análise estática não exige chave de modelo. Trate resultados não resolvidos como desconhecidos, não como fatos inferidos.

[Baixar aplicativo desktop](https://www.powerduck.com/pt-BR/download/) · [Início rápido](https://www.powerduck.com/docs/pt-BR/overview/quickstart/)
