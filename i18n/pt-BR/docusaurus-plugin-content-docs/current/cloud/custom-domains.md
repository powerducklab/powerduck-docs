---
sidebar_position: 6
title: Domínios personalizados
description: "Vincule um nome de host (ou nome de host e subcaminho) a um documento. Verifique a propriedade por um registro TXT DNS e depois sirva documentação e MCP desde o seu domínio."
---

# Domínios personalizados

Por defeito os documentos servem-se desde o endereço de partilha do Powerduck. Um domínio personalizado mostra documentação e MCP sob **o seu próprio nome de host** em vez do link de partilha, importante para publicar a API com marca.

É uma função paga, disponível nos planos **Pro e Team** (verificada pela autorização `oas.custom_domain`).

## Vinculação de host completo versus subcaminho

A vinculação aponta a:

- **Host completo** — `api.example.com` serve um documento na raiz.
- **Host e subcaminho** — `example.com/v1` serve um documento sob `/v1`.

La vinculação por subcaminho permite que um nome de host sirva vários documentos.

```text
example.com/v1  -> document A
example.com/v2  -> document B
```

Assim evita o limite de um nome de host por documento e suporta caminhos base versionados.

## Rotas desde o domínio personalizado

Os mesmos modos disponíveis no endereço de partilha servem-se sob rotas curtas e estáveis no domínio vinculado.

| Modo | Host completo | Subcaminho |
|---|---|---|
| Spec atual | `/oas` | `/v1/oas` |
| Spec fixada por versão | `/v/:version/oas` | `/v1/v/:version/oas` |
| MCP | `/mcp` | `/v1/mcp` |

O host resolve ao documento vinculado pelo nome de host da requisição e caminho. Estas rotas gerem verificações CORS.

## Adicionar e verificar um domínio

O domínio não é confiável antes de verificar propriedade, por isso o fluxo é claro.

1. **Adicionar** o nome de host (ou nome de host e caminho) ao documento.
2. O serviço devolve a vinculação e **instruções DNS**.
3. Criar o registro DNS e **verificar**.
4. A vinculação passa de pendente a verificada e começa a servir.

A confirmação de propriedade usa um **registro TXT**.

| Campo | Valor |
|---|---|
| Tipo de registro | `TXT` |
| Host | `_powerduck-challenge.<your-domain>` |
| Valor | `powerduck-verify=<verification-token>` |

A verificação lê o registro TXT no DNS e compara o token em tempo constante. Uma vinculação verificada permanece verificada, sem necessidade de redeteção.

### Exemplo

Para `api.example.com`, criar um registro TXT.

```text
_powerduck-challenge.api.example.com
TXT "powerduck-verify=<the-token-shown-for-the-binding>"
```

Depois escolher **Verificar** no espaço do documento. Uma vez marcado como verificado, documentação e MCP servem-se desde esse domínio (documento ativo, modos ativos).

## Gerenciar vinculações

- **Listar** os domínios vinculados ao documento, com estado e caminho base.
- **Verificar** uma vinculação pendente após o registro DNS.
- **Eliminar** uma vinculação para deixar de servir desde esse domínio.

Mudar indicadores de acesso invalida a resolução de host em cache, para que as atualizações surtam efeito logo e não se sirvam vinculações antigas.

## Os controlos de acesso seguem aplicando

O domínio personalizado não é uma via de omissão: as mesmas portas aplicam.

- O documento deve estar `ACTIVE`.
- Cada modo tem o seu indicador ativo.
- A senha de visualização segue protegendo a documentação e a chave de acesso o MCP.

Veja [Controlo de acesso](./access-control).

Veja também: [Documentos e versões](./documents-versions)、[Faturação](./billing).
