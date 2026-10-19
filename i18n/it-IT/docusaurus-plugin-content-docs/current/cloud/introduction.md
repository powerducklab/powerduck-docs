---
sidebar_position: 1
title: "Powerduck Cloud"
description: "Powerduck Cloud trasforma un file OpenAPI in qualcosa da **condividere**. Aggiungi una specifica, scegli quali operazioni esporre e distribuisci link stabili alla documentazione e a un server MCP gestito, senza dover ospitare o eseguire questi servizi."
---

# Powerduck Cloud

Powerduck Cloud trasforma un file OpenAPI in qualcosa da **condividere**. Aggiungi una specifica, scegli quali operazioni esporre e distribuisci link stabili alla documentazione e a un server MCP gestito, senza dover ospitare o eseguire questi servizi.

È lo stesso flusso di lavoro del client desktop, basato sul contratto API e assistito dall'IA, portato online per i team e gli utenti delle API. Il piano Free comprende l'hosting della documentazione e di MCP entro i limiti previsti; i piani a pagamento aggiungono capacità, sorgenti Git e domini personalizzati. La tua API applicativa continua a essere eseguita sul tuo backend.

## Il percorso

1. **Aggiungi una specifica** caricando un file, indicando un repository Git o incollando un URL. Puoi iniziare dal sito e accedere al tuo account quando sei pronto, senza dover caricare il file una seconda volta.
2. **Scegli cosa esporre.** Attiva o disattiva le singole operazioni: il file originale non viene mai modificato.
3. **Apri subito il link alla documentazione.** La documentazione API è attiva per impostazione predefinita. L'endpoint MCP gestito si attiva con un interruttore e resta disattivato finché non decidi di esporre gli strumenti agli agenti.
4. **Controlla gli accessi.** Imposta una password e una scadenza per la consultazione della documentazione e una chiave di accesso MCP separata per gli agenti.
5. **Pubblica e condividi.** Pubblica l'artefatto pronto per la versione corrente, così da rendere utilizzabili i link; i controlli avanzati restano a portata di clic.
6. **Mantieni tutto aggiornato.** Ogni modifica crea una nuova versione che puoi confrontare o ripristinare; le sorgenti Git possono sincronizzarsi quando vengono aggiornate.
7. **Gestisci il ciclo di vita.** Sospendi, riattiva o archivia un documento e consulta rapidamente stato, versioni e sorgente.

## Cosa ottieni

- **Link stabili alla documentazione**, validi anche quando pubblichi nuove versioni;
- **Un endpoint MCP gestito**, attraverso cui gli agenti IA degli altri utenti possono scoprire e richiamare le operazioni che hai scelto;
- **Esposizione per singola operazione**, per escludere dalla superficie pubblica gli endpoint interni o non ancora pronti;
- **Controllo degli accessi** con password di consultazione, scadenze e chiavi di accesso MCP;
- **Cronologia delle versioni** con confronto e ripristino, senza sovrascrivere l'originale;
- **Sincronizzazione Git**, per trasformare gli aggiornamenti del repository in nuove versioni ospitate;
- **Domini personalizzati**, anche con percorsi secondari, per un'esperienza coerente con il tuo marchio.

### Un documento, più versioni

Ogni modifica crea una nuova versione invece di sovrascrivere l'originale. Puoi quindi confrontare le versioni, ripristinarne una precedente e ripubblicare documentazione e MCP a partire da uno stato noto. Documentazione e MCP sono sempre associati a un documento e a una versione precisi, mai a una generica versione «più recente».

### Perché un link potrebbe non aprirsi

Un link alla documentazione o a MCP funziona quando sono soddisfatte tre condizioni. L'area di lavoro del documento le mostra tutte, evidenziando la prima non soddisfatta:

1. Il documento è **attivo**: sospenderlo rende indisponibili sia la documentazione sia MCP;
2. Il servizio che vuoi condividere è **abilitato**: documentazione e MCP hanno interruttori separati; la prima è attiva per impostazione predefinita, il secondo no;
3. Un artefatto aggiornato è **pubblicato**: viene generato automaticamente dopo l'aggiunta di una versione o la modifica delle operazioni esposte, quindi in genere non devi intervenire; la pubblicazione manuale è disponibile in caso di necessità.

A queste condizioni si aggiungono gli eventuali controlli di accesso: password di consultazione, scadenza o chiave di accesso MCP.

## Accesso e proprietà

Accedi con **Google** o **GitHub**. Dopo l'autenticazione OAuth, Powerduck crea una propria sessione tramite un cookie sicuro e HttpOnly; il token del provider non diventa la tua identità permanente. Tutte le risorse appartengono a un'**organizzazione**. Ne viene creata automaticamente una personale, e in seguito un team può condividerne una senza dover riorganizzare il sistema.

## La console

- **Dashboard**: aggiungi una specifica e consulta i documenti recenti, con link rapidi e comandi di avvio e arresto;
- **Progetti**: organizza i documenti;
- **Area di lavoro del documento**: stato, documentazione, MCP, operazioni esposte, versioni, sorgente e domini in sezioni chiaramente identificate;
- **Fatturazione**: stato dell'abbonamento e ordini, gestiti separatamente;
- **Hub**: pubblica e consulta documentazione e server MCP pubblici;
- **Impostazioni** e **Attività**: profilo, preferenze e registro di controllo.

I lettori pubblici utilizzano un visualizzatore dedicato e non hanno bisogno di un account Powerduck. Se è impostata una password di consultazione, devono inserirla: la password del documento e l'accesso a un account sono requisiti distinti.

## Cloud e client desktop a confronto

| | Client desktop | Cloud |
|---|---|---|
| Esecuzione | Sul tuo computer | Servizio ospitato |
| Modello | Licenza perpetua con pagamento una tantum | Piano gratuito e abbonamenti a pagamento |
| Cosa ricevi | Una chiave di licenza, mostrata una sola volta | Funzionalità del piano, senza chiave di licenza |
| Ideale per | Lavoro locale e offline in un ambiente completo | Condivisione e pubblicazione online |

I due prodotti sono complementari. Cloud offre un piano Free; gli abbonamenti Cloud a pagamento e le licenze desktop si acquistano separatamente. Consulta [Fatturazione](./billing.md).

## Da dove iniziare

- [Guida rapida a Cloud](./quickstart.md)
- [Documenti e versioni](./documents-versions.md)
- [Operazioni esposte](./exposure.md)
- [Controllo degli accessi](./access-control.md)
- [Domini personalizzati](./custom-domains.md)
- [Fatturazione](./billing.md)
