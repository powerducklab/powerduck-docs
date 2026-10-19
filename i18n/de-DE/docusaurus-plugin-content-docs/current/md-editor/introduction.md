---
sidebar_position: 1
title: "Einführung"
description: "@powerduck/md-editor ist ein leistungsfähiger, einbettbarer Markdown-Editor für den Browser. Er verbindet einen CodeMirror 6-Editor mit einer Live-Vorschau auf Basis von markdown-it. Dazu kommen KaTeX-Formeln, Markmap-Mindmaps, Codehervorhebung, Hinweisblöcke, eine konfigurierbare Werkzeugleiste, Tastenkürzel, Hooks für Bild-Uploads, @Erwähnungen und das Einfügen von Dokumentlinks."
---

# Einführung

`@powerduck/md-editor` ist ein leistungsfähiger, einbettbarer Markdown-Editor für den Browser. Er verbindet einen [CodeMirror 6](https://codemirror.net)-Editor mit einer Live-Vorschau auf Basis von [markdown-it](https://github.com/markdown-it/markdown-it). Dazu kommen KaTeX-Formeln, Markmap-Mindmaps, Codehervorhebung, Hinweisblöcke, eine konfigurierbare Werkzeugleiste, Tastenkürzel, Hooks für Bild-Uploads, @Erwähnungen und das Einfügen von Dokumentlinks.

- **Paketname:** `@powerduck/md-editor` <img src="https://img.shields.io/npm/v/@powerduck/md-editor"/>
- **Lizenz:** MIT
- **Modulformat:** ECMAScript-Modul (`type: "module"`) mit ESM- (`dist/index.mjs`) und CJS-Builds (`dist/index.cjs`) sowie Typdeklarationen (`dist/index.d.ts`).

## Zentrale Funktionen

Die folgenden Funktionen entsprechen den implementierten Quellmodulen:

- **Markdown-Bearbeitung** mit CodeMirror 6, Markdown-Syntaxhervorhebung und hellen sowie dunklen Hervorhebungsthemes.
- **KaTeX-Formeln** über ein eigenständiges markdown-it-Plugin: inline mit `$...$` und als Block mit `$$...$$`. Geldbeträge wie `$5` werden durch Heuristiken von der Formelerkennung ausgenommen.
- **Markmap-Mindmaps** aus Codeblöcken mit der Kennzeichnung ```` ```mindmap ````. markmap-lib und markmap-view werden dynamisch importiert und vergrößern daher das anfänglich geladene Bundle nicht, wenn keine Mindmaps vorhanden sind.
- **Codehervorhebung** mit highlight.js, einer Kopfzeile mit drei farbigen Punkten im macOS-Stil, einer Sprachangabe und einer Schaltfläche zum Kopieren.
- **Hinweisblöcke** (`:::notice`, `:::info`, `:::tip`, `:::success`, `:::warning`, `:::danger`) mit Symbolen und passender Farbgestaltung.
- **Vorschau im GitHub-Stil** mit `github-markdown-css`.
- **Umfangreiche Werkzeugleiste** mit 22 Aktionen, Dialogen zum Einfügen von Bildern, Videos, YouTube-Videos und Tabellen, Vorlagenauswahl für Formeln und Mindmaps sowie einem Hilfedialog mit allen Tastenkürzeln.
- **Tastenkürzel** mit `Mod`, das unter Windows/Linux für Strg und unter macOS für Cmd steht.
- **Konfigurierbare Werkzeugleiste** über eine Liste einzublendender Elemente oder individuelle Einstellungen (`show`, `label`, `icon`).
- **Hook für Bild-Uploads** (`onImageUpload`), der beim Einfügen oder Ablegen eines Bildes im Editor aufgerufen wird.
- **Dropdown für @Erwähnungen**, konfiguriert über `mention`; ausgewählte Erwähnungen erscheinen in der Vorschau als gestaltete Badges.
- **Einfügen von Dokumentlinks** über `docLink`: einfache Links oder `:::doc-link`-Vorschaukarten. Metadaten werden vom integrierten Loader oder einem eigenen Hook geladen; originübergreifende Anfragen unterliegen den CORS-Regeln des Browsers.
- **Videodarstellung:** Bildsyntax mit URLs, die auf `.mp4`, `.webm`, `.ogg` oder andere bekannte Erweiterungen enden, wird als `<video controls>`-Element dargestellt.
- **Eigenständiger Renderer** (`renderMarkdown(source, options)`), der ohne Editorinstanz HTML mit denselben Plugins und Stilen wie die Editorvorschau erzeugt.
- **Inkrementelles Rendering auf Blockebene:** Der Quelltext wird an ATX-Überschriften in Blöcke aufgeteilt. Nur geänderte Blöcke werden neu gerendert. Unveränderte Blöcke verwenden ihre DOM-Knoten erneut, einschließlich bereits initialisierter Mindmap-SVGs. Ergebnisse werden anhand des Inhaltshashs zwischengespeichert.
- **Adaptive Verzögerung:** Die Wartezeit bis zur Vorschauaktualisierung richtet sich nach der Dokumentlänge, von 120 ms bis höchstens 600 ms.
- **Zwei Bearbeitungsmodi:** `simple` (Editor und Vorschau ohne Werkzeugleiste) und `complex` (mit Werkzeug- und Statusleiste), zur Laufzeit umschaltbar.
- **Zwei Themes:** `light` und `dark`, umgesetzt mit dem Attribut `data-theme` und benutzerdefinierten CSS-Eigenschaften.

## Architekturüberblick

Die Bibliothek bietet zwei Schnittstellen:

1. **Native JavaScript-Klasse** — im Mittelpunkt der Haupt-API steht `MarkdownEditor`, die mit einem Containerelement instanziiert wird. Sie kombiniert `CodeEditor` als CodeMirror-Wrapper, `Renderer` als markdown-it-Wrapper, `IncrementalRenderer` für die Vorschau sowie im Modus `complex` eine `Toolbar` und `StatusBar`. Dialoge, der Controller für @Erwähnungen und der Dokumentlink-Controller sind steckbare, bei Bedarf eingebundene Module.

2. **React-Export über einen Unterpfad** — `MarkdownEditorReact` ist eine über `./react` exportierte `forwardRef`-Komponente. Sie kapselt eine native `MarkdownEditor`-Instanz, unterstützt die gesteuerte und ungesteuerte Verwendung von `value` und stellt über eine Ref einen imperativen `MarkdownEditorHandle` bereit. Durch den separaten React-Einstieg müssen Projekte ohne React weder `react` noch `react-dom` installieren.

Das Rendering besteht aus einem synchronen markdown-it-Durchlauf, der HTML-Platzhalter für Mindmaps erzeugt, und einem asynchronen Initialisierungsschritt mit `Renderer.hydrate`, der daraus interaktive SVG-Diagramme macht. `renderMarkdown` liefert das synchrone HTML. Für Mindmap-SVGs verwenden Sie `Renderer.render`, fügen das HTML ins DOM ein und rufen anschließend `Renderer.hydrate` auf. Der inkrementelle Renderer arbeitet direkt mit dem Vorschaucontainer.

## Browserunterstützung

Die Bibliothek richtet sich an moderne Browser mit DOM. CodeMirror 6, KaTeX und markmap-view sind Paketabhängigkeiten, keine Browserfunktionen; interaktive Mindmaps verwenden `ResizeObserver`. Wenn verfügbar, wird die Clipboard API genutzt. Ist `navigator.clipboard` nicht verfügbar, etwa ohne HTTPS, nutzt das Kopieren von Codeblöcken ersatzweise `document.execCommand('copy')`. Das Mindmap-Modul installiert nur dann eine leere `ResizeObserver`-Implementierung, wenn das globale Objekt fehlt. So wird ein entsprechender Importfehler vermieden; echte Größenänderungsbenachrichtigungen liefert diese Ersatzimplementierung nicht.

## Lizenz

`@powerduck/md-editor` wird unter der **MIT**-Lizenz veröffentlicht.

## Nächste Schritte

- [Installation](./installation.md) — Paket installieren und Importpfade kennenlernen.
- [Schnellstart](./quickstart.md) — den ersten Editor mit nativem JavaScript oder React einbinden.
- [Konfiguration](./configuration.md) — alle Optionen von `MarkdownEditorOptions`.
- [Funktionen](./features.md) — die integrierten Funktionen im Detail.
- [API-Referenz](./api-reference.md) — alle exportierten Klassen, Funktionen und Typen.
- [Beispiele](./examples.md) — vollständige, ausführbare Codebeispiele.
