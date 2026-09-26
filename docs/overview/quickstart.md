---
sidebar_position: 3
title: Quickstart
description: "Go from an OpenAPI file to a designed endpoint, a live request, and rendered documentation in a few minutes."
---

# Quickstart

This short path takes you through the core loop: open a specification, change it through the AI assistant, send a request, and view the result as documentation. Everything uses the same OpenAPI document.

## 1. Open a specification

Launch the client and open a specification using whichever source you have. All of the following are supported through the same import flow and are converted or upgraded to OpenAPI 3.2 automatically:

- An **OpenAPI or Swagger file** on disk (Swagger 2.0 and OpenAPI 3.0/3.1 are upgraded);
- A **Postman collection**;
- A **cURL command**;
- A **Git repository**;
- A **URL** pointing at a specification.

You can also drag a file directly into the workspace. If you have nothing to start from, ask the assistant to create an initial skeleton from a short description.

## 2. Ask the assistant to add an endpoint

In the chat, describe what you need, for example:

> Add a `GET /products` endpoint that returns a paginated list of products.

The assistant responds with a **patch card** rather than editing the document directly. The card shows the operations it intends to change, along with the affected paths and resources. Review it and choose **Apply** or **Reject**. Nothing reaches the document until you apply it.

For a broad request such as "build an e-commerce API," the assistant asks a clarifying question first, then proposes focused patches of two to five operations at a time.

## 3. Refine one operation without drift

Open an operation and refine it in place — for example, add a query parameter or extend the response schema. In focused mode, the assistant emits granular patches that touch only the field you asked about and preserves every other field of the operation. This is what keeps repeated back-and-forth edits on the same API from wandering or overwriting existing work.

## 4. Send a real request

Switch to the **Request workspace** for the operation and send it. The request is executed through the local main process. The response, status, headers, and timing are shown alongside the operation, and the request workspace supports environments and variables for values that change between runs.

If the request cannot be built because the base URL is missing from both the specification's `servers` and the active environment, the app asks you to provide one rather than guessing.

## 5. View documentation

Open **Documentation** to render the same specification as readable API documentation. Because the viewer reads the live document, the documentation always matches what you just designed.

## 6. Go further when you're ready

- Chain several requests into a [scenario test](../client/scenario-testing.md) and export an HTML report;
- Run a [local mock server](../client/mock-server.md) while the backend is being built;
- Model streaming and RPC APIs across [six protocols](../client/protocols.md);
- Derive database tables, relationships, and SQL in the [data model](../client/data-model.md);
- Publish the same specification online with [Powerduck Cloud](../cloud/quickstart.md).

You now have the full loop. The rest of the documentation covers each workspace in depth.
