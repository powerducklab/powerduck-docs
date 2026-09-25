---
sidebar_position: 3
title: Espaço de requisição e ambientes
description: "Envie requisições reais em separadores, gira variáveis entre âmbitos e entenda a relação entre os ambientes personalizados e os servers declarados no documento OpenAPI."
---

# Espaço de requisição e ambientes

O espaço de requisição é onde as operações desenhadas se tornam chamadas reais. Envia requisições pelo processo principal local, mostra respostas e gere valores que mudam em cada execução com ambientes e variáveis.

## Enviar uma requisição

1. Abra uma operação no espaço de requisição. Método, rota, parâmetros, cabeçalhos e corpo vêm da spec.
2. Complete valores que exigem entrada concreta, como parâmetros de rota ou um token.
3. Envie. O separador mostra código de estado, cabeçalhos de resposta, corpo e duração.
4. Mantenha várias requisições em **separadores** para comparação ou reverificação.

A execução ocorre no processo principal, não a WebView: as restrições CORS diretas do navegador não bloqueiam as chamadas, e os detalhes não se expõem pelo painel de rede do navegador.

## Ambientes versus servers OAS

Estão relacionados mas são distintos; entender a diferença elimina uma fonte frequente de confusão.

| | Ambientes personalizados | `servers` OAS |
|---|---|---|
| Localização | Ajustes locais da app | No documento OpenAPI |
| Modificáveis pela ferramenta | Sim | Não — por patch de spec |
| Uso | URL base por defeito de novos separadores e execuções | URLs base declaradas pelo próprio contrato |
| Compartilhados com documentação | Não | Sim |

Quando o assistente lista URLs base (`env.listServers`), devolve primeiro os ambientes personalizados utilizáveis, depois os servers de só leitura declarados no documento atual.

- **Adicionar/escolher URL base local** cria e ativa um ambiente personalizado (`env.upsertServer`, `env.selectServer`); não edita o documento.
- **Mudar servers no contrato** propõe em vez disso um patch de spec.

Isto mantém as URLs de depuração pessoais fora do contrato, enquanto os servers declarados também impulsionam requisições.

## Variáveis

As variáveis gerem-se em quatro âmbitos.

- **globals** — disponíveis em todas as coleções.
- **collection** — aplicam a uma coleção.
- **environment** — ligadas ao ambiente atual; sem server concreto, a todos os servers.
- **local** — só para a sessão local.

O assistente lista variáveis (`env.listVariables`, filtráveis por âmbito) e cria ou atualiza (`env.setVariable`, upsert por nome e âmbito). Uma variável pode ligar-se a um server concreto e tem o seu próprio estado ativo. A configuração de variáveis é uma ação da app, não uma mudança de documento.

É habitual colocar tokens de acesso, IDs reutilizados entre chamadas ou bandeiras de funcionalidade como variáveis.

## Quando não há URL base

Uma requisição precisa de uma URL completa. Se nem os `servers` da spec nem o ambiente atual fornecem URL base, a app não adivinha: pede introduzi-la antes de executar. Melhor que chamar em silêncio o host errado.

## Da requisição única ao fluxo

Uma vez que uma chamada isolada funciona, o passo natural é encadear para passar um valor de resposta à próxima requisição. Esse é o papel dos [testes de cenário](/docs/client/scenario-testing).

Veja também: [Desenhar com o assistente](/docs/client/design)、[Testes de cenário](/docs/client/scenario-testing)、[Ajustes](/docs/client/settings).
