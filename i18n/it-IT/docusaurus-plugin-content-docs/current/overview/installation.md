---
sidebar_position: 2
title: "Installazione"
description: "Powerduck · Google OAuth / GitHub · Free / Pro / Max"
---

# Installazione

Powerduck, incluso il desktop, richiede l’accesso con Google OAuth o GitHub. I file restano sul disco. L’analisi IA invia il contesto selezionato ai fornitori gestiti da Powerduck. URL di modelli e chiavi API personalizzate non sono più supportati.

## Download

Scarica il programma di installazione per la tua piattaforma dal [sito di Powerduck](https://www.powerduck.com/#download). Le seguenti distribuzioni vengono generate con `electron-builder`:

| Piattaforma | Programma di installazione | Architettura |
|---|---|---|
| macOS | `.dmg` e `.zip` per gli aggiornamenti automatici | Apple Silicon (`arm64`) e Intel (`x64`) |
| Windows | Programma di installazione NSIS (`.exe`) | `x64` |
| Linux | AppImage (`.AppImage`) | `x64` |

## macOS

1. Apri il file `.dmg` e trascina Powerduck in **Applicazioni**.
2. Al primo avvio, macOS potrebbe chiedere conferma per un'app scaricata fuori dall'App Store. Prima di aprirla, verifica che provenga dalla pagina di download ufficiale; non disattivare i controlli di sicurezza del sistema.
3. Sono disponibili due versioni: `arm64` per Apple Silicon (serie M) e `x64` per i Mac Intel. Scarica quella adatta al tuo computer.

## Windows

1. Esegui il programma di installazione NSIS (`.exe`) e segui la procedura.
2. Se SmartScreen segnala un autore non riconosciuto, verifica prima che il programma di installazione provenga dalla pagina ufficiale. Prosegui solo dopo aver verificato la fonte; non ignorare l'avviso per un download non attendibile.

## Linux

1. Scarica il file `.AppImage`.
2. Rendilo eseguibile e avvialo:

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```

AppImage funziona senza un'installazione a livello di sistema. Su alcune distribuzioni potrebbe essere necessario installare FUSE per montare il file.

## Componenti eseguiti sul computer

Il client desktop è un'applicazione Electron composta da due parti:

- Un **processo principale** (Node.js) che gestisce l'accesso ai file, le richieste HTTP in uscita, il server mock locale, le connessioni ai database e il terminale integrato;
- Un **renderer** (l'area di lavoro React) che visualizza la specifica, la chat AI e tutti gli strumenti.

Powerduck, incluso il desktop, richiede l’accesso con Google OAuth o GitHub. I file restano sul disco. L’analisi IA invia il contesto selezionato ai fornitori gestiti da Powerduck. URL di modelli e chiavi API personalizzate non sono più supportati.

## Requisiti di sistema

- macOS 11 o successivo, Windows 10 o successivo oppure una distribuzione Linux desktop diffusa compatibile con Electron 37;
- Spazio su disco sufficiente per l'applicazione; le specifiche aperte rimangono nelle posizioni originali;
- Powerduck, incluso il desktop, richiede l’accesso con Google OAuth o GitHub. I file restano sul disco. L’analisi IA invia il contesto selezionato ai fornitori gestiti da Powerduck. URL di modelli e chiavi API personalizzate non sono più supportati.

## Powerduck · Free / Pro / Max

Free: 300.000 credits al giorno, ripristinati alle 00:00 UTC. Pro: 39 $/mese e 18.000.000 credits ogni 7 giorni. Max: 99 $/mese e 60.000.000 credits ogni 7 giorni. Il ciclo parte dall’inizio originale dell’abbonamento, separato dalla fatturazione mensile. Nessun riporto. Desktop e AI Chat condividono il piano personale; licenze perpetue e chiavi di attivazione non sono più vendute.

Prosegui con la [Guida rapida](./quickstart.md).
