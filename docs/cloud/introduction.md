---
sidebar_position: 1
title: Powerduck Cloud
description: "Host OpenAPI specs, publish online documentation, and serve managed MCP endpoints. Add a spec from upload, Git, or URL, choose what to expose, and share stable links."
---

# Powerduck Cloud

Powerduck Cloud takes the same OpenAPI workflow online. You add a specification, choose which operations to expose, and share stable links for rendered documentation and a managed MCP server — without running anything yourself.

It is a lightweight, multi-tenant hosting service. Every resource belongs to an **organization**, and access is driven by your plan.

## What it does

1. **Add a specification** from a file upload, a Git repository, or a URL;
2. **Version it** — every change creates a new version, and the original is never overwritten;
3. **Choose the exposed operations** rather than modifying the source document;
4. **Publish documentation** rendered from the specification;
5. **Serve an MCP endpoint** built from the specification and the exposed operations;
6. **Control access** with a documentation view password and expiry, and a separate MCP access key;
7. **Manage documents** — pause, resume, archive, inspect status, versions, and source;
8. Optionally bind a **custom domain**, including sub-path setups.

## The core model

```text
User
  |
Organization
  |
Project
  |
OAS Document
  |
OAS Version
  |
Exposed operations
  |
  |----------------|
Documentation      MCP
```

Even for individual users, an organization layer sits between the user and the documents, and a personal organization is created automatically. This keeps the model ready for shared teams without redesigning the core data.

## Where your files live

The specification files are stored in **object storage (S3)**, while the database holds metadata. Large uploads go directly to storage using a presigned URL rather than being relayed through the API server:

```text
browser -> presigned URL -> S3
```

The database tracks the storage key, SHA-256, content type, and size for each version.

## Authentication

Sign in with **Google** or **GitHub** OAuth. After the OAuth handshake, Powerduck issues its own session — a secure, HttpOnly cookie — rather than using the provider's token as a long-term identity. The session includes CSRF protection and can be revoked on logout.

## The console surfaces

After signing in, the console provides:

- **Dashboard** — add a specification and see recent documents;
- **Projects** — organize documents;
- **Document workspace** — status, exposed operations, versions, source, access settings, and MCP configuration in a GitHub-style navigation;
- **Billing** — subscription status and orders;
- **Settings** — profile and preferences;
- **Activity** — an audit log of actions.

Public readers use a dedicated documentation viewer route; they never need an account unless the document requires a password.

## Cloud versus the desktop client

| | Desktop Client | Cloud |
|---|---|---|
| Runs | On your machine | Hosted |
| Model | One-time perpetual license | Monthly subscription |
| Output | A license key (shown once) | Membership, no key |
| Best for | Local, offline, full workspace | Sharing and publishing online |

The two are complementary and sold separately. See [Billing](/docs/cloud/billing).

## Start here

- [Cloud quickstart](/docs/cloud/quickstart)
- [Documents and versions](/docs/cloud/documents-versions)
- [Exposed operations](/docs/cloud/exposure)
- [Access control](/docs/cloud/access-control)
- [Custom domains](/docs/cloud/custom-domains)
- [Billing](/docs/cloud/billing)
