---
sidebar_position: 4
title: "API संदर्भ"
description: "कोर और फ़ाइल परत के फ़ंक्शन, विकल्प और त्रुटि कोड।"
---

# API संदर्भ

## कोर परत (`@powerduck/workspace-yaml/core`)

| फ़ंक्शन | विवरण |
|----------|-------------|
| `createWorkspaceYaml(options?)` | workspace.yaml सामग्री की स्ट्रिंग बनाएँ |
| `createOpenApiYaml(options)` | OpenAPI 3.2 YAML सामग्री की स्ट्रिंग बनाएँ |
| `createWorkspaceWithApi(options)` | कार्यक्षेत्र और OpenAPI, दोनों की सामग्री बनाएँ |
| `parseWorkspaceYaml(content)` | workspace.yaml स्ट्रिंग पार्स करें और जाँचें |

### `createOpenApiYaml(options)` — विकल्प

| विकल्प | टाइप | ज़रूरी | विवरण |
|--------|------|----------|-------------|
| `title` | `string` | हाँ | API शीर्षक |
| `version` | `string` | नहीं | डिफ़ॉल्ट `"1.0.0"` |
| `description` | `string` | नहीं | API विवरण |
| `contact` | `{ name?, url?, email? }` | नहीं | संपर्क जानकारी |
| `license` | `{ name, url? }` | नहीं | लाइसेंस जानकारी |
| `servers` | `Array<{ url, description? }>` | नहीं | सर्वर सूची |

## फ़ाइल परत (`@powerduck/workspace-yaml`)

| फ़ंक्शन | विवरण |
|----------|-------------|
| `initializeWorkspace(options)` | डिस्क पर workspace.yaml फ़ाइल बनाएँ |
| `initializeOpenApi(options)` | डिस्क पर OpenAPI YAML फ़ाइल बनाएँ |
| `createWorkspaceApi(options)` | दोनों फ़ाइलें एटॉमिक तरीके से बनाएँ (विफल होने पर रोलबैक) |

### `createWorkspaceApi(options)` — विकल्प

| विकल्प | टाइप | ज़रूरी | विवरण |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | हाँ | लक्ष्य डायरेक्टरी |
| `oasId` | `string` | हाँ | अद्वितीय API पहचानकर्ता |
| `name` | `string` | हाँ | दिखाया जाने वाला नाम |
| `file` | `string` | नहीं | सापेक्ष पाथ (डिफ़ॉल्ट: `oasFiles/${oasId}.openapi.yaml`) |
| `title` | `string` | नहीं | API शीर्षक (डिफ़ॉल्ट: `name`) |
| `version` | `string` | नहीं | API संस्करण (डिफ़ॉल्ट: `"1.0.0"`) |
| `overwriteOpenApi` | `boolean` | नहीं | डिफ़ॉल्ट `false` |

## त्रुटियाँ

सभी त्रुटियाँ `WorkspaceYamlError` के इंस्टेंस हैं, जिनमें मशीन-पठनीय `code` होता है:

| कोड | विवरण |
|------|-------------|
| `INVALID_ARGUMENT` | अमान्य इनपुट पैरामीटर |
| `ALREADY_EXISTS` | फ़ाइल पहले से मौजूद है और ओवरराइट false है |
| `NOT_FOUND` | फ़ाइल नहीं मिली |
| `IO_ERROR` | फ़ाइल सिस्टम ऑपरेशन विफल |
| `INVALID_WORKSPACE` | अमान्य कार्यक्षेत्र कॉन्फ़िगरेशन |
| `INVALID_OPENAPI` | अमान्य OpenAPI दस्तावेज़ |
| `ROLLBACK_FAILED` | ट्रांज़ैक्शन रोलबैक विफल |
