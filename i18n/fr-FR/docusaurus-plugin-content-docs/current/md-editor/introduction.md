---
sidebar_position: 1
title: "Présentation"
description: "@powerduck/md-editor est un éditeur Markdown performant et intégrable pour le navigateur. Il associe une zone d’édition CodeMirror 6 à un aperçu en direct produit par markdown-it, avec de nombreuses fonctions de rédaction : formules KaTeX, cartes mentales Markmap, coloration du code, encadrés, barre d’outils configurable, raccourcis clavier, points d’intégration pour l’envoi d’images, @mentions et insertion de liens vers des documents."
---

# Présentation

`@powerduck/md-editor` est un éditeur Markdown performant et intégrable pour le navigateur. Il associe une zone d’édition [CodeMirror 6](https://codemirror.net) à un aperçu en direct produit par [markdown-it](https://github.com/markdown-it/markdown-it), avec de nombreuses fonctions de rédaction : formules KaTeX, cartes mentales Markmap, coloration du code, encadrés, barre d’outils configurable, raccourcis clavier, points d’intégration pour l’envoi d’images, @mentions et insertion de liens vers des documents.

- **Nom du paquet :** `@powerduck/md-editor` <img src="https://img.shields.io/npm/v/@powerduck/md-editor"/>
- **Licence :** MIT
- **Format de module :** module ECMAScript (`type: "module"`), avec des distributions ESM (`dist/index.mjs`) et CJS (`dist/index.cjs`), ainsi que les déclarations de types (`dist/index.d.ts`).

## Fonctionnalités principales

Les fonctionnalités suivantes correspondent aux modules effectivement implémentés :

- **Édition Markdown** avec CodeMirror 6, coloration syntaxique Markdown et thèmes de coloration clair et sombre.
- **Formules KaTeX** grâce à un plugin markdown-it autonome : formules en ligne `$...$` et en bloc `$$...$$`. Des heuristiques évitent d’interpréter les montants tels que `$5` comme des formules.
- **Cartes mentales Markmap** à partir des blocs délimités ```` ```mindmap ````. markmap-lib et markmap-view sont importés dynamiquement et ne sont donc pas chargés dans le paquet initial en l’absence de cartes mentales.
- **Coloration du code** avec highlight.js, un en-tête à trois pastilles façon macOS, une étiquette de langage et un bouton de copie en un clic.
- **Encadrés d’information** (`:::notice`, `:::info`, `:::tip`, `:::success`, `:::warning`, `:::danger`) avec icônes et couleurs adaptées.
- **Aperçu de style GitHub** avec `github-markdown-css`.
- **Barre d’outils complète** proposant 22 actions, des boîtes de dialogue pour insérer images, vidéos, vidéos YouTube et tableaux, des sélecteurs de modèles de formules et de cartes mentales, ainsi qu’une aide récapitulant les raccourcis.
- **Raccourcis clavier** utilisant `Mod`, qui correspond à Ctrl sous Windows/Linux et à Cmd sous macOS.
- **Barre d’outils configurable** par une liste des éléments à inclure ou des réglages individuels (`show`, `label`, `icon`).
- **Fonction de téléversement d’images** (`onImageUpload`) appelée lorsqu’une image est collée ou déposée dans l’éditeur.
- **Liste déroulante de @mentions** configurée avec les options `mention` ; les mentions choisies apparaissent sous forme d’étiquettes dans l’aperçu.
- **Insertion de liens vers des documents** configurée avec `docLink` : liens simples ou cartes d’aperçu `:::doc-link`. Les métadonnées sont récupérées par le chargeur intégré ou une fonction personnalisée ; les requêtes entre origines restent soumises aux règles CORS du navigateur.
- **Rendu vidéo :** la syntaxe d’image dont l’URL se termine par `.mp4`, `.webm`, `.ogg` ou une autre extension reconnue produit un élément `<video controls>`.
- **Rendu autonome** avec `renderMarkdown(source, options)`, qui produit du HTML avec les mêmes plugins et styles que l’aperçu, sans monter d’éditeur.
- **Rendu incrémental par blocs :** la source est divisée au niveau des titres ATX et seuls les blocs modifiés sont recalculés. Les autres réutilisent leurs nœuds DOM, y compris les SVG des cartes mentales déjà initialisées. Les résultats sont mis en cache selon l’empreinte du contenu.
- **Temporisation adaptative :** le délai avant rendu de l’aperçu dépend de la longueur du document, de 120 ms à 600 ms.
- **Deux modes d’édition :** `simple` (édition et aperçu sans barre d’outils) et `complex` (barre d’outils et barre d’état), modifiables à l’exécution.
- **Deux thèmes :** `light` et `dark`, appliqués avec l’attribut `data-theme` et des propriétés CSS personnalisées.

## Vue d’ensemble de l’architecture

La bibliothèque propose deux interfaces :

1. **Classe JavaScript native** — l’API principale s’articule autour de `MarkdownEditor`, instanciée avec un élément conteneur. Elle réunit `CodeEditor` (enveloppe de CodeMirror), `Renderer` (enveloppe de markdown-it), `IncrementalRenderer` pour l’aperçu et, en mode `complex`, `Toolbar` et `StatusBar`. Les boîtes de dialogue, le contrôleur de @mentions et celui des liens documentaires sont des modules montés à la demande.

2. **Export React par sous-chemin** — `MarkdownEditorReact` est un composant `forwardRef` exporté depuis `./react`. Il encapsule une instance native de `MarkdownEditor`, prend en charge une `value` contrôlée ou non contrôlée et expose un `MarkdownEditorHandle` impératif via une ref. Cette entrée séparée évite d’imposer `react` et `react-dom` aux projets qui n’utilisent pas React.

Le rendu comporte une passe synchrone markdown-it, qui produit des emplacements HTML pour les cartes mentales, puis une initialisation asynchrone avec `Renderer.hydrate`, qui les transforme en diagrammes SVG interactifs. `renderMarkdown` renvoie le HTML synchrone ; pour obtenir les SVG, utilisez `Renderer.render`, insérez le HTML dans le DOM, puis appelez `Renderer.hydrate`. Le moteur incrémental agit directement sur le conteneur de l’aperçu.

## Navigateurs pris en charge

La bibliothèque cible les navigateurs modernes dotés d’un DOM. CodeMirror 6, KaTeX et markmap-view sont des dépendances du paquet, et non des fonctions du navigateur ; les cartes mentales interactives utilisent `ResizeObserver`. L’API Clipboard est utilisée lorsqu’elle est disponible. Si `navigator.clipboard` est indisponible, par exemple hors HTTPS, la copie des blocs de code utilise `document.execCommand('copy')`. Le module de cartes mentales installe une implémentation vide de `ResizeObserver` uniquement si l’objet global est absent, afin d’éviter une erreur d’importation ; elle ne fournit pas de véritables notifications de redimensionnement.

## Licence

`@powerduck/md-editor` est distribué sous licence **MIT**.

## Pour aller plus loin

- [Installation](./installation.md) — installer le paquet et découvrir les chemins d’importation.
- [Démarrage rapide](./quickstart.md) — monter votre premier éditeur en JavaScript natif ou React.
- [Configuration](./configuration.md) — toutes les options de `MarkdownEditorOptions`.
- [Fonctionnalités](./features.md) — découvrir chaque fonctionnalité intégrée en détail.
- [Référence API](./api-reference.md) — toutes les classes, fonctions et tous les types exportés.
- [Exemples](./examples.md) — des extraits complets et exécutables.
