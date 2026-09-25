---
sidebar_position: 1
title: Introdução
description: "Powerduck é uma plataforma nativa para IA e local-first construída em torno de um único YAML OpenAPI. Você e a IA projetam, depuram, testam, simulam, documentam e expõem ferramentas MCP a partir do mesmo arquivo. Disponível como cliente de desktop, nuvem e bibliotecas de código aberto."
---

# Introdução

A forma de construir APIs está mudando. Por vinte anos, o **operador** era um humano clicando em uma interface, e o **consumidor** de um contrato de API era um humano lendo documentação. Hoje ambos os extremos mudam.

- O operador se torna um **assistente de IA** que converte intenção em ações.
- O consumidor se torna um **agente de IA** que chama a API como uma ferramenta via MCP.

As ferramentas da era anterior — clientes API, visualizadores de especificação, coleções de requisições — foram projetadas para um humano no teclado. Powerduck é projetado para esta era. Não é um cliente API melhor nem um visualizador de especificação mais bonito. É uma **plataforma nativa para IA que parte de um único arquivo OpenAPI**.

## O núcleo: um único arquivo OpenAPI local

Tudo começa com um simples `openapi.yaml` no seu repositório: um arquivo aberto, versionado, legível por humanos e IA. Sem banco de dados proprietário, sem conta na nuvem.

```text
                one local openapi.yaml
                         |
      you + AI -> design debug test mock docs data-model
                         |
                      MCP tools
                         |
               any AI coding agent
```

Esse único arquivo é o contrato. Cada fluxo lê dele, e o mesmo arquivo pode ser passado via MCP a qualquer agente de programação de IA. Assim você, o assistente integrado e qualquer agente externo compartilham uma única fonte de verdade. Quando projeto, depuração, testes, simulação e documentação leem todos o mesmo arquivo, «manter as ferramentas sincronizadas» deixa de ser uma tarefa: não é um objetivo, é uma consequência do projeto.

Powerduck suporta OpenAPI 3.2 e atualiza na hora documentos 3.0 / 3.1 existentes (e Swagger 2.0). As APIs que não são HTTP — SSE, WebSocket, GraphQL, gRPC, MCP — são modeladas como entradas de caminho comuns por meio de uma extensão `x-protocol`, sem conversão forçada a formas REST.

## Trabalhar com a IA

- Assim que abre o YAML, o assistente propõe o que pode fazer com ele.
- Descreva o resultado em linguagem natural — «cria o endpoint de pedidos», «prepara dados de teste», «executa o fluxo de pagamento e faz um relatório» — e escolhe as ferramentas certas e propõe mudanças.
- Cada mudança chega como um **cartão revisável**. Nada é aplicado antes da sua aprovação.
- Ao refinar uma API, o assistente fica nessa API e só muda o pedido, sem alterar o resto do documento.
- Pode trazer **qualquer modelo compatível com OpenAI**. No desktop, as instruções e chaves nunca saem da máquina.

## Local-first por padrão

Powerduck roda na sua máquina, abre e salva arquivos reais, funciona sem conexão e mantém suas chaves API e instruções fora do navegador. A nuvem é uma extensão opcional para compartilhar e publicar, não um requisito para começar.

## Três formas de usar Powerduck

| Forma | O que é | Quando usar |
|---|---|---|
| [**Cliente de desktop**](/docs/client/introduction) | App Electron local-first com assistente de IA e espaço de trabalho API completo | Engenheiros que querem tudo na sua máquina, trabalhar sem conexão e manter chaves/instruções locais |
| [**Powerduck Cloud**](/docs/cloud/introduction) | Serviço hospedado para alojamento OAS, documentação online e MCP gerenciado | Para compartilhar APIs, publicar links estáveis e oferecer MCP sem executar nada |
| [**Bibliotecas de código aberto**](/docs/opensource/) | Pacotes npm `@powerduck/*` combináveis | Para construir suas próprias ferramentas, pipelines CI ou componentes embutidos |

As três formas compartilham o mesmo motor. O cliente de desktop e a nuvem são montados ambos a partir das bibliotecas de código aberto, por isso as capacidades se comportam igual, sejam executadas localmente, chamadas pela rede ou importando os pacotes diretamente.

### Cliente de desktop

O [cliente de desktop](/docs/client/introduction) roda por completo na sua máquina. Abre e edita arquivos reais em disco, envia requisições por um processo local, executa simulações locais e mantém as instruções de IA e chaves API fora da consola do navegador. Os modelos são livremente configuráveis e as mudanças propostas chegam como cartões revisáveis antes de aplicar.

### Powerduck Cloud

[Powerduck Cloud](/docs/cloud/introduction) leva o mesmo fluxo online. Adicione um arquivo, um repositório Git ou uma URL, escolha as operações a expor e obterá links estáveis à documentação renderizada e um endpoint MCP gerenciado. O acesso pode ser protegido com uma senha de visualização ou uma chave de acesso MCP; os planos pagos adicionam sincronização Git, domínios personalizados e limites mais altos.

### Bibliotecas de código aberto

As [bibliotecas](/docs/opensource/) são o motor subjacente: analisador e atualizador OpenAPI, CLI multiprotocolo, gerador de código, servidor MCP, executor de requisições, conversores cURL / Postman e editores embutidos. Cada um é publicado de forma independente no npm com guias de instalação dedicados e referências API. Os detalhes técnicos de baixo nível vivem aqui.

## O que muda para você

- **Descreva o resultado, não os cliques.** Diga o objetivo e o assistente avança em passos revisáveis.
- **Suas APIs são aptas para agentes desde o início.** O mesmo contrato que gera documentação gera também ferramentas MCP, para que os agentes de IA chamem corretamente sua API desde o primeiro dia.
- **Sem desvios.** Projeto, depuração, testes, simulação e documentação leem um só arquivo.
- **Todos os protocolos num só lugar.** HTTP, SSE, WebSocket, GraphQL, gRPC e MCP numa especificação, não seis ferramentas.
- **Sem bloqueio.** Traga seus modelos, mantenha as chaves locais no desktop e possua o YAML em texto simples no seu repositório.

## Para onde ir depois

- Novo aqui? Comece por [Instalação](/docs/overview/installation) e [Início rápido](/docs/overview/quickstart).
- Precisa do espaço local completo? Leia o [guia do cliente de desktop](/docs/client/introduction).
- Quer publicar sua API online? Leia o [guia da Cloud](/docs/cloud/introduction).
- Constrói sua própria integração? Veja as [bibliotecas de código aberto](/docs/opensource/).
