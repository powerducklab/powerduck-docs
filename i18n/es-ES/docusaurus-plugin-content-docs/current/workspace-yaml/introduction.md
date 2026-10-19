---
sidebar_position: 1
title: "Introducción"
description: "Inicializa archivos workspace.yaml y YAML de OpenAPI 3.2 de forma fiable. Compatible con el navegador: funciones puras que generan cadenas de contenido YAML, sin acceso al sistema de archivos. En Node.js / Electron, añade escrituras atómicas, bloqueo de archivos y normalización de rutas a la capa principal."
keywords: ["workspace-yaml", "powerduck", "YAML", "OpenAPI"]
---

# @powerduck/workspace-yaml

Inicializa archivos workspace.yaml y YAML de OpenAPI 3.2 de forma fiable.

Arquitectura de dos capas:
- **Capa principal**: Compatible con el navegador: funciones puras que generan cadenas de contenido YAML, sin acceso al sistema de archivos.
- **Capa de archivos**: En Node.js / Electron, añade escrituras atómicas, bloqueo de archivos y normalización de rutas a la capa principal.

- **Nombre del paquete:** `@powerduck/workspace-yaml`
- **Versión:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **Licencia:** MIT

Esta biblioteca **solo inicializa archivos**, para los casos de creación de archivos nuevos o creación manual. **No** vuelve a implementar la lectura, la aplicación de parches ni la actualización de archivos YAML. Para esas operaciones, utiliza [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## Siguientes pasos

- [Instalación](/docs/es-ES/workspace-yaml/installation/)
- [Inicio rápido](/docs/es-ES/workspace-yaml/quickstart/)
- [Referencia de la API](/docs/es-ES/workspace-yaml/api-reference/)
- [Ejemplos](/docs/es-ES/workspace-yaml/examples/)
