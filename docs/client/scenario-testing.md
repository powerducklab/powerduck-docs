---
sidebar_position: 4
title: Scenario Testing & Reports
description: "Chain ordered API calls with data passing and assertions, run them through the local CLI, and export self-contained HTML reports in ten languages."
---

# Scenario Testing & Reports

A single request proves one call. A **scenario test** proves a workflow: an ordered sequence of requests where a value from one response feeds a later request, with assertions checked at each step. Scenarios capture the end-to-end flows that otherwise live only in a developer's head.

## What a scenario contains

- **Ordered steps**, each referencing an operation in the specification;
- **Data passing** between steps — for example, take the `id` from a created resource and use it in the next request;
- **Assertions** on status codes, headers, or response fields;
- Values the reader must supply before running.

The order and the assertions are first-class: they are never silently dropped during execution.

## Running a scenario

Scenarios execute in the main process through the `runScenario` engine from `@powerduck/openapi-cli`:

- `scenario:run` starts a run with the scenario, the specification, and the request configuration;
- Progress is streamed back on `scenario:event` as the steps execute;
- `scenario:cancel` stops a running job.

You can watch each step, see where a flow fails, and cancel a long run.

## How the assistant builds one

The assistant does not invent test definitions inside the specification. Scenarios are a separate host workflow and are **never stored in the OpenAPI document** — there are no `x-scenarios` keys or embedded steps.

When you ask to design endpoints and also test them, the work is sequenced:

1. The assistant first proposes **only the endpoint patches**;
2. After you apply them, it returns an **action card** to run the flow:
   - `test.single` for one endpoint;
   - `scenario.plan` to let the host discover end-to-end flows;
   - `scenario.run` to prepare and run an ordered flow.

A `scenario.run` card lists the operations in execution order (two to eight) and states the goal, including which response field, header, or status feeds each later request. Every reference is copied verbatim from the current specification.

## Reports

After a run, you can export a **self-contained HTML report**. It is a summary document, not raw CLI output: it presents the flow, the per-step results, the assertions, and the outcome in a readable layout.

When exporting, choose a language. Ten languages are built in:

1. English
2. 简体中文 (Simplified Chinese)
3. 繁體中文 (Traditional Chinese)
4. 日本語 (Japanese)
5. 한국어 (Korean)
6. Français (French)
7. Deutsch (German)
8. Español (Spanish)
9. Português — Brasil (Portuguese, Brazil)
10. العربية (Arabic)

An **other/custom** option lets you type a language of your own.

Reports are safe to share as-is:

- **Credentials are redacted** automatically, so tokens and secrets do not appear;
- **Large payloads are folded** rather than pasted in full, keeping the report readable.

The HTML is standalone, so it can be attached to a ticket or archived with a release.

## When to use scenarios

- Verifying a multi-step business flow (create, read, update, delete);
- Confirming that authentication and token passing work across calls;
- Producing evidence of API behavior for a release or a handoff;
- Regression-checking a flow after the contract changes.

Related: [Request workspace](./debug.md), [Designing with the assistant](./design.md), [Mock server](./mock-server.md).
