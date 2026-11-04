---
sidebar_position: 1
title: "Spazio API · Revisione del codice"
description: "Powerduck aiuta a capire le modifiche generate dall’IA, leggerne il contesto e decidere cosa affrontare. Dalla Home dell’app desktop si aprono separatamente spazio API e revisione del codice."
---

# Spazio API · Revisione del codice

Powerduck aiuta a capire le modifiche generate dall’IA, leggerne il contesto e decidere cosa affrontare. Dalla Home dell’app desktop si aprono separatamente spazio API e revisione del codice.

## Spazio API

Importa OpenAPI YAML o JSON per progettare operazioni, inviare richieste, esaminare risposte e usare scenari, mock locali, modelli dati e documentazione. MCP e pubblicazione sono operazioni separate: importare non distribuisce il backend.

## Revisione del codice

La cartella scelta apre la struttura. Leggi file completi nelle viste solo sorgente, confronto completo o sole modifiche. Righe aggiunte/rimosse, differenze di caratteri, navigazione e ricerca individuano l’intervento.

## Struttura e codice collegato

Git e parser identificano blocchi, definizioni, chiamanti e import risolvibili. Passa sui simboli supportati per vedere definizioni e apri il codice collegato vicino alla modifica. La struttura segnala molti riferimenti, nomi temporanei, contenuti identici e riferimenti entranti non trovati. Caricamenti dinamici e usi esterni possono sfuggire; assenza di riferimenti non significa eliminazione sicura.

## IA integrata e utilizzo

Accedi con Google o GitHub. Solo modello integrato, senza selettore, chiavi proprie o endpoint personalizzati. Il lavoro IA richiesto invia il contesto scelto a fornitori gestiti. Le comuni cartelle di dipendenze, build e credenziali sono escluse, ma il sorgente può ancora contenere segreti.

- [Spazio API](introduction.md)
- [Revisione del codice](code-quality.md)
- [IA integrata e utilizzo](ai-models.md)
- [Piani e attività](../cloud/billing.md)
- [Installare e iniziare](../overview/installation.md)
- [Capire ogni modifica](../overview/quickstart.md)
