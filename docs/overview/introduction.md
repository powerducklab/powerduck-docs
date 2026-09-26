---
sidebar_position: 1
title: Introduction
description: "Powerduck is an AI-native, local-first API platform built around one OpenAPI YAML. You and AI design, debug, test, mock, document, and expose MCP tools from that same file — on the desktop, in the cloud, or with open-source libraries."
---

# Introduction

A shift is happening in how APIs get built. For two decades the **operator** was a person clicking through a GUI, and the **consumer** of an API contract was a person reading documentation. That is changing on both ends:

- The operator is increasingly an **AI assistant** that turns intent into action;
- The consumer is increasingly an **AI agent** that calls the API as a tool, through MCP.

The tools that defined the previous era — the API client, the spec viewer, the request collection — were built for a human at the keyboard. Powerduck is built for this era. It is not a better API client or a prettier spec viewer. It is an **AI-native platform that starts from one OpenAPI file**.

## The nucleus: one local OpenAPI file

Everything begins with a plain `openapi.yaml` in your repository — open, version-controlled, readable by people and by AI. Not a proprietary database, and not a cloud account.

```text
                one local openapi.yaml
                         |
      you + AI -> design debug test mock docs data-model
                         |
                      MCP tools
                         |
               any AI coding agent
```

That one file is the contract. Every workflow reads from it, and the same file can be handed to any AI coding agent over MCP — so you, the built-in assistant, and every external agent share a single source of truth. When design, debug, tests, mocks, and docs all read the same file, "keeping the tools in sync" simply stops being a task. That is a consequence of the design, not the goal.

Powerduck works with OpenAPI 3.2 and reads existing 3.0 and 3.1 documents (and Swagger 2.0) by upgrading them in place. Non-HTTP APIs — SSE, WebSocket, GraphQL, gRPC, and MCP — are modeled on ordinary path items through the `x-protocol` extension instead of being forced into a REST-only shape.

## How you work with AI

- Open a YAML and the assistant immediately suggests what you can do with it;
- State an outcome in plain language — "create the order endpoints", "set up test data", "run the checkout flow and give me a report" — and the assistant selects the right tool and proposes the change;
- Every change arrives as a **reviewable card**; nothing is applied until you approve;
- When you refine one API, the assistant stays on that API and changes only what you asked, instead of drifting across the document;
- Bring **any OpenAI-compatible model**. On the desktop, prompts and keys never leave your machine.

## Local-first by default

Powerduck runs on your machine, opens and saves real files, works offline, and keeps API keys and prompts out of the browser. The cloud is an optional extension for sharing and publishing — never a requirement to get started.

## Three ways to use Powerduck

| Surface | What it is | Best for |
|---|---|---|
| [**Desktop Client**](../client/introduction.md) | A local-first Electron application with an AI assistant and a full API workspace | Engineers who want everything on their machine, work offline, and keep keys and prompts local |
| [**Powerduck Cloud**](../cloud/introduction.md) | A hosted service for OAS hosting, online documentation, and managed MCP | Sharing APIs with others, publishing stable links, and serving MCP without running anything |
| [**Open Source libraries**](../opensource/index.md) | Composable `@powerduck/*` npm packages | Building your own tooling, CI pipelines, or embedded components |

The three surfaces share the same engines: the desktop client and the cloud are both assembled from the open-source libraries, so a capability behaves the same whether you run it locally, call it over the network, or import a package directly.

### Desktop Client

The [desktop client](../client/introduction.md) runs entirely on your machine. It opens and edits real files on disk, sends requests through a local process, runs a local mock, and keeps your AI prompts and API keys out of the browser console. The model is fully yours to configure, and every proposed change arrives as a reviewable card before it is applied.

### Powerduck Cloud

[Powerduck Cloud](../cloud/introduction.md) takes the same workflow online. Add a file, a Git repository, or a URL; choose which operations to expose; and get stable links for rendered documentation and a managed MCP endpoint. Access can be protected with a view password or an MCP access key, and paid plans add Git sync, custom domains, and higher limits.

### Open Source libraries

The [libraries](../opensource/index.md) are the engines underneath: an OpenAPI parser and upgrader, a multi-protocol CLI, a code generator, an MCP server, a request runner, converters for cURL and Postman, and embeddable editors. Each is published independently on npm with its own installation guide and API reference — this is where the low-level technical detail lives.

## What changes for you

- **You direct the outcome, not the clicks.** Describe the goal and the assistant carries the work through reviewable steps.
- **Your APIs are agent-ready.** The same contract that produces docs also produces MCP tools, so AI agents can call your API correctly from day one.
- **Nothing drifts.** Design, debug, tests, mocks, and docs all read one file.
- **Every protocol in one place.** HTTP, SSE, WebSocket, GraphQL, gRPC, and MCP live in a single specification rather than six tools.
- **No lock-in.** Bring your own model, keep keys local on desktop, and own the plain YAML in your repository.

## Where to go next

- New here? Start with [Installation](./installation.md) and the [Quickstart](./quickstart.md).
- Want the full local workspace? Read the [Desktop Client guide](../client/introduction.md).
- Want to publish an API online? Read the [Cloud guide](../cloud/introduction.md).
- Building your own integration? Browse the [Open Source libraries](../opensource/index.md).
