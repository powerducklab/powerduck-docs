---
sidebar_position: 5
title: Control de acceso
description: "Proteja la documentación con contraseña de visualización y expiración, el MCP con clave de acceso, y configure la autenticación upstream del servidor MCP. Entienda cada puerta que decide la apertura."
---

# Control de acceso

Powerduck separa **cómo un lector accede a la documentación** y **cómo un cliente accede al endpoint MCP**, porque las formas de consumo son distintas. Además configura cómo el servidor MCP se autentica ante la API upstream.

## Cada puerta (en orden)

Varias condiciones deciden si una superficie pública abre; la lista completa responde al frecuente «¿por qué no abre mi documentación?».

1. **Estado del documento** — debe estar `ACTIVE` (ni pausado, archivado ni eliminado).
2. **Modo activo** — `documentationEnabled` para documentación, `mcpEnabled` para MCP.
3. **Credenciales** — contraseña de visualización para documentación si está configurada, clave de acceso para MCP.
4. **Fecha de expiración** — la visualización puede caducar en un momento fijo.

El artefacto publicado detrás de cada modo se construye automáticamente tras añadir versión o cambiar exposición, por lo que la publicación normalmente no es manual.

Cada modo es independiente: desactivar MCP no afecta la documentación, y la contraseña de documentación no protege el MCP.

## Contraseña de visualización

La contraseña protege la documentación renderizada y los datos de la spec servidos.

- La contraseña se guarda hasheada con **scrypt** y una sal aleatoria por contraseña; nunca en texto plano.
- Una vez fijada, el lector debe introducirla antes de que se sirva.
- Es **específica de la documentación**: el endpoint MCP usa su propia clave e ignora la contraseña de visualización.

También puede fijarse una **fecha de expiración**; tras caducar se rechaza incluso la contraseña correcta. Quitar contraseña o expiración levanta la restricción.

## Clave de acceso del endpoint MCP

El endpoint MCP se protege con una **clave de acceso** propia.

- Cree una clave (o reemplácela); la clave completa se devuelve solo **una vez**, luego se muestran solo los últimos cuatro caracteres.
- Una vez configurada, toda petición MCP debe presentarla como token `Bearer`.
- Las claves presentadas se comparan en **tiempo constante**, y ausencia/error da `401`.

Borrar la clave abre el endpoint si el documento está activo y MCP activado.

## Autenticación upstream de MCP

Además de la protección del endpoint, configure cómo el servidor MCP se autentica ante la **API upstream** descrita por la spec. Tipos soportados:

| `authType` | Configuración |
|---|---|
| `NONE` | Sin autenticación upstream |
| `BEARER` | Token Bearer |
| `BASIC` | Usuario y contraseña Basic |
| `APIKEY` | Nombre de la clave API (cabecera/query) y valor |

Los secretos como el token Bearer, contraseña Basic o valor de clave son escribibles pero no legibles; la configuración solo muestra si están fijados.

Otros ajustes MCP:

- **Sobrescritura de URL base** — usar una URL base upstream distinta a la spec.
- **Tiempo límite de petición** — usado por el servidor MCP en llamadas upstream.

## Ajustes recomendados

- **Documentación pública:** documentación activa, sin contraseña para una API abierta o contraseña + expiración para compartir controlado.
- **MCP para sus propios agentes:** activar MCP y crear una clave de acceso para que solo sus clientes llamen.
- **Autenticación upstream:** alinear la autenticación del servidor MCP con los requisitos reales de la API, independientemente de quién pueda llamar al endpoint.

Vea también: [Operaciones expuestas](./exposure)、[Documentos y versiones](./documents-versions)、[Dominios personalizados](./custom-domains).
