---
sidebar_position: 3
title: Documentos e versões
description: "Os documentos vivem sob projetos com um ciclo de vida de estado claro. Cada mudança cria uma nova versão imutável, e as fontes compreendem subida e sincronização Git."
---

# Documentos e versões

Um documento é a representação hospedada duma única API. Pertence a um projeto da organização e acumula versões ao longo do tempo em vez de sobrescrever.

## A hierarquia

```text
Organization -> Project -> Document -> Versions
```

Um documento pode criar-se diretamente sob a organização ou num projeto e listar-se por projeto e organização.

## Ciclo de vida de estado

O documento passa por quatro estados.

| Estado | Significado | Serviço público |
|---|---|---|
| `ACTIVE` | Online | Documentação e MCP servidos (segundo indicadores ativos) |
| `PAUSED` | Em pausa | Serviços públicos não disponíveis |
| `ARCHIVED` | Conservado, mas não atual | Não servido |
| `DELETED` | Eliminado de forma lógica | Não servido |

Transições permitidas:

```text
pause:    ACTIVE  -> PAUSED
resume:   PAUSED  -> ACTIVE
archive:  ACTIVE / PAUSED -> ARCHIVED
restore:  ARCHIVED -> ACTIVE
delete:   ACTIVE / PAUSED / ARCHIVED -> DELETED
```

Pausar é a forma mais rápida de tirar e retomar; arquivar conserva o histórico mas não trata o documento como atual; eliminar é lógico, por isso os dados centrais não se destroem logo.

## As versões são imutáveis

Quando muda a spec, adiciona-se uma nova versão; o original nunca se substitui.

```text
v1 -> v2 -> v3 -> v4
```

Cada versão regista:

- A **chave de armazenamento** do arquivo no armazém de objetos.
- O valor **SHA-256**.
- Tipo de conteúdo, tamanho e data de criação.

Isto suporta histórico, reversão, comparação e regeneração de documentação/MCP para uma versão concreta.

### Links atuais versus fixados por versão

- Os links ao documento **atual** seguem a versão mais recente.
- Os links **fixados por versão** referenciam uma versão concreta e não mudam sob o leitor.

Use links fixados quando notas de versão ou contratos exigem uma referência imutável, e links atuais quando sempre se precisa do mais recente.

## Fontes

O conteúdo vem duma fonte, abstraída para que subida e Git não fiquem acopladas ao modelo do documento.

- **Subida** — adicionar um arquivo diretamente.
- **Git** — conectar um repositório por URL, ramo e caminho de arquivo.

A fonte Git segue a ativação de sincronização e a última sincronização.

- **Conectar** com URL de repositório e caminho de arquivo (escolha de ramo).
- **Sincronizar** sob demanda para obter o conteúdo mais recente como nova versão.

Os metadatos da fonte permanecem com o documento, para saber sempre se vem de subida ou repositório e ver a última sincronização.

## Armazenamento

Os arquivos reais vivem numa disposição organização/documento/versão no armazém de objetos, e a base de dados só guarda metadados (chave de armazenamento, valor de verificação, tipo de conteúdo, tamanho). Os arquivos não são legíveis publicamente por defeito no armazém; o acesso público passa pelas rotas publicadas do documento.

## Porquê importa

A combinação de versões imutáveis e um ciclo de vida com eliminação lógica permite iterar rápido sem perder histórico e não expor por descuido um documento que deve parar. Pausa para interrupção temporária, arquivo para conservação a longo prazo, links fixados quando a imutabilidade conta.

Veja também: [Operações expostas](./exposure)、[Controlo de acesso](./access-control)、[Domínios personalizados](./custom-domains).
