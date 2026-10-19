---
sidebar_position: 3
title: "Tu primera solicitud local, sin cuenta ni modelo de IA"
description: "Tu primera solicitud local, sin cuenta ni modelo de IA"
---

# Tu primera solicitud local, sin cuenta ni modelo de IA

## Prueba el ejemplo local

En un espacio de trabajo vacío de la aplicación de escritorio, elige **Probar el ejemplo** e inicia la ejecución. Powerduck crea un ejemplo independiente, inicia el servidor Mock local, envía `GET /orders/summary` al puerto asignado y muestra la respuesta real. El ejemplo solo se da por terminado tras recibir HTTP 200. El servidor Mock se detiene después de la solicitud o al cerrar el ejemplo. Puedes ejecutarlo de nuevo cuando quieras. Instala primero la aplicación: este recorrido local no necesita Internet, una cuenta ni una clave de un modelo de IA.

## Abre tu propia especificación

Usa **Abrir** para importar un documento OpenAPI en YAML o JSON. El ejemplo nunca sobrescribe archivos existentes. La versión gratuita limita el número de especificaciones. Si alcanzas el límite, guarda y cierra o retira un documento que ya no necesites. No descartes cambios sin guardar solo para ejecutar el ejemplo. También puedes generar OpenAPI a partir de un proyecto existente; revisa los campos inciertos antes de confiar en el resultado.

## Verifica un servidor real

Una solicitud Mock correcta no demuestra que tu servidor cumpla la especificación. Sigue el [ejemplo de error del contrato](/docs/es-ES/client/contract-example/) y, si quieres, [conecta un asistente de programación](/docs/es-ES/client/coding-agent/). La validación manual no necesita un modelo de IA.

## Modelos opcionales y errores habituales

- **No hay ningún modelo configurado:** las solicitudes locales, el servidor Mock y las comprobaciones manuales siguen funcionando. Configura un modelo en los ajustes solo si quieres usar IA.
- **Error de conexión al modelo:** revisa la URL del servicio, la clave y el proxy en los ajustes. No publiques claves ni cabeceras de solicitudes en informes de errores.
- **No se puede acceder a la API:** comprueba que el servidor esté en funcionamiento y revisa la URL, el puerto y los ajustes de la solicitud en el depurador.
- **HTTP 401/403:** revisa la autenticación y los permisos de la API de destino. No es una petición para iniciar sesión en Powerduck.
- **Error de validación del contrato:** consulta la ruta del campo y el tipo esperado en la aserción. Corrige el servidor o la especificación, si es incorrecta, y vuelve a comprobarlo.

Los archivos locales se leen y guardan en tu ordenador. Los modelos remotos reciben el contexto necesario; al publicar en la nube, se sube el contenido seleccionado. Las estadísticas de uso opcionales están desactivadas por defecto en los ajustes y son independientes de la verificación de la licencia.

[Descargar](https://www.powerduck.com/download.html) · [Licencia de escritorio](https://www.powerduck.com/pricing?product=client)
