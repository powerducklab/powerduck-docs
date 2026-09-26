---
sidebar_position: 7
title: Faturação
description: "A nuvem é uma subscrição mensal e o desktop uma licença perpétua de compra única. Entenda planos e autorizações, a escolha do fornecedor de pagamento e o ciclo de vida da subscrição."
---

# Faturação

Powerduck tem dois modelos de compra separados que não se misturam.

| | Cliente de desktop | Powerduck Cloud |
|---|---|---|
| Compra | Única | Subscrição mensal |
| Recebe | Chave de licença perpétua | Membresia hospedada |
| Caducidade | Nenhuma | Renovação no fim do período |
| Mostrado após comprar | Chave uma vez | Sem chave |

## Licença de desktop

O cliente de desktop vende-se como licença perpétua de compra única.

- Ao comprar, a chave gera-se e mostra-se **uma vez**.
- A chave guarda-se como hash SHA-256, por isso a base não pode reconstruir o original, e só ficam os últimos quatro caracteres.
- Estados: `ISSUED`, `ACTIVE`, `SUSPENDED`, `REVOKED`. Perpétuo não significa impossível de revogar.
- A chave vincula-se a uma organização e a ativação tem limite de taxa.

Isto permanece totalmente separado da subscrição da Cloud: comprar uma subscrição da Cloud não gera uma chave de licença.

## Subscrição da Cloud

A nuvem é um serviço de alojamento com subscrição mensal.

- **Pro** — 19 $/mês.
- **Team** — 49 $/mês.
- **Free** — 0 $, com limites.

A subscrição tem períodos e renova-se no fim do período atual.

### Planos e autorizações

As capacidades decidem-se por **autorizações**, não comparando códigos de plano.

| Autorização | Free | Pro | Team |
|---|---|---|---|
| Alojamento de documentos | Sim | Sim | Sim |
| Fonte Git | Não | Sim | Sim |
| Domínio personalizado | Não | Sim | Sim |
| Máx. documentos | 3 | 20 | 100 |
| Máx. versões/documento | 3 | 100 | 500 |
| Máx. operações expostas | 10 | 1.000 | 10.000 |
| Máx. tamanho de subida | 1 MB | 10 MB | 50 MB |

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
4. Um webhook confirma o pagamento e ativa a subscrição.

Os pedidos tratam-se de forma **idempotente**, para que o mesmo pagamento não se aplique duas vezes.

## Ciclo de vida da subscrição

- **Upgrade** — efeito imediato; a diferença rateada calcula-se segundo o valor restante do período.
- **Downgrade** — efeito no fim do período atual (assinalado antes).
- **Cancelar** — caduca no fim do período; o cancelamento passa por confirmações repetidas com alternativas.
- **Caducidade** — volta aos limites Free após o fim do período.

Cancelar não tira o acesso logo; conserva o serviço até ao fim do período.

## Pedidos e membresia

A página de faturação separa ambos.

- **Membresia/subscrição** — plano atual, estado, fim do período, renovação.
- **Pedidos** — compras passadas e histórico de pagamento.

## Verificação de autorização

Como qualquer recurso hospedado, os pagamentos e subscrições pertencem a uma **Organização** e consultam-se com âmbito de organização, por isso um utilizador com outro ID de organização não pode ler os pedidos doutra equipe.

Veja também: [Introdução à Cloud](./introduction.md)、[Domínios personalizados](./custom-domains.md).
