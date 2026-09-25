---
sidebar_position: 9
title: Settings
description: "Configure appearance and language, request behavior, proxy, TLS and client certificates, the integrated terminal, and file/shell actions."
---

# Settings

The desktop client's settings cover how the application looks and how it makes requests. Application-level preferences are kept separate from changes to an API document, so switching the theme or configuring a proxy never alters the contract.

## Appearance

- **Theme** — switch between light and dark (`theme.get`, `theme.set`). The change applies to the whole application and is persisted.
- **UI language** — choose one of ten languages, or follow the system automatically:

| | | |
|---|---|---|
| English (US) | 简体中文 | 繁體中文 |
| 日本語 | 한국어 | Français |
| Deutsch | Español | Português (Brasil) |
| العربية | | |

Arabic is rendered right-to-left. Selecting `auto` follows the system language.

## Request behavior

These settings control outbound requests made from the Request workspace and scenarios:

- **Request timeout** (`requestTimeoutMs`) — the request timeout in milliseconds; `0` means unlimited;
- **Strict SSL** (`strictSSL`) — verify TLS certificates; disable it to work against servers with self-signed or untrusted certificates;
- **Follow redirects** (`followRedirects`) and **max redirects** (`maxRedirects`);
- **HTTP version** (`protocolVersion`) — `http1`, `http2`, or `auto`;
- **Disable cookies** (`disableCookies`) — turn off cookie handling for requests.

## Proxy

Configure outbound proxying with a mode (`off`, `system`, or `custom`):

- `off` — no proxy;
- `system` — follow the operating system's proxy;
- `custom` — use a proxy URL, with optional username and password and a bypass list.

The bypass list accepts hosts and patterns (such as `localhost,127.0.0.1` and wildcard hosts). Proxy passwords can be written but are never read back; writing an empty value clears it.

## TLS and client certificates

For environments with custom trust or mutual TLS:

- **Custom CA** — enable a CA certificate and provide its path, so requests trust an internal or self-signed root;
- **Client certificates (mTLS)** — configure per-host certificates, either as a certificate/key pair or a PFX file, with an optional passphrase; host and port scope the certificate.

Certificates can be added, removed by id, or cleared. Certificate passphrases are write-only and never returned.

## Integrated terminal

The application includes a bottom terminal panel:

- `terminal.open` reveals the panel; pass `{"cwd":"document"}` to open it in the active document's folder, which the host resolves to the real absolute path;
- `terminal.run` types and runs one explicit shell command, after a confirmation card.

Commands are only run when you explicitly ask for them; revealing the panel does not execute anything.

## File and shell actions

- `shell.revealFile` — show the active document (or a given path) in the system file manager;
- `shell.openPath` — open the document with its default application;
- `shell.openExternal` — open an external third-party page in the system browser.

Official Powerduck pages use a dedicated link tool (`app.officialLink`) that renders an in-chat card rather than leaving the application.

## Client code samples

For any operation, the assistant can generate ready-to-run client code (`clientcode.generate`) and show it in a code card with language and client-library switchers. Supported languages include C, C#, Go, Java, JavaScript, Node, Kotlin, PHP, Python, Ruby, Rust, shell, Swift, and more. The code is shown in the card rather than pasted into the chat.

## Changing settings through the assistant

Application-level requests — switching the theme or language, setting a proxy, ignoring a certificate error, or changing the HTTP version — are handled with the settings tools rather than treated as API-design questions. Settings changes ask for confirmation before they are applied.

Related: [AI and models](./ai-models), [Request workspace](./debug).
