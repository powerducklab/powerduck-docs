---
sidebar_position: 2
title: "Instalação"
description: "Instale @powerduck/schema-editor e suas dependências pares."
---

# Instalação

```bash npm2yarn2pnpm
npm install @powerduck/schema-editor
```

## Dependências pares

```bash
npm install react react-dom monaco-editor @monaco-editor/react
```

## Pontos de entrada

| Importação | Descrição |
|--------|-------------|
| `@powerduck/schema-editor` | API principal: resolução de esquemas, diagnósticos e geração de exemplos |
| `@powerduck/schema-editor/react` | Componente React `<SchemaEditor />` |
| `@powerduck/schema-editor/core` | Núcleo compatível com navegadores, sem React |
