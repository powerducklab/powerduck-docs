---
sidebar_position: 2
title: 用助手进行设计
description: "通过对话式助手设计 OpenAPI。改动以可审阅的补丁卡片呈现，带有精细的 JSON Patch 操作；聚焦编辑会保留操作的其余部分。"
---

# 用助手进行设计

规范形态是设计 API 的地方。它把 AI 对话与实时文档和预览配对，因此你可以用自然语言描述意图，同时对实际发生的改动保持完全控制。

## 批准闭环

模型不会直接编辑文档。这个闭环被刻意做得很明确：

```text
you describe an intent
        |
the model reads current state and proposes operations
        |
the host validates the proposal
        |
you review a patch card and Apply or Reject
        |
the change is merged into the document
```

这种分离是关键的设计决策。**模型**擅长理解意图并提出结构；**宿主**是确定性的，校验每个操作；**你**批准每项改动。在你确认之前，提案从不会被视为已应用。

## 补丁卡片

补丁卡片总结改动并列出确切的操作，例如添加一条新路径：

```json
{
  "type": "patch",
  "summary": "Add GET /products endpoint",
  "ops": [
    { "op": "add", "path": ["paths", "/products"], "value": { "get": {} } }
  ],
  "affects": { "paths": ["/paths/~1products"], "resources": ["Product"] }
}
```

路径段是数组元素，而不是 JSON Pointer 字符串。添加一条全新路径时目标为 `["paths", "/products"]`，并会自动创建父容器。

### 对已有操作的精细编辑

当你编辑一个已存在的操作时，助手**不会**重新发送整个操作，因为那样会清除它没有回显的每个字段。它改为生成只触及你所改部分的小操作，深入操作内部：

- 添加一个查询参数：

```json
{ "op": "add", "path": ["paths", "/products", "get", "parameters", "-"], "value": {} }
```

- 扩展响应模式：

```json
{ "op": "replace", "path": ["paths", "/products", "get", "responses", "200", "content", "application/json", "schema", "properties", "total"], "value": { "type": "integer" } }
```

- 更改单个字段：

```json
{ "op": "replace", "path": ["paths", "/products", "get", "summary"], "value": "..." }
```

数组用 `"-"` 标记追加，而不是整体重发。参数以 `(in, name)` 为键，因此已有的参数从不会重复。宿主把提议的值合并进当前操作，并保留你省略的一切。

这正是让反复细化变得可靠的原因：当你说"现在加一个 limit 参数"或"把 name 设为必填"时，只有那个字段变化，操作的其余部分保持不变。

## 读取工具为每个提案提供依据

回答之前，模型可以调用只读工具获取确切的当前状态，而不是猜测：

- `spec.overview`——标题、版本、协议、数量、标签、servers、安全；
- `spec.listOperations`——每个操作以 `METHOD /path` 呈现，带摘要和标签；
- `spec.presentOperations`——渲染一张所有操作的只读列表卡片；
- `spec.getOperation`——单个操作的完整定义及其引用的模式；
- `spec.getSchema`——单个组件模式，包含必填字段和描述。

每当操作的完整形态不可见时，模型应在编辑前先读取该操作。

## 宽泛请求会分阶段进行

对于"构建一个电商 API"这类大型请求，助手不会一次倾倒所有内容：

1. 它先就关键决策提出一个**澄清问题**；
2. 你回答后，它**一次提出一个聚焦补丁**，每张卡片含两到五个操作；
3. 仅当你最近的请求仍处于该目标之内时它才继续。

一旦范围明确，助手还会生成一份它打算创建的接口的 `plan`，这样你能在补丁到来之前看到工作的形态。

## 避免漂移

宿主强制执行几条规则以保持工作对齐：

- **当前文档**是权威状态；如果文档表明并非如此，模型不会假设某个更早的补丁已存在；
- 在聚焦模式下，只修改活动目标（以及显式引用的组件模式）——不会对同级接口做机会性改动；
- 显式点名另一个 `METHOD /path` 会被视为有意的任务切换；
- 已应用和已拒绝的提案会从历史中跟踪，已存在的补丁不会重复。

如果所需细节不可见，助手会提出聚焦问题，而不是凭空捏造。

## 其他卡片

并非每个响应都是补丁：

- **问题卡片**请你在选项之间选择；
- **校验卡片**报告质量检查，含通过、警告和错误状态；
- **动作卡片**提供具体的下一步，例如运行场景或打开某个工作区；
- **数据表卡片**为某个接口或模式呈现具体的示例或测试数据。

相关：[请求工作区](/docs/client/debug)、[场景测试](/docs/client/scenario-testing)、[AI 与模型](/docs/client/ai-models)。
