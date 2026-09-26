---
sidebar_position: 1
title: Powerduck Cloud
description: "Take an OpenAPI spec online in minutes: publish rendered documentation and a managed MCP endpoint, choose what to expose, control who can access it, and share stable links — without running anything."
---

# Powerduck Cloud

Powerduck Cloud is how an OpenAPI file becomes something you can **share**. Add a specification, choose what to expose, and hand people stable links for rendered documentation and a managed MCP server — without hosting or running anything yourself.

It is the same contract-first, AI-assisted workflow as the desktop client, taken online for teams and consumers.

## The journey

1. **Add a specification** by uploading a file, pointing at a Git repository, or pasting a URL. You can even start the flow on the website and sign in only when you are ready — you will not have to upload it twice.
2. **Choose what to expose.** Switch individual operations on or off; your original file is never modified.
3. **Open the documentation link immediately** — rendered API docs are enabled by default. The managed MCP endpoint is one switch away and stays off until you choose to expose tools to agents.
4. **Control access.** Add a documentation view password and expiry, and a separate MCP access key for agents.
5. **Publish and share.** Publish a ready artifact for the current version so the links resolve; advanced controls stay one click away.
6. **Keep it current.** Every change creates a new version you can diff or roll back, and Git sources can sync on update.
7. **Manage the lifecycle.** Pause, resume, or archive a document; inspect its status, versions, and source at a glance.

## What you get

- **Stable documentation links** that stay readable as you publish new versions;
- **A managed MCP endpoint** so other people's AI agents can discover and call the operations you chose;
- **Per-operation exposure**, so internal or unfinished endpoints stay off the public surface;
- **Access control** with view passwords, expiry, and MCP access keys;
- **Version history** with diff and rollback — the original is never overwritten;
- **Git sync**, so a repository update flows into a new hosted version;
- **Custom domains**, including sub-path setups, for a branded experience.

### One document, many versions

Each edit creates a new version rather than overwriting the original, so you can compare versions, roll back, and republish documentation and MCP against a known state. Documentation and MCP are always tied to a specific document and version, never to an ambiguous "latest".

### Why a link might not open

A documentation or MCP link resolves when three things line up, and the document workspace shows each one with the first unmet requirement highlighted:

1. The document is **active** — pausing it takes documentation and MCP offline together;
2. The surface you are sharing is **enabled** — documentation and MCP each have their own switch (documentation is on by default, MCP off);
3. A current artifact is **published** — it builds automatically after you add a version or change the exposed operations, so you normally do nothing; a manual publish is available as a backstop.

Access checks — a view password, an expiry, or an MCP access key — apply on top of those three.

## Sign in and ownership

Sign in with **Google** or **GitHub**. After the OAuth handshake, Powerduck issues its own session as a secure, HttpOnly cookie — the provider's token is never used as your long-term identity. Everything belongs to an **organization**; a personal organization is created automatically, and teams can share one later without a redesign.

## The console

- **Dashboard** — add a specification and see recent documents with quick links and start/stop actions;
- **Projects** — organize documents;
- **Document workspace** — status, documentation, MCP, exposed operations, versions, source, and domains in clear, labeled sections;
- **Billing** — subscription status and orders, kept separate;
- **Hub** — publish and browse public documentation and MCP servers;
- **Settings** and **Activity** — profile, preferences, and an audit log.

Public readers use a dedicated documentation viewer and need no account unless the document requires a password.

## Cloud versus the desktop client

| | Desktop Client | Cloud |
|---|---|---|
| Runs | On your machine | Hosted |
| Model | One-time perpetual license | Monthly subscription |
| Output | A license key (shown once) | Membership, no key |
| Best for | Local, offline, full workspace | Sharing and publishing online |

The two are complementary and sold separately. See [Billing](./billing.md).

## Start here

- [Cloud quickstart](./quickstart.md)
- [Documents and versions](./documents-versions.md)
- [Exposed operations](./exposure.md)
- [Access control](./access-control.md)
- [Custom domains](./custom-domains.md)
- [Billing](./billing.md)
