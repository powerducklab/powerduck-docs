---
sidebar_position: 6
title: Modelo de dados e diagrama ER
description: "Derive tabelas, chaves estrangeiras, tabelas de relação N:M e SQL desde a API, compare com uma base real e siga o impacto por um diagrama ER visual."
---

# Modelo de dados e diagrama ER

O modo de modelo de dados fecha a lacuna entre o contrato de API e a base de dados. A partir dos esquemas OpenAPI deriva um modelo relacional completo, compara-o com uma base existente e sincroniza ambos ao mudar — tudo num diagrama ER visual.

Há dois pontos de partida, ambos suportados.

- **Sem tabelas ainda.** Derive diretamente das APIs atuais cada tabela, campo, chave estrangeira, tabela de relação e o SQL para criá-las.
- **Já existe uma base.** Leia as tabelas reais e chaves estrangeiras aplicadas, compare com o modelo implícito da API e veja onde coincide e difere.

## A reconciliação de quatro camadas

A reconciliação (`datamodel.reconcile`) oferece uma vista autoritativa sobre quatro camadas.

| Camada | Conteúdo |
|---|---|
| **Observado** | Tabelas órfãs da base conectada, chaves estrangeiras presentes/aplicadas só na base |
| **Modelado** | Estado de cada tabela (`missing`, `drift`, `matched`, `extra`), pares de campos modelados/reais, diferenças a nível de campo, operações API afetadas, relações modeladas |
| **Proposto** | Plano de migração aditivo ordenado com dependências `blockedBy` e SQL por passo |
| **Inferido** | Tabelas de relação N:M inferidas automaticamente, perguntas de esclarecimento, salvaguardas |

O modelo fundamenta cada tabela, campo, relação e afirmação neste resultado e não inventa DDL.

### Estados de tabela

- **Missing** — implícita pela API, mas ausente na base.
- **Drift** — em ambos os lados, mas campos/restrições distintos.
- **Matched** — presente e alinhada.
- **Extra** — na base, mas não implícita pela API atual.

## Tabelas de relação e índices inferidos

Não tem de modelar tabelas de união à mão. Quando os esquemas sugerem N:M — por exemplo com recursos `user` e `product` — a camada **Inferido** não se detém nas duas tabelas base: deriva a tabela de relação que as conecta (e índices associados). Os índices secundários incluem-se no SQL gerado.

Quando a lógica de negócio não se infere com clareza, o resultado coloca uma pergunta em vez de adivinhar, e as salvaguardas marcam o que uma pessoa deve rever.

## Diagrama ER visual

A vista ER renderiza o modelo como grafo para mostrar relações e chaves estrangeiras de um relance, não lendo uma lista de tabelas.

- As tabelas são nós com um layout automático que reduz cruzes.
- As relações de chave estrangeira desenham-se como conexões.
- O estado do nó reflete o estado de reconciliação (faltante, desviada, coincidente, extra).
- Um painel lateral mostra passos concretos de migração — `create_table`, `alter_table`, verificações — e o SQL da tabela escolhida.

Assim obtém uma vista macro do esquema e uma rota precisa e ordenada para alinhar a base.

## Análise de impacto bidirecional

O modelo conhece tanto as operações API como as tabelas, por isso as mudanças propagam-se de forma visível.

- Se muda a **API**, a reconciliação identifica tabelas afetadas — existentes desviadas e novas a adicionar — e traz o SQL.
- Se muda a **base**, as operações que tocam tabelas afetadas mostram-se como elementos de impacto.

Em ambos os casos pode **atualizar e reconciliar de novo** após editar, até modelo e base coincidirem.

## Script de implantação

Para uma base nova, `datamodel.deploymentScript` gera um script SQL idempotente e só para a frente.

- `CREATE TABLE IF NOT EXISTS` em ordem de chaves estrangeiras.
- Índices secundários.
- Dados de exemplo deterministas opcionais (0–50 linhas, por defeito 0); tabelas de relação sem preencher.

Para uma base existente use a reconciliação, que traz `ALTER` aditivos pelo plano ordenado.

## Conexões de base

As conexões gerem-se por perfis guardados (id, nome, dialeto, host, porta, utilizador, base), e as palavras-passe não se devolvem. Dialetos suportados: **MySQL**, **SQL Server**, **Oracle**.

- `database.runSelect` executa um `SELECT` de só leitura por um perfil guardado e devolve linhas limitadas; bloqueia escritas e DDL.
- `database.prefillConnection` abre um novo diálogo de conexão preenchido com os dados fornecidos, para escrever a palavra-passe você em vez de passá-la no pedido.

## SQL gerado, nunca executado automaticamente

Neste modo o SQL **gera-se para revisão**, não se executa contra a base. Você decide quando e como aplicá-lo, e o acesso de só leitura protege os dados reais. Pode explorar e repetir o modelo com segurança antes de tocar a base.

Veja também: [Protocolos](/docs/client/protocols)、[Espaço de requisição](/docs/client/debug)、[Ajustes](/docs/client/settings).
