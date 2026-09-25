---
sidebar_position: 6
title: Domaines personnalisés
description: "Liez un nom d'hôte (ou nom d'hôte et sous-chemin) à un document. Vérifiez la propriété via un enregistrement DNS TXT, puis servez documentation et MCP depuis votre domaine."
---

# Domaines personnalisés

Par défaut, les documents sont servis depuis l'adresse de partage Powerduck. Un domaine personnalisé affiche documentation et MCP sous **votre propre nom d'hôte** au lieu du lien partagé, important pour publier l'API sous votre marque.

C'est une fonctionnalité payante, disponible aux plans **Pro et Team** (vérifiée via l'autorisation `oas.custom_domain`).

## Liaison d'hôte entier versus sous-chemin

La liaison cible :

- **Hôte entier** — `api.example.com` sert un document à la racine.
- **Hôte et sous-chemin** — `example.com/v1` sert un document sous `/v1`.

La liaison par sous-chemin permet à un nom d'hôte de servir plusieurs documents.

```text
example.com/v1  -> document A
example.com/v2  -> document B
```

Cela évite la limite d'un nom d'hôte par document et prend en charge les chemins de base versionnés.

## Depuis le domaine personnalisé

Les mêmes modes disponibles à l'adresse de partage sont servis sous des chemins courts et stables sous le domaine lié.

| Mode | Hôte entier | Sous-chemin |
|---|---|---|
| Spécification courante | `/oas` | `/v1/oas` |
| Spécification fixée par version | `/v/:version/oas` | `/v1/v/:version/oas` |
| MCP | `/mcp` | `/v1/mcp` |

L'hôte résout à partir du nom d'hôte et du chemin de la requête pour router vers le document lié. Ces chemins gèrent les contrôles CORS préalables.

## Ajouter et vérifier un domaine

Le domaine n'est pas fiable avant vérification de propriété, donc le flux est clair.

1. **Ajoutez** un nom d'hôte (ou nom d'hôte et chemin) au document.
2. Le service renvoie la liaison et les **instructions DNS**.
3. Créez l'enregistrement DNS et **vérifiez**.
4. La liaison passe de en attente à vérifiée et le service démarre.

La confirmation de propriété utilise un **enregistrement TXT**.

| Champ | Valeur |
|---|---|
| Type d'enregistrement | `TXT` |
| Hôte | `_powerduck-challenge.<your-domain>` |
| Valeur | `powerduck-verify=<verification-token>` |

La vérification lit l'enregistrement TXT en DNS et compare le jeton à temps constant. Une liaison vérifiée reste vérifiée, pas besoin de reconfirmer.

### Exemple

Pour `api.example.com`, ajoutez un enregistrement TXT.

```text
_powerduck-challenge.api.example.com
TXT "powerduck-verify=<the-token-shown-for-the-binding>"
```

Puis choisissez **Vérifier** dans l'espace de travail document. Une fois rapporté vérifié, documentation et MCP sont servis depuis ce domaine (document actif et modes activés).

## Gérer les liaisons

- **Listez** les domaines liés au document, avec état et chemin de base.
- **Vérifiez** une liaison en attente après ajout de l'enregistrement DNS.
- **Supprimez** une liaison pour arrêter le service depuis ce domaine.

Changer les indicateurs d'accès invalide la résolution d'hôte en cache pour que les mises à jour prennent effet immédiatement sans servir d'anciennes liaisons.

## Les contrôles d'accès continuent de s'appliquer

Le domaine personnalisé n'est pas un contournement : les mêmes portes s'appliquent.

- Le document doit être `ACTIVE`.
- Chaque mode a son indicateur actif.
- Le mot de passe de consultation continue de protéger la doc, et la clé d'accès le MCP.

Voir [Contrôle d'accès](./access-control).

Voir aussi : [Documents et versions](./documents-versions)、[Facturation](./billing).
