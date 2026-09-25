---
sidebar_position: 2
title: Concevoir avec l'assistant
description: "Concevez OpenAPI via un assistant conversationnel. Les changements arrivent sous forme de cartes de correctif révisables contenant des opérations JSON Patch fines. L'édition focalisée préserve le reste de l'opération."
---

# Concevoir avec l'assistant

Le mode spécification est l'endroit où vous concevez l'API. Il associe le chat IA au document en direct et à l'aperçu, afin que vous décriviez l'intention en langage naturel tout en gardant le contrôle total des changements réels.

## La boucle d'approbation

Le modèle n'édite pas directement le document. Cette boucle est délibérément explicite.

```text
you describe an intent
        |
the model reads current state and proposes operations
        |
the host validates the proposal
        |
you review a patch card and Apply or Reject
        |
the change is merged into the document
```

Cette séparation est une décision de conception centrale. Le **modèle** excelle à comprendre l'intention et à proposer des structures, l'**hôte** est déterministe et valide chaque opération, et **vous** approuvez chaque changement. Une proposition n'est jamais considérée comme appliquée avant que vous ne la confirmiez.

## La carte de correctif

La carte de correctif résume le changement et liste les opérations précises, comme l'ajout d'un chemin.

```json
{
  "type": "patch",
  "summary": "Add GET /products endpoint",
  "ops": [
    { "op": "add", "path": ["paths", "/products"], "value": { "get": {} } }
  ],
  "affects": { "paths": ["/paths/~1products"], "resources": ["Product"] }
}
```

Les segments de chemin sont des éléments de tableau, pas des chaînes JSON Pointer. Pour ajouter un chemin entièrement nouveau, la cible est `["paths", "/products"]` et les conteneurs parents sont créés automatiquement.

### Éditions fines sur une opération existante

Quand vous éditez une opération existante, l'assistant ne renvoie pas l'opération entière — cela effacerait tous les champs non répétés. Il génère plutôt de petites opérations qui pénètrent dans l'opération et ne touchent que ce qui change.

- Ajouter un paramètre de requête :

```json
{ "op": "add", "path": ["paths", "/products", "get", "parameters", "-"], "value": {} }
```

- Étendre le schéma de réponse :

```json
{ "op": "replace", "path": ["paths", "/products", "get", "responses", "200", "content", "application/json", "schema", "properties", "total"], "value": { "type": "integer" } }
```

- Changer un seul champ :

```json
{ "op": "replace", "path": ["paths", "/products", "get", "summary"], "value": "..." }
```

Les tableaux reçoivent des ajouts via `"-"`, pas un renvoi complet. Les paramètres sont identifiés par `(in, name)` pour ne pas dupliquer l'existant. L'hôte fusionne les valeurs proposées dans l'opération courante et préserve tout ce que vous omettez.

C'est ce qui rend le raffinage itératif fiable : dites « ajoute le paramètre limit ici » ou « rends name obligatoire », et seul ce champ change, le reste de l'opération reste intact.

## Les outils de lecture fondent chaque proposition

Avant de répondre, le modèle peut appeler des outils en lecture seule pour obtenir l'état exact, pas une supposition.

- `spec.overview` — titre, version, protocoles, compteurs, tags, servers, sécurité.
- `spec.listOperations` — chaque opération en `METHOD /path`, avec résumés et tags.
- `spec.presentOperations` — rendu d'une carte de liste en lecture seule de toutes les opérations.
- `spec.getOperation` — définition complète d'une opération et schémas référencés.
- `spec.getSchema` — un schéma de composant unique, champs obligatoires et descriptions inclus.

Quand la forme complète d'une opération n'est pas visible, le modèle doit toujours la lire avant de l'éditer.

## Les demandes larges avancent par étapes

Pour une grande demande comme « construis une API e-commerce », l'assistant ne déverse pas tout d'un coup.

1. Il pose d'abord des **questions de clarification** sur les décisions clés.
2. Après réponse, il propose **un correctif concentré à la fois**, chaque carte couvrant 2 à 5 opérations.
3. Il ne continue que tant que la demande la plus récente reste dans la portée de cet objectif.

Une fois la portée claire, l'assistant produit aussi un `plan` des opérations à construire, pour voir la forme du travail avant les correctifs.

## Protection contre la dérive

L'hôte impose quelques règles pour garder les opérations alignées.

- Le **document courant** fait foi. Si le document ne montre pas quelque chose, le modèle ne suppose pas qu'un correctif antérieur existe.
- En mode focus, seuls la cible active (et les schémas de composants explicitement référencés) changent ; pas de modifications opportunistes sur des opérations voisines.
- Mentionner un autre `METHOD /path` est traité comme un changement d'opération intentionnel.
- Les propositions appliquées et rejetées sont suivies dans l'historique pour ne pas répéter les correctifs existants.

Quand un détail nécessaire n'est pas visible, l'assistant ne l'invente pas : il pose une question ciblée.

## Autres cartes

Toutes les réponses ne sont pas des correctifs.

- Les **cartes question** demandent de choisir entre des options.
- Les **cartes de validation** rapportent les contrôles qualité, avec états de passage, avertissement et erreur.
- Les **cartes action** fournissent une prochaine étape concrète, comme exécuter un scénario ou ouvrir un espace de travail.
- Les **cartes table de données** présentent des données d'exemple/de test concrètes pour des opérations ou schémas.

Voir aussi : [Espace de travail de requête](./debug)、[Tests de scénario](./scenario-testing)、[IA et modèles](./ai-models).
