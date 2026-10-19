---
sidebar_position: 5
title: "Fonctionnalités"
description: "Cette page décrit chaque fonctionnalité intégrée à partir de son implémentation réelle."
---

# Fonctionnalités

Cette page décrit chaque fonctionnalité intégrée à partir de son implémentation réelle.

## Rendu incrémental

L’aperçu utilise un rendu incrémental par blocs pour rester réactif sur les documents volumineux :

- **Découpage en blocs** (`splitIntoBlocks`) : la source est découpée aux titres ATX (`#` à `######`). Le contenu des blocs de code délimités par accents graves ou tildes n’est jamais utilisé comme point de coupure ; les titres à l’intérieur des conteneurs `:::` sont également préservés. Sans titre, le document forme un seul bloc.
- **Rendu par bloc :** seuls les blocs dont l’empreinte a changé repassent par markdown-it / KaTeX. Les autres réutilisent directement leurs nœuds DOM, y compris les SVG des cartes mentales déjà initialisées.
- **Cache par empreinte du contenu :** les résultats sont conservés selon une empreinte rapide de type djb2 combinée à la longueur. Annuler, rétablir ou coller des paragraphes identiques peut donc réutiliser le cache. Au-delà de 800 entrées, les empreintes absentes du document courant sont supprimées. Celles des blocs actuels sont conservées : un document contenant plus de 800 blocs distincts peut dépasser ce seuil.
- **Réorganisation :** les blocs sont déplacés nativement en ajoutant leurs nœuds existants à un `DocumentFragment`.
- **Temporisation adaptative** (`adaptiveDebounceMs(docLength, base = 120, max = 600)`) : le délai vaut `base + floor(docLength / 20000) * 60`, plafonné à `max`. Utilisez `renderDebounce` pour le remplacer, ou `renderDebounce: false` pour un rendu synchrone.
- **`content-visibility: auto` :** chaque bloc est enveloppé dans un élément `.md-editor-block` pour éviter la mise en page et le dessin des blocs hors écran.

L’échec du rendu d’un bloc ne vide pas tout l’aperçu : le bloc affiche son texte source échappé dans un `<pre>`.

## Formules KaTeX

Le plugin mathématique markdown-it autonome utilise KaTeX, sans dépendance à `markdown-it-texmath` :

- **Formules en ligne :** `$E=mc^2$`. Le contenu ne doit être ni vide, ni contenir `$` ou un retour à la ligne. Les montants comme `$5` ou `$10.50` sont exclus par des heuristiques.
- **Formules en bloc :**
  ```markdown
  $$
  \int_0^1 x^2 \, dx
  $$
  ```
  Les formes sur une ligne (`$$ ... $$`) et sur plusieurs lignes sont prises en charge. Le CSS KaTeX est inclus dans le paquet. Désactivez avec `math: false`.

## Cartes mentales Markmap

Écrivez un bloc délimité ```` ```mindmap ```` dont le contenu est un plan Markdown :

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

La règle suit la profondeur d’imbrication des délimiteurs pour préserver les blocs de code imbriqués dans une carte mentale. Le rendu synchrone produit un `<div>` temporaire ; `Renderer.hydrate(container)` importe `markmap-lib` et `markmap-view` de façon asynchrone et transforme les emplacements en SVG interactifs. Un échec d’initialisation n’est pas fatal. Désactivez avec `mindmap: false`.

## Coloration du code et bouton de copie

Les blocs de code utilisent highlight.js. La distribution enregistre JavaScript, TypeScript, Python, JSON, Bash/Shell, CSS, XML/HTML/SVG, SQL, YAML, Markdown, Go, Rust, Java, C et C++, avec les alias courants `js`, `ts`, `py`, `sh`, `yml`, `md`, `rs` et `c++`. Les langages inconnus font l’objet d’une détection automatique ; en cas d’échec, le texte est affiché sans coloration et échappé.

Chaque bloc est enveloppé dans un conteneur de style macOS avec trois pastilles, une étiquette de langage et un bouton **Copier**. La copie utilise la délégation d’événements sur le volet d’aperçu et, si l’API Clipboard manque, `document.execCommand('copy')`. Désactivez avec `codeHighlight: false`.

## Actions de la barre d’outils {#toolbar-actions}

En mode `complex`, la barre contient les 22 actions suivantes, dans cet ordre :

| # | Nom de l’action | Fonction |
|---|-------------|---------------|
| 1 | `heading` | Titre |
| 2 | `bold` | Gras (Ctrl+B) |
| 3 | `italic` | Italique (Ctrl+I) |
| 4 | `link` | Lien (Ctrl+K) |
| 5 | `image` | Insérer une image |
| 6 | `video` | Insérer une vidéo |
| 7 | `youtube` | Insérer une vidéo YouTube |
| 8 | `quote` | Citation |
| 9 | `ul` | Liste à puces |
| 10 | `ol` | Liste numérotée |
| 11 | `tasklist` | Liste de tâches |
| 12 | `mention` | Mention (@) |
| 13 | `doclink` | Insérer un lien documentaire |
| 14 | `code` | Bloc de code |
| 15 | `table` | Tableau |
| 16 | `math` | Formule mathématique |
| 17 | `mindmap` | Insérer une carte mentale |
| 18 | `hr` | Séparateur horizontal |
| 19 | `tips` | Insérer un encadré |
| 20 | `preview` | Afficher ou masquer l’aperçu |
| 21 | `help` | Raccourcis clavier |
| 22 | `theme` | Changer de thème |

Les libellés intégrés sont en anglais. Remplacez `label` pour chaque élément afin de traduire les infobulles et les noms accessibles. Plusieurs actions ouvrent un dialogue ou un sélecteur : image, vidéo, YouTube, tableau, modèles de formules et de cartes mentales, types d’encadrés et aide. Configurez la barre via `toolbar`, comme indiqué dans [Configuration](./configuration.md#toolbarconfig).

## Raccourcis clavier

Les raccourcis intégrés sont définis dans `DEFAULT_SHORTCUTS`. `Mod` correspond à Ctrl sous Windows/Linux et à Cmd sous macOS.

| Touche | Action | Description |
|-----|--------|-------------|
| `Mod-b` | `bold` | Gras |
| `Mod-i` | `italic` | Italique |
| `Mod-Alt-1` | `heading` | Titre |
| `Mod-k` | `link` | Insérer un lien |
| `Mod-Alt-c` | `code` | Bloc de code |
| `Mod-Shift-.` | `quote` | Bloc de citation |
| `Mod-Shift-8` | `ul` | Liste à puces |
| `Mod-Shift-7` | `ol` | Liste numérotée |
| `Mod-Shift-9` | `tasklist` | Liste de tâches |
| `Mod-Alt-m` | `math` | Formule mathématique |
| `Mod-Alt-p` | `preview` | Afficher ou masquer l’aperçu |
| `Mod-Shift-l` | `theme` | Changer de thème |

Le bouton **Aide** ouvre un dialogue présentant ces raccourcis sous forme de touches, ainsi qu’un aide-mémoire pour les tâches, mentions, liens documentaires, formules, cartes mentales et encadrés.

## Téléversement d’images

Fournissez `onImageUpload: (file: File) => Promise<string>`. La fonction est appelée lorsqu’un fichier image est collé ou déposé dans l’éditeur. Le dialogue d’image accepte une URL et ne propose pas de sélection de fichier. Renvoyez l’URL publique de l’image ; l’éditeur insère `![alt](url)` au curseur avec le nom du fichier sans extension comme texte alternatif. Les échecs sont interceptés sans affichage d’erreur ; l’utilisateur peut réessayer.

## @mentions

Passez une option `mention` pour activer une liste de recherche à la saisie de `@` :

- `onMentionSearch(query)` renvoie les `MentionItem` correspondants.
- `onMentionSelect(item)` renvoie le texte à insérer. Par défaut, `[@label](mention:id)` est transformé en étiquette dans l’aperçu.
- `minChars` (par défaut `0`) et `maxItems` (par défaut `8`) règlent la liste.

La liste accepte les flèches haut/bas, Entrée/Tab et Échap, et se ferme lorsque l’éditeur perd le focus. Dans l’aperçu, le texte ordinaire avec `@`, comme `@media`, ne devient pas une étiquette : seuls les liens de schéma `mention:` sont convertis. Dans l’éditeur, ce texte peut néanmoins déclencher une fonction de recherche configurée.

## Liens vers des documents

Passez une option `docLink` pour activer la recherche documentaire après le caractère déclencheur, `/` par défaut :

- `onDocSearch(query)` renvoie les `DocItem` correspondants.
- `onFetchDocMeta(url)` récupère le titre, la vignette et la description. L’implémentation intégrée utilise `fetch` et `DOMParser` pour lire les balises Open Graph ; elle peut échouer si le serveur distant n’autorise pas CORS. Utilisez un proxy côté serveur si nécessaire.
- `insertStyle` choisit le format : `'auto'` (carte si des métadonnées sont disponibles), `'card'` ou `'link'`.

Le document choisi est inséré comme lien simple ou carte `:::doc-link` cliquable avec titre, vignette, description et nom d’hôte.

## Encadrés d’information

Écrivez un conteneur `:::` avec l’un des six types. Un titre facultatif peut suivre le type sur la ligne d’ouverture :

```markdown
:::notice
This is a notice.
:::

:::warning Title here
Warning content.
:::
```

Types acceptés : `notice`, `info`, `tip`, `success`, `warning`, `danger`. Chaque bloc possède une icône, une bordure gauche colorée et un en-tête. Le bouton correspondant de la barre ouvre un sélecteur visuel des six types. Désactivez avec `tips: false`.

## Listes de tâches

Les éléments correspondant à `- [ ]` ou `- [x]`, avec des espaces facultatifs dans les crochets, deviennent des cases non modifiables. Attention à la convention du projet : **`- [ ]` apparaît coché en vert et `- [x]` apparaît décoché**, à l’inverse de GitHub Flavored Markdown. Le bouton de liste de tâches bascule les marqueurs de la ligne courante ou des lignes sélectionnées.

## Pour aller plus loin

- [Configuration](./configuration.md) — ajuster les fonctionnalités avec les options.
- [Référence API](./api-reference.md) — piloter l’éditeur par programmation.
