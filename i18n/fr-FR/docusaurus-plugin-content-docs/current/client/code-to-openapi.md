---
title: "Générer OpenAPI à partir d’un projet existant"
description: "Générer OpenAPI à partir d’un projet existant"
---

# Générer OpenAPI à partir d’un projet existant

Dans l’application desktop, choisissez **Analyser le code vers OpenAPI** (bêta), sélectionnez un dossier de code local, puis **Lancer l’analyse**. Commencez par un petit service. Vérifiez les routes, paramètres et réponses détectés avant d’adopter la spécification générée.

Une analyse statique peut laisser les schémas de réponse indéterminés si les gestionnaires dépendent de code dynamique ou de dépendances indisponibles. « Confirmer manuellement » enregistre votre vérification ; cela ne reconstitue pas les types manquants. Modifiez le contrat API à partir d’éléments vérifiables ou demandez à l’IA d’examiner le gestionnaire sélectionné. Cette action envoie le code choisi et son contexte au fournisseur de modèle configuré.

Enregistrez le résultat dans un nouveau fichier. Ne remplacez pas un contrat existant sans examiner les modifications. Exécutez ensuite l’[exemple de contrat](/docs/fr-FR/client/contract-example/) sur un backend en cours d’exécution, ou connectez un [agent de programmation](/docs/fr-FR/client/coding-agent/). Une analyse réussie ne prouve pas la conformité de l’implémentation.

Ce flux est réservé à l’application desktop ; les langages et frameworks pris en charge varient selon l’analyseur. Aucune clé de modèle n’est nécessaire pour l’analyse statique. Considérez les résultats non résolus comme inconnus, et non comme des faits déduits.

[Télécharger l’application desktop](https://www.powerduck.com/fr/download/) · [Démarrage rapide](https://www.powerduck.com/docs/fr-FR/overview/quickstart/)
