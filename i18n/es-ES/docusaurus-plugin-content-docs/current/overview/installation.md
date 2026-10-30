---
sidebar_position: 2
title: Instalación
description: "Powerduck · Google OAuth / GitHub · Free / Pro / Max"
---

# Instalación

Powerduck, incluido el cliente de escritorio, requiere iniciar sesión con Google OAuth o GitHub. Los archivos permanecen en el disco. El análisis de IA envía el contexto seleccionado a los proveedores gestionados por Powerduck. Ya no se admiten URL de modelos ni claves API propias.

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

Powerduck, incluido el cliente de escritorio, requiere iniciar sesión con Google OAuth o GitHub. Los archivos permanecen en el disco. El análisis de IA envía el contexto seleccionado a los proveedores gestionados por Powerduck. Ya no se admiten URL de modelos ni claves API propias.

## Requisitos

- macOS 11 o posterior, Windows 10 o posterior o una distribución de escritorio Linux habitual compatible con Electron 37.
- Espacio en disco para la app. Las especificaciones abiertas permanecen en su ubicación original.
- Powerduck, incluido el cliente de escritorio, requiere iniciar sesión con Google OAuth o GitHub. Los archivos permanecen en el disco. El análisis de IA envía el contexto seleccionado a los proveedores gestionados por Powerduck. Ya no se admiten URL de modelos ni claves API propias.

## Powerduck · Free / Pro / Max

Free: 300.000 credits diarios, reiniciados a las 00:00 UTC. Pro: 39 $/mes y 18.000.000 credits cada 7 días. Max: 99 $/mes y 60.000.000 credits cada 7 días. El ciclo empieza con la suscripción inicial, separado de la facturación mensual. No se acumulan. Escritorio y AI Chat comparten el plan personal; ya no se venden licencias perpetuas ni claves de activación.

Después, pase al [Inicio rápido](./quickstart.md).
