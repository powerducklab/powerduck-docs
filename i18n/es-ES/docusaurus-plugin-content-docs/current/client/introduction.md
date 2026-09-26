---
sidebar_position: 1
title: Cliente de escritorio
description: "El cliente de escritorio Powerduck es un espacio de trabajo local-first impulsado por IA. Desde un único archivo OpenAPI en su máquina, diseñe APIs, depure peticiones, ejecute pruebas, simule APIs, publique documentación y exponga herramientas MCP."
---

# Cliente de escritorio

El cliente de escritorio es donde el flujo nativo para IA ocurre en su propia máquina. Abre el `openapi.yaml` de su repositorio, describe el resultado deseado y luego revisa. Sin cambiar entre editor de especificación, cliente HTTP, herramienta de simulación, generador de documentación y ejecutor de pruebas, y arranca sin cuenta en la nube.

Usted mantiene siempre el control: el asistente propone, usted aprueba.

## Un día en el espacio de trabajo

Estos son los momentos que el cliente sitúa en el centro.

- **Abrir la especificación y entender el conjunto.** El asistente lee el documento actual y propone de inmediato qué puede hacer: huecos que rellenar, documentación que completar, flujos que probar.
- **Construir la API.** Describa un recurso y el asistente propone las operaciones. Siga afinando la misma operación — añadir un parámetro, ajustar una respuesta, corregir un código de estado — y se queda en esa API sin alterar el resto del documento.
- **Preparar datos de prueba.** Genere datos de ejemplo realistas a partir de los esquemas para dar valores concretos a peticiones y escenarios.
- **Ejecutar una petición única o un escenario completo.** Depure una llamada aislada o encadene varias operaciones en un flujo de extremo a extremo, y reciba un informe compartible sobre qué pasa y falla.
- **Avanzar antes de que el backend esté listo.** Arranque una simulación local que responde según el contrato mientras se desarrolla el servicio real.
- **Pasar la API a un agente de programación.** Convierta la especificación en un servidor MCP para que las herramientas de IA descubran y llamen las operaciones correctas con los parámetros correctos.
- **Ver la base de datos detrás de la API.** Derive tablas, relaciones y SQL de la especificación, compare con una base real y entienda los cambios próximos.
- **Cambiar ajustes sin salir de la conversación.** Cambiar tema o idioma, configurar un proxy, gestionar variables de entorno con solo pedirlo.

## Cada modo y su uso

Un único documento impulsa todos los modos, accesibles mediante un selector compacto.

| Modo | Qué hace |
|---|---|
| [**Spec**](./design.md) | Modo principal: chat de IA, documento, vista previa en vivo |
| [**Espacio de petición**](./debug.md) | Envía e inspecciona peticiones HTTP reales; pestañas y entornos |
| [**Pruebas de escenario**](./scenario-testing.md) | Vincula operaciones en flujos, los ejecuta y produce un informe |
| [**Documentación**](./protocols.md) | Lee la especificación como documentación API renderizada |
| [**MCP**](./protocols.md) | Revisa y usa el servidor MCP derivado de la especificación |
| [**Servidor de simulación**](./mock-server.md) | Ejecuta una simulación local durante el desarrollo de la API |
| [**Modelo de datos**](./data-model.md) | Derive tablas y relaciones, compara con la base y genera SQL |
| [**Ajustes**](./settings.md) | Tema, idioma, proxy, certificados, preferencias del espacio |

## Cómo colabora con el asistente

Describe la intención en lenguaje natural, el asistente elige la capacidad adecuada, el motor determinista valida, y usted aprueba mediante una tarjeta. El modelo nunca edita por sí mismo el documento.

- Los cambios de especificación llegan como **tarjetas de parche** con operaciones finas. Al editar una operación existente solo cambian los campos pedidos.
- Las tareas de solo lectura — listar operaciones, obtener un esquema, ejecutar una consulta — devuelven los hechos en que el asistente basa su respuesta.
- Las acciones de escritura piden confirmación antes de ejecutarse.

El modelo **lo configura usted**. Apunte la app a cualquier proveedor compatible con OpenAI y elíjalo en los ajustes. Vea [IA y modelos](./ai-models.md).

## Qué significa local-first para usted

- **Sus archivos reales.** Abre, edita y guarda archivos reales en disco y sigue los cambios locales.
- **Sin muro CORS.** Las peticiones pasan por un proceso local, no la WebView, por lo que las restricciones de origen cruzado no bloquean las llamadas.
- **Instrucciones y claves privadas.** Procesadas en local, no aparecen en el panel de red del navegador.
- **Funciona sin conexión.** Diseño, simulación y documentación no necesitan red; solo peticiones reales, sincronización Git y modelos hospedados.
- **Entornos ejecutados en local.** Simulaciones, ejecutor de escenarios, acceso a base y terminal corren en su máquina.

## Licencia de escritorio

El cliente de escritorio se vende como **licencia perpetua tras compra única**. Se compra una vez, se posee para siempre, funciona por completo sin conexión y no necesita cuenta. La clave se genera en la compra y se muestra una sola vez. Se distingue de Powerduck Cloud, el servicio de alojamiento con suscripción mensual. Vea [Facturación de Cloud](../cloud/billing.md).

## Empiece aquí

- [Diseñar con el asistente](./design.md)
- [Espacio de petición y entornos](./debug.md)
- [Pruebas de escenario e informes](./scenario-testing.md)
- [Protocoles](./protocols.md)
- [Modelo de datos y diagrama ER](./data-model.md)
- [Servidor de simulación](./mock-server.md)
- [IA y modelos](./ai-models.md)
- [Ajustes](./settings.md)
