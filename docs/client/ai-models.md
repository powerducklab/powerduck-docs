---
sidebar_position: 8
title: AI & Models
description: "Bring any OpenAI-compatible model, keep prompts and keys local through the main process, use native function calling with automatic fallback, and keep the same workflow on the web."
---

# AI & Models

The assistant is only as good as the model behind it, so Powerduck does not lock you into one. You choose and configure the model, the application calls it through a secure local path, and every change still goes through the same reviewable cards.

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

The goal is that a result always comes back: capable models get the precise native path, and models without tool support degrade to a simpler protocol rather than failing the turn. You can turn advanced capabilities off for a profile that should always use the basic path.

Tool-driven work is also bounded: the agent runs a limited number of tool rounds (three by default) and de-duplicates calls, so a tool is never executed twice in a loop.

## Why requests go through the main process

On the desktop client, completion requests are sent from the **Node main process**, not from the web view. This has two concrete benefits:

- **No browser CORS wall.** The cross-origin restrictions that apply to a web page do not block calls to a model endpoint;
- **Prompts and keys stay out of the browser console.** The request URL, authorization header, system prompt, and tool list are not visible in the renderer's network panel.

The gateway is deliberately constrained rather than acting as an open proxy:

- Targets are validated (loopback and permitted hosts), request headers are sanitized, and response splitting through headers is prevented;
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

- On desktop, your API key and prompts remain local and are not exposed to the renderer;
- The deterministic host — not the model — validates and applies every change;
- You approve each write before it runs.

Related: [Designing with the assistant](./design.md), [Settings](./settings.md), [Cloud access control](../cloud/access-control.md).
