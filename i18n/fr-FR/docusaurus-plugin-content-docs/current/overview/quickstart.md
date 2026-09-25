---
sidebar_position: 3
title: Démarrage rapide
description: "En quelques minutes, parcourez la conception d'un point de terminaison, une requête réelle et la documentation rendue depuis votre fichier OpenAPI."
---

# Démarrage rapide

Ce court parcours traverse la boucle centrale : ouvrir une spécification, la modifier avec l'assistant IA, envoyer une requête et voir le résultat sous forme de documentation, en utilisant le même document OpenAPI partout.

## 1. Ouvrir une spécification

Lancez le client et ouvrez une spécification depuis n'importe quelle source prise en charge. Toutes passent par le même flux d'import et sont converties ou mises à niveau vers OpenAPI 3.2 :

- Un **fichier OpenAPI ou Swagger** sur le disque (Swagger 2.0, OpenAPI 3.0 / 3.1 mis à niveau).
- Une **collection Postman**.
- Une **commande cURL**.
- Un **dépôt Git**.
- Une **URL** pointant vers une spécification.

Vous pouvez aussi glisser-déposer un fichier directement dans l'espace de travail. Sans point de départ, demandez à l'assistant de créer un squelette initial à partir d'une courte description.

## 2. Demander à l'assistant d'ajouter un point de terminaison

Dans le chat, décrivez ce dont vous avez besoin. Par exemple :

> Ajoute un point de terminaison `GET /products` qui renvoie une liste paginée de produits.

L'assistant ne modifie pas directement le document ; il répond avec une **carte de correctif**. La carte montre l'opération à modifier et les chemins/ressources affectés. Vérifiez, puis choisissez **Appliquer** ou **Rejeter**. Rien n'atteint le document avant application.

Pour une demande large comme « construis une API e-commerce », l'assistant pose d'abord des questions de clarification, puis propose des correctifs concentrés sur 2 à 5 opérations à la fois.

## 3. Affiner une seule opération sans dérive

Ouvrez l'opération et affinez-la sur place — ajoutez un paramètre de requête ou étendez le schéma de réponse. En mode focus, l'assistant génère des correctifs fins qui ne touchent que les champs demandés et préserve tout le reste de l'opération. Cela évite de perturber ou d'écraser le travail existant lors d'éditions répétées sur la même API.

## 4. Envoyer une requête réelle

Passez à l'**espace de travail de requête** de l'opération et envoyez. La requête s'exécute via le processus principal local. La réponse, l'état, les en-têtes et la durée s'affichent à côté de l'opération, et vous pouvez utiliser des environnements et des variables pour les valeurs changeant à chaque exécution.

Si ni les `servers` de la spécification ni l'environnement actif ne fournissent d'URL de base, l'application ne devine pas : elle demande de saisir l'URL de base.

## 5. Voir la documentation

Ouvrez la **documentation** : la même spécification est rendue en documentation API lisible. Le visualiseur lit le document en direct, donc la documentation correspond toujours à ce que vous venez de concevoir.

## 6. Aller plus loin quand vous êtes prêt

- Enchaînez plusieurs requêtes avec les [tests de scénario](../client/scenario-testing) et exportez un rapport HTML.
- Lancez le [serveur de simulation local](../client/mock-server) pendant le développement du backend.
- Modélisez des API de streaming / RPC avec les [six protocoles](../client/protocols).
- Dérivez les tables, relations et SQL dans le [modèle de données](../client/data-model).
- Publiez la même spécification en ligne avec [Powerduck Cloud](../cloud/quickstart).

La boucle centrale est complète. Le reste de la documentation détaille chaque espace de travail.
