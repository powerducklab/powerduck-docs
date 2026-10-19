---
sidebar_position: 1
title: "Introducción"
description: "Componente de documentación OpenAPI para React listo para producción. Pasa un documento OAS para obtener una interfaz de documentación API al estilo Stripe, con navegación en la cabecera, temas claro y oscuro, árbol de navegación, seguimiento del desplazamiento, exploración de esquemas y ejemplos de código en varios lenguajes."
keywords: ["oas-document", "powerduck", "React", "OpenAPI"]
---

# @powerduck/oas-document

Componente de documentación OpenAPI para React listo para producción. Pasa un documento OAS para obtener una interfaz de documentación API al estilo Stripe, con navegación en la cabecera, temas claro y oscuro, árbol de navegación, seguimiento del desplazamiento, exploración de esquemas y ejemplos de código en varios lenguajes.

- **Nombre del paquete:** `@powerduck/oas-document`
- **Versión:** <img src="https://img.shields.io/npm/v/@powerduck/oas-document"/>
- **Licencia:** MIT

Bibliotecas utilizadas: `@powerduck/openapi-parser` (validación y conversión automática), `@powerduck/tree` (navegación), `@powerduck/md-editor` (renderizado de Markdown), `@powerduck/openapi-codegen` (generación de código de solicitudes).

## Funciones

- **Documentación API lista para integrar** — Acepta un objeto analizado, una cadena JSON o una cadena YAML
- **Diseño al estilo Stripe** — Cabecera configurable, árbol lateral y vista de operaciones en dos columnas
- **Temas claro y oscuro** — Se cambian en la cabecera y se guardan en localStorage
- **Conversión automática a OAS 3.2** — Valida y convierte mediante `@powerduck/openapi-parser`
- **Navegación sincronizada con el desplazamiento** — Escuchador de desplazamiento pasivo con búsqueda binaria
- **renderizado de Markdown** — Descripciones renderizadas mediante `@powerduck/md-editor`
- **Ejemplos de código en varios lenguajes** — Generados mediante `@powerduck/openapi-codegen`
- **Exploración de esquemas** — Tablas de propiedades anidadas que se pueden expandir y contraer
- **Diseño adaptable** — La barra lateral se convierte en un panel superpuesto en móviles

## Siguientes pasos

- [Instalación](/docs/es-ES/oas-document/installation/)
- [Inicio rápido](/docs/es-ES/oas-document/quickstart/)
- [Referencia de la API](/docs/es-ES/oas-document/api-reference/)
- [Ejemplos](/docs/es-ES/oas-document/examples/)
