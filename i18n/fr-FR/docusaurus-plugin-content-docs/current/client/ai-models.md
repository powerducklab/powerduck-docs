---
sidebar_position: 15
title: "IA intégrée et utilisation"
description: "Powerduck aide à comprendre les modifications produites par IA, à lire leur contexte et à décider des suites. Depuis l’accueil, ouvrez séparément l’espace API ou la revue de code dans l’application de bureau."
---

# IA intégrée et utilisation

Connexion Google ou GitHub et modèle intégré uniquement : aucun sélecteur, clé personnelle ou endpoint personnalisé. Seul le travail IA demandé envoie le contexte choisi aux fournisseurs gérés. Les chemins courants de dépendances, compilation et identifiants sont exclus, sans garantie d’absence de secrets dans le code.

## Revue IA dans le code

La revue IA démarre sur demande et analyse des lots de différences avec un contexte limité, sans envoyer chaque fichier complet. Les résultats correspondants en cache sont réutilisables. Chaque doute apparaît au niveau du code avec priorité, preuve et recommandation. Confirmez, marquez un faux positif ou préparez une tâche Agent. L’IA ne prouve ni correction ni exécution de tests.

## Offres et tâches

Un tour de conversation ou une opération de revue vaut une tâche, sans décompte séparé des appels internes. Réservation pendant l’exécution, puis règlement serveur : un résultat livré coûte une tâche même après annulation ; sans résultat réussi, la réservation est libérée. Fractionnez les grandes revues. Lecture locale, Git/AST et résultats sauvegardés sont gratuits. Les anciens abonnements peuvent conserver leurs crédits ; consultez votre compte.

- [Espace API](introduction.md)
- [Revue de code](code-quality.md)
- [IA intégrée et utilisation](ai-models.md)
- [Offres et tâches](../cloud/billing.md)
- [Installer et démarrer](../overview/installation.md)
- [Comprendre chaque modification](../overview/quickstart.md)
