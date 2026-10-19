---
sidebar_position: 2
title: Instalação
description: "Instale o cliente de desktop Powerduck no macOS, Windows e Linux. A aplicação é local-first e arranca sem conta."
---

# Instalação

O cliente de desktop Powerduck é uma aplicação local-first. Instala-se como qualquer outro programa de desktop, abre arquivos reais em disco e arranca sem conta.

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

O cliente desktop envia as solicitações ao modelo pelo processo principal, evitando as restrições CORS entre navegador e provedor. Ainda assim, prompts, contexto relevante e credenciais são enviados ao endpoint do modelo configurado; usar um modelo hospedado não é uma operação offline. A separação dos processos também não garante que segredos nunca apareçam em logs ou ferramentas de desenvolvimento. Veja [IA e modelos](../client/ai-models.md).

## Requisitos

- macOS 11 ou posterior, Windows 10 ou posterior ou uma distribuição Linux desktop comum compatível com Electron 37.
- Espaço em disco para a app. As especificações abertas permanecem na sua localização original.
- A rede só é necessária para enviar requisições, sincronizar fontes Git ou chamar um modelo de IA hospedado; o resto funciona sem conexão.

## Licença

O cliente de desktop pode ser avaliado livremente. Vende-se como licença **perpétua** após uma compra única, sem subscrição. A chave de licença é gerada na compra e mostrada uma só vez. O alojamento na nuvem é um serviço de subscrição à parte. Veja [Faturação da Cloud](../cloud/billing.md) para a distinção.

Depois, passe ao [Início rápido](./quickstart.md).
