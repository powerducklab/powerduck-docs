---
sidebar_position: 1
title: Introduction
description: "Powerduck keeps one OpenAPI document as the single source of truth across design, debugging, testing, mocking, documentation, and MCP. Use it as a desktop client, a hosted cloud service, or open-source libraries."
---

# Introduction

Most API teams don't have an API problem. They have a **duplication problem**. The contract lives in one place, the request collection in another, the mock server in a third, the documentation in a fourth, and the test scripts in a fifth. Every release means updating all of them by hand, and every missed update is a silent drift between what the API does and what the tooling believes.

Powerduck removes that duplication. It treats the OpenAPI document as the **single source of truth** and makes every other workflow — design, debugging, scenario testing, mocking, documentation, client samples, and MCP — read from that same file.

## The core idea

```text
                        one OpenAPI document
                                  |
   design   debug   test   mock   docs   client code   MCP
```

You describe an API once. The same specification then drives the request workspace, the local mock, the rendered documentation, the generated client samples, and the MCP server. When the contract changes, every downstream surface changes with it — because there is no second artifact to forget.

Powerduck works with OpenAPI 3.2 and reads existing OpenAPI 3.0 and 3.1 documents (and Swagger 2.0) by upgrading them in place. Non-HTTP APIs — SSE, WebSocket, GraphQL, gRPC, and MCP — are modeled on ordinary path items through the `x-protocol` extension rather than being forced into a REST-only shape.

## Three ways to use Powerduck

| Surface | What it is | Best for |
|---|---|---|
| [**Desktop Client**](/docs/client/introduction) | A local-first Electron application with an AI assistant and a full API workspace | Engineers who want everything on their machine, work offline, and keep keys and prompts local |
| [**Powerduck Cloud**](/docs/cloud/introduction) | A hosted service for OAS hosting, online documentation, and managed MCP | Sharing APIs with others, publishing stable links, and serving MCP without running anything |
| [**Open Source libraries**](../opensource/index.md) | Composable `@powerduck/*` npm packages | Building your own tooling, CI pipelines, or embedded components |

The three surfaces share the same foundation. The desktop client and the cloud service are both assembled from the open-source libraries, so behavior stays consistent whether you run a capability locally, call it over the network, or import a package directly.

### Desktop Client

The [desktop client](/docs/client/introduction) runs entirely on your machine. It opens and edits real files on disk, sends requests through a local main process, runs a local mock server, and keeps your AI prompts and API keys out of the browser console. The AI model is fully user-configured — bring any OpenAI-compatible provider — and every proposed spec change arrives as a reviewable card before it is applied.

### Powerduck Cloud

[Powerduck Cloud](/docs/cloud/introduction) takes the same workflow online. Upload a file, point it at a Git repository, or paste a URL; choose which operations to expose; and get stable links for rendered documentation and a managed MCP endpoint. Access can be protected with a view password or an MCP access key, and paid plans add Git sync, custom domains, and higher limits.

### Open Source libraries

The [libraries](../opensource/index.md) are the same engines under the hood: an OpenAPI parser and upgrader, a multi-protocol CLI, a code generator, an MCP server, a request runner, converters for cURL and Postman, and embeddable editors. Each is published independently on npm, with its own installation and API reference.

## What problems it solves

- **Contract drift.** Design, debugging, mocks, docs, samples, and tests all consume one document, so they cannot quietly diverge.
- **Hand-authoring OpenAPI.** An AI assistant proposes changes as structured patches; a deterministic host validates them before they land.
- **Tool sprawl across protocols.** HTTP, SSE, WebSocket, GraphQL, gRPC, and MCP are modeled in one specification instead of six tools.
- **End-to-end tests that live in someone's head.** Scenario tests make the request order and the data between steps explicit and produce shareable reports.
- **Vendor lock-in and exposed keys.** Bring your own model, keep keys local on desktop, and route requests through the main process.

## Where to go next

- New here? Start with [Installation](/docs/overview/installation) and the [Quickstart](/docs/overview/quickstart).
- Want the full local workspace? Read the [Desktop Client guide](/docs/client/introduction).
- Want to publish an API online? Read the [Cloud guide](/docs/cloud/introduction).
- Building your own integration? Browse the [Open Source libraries](../opensource/index.md).
