---
sidebar_position: 2
title: "Installazione"
description: "Installa @powerduck/schema-editor e le relative dipendenze peer."
---

# Installazione

```bash npm2yarn2pnpm
npm install @powerduck/schema-editor
```

## Dipendenze peer

```bash
npm install react react-dom monaco-editor @monaco-editor/react
```

## Punti di ingresso

| Importazione | Descrizione |
|--------|-------------|
| `@powerduck/schema-editor` | API principale: risoluzione degli schemi, diagnostica e generazione di esempi |
| `@powerduck/schema-editor/react` | Componente React `<SchemaEditor />` |
| `@powerduck/schema-editor/core` | Nucleo compatibile con il browser, senza React |
