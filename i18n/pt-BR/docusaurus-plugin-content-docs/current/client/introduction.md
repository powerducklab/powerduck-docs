---
sidebar_position: 1
title: "Espaço de API · Revisão de código"
description: "Powerduck ajuda a entender mudanças geradas por IA, ler seu contexto e decidir o que precisa de atenção. Abra o espaço de API ou a revisão de código separadamente pela página inicial do aplicativo desktop."
---

# Espaço de API · Revisão de código

Powerduck ajuda a entender mudanças geradas por IA, ler seu contexto e decidir o que precisa de atenção. Abra o espaço de API ou a revisão de código separadamente pela página inicial do aplicativo desktop.

## Espaço de API

Importe OpenAPI YAML ou JSON para projetar operações, enviar requisições, inspecionar respostas e usar cenários, mocks locais, modelos de dados e documentação. MCP e publicação são fluxos separados. Importar não implanta seu backend.

## Revisão de código

A escolha da pasta abre a estrutura. Leia arquivos completos nos modos somente fonte, comparação completa ou somente alterações. Linhas adicionadas/removidas, destaques de caracteres, navegação e busca localizam a edição.

## Estrutura e código relacionado

Git e parsers identificam blocos e definições, chamadores e imports resolvidos. Passe o mouse em símbolos compatíveis para ver definições; abra código relacionado junto à mudança. A estrutura destaca muitas referências, nomes temporários, conteúdo idêntico e ausência de referências de entrada resolvidas. Carga dinâmica e usos externos podem faltar; sem referências não significa seguro para excluir.

## IA integrada e uso

Entre com Google ou GitHub. O modelo é integrado, sem seletor, chaves próprias ou endpoints personalizados. Trabalho IA solicitado envia contexto escolhido aos provedores gerenciados. Caminhos comuns de dependências, build e credenciais são excluídos, mas ainda pode haver segredos no código.

- [Espaço de API](introduction.md)
- [Revisão de código](code-quality.md)
- [IA integrada e uso](ai-models.md)
- [Planos e tarefas](../cloud/billing.md)
- [Instalar e começar](../overview/installation.md)
- [Entenda cada alteração](../overview/quickstart.md)
