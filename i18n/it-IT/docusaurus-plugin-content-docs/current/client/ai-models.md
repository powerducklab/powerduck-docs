---
sidebar_position: 8
title: "AI e modelli"
description: "Powerduck ti permette di scegliere e configurare il modello dell'assistente. Sul desktop, le richieste passano dal processo principale all'endpoint scelto; le modifiche al documento continuano a usare schede da esaminare."
---

# AI e modelli

Powerduck ti permette di scegliere e configurare il modello dell'assistente. Sul desktop, le richieste passano dal processo principale all'endpoint scelto; le modifiche al documento continuano a usare schede da esaminare.

## Usa il tuo modello

Nelle impostazioni, configura l'assistente con un endpoint Chat Completions **compatibile con OpenAI**:

- Scegli un fornitore predefinito oppure definiscine uno **personalizzato**;
- Inserisci nome visualizzato, URL di base, chiave API e ID del modello;
- Puoi configurare più profili e passare dall'uno all'altro.

L'app non presuppone un fornitore specifico. Un endpoint compatibile con OpenAI, autogestito o di terze parti, funziona allo stesso modo: una possibilità importante per i team con una propria politica sui modelli.

## Funzioni avanzate con modalità alternativa

Ogni profilo ha un'opzione **funzioni avanzate**, attiva per impostazione predefinita:

- Quando è attiva, l'app usa la **chiamata nativa di funzioni** del modello e invia il catalogo degli strumenti, così il modello può scegliere e chiamare direttamente lo strumento adatto;
- Se un endpoint rifiuta i parametri nativi degli strumenti, per esempio perché il modello non li supporta, l'app lo memorizza e riprova una sola volta con un **protocollo alternativo basato sul contenuto**.

Questa alternativa migliora la compatibilità ma non garantisce il successo: restano possibili errori di rete, autenticazione o modello. Disattiva le funzioni avanzate per un profilo che deve usare sempre la modalità di base.

Anche il lavoro con gli strumenti ha dei limiti: l'agente esegue un numero limitato di cicli, tre per impostazione predefinita, ed elimina le chiamate ripetute all'interno dell'esecuzione.

## Perché le richieste passano dal processo principale

Sul client desktop, le richieste di completamento partono dal **processo principale Node**, non dalla vista web. Questo offre due vantaggi concreti:

- **Nessun blocco CORS del browser.** Le restrizioni tra origini delle pagine web non impediscono le chiamate all'endpoint del modello;
- **La richiesta HTTP avviene fuori dal renderer.** Il suo pannello di rete non mostra lo scambio HTTP del processo principale. Questo non garantisce che prompt o chiavi siano assenti dalla memoria del renderer, dai log o da altri strumenti per sviluppatori.

Il gateway desktop convalida la struttura delle richieste e applica limiti alle risorse:

- Accetta solo URL HTTP(S); controlla nomi e valori degli header, dimensione del corpo, timeout e richieste simultanee. Consente endpoint locali e privati. Non è una lista di host autorizzati né una garanzia sulla riservatezza del fornitore;
- Le richieste possono essere annullate (`ai:cancel`).

## Desktop e web

Lo stesso assistente funziona in entrambi gli ambienti, usando il canale appropriato:

- **Desktop (Electron):** le funzionalità vengono importate ed eseguite localmente e le richieste di completamento passano dal processo principale;
- **Web:** lo stesso flusso usa HTTP e chiama l'API del servizio anziché i moduli locali.

Per questo l'app mantiene un percorso compatibile con il web accanto a quello Electron: gestione dell'intento e schede restano coerenti, mentre il trasporto si adatta all'ambiente.

## Come viene riconosciuto l'intento

L'intento non viene riconosciuto elencando parole chiave per ogni funzione. L'app presenta invece al modello un **catalogo di strumenti** esplicito e ben descritto: ID, parametri e situazione d'uso di ciascuno. Il modello sceglie lo strumento; l'applicazione deterministica lo convalida ed esegue, chiedendo conferma per le scritture.

Aggiungere una funzione significa quindi aggiungere e descrivere accuratamente uno strumento nel catalogo, senza allungare un elenco di parole chiave. Lo stesso catalogo può essere condiviso con agenti esterni tramite il server MCP, mantenendo allineate le capacità del prodotto e degli altri strumenti.

## Riservatezza dei dati

- Prompt, contesto selezionato, descrizioni degli strumenti e credenziali vengono inviati all'endpoint del modello configurato. Un fornitore remoto riceve questi dati; usa un endpoint locale attendibile se le tue regole richiedono inferenza locale;
- È l'applicazione deterministica, non il modello, a convalidare e applicare ogni modifica;
- Approvi ogni scrittura prima dell'esecuzione.

Vedi anche: [Progettare con l'assistente](./design.md), [Impostazioni](./settings.md), [Controllo degli accessi cloud](../cloud/access-control.md).
