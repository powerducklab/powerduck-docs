---
sidebar_position: 2
title: "Installation"
description: "Installieren Sie @powerduck/schema-editor und die zugehörigen Peer-Abhängigkeiten."
---

# Installation

```bash npm2yarn2pnpm
npm install @powerduck/schema-editor
```

## Peer-Abhängigkeiten

```bash
npm install react react-dom monaco-editor @monaco-editor/react
```

## Einstiegspunkte

| Import | Beschreibung |
|--------|-------------|
| `@powerduck/schema-editor` | Kern-API: Schemaauflösung, Diagnose und Beispielgenerierung |
| `@powerduck/schema-editor/react` | React-Komponente `<SchemaEditor />` |
| `@powerduck/schema-editor/core` | Browsergeeigneter Kern ohne React |
