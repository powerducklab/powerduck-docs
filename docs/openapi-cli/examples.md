---
sidebar_position: 5
title: Examples
description: "Ready-to-run examples for @powerduck/openapi-cli: CLI usage, programmatic runs, auth, filtering, reports, and assertions."
---

# Examples

Practical examples for `@powerduck/openapi-cli`, based on the actual CLI flags
and programmatic API.

## 1. Basic CLI test

Point the CLI at a local OpenAPI document and run every operation:

```bash
openapi-cli --spec openapi.json
```

Override the server and write reports to a custom directory:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Test a spec hosted on a remote URL:

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. Programmatic run with auth

Use the library API with a bearer token, custom headers, and concurrency:

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  timeout: 15000,
  bearer: process.env.BEARER_TOKEN,
  header: ["X-Environment: staging", "X-Team: platform"],
});

const report = await runTests(config);

printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

console.log(
  `Passed ${report.summary.passed}/${report.summary.total} (${report.summary.passRate}%)`,
);
```

## 3. Filtered test run

Run only a subset of operations by method, tag, path regex, or operationId:

```bash
# Only GET and POST requests
openapi-cli --spec openapi.json --method get,post

# Only operations tagged "public" and "v2"
openapi-cli --spec openapi.json --tag public,v2

# Only paths under /api/v2
openapi-cli --spec openapi.json --path "^/api/v2"

# Only specific operations
openapi-cli --spec openapi.json --operation-id getUser,createUser
```

Equivalent programmatic configuration:

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  filter: {
    methods: ["get", "post"],
    tags: ["public", "v2"],
    paths: ["^/api/v2"],
    operationIds: ["getUser", "createUser"],
  },
});
```

## 4. JSON and HTML report generation

Choose which formats to emit with `--format`. By default all three are written:

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

Programmatic equivalent:

```typescript
import { resolveConfig, runTests, generateJsonReport, generateHtmlReport } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  format: "json,html",
  output: "./reports",
});

const report = await runTests(config);

const jsonPath = generateJsonReport(report, config.outputDir);
const htmlPath = generateHtmlReport(report, config.outputDir);

console.log("Wrote", jsonPath, "and", htmlPath);
```

`generateJsonReport` writes `report.json`; `generateHtmlReport` writes
`report.html`. Both create the output directory if missing and return the file
path.

## 5. Declarative assertions in the spec

Add an `x-tests` array to any operation. Each entry needs a `name` and an
`assert` type:

```json
{
  "paths": {
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "content-type is JSON", "assert": "header", "key": "content-type", "contains": "application/json" },
          { "name": "user id exists", "assert": "jsonPath", "path": "$.id", "exists": true },
          { "name": "user is active", "assert": "jsonPath", "path": "$.status", "equals": "active" },
          { "name": "response under 2s", "assert": "responseTime", "max": 2000 },
          { "name": "body contains email", "assert": "bodyContains", "contains": "@" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

Assertion types:

| `assert` | Required fields | Purpose |
|----------|-----------------|---------|
| `status` | `value` | HTTP status equals `value` |
| `header` | `key`; optional `contains` | Header exists; optionally includes a substring |
| `bodyContains` | `contains` | Response body includes the substring |
| `bodyEquals` | `body` | Response body exactly equals `body` |
| `jsonPath` | `path`; optional `equals` / `exists` | Resolve a JSONPath and compare or check existence |
| `responseTime` | `max` | Duration must be `<= max` ms |

## 6. Postman scripts

Embed a full Postman test script via `x-postman-scripts`:

```json
{
  "paths": {
    "/users": {
      "get": {
        "operationId": "listUsers",
        "x-postman-scripts": {
          "test": "pm.test('status is 200', () => pm.response.to.have.status(200)); pm.test('users is an array', () => pm.expect(pm.response.json().users).to.be.an('array'));"
        },
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

Declarative `x-tests` and `x-postman-scripts` may coexist on the same operation.

## 7. CI integration (GitHub Actions)

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - name: Run API tests
        run: npx @powerduck/openapi-cli --spec openapi.json --server ${{ secrets.API_URL }} --output ./reports
        env:
          BEARER_TOKEN: ${{ secrets.BEARER_TOKEN }}
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: openapi-cli-reports
          path: ./reports
```

The CLI exits `1` on failure so the job fails automatically; use
`--no-fail-on-error` when you only want reports without failing the pipeline.
