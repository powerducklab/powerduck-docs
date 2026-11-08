---
sidebar_position: 10
title: "Revisione del codice"
description: "Powerduck aiuta a capire le modifiche generate dall’IA, leggerne il contesto e decidere cosa affrontare. Dalla Home dell’app desktop si aprono separatamente spazio API e revisione del codice."
---

# Revisione del codice

La revisione del codice richiede l’[app desktop](https://www.powerduck.com/download.html). La pagina nel browser offre un link per scaricarla; la selezione di progetti locali, il confronto Git e la revisione non vengono eseguiti nel browser.

La cartella scelta apre la struttura. Leggi file completi nelle viste solo sorgente, confronto completo o sole modifiche. Righe aggiunte/rimosse, differenze di caratteri, navigazione e ricerca individuano l’intervento.

## Confronto e cronologia dei cicli

Il ciclo attuale confronta il punto iniziale salvato con il disco. La prima apertura crea tale punto senza considerare tutto nuovo. Le modifiche non registrate si confrontano con Git HEAD. Avvia esplicitamente nuovi cicli e consulta i precedenti nella cronologia locale, che non sostituisce Git. Salva prima i file.

## Struttura e codice collegato

Git e parser identificano blocchi, definizioni, chiamanti e import risolvibili. Passa sui simboli supportati per vedere definizioni e apri il codice collegato vicino alla modifica. La struttura segnala molti riferimenti, nomi temporanei, contenuti identici e riferimenti entranti non trovati. Caricamenti dinamici e usi esterni possono sfuggire; assenza di riferimenti non significa eliminazione sicura.

## Revisione IA nel codice

La revisione IA parte su richiesta ed elabora differenze con contesto limitato in lotti, non tutti i file completi. Riutilizza risultati in cache corrispondenti. Priorità, prova e consiglio appaiono nel codice. Conferma, indica un falso positivo o prepara un’attività Agent. L’IA può sbagliare e non dimostra correttezza o test eseguiti.

## Pacchetti di attività Agent

Seleziona dubbi e visualizza, copia o scarica Markdown con contesto e revisione. L’Agent valuta indipendentemente e il permesso di modifica è esplicito. Il rapporto JSON richiede verifica umana. Una riparazione dichiarata non è un test superato; esportare non avvia né contatta automaticamente altri Agent.

## Eseguire controlli

Esegui esplicitamente comandi solo su progetti affidabili e controlla comando, codice di uscita e output. Script assente significa non verificato. Lettura, analisi statica e IA non sono prove di esecuzione; letto indica soltanto avanzamento di lettura.

## IA integrata e utilizzo

Accedi con Google o GitHub. Solo modello integrato, senza selettore, chiavi proprie o endpoint personalizzati. Il lavoro IA richiesto invia il contesto scelto a fornitori gestiti. Le comuni cartelle di dipendenze, build e credenziali sono escluse, ma il sorgente può ancora contenere segreti.

- [Spazio API](introduction.md)
- [Revisione del codice](code-quality.md)
- [IA integrata e utilizzo](ai-models.md)
- [Piani e attività](../cloud/billing.md)
- [Installare e iniziare](../overview/installation.md)
- [Capire ogni modifica](../overview/quickstart.md)
