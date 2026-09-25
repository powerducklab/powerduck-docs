---
sidebar_position: 4
title: Testes de cenário e relatórios
description: "Vincule chamadas API ordenadas com passagem de dados e asserções, execute-as pela CLI local e exporte um relatório HTML independente em dez idiomas."
---

# Testes de cenário e relatórios

Uma requisição isolada só prova uma chamada individual. Um **teste de cenário** prova um fluxo de trabalho: uma sequência de requisições que passa valores de uma resposta à seguinte e verifica asserções em cada passo. O cenário captura os fluxos de ponta a ponta que antes viviam só na cabeça dos desenvolvedores.

## Construir um cenário

- **Passos ordenados**, cada um referenciando uma operação da spec.
- **Passagem de dados** entre passos — como o `id` de um recurso criado para a próxima requisição.
- **Asserções** sobre códigos de estado, cabeçalhos de resposta e campos de resposta.
- Valores que o leitor deve fornecer antes de executar.

A ordem e as asserções são de primeiro nível e não se abandonam em silêncio ao executar.

## Executar um cenário

O cenário roda no processo principal pelo motor `runScenario` de `@powerduck/openapi-cli`.

- `scenario:run` inicia a execução com cenário, spec e ajustes de requisição.
- O progresso transmite-se por `scenario:event` à medida que os passos avançam.
- `scenario:cancel` aborta uma execução em curso.

Observa cada passo, vê onde o fluxo falha e pode cancelar execuções longas.

## Como o assistente constrói cenários

O assistente não inventa definições de teste dentro da spec. Os cenários são fluxos do host independentes e **não se guardam no documento OpenAPI** — sem chave `x-scenarios`, sem passos embutidos.

Quando pede tanto desenho de operações como testes, o trabalho ordena-se.

1. O assistente propõe primeiro **só o patch de operações**.
2. Após aplicar, devolve um **cartão de ação** que executa o fluxo:
   - `test.single` para uma operação isolada.
   - `scenario.plan` para o host descobrir um fluxo de ponta a ponta.
   - `scenario.run` para preparar e executar o fluxo ordenado.

O cartão `scenario.run` lista as operações em ordem de execução (2 a 8), com os campos de resposta, cabeçalhos e estados passados a cada requisição seguinte, e descreve o objetivo. Cada referência copia-se da spec atual.

## Relatórios

Após executar, pode exportar um **relatório HTML independente**. Não a saída crua da CLI, mas um documento de resumo que mostra o fluxo, o resultado de cada passo, as asserções e o resultado final num layout legível.

Ao exportar, escolhe o idioma; dez estão integrados.

1. English
2. 简体中文 (Chinês simplificado)
3. 繁體中文 (Chinês tradicional)
4. 日本語 (Japonês)
5. 한국어 (Coreano)
6. Français (Francês)
7. Deutsch (Alemão)
8. Español (Espanhol)
9. Português — Brasil (Português — Brasil)
10. العربية (Árabe)

Uma opção **Outro/Personalizado** permite escrever o idioma diretamente.

O relatório é seguro de compartilhar.

- **As credenciais mascaram-se automaticamente**, por isso tokens e chaves não aparecem.
- **As cargas grandes dobram-se**, para manter o relatório legível em vez de descarregar tudo.

O HTML é independente: anexar a tickets ou arquivar por release.

## Quando usar cenários

- Testar fluxos de negócio de vários passos (criar, ler, atualizar, apagar).
- Confirmar que a autenticação e a passagem de tokens funcionam entre chamadas.
- Gerar evidência do comportamento da API para release ou entrega.
- Regressão de fluxo após mudança no contrato.

Veja também: [Espaço de requisição](/docs/client/debug)、[Desenhar com o assistente](/docs/client/design)、[Servidor de simulação](/docs/client/mock-server).
