---
sidebar_position: 9
title: Ajustes
description: "Configure apariencia e idioma, comportamiento de peticiones, proxies, TLS y certificados de cliente, el terminal integrado y las acciones de archivo/shell."
---

# Ajustes

Los ajustes del cliente de escritorio cubren el aspecto de la app y cómo se envían las peticiones. Las preferencias de la app se mantienen separadas de los cambios en el documento de API: cambiar el tema o configurar un proxy no modifica el contrato.

## Apariencia

- **Tema** — alternar entre claro y oscuro (`theme.get`, `theme.set`); el cambio se aplica a toda la app y se guarda.
- **Idioma de la interfaz** — elegir entre diez idiomas o seguir automáticamente el sistema.

| | | |
|---|---|---|
| English (US) | 简体中文 | 繁體中文 |
| 日本語 | 한국어 | Français |
| Deutsch | Español | Português (Brasil) |
| العربية | | |

El árabe se renderiza de derecha a izquierda. La opción `auto` sigue el idioma del sistema.

## Comportamiento de peticiones

Estos ajustes controlan las peticiones salientes en el espacio de trabajo y escenarios.

- **Tiempo límite** (`requestTimeoutMs`) — en milisegundos; `0` significa ilimitado.
- **SSL estricto** (`strictSSL`) — verificación del certificado TLS; desactivable para servidores autofirmados o no confiables.
- **Seguir redirecciones** (`followRedirects`) y **máximo de redirecciones** (`maxRedirects`).
- **Versión HTTP** (`protocolVersion`) — `http1`, `http2`, `auto`.
- **Desactivar cookies** (`disableCookies`) — apaga la gestión de cookies de petición.

## Proxy

Configure un proxy saliente mediante un modo (`off`, `system`, `custom`).

- `off` — sin proxy.
- `system` — seguir el proxy del sistema operativo.
- `custom` — usar una URL de proxy, con usuario, contraseña y lista de omisión opcionales.

La lista de omisión acepta hosts y patrones (p. ej. `localhost,127.0.0.1`, hosts comodín). La contraseña del proxy es escribible pero no legible y se borra con valor vacío.

## TLS y certificados de cliente

Para entornos con confianza personalizada o TLS mutuo:

- **CA personalizada** — activar e indicar la ruta de un certificado CA para confiar en una raíz interna o autofirmada.
- **Certificado de cliente (mTLS)** — configurar por host un certificado: par certificado/clave o PFX, con contraseña opcional; el alcance lo fijan host y puerto.

Los certificados se pueden añadir, borrar por ID o vaciar por completo. Las contraseñas de certificados son solo escribibles y no se devuelven.

## Terminal integrado

La app incluye un panel de terminal en la parte inferior.

- `terminal.open` muestra el panel; con `{"cwd":"document"}` se abre en la carpeta del documento actual, que el host resuelve a una ruta absoluta real.
- `terminal.run` escribe y ejecuta un comando shell explícito tras una tarjeta de confirmación.

Un comando solo se ejecuta si lo pide explícitamente; mostrar el panel no ejecuta nada.

## Acciones de archivo y shell

- `shell.revealFile` — muestra el documento actual (o una ruta) en el gestor de archivos.
- `shell.openPath` — abre un archivo con la app por defecto.
- `shell.openExternal` — abre una página externa en el navegador del sistema.

Las páginas oficiales de Powerduck usan una herramienta propia de enlace (`app.officialLink`) para renderizar una tarjeta en la conversación sin salir de la app.

## Ejemplos de código cliente

Para cada operación, el asistente puede generar código cliente ejecutable (`clientcode.generate`), mostrado en una tarjeta de código con selector de idioma y biblioteca: C, C#, Go, Java, JavaScript, Node, Kotlin, PHP, Python, Ruby, Rust, shell, Swift, etc. El código aparece en una tarjeta, no en la conversación.

## Cambiar ajustes mediante el asistente

Las peticiones a toda la app — cambiar tema o idioma, configurar un proxy, ignorar errores de certificado, cambiar la versión HTTP — se tratan con herramientas de ajustes, no como un problema de diseño de API. Los cambios de ajustes piden confirmación antes de aplicarse.

Vea también: [IA y modelos](/docs/client/ai-models)、[Espacio de petición](/docs/client/debug).
