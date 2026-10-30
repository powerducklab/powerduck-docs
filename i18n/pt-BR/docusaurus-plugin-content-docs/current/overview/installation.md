---
sidebar_position: 2
title: Instalação
description: "Powerduck · Google OAuth / GitHub · Free / Pro / Max"
---

# Instalação

O Powerduck, incluindo o aplicativo desktop, exige login com Google OAuth ou GitHub. Os arquivos permanecem no disco. A análise de IA envia o contexto selecionado aos provedores gerenciados pelo Powerduck. URLs de modelos e chaves API próprias não são mais aceitas.

## Descarga

Obtenha o instalador para a sua plataforma no [site do Powerduck](https://www.powerduck.com/#download). Os seguintes builds são produzidos com `electron-builder`.

| Plataforma | Instalador | Arquiteturas |
|---|---|---|
| macOS | `.dmg` (e `.zip` para atualizações automáticas) | Apple Silicon (`arm64`) e Intel (`x64`) |
| Windows | Instalador NSIS (`.exe`) | `x64` |
| Linux | AppImage (`.AppImage`) | `x64` |

## macOS

1. Abra o `.dmg` e arraste Powerduck para **Aplicações**.
2. Na primeira execução, o macOS pode pedir confirmação para abrir um aplicativo baixado fora da App Store. Antes de abrir, verifique se ele veio da página oficial; não desative as verificações de segurança do sistema.
3. Publicam-se dois builds: `arm64` para Apple Silicon (série M) e `x64` para Mac Intel. Descarregue o correspondente.

## Windows

1. Execute o instalador NSIS (`.exe`) e siga a configuração.
2. Se o SmartScreen informar um editor desconhecido, confira primeiro se o instalador veio da página oficial. Continue apenas depois de verificar a origem; não ignore o aviso para um download não confiável.

## Linux

1. Descarregue o `.AppImage`.
2. Torne-o executável e lance.

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```

O AppImage funciona sem instalação no sistema. Algumas distribuições precisam de FUSE para a montagem.

## O que roda na sua máquina

O cliente de desktop é uma app Electron em duas partes.

- O **processo principal** (Node.js), que gere o acesso a arquivos, as requisições HTTP externas, o servidor de simulação local, as conexões a bases de dados e o terminal integrado.
- O **renderer** (o espaço de trabalho React), que mostra a especificação, o chat de IA e as ferramentas.

O Powerduck, incluindo o aplicativo desktop, exige login com Google OAuth ou GitHub. Os arquivos permanecem no disco. A análise de IA envia o contexto selecionado aos provedores gerenciados pelo Powerduck. URLs de modelos e chaves API próprias não são mais aceitas.

## Requisitos

- macOS 11 ou posterior, Windows 10 ou posterior ou uma distribuição Linux desktop comum compatível com Electron 37.
- Espaço em disco para a app. As especificações abertas permanecem na sua localização original.
- O Powerduck, incluindo o aplicativo desktop, exige login com Google OAuth ou GitHub. Os arquivos permanecem no disco. A análise de IA envia o contexto selecionado aos provedores gerenciados pelo Powerduck. URLs de modelos e chaves API próprias não são mais aceitas.

## Powerduck · Free / Pro / Max

Free: 300.000 credits por dia, renovados às 00:00 UTC. Pro: US$ 39/mês e 18.000.000 credits a cada 7 dias. Max: US$ 99/mês e 60.000.000 credits a cada 7 dias. O ciclo começa na assinatura original, separado da cobrança mensal. Sem acúmulo. Desktop e AI Chat compartilham o plano pessoal; licenças perpétuas e chaves de ativação não são mais vendidas.

Depois, passe ao [Início rápido](./quickstart.md).
