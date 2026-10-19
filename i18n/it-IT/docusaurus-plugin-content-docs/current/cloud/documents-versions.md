---
sidebar_position: 3
title: Documenti e versioni
description: "Gestisci il ciclo di vita dei documenti, le versioni immutabili e le origini tramite caricamento o sincronizzazione Git."
---

# Documenti e versioni

Un documento è la rappresentazione ospitata di un'API. Appartiene alla tua organizzazione, eventualmente all'interno di un progetto, e accumula versioni nel tempo anziché essere sovrascritto.

## Gerarchia

```text
Organization -> Project -> Document -> Versions
```

I documenti possono essere creati direttamente nell'organizzazione o all'interno di un progetto. Sono elencati sia per progetto sia per organizzazione.

## Ciclo di vita

Un documento può trovarsi in quattro stati:

| Stato | Significato | Servizi pubblici |
|---|---|---|
| `ACTIVE` | Attivo | Documentazione e MCP disponibili, se abilitati separatamente |
| `PAUSED` | Sospeso temporaneamente | Servizi pubblici non disponibili |
| `ARCHIVED` | Conservato, ma non corrente | Non pubblicato |
| `DELETED` | Eliminato logicamente | Non pubblicato |

Sono consentite le seguenti transizioni:

```text
pause:    ACTIVE  -> PAUSED
resume:   PAUSED  -> ACTIVE
archive:  ACTIVE / PAUSED -> ARCHIVED
restore:  ARCHIVED -> ACTIVE
delete:   ACTIVE / PAUSED / ARCHIVED -> DELETED
```

La sospensione è il modo più rapido per rendere un documento non disponibile e riattivarlo. L'archiviazione conserva la cronologia senza considerare il documento corrente. L'eliminazione è logica: i dati principali non vengono distrutti immediatamente.

## Versioni immutabili

Quando la specifica cambia, viene creata una nuova versione. L'originale non viene mai sostituito:

```text
v1 -> v2 -> v3 -> v4
```

Ogni versione registra:

- La **chiave di archiviazione** del file nell'archivio a oggetti;
- La somma di controllo **SHA-256**;
- Il tipo di contenuto, le dimensioni e la data di creazione.

Questi dati permettono di mantenere la cronologia, ripristinare versioni precedenti, confrontare modifiche e rigenerare documentazione e MCP per una versione specifica.

### Link alla versione corrente o a una versione fissa

- Un link al documento **corrente** segue la versione più recente;
- Un link **fissato a una versione** fa riferimento a quella versione e non cambia durante la consultazione.

Usa i link a versione fissa quando serve un riferimento immutabile, per esempio nelle note di rilascio o in un contratto. Usa il link corrente quando vuoi mostrare sempre la versione più recente.

## Origini

Il contenuto proviene da un'origine astratta: il modello del documento non dipende direttamente dal caricamento o da Git.

- **Caricamento** — aggiungi direttamente un file;
- **Git** — collega un repository indicando URL, ramo e percorso del file.

Un'origine Git registra se la sincronizzazione è abilitata e quando è stata eseguita l'ultima volta. Puoi:

- **Collegare** un repository: URL e percorso del file sono obbligatori, il ramo è facoltativo;
- **Sincronizzare** su richiesta per acquisire il contenuto più recente come nuova versione.

I metadati dell'origine sono conservati con il documento: puoi sempre verificare se proviene da un caricamento o da un repository e controllare l'ultima sincronizzazione.

## Archiviazione

I file risiedono nell'archivio a oggetti, organizzati per organizzazione, documento e versione. Il database conserva solo i metadati: chiave di archiviazione, somma di controllo, tipo di contenuto e dimensioni. Per impostazione predefinita i file non sono leggibili pubblicamente dall'archivio; l'accesso pubblico passa attraverso le route di pubblicazione del documento.

## Vantaggi

Versioni immutabili ed eliminazione logica permettono di iterare rapidamente senza perdere la cronologia né esporre per errore un documento che volevi disattivare. Usa la sospensione per un'interruzione temporanea, l'archiviazione per la conservazione a lungo termine e i link a versione fissa quando conta la stabilità.

Vedi anche: [Operazioni esposte](/docs/it-IT/cloud/exposure/), [Controllo degli accessi](/docs/it-IT/cloud/access-control/), [Domini personalizzati](/docs/it-IT/cloud/custom-domains/).
