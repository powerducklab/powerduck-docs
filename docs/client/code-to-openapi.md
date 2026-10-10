---
title: "Generate OpenAPI from an existing codebase"
description: "Generate OpenAPI from an existing codebase"
---

# Generate OpenAPI from an existing codebase

In the desktop app, choose **Scan code to OpenAPI** (Beta), select a local source folder, and choose **Start scan**. Scan a small service first. Review detected routes, parameters and responses before adopting the generated specification.

A static scan can leave response schemas unknown when handlers depend on dynamic code or unavailable dependencies. “Confirm manually” records your review; it does not reconstruct missing types. Edit the API contract from evidence, or optionally ask AI to review the selected handler. That AI action sends selected source and context to the configured model provider.

Save the result as a new file. Do not replace an existing contract without reviewing the changes. Then run the [contract example](./contract-example.md) against a running backend, or connect a [coding Agent](./coding-agent.md). A successful scan is not proof that the implementation conforms.

This workflow is desktop-only and scanner language/framework support varies. A model key is not required for static scanning. Treat unresolved findings as unknown rather than inferred facts.

[Download desktop](https://www.powerduck.com/download.html) · [Quickstart](https://www.powerduck.com/docs/overview/quickstart/)
