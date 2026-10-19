---
sidebar_position: 8
title: IA y modelos
description: "Configure un modelo compatible con OpenAI y conozca los transportes de escritorio y web, la alternativa para llamadas a herramientas y los datos enviados al proveedor."
---

# IA y modelos

Powerduck permite elegir y configurar el modelo del asistente. En el escritorio, las solicitudes pasan por el proceso principal hasta el endpoint elegido; los cambios del documento siguen usando tarjetas que puede revisar.

## Traer un modelo

En los ajustes, configure el asistente hacia cualquier endpoint de Chat Completions **compatible con OpenAI**.

- Elija un ajuste predefinido de proveedor o defina uno **personalizado**.
- Aporte nombre visible, URL base, clave API e ID de modelo.
- Configure varios perfiles y elija entre ellos.

No se presupone un proveedor concreto. Los endpoints compatibles con OpenAI, propios o de terceros, se utilizan del mismo modo, lo que permite a los equipos aplicar su política de modelos.

## Funciones avanzadas y respaldo elegante

Cada perfil tiene un interruptor de **funciones avanzadas**, activado por defecto.

- Activado, la app usa la **llamada a función nativa** del modelo: envía el catálogo de herramientas por la red y deja que el modelo elija y llame directamente la herramienta adecuada.
- Si un endpoint rechaza argumentos de herramientas nativos — modelos pequeños sin soporte — ese endpoint se recuerda y se hace un único reintento mediante un **protocolo de respaldo basado en contenido**.

El mecanismo alternativo mejora la compatibilidad, pero no garantiza el éxito: aún pueden producirse errores de red, autenticación o modelo. Desactive las funciones avanzadas si un perfil debe usar siempre el modo básico.

El uso de herramientas tiene límites: el agente ejecuta un número acotado de rondas, tres de forma predeterminada, y elimina llamadas repetidas dentro de una misma ejecución.

## Por qué enrutar por el proceso principal

En el escritorio, la petición completa la emite el **proceso principal Node**, no la WebView. Dos ventajas concretas.

- **Sin muro CORS del navegador.** Las restricciones cross-origin de la web no bloquean las llamadas al endpoint del modelo.
- **La solicitud HTTP se ejecuta fuera del renderizador.** Su panel de red no muestra el intercambio HTTP del proceso principal. Esto no garantiza que las instrucciones o claves no aparezcan en la memoria del renderizador, registros u otras herramientas de desarrollo.

La pasarela de escritorio valida la estructura de las solicitudes y aplica límites de recursos:

- Solo acepta URL HTTP(S); comprueba nombres y valores de cabeceras, tamaño del cuerpo, tiempos de espera y solicitudes simultáneas. Permite endpoints locales y privados. No es una lista de hosts autorizados ni una garantía de privacidad del proveedor;
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

- Las instrucciones, el contexto seleccionado, las descripciones de herramientas y las credenciales se envían al endpoint del modelo configurado. El proveedor alojado recibe esos datos; use un endpoint local de confianza si su política exige inferencia local;
- El host determinista, no el modelo, valida y aplica cada cambio.
- Toda escritura recibe su aprobación antes de ejecutarse.

Vea también: [Diseñar con el asistente](./design.md)、[Ajustes](./settings.md)、[Control de acceso en Cloud](../cloud/access-control.md).
