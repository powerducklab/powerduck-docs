---
sidebar_position: 6
title: A2A 智能体
description: 在同一份本地 OpenAPI 规范中设计、调试和展示 A2A 消息、任务与事件流。
---

# A2A 智能体

MCP 为 AI 提供工具与资源，A2A 用于智能体之间委派工作、交换消息和跟踪任务。Powerduck 将两者作为独立协议，在同一份本地规范中管理。

## 创建与调试

1. 在调试页选择 **新建请求 → A2A**，默认采用 **A2A 1.0 / JSON-RPC**。
2. 在地址栏填写 Agent 的 JSON-RPC 端点。连接旧版 Agent 时明确选择 **0.3**，不会静默转换协议。
3. 在协议页选择方法，点击 **生成请求体**，预览后通过 **替换请求体** 确认应用。切换选项本身不会覆盖编辑中的请求体。
4. 在请求体中编辑 `params`，在鉴权和请求头中配置凭据。发送时自动设置所选版本的 `A2A-Version` 请求头。
5. 检查完整响应：HTTP 200 也可能包含 JSON-RPC `error`。1.0 的成功响应在 `result` 中封装 `task` 或 `message`；0.3 使用其对应结构。
6. 保存到规范后，版本、端点、实际方法和有效请求示例进入 `x-a2a`，调试草稿继续沿用现有请求扩展。

JSON-RPC 请求 ID 与消息 ID 相互独立。每次生成示例都会生成新 ID；继续已有会话时，应按协议保留服务端返回的任务与上下文标识。

## Agent Card

通过 **获取公开 Agent Card** 读取通常位于 `/.well-known/agent-card.json` 的元数据。先核对接口地址、协议版本、技能、能力与鉴权要求，再设置请求端点。获取元数据不会自动修改端点，也不会向新地址转发当前请求的凭据。

桌面端使用原生 HTTP 执行器；浏览器端需要服务端允许 CORS。公开发现不携带请求凭据、不跟随重定向，响应限制为 1 MiB。A2A 1.0 支持使用可信公钥 JWKS 进行本地 JWS 验签，见下文。受保护的元数据可通过鉴权后的 extended-card RPC 获取。

**保存卡片到规范** 保存的是快照。共享或托管文档前，请确认快照中没有私有信息。

## 任务与流式响应

- 1.0：`SendStreamingMessage`、`SubscribeToTask`。
- 0.3：`message/stream`、`tasks/resubscribe`。

事件沿用 SSE 查看器，保留完整状态与产物更新，支持响应限制和停止接收。

**停止**仅断开本地请求。取消远端任务需要发送 `CancelTask`（1.0）或 `tasks/cancel`（0.3），在 `params.id` 中填写任务 ID。

任务查询、1.0 任务列表、扩展 Card 和推送配置均可使用相应 JSON-RPC 方法。可选操作取决于 Agent 声明的能力；Powerduck 不提供推送回调接收服务。

## OpenAPI 扩展

`x-a2a` 是 Powerduck 扩展，不是 OpenAPI 标准字段或 Agent Card 本身。路径标识文档中的操作，`endpoint` 指向真正发送请求的地址。

```yaml
openapi: 3.2.0
info: {title: Research agent, version: 1.0.0}
paths:
  /agents/research/send:
    post:
      summary: 请求研究智能体
      x-protocol: a2a
      x-a2a:
        version: '1.0'
        binding: JSONRPC
        endpoint: https://agent.example.com/rpc
        agentCardUrl: https://agent.example.com/.well-known/agent-card.json
        method: SendMessage
        requestSchema: {type: object, description: 应用请求参数}
        responseSchema: {type: object, description: JSON-RPC 响应信封}
        example:
          jsonrpc: '2.0'
          id: request-1
          method: SendMessage
          params:
            message:
              messageId: message-1
              role: ROLE_USER
              parts:
                - text: 总结本次发布内容
      responses:
        '200':
          description: 检查 result 或 error
```

流式响应可使用 OAS 3.2 的 `text/event-stream` 和 `itemSchema` 描述单个事件。设计页可分别维护请求、响应字段。文档展示与 Copy for LLM 保留扩展配置和契约，请求代码示例使用实际端点、版本头与 JSON-RPC 请求体。

当前支持 1.0 的三种绑定、0.3 的 JSON-RPC、JWS 验签和服务端项目导出。不提供推送接收器。

协议参考：[A2A 1.0](https://a2a-protocol.org/v1.0.0/specification/)、[A2A 0.3](https://a2a-protocol.org/v0.3.0/specification/)。


## REST、gRPC、验签与服务端生成

A2A 1.0 现在支持 JSON-RPC、REST（`HTTP+JSON`）和桌面端原生 gRPC（`GRPC`）。0.3 继续支持 JSON-RPC，其他组合会明确拒绝。

REST 的 URL 填写挂载根地址（例如 `https://agent.example/rest`），Body 使用直接请求对象；方法决定 HTTP 动词和后缀，任务 ID 单独编码，过滤和分页字段放入查询参数。文档代码示例与 Debug 共用映射。

gRPC 地址为 `https://host:port`（系统证书信任）或本机测试使用的 `http://localhost:port`，不包含路径。请求头作为 metadata，使用官方服务描述和 ProtoJSON 转换。该绑定不执行 HTTP 脚本，也不支持 HTTP 代理和自定义 TLS 设置；不会静默忽略这些配置。停止只取消本地调用，不等同于取消远端任务。

协议、绑定、方法分开展示。切换保留草稿，点击“生成请求体”预览后，再以“替换请求体”确认应用；绑定与请求体形状不匹配时会阻止发送。A2A 不再自动继承不相关的文档服务器地址，可明确选择 Agent Card 中的接口。

Agent Card 支持本地 JWS 验签：展开“验证 JWS 签名”，粘贴经可信渠道获得的公钥 JWKS。不会访问卡片中的密钥 URL；未签名和尚未验证会明确标注。验签按 A2A 1.0 的字段存在性和 RFC 8785 规则保留必填空值。错误删除这些字段的签名需要重新签署。自定义非标准字段不受签名保护，保存快照不保存信任结论。

“服务端生成”导出 Node 22+ 三绑定项目。配置至少 32 字符的随机 `A2A_TOKEN` 和 `HANDLER_URL`，安装依赖后启动。业务处理器接收 `{message, contextId}`，返回带非空 `parts` 的 Message。项目包含响应限制、60 秒期限、并发限制、关闭清理和可通过 `SIGNING_JWK_FILE` 启用的 Agent Card 签名，不导出用户请求密钥。

生成的是无状态消息适配服务，并非自动实现业务逻辑的模型或持久任务引擎。持久任务、远端取消、推送通知需自行配置执行器和持久存储。公网部署还需配置公开地址、TLS、HTTP 反向代理限流；多用户场景应替换共享令牌身份。具体配置见导出项目 README。

## 可运行的本地示例

Powerduck React 仓库包含 `examples/a2a-demo`。使用 Node.js 22+，在该目录执行 `npm ci` 和 `npm start` 即可启动本地计算器，无需 AI 密钥或外部服务。导入其中的 `openapi.json`，可分别使用 JSON-RPC、REST 和桌面端 gRPC 调试同一业务。README 提供演示 token、Agent Card 发现、可信本地 JWKS 和流式请求步骤。执行 `npm test` 可实测传输与签名防篡改。

协议面板中的「生成请求体」先预览当前方法的模板，再通过「替换请求体」明确应用；取消或仅切换方法均保留原草稿。

```bash
cd powerduck-react/examples/a2a-demo
npm ci
npm start
# 在同一目录另开终端执行验证：
npm test
```

本地端点：JSON-RPC `http://127.0.0.1:9999/rpc`，REST `http://127.0.0.1:9999/rest`，gRPC `http://127.0.0.1:9998`。公开卡片地址为 `http://127.0.0.1:9999/.well-known/agent-card.json`。演示 Bearer Token 为 `powerduck-local-demo-token-0123456789`。发送数字 `[12,30]`，应返回 `Sum: 42` 和结构化字段 `total: 42`。可信公钥位于 `.runtime/trusted-jwks.json`，重启后会变化。Demo 仅监听本机，不需要 AI 密钥，不实现持久任务与推送；不要使用演示 token 对外部署。浏览器默认允许 `http://localhost:3000` 与 `http://127.0.0.1:3000`，其他来源通过 `CORS_ORIGINS` 明确配置；导出的服务端同样支持该白名单。
