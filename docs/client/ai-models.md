---
sidebar_position: 8
title: AI & Models
description: "Sign in to Powerduck, use platform-managed models and understand credits, code review and approval controls."
---

# AI & Models

Powerduck requires **Google OAuth or GitHub** sign-in in both the desktop app and browser workspace. The assistant uses platform-managed models; custom endpoints, user API keys and model profiles are no longer supported.

## Account and credits

The account menu at the bottom of the sidebar shows your plan, remaining credits and next reset. Free credits reset daily at 00:00 UTC. Paid allowances reset every seven days from the original subscription start time; billing remains monthly. Unused credits do not roll over.

AI requests reserve an upper bound before calling the provider, then settle actual token usage. Failed or canceled requests release the reservation. Multiple concurrent requests cannot spend the same allowance.

## Built-in models

Powerduck manages provider credentials and model routing on the server. The provider pool supports OpenAI-compatible services, including Kimi and ByteDance endpoints when configured, with concurrency limits and failover for temporary provider failures. Model availability depends on the deployed provider configuration.

The desktop renderer never receives provider credentials. Its main process sends the signed-in session only to the Powerduck relay. Browser requests use the same-origin authenticated relay and CSRF protection.

## Code quality in Chat

The assistant can select a code project, request a robustness/performance/security review, inspect P0–P3 findings, propose test files, create approved test drafts and inspect iteration changes. The dedicated code-quality workspace and Chat share these results.

Code review does not edit business source. Each finding includes its file, line, evidence and repair instructions for another code agent. Test generation follows the inspected project's conventions; proposed code must be reviewed before creating new test files. Existing files are not overwritten and generated tests are not automatically executed.

## Data and limits

Selected source context is sent to Powerduck's configured AI providers to perform the requested analysis. Dependency folders, hidden files, common credential files and symbolic links are excluded by the project reader; this is not a guarantee that source code contains no secrets. Review the selected project before scanning.

A scan reports excluded oversized files and its completed-file count. Model findings are review suggestions, not proof of test coverage or a security certification. Iteration history is stored locally, retaining the latest 20 recorded changes per project.
