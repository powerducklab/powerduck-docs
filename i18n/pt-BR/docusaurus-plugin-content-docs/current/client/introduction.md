---
sidebar_position: 1
title: Cliente de desktop
description: "O cliente de desktop Powerduck é um espaço de trabalho local-first impulsionado por IA. A partir de um único arquivo OpenAPI na sua máquina, projete APIs, depure requisições, execute testes, simule APIs, publique documentação e expõe ferramentas MCP."
---

# Cliente de desktop

O cliente de desktop é onde o fluxo nativo para IA ocorre na sua própria máquina. Abre o `openapi.yaml` do seu repositório, descreve o resultado desejado e depois revê. Sem alternar entre editor de especificação, cliente HTTP, ferramenta de simulação, gerador de documentação e executor de testes, e arranca sem conta na nuvem.

Mantém sempre o controlo: o assistente propõe, você aprova.

## Um dia no espaço de trabalho

Estes são os momentos que o cliente coloca no centro.

- **Abrir a especificação e entender o conjunto.** O assistente lê o documento atual e propõe imediatamente o que pode fazer: lacunas a preencher, documentação a completar, fluxos a testar.
- **Construir a API.** Descreva um recurso e o assistente propõe as operações. Continue afinando a mesma operação — adicionar um parâmetro, ajustar uma resposta, corrigir um código de estado — e fica nessa API sem alterar o resto do documento.
- **Preparar dados de teste.** Gere dados de exemplo realistas a partir dos esquemas para dar valores concretos a requisições e cenários.
- **Executar uma requisição única ou um cenário completo.** Depure uma chamada isolada ou encadeie várias operações num fluxo de ponta a ponta, e receba um relatório compartível sobre o que passa e falha.
- **Avançar antes de o backend estar pronto.** Arranque uma simulação local que responde segundo o contrato enquanto o serviço real se desenvolve.
- **Passar a API a um agente de programação.** Converta a especificação num servidor MCP para que as ferramentas de IA descubram e chamem as operações corretas com os parâmetros corretos.
- **Ver a base de dados atrás da API.** Derive tabelas, relações e SQL da especificação, compare com uma base real e entenda as próximas mudanças.
- **Mudar ajustes sem sair da conversa.** Mudar tema ou idioma, configurar um proxy, gerir variáveis de ambiente apenas pedindo.

## Cada modo e o seu uso

Um único documento impulsiona todos os modos, acessíveis por um seletor compacto.

| Modo | O que faz |
|---|---|
| [**Spec**](./design.md) | Modo principal: chat de IA, documento, pré-visualização ao vivo |
| [**Espaço de requisição**](./debug.md) | Envia e inspeciona requisições HTTP reais; separadores e ambientes |
| [**Testes de cenário**](./scenario-testing.md) | Vincula operações em fluxos, executa-os e produz um relatório |
| [**Documentação**](./protocols.md) | Lê a especificação como documentação API renderizada |
| [**MCP**](./protocols.md) | Revê e usa o servidor MCP derivado da especificação |
| [**Servidor de simulação**](./mock-server.md) | Executa uma simulação local durante o desenvolvimento da API |
| [**Modelo de dados**](./data-model.md) | Derive tabelas e relações, compare com a base e gere SQL |
| [**Ajustes**](./settings.md) | Tema, idioma, proxy, certificados, preferências do espaço |

## Como colabora com o assistente

Descreve a intenção em linguagem natural, o assistente escolhe a capacidade adequada, o motor determinista valida, e você aprova por um cartão. O modelo nunca edita por si só o documento.

- As mudanças de especificação chegam como **cartões de patch** com operações finas. Ao editar uma operação existente só mudam os campos pedidos.
- As tarefas de só leitura — listar operações, obter um esquema, executar uma consulta — devolvem os factos em que o assistente baseia a sua resposta.
- As ações de escrita pedem confirmação antes de executar.

O modelo **configura-o você**. Aponte a app a qualquer fornecedor compatível com OpenAI e escolha-o nos ajustes. Veja [IA e modelos](./ai-models.md).

## O que significa local-first para você

- **Os seus arquivos reais.** Abre, edita e salva arquivos reais em disco e segue as mudanças locais.
- **Sem muro CORS.** As requisições passam por um processo local, não a WebView, por isso as restrições cross-origin não bloqueiam as chamadas.
- **Instruções e chaves privadas.** Processadas localmente, não aparecem no painel de rede do navegador.
- **Funciona sem conexão.** Projeto, simulação e documentação não precisam de rede; só requisições reais, sincronização Git e modelos hospedados.
- **Ambientes executados localmente.** Simulações, executor de cenários, acesso à base e terminal correm na sua máquina.

## Licença de desktop

O cliente de desktop vende-se como **licença perpétua após compra única**. Compra-se uma vez, possui-se para sempre, funciona por completo sem conexão e não precisa de conta. A chave é gerada na compra e mostrada uma só vez. Distingue-se de Powerduck Cloud, o serviço de alojamento com subscrição mensal. Veja [Faturação da Cloud](../cloud/billing.md).

## Comece aqui

- [Desenhar com o assistente](./design.md)
- [Espaço de requisição e ambientes](./debug.md)
- [Testes de cenário e relatórios](./scenario-testing.md)
- [Protocolos](./protocols.md)
- [Modelo de dados e diagrama ER](./data-model.md)
- [Servidor de simulação](./mock-server.md)
- [IA e modelos](./ai-models.md)
- [Ajustes](./settings.md)
