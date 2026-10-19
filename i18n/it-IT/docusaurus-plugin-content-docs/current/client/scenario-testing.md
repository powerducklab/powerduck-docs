---
sidebar_position: 4
title: "Test di scenario e report"
description: "Una richiesta verifica una singola chiamata. Un **test di scenario** verifica un flusso: una sequenza ordinata di richieste in cui un valore di una risposta alimenta una richiesta successiva, con asserzioni controllate a ogni passaggio. Gli scenari rendono espliciti i flussi completi che altrimenti resterebbero solo nella mente dello sviluppatore."
---

# Test di scenario e report

Una richiesta verifica una singola chiamata. Un **test di scenario** verifica un flusso: una sequenza ordinata di richieste in cui un valore di una risposta alimenta una richiesta successiva, con asserzioni controllate a ogni passaggio. Gli scenari rendono espliciti i flussi completi che altrimenti resterebbero solo nella mente dello sviluppatore.

## Contenuto di uno scenario

- **Passaggi ordinati**, ciascuno riferito a un'operazione della specifica;
- **Passaggio di dati** tra le fasi, ad esempio l'`id` di una risorsa appena creata da usare nella richiesta successiva;
- **Asserzioni** su codici di stato, header o campi della risposta;
- Valori che l'utente deve fornire prima dell'esecuzione.

Ordine e asserzioni sono elementi essenziali: non vengono mai ignorati silenziosamente durante l'esecuzione.

## Eseguire uno scenario

Gli scenari vengono eseguiti nel processo principale tramite il motore `runScenario` di `@powerduck/openapi-cli`:

- `scenario:run` avvia l'esecuzione con scenario, specifica e configurazione delle richieste;
- `scenario:event` trasmette l'avanzamento durante l'esecuzione dei passaggi;
- `scenario:cancel` interrompe un'esecuzione in corso.

Puoi seguire ogni passaggio, individuare dove il flusso fallisce e annullare un'esecuzione lunga.

## Come l'assistente crea uno scenario

L'assistente non inserisce definizioni di test inventate nella specifica. Gli scenari sono un flusso separato gestito dall'applicazione e **non vengono mai salvati nel documento OpenAPI**: non ci sono chiavi `x-scenarios` né passaggi incorporati.

Quando chiedi di progettare endpoint e testarli, il lavoro segue questo ordine:

1. L'assistente propone prima **solo le patch degli endpoint**;
2. Dopo l'applicazione, restituisce una **scheda di azione** per eseguire il flusso:
   - `test.single` per un singolo endpoint;
   - `scenario.plan` per consentire all'applicazione di individuare flussi completi;
   - `scenario.run` per preparare ed eseguire un flusso ordinato.

Una scheda `scenario.run` elenca da due a otto operazioni nell'ordine di esecuzione e ne indica l'obiettivo, specificando quale campo della risposta, header o stato alimenta le richieste successive. Ogni riferimento viene copiato esattamente dalla specifica corrente.

## Report

Dopo l'esecuzione puoi esportare un **report HTML autonomo**. È un documento di sintesi, non l'output grezzo della CLI: presenta il flusso, i risultati di ogni passaggio, le asserzioni e l'esito in un formato leggibile.

Durante l'esportazione scegli la lingua. Sono incluse dieci lingue:

1. English (inglese)
2. 简体中文 (cinese semplificato)
3. 繁體中文 (cinese tradizionale)
4. 日本語 (giapponese)
5. 한국어 (coreano)
6. Français (francese)
7. Deutsch (tedesco)
8. Español (spagnolo)
9. Português — Brasil (portoghese brasiliano)
10. العربية (arabo)

L'opzione **altra/personalizzata** accetta un'altra lingua, ma le etichette integrate del report restano in inglese se non esiste una traduzione. Inserire una lingua non traduce automaticamente il report.

Controlla il report esportato prima di condividerlo:

- **I campi di credenziali riconosciuti vengono oscurati** automaticamente. Contenuti arbitrari, URL e campi personalizzati possono comunque contenere dati sensibili: esaminali e rimuovili prima della condivisione;
- **I contenuti voluminosi vengono compressi in sezioni richiudibili** per facilitarne la lettura. Chiudere una sezione non ne rimuove i dati dall'HTML esportato.

Il file HTML è autonomo: puoi allegarlo a un ticket o archiviarlo insieme a una versione.

## Quando usare gli scenari

- Verificare un flusso aziendale in più passaggi, come creazione, lettura, aggiornamento ed eliminazione;
- Controllare che autenticazione e passaggio di token funzionino tra le chiamate;
- Documentare il comportamento dell'API per un rilascio o una consegna;
- Verificare eventuali regressioni dopo una modifica del contratto.

Vedi anche: [Area richieste](./debug.md), [Progettare con l'assistente](./design.md), [Server mock](./mock-server.md).
