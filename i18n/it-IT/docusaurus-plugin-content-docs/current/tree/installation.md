---
sidebar_position: 2
title: "Installazione"
description: "Installa @powerduck/tree e le relative dipendenze peer."
---

# Installazione

```bash npm2yarn2pnpm
npm install @powerduck/tree
```

## Dipendenze peer

```bash
npm install react react-dom react-icons
```

## Importazione del CSS

```tsx
import "@powerduck/tree/react/index.css";
```

## Punti di ingresso

| Importazione | Descrizione |
|--------|-------------|
| `@powerduck/tree` | Tipi di base, utilità e tutti gli adattatori |
| `@powerduck/tree/react` | Componente Tree per React e hook |
| `@powerduck/tree/adapters` | Adattatori per OpenAPI, JSON Schema e documentazione |
| `@powerduck/tree/core` | Solo tipi di base e utilità |
