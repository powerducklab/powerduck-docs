---
sidebar_position: 6
title: Modelo de datos y diagrama ER
description: "Derive tablas, claves foráneas, tablas de relación N:M y SQL desde la API, compare con una base real y siga el impacto mediante un diagrama ER visual."
---

# Modelo de datos y diagrama ER

El modo de modelo de datos cierra la brecha entre el contrato de API y la base de datos. A partir de los esquemas OpenAPI deriva un modelo relacional completo, lo compara con una base existente y sincroniza ambos al cambiar — todo en un diagrama ER visual.

Hay dos puntos de partida, ambos soportados.

- **Sin tablas aún.** Derive directamente desde las APIs actuales cada tabla, campo, clave foránea, tabla de relación y el SQL para crearlas.
- **Ya existe una base.** Lea las tablas reales y claves foráneas aplicadas, compare con el modelo implícito de la API y vea dónde coincide y difiere.

## La reconciliación de cuatro capas

La reconciliación (`datamodel.reconcile`) ofrece una vista autoritativa sobre cuatro capas.

| Capa | Contenido |
|---|---|
| **Observado** | Tablas huérfanas de la base conectada, claves foráneas presentes/aplicadas solo en la base |
| **Modelado** | Estado de cada tabla (`missing`, `drift`, `matched`, `extra`), pares de campos modelados/reales, diferencias a nivel de campo, operaciones API afectadas, relaciones modeladas |
| **Propuesto** | Plan de migración aditivo ordenado con dependencias `blockedBy` y SQL por paso |
| **Inferido** | Tablas de relación N:M inferidas automáticamente, preguntas de aclaración, salvaguardas |

El modelo fundamenta cada tabla, campo, relación y afirmación en este resultado y no inventa DDL.

### Estados de tabla

- **Missing** — implícita por la API, pero ausente en la base.
- **Drift** — en ambos lados, pero campos/restricciones distintos.
- **Matched** — presente y alineada.
- **Extra** — en la base, pero no implícita por la API actual.

## Tablas de relación e índices inferidos

No tiene que modelar tablas de unión a mano. Cuando los esquemas sugieren N:M — por ejemplo con recursos `user` y `product` — la capa **Inferido** no se detiene en las dos tablas base: deriva la tabla de relación que las conecta (e índices asociados). Los índices secundarios se incluyen en el SQL generado.

Cuando la lógica de negocio no se infiere con claridad, el resultado plantea una pregunta en vez de adivinar, y las salvaguardas marcan lo que debe revisar una persona.

## Diagrama ER visual

La vista ER renderiza el modelo como grafo para mostrar relaciones y claves foráneas de un vistazo, no leyendo una lista de tablas.

- Las tablas son nodos con un layout automático que reduce cruces.
- Las relaciones de clave foránea se dibujan como conexiones.
- El estado del nodo refleja el estado de reconciliación (faltante, desviada, coincidente, extra).
- Un panel lateral muestra pasos concretos de migración — `create_table`, `alter_table`, comprobaciones — y el SQL de la tabla elegida.

Así obtiene una vista macro del esquema y una ruta precisa y ordenada para alinear la base.

## Análisis de impacto bidireccional

El modelo conoce tanto las operaciones API como las tablas, por lo que los cambios se propagan de forma visible.

- Si cambia la **API**, la reconciliación identifica tablas afectadas — existentes desviadas y nuevas a añadir — y aporta el SQL.
- Si cambia la **base**, las operaciones que tocan tablas afectadas se muestran como elementos de impacto.

En ambos casos puede **actualizar y reconciliar de nuevo** tras editar, hasta que modelo y base coincidan.

## Script de despliegue

Para una base nueva, `datamodel.deploymentScript` genera un script SQL idempotente y solo hacia adelante.

- `CREATE TABLE IF NOT EXISTS` en orden de claves foráneas.
- Índices secundarios.
- Datos de ejemplo deterministas opcionales (0–50 filas, por defecto 0); tablas de relación sin rellenar.

Para una base existente use la reconciliación, que aporta `ALTER` aditivos mediante el plan ordenado.

## Conexiones de base

Las conexiones se gestionan mediante perfiles guardados (id, nombre, dialecto, host, puerto, usuario, base), y las contraseñas no se devuelven. Dialectos soportados: **MySQL**, **SQL Server**, **Oracle**.

- `database.runSelect` ejecuta un `SELECT` de solo lectura mediante un perfil guardado y devuelve filas limitadas; bloquea escrituras y DDL.
- `database.prefillConnection` abre un nuevo diálogo de conexión rellenado con los datos aportados, para que escriba la contraseña usted en vez de pasarla en la petición.

## SQL generado, nunca ejecutado automáticamente

En este modo el SQL se **genera para revisión**, no se ejecuta contra la base. Usted decide cuándo y cómo aplicarlo, y el acceso de solo lectura protege los datos reales. Puede explorar y repetir el modelo con seguridad antes de tocar la base.

Vea también: [Protocoles](./protocols)、[Espacio de petición](./debug)、[Ajustes](./settings).
