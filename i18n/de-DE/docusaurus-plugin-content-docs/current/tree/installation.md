---
sidebar_position: 2
title: "Installation"
description: "Installieren Sie @powerduck/tree und die zugehörigen Peer-Abhängigkeiten."
---

# Installation

```bash npm2yarn2pnpm
npm install @powerduck/tree
```

## Peer-Abhängigkeiten

```bash
npm install react react-dom react-icons
```

## CSS importieren

```tsx
import "@powerduck/tree/react/index.css";
```

## Einstiegspunkte

| Import | Beschreibung |
|--------|-------------|
| `@powerduck/tree` | Kerntypen, Hilfsfunktionen und alle Adapter |
| `@powerduck/tree/react` | React-Komponente Tree und Hooks |
| `@powerduck/tree/adapters` | Adapter für OpenAPI, JSON Schema und Dokumentation |
| `@powerduck/tree/core` | Nur Kerntypen und Hilfsfunktionen |
