---
sidebar_position: 2
title: "Instalar y empezar"
description: "Powerduck ayuda a entender cambios generados por IA, leer su contexto y decidir qué atender. La aplicación de escritorio permite abrir por separado el espacio API y la revisión de código desde Inicio."
---

# Instalar y empezar

Descarga del sitio oficial macOS Apple Silicon/Intel, Windows o Linux AppImage. Verifica origen y editor sin desactivar la seguridad. Inicia sesión en la web y vuelve a la aplicación; importa una API o elige código. La app web permite explorar API; análisis de archivos y comandos locales requieren escritorio.

[Powerduck](https://www.powerduck.com/download.html)

## IA integrada y uso

Inicia sesión con Google o GitHub. Solo hay modelo integrado, sin selector, claves propias ni endpoints personalizados. El trabajo IA solicitado envía el contexto elegido a proveedores gestionados. Se excluyen rutas comunes de dependencias, compilación y credenciales, pero el código todavía puede contener secretos.

## Planes y tareas

Nuevos planes, conversaciones/revisiones: Free 20/5; Starter $19/mes 300/30; Pro $39/mes 700/90; Max $99/mes 2.000/270. Free se reinicia al comenzar el mes UTC y los de pago según el periodo de suscripción. No se acumulan. Precio final e impuestos en el pago.

- [Espacio API](../client/introduction.md)
- [Revisión de código](../client/code-quality.md)
- [IA integrada y uso](../client/ai-models.md)
- [Planes y tareas](../cloud/billing.md)
- [Instalar y empezar](installation.md)
- [Entender cada cambio](quickstart.md)

## macOS · Windows · Linux

macOS 11+ · Windows 10+ · Linux · Electron 37

- macOS: `.dmg` · `arm64` / `x64`
- Windows: NSIS `.exe` · SmartScreen
- Linux: `.AppImage` · `x64`

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```
