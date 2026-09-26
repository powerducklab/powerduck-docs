---
sidebar_position: 3
title: Espacio de petición y entornos
description: "Envíe peticiones reales en pestañas, gestione variables entre ámbitos y entienda la relación entre los entornos personalizados y los servers declarados en el documento OpenAPI."
---

# Espacio de petición y entornos

El espacio de petición es donde las operaciones diseñadas se vuelven llamadas reales. Envía peticiones mediante el proceso principal local, muestra respuestas y gestiona valores que cambian en cada ejecución con entornos y variables.

## Enviar una petición

1. Abra una operación en el espacio de petición. Método, ruta, parámetros, cabeceras y cuerpo provienen de la spec.
2. Complete valores que requieren entrada concreta, como parámetros de ruta o un token.
3. Envíe. La pestaña muestra código de estado, cabeceras de respuesta, cuerpo y duración.
4. Mantenga varias peticiones en **pestañas** para comparación o reverificación.

La ejecución ocurre en el proceso principal, no la WebView: las restricciones CORS directas del navegador no bloquean las llamadas, y los detalles no se exponen por el panel de red del navegador.

## Entornos versus servers OAS

Están relacionados pero son distintos; entender la diferencia elimina una fuente frecuente de confusión.

| | Entornos personalizados | `servers` OAS |
|---|---|---|
| Ubicación | Ajustes locales de la app | En el documento OpenAPI |
| Modificables por la herramienta | Sí | No — por parche de spec |
| Uso | URL base por defecto de nuevas pestañas y ejecuciones | URL base declaradas por el propio contrato |
| Compartidos con documentación | No | Sí |

Cuando el asistente lista URLs base (`env.listServers`), devuelve primero los entornos personalizados utilizables, luego los servers de solo lectura declarados en el documento actual.

- **Añadir/elegir URL base local** crea y activa un entorno personalizado (`env.upsertServer`, `env.selectServer`); no edita el documento.
- **Cambiar servers en el contrato** propone en su lugar un parche de spec.

Esto mantiene las URLs de depuración personales fuera del contrato, mientras los servers declarados también impulsan peticiones.

## Variables

Las variables se gestionan en cuatro ámbitos.

- **globals** — disponibles en todas las colecciones.
- **collection** — aplican a una colección.
- **environment** — ligadas al entorno actual; sin server concreto, a todos los servers.
- **local** — solo para la sesión local.

El asistente lista variables (`env.listVariables`, filtrables por ámbito) y las crea o actualiza (`env.setVariable`, upsert por nombre y ámbito). Una variable puede ligarse a un server concreto y tiene su propio estado activo. La configuración de variables es una acción de la app, no un cambio de documento.

Es habitual colocar tokens de acceso, IDs reutilizados entre llamadas o banderas de funcionalidad como variables.

## Cuando no hay URL base

Una petición necesita una URL completa. Si ni los `servers` de la spec ni el entorno actual proporcionan URL base, la app no adivina: pide introducirla antes de ejecutar. Mejor que llamar en silencio al host equivocado.

## De la petición única al flujo

Una vez que una llamada aislada funciona, el paso natural es encadenar para pasar un valor de respuesta a la siguiente petición. Ese es el rol de las [pruebas de escenario](./scenario-testing.md).

Vea también: [Diseñar con el asistente](./design.md)、[Pruebas de escenario](./scenario-testing.md)、[Ajustes](./settings.md).
