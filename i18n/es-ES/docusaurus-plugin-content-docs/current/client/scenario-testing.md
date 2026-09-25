---
sidebar_position: 4
title: Pruebas de escenario e informes
description: "Vincule llamadas API ordenadas con paso de datos y aserciones, ejecútelas mediante la CLI local y exporte un informe HTML independiente en diez idiomas."
---

# Pruebas de escenario e informes

Una petición aislada solo prueba una llamada individual. Una **prueba de escenario** prueba un flujo de trabajo: una secuencia de peticiones que pasa valores de una respuesta a la siguiente y comprueba aserciones en cada paso. El escenario captura los flujos de extremo a extremo que antes vivían solo en la cabeza de los desarrolladores.

## Construir un escenario

- **Pasos ordenados**, cada uno referenciando una operación de la spec.
- **Paso de datos** entre pasos — como el `id` de un recurso creado para la siguiente petición.
- **Aserciones** sobre códigos de estado, cabeceras y campos de respuesta.
- Valores que el lector debe aportar antes de ejecutar.

El orden y las aserciones son de primer nivel y no se abandonan en silencio al ejecutar.

## Ejecutar un escenario

El escenario corre en el proceso principal mediante el motor `runScenario` de `@powerduck/openapi-cli`.

- `scenario:run` inicia la ejecución con escenario, spec y ajustes de petición.
- El progreso se transmite por `scenario:event` a medida que avanzan los pasos.
- `scenario:cancel` aborta una ejecución en curso.

Observa cada paso, ve dónde falla el flujo y puede cancelar ejecuciones largas.

## Cómo construye escenarios el asistente

El asistente no inventa definiciones de prueba dentro de la spec. Los escenarios son flujos del host independientes y **no se guardan en el documento OpenAPI** — sin clave `x-scenarios`, sin pasos embebidos.

Cuando pide tanto diseño de operaciones como pruebas, el trabajo se ordena.

1. El asistente propone primero **solo el parche de operaciones**.
2. Tras aplicarse, devuelve una **tarjeta de acción** que ejecuta el flujo:
   - `test.single` para una operación aislada.
   - `scenario.plan` para que el host descubra un flujo de extremo a extremo.
   - `scenario.run` para preparar y ejecutar el flujo ordenado.

La tarjeta `scenario.run` lista las operaciones en orden de ejecución (2 a 8), con los campos de respuesta, cabeceras y estados pasados a cada petición siguiente, y describe el objetivo. Cada referencia se copia de la spec actual.

## Informes

Tras ejecutar, puede exportar un **informe HTML independiente**. No la salida cruda de la CLI, sino un documento de resumen que muestra el flujo, el resultado de cada paso, las aserciones y el resultado final en un diseño legible.

Al exportar, elige el idioma; diez están integrados.

1. English
2. 简体中文 (Chino simplificado)
3. 繁體中文 (Chino tradicional)
4. 日本語 (Japonés)
5. 한국어 (Coreano)
6. Français (Francés)
7. Deutsch (Alemán)
8. Español (Español)
9. Português — Brasil (Portugués — Brasil)
10. العربية (Árabe)

Una opción **Otro/Personalizado** permite escribir el idioma directamente.

El informe es seguro de compartir.

- **Las credenciales se enmascaran automáticamente**, por lo que tokens y claves no aparecen.
- **Las cargas grandes se pliegan**, para mantener el informe legible en vez de volcarlo todo.

El HTML es independiente: adjuntar a incidencias o archivar por release.

## Cuándo usar escenarios

- Probar flujos de negocio de varios pasos (crear, leer, actualizar, eliminar).
- Confirmar que la autenticación y el paso de tokens funcionan entre llamadas.
- Generar evidencia del comportamiento de la API para release o entrega.
- Regresión de flujo tras cambios en el contrato.

Vea también: [Espacio de petición](/docs/client/debug)、[Diseñar con el asistente](/docs/client/design)、[Servidor de simulación](/docs/client/mock-server).
