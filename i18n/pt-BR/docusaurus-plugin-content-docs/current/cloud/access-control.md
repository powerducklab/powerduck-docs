---
sidebar_position: 5
title: Controlo de acesso
description: "Proteja a documentação com senha de visualização e validade, o MCP com chave de acesso, e configure a autenticação upstream do servidor MCP. Entenda cada porta que decide a abertura."
---

# Controlo de acesso

Powerduck separa **como um leitor acede à documentação** e **como um cliente acede ao endpoint MCP**, porque as formas de consumo são distintas. Além disso configura como o servidor MCP se autentica perante a API upstream.

## Cada porta (em ordem)

Várias condições decidem se uma superfície pública abre; a lista completa responde ao frequente «porquê a minha documentação não abre?».

1. **Estado do documento** — deve estar `ACTIVE` (nem pausado, arquivado nem eliminado).
2. **Modo ativo** — `documentationEnabled` para documentação, `mcpEnabled` para MCP.
3. **Credenciais** — senha de visualização para documentação se configurada, chave de acesso para MCP.
4. **Data de validade** — a visualização pode caducar num momento fixo.

O artefato publicado atrás de cada modo constrói-se automaticamente após adicionar versão ou mudar exposição, por isso a publicação normalmente não é manual.

Cada modo é independente: desativar MCP não afeta a documentação, e a senha de documentação não protege o MCP.

## Senha de visualização

A senha protege a documentação renderizada e os dados da spec servidos.

- A senha guarda-se hasheada com **scrypt** e um sal aleatório por senha; nunca em texto simples.
- Uma vez fixada, o leitor deve introduzi-la antes de servir.
- É **específica da documentação**: o endpoint MCP usa a sua própria chave e ignora a senha de visualização.

Também pode fixar-se uma **data de validade**; após caducar rejeita-se mesmo a senha correta. Remover senha ou validade levanta a restrição.

## Chave de acesso do endpoint MCP

O endpoint MCP protege-se com uma **chave de acesso** própria.

- Crie uma chave (ou substitua-a); a chave completa devolve-se só **uma vez**, depois mostram-se só os últimos quatro caracteres.
- Uma vez configurada, toda requisição MCP deve apresentá-la como token `Bearer`.
- As chaves apresentadas comparam-se em **tempo constante**, e ausência/erro dá `401`.

Apagar a chave abre o endpoint se o documento está ativo e MCP ativado.

## Autenticação upstream de MCP

Além da proteção do endpoint, configure como o servidor MCP se autentica perante a **API upstream** descrita pela spec. Tipos suportados:

| `authType` | Configuração |
|---|---|
| `NONE` | Sem autenticação upstream |
| `BEARER` | Token Bearer |
| `BASIC` | Utilizador e palavra-passe Basic |
| `APIKEY` | Nome da chave API (cabeçalho/query) e valor |

Os segredos como o token Bearer, palavra-passe Basic ou valor da chave são escrevíveis mas não legíveis; a configuração só mostra se estão fixados.

Outros ajustes MCP:

- **Sobrescritura da URL base** — usar uma URL base upstream distinta da spec.
- **Tempo limite de requisição** — usado pelo servidor MCP em chamadas upstream.

## Ajustes recomendados

- **Documentação pública:** documentação ativa, sem senha para uma API aberta ou senha + validade para compartilhar controlado.
- **MCP para os seus próprios agentes:** ativar MCP e criar uma chave de acesso para que só os seus clientes chamem.
- **Autenticação upstream:** alinhar a autenticação do servidor MCP com os requisitos reais da API, independentemente de quem pode chamar o endpoint.

Veja também: [Operações expostas](/docs/cloud/exposure)、[Documentos e versões](/docs/cloud/documents-versions)、[Domínios personalizados](/docs/cloud/custom-domains).
