---
sidebar_position: 2
title: "Instalación"
description: "Instala @powerduck/oas-document y sus dependencias de pares."
---

# Instalación

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## Dependencias de pares

```bash
npm install react react-dom
```

## Importar CSS

```tsx
import "@powerduck/oas-document/react/index.css";
```

El componente incluye sus propias hojas de estilo (CSS de tree y de md-editor). No hace falta importar más CSS aparte de la entrada del paquete.

## Puntos de entrada

| Importación | Descripción |
|--------|-------------|
| `@powerduck/oas-document/react` | Componente `<OasDocument />` y hook `useOasDocument` |
| `@powerduck/oas-document` | Núcleo: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
