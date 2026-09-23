---
sidebar_position: 5
title: Access Control
description: "Gate documentation with a view password and expiry, protect MCP with an access key, and configure the MCP server's upstream authentication. Understand every gate that decides whether a document opens."
---

# Access Control

Powerduck separates how **readers access your documentation** from how **clients access the MCP endpoint**, because the two are consumed differently. It also configures how the MCP server authenticates to the upstream API.

## The gates, in order

Several conditions decide whether a public surface opens. Knowing the full list answers the common question, "Why can't I open my document?"

1. **Document status** — the document must be `ACTIVE` (not paused, archived, or deleted);
2. **Surface enabled** — `documentationEnabled` for documentation, `mcpEnabled` for MCP;
3. **Access credential** — a view password for documentation, or an access key for MCP, when configured;
4. **Expiry** — a documentation view can be set to expire at a given time.

The published artifact behind a surface builds automatically after you add a version or change exposure, so publishing is not normally a manual step.

Each surface is independent: disabling MCP does not affect documentation, and a documentation password does not gate MCP.

## Documentation view password

A view password protects the rendered documentation and the served specification data:

- The password is hashed with **scrypt** using a per-password random salt; the plaintext is not stored;
- When a password is set, readers must provide it before the document is served;
- The password gates **documentation only**; the MCP endpoint uses its own access key and skips the view password.

You can also set a **view expiry** time. After the expiry passes, access is refused even with the correct password. Clear the password or the expiry to remove the restriction.

## MCP endpoint access key

The MCP endpoint is protected with its own **access key**:

- Generate (or rotate) the key; the full key is returned **once**, and afterwards only the last four characters are shown;
- When a key is configured, every MCP request must present it as a `Bearer` token;
- The provided key is compared with a **constant-time** comparison, and a missing or wrong key returns `401`.

Delete the key to make the MCP endpoint open (subject to the document being active and MCP being enabled).

## MCP upstream authentication

Separately from gating the endpoint, the MCP server can be configured for how it authenticates to the **upstream API** described by the specification. The supported auth types are:

| `authType` | Configuration |
|---|---|
| `NONE` | No upstream authentication |
| `BEARER` | A bearer token |
| `BASIC` | A basic-auth username and password |
| `APIKEY` | An API-key name (header/query) and value |

Secrets such as bearer tokens, basic passwords, and API-key values can be written but are never read back; the configuration only reports whether they are set.

Additional MCP configuration includes:

- **Base URL override** — override the upstream base URL instead of taking it from the specification;
- **Request timeout** — the timeout the MCP server uses when calling the upstream API.

## Recommended setup

- **Public documentation:** enable documentation, leave the password off for open APIs, or set a password and expiry for controlled sharing;
- **MCP for your own agents:** enable MCP and generate an access key, so only your clients can call it;
- **Upstream auth:** set the MCP server's authentication to match what the real API requires, independently of who may call the MCP endpoint.

Related: [Exposed operations](/docs/cloud/exposure), [Documents and versions](/docs/cloud/documents-versions), [Custom domains](/docs/cloud/custom-domains).
