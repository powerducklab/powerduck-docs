---
sidebar_position: 6
title: Data Model & ER Diagram
description: "Derive tables, foreign keys, many-to-many link tables, and SQL from your APIs; reconcile them against a live database; and track impact in a visual ER diagram."
---

# Data Model & ER Diagram

The Data model surface closes the gap between the API contract and the database. It can derive a complete relational model from your OpenAPI schemas, compare it against a database that already exists, and keep the two in sync as either side changes — with a visual ER diagram for the whole picture.

There are two starting points, and both are supported:

- **No tables yet.** Derive every table, column, foreign key, and relationship table directly from the current APIs, along with the SQL to create them.
- **An existing database.** Read the live tables and their enforced foreign keys, map them against the model implied by the APIs, and see where they match or diverge.

## Four-layer reconciliation

The reconciliation (`datamodel.reconcile`) returns authoritative facts in four layers:

| Layer | What it contains |
|---|---|
| **Observed** | Live orphan tables and live-only or enforced foreign keys from the connected database |
| **Modeled** | Per-table status (`missing`, `drift`, `matched`, `extra`), modeled/live column pairs, field-level diffs, impacted API operations, and modeled relationships |
| **Proposed** | An ordered, additive migration plan with `blockedBy` dependencies and the SQL for each step |
| **Inferred** | Auto-derived many-to-many link tables, open questions, and safeguards |

The model grounds every table, column, relationship, and statement in this result — it does not invent DDL.

### Table status

- **Missing (new)** — implied by the APIs but absent from the database;
- **Drift** — present in both, but columns or constraints differ;
- **Matched** — present and consistent;
- **Extra** — exists in the database but is not implied by the current APIs.

## Relationship tables and indexes are derived

You do not have to model join tables by hand. When the schemas imply a many-to-many relationship — for example, given `user` and `product` resources — the **inferred** layer derives the relationship table (and relevant indexes) that connects them, rather than stopping at the two base tables. Secondary indexes are included in the generated SQL.

When business logic cannot be inferred unambiguously, the result raises an open question instead of guessing, and safeguards flag anything that needs a human review.

## Visual ER diagram

The ER view renders the model as a graph, so relationships and foreign keys are visible at a glance rather than read from a table list:

- Tables are nodes, laid out automatically to reduce crossing edges;
- Foreign-key relationships are drawn as connections;
- Node state reflects the reconciliation status (new, drift, matched, extra);
- A side panel lists the concrete migration steps — `create_table`, `alter_table`, and review items — with the SQL for the selected table.

This gives you a macro view of the schema and a precise, ordered path to bring the database in line.

## Impact analysis in both directions

Because the model knows both the API operations and the tables, changes propagate visibly:

- **When an API changes**, the reconciliation identifies the impacted tables — existing tables that drift and new tables to add — with the corresponding SQL;
- **When the database changes**, the operations that touch the affected tables are surfaced as impacted.

After editing either side, you can **refresh and re-compare** until the model and the database match.

## Deployment script

For a fresh database, `datamodel.deploymentScript` produces one idempotent, forward-only SQL script:

- `CREATE TABLE IF NOT EXISTS` in foreign-key order;
- Secondary indexes;
- Optional deterministic sample rows (0–50, default 0); relationship tables are never populated.

For an existing database, use the reconciliation instead, which produces additive `ALTER` statements as an ordered migration plan.

## Database connections

Connections are managed as saved profiles (id, name, dialect, host, port, user, database); passwords are never returned. Supported dialects are **MySQL**, **SQL Server**, and **Oracle**.

- `database.runSelect` runs a read-only `SELECT` on a saved profile, with a bounded, truncated row set; writes and DDL are blocked;
- `database.prefillConnection` opens the new-connection dialog prefilled with the details you provide, so the password is entered by you rather than accepted in a prompt.

## SQL is generated, never auto-executed

Throughout this surface, SQL is **produced for review**, not run against your database. You decide when and how to apply it, and read-only access protects live data. This makes it safe to explore the model and iterate before touching the database.

Related: [Protocols](./protocols), [Request workspace](./debug), [Settings](./settings).
