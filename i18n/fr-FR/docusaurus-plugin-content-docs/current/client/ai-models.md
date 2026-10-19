---
sidebar_position: 8
title: IA et modèles
description: "Configurez un modèle compatible OpenAI, comprenez les transports bureau et web, le repli des appels d'outils et les données envoyées au fournisseur."
---

# IA et modèles

Powerduck vous laisse choisir et configurer le modèle de l'assistant. Sur le bureau, les requêtes passent par le processus principal vers le point d'accès choisi ; les modifications du document restent présentées dans des cartes à examiner.

## Apporter un modèle

Dans les réglages, configurez l'assistant vers n'importe quel point de terminaison Chat Completions **compatible OpenAI**.

- Choisissez un préréglage de fournisseur intégré ou définissez un fournisseur **personnalisé**.
- Fournissez un nom d'affichage, une URL de base, une clé API et un identifiant de modèle.
- Configurez plusieurs profils et choisissez entre eux.

Aucun fournisseur précis n'est imposé. Un point d'accès compatible OpenAI, auto-hébergé ou tiers, s'utilise de la même manière, ce qui permet aux équipes de respecter leur propre politique de modèles.

## Fonctions avancées et repli élégant

Chaque profil possède une option **fonctions avancées**, activée par défaut.

- Activée, l'application utilise l'**appel de fonction natif** du modèle : elle envoie le catalogue d'outils sur le réseau et laisse le modèle choisir et appeler directement le bon outil.
- Si un point de terminaison refuse les arguments d'outils natifs — petits modèles sans support outil — ce point de terminaison est mémorisé et une seule nouvelle tentative suit via un **protocole de repli basé contenu**.

Le repli améliore la compatibilité sans garantir le succès : des erreurs réseau, d'authentification ou de modèle restent possibles. Désactivez les fonctions avancées pour un profil qui doit toujours utiliser le mode de base.

L'utilisation des outils est bornée : l'agent effectue un nombre limité de cycles, trois par défaut, et déduplique les appels répétés pendant une même exécution.

## Pourquoi acheminer les requêtes via le processus principal

Sur le client de bureau, la requête complète est émise depuis le **processus principal Node**, pas la WebView. Deux avantages concrets.

- **Aucun mur CORS navigateur.** Les restrictions cross-origin du web ne bloquent pas les appels au point de terminaison du modèle.
- **La requête HTTP s'exécute hors du renderer.** Son panneau réseau n'affiche pas l'échange HTTP du processus principal. Cela ne garantit pas l'absence d'instructions ou de clés dans la mémoire du renderer, les journaux ou d'autres outils de développement.

La passerelle de bureau valide la structure des requêtes et limite les ressources :

- Seules les URL HTTP(S) sont acceptées ; les noms et valeurs d'en-têtes, la taille du corps, les délais et les requêtes simultanées sont contrôlés. Les points d'accès locaux et privés sont autorisés. Il ne s'agit ni d'une liste d'hôtes autorisés ni d'une garantie de confidentialité du fournisseur ;
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

- Les instructions, le contexte sélectionné, les descriptions d'outils et les identifiants sont envoyés au point d'accès du modèle configuré. Un fournisseur hébergé reçoit ces données ; utilisez un point d'accès local de confiance si votre politique exige une inférence locale ;
- C'est l'hôte déterministe, pas le modèle, qui valide et applique chaque changement.
- Toutes les écritures reçoivent votre approbation avant exécution.

Voir aussi : [Concevoir avec l'assistant](./design.md)、[Réglages](./settings.md)、[Contrôle d'accès Cloud](../cloud/access-control.md).
