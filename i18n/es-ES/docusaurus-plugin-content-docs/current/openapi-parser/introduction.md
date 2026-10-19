---
sidebar_position: 1
title: "Introducción"
description: "Convierte cualquier documento Swagger 2.0, OpenAPI 3.0, 3.1 o 3.2 a OpenAPI 3.2 con una sola llamada."
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

Convierte cualquier documento Swagger 2.0, OpenAPI 3.0, 3.1 o 3.2 a OpenAPI 3.2 con una sola llamada.

Es una capa ligera sobre estas dos bibliotecas: [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
No reimplementa el análisis, la validación ni la conversión; los conecta y da a todos los errores una estructura uniforme y predecible con un código legible por máquina.

- **Nombre del paquete:** `@powerduck/openapi-parser`
- **Versión:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **Licencia:** MIT
- **Node.js:** >= 22.12.0

## Funciones

- **Una función para todas las versiones** — Swagger 2.0, OpenAPI 3.0.x, 3.1.x y 3.2.x se convierten en un documento 3.2 validado.
- **Entrada como cadena JSON o YAML** — Acepta un objeto ya analizado o una cadena JSON/YAML sin procesar.
- **Códigos de error legibles por máquina** — Cada fallo genera un `OpenApiUpgradeError` con un valor de la enumeración `UpgradeErrorCode`.
- **Sin modificar la entrada** — La entrada se copia en profundidad mediante `structuredClone` antes de ejecutar cualquier fase de conversión.
- **Protección contra referencias circulares** — Detecta ciclos en la entrada antes de que provoquen un desbordamiento de pila.
- **Validación de la salida** — El documento 3.2 convertido se valida frente al esquema de forma predeterminada.
- **ESM y CJS** — Usa `import` en Node moderno y empaquetadores, y `require()` en el proceso principal de Electron.

## Siguientes pasos

- [Instalación](/docs/es-ES/openapi-parser/installation/) — instalación y requisitos
- [Inicio rápido](/docs/es-ES/openapi-parser/quickstart/) — convierte tu primer documento
- [Referencia de la API](/docs/es-ES/openapi-parser/api-reference/) — todas las exportaciones, códigos de error y opciones
- [Ejemplos](/docs/es-ES/openapi-parser/examples/) — gestión de errores, opciones y uso con CommonJS
