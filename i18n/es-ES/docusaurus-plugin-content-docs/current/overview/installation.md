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
2. En el primer inicio, macOS puede pedir confirmación para abrir una aplicación descargada fuera del App Store. Antes de abrirla, compruebe que procede de la página oficial; no desactive las comprobaciones de seguridad del sistema.
3. Se publican dos builds: `arm64` para Apple Silicon (serie M) y `x64` para Mac Intel. Descargue el correspondiente.

## Windows

1. Ejecute el instalador NSIS (`.exe`) y siga la configuración.
2. Si SmartScreen indica que el editor no se reconoce, compruebe primero que el instalador procede de la página oficial. Continúe solo tras verificar la fuente; no omita la advertencia para una descarga que no sea de confianza.

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

El cliente de escritorio envía las solicitudes al modelo mediante el proceso principal, por lo que no se aplican las restricciones CORS entre navegador y proveedor. Aun así, las instrucciones, el contexto pertinente y las credenciales se envían al endpoint del modelo configurado; usar un modelo alojado no es trabajar sin conexión. La separación de procesos tampoco garantiza que los secretos nunca aparezcan en registros o herramientas de desarrollo. Véase [IA y modelos](../client/ai-models.md).

## Requisitos

- macOS 11 o posterior, Windows 10 o posterior o una distribución de escritorio Linux habitual compatible con Electron 37.
- Espacio en disco para la app. Las especificaciones abiertas permanecen en su ubicación original.
- La red solo es necesaria para enviar peticiones, sincronizar fuentes Git o llamar a un modelo de IA hospedado; el resto funciona sin conexión.

## Licencia

El cliente de escritorio puede evaluarse libremente. Se vende como licencia **perpetua** tras una compra única, sin suscripción. La clave de licencia se genera en la compra y se muestra una sola vez. El alojamiento en la nube es un servicio de suscripción aparte. Vea [Facturación de Cloud](../cloud/billing.md) para la distinción.

Después, pase al [Inicio rápido](./quickstart.md).
