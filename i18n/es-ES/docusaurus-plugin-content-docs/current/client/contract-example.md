---
title: "Detectar errores de implementación con pruebas de contrato"
description: "Detectar errores de implementación con pruebas de contrato"
---

# Detectar errores de implementación con pruebas de contrato

Este ejemplo utiliza el ejecutor MCP para desarrolladores, con validación del esquema de respuesta disponible desde la versión 0.7.6. Requiere Node.js 22.12.0 o posterior. Usa datos ficticios y un backend que solo escucha en la interfaz de bucle local; tras instalar las dependencias no necesita cuenta, modelo ni API pública.

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

La respuesta es `{"total":"42"}`, pero el esquema exige un número. El validador real informa de `/total must be number` y termina con el código 1.

```sh
node examples/contract-total/verify.mjs --correct
```

Ahora el backend devuelve `{"total":42}`; la misma comprobación pasa y termina con el código 0. Para corregir la implementación tú mismo, modifica la expresión `total` en `examples/contract-total/server.mjs` para que devuelva un número. No debilites el contrato para ocultar el error.

Cada ejecución asigna un puerto local libre y apaga su servidor al terminar. Los archivos y comandos están en [el proyecto de ejemplo](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total). Actualmente, las comprobaciones del esquema cubren respuestas JSON, sin validación de formatos ni descarga de esquemas remotos. Si un tipo de contenido no compatible requiere validación, se informa de esa limitación en lugar de dar la prueba por superada.

Esta prueba comprueba un backend real. Una solicitud Mock correcta solo demuestra el flujo de ejemplo. Opcionalmente, un agente de programación puede usar `run_contract_tests` con un `baseUrl` explícito para realizar la misma verificación; revisa el parche antes de aplicarlo.

[Descargar la aplicación de escritorio](https://www.powerduck.com/es/download/) · [Inicio rápido](https://www.powerduck.com/docs/es-ES/overview/quickstart/)
