---
sidebar_position: 7
title: Servidor de simulação local
description: "Execute uma simulação local da sua API OpenAPI escolhendo porta, caminho base, latência e sobrescritas de resposta, e inspecione as requisições recebidas."
---

# Servidor de simulação local

O servidor de simulação oferece um clone funcional da sua API diretamente da especificação, para avançar o trabalho de frontend e cliente antes de o backend estar pronto. Sem infraestrutura externa; roda no processo principal do desktop.

## Iniciar uma simulação

Pode iniciá-la no modo servidor ou diretamente no chat de IA; desde o chat, a app confirma o endereço do serviço.

Opções disponíveis.

| Opção | Intervalo/forma | Uso |
|---|---|---|
| `port` | Inteiro `1`–`65535` | Porta local a escutar |
| `basePath` | Prefixo de caminho URL | Servir sob um caminho base |
| `latencyMs` | `0`–`10000` | Retardo artificial para imitar latência de rede |
| `overrides` | até 100 sobrescritas | Devolver uma resposta concreta para operações escolhidas |

Os valores inválidos de porta ou retardo rejeitam-se com mensagem clara, sem iniciar um servidor partido.

## Várias simulações

Pode executar várias em paralelo — por exemplo uma por documento aberto. A app lista as ativas (`mock:list`) e pode parar individualmente (`mock:stop`). Cada uma está ligada a um ID e nome de documento.

## Inspecionar requisições recebidas

A simulação regista as requisições recebidas; consultáveis (`mock:requests`, limite opcional) e o registo apagável. Ajuda a verificar que o cliente chama as operações certas com os parâmetros esperados, mesmo sem backend real.

## Sobrescritas de resposta

Quando os exemplos por defeito ou respostas derivadas do esquema não bastam, as sobrescritas devolvem uma resposta escolhida para operações concretas. Um limite (máximo 100) mantém a configuração previsível.

## Quando usar

- Desbloquear o desenvolvimento de frontend sobre um contrato ainda em construção.
- Reproduzir situações lentas ou casos limite ajustando retardo e respostas.
- Demonstrar fluxos de API sem ambiente implantado.
- Verificar que um cliente gerado chama as operações como se espera.

A simulação lê a mesma spec que os demais modos, por isso mantém-se alinhada com o contrato ao mudar o desenho.

Veja também: [Testes de cenário](./scenario-testing.md)、[Desenhar com o assistente](./design.md).
