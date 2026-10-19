---
sidebar_position: 9
title: "Impostazioni"
description: "Le impostazioni del client desktop regolano l'aspetto dell'app e l'invio delle richieste. Le preferenze dell'applicazione sono separate dalle modifiche al documento API: cambiare tema o configurare un proxy non altera il contratto."
---

# Impostazioni

Le impostazioni del client desktop regolano l'aspetto dell'app e l'invio delle richieste. Le preferenze dell'applicazione sono separate dalle modifiche al documento API: cambiare tema o configurare un proxy non altera il contratto.

## Aspetto

- **Tema**: passa dalla modalità chiara a quella scura (`theme.get`, `theme.set`). La scelta viene salvata e applicata all'intera app.
- **Lingua dell'interfaccia**: scegli tra sedici lingue oppure segui automaticamente quella del sistema:

| | | |
|---|---|---|
| English (US) | 简体中文 | 繁體中文 |
| 日本語 | 한국어 | Français |
| Deutsch | Español | Português (Brasil) |
| العربية | Italiano | Русский |
| हिन्दी | Bahasa Indonesia | Tiếng Việt |
| Türkçe | | |

L'arabo viene visualizzato da destra a sinistra. Selezionando `auto` si segue la lingua del sistema.

## Comportamento delle richieste

Queste impostazioni controllano le richieste in uscita dall'area richieste e dagli scenari:

- **Timeout richiesta** (`requestTimeoutMs`): timeout in millisecondi; `0` significa illimitato;
- **SSL rigoroso** (`strictSSL`): verifica i certificati TLS; disattivandolo puoi usare server con certificati autofirmati o non attendibili;
- **Segui reindirizzamenti** (`followRedirects`) e **numero massimo di reindirizzamenti** (`maxRedirects`);
- **Versione HTTP** (`protocolVersion`): `http1`, `http2` oppure `auto`;
- **Disabilita cookie** (`disableCookies`): disattiva la gestione dei cookie nelle richieste.

## Proxy

Configura il proxy in uscita scegliendo una modalità (`off`, `system` o `custom`):

- `off`: nessun proxy;
- `system`: usa il proxy del sistema operativo;
- `custom`: usa un URL proxy, con nome utente, password ed elenco di esclusioni facoltativi.

L'elenco di esclusioni accetta host e pattern, come `localhost,127.0.0.1` e host con caratteri jolly. Le password del proxy possono essere scritte ma non vengono restituite in lettura; un valore vuoto le cancella.

## TLS e certificati client

Per ambienti con autorità di fiducia personalizzate o TLS reciproco:

- **CA personalizzata**: abilita un certificato CA e indicane il percorso, così le richieste considerano attendibile una radice interna o autofirmata;
- **Certificati client (mTLS)**: configura certificati per host, come coppia certificato/chiave oppure file PFX, con passphrase facoltativa. Host e porta ne delimitano l'utilizzo.

Puoi aggiungere certificati, rimuoverli per ID o cancellarli tutti. Le passphrase sono di sola scrittura e non vengono restituite.

## Terminale integrato

L'app include un pannello terminale nella parte inferiore:

- `terminal.open` mostra il pannello; passa `{"cwd":"document"}` per aprirlo nella cartella del documento attivo, risolta dall'app nel percorso assoluto reale;
- `terminal.run` inserisce ed esegue un comando shell esplicito dopo una scheda di conferma.

I comandi vengono eseguiti solo su richiesta esplicita; mostrare il pannello non esegue nulla.

## Azioni su file e sistema

- `shell.revealFile`: mostra il documento attivo o un percorso specificato nel gestore file del sistema;
- `shell.openPath`: apre il documento con l'applicazione predefinita;
- `shell.openExternal`: apre una pagina esterna di terze parti nel browser di sistema.

Le pagine ufficiali Powerduck usano uno strumento dedicato (`app.officialLink`) che mostra una scheda nella chat, senza uscire dall'app.

## Esempi di codice client

Per qualsiasi operazione, l'assistente può generare codice client pronto da eseguire (`clientcode.generate`) e mostrarlo in una scheda con selettori di lingua e libreria. Sono supportati C, C#, Go, Java, JavaScript, Node, Kotlin, PHP, Python, Ruby, Rust, shell, Swift e altri. Il codice appare nella scheda anziché essere incollato nella chat.

## Modificare le impostazioni con l'assistente

Le richieste a livello di applicazione, come cambiare tema o lingua, impostare un proxy, ignorare un errore di certificato o cambiare versione HTTP, vengono gestite dagli strumenti delle impostazioni anziché come richieste di progettazione API. Le modifiche richiedono conferma prima dell'applicazione.

Vedi anche: [AI e modelli](./ai-models.md), [Area richieste](./debug.md).
