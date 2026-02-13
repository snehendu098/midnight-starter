#!/usr/bin/env bash
# Syncs tracked files from sibling dirs into templates/
# Run before npm publish

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATES_DIR="$SCRIPT_DIR/templates"

SOURCES=("midnight-local-network" "midnight-starter-template")

# clean
rm -rf "$TEMPLATES_DIR"
mkdir -p "$TEMPLATES_DIR"

for src in "${SOURCES[@]}"; do
  SRC_DIR="$REPO_ROOT/$src"

  if [ ! -d "$SRC_DIR" ]; then
    echo "Error: $SRC_DIR not found"
    exit 1
  fi

  echo "Syncing $src..."

  # copy only git-tracked files
  cd "$SRC_DIR"
  git ls-files -z | while IFS= read -r -d '' file; do
    dest="$TEMPLATES_DIR/$src/$file"
    mkdir -p "$(dirname "$dest")"
    cp "$file" "$dest"
  done
done

# remove artifacts that shouldn't ship
echo "Cleaning artifacts..."

find "$TEMPLATES_DIR" -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find "$TEMPLATES_DIR" -name ".DS_Store" -delete 2>/dev/null || true
find "$TEMPLATES_DIR" -name ".idea" -type d -exec rm -rf {} + 2>/dev/null || true

# deployment-specific state
rm -f "$TEMPLATES_DIR/midnight-starter-template/counter-contract/deployment.json"
rm -f "$TEMPLATES_DIR/midnight-starter-template/counter-contract/deployment-voting.json"

# build artifacts & runtime data
rm -rf "$TEMPLATES_DIR"/*/dist
rm -rf "$TEMPLATES_DIR"/*/midnight-level-db
rm -rf "$TEMPLATES_DIR"/midnight-starter-template/*/dist
rm -rf "$TEMPLATES_DIR"/midnight-starter-template/*/midnight-level-db

echo "Done. Templates synced to $TEMPLATES_DIR"
