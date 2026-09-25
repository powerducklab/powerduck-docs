---
sidebar_position: 3
title: Inicio rápido
description: "En pocos minutos recorra el endpoint diseñado, una petición real y la documentación renderizada desde su archivo OpenAPI."
---

# Inicio rápido

Este breve recorrido atraviesa el bucle central: abrir una especificación, modificarla con el asistente de IA, enviar una petición y ver el resultado como documentación, usando el mismo documento OpenAPI en todas partes.

## 1. Abrir una especificación

Arranque el cliente y abra una especificación desde cualquier fuente soportada. Todas pasan por el mismo flujo de importación y se convierten o actualizan a OpenAPI 3.2:

- Un **archivo OpenAPI o Swagger** en disco (Swagger 2.0, OpenAPI 3.0 / 3.1 actualizados).
- Una **colección de Postman**.
- Un **comando cURL**.
- Un **repositorio Git**.
- Una **URL** que apunta a una especificación.

También puede arrastrar y soltar un archivo directamente en el espacio de trabajo. Sin punto de partida, pida al asistente que cree un esqueleto inicial a partir de una breve descripción.

## 2. Pedir al asistente que añada un endpoint

En el chat, describa lo que necesita. Por ejemplo:

> Añade un endpoint `GET /products` que devuelva una lista paginada de productos.

El asistente no edita directamente el documento; responde con una **tarjeta de parche**. La tarjeta muestra la operación a modificar y las rutas/recursos afectados. Revise, luego elija **Aplicar** o **Rechazar**. Nada llega al documento antes de aplicarse.

Para una petición amplia como «construye una API de comercio electrónico», el asistente hace primero preguntas de aclaración y luego propone parches centrados en 2 a 5 operaciones cada vez.

## 3. Refinar una sola operación sin desviaciones

Abra la operación y refínela en el sitio — añada un parámetro de consulta o extienda el esquema de respuesta. En modo foco, el asistente genera parches finos que solo tocan los campos pedidos y preservan todo lo demás de la operación. Esto evita alterar o sobrescribir el trabajo existente en ediciones repetidas sobre la misma API.

## 4. Enviar una petición real

Pase al **espacio de trabajo de petición** de la operación y envíe. La petición se ejecuta mediante el proceso principal local. La respuesta, el estado, las cabeceras y el tiempo aparecen junto a la operación, y para valores que cambian en cada ejecución puede usar entornos y variables.

Si ni los `servers` de la especificación ni el entorno activo proporcionan una URL base, la app no adivina: pide introducir la URL base.

## 5. Ver la documentación

Abra la **documentación**: la misma especificación se renderiza como documentación de API legible. El visor lee el documento en vivo, por lo que la documentación coincide siempre con lo recién diseñado.

## 6. Ir más lejos cuando esté listo

- Encadene varias peticiones con las [pruebas de escenario](/docs/client/scenario-testing) y exporte un informe HTML.
- Arranque el [servidor de simulación local](/docs/client/mock-server) durante el desarrollo del backend.
- Modele APIs de streaming / RPC con los [seis protocolos](/docs/client/protocols).
- Derive tablas, relaciones y SQL en el [modelo de datos](/docs/client/data-model).
- Publique la misma especificación en línea con [Powerduck Cloud](/docs/cloud/quickstart).

Con esto el bucle central está completo. El resto de la documentación detalla cada espacio de trabajo.
