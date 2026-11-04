---
sidebar_position: 1
title: "API workspace · Code review"
description: "Powerduck helps you understand what changed, inspect the surrounding code, and decide what needs attention as AI produces more code. The desktop app combines an API workspace with code review; either workflow can be opened independently from Home."
---

# API workspace · Code review

Powerduck helps you understand what changed, inspect the surrounding code, and decide what needs attention as AI produces more code. The desktop app combines an API workspace with code review; either workflow can be opened independently from Home.

## API workspace

Import an OpenAPI YAML or JSON file to design operations, send requests, inspect responses, run scenarios, serve local mocks, explore data models and render documentation. MCP and publishing are separate workflows. Importing an API definition does not deploy your business backend.

## Code review

Choose a code folder. The project structure opens first; select a file to read its full source. Switch between source only, full comparison and changes only. Added and removed lines, inline character highlights, change navigation and search help locate the actual edit without losing context.

## Project structure and related code

Local Git differences and parsers identify changed blocks and resolvable definitions, callers and imports. Hover supported symbols for definitions; expand related code beside a change. Structure filters flag heavily referenced files, temporary-name candidates, identical content and files with no resolved incoming references. These are static signals: dynamic loading, framework entry points and external consumers can be missed. No reference does not mean safe to delete, and identical text does not prove interchangeable behavior.

## Built-in AI and usage

Sign in with Google or GitHub. Powerduck provides the built-in model; model selectors, custom provider keys and custom endpoints are not offered. Selected source context is sent to managed AI providers only for requested AI work. Local scans exclude common dependency, build and credential paths, but cannot guarantee that your source contains no secrets. Review what you share.

- [API workspace](introduction.md)
- [Code review](code-quality.md)
- [Built-in AI and usage](ai-models.md)
- [Plans and task allowances](../cloud/billing.md)
- [Install and start](../overview/installation.md)
- [Understand every change](../overview/quickstart.md)
