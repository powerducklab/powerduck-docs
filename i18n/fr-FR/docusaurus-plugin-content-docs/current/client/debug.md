---
sidebar_position: 3
title: Espace de travail de requête et environnements
description: "Envoyez de vraies requêtes dans des onglets, gérez les variables entre portées et comprenez la relation entre les environnements personnalisés et les servers déclarés dans le document OpenAPI."
---

# Espace de travail de requête et environnements

L'espace de travail de requête est l'endroit où les opérations que vous concevez deviennent de vrais appels. Vous envoyez des requêtes via le processus principal local, affichez les réponses et gérez les valeurs changeant à chaque exécution avec environnements et variables.

## Envoyer une requête

1. Ouvrez une opération dans l'espace de travail de requête. Méthode, chemin, paramètres, en-têtes et corps sont tirés de la spécification.
2. Renseignez les valeurs nécessitant une entrée concrète, comme les paramètres de chemin ou un jeton.
3. Envoyez. L'onglet affiche le code d'état, les en-têtes de réponse, le corps de réponse et la durée.
4. Gardez plusieurs requêtes dans des **onglets** pour comparaison ou revérification.

L'exécution se produit dans le processus principal, pas la WebView : les restrictions CORS directes du navigateur ne bloquent pas les appels, et les détails de requête ne sont pas exposés via le panneau réseau du navigateur.

## Environnements versus servers OAS

Ils sont liés mais distincts ; comprendre la différence élimine une source fréquente de confusion.

| | Environnements personnalisés | `servers` OAS |
|---|---|---|
| Emplacement | Réglages locaux de l'application | Dans le document OpenAPI |
| Modifiables par l'outil de requête | Oui | Non — changent par correctif de spécification |
| Usage | URL de base par défaut des nouveaux onglets et exécutions de scénario | URL de base déclarées par le contrat lui-même |
| Partagés avec la documentation | Non | Oui |

Quand l'assistant liste les URL de base (`env.listServers`), il renvoie d'abord les environnements personnalisés utilisables, puis les servers en lecture seule déclarés dans le document courant.

- **Ajouter ou choisir une URL de base locale** crée et active un environnement personnalisé (`env.upsertServer`, `env.selectServer`) ; cela n'édite pas le document.
- **Changer les servers dans le contrat** propose à la place un correctif de spécification.

Cela garde les URL de débogage personnelles hors du contrat, tout en laissant les servers déclarés piloter aussi les requêtes.

## Variables

Les variables sont gérées sur quatre portées.

- **globals** — disponibles dans toutes les collections.
- **collection** — s'appliquent à une collection.
- **environment** — liées à l'environnement courant ; sans server précis, s'appliquent à tous les servers.
- **local** — réservées à la session locale.

L'assistant liste les variables (`env.listVariables`, filtrables par portée) et les crée ou met à jour (`env.setVariable`, upsert par nom et portée). Une variable peut être liée à un server précis et possède un état actif propre. La configuration des variables est une action de l'application, pas une modification du document API.

Il est courant d'y placer les jetons d'accès, les identifiants réutilisés entre appels ou les drapeaux de fonctionnalité.

## Quand il n'y a pas d'URL de base

Une requête nécessite une URL complète. Si ni les `servers` du document ni l'environnement courant ne fournissent d'URL de base, l'application ne devine pas : elle demande la saisie avant l'exécution. Mieux vaut cela qu'appeler silencieusement le mauvais hôte.

## De la requête unique au flux

Une fois qu'un appel isolé fonctionne, l'étape naturelle suivante est d'enchaîner les appels pour passer une valeur de réponse à la requête suivante. C'est le rôle des [tests de scénario](./scenario-testing.md).

Voir aussi : [Concevoir avec l'assistant](./design.md)、[Tests de scénario](./scenario-testing.md)、[Réglages](./settings.md).
