---
sidebar_position: 1
title: "Bibliotecas de código abierto"
description: "Los paquetes npm @powerduck/* impulsan el cliente de escritorio y Cloud: análisis y actualización, CLI multiprotocolo, generación de código, MCP, solicitudes, conversión y editores integrables."
---

# Bibliotecas de código abierto

Powerduck se compone de pequeños paquetes npm combinables. El cliente de escritorio y el servicio cloud utilizan estas mismas bibliotecas, por lo que los mismos componentes funcionan en local, a través de la red o dentro de sus herramientas.

Cada paquete se publica de forma independiente, con su propia instalación, referencia de API y ejemplos. Esta página explica qué hace cada uno y cómo se relacionan.

## Organización por capas

```text
Powerduck / Cloud
        ↓
Interfaces integrables
        ↓
Flujos de trabajo
        ↓
Base
```

El analizador y los convertidores forman la base. Sobre ellos se construyen los flujos de trabajo y, por encima, las interfaces integrables. Compartir la base evita reimplementar el análisis en cada paquete y mantiene un comportamiento coherente.

## Los paquetes

### Base

| Paquete | Función |
|---|---|
| [`@powerduck/openapi-parser`](../openapi-parser/introduction.md) | Analizar, validar y actualizar documentos OpenAPI/Swagger |
| [`@powerduck/conf-patch`](../conf-patch/introduction.md) | Aplicar cambios de configuración estructurados y validados |
| [`@powerduck/x-to-openapi`](../x-to-openapi/introduction.md) | Convertir otros formatos, como cURL y Postman, a OpenAPI |

### Flujos de trabajo

| Paquete | Función |
|---|---|
| [`@powerduck/openapi-cli`](../openapi-cli/introduction.md) | Flujos multiprotocolo por línea de comandos, incluida la ejecución de escenarios |
| [`@powerduck/openapi-codegen`](../openapi-codegen/introduction.md) | Generar código cliente y otros artefactos a partir de una especificación |
| [`@powerduck/openapi-mcp-server`](../openapi-mcp-server/introduction.md) | Ofrecer una especificación OpenAPI como servidor MCP |
| [`@powerduck/openapi-request`](../openapi-request/introduction.md) | Ejecutar las solicitudes descritas en una especificación |

### Interfaces integrables

| Paquete | Función |
|---|---|
| [`@powerduck/oas-document`](../oas-document/introduction.md) | Mostrar OpenAPI como documentación legible, con punto de entrada para React |
| [`@powerduck/md-editor`](../md-editor/introduction.md) | Editor Markdown integrable |
| [`@powerduck/schema-editor`](../schema-editor/introduction.md) | Editor JSON Schema integrable |
| [`@powerduck/tree`](../tree/introduction.md) | Componente de árbol para datos estructurados |
| [`@powerduck/workspace-yaml`](../workspace-yaml/introduction.md) | Integración de YAML del espacio de trabajo |

## Elegir el paquete adecuado

- **Leer, validar o actualizar un archivo OpenAPI:** empiece por `openapi-parser`.
- **Convertir cURL o una colección Postman a OpenAPI:** use `x-to-openapi`.
- **Ejecutar escenarios o flujos multiprotocolo desde la línea de comandos o CI:** use `openapi-cli`.
- **Generar código cliente:** use `openapi-codegen`.
- **Exponer una API como herramientas para un agente de IA:** use `openapi-mcp-server`.
- **Integrar documentación renderizada en una aplicación React:** use `oas-document`, su entrada React y su CSS.
- **Integrar un editor:** use `md-editor` o `schema-editor`.

## Compartir capacidades con agentes

El paquete de servidor MCP permite a los agentes de IA externos acceder a las capacidades de Powerduck. Una especificación servida mediante `openapi-mcp-server` expone sus operaciones como herramientas MCP. Así, un agente puede invocar directamente el mismo contrato que genera la documentación y el código. El cliente de escritorio, Cloud y las demás herramientas compatibles con MCP comparten una única definición de referencia.

## Sobre los ejemplos

Los ejemplos de código utilizan la API real de cada paquete y están pensados para ejecutarse tal como se muestran. Tras actualizar un paquete, consulte sus notas de versión para conocer los parámetros vigentes en lugar de copiar fragmentos de versiones anteriores.

Consulte cada paquete en la barra lateral para acceder a su instalación, configuración y referencia completa de API.
