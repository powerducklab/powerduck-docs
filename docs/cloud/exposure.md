---
sidebar_position: 4
title: Exposed Operations
description: "Choose which operations are publicly available without modifying the source document. Group by tags, search, and toggle operations individually or in batches."
---

# Exposed Operations

Not every operation in a specification should be public. Administrative endpoints, internal tools, and draft operations often need to stay in the document but remain hidden from published documentation and MCP. Exposure configuration makes that choice explicit **without modifying the source document**.

## How it works

The exposure configuration is stored separately from the specification. Each entry references an operation and records whether it is enabled:

- Prefer the operation's `operationId` when present;
- Store the `method` and `path` as well, for specifications without operation ids and for validation.

The original document is left untouched. Documentation and MCP are generated from the specification combined with the enabled operations, so disabling an operation removes it from the published surfaces without deleting it from your file.

## The exposure workspace

The exposed-operations surface is built to handle large specifications:

- **Search** — filter operations by method, path, summary, or tag;
- **Group by tag** — operations are grouped using their primary tag, with untagged operations collected under an untagged group;
- **Toggle individually** — switch a single operation on or off;
- **Batch by group** — enable or disable every operation in a tag group at once;
- **Select all (filtered)** — a global checkbox applies to the operations currently matching the search.

One row per operation keeps the enabled state unambiguous even when an operation carries multiple tags.

## A practical default

A straightforward approach is to start with everything enabled, then disable the operations you do not want public:

- Internal and administrative endpoints (for example, user-management or health internals);
- Operations that are still being designed;
- Endpoints intended only for local debugging.

Because the selection is independent of the document, you can change it as the API evolves without editing the specification itself.

## How exposure interacts with publishing

Exposure decides **which operations** appear; other controls decide **whether the document is reachable at all**:

- The document must be `ACTIVE`;
- Documentation and MCP each have an enabled flag;
- Access can be gated by a view password (documentation) or an access key (MCP).

See [Access control](./access-control) for the full set of gates.

## Plan limits

Plans cap the number of exposed operations:

- **Free** — up to 10;
- **Pro** — up to 1,000;
- **Team** — up to 10,000.

Related: [Access control](./access-control), [Documents and versions](./documents-versions).
