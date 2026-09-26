---
sidebar_position: 9
title: Ajustes
description: "Configure aparência e idioma, comportamento de requisições, proxies, TLS e certificados de cliente, o terminal integrado e as ações de arquivo/shell."
---

# Ajustes

Os ajustes do cliente de desktop cobrem o aspeto da app e como as requisições se enviam. As preferências da app mantêm-se separadas das mudanças no documento de API: mudar o tema ou configurar um proxy não modifica o contrato.

## Aparência

- **Tema** — alternar entre claro e escuro (`theme.get`, `theme.set`); a mudança aplica-se a toda a app e guarda-se.
- **Idioma da interface** — escolher entre dez idiomas ou seguir automaticamente o sistema.

| | | |
|---|---|---|
| English (US) | 简体中文 | 繁體中文 |
| 日本語 | 한국어 | Français |
| Deutsch | Español | Português (Brasil) |
| العربية | | |

O árabe renderiza-se da direita para a esquerda. A opção `auto` segue o idioma do sistema.

## Comportamento de requisições

Estes ajustes controlam as requisições de saída no espaço de trabalho e cenários.

- **Tempo limite** (`requestTimeoutMs`) — em milissegundos; `0` significa ilimitado.
- **SSL estrito** (`strictSSL`) — verificação do certificado TLS; desativável para servidores autofirmados ou não confiáveis.
- **Seguir redirecionamentos** (`followRedirects`) e **máximo de redirecionamentos** (`maxRedirects`).
- **Versão HTTP** (`protocolVersion`) — `http1`, `http2`, `auto`.
- **Desativar cookies** (`disableCookies`) — desliga a gestão de cookies de requisição.

## Proxy

Configure um proxy de saída por um modo (`off`, `system`, `custom`).

- `off` — sem proxy.
- `system` — seguir o proxy do sistema operativo.
- `custom` — usar um URL de proxy, com utilizador, palavra-passe e lista de omissão opcionais.

A lista de omissão aceita hosts e padrões (p. ex. `localhost,127.0.0.1`, hosts curinga). A palavra-passe do proxy é escrevível mas não legível e apaga-se com valor vazio.

## TLS e certificados de cliente

Para ambientes com confiança personalizada ou TLS mútuo:

- **CA personalizada** — ativar e indicar o caminho de um certificado CA para confiar numa raiz interna ou autofirmada.
- **Certificado de cliente (mTLS)** — configurar por host um certificado: par certificado/chave ou PFX, com palavra-passe opcional; o alcance fixam-no host e porta.

Os certificados podem adicionar-se, apagar por ID ou esvaziar por completo. As palavras-passe de certificados são só escrevíveis e não se devolvem.

## Terminal integrado

A app inclui um painel de terminal na parte inferior.

- `terminal.open` mostra o painel; com `{"cwd":"document"}` abre na pasta do documento atual, que o host resolve a um caminho absoluto real.
- `terminal.run` escreve e executa um comando shell explícito após um cartão de confirmação.

Um comando só executa se o pede explicitamente; mostrar o painel não executa nada.

## Ações de arquivo e shell

- `shell.revealFile` — mostra o documento atual (ou um caminho) no gestor de arquivos.
- `shell.openPath` — abre um arquivo com a app por defeito.
- `shell.openExternal` — abre uma página externa no navegador do sistema.

As páginas oficiais do Powerduck usam uma ferramenta própria de link (`app.officialLink`) para renderizar um cartão na conversa sem sair da app.

## Exemplos de código cliente

Para cada operação, o assistente pode gerar código cliente executável (`clientcode.generate`), mostrado num cartão de código com seletor de idioma e biblioteca: C, C#, Go, Java, JavaScript, Node, Kotlin, PHP, Python, Ruby, Rust, shell, Swift, etc. O código aparece num cartão, não na conversa.

## Mudar ajustes pelo assistente

Os pedidos a toda a app — mudar tema ou idioma, configurar um proxy, ignorar erros de certificado, mudar a versão HTTP — tratam-se com ferramentas de ajustes, não como um problema de desenho de API. As mudanças de ajustes pedem confirmação antes de aplicar.

Veja também: [IA e modelos](./ai-models.md)、[Espaço de requisição](./debug.md).
