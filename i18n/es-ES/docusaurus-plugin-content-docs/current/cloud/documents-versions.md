---
sidebar_position: 3
title: Documentos y versiones
description: "Los documentos viven bajo proyectos con un ciclo de vida de estado claro. Cada cambio crea una nueva versión inmutable, y las fuentes comprenden subida y sincronización Git."
---

# Documentos y versiones

Un documento es la representación hospedada de una única API. Pertenece a un proyecto de la organización y acumula versiones a lo largo del tiempo en vez de sobrescribirse.

## La jerarquía

```text
Organization -> Project -> Document -> Versions
```

Un documento puede crearse directamente bajo la organización o en un proyecto y listarse por proyecto y organización.

## Ciclo de vida de estado

El documento pasa por cuatro estados.

| Estado | Significado | Servicio público |
|---|---|---|
| `ACTIVE` | En línea | Documentación y MCP servidos (según indicadores activos) |
| `PAUSED` | En pausa | Servicios públicos no disponibles |
| `ARCHIVED` | Conservado, pero no actual | No servido |
| `DELETED` | Eliminado de forma lógica | No servido |

Transiciones permitidas:

```text
pause:    ACTIVE  -> PAUSED
resume:   PAUSED  -> ACTIVE
archive:  ACTIVE / PAUSED -> ARCHIVED
restore:  ARCHIVED -> ACTIVE
delete:   ACTIVE / PAUSED / ARCHIVED -> DELETED
```

Pausar es la forma más rápida de sacar y reanudar; archivar conserva el historial pero no trata el documento como actual; eliminar es lógico, por lo que los datos centrales no se destruyen de inmediato.

## Las versiones son inmutables

Cuando cambia la spec, se añade una nueva versión; el original nunca se reemplaza.

```text
v1 -> v2 -> v3 -> v4
```

Cada versión registra:

- La **clave de almacenamiento** del archivo en el almacén de objetos.
- El valor **SHA-256**.
- Tipo de contenido, tamaño y fecha de creación.

Esto soporta historial, reversión, comparación y regeneración de documentación/MCP para una versión concreta.

### Enlaces actuales versus fijados por versión

- Los enlaces al documento **actual** siguen la versión más reciente.
- Los enlaces **fijados por versión** referencian una versión concreta y no cambian bajo el lector.

Use enlaces fijados cuando notas de versión o contratos exijan una referencia inmutable, y enlaces actuales cuando siempre se necesite lo último.

## Fuentes

El contenido proviene de una fuente, abstraída para que subida y Git no queden fijamente acopladas al modelo del documento.

- **Subida** — añadir un archivo directamente.
- **Git** — conectar un repositorio mediante URL, rama y ruta de archivo.

La fuente Git sigue la activación de sincronización y la última sincronización.

- **Conectar** con URL de repositorio y ruta de archivo (elección de rama).
- **Sincronizar** bajo demanda para obtener el contenido más reciente como nueva versión.

Los metadatos de la fuente permanecen con el documento, para saber siempre si proviene de subida o repositorio y ver la última sincronización.

## Almacenamiento

Los archivos reales viven en una disposición organización/documento/versión en el almacén de objetos, y la base de datos solo guarda metadatos (clave de almacenamiento, valor de comprobación, tipo de contenido, tamaño). Los archivos no son legibles públicamente por defecto en el almacén; el acceso público pasa por las rutas publicadas del documento.

## Por qué importa

La combinación de versiones inmutables y un ciclo de vida con borrado lógico permite iterar rápido sin perder historial y no exponer por descuido un documento que debe detenerse. Pausa para interrupción temporal, archivo para conservación a largo plazo, enlaces fijados cuando la inmutabilidad cuenta.

Vea también: [Operaciones expuestas](/docs/cloud/exposure)、[Control de acceso](/docs/cloud/access-control)、[Dominios personalizados](/docs/cloud/custom-domains).
