---
sidebar_position: 7
title: Servidor de simulación local
description: "Ejecute una simulación local de su API OpenAPI eligiendo puerto, ruta base, latencia y sobrescrituras de respuesta, e inspeccione las peticiones recibidas."
---

# Servidor de simulación local

El servidor de simulación ofrece un clon funcional de su API directamente desde la especificación, para avanzar el trabajo de frontend y cliente antes de que el backend esté listo. Sin infraestructura externa; se ejecuta en el proceso principal del escritorio.

## Iniciar una simulación

Puede iniciarla en el modo servidor o directamente en el chat de IA; desde el chat, la app confirma la dirección del servicio.

Opciones disponibles.

| Opción | Rango/forma | Uso |
|---|---|---|
| `port` | Entero `1`–`65535` | Puerto local a escuchar |
| `basePath` | Prefijo de ruta URL | Servir bajo una ruta base |
| `latencyMs` | `0`–`10000` | Retardo artificial para imitar latencia de red |
| `overrides` | hasta 100 sobrescrituras | Devolver una respuesta concreta para operaciones elegidas |

Los valores inválidos de puerto o retardo se rechazan con un mensaje claro, sin iniciar un servidor roto.

## Varias simulaciones

Puede ejecutar varias en paralelo — por ejemplo una por documento abierto. La app lista las activas (`mock:list`) y puede detener individualmente (`mock:stop`). Cada una está ligada a un ID y nombre de documento.

## Inspeccionar peticiones recibidas

La simulación registra las peticiones recibidas; consultables (`mock:requests`, límite opcional) y el registro borrable. Ayuda a verificar que el cliente llama las operaciones correctas con los parámetros esperados, incluso sin backend real.

## Sobrescrituras de respuesta

Cuando los ejemplos por defecto o respuestas derivadas del esquema no bastan, las sobrescrituras devuelven una respuesta elegida para operaciones concretas. Un límite (máximo 100) mantiene la configuración predecible.

## Cuándo usar

- Desbloquear el desarrollo de frontend sobre un contrato aún en construcción.
- Reproducir situaciones lentas o casos límite ajustando retardo y respuestas.
- Demostrar flujos de API sin entorno desplegado.
- Verificar que un cliente generado llama las operaciones como se espera.

La simulación lee la misma spec que los demás modos, por lo que se mantiene alineada con el contrato al cambiar el diseño.

Vea también: [Pruebas de escenario](./scenario-testing)、[Diseñar con el asistente](./design).
