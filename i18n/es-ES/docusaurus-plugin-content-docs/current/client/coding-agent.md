---
title: "Conectar OpenAPI a un agente de programación"
description: "Conectar OpenAPI a un agente de programación"
---

# Conectar OpenAPI a un agente de programación

Usa **MCP para desarrolladores** para que un agente de programación examine un contrato y verifique un backend. **API-to-MCP** convierte las operaciones de una API en herramientas invocables; es un flujo de trabajo distinto.

1. Abre el archivo YAML/JSON con **Abrir** en la aplicación de escritorio. Guarda una copia independiente antes de experimentar.
2. Abre **MCP y programación** para la especificación actual. También puedes ejecutar `npm ci` y `npm run build` desde una copia local del repositorio de MCP para desarrolladores.
3. Configura un servidor MCP stdio en tu agente con el ejecutable `node` y los argumentos `/absolute/path/dev-mcp-server/dist/cli.mjs`, `--spec`, `/absolute/path/openapi.yaml`. Usa rutas absolutas reales; no pegues literalmente los valores de ejemplo.
4. Pide al agente que lea una operación y su esquema de respuesta antes de modificar el backend. Después del cambio, pídele que invoque `run_contract_tests` con la `baseUrl` local del backend indicada explícitamente.
5. Revisa las aserciones del informe y el parche de código propuesto. Vuelve a ejecutar las pruebas tras aplicar una corrección que hayas aceptado.

El servidor MCP para desarrolladores requiere Node.js 22.12.0 o posterior. Tu agente puede enviar resultados de herramientas o contexto de código al modelo remoto configurado. No necesitas un modelo para realizar solicitudes locales y pruebas de contrato manualmente. Tu proveedor factura el uso de tu clave; los créditos de modelos alojados se contabilizan por separado. No se requiere una suscripción a Cloud para trabajar en local.

[Descargar la aplicación de escritorio](https://www.powerduck.com/es/download/) · [Inicio rápido](https://www.powerduck.com/docs/es-ES/overview/quickstart/)
