---
sidebar_position: 3
title: Request Workspace & Environments
description: "Send real requests in tabs, manage variables across scopes, and understand the relationship between custom environments and the servers declared in the OpenAPI document."
---

# Request Workspace & Environments

The Request workspace is where a designed operation becomes a real call. It sends the request through the local main process, shows the response, and uses environments and variables for the values that change between runs.

## Sending a request

1. Open an operation in the Request workspace. The method, path, parameters, headers, and body are taken from the specification.
2. Fill in any values that need a concrete input, such as a path parameter or a token.
3. Send the request. The status code, headers, body, and timing are shown for that tab.
4. Keep several requests open in **tabs** so you can compare or revisit them.

Because execution happens in the main process rather than the web view, direct browser CORS restrictions do not block your calls, and the request details are not exposed through the browser's network panel.

## Environments versus OAS servers

These are related but distinct, and understanding the difference removes a common source of confusion.

| | Custom environment | OAS `servers` |
|---|---|---|
| Where it lives | A local application setting | Inside the OpenAPI document |
| Writable from the request tools | Yes | No — change it with a spec patch |
| Purpose | Default base URL for new request tabs and scenario runs | The base URLs the contract itself declares |
| Shared with the document | No | Yes |

When the assistant lists base URLs (`env.listServers`), it returns your custom, writable environments first, followed by the read-only servers declared in the active document.

- To **add or select a local base URL**, create or activate a custom environment (`env.upsertServer`, `env.selectServer`). This never edits the document.
- To **change the servers in the contract**, propose a spec patch instead.

This keeps a personal debugging base URL separate from the contract, while still letting the document's declared servers drive requests.

## Variables

Variables are managed across four scopes:

- **globals** — available across every collection;
- **collection** — scoped to a collection;
- **environment** — tied to the active environment; applies to every server unless a server is specified;
- **local** — private to the local session.

The assistant can list variables (`env.listVariables`, optionally filtered by scope) and create or update one (`env.setVariable`, an upsert by name and scope). A variable can be tied to a specific server, and each variable has an enabled state. Setting a variable is an application action, not a change to the API document.

Typical values stored as variables include access tokens, IDs reused across calls, and feature flags.

## When the base URL is missing

A request needs a complete URL. If neither the document's `servers` nor the active environment provides a base URL, the app does not guess — it asks you to provide one before running. This is preferable to silently calling the wrong host.

## From a single request to a flow

Once a single call works, the natural next step is to chain calls together so that a value from one response feeds the next request. That is a [scenario test](/docs/client/scenario-testing).

Related: [Designing with the assistant](/docs/client/design), [Scenario testing](/docs/client/scenario-testing), [Settings](/docs/client/settings).
