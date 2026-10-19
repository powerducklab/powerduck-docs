---
sidebar_position: 2
title: "Installation"
description: "Installieren Sie @powerduck/oas-document und die zugehörigen Peer-Abhängigkeiten."
---

# Installation

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## Peer-Abhängigkeiten

```bash
npm install react react-dom
```

## CSS importieren

```tsx
import "@powerduck/oas-document/react/index.css";
```

Die Komponente enthält ihre eigenen Stylesheets (CSS von tree und md-editor). Neben dem Paketeinstieg müssen keine weiteren CSS-Dateien importiert werden.

## Einstiegspunkte

| Import | Beschreibung |
|--------|-------------|
| `@powerduck/oas-document/react` | Komponente `<OasDocument />` und Hook `useOasDocument` |
| `@powerduck/oas-document` | Kern: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
