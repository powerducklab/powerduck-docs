---
sidebar_position: 1
title: "Introduzione"
description: "Inizializza in modo affidabile i file workspace.yaml e YAML OpenAPI 3.2. Compatibile con il browser: funzioni pure generano stringhe di contenuto YAML senza accedere al file system. In Node.js / Electron, aggiunge al livello principale scritture atomiche, blocco dei file e normalizzazione dei percorsi."
keywords: ["workspace-yaml", "powerduck", "YAML", "OpenAPI"]
---

# @powerduck/workspace-yaml

Inizializza in modo affidabile i file workspace.yaml e YAML OpenAPI 3.2.

Architettura a due livelli:
- **Livello principale**: Compatibile con il browser: funzioni pure generano stringhe di contenuto YAML senza accedere al file system.
- **Livello file**: In Node.js / Electron, aggiunge al livello principale scritture atomiche, blocco dei file e normalizzazione dei percorsi.

- **Nome del pacchetto:** `@powerduck/workspace-yaml`
- **Versione:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **Licenza:** MIT

Questa libreria **inizializza soltanto i file**, per creare nuovi file o per la creazione manuale. **Non** reimplementa la lettura, l’applicazione di patch o l’aggiornamento dei file YAML. Per queste operazioni, usa [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## Passaggi successivi

- [Installazione](/docs/it-IT/workspace-yaml/installation/)
- [Guida rapida](/docs/it-IT/workspace-yaml/quickstart/)
- [Riferimento API](/docs/it-IT/workspace-yaml/api-reference/)
- [Esempi](/docs/it-IT/workspace-yaml/examples/)
