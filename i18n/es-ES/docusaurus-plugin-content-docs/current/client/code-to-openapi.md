---
title: "Generar OpenAPI a partir de un proyecto existente"
description: "Generar OpenAPI a partir de un proyecto existente"
---

# Generar OpenAPI a partir de un proyecto existente

En la aplicación de escritorio, elige **Analizar código para generar OpenAPI** (Beta), selecciona una carpeta de código local y pulsa **Iniciar análisis**. Empieza con un servicio pequeño. Revisa las rutas, los parámetros y las respuestas detectados antes de adoptar la especificación generada.

Un análisis estático puede dejar los esquemas de respuesta sin determinar cuando los manejadores dependen de código dinámico o de dependencias no disponibles. «Confirmar manualmente» registra tu revisión; no reconstruye los tipos que faltan. Edita el contrato API basándote en pruebas o pide, si lo deseas, que la IA revise el manejador seleccionado. Esta acción envía el código seleccionado y su contexto al proveedor de modelos configurado.

Guarda el resultado en un archivo nuevo. No sustituyas un contrato existente sin revisar los cambios. Después, ejecuta el [ejemplo de contrato](/docs/es-ES/client/contract-example/) contra un backend en funcionamiento o conecta un [agente de programación](/docs/es-ES/client/coding-agent/). Un análisis correcto no demuestra que la implementación respete el contrato.

Este flujo solo está disponible en escritorio; los lenguajes y frameworks compatibles dependen del analizador. El análisis estático no requiere una clave de modelo. Trata los resultados sin resolver como desconocidos, no como hechos deducidos.

[Descargar la aplicación de escritorio](https://www.powerduck.com/es/download/) · [Inicio rápido](https://www.powerduck.com/docs/es-ES/overview/quickstart/)
