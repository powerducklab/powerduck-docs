---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi 是可扩展的 TypeScript 转换框架，可将 curl 命令和 Postman 集合（v2.0 / v2.1.0）转换为 OpenAPI 3.2 文档，适用于 CI 流水线、API 文档生成和从 HTTP 请求还原接口定义。"
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** 是可扩展的 TypeScript 转换框架，可将 **curl 命令**和 **Postman 集合（v2.0 / v2.1.0）**转换为 **OpenAPI 3.2** 文档，适用于 CI 流水线、API 文档生成和从 HTTP 请求还原接口定义。

它使用 [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) 校验文档。

- **版本：** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **许可证：** MIT
- **Node.js 要求：** `>= 22.12.0`
- **输出：** 仅 OpenAPI **3.2.0**
- **源码：** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## 工作流程

```text
curl 命令 → CurlAdapter
Postman 集合 → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → OpenAPI 3.2 文档
             ↓
     validateOpenApi32() → 诊断信息
```

1. **适配器**将来源数据（curl 文本或 Postman 集合）解析为 [`NormalizedRequest`](./api-reference.md#normalizedrequest) 对象列表。
2. **构建器**按方法和路径合并请求，推断模式、路径参数及安全配置，生成 OpenAPI 3.2 文档。
3. **校验器**通过 `@powerduck/openapi-parser` 按 OpenAPI 模式检查输出，并返回诊断信息。

---

## 功能

- **两个内置适配器：** [`CurlAdapter`](./api-reference.md#curladapter) 支持单条、批量命令及浏览器“全部复制为 cURL”的输出；[`PostmanAdapter`](./api-reference.md#postmanadapter) 支持 v2.0/v2.1.0、嵌套文件夹和鉴权继承。
- **零配置辅助函数：** [`curlToOpenApi`](./api-reference.md#curltoopenapi) 和 [`postmanToOpenApi`](./api-reference.md) 一次调用即可注册适配器并完成转换。
- **OpenAPI 3.2 输出：** 生成文档声明 `openapi: "3.2.0"`，默认启用校验。请检查返回的诊断信息，或启用严格模式，在遇到错误时拒绝转换。
- **多请求合并：** 合并方法和路径相同的操作，并按结构合并查询参数、请求头、Cookie 参数和请求体模式。
- **路径参数推断：** 数字 ID、UUID、ULID 和长十六进制片段在至少 N 个样本中出现变化时，会被转为模板（如 `/users/{userId}`）。
- **安全配置推断：** 识别 Bearer、Basic 和 API 密钥（请求头、查询或 Cookie），生成相应的 `securitySchemes`。
- **多种请求体：** JSON、XML、form-urlencoded、multipart/form-data（文本和文件）、GraphQL、文本、二进制。
- **保留 Postman 测试脚本：** 将 `pm.test()` / `pm.expect()` 写入各操作的 `x-postman-scripts`。
- **诊断信息：** 每个问题包含严重程度和代码，并在可用时附带来源详情；[`strict`](./api-reference.md#convertoptions) 模式遇到错误时抛出异常。
- **可扩展：** 实现 [`SourceAdapter`](./api-reference.md) 即可添加 HAR、HTTPie 或 Insomnia 等来源。

---

## 插件架构

框架的核心是一个精简的适配器接口：

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

通过 [`AdapterRegistry`](./api-reference.md#adapterregistry) 将适配器注册到 [`XToOpenApi`](./api-reference.md#xtoopenapi) 实例：

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

零配置辅助函数已接入两个内置适配器，大多数用户无需直接操作注册表。

---

## 选择辅助函数还是类

| 场景 | API |
|---|---|
| 转换单条或一批 curl 命令 | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| 转换一个 Postman 集合对象或字符串 | [`postmanToOpenApi`](./api-reference.md) |
| 自定义选项、多个适配器、`"auto"` 检测或自定义适配器 | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## 后续阅读

- [安装](./installation.md) — 添加包并了解零配置辅助函数。
- [快速开始](./quickstart.md) — 转换实际 curl 命令、Postman 集合，并使用自定义适配器。
- [API 参考](./api-reference.md) — 所有导出、类型、选项、默认值和诊断代码。
- [示例](./examples.md) — 基础 curl、批量命令、Postman 集合、自定义适配器和路径推断。
