---
sidebar_position: 2
title: "Installation"
description: "Installez @powerduck/schema-editor et ses dépendances homologues."
---

# Installation

```bash npm2yarn2pnpm
npm install @powerduck/schema-editor
```

## Dépendances homologues

```bash
npm install react react-dom monaco-editor @monaco-editor/react
```

## Points d’entrée

| Import | Description |
|--------|-------------|
| `@powerduck/schema-editor` | API principale : résolution des schémas, diagnostics et génération d’exemples |
| `@powerduck/schema-editor/react` | Composant React `<SchemaEditor />` |
| `@powerduck/schema-editor/core` | Noyau utilisable dans le navigateur, sans React |
