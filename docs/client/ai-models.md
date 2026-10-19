---
sidebar_position: 8
title: AI & Models
description: "Configure an OpenAI-compatible model, understand desktop and web transports, use native tool calling with fallback, and review what data is sent to your provider."
---

# AI & Models

Powerduck lets you choose and configure the model behind the assistant. On desktop, requests pass through the main process to your chosen endpoint; document changes still use reviewable cards.

## Bring your own model

Configure the assistant in settings against any **OpenAI-compatible** Chat Completions endpoint:

- Choose a built-in vendor preset, or define a **custom** provider;
- Provide a display name, a base URL, an API key, and the model id;
- Multiple profiles can be configured and selected.

The model is not assumed to be any specific vendor. A self-hosted or third-party OpenAI-compatible endpoint works the same way, which matters for teams with their own model policy.

## Advanced capabilities with graceful fallback

Each profile has an **advanced capabilities** option, enabled by default:

- When enabled, the app uses the model's **native function calling** and sends the tool catalog over the wire, so the model can select and call the right tool directly;
- If an endpoint rejects native tool parameters — for example, a smaller model that lacks tool support — that endpoint is remembered, and the request is retried once over a **content-based fallback protocol**.

This fallback improves compatibility but does not guarantee success: network, authentication, and model errors can still occur. Turn advanced capabilities off for a profile that should always use the basic path.

Tool-driven work is bounded: the agent uses a limited number of tool rounds (three by default) and deduplicates repeated calls within the run.

## Why requests go through the main process

On the desktop client, completion requests are sent from the **Node main process**, not from the web view. This has two concrete benefits:

- **No browser CORS wall.** The cross-origin restrictions that apply to a web page do not block calls to a model endpoint;
- **The HTTP request runs outside the renderer.** Its network panel does not show the main-process HTTP exchange. This is not a guarantee that prompts or keys are absent from renderer memory, logs, or other developer tools.

The desktop gateway validates request structure and applies resource limits:

- Only HTTP(S) URLs are accepted; header names and values, body size, timeouts, and concurrent requests are checked. Local and private endpoints are allowed. This is not a host allowlist or an upstream privacy guarantee;
- Requests can be cancelled (`ai:cancel`).

## Desktop versus web

The same assistant works in both runtimes, using the channel that fits:

- **Desktop (Electron):** capabilities are imported and executed locally, and completion requests are proxied through the main process;
- **Web:** the same workflow runs over HTTP, calling the service API instead of local modules.

This is why the application keeps a web-compatible path alongside the Electron one: intent handling and cards behave consistently, while the transport changes to match the runtime.

## How intent is recognized

Intent is not handled by enumerating keywords for every feature. Instead, the application presents the model with an explicit, well-described **tool catalog** — each tool's id, parameters, and the exact situation in which it should be used. The model selects the best tool from that catalog, the deterministic host validates and executes it, and write actions ask for confirmation.

Adding a capability then means adding a tool to the catalog (and describing it accurately), not maintaining a longer keyword list. The same catalog can be shared with external agents through the MCP server, so capabilities stay aligned across the product and other tools.

## Privacy posture

- Prompts, selected context, tool descriptions, and credentials are sent to your configured model endpoint. A hosted provider receives that data; use a trusted local endpoint if your policy requires local inference;
- The deterministic host — not the model — validates and applies every change;
- You approve each write before it runs.

Related: [Designing with the assistant](./design.md), [Settings](./settings.md), [Cloud access control](../cloud/access-control.md).
