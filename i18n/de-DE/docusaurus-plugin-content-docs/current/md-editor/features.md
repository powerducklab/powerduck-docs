---
sidebar_position: 5
title: "Funktionen"
description: "Diese Seite beschreibt die integrierten Funktionen anhand ihrer tatsächlichen Implementierung."
---

# Funktionen

Diese Seite beschreibt die integrierten Funktionen anhand ihrer tatsächlichen Implementierung.

## Inkrementelles Rendering

Die Vorschau nutzt blockweises inkrementelles Rendering, damit auch große Dokumente reaktionsfähig bleiben:

- **Blockaufteilung** (`splitIntoBlocks`): Der Quelltext wird an ATX-Überschriften (`#` bis `######`) geteilt. Inhalte innerhalb von Codeblöcken mit Backtick- oder Tilde-Begrenzung sind keine Trennstellen; auch Überschriften in `:::`-Containern bleiben erhalten. Dokumente ohne Überschriften bilden einen einzigen Block.
- **Rendering pro Block:** Nur Blöcke mit verändertem Inhaltshash durchlaufen markdown-it / KaTeX erneut. Die übrigen verwenden ihre DOM-Knoten direkt weiter, einschließlich bereits initialisierter Mindmap-SVGs.
- **Inhaltshash-Cache:** Ergebnisse werden mit einem schnellen djb2-artigen Hash samt Länge zwischengespeichert. Auch Rückgängig/Wiederholen und das Einfügen identischer Absätze können den Cache nutzen. Bei mehr als 800 Einträgen werden Hashes entfernt, die nicht mehr im aktuellen Dokument vorkommen. Aktuelle Blöcke bleiben erhalten; ein Dokument mit mehr als 800 unterschiedlichen Blöcken kann diesen Schwellenwert daher überschreiten.
- **Umordnung:** Vorhandene Knoten werden an ein `DocumentFragment` angehängt und dadurch vom Browser nativ verschoben.
- **Adaptive Verzögerung** (`adaptiveDebounceMs(docLength, base = 120, max = 600)`): Die Wartezeit beträgt `base + floor(docLength / 20000) * 60`, begrenzt auf `max`. Mit `renderDebounce` lässt sie sich ersetzen; `renderDebounce: false` aktiviert synchrones Rendering.
- **`content-visibility: auto`:** Jeder Block wird in ein `.md-editor-block`-Element eingebettet, sodass Blöcke außerhalb des sichtbaren Bereichs Layout und Zeichnen überspringen können.

Ein Renderingfehler in einem Block leert nicht die gesamte Vorschau. Stattdessen erscheint dessen maskierter Quelltext in einem `<pre>`.

## KaTeX-Formeln

Das eigenständige markdown-it-Mathematik-Plugin verwendet KaTeX, ohne Abhängigkeit von `markdown-it-texmath`:

- **Inline-Formeln:** `$E=mc^2$`. Der Inhalt darf weder leer sein noch `$` oder Zeilenumbrüche enthalten. Geldbeträge wie `$5` oder `$10.50` werden heuristisch ausgeschlossen.
- **Blockformeln:**
  ```markdown
  $$
  \int_0^1 x^2 \, dx
  $$
  ```
  Einzeilige (`$$ ... $$`) und mehrzeilige Formen werden unterstützt. Das KaTeX-CSS ist enthalten. Mit `math: false` deaktivieren.

## Markmap-Mindmaps

Schreiben Sie einen Codeblock mit ```` ```mindmap ```` und einer Markdown-Gliederung als Inhalt:

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

Die Blockregel verfolgt die Verschachtelungstiefe der Begrenzungen, damit eingebettete Codeblöcke innerhalb einer Mindmap erhalten bleiben. Der synchrone Durchlauf erzeugt einen `<div>`-Platzhalter; `Renderer.hydrate(container)` importiert `markmap-lib` und `markmap-view` asynchron und erstellt interaktive SVGs. Initialisierungsfehler sind nicht fatal. Mit `mindmap: false` deaktivieren.

## Codehervorhebung mit Kopierschaltfläche

Codeblöcke werden mit highlight.js hervorgehoben. Die Distribution registriert JavaScript, TypeScript, Python, JSON, Bash/Shell, CSS, XML/HTML/SVG, SQL, YAML, Markdown, Go, Rust, Java, C und C++ sowie Aliase wie `js`, `ts`, `py`, `sh`, `yml`, `md`, `rs` und `c++`. Unbekannte Sprachen werden automatisch erkannt; schlägt dies fehl, wird maskierter Klartext angezeigt.

Jeder hervorgehobene Block erhält einen Container im macOS-Stil mit drei farbigen Punkten, Sprachangabe und **Kopieren**-Schaltfläche. Das Kopieren nutzt Ereignisdelegation im Vorschaufenster und ersatzweise `document.execCommand('copy')`, wenn die Clipboard API fehlt. Mit `codeHighlight: false` deaktivieren.

## Werkzeugleistenaktionen {#toolbar-actions}

Im Modus `complex` enthält die Werkzeugleiste diese 22 Aktionen in der angegebenen Reihenfolge:

| # | Aktionsname | Zweck |
|---|-------------|---------------|
| 1 | `heading` | Überschrift |
| 2 | `bold` | Fett (Ctrl+B) |
| 3 | `italic` | Kursiv (Ctrl+I) |
| 4 | `link` | Link (Ctrl+K) |
| 5 | `image` | Bild einfügen |
| 6 | `video` | Video einfügen |
| 7 | `youtube` | YouTube-Video einfügen |
| 8 | `quote` | Zitat |
| 9 | `ul` | Aufzählung |
| 10 | `ol` | Nummerierte Liste |
| 11 | `tasklist` | Aufgabenliste |
| 12 | `mention` | Erwähnung (@) |
| 13 | `doclink` | Dokumentlink einfügen |
| 14 | `code` | Codeblock |
| 15 | `table` | Tabelle |
| 16 | `math` | Mathematische Formel |
| 17 | `mindmap` | Mindmap einfügen |
| 18 | `hr` | Horizontale Linie |
| 19 | `tips` | Hinweis einfügen |
| 20 | `preview` | Vorschau umschalten |
| 21 | `help` | Tastenkürzel |
| 22 | `theme` | Theme wechseln |

Die eingebauten Beschriftungen sind englisch. Überschreiben Sie `label` pro Element, um Tooltips und zugängliche Namen zu übersetzen. Mehrere Aktionen öffnen Dialoge oder Auswahlelemente: Bild, Video, YouTube, Tabelle, Formelvorlagen, Mindmap-Vorlagen, Hinweistypen und Hilfe. Die Einstellung `toolbar` wird unter [Konfiguration](./configuration.md#toolbarconfig) beschrieben.

## Tastenkürzel

Die integrierten Kürzel stehen in `DEFAULT_SHORTCUTS`. `Mod` entspricht Strg unter Windows/Linux und Cmd unter macOS.

| Taste | Aktion | Beschreibung |
|-----|--------|-------------|
| `Mod-b` | `bold` | Fett |
| `Mod-i` | `italic` | Kursiv |
| `Mod-Alt-1` | `heading` | Überschrift |
| `Mod-k` | `link` | Link einfügen |
| `Mod-Alt-c` | `code` | Codeblock |
| `Mod-Shift-.` | `quote` | Zitatblock |
| `Mod-Shift-8` | `ul` | Aufzählung |
| `Mod-Shift-7` | `ol` | Nummerierte Liste |
| `Mod-Shift-9` | `tasklist` | Aufgabenliste |
| `Mod-Alt-m` | `math` | Mathematische Formel |
| `Mod-Alt-p` | `preview` | Vorschau umschalten |
| `Mod-Shift-l` | `theme` | Theme wechseln |

Die **Hilfe**-Schaltfläche zeigt einen Dialog mit gestalteten Tastenkappen für diese Kürzel sowie eine Kurzübersicht zu Aufgabenlisten, Erwähnungen, Dokumentlinks, Formeln, Mindmaps und Hinweisen.

## Bild-Upload

Übergeben Sie `onImageUpload: (file: File) => Promise<string>`. Der Hook wird beim Einfügen oder Ablegen einer Bilddatei im Editor aufgerufen. Der Bilddialog akzeptiert eine URL und bietet keine Dateiauswahl. Liefern Sie die öffentliche Bild-URL; der Editor fügt `![alt](url)` am Cursor ein und verwendet den Dateinamen ohne Erweiterung als Alternativtext. Uploadfehler werden ohne Fehlermeldung abgefangen; ein erneuter Versuch ist möglich.

## @Erwähnungen

Mit der Option `mention` aktivieren Sie ein durchsuchbares Dropdown bei Eingabe von `@`:

- `onMentionSearch(query)` liefert passende `MentionItem`-Objekte.
- `onMentionSelect(item)` liefert den einzufügenden Text. Standardmäßig wird `[@label](mention:id)` verwendet und in der Vorschau als Badge dargestellt.
- `minChars` (Standard `0`) und `maxItems` (Standard `8`) steuern das Dropdown.

Das Dropdown unterstützt Pfeil hoch/runter, Eingabe/Tab und Escape und schließt beim Fokusverlust des Editors. In der Vorschau wird gewöhnlicher Text mit `@`, etwa `@media`, nicht zum Badge; nur Links mit dem Schema `mention:` werden umgewandelt. Im Editor kann solcher Text trotzdem einen konfigurierten Such-Hook auslösen.

## Dokumentlinks

Mit `docLink` aktivieren Sie eine Dokumentsuche nach dem Auslösezeichen, standardmäßig `/`:

- `onDocSearch(query)` liefert passende `DocItem`-Objekte.
- `onFetchDocMeta(url)` lädt Titel, Vorschaubild und Beschreibung. Die integrierte Umsetzung liest Open-Graph-Tags mit `fetch` und `DOMParser`; sie kann scheitern, wenn ein fremder Server CORS nicht erlaubt. Verwenden Sie bei Bedarf einen eigenen Backend-Proxy.
- `insertStyle` bestimmt das Format: `'auto'` (Karte bei vorhandenen Metadaten), `'card'` oder `'link'`.

Das ausgewählte Dokument wird als einfacher Link oder als klickbare `:::doc-link`-Karte mit Titel, Vorschaubild, Beschreibung und Hostname eingefügt.

## Hinweisblöcke

Schreiben Sie einen `:::`-Container mit einem der sechs Typen. In der ersten Zeile kann nach dem Typ ein optionaler Titel stehen:

```markdown
:::notice
This is a notice.
:::

:::warning Title here
Warning content.
:::
```

Unterstützte Typen: `notice`, `info`, `tip`, `success`, `warning`, `danger`. Jeder Block hat ein Symbol, einen farbigen linken Rand und eine Kopfzeile. Die Hinweisschaltfläche öffnet eine visuelle Auswahl aller sechs Typen. Mit `tips: false` deaktivieren.

## Aufgabenlisten

Listeneinträge mit `- [ ]` oder `- [x]`, einschließlich beliebiger Leerzeichen in den Klammern, werden zu deaktivierten Kontrollkästchen. Beachten Sie die Projektkonvention: **`- [ ]` erscheint angekreuzt in Grün, `- [x]` nicht angekreuzt** — umgekehrt zu GitHub Flavored Markdown. Die Aufgabenlisten-Schaltfläche wechselt die Markierungen der aktuellen oder ausgewählten Zeilen.

## Nächste Schritte

- [Konfiguration](./configuration.md) — Funktionen über Optionen anpassen.
- [API-Referenz](./api-reference.md) — den Editor programmatisch steuern.
