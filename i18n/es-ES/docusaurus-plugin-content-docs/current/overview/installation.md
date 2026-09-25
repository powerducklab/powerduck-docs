---
sidebar_position: 2
title: Instalación
description: "Instale el cliente de escritorio Powerduck en macOS, Windows y Linux. La aplicación es local-first y arranca sin cuenta."
---

# Instalación

El cliente de escritorio Powerduck es una app local-first. Se instala como cualquier otro programa de escritorio, abre archivos reales en disco y arranca sin cuenta.

## Descarga

Obtenga el instalador para su plataforma en el [sitio web de Powerduck](https://www.powerduck.com/#download). Los siguientes builds se producen con `electron-builder`.

| Plataforma | Instalador | Arquitecturas |
|---|---|---|
| macOS | `.dmg` (y `.zip` para actualizaciones automáticas) | Apple Silicon (`arm64`) e Intel (`x64`) |
| Windows | Instalador NSIS (`.exe`) | `x64` |
| Linux | AppImage (`.AppImage`) | `x64` |

## macOS

1. Abra el `.dmg` y arrastre Powerduck a **Aplicaciones**.
2. En el primer arranque, macOS puede pedir confirmación para abrir una app descargada fuera de la App Store. Autorice en el cuadro de diálogo, o haga clic derecho en la app y elija **Abrir**.
3. Se publican dos builds: `arm64` para Apple Silicon (serie M) y `x64` para Mac Intel. Descargue el correspondiente.

## Windows

1. Ejecute el instalador NSIS (`.exe`) y siga la configuración.
2. Si SmartScreen informa de un editor no reconocido, elija **Más información**, luego **Ejecutar**.

## Linux

1. Descargue el `.AppImage`.
2. Hágalo ejecutable y láncelo.

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```

El AppImage funciona sin instalación en el sistema. Algunas distribuciones necesitan FUSE para el montaje.

## Qué se ejecuta en su máquina

El cliente de escritorio es una app Electron en dos partes.

- El **proceso principal** (Node.js), que gestiona el acceso a archivos, las peticiones HTTP externas, el servidor de simulación local, las conexiones a bases de datos y el terminal integrado.
- El **renderer** (el espacio de trabajo React), que muestra la especificación, el chat de IA y las herramientas.

Esta separación cuenta para seguridad y fiabilidad. Las peticiones que requieren red y acceso al sistema de archivos las trata el proceso principal, no la WebView: las instrucciones y claves API no aparecen en la consola del navegador, y las restricciones CORS directas del navegador hacia el proveedor no se aplican. Vea [IA y modelos](../client/ai-models).

## Requisitos

- macOS actualizado, Windows 10 o posterior, o una distribución de escritorio Linux importante.
- Espacio en disco para la app. Las especificaciones abiertas permanecen en su ubicación original.
- La red solo es necesaria para enviar peticiones, sincronizar fuentes Git o llamar a un modelo de IA hospedado; el resto funciona sin conexión.

## Licencia

El cliente de escritorio puede evaluarse libremente. Se vende como licencia **perpetua** tras una compra única, sin suscripción. La clave de licencia se genera en la compra y se muestra una sola vez. El alojamiento en la nube es un servicio de suscripción aparte. Vea [Facturación de Cloud](../cloud/billing) para la distinción.

Después, pase al [Inicio rápido](./quickstart).
