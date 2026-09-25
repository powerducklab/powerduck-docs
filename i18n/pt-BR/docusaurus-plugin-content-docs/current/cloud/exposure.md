---
sidebar_position: 4
title: Operações expostas
description: "Escolha as operações a fazer públicas sem mudar o documento original. Agrupe por tags, busque e alterne individualmente ou por lotes."
---

# Operações expostas

Nem toda operação duma spec deve ser pública. As interfaces de administração, ferramentas internas e rascunhos costumam permanecer na spec enquanto se ocultam da documentação e MCP públicos. A configuração de exposição torna esta escolha explícita e **não modifica o documento original**.

## Como funciona

A configuração de exposição guarda-se à parte da spec; cada entrada referencia uma operação e lembra o estado ativo.

- Usa-se a `operationId` quando existe.
- Também se guardam `method` e `path` para specs sem identificador e para validação.

O arquivo original permanece inalterado. A documentação e MCP geram-se desde a spec e as operações ativas: desativar uma operação exclui-a da superfície pública sem apagá-la do arquivo.

## O espaço de exposição

O modo de operações está construído para specs grandes.

- **Busca** — acotar operações por método, rota, resumo ou tag.
- **Agrupamento por tag** — agrupadas por tag principal, sem tag = sem classificar.
- **Alternar individual** — ativar/desativar uma operação.
- **Lote por grupo** — ativar/desativar todas as operações dum grupo de tag de uma vez.
- **Selecionar tudo (filtrado)** — a caixa global atua sobre os resultados de busca atuais.

Cada operação é uma fila, e o estado ativo permanece claro mesmo que tenha vários tags.

## Valores por defeito práticos

O caminho simples é começar com todas ativas e desativar o indesejado.

- Interfaces internas/admin (gestão de utilizadores ou verificações internas de saúde).
- Operações ainda em rascunho.
- Interfaces só para depuração local.

A escolha é independente do arquivo e pode ajustar-se com o desenvolvimento da API sem editar a própria spec.

## Interação exposição/publicação

A exposição define **que operações aparecem**; outros controlos, **se o documento é alcançável em absoluto**.

- O documento deve estar `ACTIVE`.
- Cada modo tem o seu indicador ativo para documentação e MCP.
- Acesso protegível por senha (documentação) ou chave de acesso (MCP).

O conjunto completo de portas está em [Controlo de acesso](./access-control).

## Limites por plano

Os planos limitam o número de operações expostas.

- **Free** — até 10.
- **Pro** — até 1.000.
- **Team** — até 10.000.

Veja também: [Controlo de acesso](./access-control)、[Documentos e versões](./documents-versions).
