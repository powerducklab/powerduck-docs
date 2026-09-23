---
sidebar_position: 7
title: Billing & Licensing
description: "Two products, two models: the desktop client is a one-time perpetual license that produces a key; Cloud is a monthly subscription with no key. Payment is routed by region through Antom or Paddle."
---

# Billing & Licensing

Powerduck sells **two distinct products with two different payment models**. Keeping them separate is the most important thing to understand about billing.

| | Desktop Client | Powerduck Cloud |
|---|---|---|
| What you buy | The desktop application | A hosted service |
| Model | One-time purchase | Monthly subscription |
| Valid for | Perpetual — own it forever | The current billing period |
| Delivered as | A **license key**, shown once | Membership, **no key** |
| Works offline | Yes | No (it is a hosted service) |

A Cloud purchase never produces a license key, and a desktop purchase is not a subscription.

## Desktop perpetual license

The desktop client is bought once and owned permanently, with no renewal or billing period. At purchase, a license key is generated:

- Keys are built from cryptographically secure random bytes in the format `PDC-XXXX-XXXX-…`, not from an incrementing id or a timestamp;
- The raw key is shown **once**;
- The database stores only the **SHA-256 hash** of the key and its last four characters, so the original key cannot be recovered from the database.

### License status

A license moves through four states:

| Status | Meaning |
|---|---|
| `ISSUED` | Generated but not yet activated |
| `ACTIVE` | Activated and usable |
| `SUSPENDED` | Temporarily unusable; can be reactivated |
| `REVOKED` | Permanently withdrawn; cannot be reactivated |

"Perpetual" means it does not expire on a schedule; it does not mean a license can never be suspended or revoked.

### Activation and audit

Activation validates the key format, hashes it, looks up the hash, checks the status, and binds the license within a transaction. The activation endpoint is rate-limited to discourage brute-force enumeration.

Every key state change is recorded as a license event — created, activated, suspended, reactivated, or revoked — so the lifecycle remains auditable.

## Cloud subscription

Cloud access follows an **active subscription** to a plan, with no license key involved:

| Plan | Monthly | Billed annually |
|---|---|---|
| Free | $0 | $0 |
| Pro | $19/mo | $15/mo |
| Team | $49/mo | $39/mo |

A subscription that is `ACTIVE` and within its current period grants the plan's capabilities. A short renewal grace period (three days) covers timing gaps around renewal; outside that window, access resolves to the Free plan. Desktop licenses are never consulted for Cloud capabilities.

### What plans control

Plans are not enforced by hard-coding plan names across the codebase. Each plan has **entitlements** — boolean features and numeric quotas — checked through a single entitlement service:

| Capability | Free | Pro | Team |
|---|---|---|---|
| OAS hosting | Yes | Yes | Yes |
| Git source | No | Yes | Yes |
| Documentation | Yes | Yes | Yes |
| MCP | No | Yes | Yes |
| Custom domain | No | Yes | Yes |
| Max documents | 3 | 100 | 1,000 |
| Max versions | 20 | 200 | 1,000 |
| Max file size | 1 MiB | 10 MiB | 50 MiB |
| Max exposed operations | 10 | 1,000 | 10,000 |
| Max members | 1 | 1 | 10 |

## Payment providers

Checkout is routed by region so customers see a familiar provider, and the two providers are **never shown at the same time**:

- **Antom** — mainland China, Hong Kong, Macau, Taiwan, and Southeast Asia;
- **Paddle** — the United States, Canada, Europe, Japan, Korea, Australia, New Zealand, and the UK.

The country is inferred from the client's time zone or `Accept-Language` header; no external GeoIP database is required. If the region cannot be determined, **Antom is the fallback**. For operations, the provider can also be forced through configuration, which allows an instant switch to the backup channel if one provider has an incident.

Payments are confirmed through signed provider webhooks (separate endpoints for Paddle and Antom) rather than trusting the browser return page.

## Which should I buy?

- Want the full local workspace, offline work, and permanent ownership? Buy the **desktop license** once.
- Want to publish documentation and MCP online and share stable links? Subscribe to **Cloud Pro** (or Team for multiple seats).
- Many teams use both: design and test locally on the client, then host the published API on Cloud.

Related: [Cloud introduction](/docs/cloud/introduction), [Desktop Client](/docs/client/introduction).
