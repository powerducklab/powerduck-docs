---
title: Saving requests and protocol examples
description: Separate local debugging state from OpenAPI definitions, with official Powerduck protocol examples.
---

# Saving requests and protocol examples

Powerduck separates the request you are trying from the contract you publish.

| Action | Result |
| --- | --- |
| URL bar Save | Saves this request's local debugging configuration. Does not modify the OpenAPI document. |
| Quick request: Save to spec | Adds an operation to a selected document and folder. |
| Spec request: Update spec | Shows the target method/path and definition preview before updating the contract. |
| Document Save / Cmd+S or Ctrl+S | Writes the current OpenAPI document to disk. In a quick-request tab the shortcut saves that quick request. |

The local request contains the selected server, URL, method, parameter values, body, scripts and transport settings. Spec request drafts stay in memory during editing; URL bar Save persists them in the application's renderer storage under `powerduck.debug.v1:`. Entries are scoped by document ID, path and method. Browser/desktop application data removal clears this local state; exporting an OAS file does not include it. This storage is **not an encrypted secret vault**: use environment references instead of literal credentials in request URLs, headers or bodies. Authentication controls use their separate credential persistence path.

`x-powerduck-request` is **not an official contract extension**. It is not emitted by Add to spec or Update spec. It must not be used to describe a method, parameter, request body or response. Existing copies in unrelated operations are not rewritten just by opening a document.

## Update a definition deliberately

Update spec previews the destination method and path and keeps existing responses and schemas. Parameter definitions are opt-in; debugging parameter values are not copied. A JSON body can be included as an example only when explicitly selected. Common credential field names are excluded, but **review arbitrary text and examples before publishing**. Scripts and authentication overrides are not contract fields.

An existing target operation cannot be overwritten by changing a method or path. Local operation references are retargeted. A custom method such as `PURGE` is stored in `paths./cache.additionalOperations.PURGE`; it requires OpenAPI 3.2. The preview states this requirement and applying such an update sets the document version to 3.2.0. This version change should also be checked against downstream tool support.

Protocol schema editing remains available through Edit documentation. It changes the definition explicitly; sending or saving a debug request does not silently rewrite protocol schemas.

## Official downloadable examples

These are maintained **example definitions**, not public Powerduck API services. All endpoints point to local services you provide. Importing a file does not start those services, connect automatically or grant credentials.

- [All protocols](pathname:///docs/examples/protocols/all-protocols.yaml)
- [HTTP and custom PURGE](pathname:///docs/examples/protocols/http.yaml)
- [SSE](pathname:///docs/examples/protocols/sse.yaml)
- [WebSocket](pathname:///docs/examples/protocols/websocket.yaml)
- [GraphQL](pathname:///docs/examples/protocols/graphql.yaml)
- [gRPC](pathname:///docs/examples/protocols/grpc.yaml) and [echo.proto](pathname:///docs/examples/protocols/echo.proto)
- [MCP Streamable HTTP](pathname:///docs/examples/protocols/mcp.yaml)
- [A2A 1.0 JSON-RPC](pathname:///docs/examples/protocols/a2a.yaml)

For gRPC, download `echo.proto` beside the YAML file, then select its actual local path in the client if necessary. The server must implement `powerduck.examples.Echo/Echo` on port 50051. The other examples likewise require a matching server; they are not demonstrations of live backend validation.

## Contract extension reference

Every operation has an ordinary OAS method, operationId, summary and responses. Non-HTTP bindings use an OAS operation as their documentation anchor; `post` in the gRPC example does not mean gRPC was converted into a REST endpoint.

| Extension | Meaning and fields used by the examples |
| --- | --- |
| `x-protocol` | `sse`, `websocket`, `graphql`, `grpc`, `mcp`, or `a2a`. HTTP can omit it. |
| `x-session` | Declares a long-lived protocol session; examples use it for WebSocket and MCP. |
| `x-websocket` | `url`, optional `subprotocols`, `headers`, and `messages`. Each documented message has `id`, `name`, `type`, `body`, `requestSchema`, `responseSchema`. Keep headers free of credentials. |
| `x-graphql` | `endpoint`, `query`, `operationName`, `variablesSchema`, public `variables`, `responseSchema`. |
| `x-grpc` | `address`, `service`, `method`, `kind`, `reflection`, `protoPaths`, `includeDirs`, documented `messages`. `kind` supports unary/server_streaming/client_streaming/bidi_streaming. Local proto paths are deployment-specific. |
| `x-mcp` | `transport`, `endpoint`, `method`, and method-specific `name`, `argumentsSchema`, public `arguments`, `responseSchema`. Resource operations use `uri`; do not combine unrelated method fields. |
| `x-a2a` | Explicit `version`, `binding`, `endpoint`, `method`, `requestSchema`, `responseSchema` and public `example`. 0.3 and 1.0 payloads are different; see [A2A](pathname:///docs/client/a2a/). |
| `x-response-stream` | Optional GraphQL streaming intent, used when the actual server and transport support streaming. Not required for ordinary GraphQL requests. |

SSE uses standard `responses.200.content.text/event-stream.itemSchema` to describe each event payload. HTTP uses standard parameters, requestBody, responses and security schemes. Do not invent an `x-sse` configuration block or store debugging state as a contract extension.

The examples include complete usable configurations for their chosen binding, rather than every mutually exclusive option. MCP stdio requires a separately configured local executable; it is intentionally not auto-launched by these downloadable examples.

## Package integration

The desktop UI owns local debug persistence and explicit spec writes. `@powerduck/openapi-parser` already reads custom methods through `additionalOperations`; `@powerduck/tree` and `@powerduck/oas-document` consume that contract shape. `@powerduck/openapi-request` receives runtime arguments separately from the specification. Request execution does not require `x-powerduck-request`.

The save separation introduces no new public npm parameters. Use the existing protocol extensions for contract data and pass current debugging values to the request execution API. Do not teach exporters, generators or MCP tools to consume the private request-state envelope.
