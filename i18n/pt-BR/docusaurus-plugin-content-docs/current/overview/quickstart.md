---
sidebar_position: 3
title: Início rápido
description: "Em poucos minutos percorra o endpoint desenhado, uma requisição real e a documentação renderizada a partir do seu arquivo OpenAPI."
---

# Início rápido

Este breve percurso atravessa o ciclo central: abrir uma especificação, modificá-la com o assistente de IA, enviar uma requisição e ver o resultado como documentação, usando o mesmo documento OpenAPI em toda parte.

## 1. Abrir uma especificação

Arranque o cliente e abra uma especificação a partir de qualquer fonte suportada. Todas passam pelo mesmo fluxo de importação e são convertidas ou atualizadas a OpenAPI 3.2:

- Um **arquivo OpenAPI ou Swagger** em disco (Swagger 2.0, OpenAPI 3.0 / 3.1 atualizados).
- Uma **coleção do Postman**.
- Um **comando cURL**.
- Um **repositório Git**.
- Uma **URL** que aponta para uma especificação.

Também pode arrastar e soltar um arquivo diretamente no espaço de trabalho. Sem ponto de partida, peça ao assistente que crie um esqueleto inicial a partir de uma breve descrição.

## 2. Pedir ao assistente que adicione um endpoint

No chat, descreva o que precisa. Por exemplo:

> Adiciona um endpoint `GET /products` que devolve uma lista paginada de produtos.

O assistente não edita diretamente o documento; responde com um **cartão de patch**. O cartão mostra a operação a modificar e as rotas/recursos afetados. Reveja, depois escolha **Aplicar** ou **Rejeitar**. Nada chega ao documento antes de aplicar.

Para um pedido amplo como «constrói uma API de comércio eletrónico», o assistente faz primeiro perguntas de esclarecimento e depois propõe patches focados em 2 a 5 operações de cada vez.

## 3. Refinar uma só operação sem desvios

Abra a operação e refine-a no local — adicione um parâmetro de consulta ou estenda o esquema de resposta. Em modo foco, o assistente gera patches finos que só tocam os campos pedidos e preservam tudo o resto da operação. Isto evita alterar ou sobrescrever o trabalho existente em edições repetidas sobre a mesma API.

## 4. Enviar uma requisição real

Passe ao **espaço de trabalho de requisição** da operação e envie. A requisição executa pelo processo principal local. A resposta, o estado, os cabeçalhos e o tempo aparecem junto à operação, e para valores que mudam em cada execução pode usar ambientes e variáveis.

Se nem os `servers` da especificação nem o ambiente ativo fornecem uma URL base, a app não adivinha: pede introduzir a URL base.

## 5. Ver a documentação

Abra a **documentação**: a mesma especificação renderiza-se como documentação de API legível. O visualizador lê o documento ao vivo, por isso a documentação coincide sempre com o recém-desenhado.

## 6. Ir mais longe quando estiver pronto

- Encadeie várias requisições com os [testes de cenário](../client/scenario-testing.md) e exporte um relatório HTML.
- Arranque o [servidor de simulação local](../client/mock-server.md) durante o desenvolvimento do backend.
- Modele APIs de streaming / RPC com os [seis protocolos](../client/protocols.md).
- Derive tabelas, relações e SQL no [modelo de dados](../client/data-model.md).
- Publique a mesma especificação online com [Powerduck Cloud](../cloud/quickstart.md).

Com isto o ciclo central está completo. O resto da documentação detalha cada espaço de trabalho.
