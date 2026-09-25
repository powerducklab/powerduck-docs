---
sidebar_position: 9
title: Réglages
description: "Configurez l'apparence et la langue, le comportement des requêtes, les proxys, TLS et certificats clients, le terminal intégré, ainsi que les actions fichiers/ shell."
---

# Réglages

Les réglages du client de bureau couvrent l'apparence de l'application et la façon dont les requêtes sont envoyées. Les préférences au niveau application restent séparées des modifications du document API : changer de thème ou configurer un proxy ne modifie pas le contrat.

## Apparence

- **Thème** — basculez entre clair et sombre (`theme.get`, `theme.set`) ; le changement s'applique à toute l'application et est persisté.
- **Langue de l'interface** — choisissez parmi dix langues ou suivez le système automatiquement.

| | | |
|---|---|---|
| English (US) | 简体中文 | 繁體中文 |
| 日本語 | 한국어 | Français |
| Deutsch | Español | Português (Brasil) |
| العربية | | |

L'arabe se rend de droite à gauche. Le choix `auto` suit la langue du système.

## Comportement des requêtes

Ces réglages contrôlent les requêtes sortantes dans l'espace de travail de requête et les scénarios.

- **Délai d'expiration** (`requestTimeoutMs`) — en millisecondes ; `0` signifie illimité.
- **SSL strict** (`strictSSL`) — vérification des certificats TLS ; désactivable pour les serveurs à certificat auto-signé ou non fiable.
- **Suivre les redirections** (`followRedirects`) et **redirections maximales** (`maxRedirects`).
- **Version HTTP** (`protocolVersion`) — `http1`, `http2`, `auto`.
- **Désactiver les cookies** (`disableCookies`) — coupe la gestion des cookies de requête.

## Proxy

Configurez un proxy sortant via un mode (`off`, `system`, `custom`).

- `off` — aucun proxy.
- `system` — suit le proxy du système d'exploitation.
- `custom` — utilise une URL de proxy, avec nom d'utilisateur, mot de passe et liste de contournement optionnels.

La liste de contournement accepte hôtes et motifs (par ex. `localhost,127.0.0.1`, hôtes à jokers). Le mot de passe du proxy est accessible en écriture mais pas en lecture, et se vide avec une valeur vide.

## TLS et certificats clients

Pour les environnements nécessitant une confiance personnalisée ou un TLS mutuel :

- **CA personnalisée** — activez et donnez le chemin d'un certificat CA pour que les requêtes fassent confiance à une racine interne ou auto-signée.
- **Certificat client (mTLS)** — configurez un certificat par hôte : paire certificat/clé ou PFX, avec phrase secrète optionnelle ; la portée est déterminée par hôte et port.

Les certificats peuvent être ajoutés, supprimés par identifiant ou entièrement vidés. Les phrases secrètes sont en écriture seule et ne sont pas renvoyées.

## Terminal intégré

L'application comporte un panneau terminal en bas.

- `terminal.open` affiche le panneau ; avec `{"cwd":"document"}`, il s'ouvre dans le dossier du document courant, que l'hôte résout en chemin absolu réel.
- `terminal.run` entre une commande shell explicite après une carte de confirmation et l'exécute.

Une commande ne s'exécute que quand vous la demandez explicitement ; afficher le panneau n'exécute rien.

## Actions fichiers et shell

- `shell.revealFile` — affiche le document courant (ou un chemin donné) dans le gestionnaire de fichiers système.
- `shell.openPath` — ouvre un fichier avec l'application par défaut.
- `shell.openExternal` — ouvre une page tierce externe dans le navigateur système.

Les pages officielles Powerduck utilisent un outil de lien dédié (`app.officialLink`) pour rendre une carte dans la conversation sans quitter l'application.

## Exemples de code client

Pour toute opération, l'assistant peut générer du code client exécutable (`clientcode.generate`), présenté sur une carte de code avec bascule de langue et de bibliothèque client : C, C#, Go, Java, JavaScript, Node, Kotlin, PHP, Python, Ruby, Rust, shell, Swift, etc. Le code s'affiche sur une carte, pas collé dans la conversation.

## Changer les réglages via l'assistant

Les demandes au niveau application — bascule thème/langue, configurer un proxy, ignorer une erreur de certificat, changer de version HTTP — sont traitées par les outils de réglages, pas comme des problèmes de conception API. Les changements de réglages demandent confirmation avant application.

Voir aussi : [IA et modèles](/docs/client/ai-models)、[Espace de travail de requête](/docs/client/debug).
