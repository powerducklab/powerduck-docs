---
sidebar_position: 8
title: IA et modèles
description: "Connectez un modèle compatible OpenAI, gardez invites et clés en local via le processus principal, utilisez l'appel de fonction natif avec repli automatique, et conservez le même flux de travail sur le web."
---

# IA et modèles

La capacité de l'assistant dépend du modèle sous-jacent, donc Powerduck ne vous enferme pas chez un fournisseur précis. Vous choisissez et configurez le modèle, l'application l'appelle via un chemin local sûr, et chaque changement passe par les mêmes cartes révisables.

## Apporter un modèle

Dans les réglages, configurez l'assistant vers n'importe quel point de terminaison Chat Completions **compatible OpenAI**.

- Choisissez un préréglage de fournisseur intégré ou définissez un fournisseur **personnalisé**.
- Fournissez un nom d'affichage, une URL de base, une clé API et un identifiant de modèle.
- Configurez plusieurs profils et choisissez entre eux.

L'application ne suppose pas que le modèle vient d'un fournisseur précis. Les points de terminaison auto-hébergés ou tiers compatibles OpenAPI fonctionnent pareil, ce qui compte pour les équipes ayant leur propre stratégie de modèles.

## Fonctions avancées et repli élégant

Chaque profil possède une option **fonctions avancées**, activée par défaut.

- Activée, l'application utilise l'**appel de fonction natif** du modèle : elle envoie le catalogue d'outils sur le réseau et laisse le modèle choisir et appeler directement le bon outil.
- Si un point de terminaison refuse les arguments d'outils natifs — petits modèles sans support outil — ce point de terminaison est mémorisé et une seule nouvelle tentative suit via un **protocole de repli basé contenu**.

L'objectif est de toujours renvoyer un résultat : les modèles puissants empruntent le chemin natif précis, les modèles sans outil sont rétrogradés vers un protocole plus simple au lieu d'échouer le tour. Vous pouvez désactiver les fonctions avancées pour les profils devant toujours utiliser le chemin de base.

Le travail piloté par outils a aussi des limites : l'agent exécute un nombre borné de tours d'outils (3 par défaut) et déduplique les appels pour qu'un outil ne tourne pas deux fois en boucle.

## Pourquoi acheminer les requêtes via le processus principal

Sur le client de bureau, la requête complète est émise depuis le **processus principal Node**, pas la WebView. Deux avantages concrets.

- **Aucun mur CORS navigateur.** Les restrictions cross-origin du web ne bloquent pas les appels au point de terminaison du modèle.
- **Invites et clés hors de la console navigateur.** L'URL de requête, les en-têtes d'authentification, l'invite système et la liste d'outils n'apparaissent pas dans le panneau réseau du renderer.

La passerelle est délibérément restreinte, pas un proxy ouvert.

- Elle valide les destinations (bouclage et hôtes autorisés), assainit les en-têtes et empêche l'injection de sauts de ligne via les en-têtes de réponse.
- Les requêtes sont annulables (`ai:cancel`).

## Bureau et web

Le même assistant fonctionne dans les deux environnements d'exécution, avec le chemin adapté à chacun.

- **Bureau (Electron) :** les capacités sont importées et exécutées en local, et la requête complète est proxifiée via le processus principal.
- **Web :** le même flux de travail s'exécute en HTTP, en appelant les API du service au lieu des modules locaux.

C'est pourquoi l'application conserve un chemin compatible web en plus du chemin Electron. Le traitement de l'intention et la présentation des cartes sont identiques ; seul le transport change selon l'environnement.

## Comment l'intention est identifiée

L'intention n'est pas gérée en listant des mots-clés par fonction. L'application présente plutôt au modèle un **catalogue d'outils** clair et bien décrit — ID de chaque outil, arguments et situation exacte d'usage. Le modèle choisit le meilleur outil dans le catalogue, l'hôte déterministe le valide et l'exécute, et les écritures demandent confirmation.

Ajouter une capacité signifie donc ajouter un outil au catalogue (avec une description précise), pas maintenir de plus longues listes de mots-clés. Le même catalogue est partagé avec les agents externes via le serveur MCP, afin que les capacités s'alignent entre le produit et d'autres outils.

## Confidentialité

- Sur le bureau, les clés API et les invites restent en local et ne sont pas exposées au renderer.
- C'est l'hôte déterministe, pas le modèle, qui valide et applique chaque changement.
- Toutes les écritures reçoivent votre approbation avant exécution.

Voir aussi : [Concevoir avec l'assistant](./design)、[Réglages](./settings)、[Contrôle d'accès Cloud](../cloud/access-control).
