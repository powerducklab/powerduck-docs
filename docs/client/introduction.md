---
sidebar_position: 1
title: Desktop Client
description: "The Powerduck desktop client is a local-first Electron application. One workspace covers specification design, request debugging, MCP, mocking, documentation, environments, and data modeling."
---

# Desktop Client

The desktop client is a local-first workspace for the entire API lifecycle. Instead of switching between a spec editor, an HTTP client, a mock tool, a docs generator, and a test runner, you work in one application over one OpenAPI document.

It is an Electron application: a Node.js main process owns files, requests, the mock server, database connections, and the terminal, while a React renderer presents the workspace and the AI assistant.

## The workspace surfaces

The application opens onto the **Specification** surface, and a compact switcher moves between the tools. Each tool reads the same document.

| Surface | Route | What it does |
|---|---|---|
| [**Specification**](/docs/client/design) | `/spec` | The home surface: AI chat, the document, and a live preview |
| [**Request workspace**](/docs/client/debug) | `/test` | Send and inspect real HTTP requests, with tabs and environments |
| [**Documentation**](/docs/client/protocols) | `/docs` | Render the specification as readable API documentation |
| [**MCP**](/docs/client/protocols) | `/mcp` | Inspect and use the MCP server derived from the spec |
| [**Mock server**](/docs/client/mock-server) | `/mock` | Run a local mock of the API (desktop only) |
| **Environment** | `/environment` | Manage variables and base URLs for requests |
| [**Data model**](/docs/client/data-model) | `/models` | Derive tables and relationships, compare with a database, generate SQL |

The tool switcher offers MCP, Request workspace, Documentation, Mock server, and Data model; the Specification and Environment surfaces are reached from the workspace navigation and the request workflow.

## How the AI fits in

The assistant is built into the Specification surface. You describe an intent in natural language; the model chooses the right capability and proposes a change; a deterministic host validates it; and you approve it through a card. The model never writes to the document on its own.

- Changes arrive as **patch cards** with granular JSON Patch operations;
- Editing an existing operation in focused mode changes only the field you asked about;
- Read-only tools (list operations, get a schema, run a query, reconcile the data model) return facts the model grounds its answer in;
- Write actions ask for confirmation before they run.

The model is **yours to configure**. Point the app at any OpenAI-compatible provider, select it in settings, and the app calls it through the local main process. See [AI and models](/docs/client/ai-models).

## Why local-first matters

Running on your machine changes what is possible:

- **Real files.** The app opens, edits, and saves the actual files on disk and tracks local changes.
- **No browser CORS wall.** Outbound requests go through the main process, so the web view's cross-origin restrictions do not block your API calls.
- **Prompts and keys stay local.** Completion requests are proxied by the main process; the system prompt and API keys never appear in the browser's network panel.
- **Offline work.** Design, mock, and documentation work without a network; the network is only needed for live requests, Git sync, or a hosted model.
- **Local runtimes.** The mock server, scenario runner, database access, and terminal all run on your machine.

## The desktop license

The desktop client is sold as a **one-time, perpetual license**: buy once, own it, work fully offline, with no account. A license key is generated at purchase and shown once. This is separate from Powerduck Cloud, which is a monthly hosting subscription. See [Cloud billing](/docs/cloud/billing).

## Start here

- [Designing with the assistant](/docs/client/design)
- [Request workspace and environments](/docs/client/debug)
- [Scenario testing and reports](/docs/client/scenario-testing)
- [Protocols](/docs/client/protocols)
- [Data model and ER diagram](/docs/client/data-model)
- [Mock server](/docs/client/mock-server)
- [AI and models](/docs/client/ai-models)
- [Settings](/docs/client/settings)
