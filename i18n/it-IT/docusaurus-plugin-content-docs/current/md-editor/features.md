---
sidebar_position: 5
title: "Funzionalità"
description: "Questa pagina descrive le funzionalità integrate in base alla loro implementazione effettiva."
---

# Funzionalità

Questa pagina descrive le funzionalità integrate in base alla loro implementazione effettiva.

## Rendering incrementale

L'anteprima usa il rendering incrementale per blocchi per restare reattiva anche con documenti grandi:

- **Suddivisione in blocchi** (`splitIntoBlocks`): il sorgente viene diviso in corrispondenza dei titoli ATX (`#` fino a `######`). Il contenuto dei blocchi di codice delimitati da backtick o tilde non viene usato come punto di divisione; vengono preservati anche i titoli nei contenitori `:::`. Un documento senza titoli forma un solo blocco.
- **Rendering per blocco:** solo i blocchi con hash modificato passano nuovamente attraverso markdown-it / KaTeX. Gli altri riutilizzano direttamente i nodi DOM esistenti, compresi gli SVG delle mappe mentali già inizializzate.
- **Cache basata sull'hash:** i risultati sono conservati con un hash rapido di tipo djb2 combinato con la lunghezza. Anche annullamento, ripristino e incolla di paragrafi identici possono riutilizzare la cache. Oltre 800 voci, vengono rimossi gli hash non più presenti nel documento corrente. Quelli dei blocchi attuali restano, quindi un documento con più di 800 blocchi distinti può superare tale soglia.
- **Riordinamento:** i nodi esistenti vengono aggiunti a un `DocumentFragment` e spostati nativamente dal browser.
- **Debounce adattivo** (`adaptiveDebounceMs(docLength, base = 120, max = 600)`): l'attesa è `base + floor(docLength / 20000) * 60`, limitata a `max`. Sostituiscila con `renderDebounce` o usa `renderDebounce: false` per il rendering sincrono.
- **`content-visibility: auto`:** ogni blocco è racchiuso in un elemento `.md-editor-block`, così i blocchi fuori schermo possono saltare layout e disegno.

Il fallimento di un blocco non svuota l'intera anteprima: viene mostrato il suo sorgente con escape in un `<pre>`.

## Formule KaTeX

Il plugin matematico markdown-it autonomo usa KaTeX, senza dipendere da `markdown-it-texmath`:

- **Formule in linea:** `$E=mc^2$`. Il contenuto non può essere vuoto né contenere `$` o ritorni a capo. Importi come `$5` o `$10.50` vengono esclusi tramite euristiche.
- **Formule a blocchi:**
  ```markdown
  $$
  \int_0^1 x^2 \, dx
  $$
  ```
  Sono supportate forme su una riga (`$$ ... $$`) o più righe. Il CSS di KaTeX è incluso nel pacchetto. Disattiva con `math: false`.

## Mappe mentali Markmap

Scrivi un blocco delimitato ```` ```mindmap ```` con una struttura gerarchica Markdown al suo interno:

````markdown
```mindmap
# Root topic
## Branch one
- Child A
- Child B
## Branch two
- Child C
```
````

La regola segue la profondità dei delimitatori per preservare i blocchi di codice annidati nella mappa. La fase sincrona produce un `<div>` segnaposto; `Renderer.hydrate(container)` importa `markmap-lib` e `markmap-view` in modo asincrono e converte i segnaposto in SVG interattivi. Gli errori di inizializzazione non sono fatali. Disattiva con `mindmap: false`.

## Evidenziazione del codice e copia

I blocchi di codice sono evidenziati con highlight.js. La distribuzione registra JavaScript, TypeScript, Python, JSON, Bash/Shell, CSS, XML/HTML/SVG, SQL, YAML, Markdown, Go, Rust, Java, C e C++, con alias come `js`, `ts`, `py`, `sh`, `yml`, `md`, `rs` e `c++`. I linguaggi sconosciuti vengono rilevati automaticamente; se il rilevamento fallisce, viene mostrato testo semplice con escape.

Ogni blocco usa un contenitore in stile macOS con tre punti colorati, etichetta del linguaggio e pulsante **Copia**. La copia usa la delega degli eventi sul pannello di anteprima e ricorre a `document.execCommand('copy')` quando l'API Clipboard non è disponibile. Disattiva con `codeHighlight: false`.

## Azioni della barra degli strumenti {#toolbar-actions}

In modalità `complex`, la barra contiene le seguenti 22 azioni nell'ordine indicato:

| # | Nome dell'azione | Funzione |
|---|-------------|---------------|
| 1 | `heading` | Titolo |
| 2 | `bold` | Grassetto (Ctrl+B) |
| 3 | `italic` | Corsivo (Ctrl+I) |
| 4 | `link` | Collegamento (Ctrl+K) |
| 5 | `image` | Inserisci immagine |
| 6 | `video` | Inserisci video |
| 7 | `youtube` | Inserisci video YouTube |
| 8 | `quote` | Citazione |
| 9 | `ul` | Elenco puntato |
| 10 | `ol` | Elenco numerato |
| 11 | `tasklist` | Elenco di attività |
| 12 | `mention` | Menzione (@) |
| 13 | `doclink` | Inserisci collegamento a documento |
| 14 | `code` | Blocco di codice |
| 15 | `table` | Tabella |
| 16 | `math` | Formula matematica |
| 17 | `mindmap` | Inserisci mappa mentale |
| 18 | `hr` | Linea orizzontale |
| 19 | `tips` | Inserisci riquadro |
| 20 | `preview` | Mostra/nascondi anteprima |
| 21 | `help` | Scorciatoie da tastiera |
| 22 | `theme` | Cambia tema |

Le etichette integrate sono in inglese. Sostituisci `label` per ciascun elemento per tradurre suggerimenti e nomi accessibili. Diverse azioni aprono finestre o selettori: immagini, video, YouTube, tabelle, modelli di formule e mappe mentali, tipi di riquadro e guida. Configura la barra tramite `toolbar`, come descritto in [Configurazione](./configuration.md#toolbarconfig).

## Scorciatoie da tastiera

Le scorciatoie integrate sono definite in `DEFAULT_SHORTCUTS`. `Mod` corrisponde a Ctrl su Windows/Linux e a Cmd su macOS.

| Tasto | Azione | Descrizione |
|-----|--------|-------------|
| `Mod-b` | `bold` | Grassetto |
| `Mod-i` | `italic` | Corsivo |
| `Mod-Alt-1` | `heading` | Titolo |
| `Mod-k` | `link` | Inserisci collegamento |
| `Mod-Alt-c` | `code` | Blocco di codice |
| `Mod-Shift-.` | `quote` | Blocco di citazione |
| `Mod-Shift-8` | `ul` | Elenco puntato |
| `Mod-Shift-7` | `ol` | Elenco numerato |
| `Mod-Shift-9` | `tasklist` | Elenco di attività |
| `Mod-Alt-m` | `math` | Formula matematica |
| `Mod-Alt-p` | `preview` | Mostra/nascondi anteprima |
| `Mod-Shift-l` | `theme` | Cambia tema |

Il pulsante **Guida** apre una finestra con queste scorciatoie rappresentate come tasti e una consultazione rapida per attività, menzioni, collegamenti, formule, mappe mentali e riquadri.

## Caricamento di immagini

Fornisci `onImageUpload: (file: File) => Promise<string>`. L'hook viene richiamato quando si incolla o si trascina un file immagine nell'editor. La finestra delle immagini accetta un URL e non offre la selezione di file. Restituisci l'URL pubblico dell'immagine; l'editor inserisce `![alt](url)` al cursore, usando il nome del file senza estensione come testo alternativo. Gli errori vengono intercettati senza messaggi; l'utente può riprovare.

## @menzioni

Passa l'opzione `mention` per attivare un elenco ricercabile quando si digita `@`:

- `onMentionSearch(query)` restituisce i `MentionItem` corrispondenti.
- `onMentionSelect(item)` restituisce il testo da inserire. Il formato predefinito è `[@label](mention:id)`, mostrato come etichetta nell'anteprima.
- `minChars` (predefinito `0`) e `maxItems` (predefinito `8`) regolano l'elenco.

L'elenco supporta frecce su/giù, Invio/Tab ed Esc e si chiude quando l'editor perde il focus. Nell'anteprima, il testo normale con `@`, come `@media`, non diventa un'etichetta: vengono convertiti solo i collegamenti con schema `mention:`. Nell'editor, quel testo può comunque attivare un hook di ricerca configurato.

## Collegamenti ai documenti

Passa l'opzione `docLink` per attivare la ricerca dei documenti dopo il carattere di attivazione, `/` per impostazione predefinita:

- `onDocSearch(query)` restituisce i `DocItem` corrispondenti.
- `onFetchDocMeta(url)` recupera titolo, miniatura e descrizione. L'implementazione integrata usa `fetch` e `DOMParser` per leggere i tag Open Graph; può fallire se il server di un'altra origine non consente CORS. Usa un proxy backend personalizzato quando necessario.
- `insertStyle` sceglie il formato: `'auto'` (scheda se ci sono metadati), `'card'` oppure `'link'`.

Il documento selezionato viene inserito come collegamento semplice o scheda cliccabile `:::doc-link` con titolo, miniatura, descrizione e nome host.

## Riquadri informativi

Scrivi un contenitore `:::` con uno dei sei tipi. Nella riga iniziale puoi aggiungere un titolo dopo il tipo:

```markdown
:::notice
This is a notice.
:::

:::warning Title here
Warning content.
:::
```

Tipi supportati: `notice`, `info`, `tip`, `success`, `warning`, `danger`. Ogni blocco ha un'icona, un bordo sinistro colorato e un'intestazione. Il pulsante dei riquadri apre un selettore visivo dei sei tipi. Disattiva con `tips: false`.

## Elenchi di attività

Gli elementi corrispondenti a `- [ ]` o `- [x]`, con spazi facoltativi nelle parentesi, diventano caselle disabilitate. Nota la convenzione del progetto: **`- [ ]` appare selezionato in verde e `- [x]` non selezionato**, al contrario di GitHub Flavored Markdown. Il pulsante delle attività alterna i marcatori della riga corrente o delle righe selezionate.

## Passaggi successivi

- [Configurazione](./configuration.md) — regola queste funzionalità tramite le opzioni.
- [Riferimento API](./api-reference.md) — controlla l'editor tramite codice.
