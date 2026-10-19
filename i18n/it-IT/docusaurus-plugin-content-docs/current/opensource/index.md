---
sidebar_position: 1
title: "Librerie open source"
description: "I pacchetti npm @powerduck/* sono alla base del client desktop e di Cloud: parsing, aggiornamento, CLI multiprotocollo, generazione di codice, MCP, richieste, conversione ed editor integrabili."
---

# Librerie open source

Powerduck è composto da piccoli pacchetti npm combinabili. Il client desktop e il servizio cloud usano le stesse librerie: gli stessi componenti funzionano in locale, in rete o all’interno dei tuoi strumenti.

Ogni pacchetto viene pubblicato indipendentemente, con istruzioni di installazione, riferimento API ed esempi propri. Questa pagina illustra il ruolo di ciascuno e come si combinano.

## Organizzazione a livelli

```text
Powerduck / Cloud
        ↓
Interfacce integrabili
        ↓
Flussi di lavoro
        ↓
Fondamenta
```

Parser e convertitori costituiscono la base. Su di essi si fondano i flussi di lavoro e, al livello superiore, le interfacce integrabili. Condividere la base evita di reimplementare il parsing in ogni pacchetto e mantiene il comportamento coerente.

## I pacchetti

### Fondamenta

| Pacchetto | Funzione |
|---|---|
| [`@powerduck/openapi-parser`](../openapi-parser/introduction.md) | Analizzare, convalidare e aggiornare documenti OpenAPI/Swagger |
| [`@powerduck/conf-patch`](../conf-patch/introduction.md) | Applicare modifiche di configurazione strutturate e convalidate |
| [`@powerduck/x-to-openapi`](../x-to-openapi/introduction.md) | Convertire altri formati, come cURL e Postman, in OpenAPI |

### Flussi di lavoro

| Pacchetto | Funzione |
|---|---|
| [`@powerduck/openapi-cli`](../openapi-cli/introduction.md) | Flussi multiprotocollo da riga di comando, inclusa l’esecuzione di scenari |
| [`@powerduck/openapi-codegen`](../openapi-codegen/introduction.md) | Generare codice client e altri artefatti da una specifica |
| [`@powerduck/openapi-mcp-server`](../openapi-mcp-server/introduction.md) | Esporre una specifica OpenAPI come server MCP |
| [`@powerduck/openapi-request`](../openapi-request/introduction.md) | Eseguire le richieste descritte da una specifica |

### Interfacce integrabili

| Pacchetto | Funzione |
|---|---|
| [`@powerduck/oas-document`](../oas-document/introduction.md) | Visualizzare OpenAPI come documentazione leggibile, con punto di ingresso React |
| [`@powerduck/md-editor`](../md-editor/introduction.md) | Editor Markdown integrabile |
| [`@powerduck/schema-editor`](../schema-editor/introduction.md) | Editor JSON Schema integrabile |
| [`@powerduck/tree`](../tree/introduction.md) | Componente ad albero per dati strutturati |
| [`@powerduck/workspace-yaml`](../workspace-yaml/introduction.md) | Integrazione dello YAML dello spazio di lavoro |

## Scegliere il pacchetto adatto

- **Leggere, convalidare o aggiornare un file OpenAPI:** inizia da `openapi-parser`.
- **Convertire cURL o una raccolta Postman in OpenAPI:** usa `x-to-openapi`.
- **Eseguire scenari o flussi multiprotocollo dalla riga di comando o in CI:** usa `openapi-cli`.
- **Generare codice client:** usa `openapi-codegen`.
- **Esporre un’API come strumenti per un agente IA:** usa `openapi-mcp-server`.
- **Integrare documentazione renderizzata in un’app React:** usa `oas-document`, il suo punto di ingresso React e il relativo CSS.
- **Integrare un editor:** usa `md-editor` o `schema-editor`.

## Condividere funzionalità con gli agenti

Il pacchetto server MCP permette anche agli agenti IA esterni di usare le funzionalità di Powerduck. Una specifica servita con `openapi-mcp-server` espone le operazioni come strumenti MCP: lo stesso contratto che alimenta documentazione e generazione di codice può essere invocato direttamente da un agente. Client desktop, Cloud e altri strumenti compatibili con MCP condividono così un’unica definizione di riferimento.

## Nota sugli esempi

Gli esempi di codice seguono l’API reale del pacchetto e sono pensati per essere eseguiti così come sono. Dopo un aggiornamento, consulta le note di rilascio per i parametri attuali invece di copiare frammenti di versioni precedenti.

Dalla barra laterale puoi consultare installazione, configurazione e riferimento API completo di ogni pacchetto.
