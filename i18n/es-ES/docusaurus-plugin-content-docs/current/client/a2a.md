---
sidebar_position: 6
title: "Agentes A2A"
description: "Diseña, depura y documenta A2A con JSON-RPC, REST, gRPC de escritorio, verificación JWS y una demo local ejecutable."
---

# Agentes A2A

MCP expone herramientas y recursos; A2A permite delegar trabajo entre agentes, intercambiar mensajes y seguir tareas y resultados. Powerduck conserva ambos como protocolos distintos dentro de una misma especificación local.

## Crear y depurar

1. Selecciona **Nueva solicitud → A2A**. El valor predeterminado es **1.0 / JSON-RPC**. La versión 1.0 también admite REST y gRPC de escritorio; 0.3 solo JSON-RPC. No se convierten versiones de forma implícita.
2. Configura el endpoint y el método. Pulsa **Generar cuerpo de solicitud**, revisa la vista previa y confirma con **Reemplazar cuerpo de solicitud**. Cancelar o cambiar solo el método conserva el borrador.
3. En JSON-RPC edita `params`; en REST/gRPC edita directamente el objeto, sin el sobre exterior `jsonrpc`, `id`, `params`. Configura credenciales en Auth y cabeceras. El envío añade `A2A-Version`.
4. Revisa toda la respuesta: HTTP 200 puede contener un `error` RPC. JSON-RPC 1.0 devuelve un `task` o `message` dentro de `result`.
5. Guarda en la especificación. `x-a2a` conserva configuración, ejemplos y contratos. JSON-RPC usa el método del cuerpo; REST/gRPC el seleccionado. El ID de solicitud y el de mensaje son distintos. Para continuar una conversación, conserva los identificadores de contexto y tarea devueltos.

## Transportes

La URL REST es la base, por ejemplo `https://agent.example/rest`. El método determina verbo HTTP y ruta. Los ID de tarea se codifican y los filtros y la paginación se convierten en parámetros de consulta. El depurador y la documentación comparten este mapeo.

gRPC requiere la aplicación de escritorio. Usa `https://host:port` para TLS con certificados de confianza del sistema, o `http://localhost:port` para pruebas locales sin cifrado, sin ruta adicional. Las cabeceras se convierten en metadatos. Se utilizan el descriptor oficial `lf.a2a.v1.A2AService` y ProtoJSON. Este transporte rechaza scripts HTTP, proxys y configuración TLS personalizada.

## Agent Card y JWS

**Obtener Agent Card pública** consulta normalmente `/.well-known/agent-card.json`. Revisa versión, capacidades, habilidades y autenticación antes de aplicar explícitamente una interfaz. Obtener la ficha no cambia el endpoint ni reenvía credenciales a otro origen. El descubrimiento público no envía credenciales ni sigue redirecciones y limita la respuesta a 1 MiB. El navegador necesita CORS.

Abre **Verificar firma JWS** y pega un JWKS público obtenido por un canal de confianza. La verificación es local y nunca consulta las URL de claves de la ficha. Cubre los campos estándar A2A 1.0, no campos personalizados. La normalización sigue la presencia de campos A2A y RFC 8785, preservando cadenas y matrices vacías obligatorias y booleanos opcionales explícitos. Las firmas que eliminan estos valores se rechazan. Una firma válida no identifica por sí sola a la organización dueña de una clave desconocida.

Guardar la ficha conserva una instantánea, no una decisión de confianza. Elimina metadatos privados antes de compartir. Para fichas protegidas utiliza el método extended-card autenticado.

## Tareas y streaming

En 1.0 usa `SendStreamingMessage` o `SubscribeToTask`; en 0.3, `message/stream` o `tasks/resubscribe`. Puedes inspeccionar eventos SSE o gRPC nativos, estados y resultados. **Detener** solo desconecta la solicitud local. Para cancelar remotamente envía `CancelTask` o `tasks/cancel` con el ID de tarea. Una tarea finalizada no se puede reiniciar sin más.

Obtener tareas, listarlas en 1.0, acceder a fichas ampliadas y configurar notificaciones depende de las capacidades del agente. Powerduck no aloja un receptor de notificaciones push.

## Extensión OpenAPI

`x-a2a` es una extensión de Powerduck, no una Agent Card estándar ni una palabra clave OpenAPI. La ruta documentada identifica la operación; `endpoint` es la dirección real.

```yaml
openapi: 3.2.0
info:
  title: A2A demo
  version: 1.0.0
paths:
  /agents/research/send:
    post:
      summary: SendMessage
      x-protocol: a2a
      x-a2a:
        version: '1.0'
        binding: JSONRPC
        endpoint: https://agent.example.com/rpc
        agentCardUrl: https://agent.example.com/.well-known/agent-card.json
        method: SendMessage
        requestSchema:
          type: object
          description: A2A SendMessage
        responseSchema:
          type: object
          description: JSON-RPC
        example:
          jsonrpc: '2.0'
          id: request-1
          method: SendMessage
          params:
            message:
              messageId: message-1
              role: ROLE_USER
              parts:
                - text: 12 30
      responses:
        '200':
          description: A2A result / error
          content:
            application/json:
              schema:
                type: object
```

`version` es `1.0` o `0.3`; `binding` es `JSONRPC`, y en 1.0 también `HTTP+JSON` o `GRPC`. `agentCardUrl` indica el descubrimiento y `agentCard` una instantánea opcional. `example` contiene un sobre JSON-RPC o un objeto REST/gRPC. `requestSchema` y `responseSchema` son contratos explícitos, no deducidos de una sola respuesta. SSE usa `text/event-stream` e `itemSchema` de OAS 3.2. La documentación y Copy for LLM conservan la configuración; gRPC muestra ProtoJSON y los transportes HTTP sus ejemplos de código.

## Generar un servidor

Abre **Generar servidor → Descargar proyecto del servidor** para obtener un proyecto Node.js 22+. Ejecuta `npm install`, configura `A2A_TOKEN` con al menos 32 caracteres aleatorios y `HANDLER_URL`, y ejecuta `npm start`. El controlador HTTP recibe `{message, contextId}` y devuelve un Message con `parts` no vacío. No se exportan credenciales existentes.

El servidor limita tamaños y concurrencia, aplica un plazo de 60 segundos y libera recursos al cerrar. `SIGNING_JWK_FILE` activa la firma y `CORS_ORIGINS` permite orígenes de navegador explícitos. Es un adaptador sin estado, sin motor de tareas persistentes ni entrega push. Antes de publicarlo configura URL, TLS, límites del proxy inverso y autenticación multiusuario.

## Demo local ejecutable

El repositorio React incluye `examples/a2a-demo`, una calculadora de sumas sin clave de IA ni servicios externos. Requiere Node.js 22+.

```bash
cd powerduck-react/examples/a2a-demo
npm ci
npm start
```

```bash
npm test
```

Ejecuta `npm test` en otra terminal del mismo directorio. Importa `openapi.json` y usa Bearer Token `powerduck-local-demo-token-0123456789`. Enviar `[12,30]` devuelve `Sum: 42` y el dato estructurado `total: 42`. JSON-RPC: `http://127.0.0.1:9999/rpc`; REST: `http://127.0.0.1:9999/rest`; gRPC: `http://127.0.0.1:9998`. Ficha: `http://127.0.0.1:9999/.well-known/agent-card.json`. La clave pública local fiable está en `.runtime/trusted-jwks.json` y cambia al reiniciar.

Las pruebas usan puertos aislados y verifican los tres transportes, SSE, respuestas estructuradas, rechazo de modificaciones, autenticación y CORS. La demo solo escucha localmente y no implementa tareas persistentes ni push. No publiques con su token. Los orígenes predeterminados son `http://localhost:3000` y `http://127.0.0.1:3000`; configura otros con `CORS_ORIGINS`.

[A2A 1.0](https://a2a-protocol.org/v1.0.0/specification/) · [A2A 0.3](https://a2a-protocol.org/v0.3.0/specification/)
