---
sidebar_position: 7
title: Serveur de simulation local
description: "Exécutez une simulation locale de votre API OpenAPI en choisissant port, chemin de base, latence et substitutions de réponse, et inspectez les requêtes reçues."
---

# Serveur de simulation local

Le serveur de simulation fournit un clone fonctionnel de votre API directement depuis la spécification, pour faire avancer le travail frontend et client avant que le backend soit prêt. Aucune infrastructure externe à monter ; il s'exécute dans le processus principal du bureau.

## Démarrer une simulation

Vous pouvez la lancer depuis le mode serveur de simulation ou directement dans le chat IA ; depuis le chat, l'application confirme l'adresse du service.

Options disponibles.

| Option | Plage/forme | Usage |
|---|---|---|
| `port` | entier `1`–`65535` | Port local à écouter |
| `basePath` | préfixe de chemin URL | Servir sous un chemin de base |
| `latencyMs` | `0`–`10000` | Délai artificiel pour imiter la latence réseau |
| `overrides` | jusqu'à 100 substitutions de réponse | Renvoyer une réponse précise pour des opérations choisies |

Les valeurs de port ou de latence invalides sont rejetées avec un message clair, sans lancer un serveur cassé.

## Plusieurs simulations

Vous pouvez exécuter plusieurs simulations en parallèle — par exemple une par document ouvert. L'application liste les simulations actives (`mock:list`) et peut en arrêter individuellement (`mock:stop`). Chacune est liée à un identifiant et un nom de document.

## Inspecter les requêtes reçues

La simulation enregistre les requêtes reçues ; vous pouvez les consulter (`mock:requests`, limite optionnelle) et effacer le journal. Cela aide à vérifier que le client appelle les bonnes opérations avec les paramètres attendus, même sans backend réel.

## Substitutions de réponse

Quand les exemples par défaut ou les réponses dérivées du schéma ne suffisent pas, les substitutions renvoient une réponse choisie pour des opérations précises. Un plafond (100 au maximum) garde la configuration prévisible.

## Quand l'utiliser

- Débloquer le développement frontend sur un contrat encore en construction.
- Reproduire des situations lentes ou des cas limites en ajustant latence et réponses.
- Démontrer des flux API sans environnement déployé.
- Vérifier qu'un client généré appelle les opérations comme prévu.

La simulation lit la même spécification que tous les autres modes, donc elle reste alignée sur le contrat quand la conception change.

Voir aussi : [Tests de scénario](/docs/client/scenario-testing)、[Concevoir avec l'assistant](/docs/client/design).
