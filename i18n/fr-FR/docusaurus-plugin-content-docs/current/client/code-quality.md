---
sidebar_position: 10
title: "Revue de code"
description: "Powerduck aide à comprendre les modifications produites par IA, à lire leur contexte et à décider des suites. Depuis l’accueil, ouvrez séparément l’espace API ou la revue de code dans l’application de bureau."
---

# Revue de code

Le choix du dossier ouvre sa structure. Sélectionnez un fichier pour lire son code complet : source seule, comparaison complète ou modifications seules. Les ajouts, suppressions, différences de caractères, la navigation et la recherche rendent les changements repérables.

## Comparaison et historique des cycles

Le cycle courant compare son point de départ enregistré aux fichiers sur disque. La première ouverture crée ce repère sans déclarer tous les fichiers nouveaux. Les changements non validés se comparent à Git HEAD. Démarrez volontairement un nouveau cycle et consultez les anciens dans l’historique local, qui ne remplace pas Git. Enregistrez vos modifications sur disque.

## Structure et code associé

Git et les analyseurs identifient les blocs et les définitions, appels et imports résolus. Survolez les symboles pris en charge pour leur définition et ouvrez le code associé près du changement. La structure signale fortes références, noms temporaires, contenus identiques et absence de références entrantes résolues. Chargement dynamique et usages externes peuvent manquer : aucune référence ne signifie pas suppression sûre.

## Revue IA dans le code

La revue IA démarre sur demande et analyse des lots de différences avec un contexte limité, sans envoyer chaque fichier complet. Les résultats correspondants en cache sont réutilisables. Chaque doute apparaît au niveau du code avec priorité, preuve et recommandation. Confirmez, marquez un faux positif ou préparez une tâche Agent. L’IA ne prouve ni correction ni exécution de tests.

## Dossiers de tâches Agent

Sélectionnez plusieurs doutes et prévisualisez, copiez ou téléchargez le dossier Markdown avec contexte et révision. L’Agent doit évaluer indépendamment ; l’autorisation de modifier est explicite. Collez son rapport JSON pour vérification humaine. Une réparation annoncée n’est pas un test réussi. L’export ne lance ni ne contacte automatiquement un Agent.

## Exécuter les vérifications

Lancez explicitement les commandes du projet et examinez commande, code de sortie et sortie brute. Un script absent reste non vérifié. N’exécutez que des projets fiables. Lecture, analyse statique et IA ne sont pas des preuves d’exécution ; lu indique seulement la progression de lecture.

## IA intégrée et utilisation

Connexion Google ou GitHub et modèle intégré uniquement : aucun sélecteur, clé personnelle ou endpoint personnalisé. Seul le travail IA demandé envoie le contexte choisi aux fournisseurs gérés. Les chemins courants de dépendances, compilation et identifiants sont exclus, sans garantie d’absence de secrets dans le code.

- [Espace API](introduction.md)
- [Revue de code](code-quality.md)
- [IA intégrée et utilisation](ai-models.md)
- [Offres et tâches](../cloud/billing.md)
- [Installer et démarrer](../overview/installation.md)
- [Comprendre chaque modification](../overview/quickstart.md)
