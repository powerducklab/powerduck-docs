---
sidebar_position: 1
title: Desktop Client
description: "The Powerduck desktop client is a local-first, AI-driven workspace. From one OpenAPI file on your machine you design APIs, debug requests, run tests, mock the API, publish docs, and expose MCP tools."
---

# Desktop Client

The desktop client is where the AI-native workflow happens on your own machine. You open an `openapi.yaml` from a repository, say what you want to happen, and review the result — no switching between a spec editor, an HTTP client, a mock tool, a docs generator, and a test runner, and no cloud account to begin.

You stay in control: the assistant proposes, you approve.

## A day in the workspace

These are the moments the client is built around.

- **Open a spec and get your bearings.** The assistant reads the current document and immediately suggests what you can do — gaps to fill, docs to complete, flows to test.
- **Create an API.** Describe the resource and the assistant proposes the endpoints; keep refining the same operation — add a parameter, tighten a response, adjust a status code — and it stays on that API instead of wandering across the document.
- **Set up test data.** Generate realistic sample rows from the schemas so requests and scenarios have concrete values to work with.
- **Run a request or a full scenario.** Debug one call, or chain several endpoints into an end-to-end flow and get a shareable report of what passed and what failed.
- **Keep moving before the backend exists.** Start a local mock that answers from the contract while the real service is being built.
- **Hand the API to coding agents.** Turn the spec into an MCP server so AI tools can discover and call the right operations with the right arguments.
- **See the database behind the API.** Derive tables, relationships, and SQL from the spec, compare them against a live database, and spot what would change.
- **Change settings without leaving chat.** Switch theme or language, set a proxy, or manage environment variables by simply asking.

## The surfaces, and what each is for

One document powers every surface; a compact switcher moves between them.

| Surface | What you use it for |
|---|---|
| [**Specification**](./design) | The home surface: AI chat, the document, and a live preview |
| [**Request workspace**](./debug) | Send and inspect real HTTP requests, with tabs and environments |
| [**Scenario testing**](./scenario-testing) | Chain endpoints into flows, run them, and get reports |
| [**Documentation**](./protocols) | Read the specification as rendered API documentation |
| [**MCP**](./protocols) | Inspect and use the MCP server derived from the spec |
| [**Mock server**](./mock-server) | Run a local mock of the API while it is being built |
| [**Data model**](./data-model) | Derive tables and relationships, compare with a database, generate SQL |
| [**Settings**](./settings) | Theme, language, proxy, certificates, and workspace preferences |

## How the assistant works with you

You describe intent in natural language; the assistant chooses the right capability, a deterministic engine validates it, and you approve through a card. The model never edits the document on its own.

- Spec changes arrive as **patch cards** with granular operations; editing an existing operation changes only the field you asked about;
- Read-only actions — listing operations, getting a schema, running a query — return the facts the assistant grounds its answer in;
- Write actions ask for confirmation before they run.

The model is **yours to configure**: point the app at any OpenAI-compatible provider and select it in settings. See [AI and models](./ai-models).

## Why local-first matters to you

- **Your real files.** The app opens, edits, and saves the actual files on disk and tracks local changes.
- **No CORS wall.** Requests go through the local process, not the web view, so cross-origin restrictions do not block your calls.
- **Prompts and keys stay private.** They are handled locally and never appear in a browser network panel.
- **Works offline.** Design, mock, and documentation need no network; it is only required for live requests, Git sync, or a hosted model.
- **Local runtimes.** The mock, scenario runner, database access, and terminal all run on your machine.

## The desktop license

The desktop client is sold as a **one-time, perpetual license**: buy once, own it, work fully offline, with no account. A license key is generated at purchase and shown once. It is separate from Powerduck Cloud, which is a monthly hosting subscription. See [Cloud billing](../cloud/billing).

## Start here

- [Designing with the assistant](./design)
- [Request workspace and environments](./debug)
- [Scenario testing and reports](./scenario-testing)
- [Protocols](./protocols)
- [Data model and ER diagram](./data-model)
- [Mock server](./mock-server)
- [AI and models](./ai-models)
- [Settings](./settings)
