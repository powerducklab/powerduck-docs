---
sidebar_position: 6
title: Dominios personalizados
description: "Vincule un nombre de host (o nombre de host y subruta) a un documento. Verifique la propiedad mediante un registro TXT DNS y luego sirva documentación y MCP desde su dominio."
---

# Dominios personalizados

Por defecto los documentos se sirven desde la dirección compartida de Powerduck. Un dominio personalizado muestra documentación y MCP bajo **su propio nombre de host** en vez del enlace compartido, importante para publicar la API con marca.

Es una función de pago, disponible en los planes **Pro y Team** (comprobada mediante la autorización `oas.custom_domain`).

## Vinculación de host completo versus subruta

La vinculación apunta a:

- **Host completo** — `api.example.com` sirve un documento en la raíz.
- **Host y subruta** — `example.com/v1` sirve un documento bajo `/v1`.

La vinculación por subruta permite que un nombre de host sirva varios documentos.

```text
example.com/v1  -> document A
example.com/v2  -> document B
```

Así evita el límite de un nombre de host por documento y soporta rutas base versionadas.

## Rutas desde el dominio personalizado

Los mismos modos disponibles en la dirección compartida se sirven bajo rutas cortas y estables en el dominio vinculado.

| Modo | Host completo | Subruta |
|---|---|---|
| Spec actual | `/oas` | `/v1/oas` |
| Spec fijada por versión | `/v/:version/oas` | `/v1/v/:version/oas` |
| MCP | `/mcp` | `/v1/mcp` |

El host resuelve al documento vinculado por nombre de host de la petición y ruta. Estas rutas gestionan comprobaciones CORS.

## Añadir y verificar un dominio

El dominio no es confiable antes de verificar propiedad, por lo que el flujo es claro.

1. **Añadir** el nombre de host (o nombre de host y ruta) al documento.
2. El servicio devuelve la vinculación e **instrucciones DNS**.
3. Crear el registro DNS y **verificar**.
4. La vinculación pasa de pendiente a verificada y empieza a servirse.

La confirmación de propiedad usa un **registro TXT**.

| Campo | Valor |
|---|---|
| Tipo de registro | `TXT` |
| Host | `_powerduck-challenge.<your-domain>` |
| Valor | `powerduck-verify=<verification-token>` |

La verificación lee el registro TXT en DNS y compara el token en tiempo constante. Una vinculación verificada permanece verificada, sin necesidad de redetección.

### Ejemplo

Para `api.example.com`, crear un registro TXT.

```text
_powerduck-challenge.api.example.com
TXT "powerduck-verify=<the-token-shown-for-the-binding>"
```

Luego elegir **Verificar** en el espacio del documento. Una vez marcado como verificado, documentación y MCP se sirven desde ese dominio (documento activo, modos activos).

## Gestionar vinculaciones

- **Listar** los dominios vinculados al documento, con estado y ruta base.
- **Verificar** una vinculación pendiente tras el registro DNS.
- **Eliminar** una vinculación para dejar de servir desde ese dominio.

Cambiar indicadores de acceso invalida la resolución de host en caché, para que las actualizaciones surtan efecto de inmediato y no se sirvan vinculaciones antiguas.

## Los controles de acceso siguen aplicando

El dominio personalizado no es una vía de omisión: las mismas puertas aplican.

- El documento debe estar `ACTIVE`.
- Cada modo tiene su indicador activo.
- La contraseña de visualización sigue protegiendo la documentación y la clave de acceso el MCP.

Vea [Control de acceso](./access-control).

Vea también: [Documentos y versiones](./documents-versions)、[Facturación](./billing).
