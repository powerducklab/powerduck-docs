---
sidebar_position: 4
title: Operaciones expuestas
description: "Elija las operaciones a hacer públicas sin cambiar el documento original. Agrupe por tags, busque y alterne individualmente o por lotes."
---

# Operaciones expuestas

No toda operación de una spec debe ser pública. Las interfaces de administración, herramientas internas y borradores suelen permanecer en la spec mientras se ocultan de la documentación y MCP públicos. La configuración de exposición hace esta elección explícita y **no modifica el documento original**.

## Cómo funciona

La configuración de exposición se guarda aparte de la spec; cada entrada referencia una operación y recuerda el estado activo.

- Se usa la `operationId` cuando existe.
- También se guardan `method` y `path` para specs sin identificador y para validación.

El archivo original permanece inalterado. La documentación y MCP se generan desde la spec y las operaciones activas: desactivar una operación la excluye de la superficie pública sin borrarla del archivo.

## El espacio de exposición

El modo de operaciones está construido para specs grandes.

- **Búsqueda** — acotar operaciones por método, ruta, resumen o tag.
- **Agrupación por tag** — agrupadas por tag principal, sin tag = sin clasificar.
- **Alternar individual** — activar/desactivar una operación.
- **Lote por grupo** — activar/desactivar todas las operaciones de un grupo de tag a la vez.
- **Seleccionar todo (filtrado)** — la casilla global actúa sobre los resultados de búsqueda actuales.

Cada operación es una fila, y el estado activo permanece claro aunque tenga varios tags.

## Valores por defecto prácticos

El camino simple es empezar con todas activas y desactivar lo no deseado.

- Interfaces internas/admin (gestión de usuarios o comprobaciones internas de salud).
- Operaciones aún en borrador.
- Interfaces solo para depuración local.

La elección es independiente del archivo y puede ajustarse con el desarrollo de la API sin editar la propia spec.

## Interacción exposición/publicación

La exposición define **qué operaciones aparecen**; otros controles, **si el documento es alcanzable en absoluto**.

- El documento debe estar `ACTIVE`.
- Cada modo tiene su indicador activo para documentación y MCP.
- Acceso protegible por contraseña (documentación) o clave de acceso (MCP).

El conjunto completo de puertas está en [Control de acceso](./access-control.md).

## Límites por plan

Los planes limitan el número de operaciones expuestas.

- **Free** — hasta 10.
- **Pro** — hasta 1.000.
- **Team** — hasta 10.000.

Vea también: [Control de acceso](./access-control.md)、[Documentos y versiones](./documents-versions.md).
