---
sidebar_position: 4
title: Tests de scénario et rapports
description: "Enchaînez des appels API ordonnés avec transfert de données et assertions, exécutez-les via le CLI local et exportez un rapport HTML autonome en dix langues."
---

# Tests de scénario et rapports

Une requête unique ne prouve qu'un appel isolé. Un **test de scénario** prouve un flux de travail : une séquence de requêtes qui passe les valeurs d'une réponse aux requêtes suivantes et vérifie des assertions à chaque étape. Le scénario capture les flux de bout en bout qui vivaient seulement dans la tête des développeurs.

## Construire un scénario

- Des **étapes ordonnées**, chacune référençant une opération de la spécification.
- Un **transfert de données** entre étapes — par exemple extraire l'`id` d'une ressource créée pour l'utiliser ensuite.
- Des **assertions** sur les codes d'état, en-têtes de réponse et champs de réponse.
- Les valeurs que le lecteur doit fournir avant exécution.

L'ordre et les assertions sont de premier ordre et ne sont pas silencieusement abandonnés à l'exécution.

## Exécuter un scénario

Le scénario s'exécute dans le processus principal via le moteur `runScenario` de `@powerduck/openapi-cli`.

- `scenario:run` lance l'exécution avec scénario, spécification et réglages de requête.
- La progression est diffusée via `scenario:event` au fil des étapes.
- `scenario:cancel` interrompt une exécution en cours.

Vous observez chaque étape, voyez où le flux échoue et pouvez annuler les longues exécutions.

## Comment l'assistant construit les scénarios

L'assistant ne fabrique pas de définitions de test à l'intérieur de la spécification. Les scénarios sont des flux hôte autonomes et **ne sont pas stockés dans le document OpenAPI** — pas de clé `x-scenarios`, pas d'étapes intégrées.

Quand vous demandez à la fois la conception d'opérations et des tests, le travail est ordonné.

1. L'assistant propose d'abord **uniquement le correctif d'opérations**.
2. Après application, il renvoie une **carte action** qui exécute le flux :
   - `test.single` pour une opération unique.
   - `scenario.plan` pour que l'hôte découvre un flux de bout en bout.
   - `scenario.run` pour préparer et exécuter le flux ordonné.

La carte `scenario.run` liste les opérations dans l'ordre d'exécution (2 à 8), avec les champs de réponse, en-têtes et états transmis à chaque requête suivante, et décrit l'objectif. Chaque référence est copiée telle quelle depuis la spécification courante.

## Rapports

Après exécution, vous pouvez exporter un **rapport HTML autonome**. Ce n'est pas la sortie brute du CLI, mais un document de synthèse qui présente le flux, le résultat de chaque étape, les assertions et le résultat final dans une mise en page lisible.

À l'export, choisissez la langue ; dix langues sont intégrées.

1. English
2. 简体中文 (chinois simplifié)
3. 繁體中文 (chinois traditionnel)
4. 日本語 (japonais)
5. 한국어 (coréen)
6. Français
7. Deutsch (allemand)
8. Español (espagnol)
9. Português — Brasil (portugais — Brésil)
10. العربية (arabe)

Une option **Autre/personnalisé** permet de saisir directement une langue.

Le rapport est partageable en sécurité.

- Les **identifiants sont masqués automatiquement**, donc jetons et clés n'apparaissent pas.
- Les **grosses charges utiles sont repliées** pour garder le rapport lisible au lieu de tout coller.

Le HTML est autonome : vous pouvez le joindre à un ticket ou l'archiver à chaque version.

## Quand utiliser les scénarios

- Vérifier des flux métier à plusieurs étapes (créer, lire, mettre à jour, supprimer).
- Confirmer que l'authentification et le passage de jetons fonctionnent entre appels.
- Produire une preuve du comportement de l'API pour une version ou un transfert.
- Régression des flux après un changement de contrat.

Voir aussi : [Espace de travail de requête](./debug.md)、[Concevoir avec l'assistant](./design.md)、[Serveur de simulation](./mock-server.md).
