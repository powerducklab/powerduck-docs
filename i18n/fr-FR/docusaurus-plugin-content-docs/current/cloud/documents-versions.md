---
sidebar_position: 3
title: Documents et versions
description: "Les documents vivent sous les projets avec un cycle de vie clair. Chaque changement crée une nouvelle version immuable, et les sources incluent téléversement et synchronisation Git."
---

# Documents et versions

Un document est la représentation hébergée d'une seule API. Il appartient à un projet de l'organisation et accumule des versions dans le temps au lieu d'écraser.

## La hiérarchie

```text
Organization -> Project -> Document -> Versions
```

Un document peut être créé directement sous l'organisation ou dans un projet, et est listé par projet et organisation.

## Cycle de vie des états

Le document passe par quatre états.

| État | Sens | Service public |
|---|---|---|
| `ACTIVE` | En ligne | Documentation et MCP servis (selon indicateurs) |
| `PAUSED` | En pause | Services publics indisponibles |
| `ARCHIVED` | Conservé mais non courant | Non servi |
| `DELETED` | Suppression douce | Non servi |

Transitions autorisées :

```text
pause:    ACTIVE  -> PAUSED
resume:   PAUSED  -> ACTIVE
archive:  ACTIVE / PAUSED -> ARCHIVED
restore:  ARCHIVED -> ACTIVE
delete:   ACTIVE / PAUSED / ARCHIVED -> DELETED
```

La pause est le moyen le plus rapide de couper puis reprendre ; l'archivage garde l'historique mais ne traite plus le document comme courant ; la suppression est douce, donc les données centrales ne sont pas détruites immédiatement.

## Les versions sont immuables

Quand la spécification change, créez une nouvelle version ; l'original n'est jamais remplacé.

```text
v1 -> v2 -> v3 -> v4
```

Chaque version enregistre :

- La **clé de stockage** du fichier dans le stockage objet.
- Le checksum **SHA-256**.
- Type de contenu, taille et heure de création.

Cela soutient historique, retour arrière, comparaison et régénération documentation/MCP pour une version précise.

### Liens courants versus liens fixés par version

- Les liens pointant vers le document **courant** suivent la dernière version.
- Les liens **fixés par version** référencent une version précise et ne changent pas sous le lecteur.

Utilisez les liens fixés quand les notes de version ou contrats exigent une référence immuable, et les liens courants quand il faut toujours le dernier.

## Sources

Le contenu vient d'une source, abstraite pour que téléversement et Git ne soient pas codés en dur dans le modèle document.

- **Upload** — ajout direct de fichier.
- **Git** — connexion d'un dépôt par URL, branche et chemin de fichier.

La source Git suit l'activation de synchronisation et la dernière synchronisation.

- **Connectez** avec URL de dépôt et chemin de fichier (choix de branche).
- **Synchronisez** à la demande pour récupérer le dernier contenu comme nouvelle version.

Les métadonnées de source restent avec le document, pour toujours savoir s'il vient d'un téléversement ou d'un dépôt et voir la dernière synchronisation.

## Stockage

Les fichiers réels vivent dans le stockage objet selon une organisation organisation/document/version, et la base ne garde que les métadonnées (clé de stockage, checksum, type de contenu, taille). Les fichiers ne sont pas lisibles publiquement par défaut dans le stockage ; l'accès public passe par les chemins publiés du document.

## Pourquoi ça compte

La combinaison de versions immuables et d'un cycle de vie à suppression douce permet d'itérer vite sans perdre l'historique et de ne pas exposer par erreur un document que vous vouliez arrêter. Pause pour interruption temporaire, archive pour conservation longue, liens fixés quand l'immuabilité compte.

Voir aussi : [Opérations exposées](./exposure)、[Contrôle d'accès](./access-control)、[Domaines personnalisés](./custom-domains).
