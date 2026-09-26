---
sidebar_position: 2
title: Início rápido da Cloud
description: "Inicie sessão, adicione uma spec por arquivo, Git ou URL, escolha as operações expostas e abra os links de documentação e MCP."
---

# Início rápido da Cloud

Este fluxo leva uma spec desde a sua máquina a uma página de documentação compartilhável e um endpoint MCP.

## 1. Iniciar sessão

Na página de início, continue com **Google** ou **GitHub**. Após o handshake OAuth, Powerduck cria a sua sessão e direciona à consola. Cria-se automaticamente uma organização pessoal.

## 2. Adicionar a spec

Desde o dashboard, adicione uma spec por uma fonte suportada.

- **Arquivo** — subir um arquivo OpenAPI diretamente.
- **Repositório Git** — apontar a um repositório e escolher ramo/caminho de arquivo.
- **URL** — importar uma spec desde uma URL.

Os documentos OpenAPI 3.0/3.1 e Swagger existentes atualizam-se, e as entradas cURL ou Postman convertem-se antes de guardar, com pré-visualização.

### Como funciona a subida direta

Os arquivos grandes sobem diretamente ao armazenamento de objetos, não através da API.

1. Criar o documento.
2. A app solicita uma **URL de subida** com tipo de conteúdo e tamanho.
3. O arquivo sobe diretamente ao armazenamento pela URL prefirmada.
4. **Completar** a subida e registar versão e SHA-256.

Assim o servidor API fica fora do caminho de cargas grandes.

## 3. Escolher as operações expostas

Uma vez lista a spec, escolha as operações a fazer públicas, ativáveis individualmente; o documento original não muda. Pode começar com todas ativas e restringir interfaces internas/admin.

## 4. Abrir os links

Com o documento ativo, o espaço do documento mostra os endereços públicos.

- **Documentation** — documentação API renderizada no visualizador público.
- **MCP** — endpoint MCP Streamable HTTP gerenciado.
- Os dados originais da spec também se servem numa URL estável.

Por defeito a documentação está ativa e só protegida por senha. A disponibilidade de MCP e a chave de acesso configuram-se separadamente.

## 5. Proteger o acesso se for preciso

- Adicionar **senha de visualização** e data de validade opcional à documentação.
- Gerar uma **chave de acesso MCP** para o endpoint.
- Pausar o documento para tirar ambos temporariamente da rede.

## 6. Repetir por versões

Quando muda a API, suba o novo conteúdo como uma nova versão em vez de substituir a antiga. Os links compartilhados podem seguir o documento atual ou fixar-se a uma versão, para que não mudem sob os leitores.

## Próximos passos

- [Documentos e versões](./documents-versions.md)
- [Operações expostas](./exposure.md)
- [Controlo de acesso](./access-control.md)
- [Domínios personalizados](./custom-domains.md)
