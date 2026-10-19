---
sidebar_position: 2
title: "Instalação"
description: "Instale @powerduck/oas-document e suas dependências pares."
---

# Instalação

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## Dependências pares

```bash
npm install react react-dom
```

## Importação de CSS

```tsx
import "@powerduck/oas-document/react/index.css";
```

O componente inclui suas próprias folhas de estilo (CSS de tree e de md-editor). Além da entrada do pacote, não é necessário importar CSS adicional.

## Pontos de entrada

| Importação | Descrição |
|--------|-------------|
| `@powerduck/oas-document/react` | Componente `<OasDocument />` e hook `useOasDocument` |
| `@powerduck/oas-document` | Núcleo: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
