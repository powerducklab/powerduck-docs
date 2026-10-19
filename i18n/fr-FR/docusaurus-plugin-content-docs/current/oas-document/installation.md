---
sidebar_position: 2
title: "Installation"
description: "Installez @powerduck/oas-document et ses dépendances homologues."
---

# Installation

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## Dépendances homologues

```bash
npm install react react-dom
```

## Import du CSS

```tsx
import "@powerduck/oas-document/react/index.css";
```

Le composant intègre ses propres feuilles de style (CSS de tree et de md-editor). Aucun import CSS supplémentaire n’est nécessaire en dehors du point d’entrée du paquet.

## Points d’entrée

| Import | Description |
|--------|-------------|
| `@powerduck/oas-document/react` | Composant `<OasDocument />` et hook `useOasDocument` |
| `@powerduck/oas-document` | Noyau: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
