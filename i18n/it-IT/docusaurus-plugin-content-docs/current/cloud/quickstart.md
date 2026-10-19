---
sidebar_position: 2
title: Guida rapida a Cloud
description: "Accedi, aggiungi una specifica da file, Git o URL, scegli le operazioni da esporre e apri i link alla documentazione e a MCP."
---

# Guida rapida a Cloud

Questo percorso trasforma una specifica presente sul tuo computer in una pagina di documentazione condivisibile e in un endpoint MCP.

## 1. Accedi

Nella pagina di accesso, continua con **Google** o **GitHub**. Dopo l’autenticazione OAuth, Powerduck crea una propria sessione e apre la console. Viene creata automaticamente un’organizzazione personale.

## 2. Aggiungi una specifica

Dalla dashboard, aggiungi una specifica scegliendo una delle origini supportate:

- **Caricamento di un file** — carica direttamente un file OpenAPI;
- **Repository Git** — indica un repository e scegli il ramo e il percorso del file;
- **URL** — importa una specifica da un URL.

I documenti OpenAPI 3.0/3.1 e Swagger esistenti vengono aggiornati. Gli input cURL o Postman possono essere convertiti e visualizzati in anteprima prima del salvataggio.

### Come funziona il caricamento diretto

I file di grandi dimensioni vengono caricati direttamente nello storage a oggetti, senza passare dal server API:

1. Viene creato un documento;
2. l’app richiede un **URL di caricamento**, indicando tipo di contenuto e dimensione;
3. il file viene caricato direttamente nello storage tramite l’URL prefirmato;
4. il caricamento viene **completato**, registrando la versione e il relativo SHA-256.

In questo modo i contenuti di grandi dimensioni non transitano dal server API.

## 3. Scegli le operazioni da esporre

Dopo aver aggiunto la specifica, scegli quali operazioni rendere disponibili pubblicamente. Puoi attivarle o disattivarle singolarmente senza modificare il documento originale. Parti dall’insieme completo e rimuovi gli endpoint interni o amministrativi che non vuoi esporre.

## 4. Apri i link

Quando il documento è attivo, il relativo spazio di lavoro mostra gli indirizzi pubblici:

- **Documentazione** — la documentazione API renderizzata nel visualizzatore pubblico;
- **MCP** — l’endpoint MCP gestito con trasporto Streamable HTTP;
- anche la specifica originale è disponibile a un URL stabile.

La documentazione è abilitata per impostazione predefinita ed è protetta solo se aggiungi una password. Disponibilità e chiave di accesso MCP si configurano separatamente.

## 5. Proteggi l’accesso, se necessario

- Aggiungi una **password di visualizzazione**, eventualmente con una scadenza;
- genera una **chiave di accesso MCP** per l’endpoint;
- sospendi il documento per rendere temporaneamente indisponibili entrambe le interfacce.

## 6. Continua con nuove versioni

Quando l’API cambia, carica il nuovo contenuto come nuova versione invece di sostituire la precedente. I link condivisi possono puntare al documento corrente o a una versione specifica: un link fissato a una versione mantiene lo stesso contenuto per chi lo consulta.

## Passaggi successivi

- [Documenti e versioni](/docs/it-IT/cloud/documents-versions/)
- [Operazioni esposte](/docs/it-IT/cloud/exposure/)
- [Controllo degli accessi](/docs/it-IT/cloud/access-control/)
- [Domini personalizzati](/docs/it-IT/cloud/custom-domains/)
