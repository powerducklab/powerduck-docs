---
sidebar_position: 1
title: Powerduck Cloud
description: "Ponga su especificación OpenAPI en línea en minutos. Publique documentación renderizada y un endpoint MCP gestionado, elija la exposición, controle el acceso y comparta enlaces estables sin ejecutar nada."
---

# Powerduck Cloud

Powerduck Cloud convierte un archivo OpenAPI en algo **compartible**. Añada su spec, elija qué exponer y luego comparta enlaces estables a la documentación renderizada y un servidor MCP gestionado. Sin auto-hospedaje ni ejecutar nada.

Es el mismo flujo orientado a contrato e impulsado por IA que el cliente de escritorio, en línea para equipos y consumidores.

## El flujo

1. **Añadir la spec** — archivo, repositorio Git o URL. Puede iniciar el flujo desde el sitio web e iniciar sesión al publicar sin volver a subir.
2. **Elegir la exposición.** Operaciones activadas individualmente; el archivo original no cambia.
3. **Abrir el enlace de documentación de inmediato** — la documentación está activada por defecto. El endpoint MCP permanece desactivado hasta que quiera ofrecer herramientas a agentes: un interruptor.
4. **Controlar el acceso.** Añadir contraseña de visualización y fecha de expiración, además de una clave de acceso MCP independiente para agentes.
5. **Publicar y compartir.** Publique los artefactos finales de la versión actual: los enlaces resuelven, el control avanzado a un clic.
6. **Mantenerse actualizado.** Cada cambio crea una nueva versión para comparar/revertir, y las fuentes Git se sincronizan con las actualizaciones.
7. **Gestionar el ciclo de vida.** Pausar, reanudar, archivar y ver estado, versión y origen de un vistazo.

## Qué obtiene

- **Enlace estable de documentación** — legible tras nuevas versiones.
- **Endpoint MCP gestionado** — agentes de IA externos descubren y llaman las operaciones elegidas.
- **Exposición por operación** — excluir interfaces internas/inacabadas de la superficie pública.
- **Control de acceso** — contraseña de visualización, expiración, clave de acceso MCP.
- **Historial de versiones** — comparar y revertir; el original nunca se sobrescribe.
- **Sincronización Git** — refleja las actualizaciones del repositorio como nuevas versiones hospedadas.
- **Dominios personalizados** — experiencia de marca incluida la configuración de subruta.

### Un documento, varias versiones

Cada edición crea una nueva versión en vez de sobrescribir, para comparar, revertir y regenerar documentación/MCP para un estado concreto. La documentación y MCP están siempre ligados a un documento y versión concretos, nunca a un vago «estado actual».

### Por qué un enlace puede no abrir

Un enlace de documentación o MCP resuelve cuando se dan tres cosas, y el espacio del documento muestra cada una y resalta el primer requisito faltante.

1. El documento está **activo** — pausar saca documentación y MCP juntos de la red.
2. El modo a compartir está **activo** — un interruptor por modo para documentación y MCP (documentación por defecto activa, MCP por defecto inactiva).
3. El artefacto actual está **publicado** — construido automáticamente tras añadir versión o cambiar exposición, normalmente sin acción; publicación manual como respaldo.

Las comprobaciones de acceso — contraseña de visualización, expiración, clave de acceso MCP — actúan por encima de estas tres.

## Inicio de sesión y pertenencia

Inicie sesión con **Google** o **GitHub**. Tras el handshake OAuth, Powerduck emite su propia sesión en una cookie HttpOnly segura, y el token del proveedor no sirve como identidad a largo plazo. Todo pertenece a una **Organización**; se crea automáticamente una organización personal para compartir en equipo más adelante sin rediseño.

## La consola

- **Dashboard** — añadir specs y ver documentos recientes con enlaces rápidos y acciones de inicio/parada.
- **Projects** — organizar documentos.
- **Espacio del documento** — estado, documentación, MCP, operaciones expuestas, versiones, origen, dominios en pestañas claras.
- **Billing** — estado de suscripción y pedidos separados.
- **Hub** — publicar y explorar documentación y servidores MCP públicos.
- **Settings** y **Activity** — perfil, preferencias, registro de auditoría.

Los lectores públicos usan un visor propio y no necesitan cuenta si el documento no pide contraseña.

## Cloud versus cliente de escritorio

| | Cliente de escritorio | Cloud |
|---|---|---|
| Ejecución | Su máquina | Hospedado |
| Modelo | Licencia perpetua, compra única | Suscripción mensual |
| Resultado | Clave de licencia (mostrada una vez) | Membresía, sin clave |
| Cuándo | Local, sin conexión, ámbito completo | Compartir y publicar en línea |

Ambos se complementan y se venden por separado. Vea [Facturación](./billing.md).

## Empiece aquí

- [Inicio rápido de Cloud](./quickstart.md)
- [Documentos y versiones](./documents-versions.md)
- [Operaciones expuestas](./exposure.md)
- [Control de acceso](./access-control.md)
- [Dominios personalizados](./custom-domains.md)
- [Facturación](./billing.md)
