---
sidebar_position: 1
title: Desktop Client
description: "The Powerduck desktop client is a local-first, AI-driven workspace. From one OpenAPI file on your machine you design APIs, debug requests, run tests, mock the API, publish docs, and expose MCP tools."
---

# Desktop Client

Sign in with Google OAuth or GitHub before using Powerduck, including the desktop client. Local files remain on disk. AI analysis sends the selected context to Powerduck’s managed providers; custom model endpoints and API keys are no longer supported.

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
| [**Specification**](./design.md) | The home surface: AI chat, the document, and a live preview |
| [**Request workspace**](./debug.md) | Send and inspect real HTTP requests, with tabs and environments |
| [**Scenario testing**](./scenario-testing.md) | Chain endpoints into flows, run them, and get reports |
| [**Documentation**](./protocols.md) | Read the specification as rendered API documentation |
| [**MCP**](./protocols.md) | Inspect and use the MCP server derived from the spec |
| [**Mock server**](./mock-server.md) | Run a local mock of the API while it is being built |
| [**Data model**](./data-model.md) | Derive tables and relationships, compare with a database, generate SQL |
| [**Settings**](./settings.md) | Theme, language, proxy, certificates, and workspace preferences |

## How the assistant works with you

You describe intent in natural language; the assistant chooses the right capability, a deterministic engine validates it, and you approve through a card. The model never edits the document on its own.

- Spec changes arrive as **patch cards** with granular operations; editing an existing operation changes only the field you asked about;
- Read-only actions — listing operations, getting a schema, running a query — return the facts the assistant grounds its answer in;
- Write actions ask for confirmation before they run.

Sign in with Google OAuth or GitHub before using Powerduck, including the desktop client. Local files remain on disk. AI analysis sends the selected context to Powerduck’s managed providers; custom model endpoints and API keys are no longer supported.

## Why local-first matters to you

Sign in with Google OAuth or GitHub before using Powerduck, including the desktop client. Local files remain on disk. AI analysis sends the selected context to Powerduck’s managed providers; custom model endpoints and API keys are no longer supported.

## Powerduck · Free / Pro / Max

Free includes 300,000 credits, reset daily at 00:00 UTC. Pro is $39/month with 18,000,000 credits per 7 days; Max is $99/month with 60,000,000 credits per 7 days. Paid resets are anchored to the original subscription start, separately from monthly billing. Unused credits do not roll over. Desktop and AI Chat share the personal account plan; software licenses and activation keys are no longer sold.

## Start here

- [Designing with the assistant](./design.md)
- [Request workspace and environments](./debug.md)
- [Scenario testing and reports](./scenario-testing.md)
- [Protocols](./protocols.md)
- [Data model and ER diagram](./data-model.md)
- [Mock server](./mock-server.md)
- [AI and models](./ai-models.md)
- [Settings](./settings.md)
