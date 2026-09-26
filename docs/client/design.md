---
sidebar_position: 2
title: Designing with the Assistant
description: "Design OpenAPI through a conversational assistant. Changes arrive as reviewable patch cards with granular JSON Patch operations, and focused edits preserve the rest of the operation."
---

# Designing with the Assistant

The Specification surface is where APIs are designed. It pairs an AI chat with the live document and a preview, so you can describe intent in natural language while keeping full control over what actually changes.

## The approval loop

The model does not edit the document directly. The loop is deliberately explicit:

```text
you describe an intent
        |
the model reads current state and proposes operations
        |
the host validates the proposal
        |
you review a patch card and Apply or Reject
        |
the change is merged into the document
```

This separation is the key design decision. The **model** is good at understanding intent and proposing structure; the **host** is deterministic and validates every operation; **you** approve each change. A proposal is never treated as applied until you confirm it.

## Patch cards

A patch card summarizes the change and lists the exact operations, for example adding a new path:

```json
{
  "type": "patch",
  "summary": "Add GET /products endpoint",
  "ops": [
    { "op": "add", "path": ["paths", "/products"], "value": { "get": {} } }
  ],
  "affects": { "paths": ["/paths/~1products"], "resources": ["Product"] }
}
```

Path segments are array elements, not JSON Pointer strings. Adding a brand-new path targets `["paths", "/products"]` and creates parent containers automatically.

### Granular edits to existing operations

When you edit an operation that already exists, the assistant does **not** resend the whole operation, because doing so would wipe every field it does not echo. Instead it emits small operations that touch only the piece you change, deep inside the operation:

- Add one query parameter:

```json
{ "op": "add", "path": ["paths", "/products", "get", "parameters", "-"], "value": {} }
```

- Extend the response schema:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "responses", "200", "content", "application/json", "schema", "properties", "total"], "value": { "type": "integer" } }
```

- Change a single field:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "summary"], "value": "..." }
```

Arrays are appended with the `"-"` token rather than resent wholesale. Parameters are keyed by `(in, name)`, so an existing parameter is never duplicated. The host merges the proposed value into the current operation and preserves everything you omit.

This is what makes repeated refinement reliable: when you say "now add a limit parameter" or "make the name required," only that field changes, and the rest of the operation stays intact.

## Read tools ground every proposal

Before answering, the model can call read-only tools to get exact current state rather than guessing:

- `spec.overview` — title, version, protocols, counts, tags, servers, security;
- `spec.listOperations` — every operation as `METHOD /path` with summary and tags;
- `spec.presentOperations` — render a read-only list card of all operations;
- `spec.getOperation` — the full definition of one operation and the schemas it references;
- `spec.getSchema` — one component schema, including required fields and descriptions.

The model is expected to read the operation before editing it whenever its full shape is not visible.

## Broad requests are staged

For a large request such as "build an e-commerce API," the assistant does not dump everything at once:

1. It first asks a **clarifying question** about the key decisions;
2. After you answer, it proposes **one focused patch at a time**, with two to five operations per card;
3. It continues only while your latest request stays within that goal.

The assistant also emits a `plan` of the endpoints it intends to create as soon as the scope is known, so you can see the shape of the work before the patches arrive.

## Avoiding drift

The host enforces a few rules to keep the work aligned:

- The **current document** is the authoritative state; the model does not assume an earlier patch is present if the document says otherwise;
- In focused mode, only the active target (and explicitly referenced component schemas) is modified — no opportunistic changes to sibling endpoints;
- Explicitly naming a different `METHOD /path` is treated as an intentional task switch;
- Applied and rejected proposals are tracked from history, and a patch already present is not repeated.

If the required details are not visible, the assistant asks a focused question instead of inventing them.

## Other cards

Not every response is a patch:

- **Question cards** ask you to choose between options;
- **Validation cards** report quality checks with pass, warning, and error statuses;
- **Action cards** offer concrete next steps such as running a scenario or opening a workspace;
- **Data-table cards** present concrete sample or test rows for an endpoint or schema.

Related: [Request workspace](./debug.md), [Scenario testing](./scenario-testing.md), [AI and models](./ai-models.md).
