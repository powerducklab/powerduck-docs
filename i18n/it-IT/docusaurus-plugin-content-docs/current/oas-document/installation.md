---
sidebar_position: 2
title: "Installazione"
description: "Installa @powerduck/oas-document e le relative dipendenze peer."
---

# Installazione

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## Dipendenze peer

```bash
npm install react react-dom
```

## Importazione del CSS

```tsx
import "@powerduck/oas-document/react/index.css";
```

Il componente include i propri fogli di stile (CSS di tree e di md-editor). Non è necessario importare altro CSS oltre a quello del punto di ingresso del pacchetto.

## Punti di ingresso

| Importazione | Descrizione |
|--------|-------------|
| `@powerduck/oas-document/react` | Componente `<OasDocument />` e hook `useOasDocument` |
| `@powerduck/oas-document` | Nucleo: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
