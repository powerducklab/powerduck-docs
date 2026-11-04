---
sidebar_position: 15
title: "IA integrata e utilizzo"
description: "Powerduck aiuta a capire le modifiche generate dall’IA, leggerne il contesto e decidere cosa affrontare. Dalla Home dell’app desktop si aprono separatamente spazio API e revisione del codice."
---

# IA integrata e utilizzo

Accedi con Google o GitHub. Solo modello integrato, senza selettore, chiavi proprie o endpoint personalizzati. Il lavoro IA richiesto invia il contesto scelto a fornitori gestiti. Le comuni cartelle di dipendenze, build e credenziali sono escluse, ma il sorgente può ancora contenere segreti.

## Revisione IA nel codice

La revisione IA parte su richiesta ed elabora differenze con contesto limitato in lotti, non tutti i file completi. Riutilizza risultati in cache corrispondenti. Priorità, prova e consiglio appaiono nel codice. Conferma, indica un falso positivo o prepara un’attività Agent. L’IA può sbagliare e non dimostra correttezza o test eseguiti.

## Piani e attività

Un turno di conversazione o revisione vale un’attività, senza addebitare singole chiamate interne. Durante l’esecuzione si prenota: un risultato consegnato consuma una, anche dopo annullamento; senza risultato riuscito si libera. Dividi revisioni grandi. Lettura locale, Git/AST e risultati salvati non consumano attività. Vecchi abbonamenti possono mantenere crediti; verifica l’account.

- [Spazio API](introduction.md)
- [Revisione del codice](code-quality.md)
- [IA integrata e utilizzo](ai-models.md)
- [Piani e attività](../cloud/billing.md)
- [Installare e iniziare](../overview/installation.md)
- [Capire ogni modifica](../overview/quickstart.md)
