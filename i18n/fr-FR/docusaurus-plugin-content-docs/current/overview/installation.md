---
sidebar_position: 2
title: "Installer et démarrer"
description: "Powerduck aide à comprendre les modifications produites par IA, à lire leur contexte et à décider des suites. Depuis l’accueil, ouvrez séparément l’espace API ou la revue de code dans l’application de bureau."
---

# Installer et démarrer

Téléchargez depuis le site officiel macOS Apple Silicon/Intel, Windows ou Linux AppImage. Vérifiez source et éditeur sans désactiver les protections. Connectez-vous sur le site puis revenez à l’application ; importez une définition API ou choisissez un projet. Le navigateur présente les flux API ; analyse locale et commandes nécessitent le bureau.

[Powerduck](https://www.powerduck.com/download.html)

## IA intégrée et utilisation

Connexion Google ou GitHub et modèle intégré uniquement : aucun sélecteur, clé personnelle ou endpoint personnalisé. Seul le travail IA demandé envoie le contexte choisi aux fournisseurs gérés. Les chemins courants de dépendances, compilation et identifiants sont exclus, sans garantie d’absence de secrets dans le code.

## Offres et tâches

Les nouvelles offres comptent séparément conversations/revues : Free 10/2 ; Starter $19/mois 300/20 ; Pro $39/mois 700/60 ; Max $99/mois 2 000/180. Free se renouvelle au début du mois UTC, les offres payantes selon la période de facturation. Aucun report. Prix final et taxes au paiement.

- [Espace API](../client/introduction.md)
- [Revue de code](../client/code-quality.md)
- [IA intégrée et utilisation](../client/ai-models.md)
- [Offres et tâches](../cloud/billing.md)
- [Installer et démarrer](installation.md)
- [Comprendre chaque modification](quickstart.md)

## macOS · Windows · Linux

macOS 11+ · Windows 10+ · Linux · Electron 37

- macOS: `.dmg` · `arm64` / `x64`
- Windows: NSIS `.exe` · SmartScreen
- Linux: `.AppImage` · `x64`

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```
