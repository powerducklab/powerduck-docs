---
sidebar_position: 1
title: "Espace API · Revue de code"
description: "Powerduck aide à comprendre les modifications produites par IA, à lire leur contexte et à décider des suites. Depuis l’accueil, ouvrez séparément l’espace API ou la revue de code dans l’application de bureau."
---

# Espace API · Revue de code

Powerduck aide à comprendre les modifications produites par IA, à lire leur contexte et à décider des suites. Depuis l’accueil, ouvrez séparément l’espace API ou la revue de code dans l’application de bureau.

## Espace API

Importez un fichier OpenAPI YAML ou JSON pour concevoir les opérations, envoyer des requêtes, examiner les réponses, utiliser scénarios, mocks locaux, modèles de données et documentation. MCP et publication sont des actions distinctes ; importer ne déploie pas votre backend métier.

## Revue de code

Le choix du dossier ouvre sa structure. Sélectionnez un fichier pour lire son code complet : source seule, comparaison complète ou modifications seules. Les ajouts, suppressions, différences de caractères, la navigation et la recherche rendent les changements repérables.

## Structure et code associé

Git et les analyseurs identifient les blocs et les définitions, appels et imports résolus. Survolez les symboles pris en charge pour leur définition et ouvrez le code associé près du changement. La structure signale fortes références, noms temporaires, contenus identiques et absence de références entrantes résolues. Chargement dynamique et usages externes peuvent manquer : aucune référence ne signifie pas suppression sûre.

## IA intégrée et utilisation

Connexion Google ou GitHub et modèle intégré uniquement : aucun sélecteur, clé personnelle ou endpoint personnalisé. Seul le travail IA demandé envoie le contexte choisi aux fournisseurs gérés. Les chemins courants de dépendances, compilation et identifiants sont exclus, sans garantie d’absence de secrets dans le code.

- [Espace API](introduction.md)
- [Revue de code](code-quality.md)
- [IA intégrée et utilisation](ai-models.md)
- [Offres et tâches](../cloud/billing.md)
- [Installer et démarrer](../overview/installation.md)
- [Comprendre chaque modification](../overview/quickstart.md)
