---
sidebar_position: 2
title: Diseñar con el asistente
description: "Diseñe OpenAPI mediante un asistente conversacional. Los cambios llegan como tarjetas de parche revisables con operaciones JSON Patch finas. La edición enfocada preserva el resto de la operación."
---

# Diseñar con el asistente

El modo spec es donde diseña la API. Vincula el chat de IA con el documento en vivo y la vista previa, para que describa la intención en lenguaje natural manteniendo el control total de los cambios reales.

## El bucle de aprobación

El modelo no edita directamente el documento. Este bucle es deliberadamente explícito.

```text
you describe an intent
        |
the model reads current state and proposes operations
        |
the host validates the proposal
        |
you review a patch card and Apply or Reject
        |
the change is merged into the document
```

Esta separación es una decisión central de diseño. El **modelo** destaca en entender la intención y proponer estructuras, el **host** es determinista y valida cada operación, y **usted** aprueba cada cambio. Una propuesta nunca se considera aplicada antes de que confirme.

## La tarjeta de parche

La tarjeta resume el cambio y lista las operaciones precisas, como añadir una ruta.

```json
{
  "type": "patch",
  "summary": "Add GET /products endpoint",
  "ops": [
    { "op": "add", "path": ["paths", "/products"], "value": { "get": {} } }
  ],
  "affects": { "paths": ["/paths/~1products"], "resources": ["Product"] }
}
```

Los segmentos de ruta son elementos de array, no cadenas JSON Pointer. Al añadir una ruta totalmente nueva, el destino es `["paths", "/products"]` y los contenedores padres se crean automáticamente.

### Ediciones finas sobre una operación existente

Al editar una operación existente, el asistente no reenvía la operación entera — eso borraría todos los campos no repetidos. En su lugar genera pequeñas operaciones que entran en la operación y solo tocan lo que cambia.

- Añadir un parámetro de consulta:

```json
{ "op": "add", "path": ["paths", "/products", "get", "parameters", "-"], "value": {} }
```

- Extender el esquema de respuesta:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "responses", "200", "content", "application/json", "schema", "properties", "total"], "value": { "type": "integer" } }
```

- Cambiar un solo campo:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "summary"], "value": "..." }
```

Los arrays reciben añadidos mediante `"-"`, no un reenvío completo. Los parámetros se identifican por `(in, name)` para no duplicar los existentes. El host fusiona los valores propuestos en la operación actual y preserva todo lo omitido.

Esto hace que el afinado iterativo sea fiable: diga «añade el parámetro limit aquí» o «haz name obligatorio», y solo cambia ese campo, el resto de la operación permanece.

## Herramientas de lectura fundamentan cada propuesta

Antes de responder, el modelo puede llamar herramientas de solo lectura para obtener el estado exacto, no una suposición.

- `spec.overview` — título, versión, protocolos, contadores, tags, servers, seguridad.
- `spec.listOperations` — cada operación como `METHOD /path`, con resúmenes y tags.
- `spec.presentOperations` — renderiza una tarjeta de lista de solo lectura de todas las operaciones.
- `spec.getOperation` — definición completa de una operación y esquemas referenciados.
- `spec.getSchema` — un esquema de componente único, campos obligatorios y descripciones incluidos.

Cuando la forma completa de una operación no es visible, el modelo debe leerla antes de editar.

## Las peticiones amplias avanzan por pasos

Para una gran petición como «construye una API de comercio electrónico», el asistente no vuelca todo de una vez.

1. Primero hace **preguntas de aclaración** sobre decisiones clave.
2. Tras responder, propone **un parche enfocado cada vez**, cada tarjeta con 2 a 5 operaciones.
3. Solo continúa mientras la petición más reciente siga en el alcance de ese objetivo.

Una vez claro el alcance, el asistente produce también un `plan` de las operaciones a construir, para ver la forma del trabajo antes de los parches.

## Protección contra desviaciones

El host impone algunas reglas para mantener las operaciones alineadas.

- El **documento actual** es la autoridad. Si el documento no muestra algo, el modelo no asume que exista un parche previo.
- En modo foco solo cambian el destino activo (y los esquemas de componente explícitamente referenciados); sin cambios oportunistas sobre operaciones hermanas.
- Mencionar otro `METHOD /path` se trata como un cambio de operación intencional.
- Las propuestas aplicadas y rechazadas se siguen en el historial para no repetir parches existentes.

Cuando un detalle necesario no es visible, el asistente no lo inventa: hace una pregunta enfocada.

## Otras tarjetas

No toda respuesta es un parche.

- **Tarjetas de pregunta** piden elegir entre opciones.
- **Tarjetas de validación** informan controles de calidad con estados de paso, aviso y error.
- **Tarjetas de acción** aportan un siguiente paso concreto, como ejecutar un escenario o abrir un espacio.
- **Tarjetas de tabla de datos** presentan datos concretos de ejemplo/prueba para operaciones o esquemas.

Vea también: [Espacio de petición](/docs/client/debug)、[Pruebas de escenario](/docs/client/scenario-testing)、[IA y modelos](/docs/client/ai-models).
