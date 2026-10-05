---
sidebar_position: 6
title: A2A agents
description: "Design, debug and document A2A 1.0 JSON-RPC, REST and desktop gRPC, with Agent Card verification and a runnable local demo."
---

# A2A agents

Use A2A when one agent delegates work to another agent. MCP exposes tools and resources; A2A describes agent messages, tasks, status updates and artifacts. Keep both in the same local specification without treating them as the same protocol.

## Create and debug

1. In Debug, select **New request → A2A**. The default is A2A **1.0**, JSON-RPC over HTTP.
2. Set the agent's JSON-RPC endpoint in the URL bar. Select version **0.3** explicitly for older agents; Powerduck does not silently translate between versions.
3. In the Protocol tab, choose a method and click **Generate request body**. Review the preview, then choose **Replace request body** to apply it. Cancel or change the method to keep the existing draft.
4. Edit `params` in the Body tab. Use Auth and Headers for credentials; sending adds the selected `A2A-Version` header.
5. Send the request. Inspect the complete JSON-RPC envelope: HTTP 200 can still contain `error`. Successful 1.0 responses wrap a `task` or `message` inside `result`; 0.3 uses its own response structures.
6. Save the request to the specification. Version, endpoint, method and documented schemas stay in `x-a2a`; the current request draft is retained by the standard Powerduck request extension.

Message IDs and JSON-RPC request IDs are separate. A new example creates fresh IDs. To continue a conversation, preserve the returned context/task identifiers in the next message as required by the selected protocol version.

## Agent Card

Use **Fetch public Agent Card** with an explicit URL, normally `/.well-known/agent-card.json`. Inspect the advertised interfaces, version, skills, authentication and capabilities before configuring the endpoint. Fetching a card does not automatically redirect the request URL or forward credentials to another origin.

Public discovery sends no request credentials and refuses redirects. Desktop uses the native HTTP runner; browser discovery requires CORS. Responses are limited to 1 MiB. For A2A 1.0, expand **Verify JWS signature** and paste trusted public JWKS. Verification is local, supports asymmetric signatures and never follows card-provided key URLs. Required empty values are retained according to the pinned A2A proto. Custom fields outside the standard card schema are not authenticated. Unsigned and unverified cards are clearly labeled; saving a snapshot does not save a trust decision. For protected metadata, use the authenticated extended-card RPC with the request's authentication. **Save card in specification** stores a snapshot only; omit private metadata before sharing or hosting the specification.

## Tasks and streaming

For 1.0 use `SendStreamingMessage` or `SubscribeToTask`; for 0.3 use `message/stream` or `tasks/resubscribe`. Responses use the existing SSE event viewer, with response limits and cancellation controls. The raw status and artifact updates remain available for inspection.

**Stop** disconnects the local request. It does not cancel remote work. Send `CancelTask` (1.0) or `tasks/cancel` (0.3), with the returned task ID, to request remote cancellation. A terminal task cannot simply be restarted.

Task retrieval, listing (1.0), extended cards and push-notification configuration methods are available. A2A 1.0 exposes these through all three bindings; 0.3 uses JSON-RPC. Optional operations depend on the agent's advertised capabilities. Powerduck does not host a push-notification receiver.

## OpenAPI extension

`x-a2a` is a Powerduck OpenAPI extension, not a standard A2A Agent Card or an OpenAPI standard keyword. JSON-RPC operations use `post`. The OpenAPI path identifies the documented operation; `endpoint` is the actual remote JSON-RPC URL.

```yaml
openapi: 3.2.0
info:
  title: Research agent
  version: 1.0.0
paths:
  /agents/research/send:
    post:
      summary: Ask the research agent
      x-protocol: a2a
      x-a2a:
        version: '1.0'
        binding: JSONRPC
        endpoint: https://agent.example.com/rpc
        agentCardUrl: https://agent.example.com/.well-known/agent-card.json
        method: SendMessage
        requestSchema:
          type: object
          description: Application-specific message parameters
        responseSchema:
          type: object
          description: JSON-RPC response envelope
        example:
          jsonrpc: '2.0'
          id: request-1
          method: SendMessage
          params:
            message:
              messageId: message-1
              role: ROLE_USER
              parts:
                - text: Summarize the release notes
      responses:
        '200':
          description: A2A response; inspect result or error
          content:
            application/json:
              schema:
                type: object
```

For streaming responses use `text/event-stream` with OAS 3.2 `itemSchema` describing one JSON-RPC event. The design editor supports independent request/response schemas. Published documentation and Copy for LLM retain the A2A configuration and documented contracts.

| Field | Meaning |
| --- | --- |
| `version` | Supported wire version: `1.0` or `0.3` |
| `binding` | `JSONRPC`; A2A 1.0 additionally supports `HTTP+JSON` and `GRPC` |
| `endpoint` | JSON-RPC endpoint, REST mount URL, or HTTP(S) gRPC authority |
| `method` | Version-specific method: REST/gRPC use this selection; JSON-RPC uses the method in the body |
| `agentCardUrl` | Public discovery URL |
| `agentCard` | Optional saved metadata snapshot |
| `requestSchema`, `responseSchema` | Explicit documented contracts, not inferred from a single captured response |
| `example` | JSON-RPC envelope, or a direct REST/gRPC request object |

## REST and gRPC

Choose a **Transport binding** independently of version and method. A2A 1.0 supports JSON-RPC, REST and native gRPC. A2A 0.3 retains JSON-RPC support; unsupported combinations are rejected rather than silently translated.

For REST, the URL bar contains the mount URL (for example `https://agent.example/rest`). The method determines the HTTP verb and suffix. Edit the direct request object in Body, without `jsonrpc`, `id` and `params` envelope fields. Task identifiers are encoded as path segments; filtering and pagination become query parameters. Debug and documentation code generation share this mapping.

Native gRPC requires the desktop application. Use `https://host:port` for TLS with system certificate trust, or `http://localhost:port` for local plaintext testing. There is no path component. Headers become gRPC metadata. Calls use the official `lf.a2a.v1.A2AService` descriptor, with ProtoJSON conversion for nested data, enums and binary fields. Stop cancels the local call; it does not cancel a remote task. HTTP scripts, proxies and custom TLS settings are rejected for this binding rather than silently ignored.

Version/binding changes preserve the draft. Use **Generate request body**, review the template and confirm **Replace request body** to apply the correct body shape. A mismatched envelope is rejected before sending. Discovered interfaces can be applied explicitly; A2A no longer automatically inherits an unrelated document server.

## Generate a server

Expand **Generate server → Download server project**. The archive contains a Node 22+ project exposing JSON-RPC, REST and gRPC through one HTTP business handler, plus a public Agent Card. Run `npm install`, configure `A2A_TOKEN` (at least 32 random characters) and `HANDLER_URL`, then `npm start`.

The handler receives `{message, contextId}` and returns a Message with nonempty `parts`. No secret or existing request credential is included in the download. The generated service has bounded payloads, a 60-second handler deadline, a concurrency limit, shutdown cleanup and optional JWS signing through `SIGNING_JWK_FILE`.

This is a **stateless message adapter**, not an autonomous model or durable task engine. Persistent tasks, task cancellation and push delivery need a custom executor and durable storage. The card does not advertise push support. Before public deployment, configure public URLs, TLS and HTTP reverse-proxy rate limits, and replace shared-token identity if serving multiple users. These deployment requirements are recorded in the generated README.

## Signature interoperability

Verification follows A2A 1.0 field presence plus RFC 8785 canonical JSON, including required empty strings/arrays and explicitly present optional booleans. Signatures produced by a signer that strips these required fields are rejected; re-sign using a compliant canonicalizer. A successful signature proves the standard fields against the supplied public key, not that an untrusted key belongs to the claimed organization.

References: [A2A 1.0 specification](https://a2a-protocol.org/v1.0.0/specification/) and [A2A 0.3 specification](https://a2a-protocol.org/v0.3.0/specification/).

## Runnable local example

The Powerduck React repository includes `examples/a2a-demo`. With Node.js 22+, run `npm ci` and `npm start` in that directory. Import its `openapi.json` to debug JSON-RPC, REST and desktop gRPC against the same local calculator. The README includes the demo bearer token, Agent Card discovery, trusted local JWKS and streaming instructions. `npm test` validates real transports and signature tamper rejection without external services.

In the protocol panel, **Generate request body** previews the selected method's template. **Replace request body** explicitly applies it; cancelling or changing methods preserves the existing draft.

```bash
cd powerduck-react/examples/a2a-demo
npm ci
npm start
# In another terminal, in the same directory:
npm test
```

Local endpoints: JSON-RPC `http://127.0.0.1:9999/rpc`, REST `http://127.0.0.1:9999/rest`, gRPC `http://127.0.0.1:9998`. The public card is `http://127.0.0.1:9999/.well-known/agent-card.json`. Use demo bearer token `powerduck-local-demo-token-0123456789`. Sending numbers `[12,30]` returns `Sum: 42` and structured `total: 42`. The trusted public key is `.runtime/trusted-jwks.json`; it changes on restart. The demo only listens locally, has no AI-key requirement, persistent task engine or push delivery, and must not be deployed publicly with the demo token. Browser origins default to `http://localhost:3000` and `http://127.0.0.1:3000`; use `CORS_ORIGINS` for other origins. The generated server also supports this explicit allowlist.
