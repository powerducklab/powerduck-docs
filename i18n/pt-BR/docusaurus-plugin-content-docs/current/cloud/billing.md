---
sidebar_position: 7
title: Faturação
description: "Entenda as diferenças entre a licença perpétua de desktop, o plano gratuito do Cloud e as assinaturas pagas, incluindo limites, permissões e formas de pagamento."
---

# Faturação

Powerduck tem dois modelos de compra separados que não se misturam.

| | Cliente de desktop | Powerduck Cloud |
|---|---|---|
| Compra | Única | Plano gratuito ou assinatura paga |
| Recebe | Chave de licença perpétua | Assinatura hospedada |
| Validade | Nenhuma | Acesso gratuito ou período de cobrança pago |
| Mostrado após comprar | Chave uma vez | Sem chave |

## Licença de desktop

O cliente de desktop vende-se como licença perpétua de compra única.

- Ao comprar, a chave gera-se e mostra-se **uma vez**.
- A chave guarda-se como hash SHA-256, por isso a base não pode reconstruir o original, e só ficam os últimos quatro caracteres.
- Estados: `ISSUED`, `ACTIVE`, `SUSPENDED`, `REVOKED`. Perpétuo não significa impossível de revogar.
- A chave vincula-se a uma organização e a ativação tem limite de taxa.

Isto permanece totalmente separado da assinatura da Cloud: comprar uma assinatura da Cloud não gera uma chave de licença.

## Assinatura da Cloud

O Cloud oferece um **plano Free** com hospedagem de documentação e MCP, além de assinaturas pagas. O Pro inclui limites maiores, fontes Git e domínios personalizados; o Team permite vários membros. Não é necessária uma chave de licença.

- **Pro** — 19 $/mês.
- **Team** — 49 $/mês.
- **Free** — 0 $, com limites.

A assinatura tem períodos e renova-se no fim do período atual.

### Planos e autorizações

As capacidades decidem-se por **autorizações**, não comparando códigos de plano.

| Autorização | Free | Pro | Team |
|---|---|---|---|
| Hospedagem de documentos | Sim | Sim | Sim |
| MCP | Sim | Sim | Sim |
| Fonte Git | Não | Sim | Sim |
| Domínio personalizado | Não | Sim | Sim |
| Máx. documentos | 3 | 100 | 1,000 |
| Máx. versões/documento | 20 | 200 | 1,000 |
| Máx. operações expostas | 10 | 1.000 | 10.000 |
| Máx. tamanho do upload | 1 MiB | 10 MiB | 50 MiB |
| Máx. membros | 1 | 1 | 10 |

## Fornecedor de pagamento

A rota de pagamento escolhe-se por região.

- China continental, Hong Kong, Sudeste Asiático — **Antom**.
- Europa/América, Japão, Coreia — **Paddle**.
- Se falha a deteção, respaldo com **Antom**.

Ambos os fornecedores não aparecem ao mesmo tempo ao pagar; Paddle fica como respaldo para troca rápida em emergência.

### Fluxo de pagamento

1. Escolher plano e iniciar o pagamento.
2. Redirecionar ao fornecedor.
3. Voltar após o pagamento: a página de retorno verifica o estado do pedido.
4. Um webhook confirma o pagamento e ativa a assinatura.

Os pedidos tratam-se de forma **idempotente**, para que o mesmo pagamento não se aplique duas vezes.

## Ciclo de vida da assinatura

- **Upgrade** — efeito imediato; a diferença rateada calcula-se segundo o valor restante do período.
- **Downgrade** — efeito no fim do período atual (assinalado antes).
- **Cancelar** — caduca no fim do período; o cancelamento passa por confirmações repetidas com alternativas.
- **Validade** — volta aos limites Free após o fim do período.

Cancelar não tira o acesso logo; conserva o serviço até ao fim do período.

## Pedidos e assinatura

A página de faturação separa ambos.

- **Assinatura/assinatura** — plano atual, estado, fim do período, renovação.
- **Pedidos** — compras passadas e histórico de pagamento.

## Verificação de autorização

Como qualquer recurso hospedado, os pagamentos e subscrições pertencem a uma **Organização** e consultam-se com âmbito de organização, por isso um utilizador com outro ID de organização não pode ler os pedidos doutra equipe.

Veja também: [Introdução à Cloud](./introduction.md), [Domínios personalizados](./custom-domains.md).
