---
sidebar_position: 6
title: Custom Domains
description: "Bind a hostname, or a hostname plus sub-path, to a document. Verify ownership with a DNS TXT record, then serve documentation and MCP from your own domain."
---

# Custom Domains

By default, documents are served from Powerduck's shared addresses. A custom domain lets documentation and MCP appear under **your own hostname**, which is essential for publishing APIs under your brand rather than a shared link.

Custom domains are a paid capability, available on **Pro and Team** plans (checked through the `oas.custom_domain` entitlement).

## Whole-host and sub-path bindings

A binding can target either:

- **Whole host** — `api.example.com` serves one document at the root;
- **Host plus sub-path** — `example.com/v1` serves a document under `/v1`.

Sub-path bindings are what let one hostname serve several documents:

```text
example.com/v1  -> document A
example.com/v2  -> document B
```

This avoids the limitation of one hostname per document and supports versioned base paths.

## On a custom domain

The same surfaces available on the shared address are served under the bound domain, using short, stable paths:

| Surface | Whole host | Sub-path |
|---|---|---|
| Current specification | `/oas` | `/v1/oas` |
| Version-pinned specification | `/v/:version/oas` | `/v1/v/:version/oas` |
| MCP | `/mcp` | `/v1/mcp` |

The host is resolved from the request's hostname and path, then routed to the bound document. CORS preflight is handled for each of these paths.

## Adding and verifying a domain

Domains are not trusted until ownership is verified, so the process is explicit:

1. **Add** the hostname (or hostname plus path) to the document;
2. The service returns the binding and a **DNS instruction**;
3. Create the DNS record and **verify** it;
4. The binding moves from pending to verified and begins serving.

The ownership check uses a **TXT record**:

| Field | Value |
|---|---|
| Record type | `TXT` |
| Host | `_powerduck-challenge.<your-domain>` |
| Value | `powerduck-verify=<verification-token>` |

Verification reads the TXT record through DNS and compares the token using a constant-time match. A binding that is already verified stays verified without re-checking.

### Example

For `api.example.com`, add a TXT record:

```text
_powerduck-challenge.api.example.com
TXT "powerduck-verify=<the-token-shown-for-the-binding>"
```

Then choose **Verify** in the document workspace. After it reports verified, documentation and MCP are served from the domain (subject to the document being active and each surface being enabled).

## Managing bindings

- **List** the domains bound to a document, including status and base path;
- **Verify** a pending binding after adding the DNS record;
- **Delete** a binding to stop serving the document from that domain.

Changes to access flags invalidate cached host resolution, so updates take effect without serving stale bindings.

## How access control still applies

A custom domain is an additional address, not a bypass. The same gates still apply:

- The document must be `ACTIVE`;
- Documentation and MCP each have an enabled flag;
- A view password still gates documentation, and an MCP access key still gates MCP.

See [Access control](/docs/cloud/access-control).

Related: [Documents and versions](/docs/cloud/documents-versions), [Billing](/docs/cloud/billing).
