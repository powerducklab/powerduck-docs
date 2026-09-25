---
sidebar_position: 8
title: IA y modelos
description: "Conecte un modelo compatible con OpenAI, mantenga instrucciones y claves en local mediante el proceso principal, use llamada a función nativa con respaldo automático y conserve el mismo flujo en la web."
---

# IA y modelos

La capacidad del asistente depende del modelo subyacente, por lo que Powerduck no le fija a un proveedor concreto. Usted elige y configura el modelo, la app lo llama por una ruta local segura, y cada cambio pasa por las mismas tarjetas revisables.

## Traer un modelo

En los ajustes, configure el asistente hacia cualquier endpoint de Chat Completions **compatible con OpenAI**.

- Elija un ajuste predefinido de proveedor o defina uno **personalizado**.
- Aporte nombre visible, URL base, clave API e ID de modelo.
- Configure varios perfiles y elija entre ellos.

La app no asume que el modelo venga de un proveedor concreto. Los endpoints auto-hospedados o de terceros compatibles funcionan igual, importante para equipos con estrategia propia de modelos.

## Funciones avanzadas y respaldo elegante

Cada perfil tiene un interruptor de **funciones avanzadas**, activado por defecto.

- Activado, la app usa la **llamada a función nativa** del modelo: envía el catálogo de herramientas por la red y deja que el modelo elija y llame directamente la herramienta adecuada.
- Si un endpoint rechaza argumentos de herramientas nativos — modelos pequeños sin soporte — ese endpoint se recuerda y se hace un único reintento mediante un **protocolo de respaldo basado en contenido**.

El objetivo es devolver siempre un resultado: los modelos potentes toman la ruta nativa precisa, los modelos sin herramientas bajan a un protocolo más simple en vez de perder el turno. Puede desactivar funciones avanzadas para perfiles que deban usar siempre la ruta base.

El trabajo impulsado por herramientas también tiene límites: el agente ejecuta un número acotado de turnos (3 por defecto) y deduplica llamadas para que una herramienta no corra dos veces en bucle.

## Por qué enrutar por el proceso principal

En el escritorio, la petición completa la emite el **proceso principal Node**, no la WebView. Dos ventajas concretas.

- **Sin muro CORS del navegador.** Las restricciones cross-origin de la web no bloquean las llamadas al endpoint del modelo.
- **Instrucciones y claves fuera de la consola.** URL, cabeceras de autenticación, instrucción del sistema y lista de herramientas no aparecen en el panel de red del renderer.

La pasarela está deliberadamente restringida, no es un proxy abierto.

- Valida destinos (loopback y hosts permitidos), sanea cabeceras y evita la inyección de saltos de línea por cabeceras de respuesta.
- Las peticiones son cancelables (`ai:cancel`).

## Escritorio y web

El mismo asistente funciona en ambos entornos con la ruta adaptada a cada uno.

- **Escritorio (Electron):** las capacidades se importan y ejecutan en local, y la petición se enruta por el proceso principal.
- **Web:** el mismo flujo se ejecuta por HTTP, llamando a las APIs del servicio en vez de módulos locales.

Por eso la app mantiene una ruta compatible con la web además de la de Electron. El tratamiento de la intención y la presentación de tarjetas son iguales; solo cambia el transporte.

## Cómo se identifica la intención

La intención no se gestiona listando palabras clave por función. La app presenta al modelo un **catálogo de herramientas** claro y bien descrito — ID de cada herramienta, argumentos y situación exacta de uso. El modelo elige la mejor herramienta del catálogo, el host determinista la valida y ejecuta, y las escrituras piden confirmación.

Añadir una capacidad significa añadir una herramienta al catálogo (con descripción precisa), no mantener listas más largas de palabras clave. El mismo catálogo se comparte con agentes externos mediante el servidor MCP, para alinear capacidades entre el producto y otras herramientas.

## Privacidad

- En el escritorio, las claves API e instrucciones permanecen en local y no se exponen al renderer.
- El host determinista, no el modelo, valida y aplica cada cambio.
- Toda escritura recibe su aprobación antes de ejecutarse.

Vea también: [Diseñar con el asistente](./design)、[Ajustes](./settings)、[Control de acceso en Cloud](../cloud/access-control).
