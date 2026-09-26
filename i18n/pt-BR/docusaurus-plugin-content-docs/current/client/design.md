---
sidebar_position: 2
title: Desenhar com o assistente
description: "Desenhe OpenAPI por um assistente conversacional. As mudanças chegam como cartões de patch revisáveis com operações JSON Patch finas. A edição focada preserva o resto da operação."
---

# Desenhar com o assistente

O modo spec é onde desenha a API. Vincula o chat de IA com o documento ao vivo e a pré-visualização, para que descreva a intenção em linguagem natural mantendo o controlo total das mudanças reais.

## O ciclo de aprovação

O modelo não edita diretamente o documento. Este ciclo é deliberadamente explícito.

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

Esta separação é uma decisão central de projeto. O **modelo** destaca-se em entender a intenção e propor estruturas, o **host** é determinista e valida cada operação, e **você** aprova cada mudança. Uma proposta nunca se considera aplicada antes de confirmar.

## O cartão de patch

O cartão resume a mudança e lista as operações precisas, como adicionar uma rota.

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

Os segmentos de caminho são elementos de array, não cadeias JSON Pointer. Ao adicionar uma rota totalmente nova, o destino é `["paths", "/products"]` e os contentores pais criam-se automaticamente.

### Edições finas sobre uma operação existente

Ao editar uma operação existente, o assistente não reenvia a operação inteira — isso apagaria todos os campos não repetidos. Em vez disso gera pequenas operações que entram na operação e só tocam o que muda.

- Adicionar um parâmetro de consulta:

```json
{ "op": "add", "path": ["paths", "/products", "get", "parameters", "-"], "value": {} }
```

- Estender o esquema de resposta:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "responses", "200", "content", "application/json", "schema", "properties", "total"], "value": { "type": "integer" } }
```

- Mudar um só campo:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "summary"], "value": "..." }
```

Os arrays recebem acréscimos por `"-"`, não um reenvío completo. Os parâmetros identificam-se por `(in, name)` para não duplicar os existentes. O host funde os valores propostos na operação atual e preserva tudo o omitido.

Isto torna o afinamento iterativo fiável: diga «adiciona o parâmetro limit aqui» ou «faz name obrigatório», e só muda esse campo, o resto da operação permanece.

## Ferramentas de leitura fundamentam cada proposta

Antes de responder, o modelo pode chamar ferramentas de só leitura para obter o estado exato, não uma suposição.

- `spec.overview` — título, versão, protocolos, contadores, tags, servers, segurança.
- `spec.listOperations` — cada operação como `METHOD /path`, com resumos e tags.
- `spec.presentOperations` — renderiza um cartão de lista de só leitura de todas as operações.
- `spec.getOperation` — definição completa de uma operação e esquemas referenciados.
- `spec.getSchema` — um esquema de componente único, campos obrigatórios e descrições incluídos.

Quando a forma completa de uma operação não é visível, o modelo deve lê-la antes de editar.

## Os pedidos amplos avançam por passos

Para um grande pedido como «constrói uma API de comércio eletrónico», o assistente não descarrega tudo de uma vez.

1. Primeiro faz **perguntas de esclarecimento** sobre decisões chave.
2. Após responder, propõe **um patch focado de cada vez**, cada cartão com 2 a 5 operações.
3. Só continua enquanto o pedido mais recente siga no alcance desse objetivo.

Uma vez claro o alcance, o assistente produz também um `plan` das operações a construir, para ver a forma do trabalho antes dos patches.

## Proteção contra desvios

O host impõe algumas regras para manter as operações alinhadas.

- O **documento atual** é a autoridade. Se o documento não mostra algo, o modelo não assume que exista um patch prévio.
- Em modo foco só mudam o destino ativo (e os esquemas de componente explicitamente referenciados); sem mudanças oportunistas sobre operações irmãs.
- Mencionar outro `METHOD /path` trata-se como uma mudança de operação intencional.
- As propostas aplicadas e rejeitadas seguem-se no histórico para não repetir patches existentes.

Quando um detalhe necessário não é visível, o assistente não o inventa: faz uma pergunta focada.

## Outros cartões

Nem toda resposta é um patch.

- **Cartões de pergunta** pedem escolher entre opções.
- **Cartões de validação** informam controlos de qualidade com estados de passo, aviso e erro.
- **Cartões de ação** trazem um próximo passo concreto, como executar um cenário ou abrir um espaço.
- **Cartões de tabela de dados** apresentam dados concretos de exemplo/teste para operações ou esquemas.

Veja também: [Espaço de requisição](./debug.md)、[Testes de cenário](./scenario-testing.md)、[IA e modelos](./ai-models.md).
