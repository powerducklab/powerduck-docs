---
sidebar_position: 7
title: "Fatturazione e licenze"
description: "Powerduck offre **due prodotti distinti con due modelli di pagamento diversi**. Per capire la fatturazione è fondamentale non confonderli."
---

# Fatturazione e licenze

Powerduck offre **due prodotti distinti con due modelli di pagamento diversi**. Per capire la fatturazione è fondamentale non confonderli.

| | Client desktop | Powerduck Cloud |
|---|---|---|
| Cosa acquisti | L'applicazione desktop | Un servizio ospitato |
| Modello | Acquisto una tantum | Piano gratuito o abbonamento a pagamento |
| Validità | Perpetua: la licenza resta tua | Accesso gratuito o periodo di fatturazione pagato |
| Cosa ricevi | Una **chiave di licenza**, mostrata una sola volta | Funzionalità del piano, **senza chiave** |
| Funziona offline | Sì | No: è un servizio ospitato |

Un acquisto Cloud non genera mai una chiave di licenza e l'acquisto del client desktop non è un abbonamento.

## Licenza perpetua desktop

Il client desktop si acquista una volta e si possiede a tempo indeterminato, senza rinnovi né periodi di fatturazione. Al momento dell'acquisto viene generata una chiave di licenza:

- Le chiavi sono generate da byte casuali crittograficamente sicuri nel formato `PDC-XXXX-XXXX-…`, non da un ID progressivo o da una marca temporale;
- La chiave originale viene mostrata **una sola volta**;
- Il database conserva soltanto l'**hash SHA-256** della chiave e i suoi ultimi quattro caratteri; non è quindi possibile recuperare la chiave originale dal database.

### Stato della licenza

Una licenza può trovarsi in quattro stati:

| Stato | Significato |
|---|---|
| `ISSUED` | Generata ma non ancora attivata |
| `ACTIVE` | Attivata e utilizzabile |
| `SUSPENDED` | Temporaneamente inutilizzabile; può essere riattivata |
| `REVOKED` | Revocata definitivamente; non può essere riattivata |

«Perpetua» significa che non ha una scadenza prestabilita, non che non possa mai essere sospesa o revocata.

### Attivazione e controllo

L'attivazione verifica il formato della chiave, ne calcola l'hash, cerca l'hash nel database, controlla lo stato e associa la licenza all'interno di una transazione. L'endpoint di attivazione limita la frequenza delle richieste per ostacolare i tentativi sistematici di indovinare le chiavi.

Ogni cambio di stato viene registrato come evento della licenza: creazione, attivazione, sospensione, riattivazione o revoca. L'intero ciclo di vita resta così verificabile.

## Piani e abbonamenti Cloud

Cloud offre un **piano Free** e abbonamenti a pagamento, senza chiave di licenza. I prezzi annuali qui sotto sono equivalenti mensili con addebito annuale:

| Piano | Mensile | Con fatturazione annuale |
|---|---|---|
| Free | $0 | $0 |
| Pro | 19 $/mese | 15 $/mese |
| Team | 49 $/mese | 39 $/mese |

Un abbonamento `ACTIVE` e nel periodo di validità corrente dà accesso alle funzionalità del piano. Una breve tolleranza di rinnovo di tre giorni copre i possibili ritardi; oltre tale intervallo si applica il piano Free. Le licenze desktop non determinano mai le funzionalità Cloud.

### Cosa regolano i piani

I piani non vengono applicati inserendone rigidamente i nomi in tutto il codice. Ogni piano dispone di **diritti di utilizzo**: funzionalità booleane e quote numeriche, verificate tramite un unico servizio dedicato:

| Funzionalità | Free | Pro | Team |
|---|---|---|---|
| Hosting OAS | Sì | Sì | Sì |
| Sorgente Git | No | Sì | Sì |
| Documentazione | Sì | Sì | Sì |
| MCP | Sì | Sì | Sì |
| Dominio personalizzato | No | Sì | Sì |
| Documenti massimi | 3 | 100 | 1,000 |
| Versioni massime | 20 | 200 | 1,000 |
| Dimensione massima del file | 1 MiB | 10 MiB | 50 MiB |
| Operazioni esposte massime | 10 | 1,000 | 10,000 |
| Membri massimi | 1 | 1 | 10 |

## Fornitori di pagamento

Il pagamento viene indirizzato in base all'area geografica, per proporre un fornitore familiare ai clienti. I due fornitori **non vengono mai mostrati contemporaneamente**:

- **Antom**: Cina continentale, Hong Kong, Macao, Taiwan e Sud-est asiatico;
- **Paddle**: Stati Uniti, Canada, Europa, Giappone, Corea, Australia, Nuova Zelanda e Regno Unito.

Il paese viene dedotto dal fuso orario del client o dall'header `Accept-Language`, senza database GeoIP esterni. Se non è possibile stabilire l'area geografica, **si usa Antom**. Il fornitore può anche essere imposto tramite configurazione, permettendo agli operatori di passare rapidamente al canale alternativo in caso di problemi.

I pagamenti vengono confermati tramite webhook firmati dei fornitori, con endpoint separati per Paddle e Antom, senza fidarsi della sola pagina di ritorno nel browser.

## Quale prodotto scegliere?

- Vuoi un ambiente locale completo, il lavoro offline e una licenza permanente? Acquista una volta la **licenza desktop**.
- Vuoi pubblicare documentazione e MCP online e condividere link stabili? Inizia con **Cloud Free**. Scegli **Pro** per quote maggiori, sorgenti Git e domini personalizzati, oppure **Team** per più utenti.
- Molti team usano entrambi: progettano e testano localmente nel client, poi ospitano l'API pubblicata su Cloud.

Vedi anche: [Introduzione a Cloud](./introduction.md), [Client desktop](../client/introduction.md).
