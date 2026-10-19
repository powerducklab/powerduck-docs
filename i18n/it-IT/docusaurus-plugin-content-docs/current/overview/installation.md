---
sidebar_position: 2
title: "Installazione"
description: "Il client desktop Powerduck è un'applicazione che privilegia il lavoro in locale. Si installa come un normale programma desktop, apre i file effettivi sul disco e non richiede un account per iniziare."
---

# Installazione

Il client desktop Powerduck è un'applicazione che privilegia il lavoro in locale. Si installa come un normale programma desktop, apre i file effettivi sul disco e non richiede un account per iniziare.

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

Il trasporto AI del client desktop invia le richieste di completamento tramite il processo principale, quindi non si applicano le restrizioni CORS tra browser e fornitore. Prompt, contesto pertinente e credenziali vengono comunque inviati all'endpoint del modello configurato; usare un modello ospitato non è un'operazione offline. La separazione dei processi non garantisce che i segreti non possano mai comparire nei log o negli strumenti per sviluppatori. Vedi [AI e modelli](../client/ai-models.md).

## Requisiti di sistema

- macOS 11 o successivo, Windows 10 o successivo oppure una distribuzione Linux desktop diffusa compatibile con Electron 37;
- Spazio su disco sufficiente per l'applicazione; le specifiche aperte rimangono nelle posizioni originali;
- Accesso alla rete per inviare richieste, sincronizzare una sorgente Git o chiamare un modello AI ospitato; per il resto l'app funziona offline.

## Licenza

Puoi valutare il client desktop senza limiti di tempo. Viene venduto con una licenza **perpetua** a pagamento unico: un solo acquisto, senza abbonamento. La chiave di licenza viene emessa all'acquisto e mostrata una sola volta. L'hosting cloud è un servizio separato in abbonamento. Per la distinzione, vedi [Fatturazione cloud](../cloud/billing.md).

Prosegui con la [Guida rapida](./quickstart.md).
