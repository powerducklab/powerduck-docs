---
sidebar_position: 2
title: Cloud Quickstart
description: "Sign in, add a specification from upload, Git, or URL, choose exposed operations, and open the documentation and MCP links."
---

# Cloud Quickstart

This path takes a specification from your machine to a shareable documentation page and MCP endpoint.

## 1. Sign in

From the sign-in page, continue with **Google** or **GitHub**. After the OAuth handshake, Powerduck creates its own session and places you in the console. A personal organization is created automatically.

## 2. Add a specification

From the dashboard, add a specification using one of the supported sources:

- **File upload** — upload an OpenAPI file directly;
- **Git repository** — point at a repository and choose a branch and file path;
- **URL** — import a specification from a URL.

Existing OpenAPI 3.0/3.1 and Swagger documents are upgraded, and cURL or Postman input can be converted for preview before anything is saved.

### How a direct upload works

Large files are uploaded straight to object storage rather than relayed through the API:

1. A document is created;
2. The app requests an **upload URL** with the content type and size;
3. The file is uploaded directly to storage via the presigned URL;
4. The upload is **completed**, recording the version and its SHA-256.

This keeps the API server out of the data path for large payloads.

## 3. Choose the exposed operations

After the specification is in place, select which operations are publicly available. Operations can be toggled individually; the source document is left untouched. Start with everything enabled and narrow the set for internal or administrative endpoints.

## 4. Open the links

The document workspace shows the public addresses once the document is active:

- **Documentation** — the rendered API documentation in the public viewer;
- **MCP** — the managed Streamable HTTP MCP endpoint;
- The raw specification data is also served at a stable URL.

By default, documentation is enabled and protected only if you add a password. MCP availability and its access key are configured separately.

## 5. Protect access if needed

- Add a **view password** and an optional expiry for the documentation;
- Generate an **MCP access key** for the MCP endpoint;
- Pause the document to take both offline temporarily.

## 6. Iterate with versions

When the API changes, upload the new content as a new version rather than replacing the old one. Share links can point at the current document or be pinned to a specific version, so a link referencing a version never changes underneath a reader.

## Next steps

- [Documents and versions](./documents-versions)
- [Exposed operations](./exposure)
- [Access control](./access-control)
- [Custom domains](./custom-domains)
