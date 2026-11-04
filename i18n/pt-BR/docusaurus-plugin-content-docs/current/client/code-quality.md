---
sidebar_position: 10
title: "Revisão de código"
description: "Powerduck ajuda a entender mudanças geradas por IA, ler seu contexto e decidir o que precisa de atenção. Abra o espaço de API ou a revisão de código separadamente pela página inicial do aplicativo desktop."
---

# Revisão de código

A escolha da pasta abre a estrutura. Leia arquivos completos nos modos somente fonte, comparação completa ou somente alterações. Linhas adicionadas/removidas, destaques de caracteres, navegação e busca localizam a edição.

## Comparação e histórico de rodadas

A rodada atual compara seu início salvo com o disco. A primeira abertura estabelece o início sem classificar tudo como novo. Alterações não commitadas são comparadas ao Git HEAD. Inicie novas rodadas explicitamente e veja as anteriores no histórico local, que não substitui Git. Salve os arquivos primeiro.

## Estrutura e código relacionado

Git e parsers identificam blocos e definições, chamadores e imports resolvidos. Passe o mouse em símbolos compatíveis para ver definições; abra código relacionado junto à mudança. A estrutura destaca muitas referências, nomes temporários, conteúdo idêntico e ausência de referências de entrada resolvidas. Carga dinâmica e usos externos podem faltar; sem referências não significa seguro para excluir.

## Revisão IA no código

A revisão IA é iniciada por você e usa lotes de diferenças com contexto limitado, não todos os arquivos completos. Pode reutilizar cache correspondente. Prioridade, evidência e recomendação aparecem no código. Confirme o problema, marque falso positivo ou selecione para Agent. A IA pode errar e não comprova correção ou testes executados.

## Pacotes de tarefas Agent

Selecione dúvidas e visualize, copie ou baixe Markdown com código e âncoras de revisão. O Agent deve avaliar independentemente; permissão para modificar é explícita. O relatório JSON exige conferência humana. Alegar reparo não comprova teste aprovado. Exportar não inicia nem contata outro Agent automaticamente.

## Executar verificações

Execute comandos explicitamente apenas em projetos confiáveis e examine comando, código de saída e saída bruta. Script ausente é não verificado. Leitura, análise estática e IA não são provas de execução; lido registra apenas progresso.

## IA integrada e uso

Entre com Google ou GitHub. O modelo é integrado, sem seletor, chaves próprias ou endpoints personalizados. Trabalho IA solicitado envia contexto escolhido aos provedores gerenciados. Caminhos comuns de dependências, build e credenciais são excluídos, mas ainda pode haver segredos no código.

- [Espaço de API](introduction.md)
- [Revisão de código](code-quality.md)
- [IA integrada e uso](ai-models.md)
- [Planos e tarefas](../cloud/billing.md)
- [Instalar e começar](../overview/installation.md)
- [Entenda cada alteração](../overview/quickstart.md)
