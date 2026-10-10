---
title: "Connect OpenAPI to a coding Agent"
description: "Connect OpenAPI to a coding Agent"
---

# Connect OpenAPI to a coding Agent

Use **developer MCP** to let a coding Agent inspect a contract and verify a backend. **API-to-MCP** exposes API operations as callable tools; it is a different workflow.

1. Open your YAML/JSON with **Open** in the desktop app. Keep a saved independent copy before experimenting.
2. Open **MCP & Coding** for the current specification. Alternatively, from a checkout of the developer MCP repository, run `npm ci` and `npm run build`.
3. Configure a stdio MCP server in your Agent using executable `node`, with arguments `/absolute/path/dev-mcp-server/dist/cli.mjs`, `--spec`, `/absolute/path/openapi.yaml`. Use real absolute paths; do not paste the placeholders literally.
4. Ask the Agent to read an operation and its response schema before changing your backend. Ask it to call `run_contract_tests` with the backend’s explicit local `baseUrl` after the change.
5. Review the reported assertions and proposed code patch. Re-run after applying an accepted fix.

The developer MCP server needs Node.js 20.11+. Your Agent may send tool results or code context to its configured remote model. A model is optional for manual local requests and contract testing; your own provider bills your key, while hosted model credits are separate. No Cloud subscription is required for local work.

[Download desktop](https://www.powerduck.com/download.html) · [Quickstart](https://www.powerduck.com/docs/overview/quickstart/)
