---
title: "Guardar solicitudes y ejemplos de protocolos"
description: "Powerduck separa la solicitud que está probando del contrato que publica."
---

# Guardar solicitudes y ejemplos de protocolos

Powerduck separa la solicitud que está probando del contrato que publica.

| Acción | Resultado |
| --- | --- |
| Guardar en la barra de URL | Guarda la configuración local de depuración de la solicitud sin modificar el documento OpenAPI. |
| Solicitud rápida: guardar en la especificación | Añade una operación al documento y la carpeta seleccionados. |
| Solicitud de la especificación: actualizar especificación | Muestra el método, la ruta de destino y una vista previa de la definición antes de actualizar el contrato. |
| Guardar documento / Cmd+S o Ctrl+S | Escribe el documento OpenAPI actual en disco. En una pestaña de solicitud rápida, el atajo guarda esa solicitud rápida. |

La solicitud local contiene el servidor seleccionado, la URL, el método, los valores de parámetros, el cuerpo, los scripts y la configuración de transporte. Los borradores de solicitudes de la especificación permanecen en memoria durante la edición; Guardar en la barra de URL los conserva en el almacenamiento del proceso de renderizado bajo `powerduck.debug.v1:`. Las entradas se separan por ID de documento, ruta y método. Borrar los datos del navegador o de la aplicación elimina este estado local; el archivo OAS exportado no lo incluye. Este almacenamiento **no es una bóveda cifrada de secretos**: use referencias de entorno en lugar de credenciales en claro en URL, cabeceras o cuerpos. Los controles de autenticación utilizan un mecanismo independiente de persistencia de credenciales.

`x-powerduck-request` **no es una extensión oficial del contrato**. Las acciones de añadir o actualizar la especificación no la generan. No debe describir métodos, parámetros, cuerpos de solicitud ni respuestas. Abrir un documento no reescribe las copias existentes en otras operaciones.

## Actualizar una definición de forma explícita

Actualizar especificación previsualiza el método y la ruta de destino y conserva las respuestas y esquemas existentes. Las definiciones de parámetros se incluyen solo si se seleccionan; los valores de depuración no se copian. Un cuerpo JSON solo se incorpora como ejemplo al seleccionarlo expresamente. Se excluyen los nombres de campos de credenciales habituales, pero **revise el texto libre y los ejemplos antes de publicar**. Los scripts y las anulaciones de autenticación no son campos del contrato.

No se puede sobrescribir una operación de destino existente cambiando el método o la ruta. Las referencias locales a operaciones se ajustan. Un método personalizado como `PURGE` se guarda en `paths./cache.additionalOperations.PURGE` y requiere OpenAPI 3.2. La vista previa indica este requisito y, al aplicar el cambio, establece la versión del documento en 3.2.0. Compruebe también la compatibilidad con las herramientas que consumirán el documento.

Los esquemas de protocolo siguen siendo editables desde Editar documentación. Esta acción cambia expresamente la definición; enviar o guardar una solicitud de depuración no reescribe los esquemas de forma silenciosa.

## Ejemplos oficiales descargables

Son **definiciones de ejemplo** mantenidas, no servicios API públicos de Powerduck. Todos los endpoints apuntan a servicios locales que debe proporcionar. Importar un archivo no inicia esos servicios, no conecta automáticamente ni proporciona credenciales.

- [Todos los protocolos](https://www.powerduck.com/docs/examples/protocols/all-protocols.yaml)
- [HTTP y PURGE personalizado](https://www.powerduck.com/docs/examples/protocols/http.yaml)
- [SSE](https://www.powerduck.com/docs/examples/protocols/sse.yaml)
- [WebSocket](https://www.powerduck.com/docs/examples/protocols/websocket.yaml)
- [GraphQL](https://www.powerduck.com/docs/examples/protocols/graphql.yaml)
- [gRPC](https://www.powerduck.com/docs/examples/protocols/grpc.yaml) y [echo.proto](https://www.powerduck.com/docs/examples/protocols/echo.proto)
- [MCP Streamable HTTP](https://www.powerduck.com/docs/examples/protocols/mcp.yaml)
- [A2A 1.0 JSON-RPC](https://www.powerduck.com/docs/examples/protocols/a2a.yaml)

Para gRPC, descargue `echo.proto` junto al archivo YAML y seleccione su ruta local real en el cliente si es necesario. El servidor debe implementar `powerduck.examples.Echo/Echo` en el puerto 50051. Los demás ejemplos también requieren un servidor compatible; no son demostraciones de validación contra un backend en funcionamiento.

## Referencia de extensiones del contrato

Cada operación tiene un método OAS ordinario, operationId, summary y responses. Las vinculaciones no HTTP usan una operación OAS como referencia documental; `post` en el ejemplo gRPC no significa que gRPC se haya convertido en un endpoint REST.

| Extensión | Significado y campos usados en los ejemplos |
| --- | --- |
| `x-protocol` | `sse`, `websocket`, `graphql`, `grpc`, `mcp` o `a2a`. HTTP puede omitirla. |
| `x-session` | Declara una sesión de protocolo duradera; los ejemplos la usan para WebSocket y MCP. |
| `x-websocket` | `url`, `subprotocols` opcional, `headers` y `messages`. Cada mensaje documentado tiene `id`, `name`, `type`, `body`, `requestSchema`, `responseSchema`. No incluya credenciales en las cabeceras. |
| `x-graphql` | `endpoint`, `query`, `operationName`, `variablesSchema`, `variables` públicas, `responseSchema`. |
| `x-grpc` | `address`, `service`, `method`, `kind`, `reflection`, `protoPaths`, `includeDirs` y `messages` documentados. `kind` admite unary/server_streaming/client_streaming/bidi_streaming. Las rutas proto locales dependen del despliegue. |
| `x-mcp` | `transport`, `endpoint`, `method` y los campos específicos del método `name`, `argumentsSchema`, `arguments` públicos, `responseSchema`. Las operaciones sobre recursos usan `uri`; no mezcle campos de métodos sin relación. |
| `x-a2a` | `version`, `binding`, `endpoint`, `method`, `requestSchema`, `responseSchema` explícitos y `example` público. Los mensajes de 0.3 y 1.0 son diferentes; consulte [A2A](./a2a.md). |
| `x-response-stream` | Intención opcional de streaming GraphQL, para cuando el servidor y el transporte reales admitan streaming. No es necesaria para solicitudes GraphQL normales. |

SSE usa el campo estándar `responses.200.content.text/event-stream.itemSchema` para describir el contenido de cada evento. HTTP usa parámetros, requestBody, responses y esquemas de seguridad estándar. No invente un bloque `x-sse` ni almacene el estado de depuración como extensión del contrato.

Los ejemplos incluyen configuraciones completas y utilizables para la vinculación elegida, no todas las opciones mutuamente excluyentes. MCP stdio requiere un ejecutable local configurado por separado; estos ejemplos descargables no lo inician automáticamente de forma deliberada.

## Integración de paquetes

La interfaz de escritorio gestiona la persistencia local de depuración y la escritura explícita de la especificación. `@powerduck/openapi-parser` ya lee métodos personalizados mediante `additionalOperations`; `@powerduck/tree` y `@powerduck/oas-document` consumen esa estructura. `@powerduck/openapi-request` recibe argumentos de ejecución separados de la especificación. Ejecutar solicitudes no requiere `x-powerduck-request`.

La separación del guardado no añade parámetros npm públicos. Use las extensiones de protocolo existentes para los datos del contrato y pase los valores de depuración actuales a la API de ejecución. No haga que exportadores, generadores o herramientas MCP dependan de la estructura privada del estado de las solicitudes.
