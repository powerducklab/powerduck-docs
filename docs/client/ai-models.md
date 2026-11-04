---
sidebar_position: 15
title: "Built-in AI and usage"
description: "Powerduck helps you understand what changed, inspect the surrounding code, and decide what needs attention as AI produces more code. The desktop app combines an API workspace with code review; either workflow can be opened independently from Home."
---

# Built-in AI and usage

Sign in with Google or GitHub. Powerduck provides the built-in model; model selectors, custom provider keys and custom endpoints are not offered. Selected source context is sent to managed AI providers only for requested AI work. Local scans exclude common dependency, build and credential paths, but cannot guarantee that your source contains no secrets. Review what you share.

## AI inline review

AI review starts only when you request it. It reviews the current differences with bounded related context, rather than sending every complete file individually. Results appear at the affected code location with priority, evidence and a recommendation. Cached matching results can be reused. Confirm a problem, mark a false positive or select it for an Agent task. AI can miss defects or raise incorrect suspicions; it does not prove correctness or that tests ran.

## Plans and task allowances

One conversation turn or one review operation is a task; its internal tool/model calls do not each consume another task. Usage is reserved while running and settled by the server. A delivered result consumes one task even if you subsequently cancel; a task with no successful result releases its reservation. Scope and safety limits still apply: split large reviews. Local browsing, Git/AST analysis and viewing saved results do not consume AI tasks. Existing legacy subscriptions may retain credit billing; the account and checkout show the applicable entitlement.

- [API workspace](introduction.md)
- [Code review](code-quality.md)
- [Built-in AI and usage](ai-models.md)
- [Plans and task allowances](../cloud/billing.md)
- [Install and start](../overview/installation.md)
- [Understand every change](../overview/quickstart.md)
