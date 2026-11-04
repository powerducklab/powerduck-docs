---
sidebar_position: 10
title: "Code review"
description: "Powerduck helps you understand what changed, inspect the surrounding code, and decide what needs attention as AI produces more code. The desktop app combines an API workspace with code review; either workflow can be opened independently from Home."
---

# Code review

Choose a code folder. The project structure opens first; select a file to read its full source. Switch between source only, full comparison and changes only. Added and removed lines, inline character highlights, change navigation and search help locate the actual edit without losing context.

## Comparison and round history

The current round compares the saved round baseline with files on disk. Opening a folder establishes a starting point; existing content is not automatically new work. Use all uncommitted changes for a Git HEAD comparison. Start a new round deliberately and select previous rounds to inspect their captured differences. History is local, not a Git backup; save edits to disk before expecting them to appear.

## Project structure and related code

Local Git differences and parsers identify changed blocks and resolvable definitions, callers and imports. Hover supported symbols for definitions; expand related code beside a change. Structure filters flag heavily referenced files, temporary-name candidates, identical content and files with no resolved incoming references. These are static signals: dynamic loading, framework entry points and external consumers can be missed. No reference does not mean safe to delete, and identical text does not prove interchangeable behavior.

## AI inline review

AI review starts only when you request it. It reviews the current differences with bounded related context, rather than sending every complete file individually. Results appear at the affected code location with priority, evidence and a recommendation. Cached matching results can be reused. Confirm a problem, mark a false positive or select it for an Agent task. AI can miss defects or raise incorrect suspicions; it does not prove correctness or that tests ran.

## Agent task packages

Select several suspicions and open the Agent task package. Preview, copy or download the Markdown handoff, including code context and revision anchors. The receiving agent should independently assess each suspicion. Modification is optional and explicitly indicated in the package. Paste its JSON report back for review; a repair claim is not a passed test. Exporting a package does not automatically start or contact another agent.

## Run checks

Run checks explicitly to execute detected project commands. Inspect each command, exit code and raw output; missing scripts are unverified, not passed. Project scripts execute code on your computer, so use trusted projects. Reading files, static analysis and AI review do not themselves establish execution evidence. Marking a block read records reading progress only.

## Built-in AI and usage

Sign in with Google or GitHub. Powerduck provides the built-in model; model selectors, custom provider keys and custom endpoints are not offered. Selected source context is sent to managed AI providers only for requested AI work. Local scans exclude common dependency, build and credential paths, but cannot guarantee that your source contains no secrets. Review what you share.

- [API workspace](introduction.md)
- [Code review](code-quality.md)
- [Built-in AI and usage](ai-models.md)
- [Plans and task allowances](../cloud/billing.md)
- [Install and start](../overview/installation.md)
- [Understand every change](../overview/quickstart.md)
