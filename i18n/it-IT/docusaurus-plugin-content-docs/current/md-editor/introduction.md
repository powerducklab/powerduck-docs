---
sidebar_position: 1
title: "Introduzione"
description: "@powerduck/md-editor è un editor Markdown ad alte prestazioni, incorporabile nel browser. Unisce un'area di modifica CodeMirror 6 a un'anteprima in tempo reale generata con markdown-it, aggiungendo formule KaTeX, mappe mentali Markmap, evidenziazione del codice, riquadri informativi, barra degli strumenti configurabile, scorciatoie da tastiera, hook per caricare immagini, @menzioni e inserimento di collegamenti ai documenti."
---

# Introduzione

`@powerduck/md-editor` è un editor Markdown ad alte prestazioni, incorporabile nel browser. Unisce un'area di modifica [CodeMirror 6](https://codemirror.net) a un'anteprima in tempo reale generata con [markdown-it](https://github.com/markdown-it/markdown-it), aggiungendo formule KaTeX, mappe mentali Markmap, evidenziazione del codice, riquadri informativi, barra degli strumenti configurabile, scorciatoie da tastiera, hook per caricare immagini, @menzioni e inserimento di collegamenti ai documenti.

- **Nome del pacchetto:** `@powerduck/md-editor` <img src="https://img.shields.io/npm/v/@powerduck/md-editor"/>
- **Licenza:** MIT
- **Formato del modulo:** modulo ECMAScript (`type: "module"`), con build ESM (`dist/index.mjs`) e CJS (`dist/index.cjs`) e dichiarazioni dei tipi incluse (`dist/index.d.ts`).

## Funzionalità principali

Le funzionalità seguenti corrispondono ai moduli implementati nel codice sorgente:

- **Modifica Markdown** con CodeMirror 6, evidenziazione della sintassi Markdown e temi di evidenziazione chiaro e scuro.
- **Formule KaTeX** tramite un plugin markdown-it autonomo: in linea con `$...$` e a blocchi con `$$...$$`. Alcune euristiche escludono dall'analisi matematica importi come `$5`.
- **Mappe mentali Markmap** generate dai blocchi delimitati ```` ```mindmap ````. markmap-lib e markmap-view vengono importati dinamicamente, senza aumentare il bundle iniziale quando non sono presenti mappe mentali.
- **Evidenziazione del codice** con highlight.js, intestazione con tre indicatori colorati in stile macOS, etichetta del linguaggio e pulsante per copiare con un clic.
- **Riquadri informativi** (`:::notice`, `:::info`, `:::tip`, `:::success`, `:::warning`, `:::danger`) con icone e colori dedicati.
- **Anteprima in stile GitHub** con `github-markdown-css`.
- **Barra degli strumenti completa** con 22 azioni, finestre per inserire immagini, video, video YouTube e tabelle, selettori di modelli per formule e mappe mentali e una guida con tutte le scorciatoie.
- **Scorciatoie da tastiera** con `Mod`, che corrisponde a Ctrl su Windows/Linux e a Cmd su macOS.
- **Barra degli strumenti configurabile** tramite un array degli elementi da includere o impostazioni per singolo elemento (`show`, `label`, `icon`).
- **Hook per il caricamento di immagini** (`onImageUpload`), richiamato quando si incolla o si trascina un'immagine nell'editor.
- **Menu a discesa delle @menzioni** configurato tramite le opzioni `mention`; le menzioni selezionate appaiono come etichette nell'anteprima.
- **Inserimento di collegamenti ai documenti** configurato tramite `docLink`: collegamenti semplici o schede di anteprima `:::doc-link`. I metadati vengono recuperati dal caricatore integrato o da un hook personalizzato; le richieste tra origini diverse sono soggette alle regole CORS del browser.
- **Rendering dei video:** la sintassi delle immagini con URL che termina in `.mp4`, `.webm`, `.ogg` o altre estensioni riconosciute genera un elemento `<video controls>`.
- **Renderer autonomo** (`renderMarkdown(source, options)`) che produce HTML con gli stessi plugin e stili dell'anteprima, senza montare un editor.
- **Rendering incrementale per blocchi:** il sorgente viene diviso in corrispondenza dei titoli ATX e vengono rigenerati solo i blocchi modificati. Gli altri riutilizzano i nodi DOM esistenti, compresi gli SVG delle mappe mentali già inizializzate. I risultati vengono memorizzati nella cache in base all'hash del contenuto.
- **Debounce adattivo:** il ritardo di aggiornamento dell'anteprima varia con la lunghezza del documento, da 120 ms a un massimo di 600 ms.
- **Due modalità di modifica:** `simple` (modifica e anteprima senza barra degli strumenti) e `complex` (barra degli strumenti e barra di stato), selezionabili durante l'esecuzione.
- **Due temi:** `light` e `dark`, applicati tramite l'attributo `data-theme` e proprietà CSS personalizzate.

## Panoramica dell'architettura

La libreria offre due interfacce:

1. **Classe JavaScript nativa** — l'API principale ruota attorno a `MarkdownEditor`, istanziata con un elemento contenitore. Combina `CodeEditor` (wrapper di CodeMirror), `Renderer` (wrapper di markdown-it), `IncrementalRenderer` per l'anteprima e, in modalità `complex`, `Toolbar` e `StatusBar`. Le finestre, il controller delle @menzioni e quello dei collegamenti ai documenti sono moduli montati su richiesta.

2. **Esportazione React tramite sottopercorso** — `MarkdownEditorReact` è un componente `forwardRef` esportato da `./react`. Incapsula un'istanza nativa di `MarkdownEditor`, supporta l'uso controllato e non controllato di `value` ed espone un `MarkdownEditorHandle` imperativo tramite ref. L'ingresso React è separato, così i progetti che non usano React non devono installare `react` e `react-dom`.

Il rendering comprende una fase sincrona markdown-it, che produce segnaposto HTML per le mappe mentali, e un'inizializzazione asincrona con `Renderer.hydrate`, che li trasforma in diagrammi SVG interattivi. `renderMarkdown` restituisce l'HTML sincrono; per ottenere gli SVG, usa `Renderer.render`, inserisci l'HTML nel DOM e poi chiama `Renderer.hydrate`. Il renderer incrementale agisce direttamente sul contenitore dell'anteprima.

## Supporto dei browser

La libreria è pensata per browser moderni con DOM. CodeMirror 6, KaTeX e markmap-view sono dipendenze del pacchetto, non funzionalità del browser; le mappe mentali interattive usano `ResizeObserver`. L'API Clipboard viene usata quando disponibile. Se `navigator.clipboard` non è disponibile, ad esempio fuori da HTTPS, la copia dei blocchi di codice ricorre a `document.execCommand('copy')`. Il modulo delle mappe mentali installa un'implementazione vuota di `ResizeObserver` solo quando l'oggetto globale manca, evitando un errore durante l'importazione; questa implementazione non invia notifiche reali di ridimensionamento.

## Licenza

`@powerduck/md-editor` è distribuito con licenza **MIT**.

## Passaggi successivi

- [Installazione](./installation.md) — installa il pacchetto e scopri i percorsi di importazione.
- [Guida rapida](./quickstart.md) — monta il primo editor in JavaScript nativo o React.
- [Configurazione](./configuration.md) — tutte le opzioni di `MarkdownEditorOptions`.
- [Funzionalità](./features.md) — approfondisci ogni funzionalità integrata.
- [Riferimento API](./api-reference.md) — tutte le classi, le funzioni e i tipi esportati.
- [Esempi](./examples.md) — frammenti completi ed eseguibili.
