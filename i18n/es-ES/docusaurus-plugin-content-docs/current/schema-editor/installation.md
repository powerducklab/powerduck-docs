---
sidebar_position: 2
title: "Instalación"
description: "Instala @powerduck/schema-editor y sus dependencias de pares."
---

# Instalación

```bash npm2yarn2pnpm
npm install @powerduck/schema-editor
```

## Dependencias de pares

```bash
npm install react react-dom monaco-editor @monaco-editor/react
```

## Puntos de entrada

| Importación | Descripción |
|--------|-------------|
| `@powerduck/schema-editor` | API principal: resolución de esquemas, diagnósticos y generación de ejemplos |
| `@powerduck/schema-editor/react` | Componente React `<SchemaEditor />` |
| `@powerduck/schema-editor/core` | Núcleo compatible con el navegador, sin React |
