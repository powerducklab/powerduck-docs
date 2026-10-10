---
title: "Find an implementation error with contract tests"
description: "Find an implementation error with contract tests"
---

# Find an implementation error with contract tests

This example uses the developer MCP runner, with response schema validation available since version 0.7.6. Node.js 20.11 or newer is required. It uses fictional data and a loopback-only backend; no account, model or public API is needed after dependency installation.

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

The response is `{"total":"42"}` while the schema requires a number. The real validator reports `/total must be number` and exits with status 1.

```sh
node examples/contract-total/verify.mjs --correct
```

The backend now returns `{"total":42}`; the same checker passes and exits 0. To repair the implementation yourself, edit the `total` expression in `examples/contract-total/server.mjs` to return a number. Do not weaken the contract to hide the error.

Each invocation allocates a free local port and shuts down its server. Source files and commands are in [the example project](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total). Schema checks currently cover JSON responses, without format validation or remote schema fetching. Unsupported media requiring schema validation reports a limitation rather than silently passing.

This checks a real backend. A successful Mock request only demonstrates the sample workflow. An optional coding Agent can use `run_contract_tests` with an explicit `baseUrl` to run the same verification; inspect its patch before applying it.

[Download desktop](https://www.powerduck.com/download.html) · [Quickstart](https://www.powerduck.com/docs/overview/quickstart/)
