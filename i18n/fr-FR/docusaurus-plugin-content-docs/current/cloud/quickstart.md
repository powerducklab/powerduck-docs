---
sidebar_position: 2
title: Démarrage rapide Cloud
description: "Connectez-vous, ajoutez une spécification par fichier, Git ou URL, choisissez les opérations exposées et ouvrez les liens documentation et MCP."
---

# Démarrage rapide Cloud

Ce parcours transporte une spécification de votre machine vers une page de documentation et un point de terminaison MCP partageables.

## 1. Se connecter

Sur la page de connexion, continuez avec **Google** ou **GitHub**. Après la poignée de main OAuth, Powerduck crée votre session et vous guide vers la console. Une organisation personnelle est créée automatiquement.

## 2. Ajouter une spécification

Depuis le dashboard, ajoutez une spécification via l'une des sources prises en charge.

- **Fichier** — téléversez directement un fichier OpenAPI.
- **Dépôt Git** — pointez un dépôt et choisissez branche et chemin de fichier.
- **URL** — importez une spécification depuis une URL.

Les documents OpenAPI 3.0/3.1 et Swagger existants sont mis à niveau, et les entrées cURL ou Postman sont converties avant enregistrement, avec aperçu possible.

### Fonctionnement du téléversement direct

Les gros fichiers sont téléversés directement vers le stockage objet, pas via l'API.

1. Créez le document.
2. L'application demande une **URL de téléversement** avec type de contenu et taille.
3. Le fichier est téléversé directement vers le stockage via l'URL pré-signée.
4. **Complétez** le téléversement et enregistrez version et SHA-256.

Le serveur API reste ainsi hors du chemin des grosses charges utiles.

## 3. Choisir les opérations exposées

Une fois la spécification prête, choisissez les opérations à rendre publiques, commutables individuellement ; le document d'origine ne change pas. Vous pouvez tout activer puis restreindre les interfaces internes/administratives.

## 4. Ouvrir les liens

Quand le document est actif, l'espace de travail document montre les adresses publiques.

- **Documentation** — documentation API rendue dans le visualiseur public.
- **MCP** — point de terminaison MCP Streamable HTTP géré.
- Les données de spécification d'origine sont aussi servies à une URL stable.

Par défaut, la documentation est active et n'est protégée que si vous ajoutez un mot de passe. La disponibilité MCP et la clé d'accès se configurent séparément.

## 5. Protéger l'accès si besoin

- Ajoutez **mot de passe de consultation** et durée de validité optionnelle à la documentation.
- Créez une **clé d'accès MCP** pour le point de terminaison.
- Mettez le document en pause pour couper les deux temporairement.

## 6. Itérer par versions

Quand l'API change, téléversez le nouveau contenu comme nouvelle version au lieu de remplacer l'ancienne. Les liens partagés peuvent suivre le document courant ou être fixés à une version précise, pour que les liens ne changent pas sous les lecteurs.

## Étapes suivantes

- [Documents et versions](./documents-versions)
- [Opérations exposées](./exposure)
- [Contrôle d'accès](./access-control)
- [Domaines personnalisés](./custom-domains)
