---
sidebar_position: 3
title: "Sua primeira requisição local, sem conta nem modelo de IA"
description: "Sua primeira requisição local, sem conta nem modelo de IA"
---

# Sua primeira requisição local, sem conta nem modelo de IA

## Experimente o exemplo local

Em um espaço de trabalho vazio do aplicativo para desktop, escolha **Experimentar o exemplo** e inicie a execução. O Powerduck cria um exemplo independente, inicia o servidor Mock local, envia `GET /orders/summary` para a porta atribuída e mostra a resposta real. O exemplo só é concluído após uma resposta HTTP 200. O servidor Mock é encerrado após a requisição ou quando você fecha o exemplo. Você pode executá-lo novamente quando quiser. Instale o aplicativo primeiro: esse fluxo local não exige internet, conta ou chave de um modelo de IA.

## Abra sua própria especificação

Use **Abrir** para importar um documento OpenAPI em YAML ou JSON. O exemplo nunca sobrescreve arquivos existentes. O uso gratuito limita o número de especificações. Se atingir o limite, salve e feche ou remova um documento de que não precisa mais. Não descarte alterações não salvas apenas para executar o exemplo. Você também pode gerar OpenAPI a partir de um projeto existente; revise campos incertos antes de confiar no resultado.

## Verifique um backend real

Uma requisição Mock bem-sucedida não comprova que o backend está de acordo com a especificação. Siga o [exemplo de erro de contrato](/docs/pt-BR/client/contract-example/) e, se quiser, [conecte um assistente de programação](/docs/pt-BR/client/coding-agent/). A validação manual não exige um modelo de IA.

## Modelos opcionais e erros comuns

- **Nenhum modelo configurado:** requisições locais, Mock e verificações manuais continuam funcionando. Configure um modelo nos ajustes apenas se quiser usar IA.
- **Falha na conexão com o modelo:** confira o endpoint, a chave e o proxy nos ajustes. Não publique chaves nem cabeçalhos de requisições em relatos de bugs.
- **API inacessível:** confira se o servidor está funcionando e verifique a URL, a porta e os ajustes da requisição no depurador.
- **HTTP 401/403:** revise a autenticação e as permissões da API de destino. Isso não significa que você precisa entrar na sua conta do Powerduck.
- **Falha na validação do contrato:** confira o caminho do campo e o tipo esperado na asserção. Corrija o backend ou uma especificação incorreta e execute a verificação novamente.

Os arquivos locais são lidos e gravados no seu computador. Modelos remotos recebem o contexto necessário; a publicação na nuvem envia o conteúdo selecionado. As estatísticas de uso opcionais ficam desativadas por padrão nos ajustes e são independentes da verificação de licença.

[Baixar](https://www.powerduck.com/download.html) · [Licença para desktop](https://www.powerduck.com/pricing?product=client)
