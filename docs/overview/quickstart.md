---
sidebar_position: 3
title: "First local request, without an account or model"
description: "First local request, without an account or model"
---

# First local request, without an account or model

## Try the local example

In an empty desktop workspace choose **Try the example**, then start the run.
Powerduck creates an independent sample, starts its existing local Mock, sends
`GET /orders/summary` to the assigned port and displays the real response.
“Example complete” appears only after HTTP 200. The Mock stops after the request
or when you close the example. You can run it again; there is no forced tour.
Install the app first; this local path needs no internet, login or model key.

## Open your own contract

Use **Open** to import a YAML/JSON OpenAPI document. The sample never overwrites
an existing file. Free use has a specification-slot limit; if it is full, close
or remove an unneeded document after saving it. Do not discard unsaved work just
to run an example. **Scan code to OpenAPI** is an alternative for an existing
codebase; review unknown fields before trusting the result.

## Verify an actual backend

A successful Mock request does not establish backend conformance. Follow the
[contract error example](../client/contract-example.md), then [connect a coding
Agent](../client/coding-agent.md) if desired. Manual validation needs no model.

## Optional models and common failures

- **No model configured:** local requests, Mock and manual contract checks still work. Configure a model in Settings only to use AI.
- **Model service connection failed:** inspect the model endpoint, key and proxy under Settings. Do not publish keys or request headers in bug reports.
- **Target API unreachable:** check the server is running and verify the URL, port and request settings in Debug & Test.
- **HTTP 401/403:** review the target API’s Auth settings and permissions. This is not a request to log in to Powerduck.
- **Contract check failed:** read the assertion’s field path and expected type; fix the backend or review an incorrect contract, then re-run.

Local files are read/written on your computer. Remote models receive relevant
context; Cloud publishing uploads selected content. Optional usage statistics
are off by default in Settings and are separate from license verification.
[Download desktop](https://www.powerduck.com/download.html) · [Desktop license](https://www.powerduck.com/pricing?product=client)
