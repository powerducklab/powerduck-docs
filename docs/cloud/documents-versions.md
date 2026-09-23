---
sidebar_position: 3
title: Documents & Versions
description: "Documents live under projects and move through a clear status lifecycle. Every change creates a new immutable version, and sources include upload and Git sync."
---

# Documents & Versions

A document is the hosted representation of one API. It belongs to a project within your organization and accumulates versions over time rather than being overwritten.

## Hierarchy

```text
Organization -> Project -> Document -> Versions
```

Documents can be created directly under an organization or inside a project, and they are listed per project and per organization.

## Status lifecycle

A document moves through four statuses:

| Status | Meaning | Public services |
|---|---|---|
| `ACTIVE` | Live | Documentation and MCP are served (subject to their own enabled flags) |
| `PAUSED` | Temporarily stopped | Public services are unavailable |
| `ARCHIVED` | Retained but not current | Not served |
| `DELETED` | Soft-deleted | Not served |

The allowed transitions are:

```text
pause:    ACTIVE  -> PAUSED
resume:   PAUSED  -> ACTIVE
archive:  ACTIVE / PAUSED -> ARCHIVED
restore:  ARCHIVED -> ACTIVE
delete:   ACTIVE / PAUSED / ARCHIVED -> DELETED
```

Pausing is the fastest way to take a document offline and bring it back; archiving keeps the history without treating it as current. Deletion is a soft delete, so the core data is not immediately destroyed.

## Versions are immutable

When the specification changes, a new version is created. The original is never replaced:

```text
v1 -> v2 -> v3 -> v4
```

Each version records:

- The **storage key** for the file in object storage;
- The **SHA-256** checksum;
- The content type, size, and creation time.

This enables history, rollback, diffing, and the ability to regenerate documentation and MCP against a specific version.

### Current versus version-pinned links

- A link to the **current** document follows the latest version;
- A **version-pinned** link references a specific version and never changes underneath a reader.

Use pinned links when you want an immutable reference — for example, in a release note or a contract — and the current link when you always want the latest.

## Sources

A document's content comes from a source, abstracted so upload and Git are not baked into the document model:

- **Upload** — add a file directly;
- **Git** — connect a repository with a URL, branch, and file path.

A Git source tracks whether sync is enabled and when it was last synced. You can:

- **Connect** a repository (repository URL and file path are required; branch is optional);
- **Sync** on demand to pull the latest content as a new version.

The source metadata is kept with the document, so you can always tell whether a document came from an upload or a repository, and inspect the last sync.

## Storage

The actual files live in object storage under an organization/document/version layout; the database stores only metadata (storage key, checksum, content type, size). Files are not publicly readable from storage by default — public access goes through the document's publishing routes.

## Why this matters

The combination of immutable versions and a soft-delete lifecycle means you can iterate quickly without losing history or accidentally exposing a document you meant to stop. Pause for a temporary outage, archive for long-term retention, and pin links when stability matters.

Related: [Exposed operations](/docs/cloud/exposure), [Access control](/docs/cloud/access-control), [Custom domains](/docs/cloud/custom-domains).
