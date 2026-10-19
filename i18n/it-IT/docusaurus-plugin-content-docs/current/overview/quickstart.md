---
sidebar_position: 3
title: "La prima richiesta locale, senza account né modello di IA"
description: "La prima richiesta locale, senza account né modello di IA"
---

# La prima richiesta locale, senza account né modello di IA

## Prova l’esempio locale

In uno spazio di lavoro vuoto dell’app desktop, scegli **Prova l’esempio** e avvia l’esecuzione. Powerduck crea un esempio indipendente, avvia il server Mock locale, invia `GET /orders/summary` alla porta assegnata e mostra la risposta effettiva. L’esempio viene completato solo dopo una risposta HTTP 200. Il server Mock si arresta dopo la richiesta o quando chiudi l’esempio. Puoi ripetere l’esecuzione quando vuoi. Installa prima l’app: questo percorso locale non richiede Internet, un account o una chiave per un modello di IA.

## Apri la tua specifica

Usa **Apri** per importare un documento OpenAPI in formato YAML o JSON. L’esempio non sovrascrive mai i file esistenti. L’uso gratuito prevede un limite al numero di specifiche. Se lo raggiungi, salva e chiudi o rimuovi un documento che non ti serve più. Non scartare modifiche non salvate solo per eseguire l’esempio. Puoi anche generare OpenAPI analizzando un progetto esistente: controlla i campi incerti prima di affidarti al risultato.

## Verifica un backend reale

Una richiesta Mock riuscita non dimostra che il backend rispetti la specifica. Segui l’[esempio di errore del contratto](/docs/it-IT/client/contract-example/) e, se vuoi, [collega un assistente di programmazione](/docs/it-IT/client/coding-agent/). La verifica manuale non richiede un modello di IA.

## Modelli facoltativi ed errori comuni

- **Nessun modello configurato:** le richieste locali, il server Mock e le verifiche manuali continuano a funzionare. Configura un modello nelle impostazioni solo se vuoi usare l’IA.
- **Connessione al modello non riuscita:** controlla l’endpoint, la chiave e il proxy nelle impostazioni. Non pubblicare chiavi o intestazioni delle richieste nelle segnalazioni di bug.
- **API non raggiungibile:** verifica che il server sia attivo e controlla URL, porta e impostazioni della richiesta nel debugger.
- **HTTP 401/403:** controlla l’autenticazione e le autorizzazioni dell’API di destinazione. Non è una richiesta di accesso a Powerduck.
- **Verifica del contratto non riuscita:** leggi il percorso del campo e il tipo atteso nell’asserzione. Correggi il backend o la specifica, se errata, quindi ripeti la verifica.

I file locali vengono letti e salvati sul tuo computer. I modelli remoti ricevono il contesto necessario; la pubblicazione nel cloud carica i contenuti selezionati. Le statistiche d’uso facoltative sono disattivate per impostazione predefinita e sono indipendenti dalla verifica della licenza.

[Scarica](https://www.powerduck.com/download.html) · [Licenza desktop](https://www.powerduck.com/pricing?product=client)
