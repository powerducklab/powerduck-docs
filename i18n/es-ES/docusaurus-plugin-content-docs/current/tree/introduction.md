---
sidebar_position: 1
title: "Introducción"
description: "Componente de árbol extensible para navegar por API, explorar esquemas y mostrar documentación. Se basa en un núcleo genérico con adaptadores para OpenAPI, JSON Schema y fuentes de datos personalizadas."
keywords: ["tree", "powerduck", "React", "OpenAPI", "JSON Schema"]
---

# @powerduck/tree

Componente de árbol extensible para navegar por API, explorar esquemas y mostrar documentación. Se basa en un núcleo genérico con adaptadores para OpenAPI, JSON Schema y fuentes de datos personalizadas.

- **Nombre del paquete:** `@powerduck/tree`
- **Versión:** <img src="https://img.shields.io/npm/v/@powerduck/tree"/>
- **Licencia:** MIT

## Funciones

- **Núcleo genérico** — `TreeNode<TMetadata>` funciona con cualquier fuente de datos
- **Adaptador OpenAPI** — Navegación por etiquetas con etiquetas anidadas de OAS 3.2, `x-tagGroups`, `x-order`, `x-displayName` y `x-internal`
- **Adaptador JSON Schema** — Expansión en profundidad de propiedades anidadas, matrices y combinadores con metadatos `jsonPath`
- **Adaptador de documentación** — Árbol de documentación al estilo Stripe con indicadores del número de operaciones
- **Componente React** — Búsqueda, expansión y contracción, navegación por teclado, indicadores de métodos y props de renderizado personalizado
- **Arrastrar y soltar** — Reordenación dentro del mismo padre y movimiento a carpetas de otros niveles
- **Menú contextual** — Acciones por nodo mediante clic derecho o el botón de más opciones
- **Localización imperativa** — `locateNode(predicate)` encuentra un nodo, expande sus antecesores, lo selecciona y lo desplaza hasta el área visible
- **Integración con JSON Patch** — El callback `onPatch` emite operaciones RFC 6902
- **Temas mediante variables CSS** — Compatible con `tokens.css` de Powerduck y con los modos claro y oscuro

## Siguientes pasos

- [Instalación](/docs/es-ES/tree/installation/)
- [Inicio rápido](/docs/es-ES/tree/quickstart/)
- [Referencia de la API](/docs/es-ES/tree/api-reference/)
- [Ejemplos](/docs/es-ES/tree/examples/)
