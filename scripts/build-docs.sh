#!/usr/bin/env bash
#
# Build every locale of the Powerduck docs and sync the static output into the
# website repository (website/docs) that Amplify hosts.
#
# Docusaurus emits one multi-locale production build in a single run:
#   - English pages at the build root
#   - each other locale under build/<locale>/
#
# Usage:
#   scripts/build-docs.sh             # clear, build all locales, sync
#
# Override the target through an environment variable:
#   DOCS_TARGET=/path/to/website/docs scripts/build-docs.sh
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCS_TARGET="${DOCS_TARGET:-$ROOT_DIR/../website/docs}"

cd "$ROOT_DIR"

echo "==> [1/4] Clearing previous build"
npx docusaurus clear

echo "==> [2/4] Building all locales"
npx docusaurus build

echo "==> [3/4] Ensuring gtag is present on every page (redirect shells included)"
node "$ROOT_DIR/scripts/inject-ga.mjs" "$ROOT_DIR/build"

echo "==> [4/4] Syncing build -> $DOCS_TARGET"
mkdir -p "$DOCS_TARGET"
rsync -a --delete "$ROOT_DIR/build/" "$DOCS_TARGET/"

echo "Docs built and synced to $DOCS_TARGET"
