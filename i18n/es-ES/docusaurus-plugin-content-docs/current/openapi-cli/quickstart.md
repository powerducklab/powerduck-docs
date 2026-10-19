---
sidebar_position: 3
title: "Inicio rápido"
description: "Ejecuta tu primera batería de pruebas con @powerduck/openapi-cli desde la CLI y desde Node.js."
---

# Inicio rápido

Esta guía te acompaña en las primeras pruebas de un documento OpenAPI.

## Requisitos previos

- Node.js `>= 22.12.0`.
- Un documento OpenAPI 3.2 en **JSON**. No se acepta YAML: conviértelo antes a JSON. El documento debe incluir un objeto `paths` en el nivel superior.

## 1. Ejecutar desde la CLI

La ejecución más sencilla carga una especificación local y prueba todas las operaciones contra la primera URL de servidor declarada:

```bash
openapi-cli --spec openapi.json
```

Cambia el servidor de destino y guarda los informes en otro directorio:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Prueba una especificación remota, solo con operaciones `GET` y 10 trabajadores simultáneos:

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

Para configuraciones complejas, usa un archivo de configuración JSON:

```bash
openapi-cli --config openapi-cli.config.json
```

Consulta todas las opciones en [Comandos](/docs/es-ES/openapi-cli/commands/).

## 2. Crear una especificación mínima

Documento OpenAPI mínimo con aserciones declarativas:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Demo API", "version": "1.0.0" },
  "servers": [{ "url": "https://httpbin.org" }],
  "paths": {
    "/get": {
      "get": {
        "operationId": "getGet",
        "responses": { "200": { "description": "ok" } },
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "response under 5s", "assert": "responseTime", "max": 5000 }
        ]
      }
    }
  }
}
```

Si una operación **no** define aserciones, el ejecutor añade una comprobación implícita de éxito del protocolo. Para HTTP, exige un estado `2xx`, evitando marcar respuestas 4xx/5xx como correctas sin avisar.

## 3. Ejecutar desde Node.js (API programática)

La biblioteca expone el mismo flujo mediante funciones: `resolveConfig` → `runTests` → generadores de informes.

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

// 1. Build a CliConfig from CLI-style args.
const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
});

// 2. Run all collected tests.
const report = await runTests(config);

// 3. Emit the reports you need.
printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

// 4. Exit with the correct code for CI.
if (report.summary.failed > 0 || report.summary.errors > 0) {
  process.exit(1);
}
```

`resolveConfig` acepta la misma estructura de opciones que la CLI. `runTests` devuelve un `TestReport` con `summary`, `results`, `config`, `generatedAt` y `version`. [Configuración](/docs/es-ES/openapi-cli/configuration/).

## 4. Códigos de salida para CI

| Código | Significado |
|---|---|
| `0` | Todas las pruebas pasaron, o se indicó `--no-fail-on-error`. |
| `1` | Una o más pruebas fallaron o produjeron errores. |
| `2` | Error de configuración, fallo al cargar la especificación o error fatal de ejecución. |

## Siguientes pasos

- [Configuración](/docs/es-ES/openapi-cli/configuration/) — todos los campos de `CliConfig` y sus valores predeterminados.
- [Comandos](/docs/es-ES/openapi-cli/commands/) — todas las opciones de la CLI.
- [Ejemplos](/docs/es-ES/openapi-cli/examples/) — autenticación, filtros, informes y aserciones.
- [Referencia de API](/docs/es-ES/openapi-cli/api-reference/) — todas las funciones y tipos exportados.
