---
sidebar_position: 7
title: Local Mock Server
description: "Run a local mock of your OpenAPI API with a chosen port, base path, latency, and response overrides, and inspect the requests it receives."
---

# Local Mock Server

The mock server serves a working stand-in for your API directly from the specification, so frontend and client work can proceed before the backend exists — and without standing up external infrastructure. It runs in the desktop main process.

## Starting a mock

You can start a mock from the Mock server surface or straight from the AI chat. When started from chat, the app confirms the address it is serving on.

The following options are available:

| Option | Range / shape | Purpose |
|---|---|---|
| `port` | Integer `1`–`65535` | The local port to listen on |
| `basePath` | URL path prefix | Serve the mock under a base path |
| `latencyMs` | `0`–`10000` | Add artificial latency to simulate network delay |
| `overrides` | Up to 100 response overrides | Return specific responses for chosen operations |

Invalid ports or latency values are rejected with a clear message rather than starting a broken server.

## Multiple mocks

You can run more than one mock at a time — for example, one per open document. The app lists running mocks (`mock:list`) and can stop an individual mock (`mock:stop`). Each mock is associated with a document id and name so they stay distinguishable.

## Inspecting received requests

A mock records the requests it receives. You can query them (`mock:requests`) with an optional limit, and clear the recorded set. This is useful for confirming that a client called the right operation with the expected parameters, even when no real backend is present.

## Response overrides

For cases where the default example or schema-derived response is not enough, response overrides let a specific operation return a chosen response. Overrides are bounded (at most 100) to keep the configuration predictable.

## When to use it

- Unblocking frontend development against a contract that is still being built;
- Reproducing slow or edge-case behavior by tuning latency and responses;
- Demonstrating an API flow without a deployed environment;
- Verifying that generated clients call the operations as designed.

The mock reads the same specification as every other surface, so it stays aligned with the contract as the design changes.

Related: [Scenario testing](./scenario-testing), [Designing with the assistant](./design).
