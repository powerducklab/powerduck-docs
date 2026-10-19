---
sidebar_position: 2
title: "इंस्टॉल करना"
description: "@powerduck/workspace-yaml इंस्टॉल करें।"
---

# इंस्टॉल करना

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

पीयर डिपेंडेंसी (अपने-आप इंस्टॉल होती हैं):
- `@powerduck/conf-patch` — एटॉमिक राइट और फ़ाइल लॉकिंग
- `@powerduck/openapi-parser` — OpenAPI का वैलिडेशन और अपग्रेड
- `yaml` — YAML की पार्सिंग और सीरियलाइज़ेशन

## एंट्री पॉइंट

| इंपोर्ट पाथ | विवरण |
|--------|-------------|
| `@powerduck/workspace-yaml` | फ़ाइल लेयर (Node.js / Electron): `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | कोर लेयर (ब्राउज़र में इस्तेमाल की जा सकती है): `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
