---
sidebar_position: 1
title: Introducción
description: "Powerduck es una plataforma nativa para IA y local-first construida en torno a un único YAML OpenAPI. Usted y la IA diseñan, depuran, prueban, simulan, documentan y exponen herramientas MCP desde el mismo archivo. Disponible como cliente de escritorio, nube y bibliotecas de código abierto."
---

# Introducción

La forma de construir APIs está cambiando. Durante veinte años, el **operador** era un humano que hacía clic en una interfaz, y el **consumidor** de un contrato de API era un humano que leía documentación. Hoy ambos extremos cambian.

- El operador se vuelve un **asistente de IA** que convierte la intención en acciones.
- El consumidor se vuelve un **agente de IA** que llama a la API como una herramienta vía MCP.

Las herramientas de la era anterior — clientes API, visores de especificaciones, colecciones de peticiones — se diseñaron para un humano al teclado. Powerduck está diseñado para esta era. No es un mejor cliente API ni un visor de especificaciones más bonito. Es una **plataforma nativa para IA que parte de un único archivo OpenAPI**.

## El núcleo: un único archivo OpenAPI local

Todo empieza con un simple `openapi.yaml` en su repositorio: un archivo abierto, versionado, legible por humanos e IA. Sin base de datos propietaria, sin cuenta en la nube.

```text
                one local openapi.yaml
                         |
      you + AI -> design debug test mock docs data-model
                         |
                      MCP tools
                         |
               any AI coding agent
```

Ese único archivo es el contrato. Cada flujo lee de él, y el mismo archivo puede pasarse vía MCP a cualquier agente de programación de IA. Así usted, el asistente integrado y cualquier agente externo comparten una única fuente de verdad. Cuando diseño, depuración, pruebas, simulación y documentación leen todos el mismo archivo, «mantener las herramientas sincronizadas» deja de ser una tarea: no es un objetivo, es una consecuencia del diseño.

Powerduck soporta OpenAPI 3.2 y actualiza al vuelo documentos 3.0 / 3.1 existentes (y Swagger 2.0). Las APIs que no son HTTP — SSE, WebSocket, GraphQL, gRPC, MCP — se modelan como entradas de ruta ordinarias mediante una extensión `x-protocol`, sin conversión forzada a formas REST.

## Trabajar con la IA

- En cuanto abre el YAML, el asistente propone qué puede hacer con él.
- Describa el resultado en lenguaje natural — «crea el endpoint de pedidos», «prepara datos de prueba», «ejecuta el flujo de pago y haz un informe» — y elige las herramientas adecuadas y propone cambios.
- Cada cambio llega como una **tarjeta revisable**. Nada se aplica antes de su aprobación.
- Al refinar una API, el asistente se queda en esa API y solo cambia lo pedido, sin alterar el resto del documento.
- Puede traer **cualquier modelo compatible con OpenAI**. En el escritorio, las instrucciones y claves nunca salen de la máquina.

## Local-first por defecto

Powerduck se ejecuta en su máquina, abre y guarda archivos reales, funciona sin conexión y mantiene sus claves API e instrucciones fuera del navegador. La nube es una extensión opcional para compartir y publicar, no un requisito para empezar.

## Tres formas de usar Powerduck

| Forma | Qué es | Cuándo usarla |
|---|---|---|
| [**Cliente de escritorio**](../client/introduction.md) | App Electron local-first con asistente de IA y espacio de trabajo API completo | Ingenieros que quieren todo en su máquina, trabajar sin conexión y mantener claves/instrucciones en local |
| [**Powerduck Cloud**](../cloud/introduction.md) | Servicio hospedado para alojamiento OAS, documentación en línea y MCP gestionado | Para compartir APIs, publicar enlaces estables y ofrecer MCP sin ejecutar nada |
| [**Bibliotecas de código abierto**](/opensource/index.md) | Paquetes npm `@powerduck/*` combinables | Para construir sus propias herramientas, pipelines CI o componentes embebidos |

Las tres formas comparten el mismo motor. El cliente de escritorio y la nube se ensamblan ambos desde las bibliotecas de código abierto, por lo que las capacidades se comportan igual, ya se ejecuten en local, se llamen por la red o se importen los paquetes directamente.

### Cliente de escritorio

El [cliente de escritorio](../client/introduction.md) se ejecuta por completo en su máquina. Abre y edita archivos reales en disco, envía peticiones mediante un proceso local, ejecuta simulaciones locales y mantiene las instrucciones de IA y claves API fuera de la consola del navegador. Los modelos son libremente configurables y los cambios propuestos llegan como tarjetas revisables antes de aplicarse.

### Powerduck Cloud

[Powerduck Cloud](../cloud/introduction.md) lleva el mismo flujo en línea. Añada un archivo, un repositorio Git o una URL, elija las operaciones a exponer y obtendrá enlaces estables a la documentación renderizada y un endpoint MCP gestionado. El acceso puede protegerse con una contraseña de visualización o una clave de acceso MCP; los planes de pago añaden sincronización Git, dominios personalizados y límites más altos.

### Bibliotecas de código abierto

Las [bibliotecas](/opensource/index.md) son el motor subyacente: analizador y actualizador OpenAPI, CLI multiprotocolo, generador de código, servidor MCP, ejecutor de peticiones, conversores cURL / Postman y editores embebidos. Cada uno se publica de forma independiente en npm con guías de instalación dedicadas y referencias API. Los detalles técnicos de bajo nivel viven aquí.

## Qué cambia para usted

- **Describe el resultado, no los clics.** Diga el objetivo y el asistente avanza en pasos revisables.
- **Sus APIs son aptas para agentes desde el inicio.** El mismo contrato que genera documentación genera también herramientas MCP, para que los agentes de IA llamen correctamente a su API desde el primer día.
- **Sin desviaciones.** Diseño, depuración, pruebas, simulación y documentación leen un solo archivo.
- **Todos los protocolos en un solo lugar.** HTTP, SSE, WebSocket, GraphQL, gRPC y MCP en una especificación, no seis herramientas.
- **Sin bloqueo.** Traiga sus modelos, mantenga las claves en local en el escritorio y posea el YAML en texto plano en su repositorio.

## A dónde ir después

- ¿Nuevo aquí? Empiece por [Instalación](./installation.md) y [Inicio rápido](./quickstart.md).
- ¿Necesita el espacio local completo? Lea la [guía del cliente de escritorio](../client/introduction.md).
- ¿Quiere publicar su API en línea? Lea la [guía de Cloud](../cloud/introduction.md).
- ¿Construye su propia integración? Vea las [bibliotecas de código abierto](/opensource/index.md).
