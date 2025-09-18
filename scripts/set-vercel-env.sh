#!/usr/bin/env bash
# scripts/set-vercel-env.sh
# Usage: bash scripts/set-vercel-env.sh
# Prereqs: `npm i -g vercel`, run `vercel login`, `vercel link` in project root.

set -euo pipefail

ENV_FILE="${1:-.env.production}"
TARGET_ENV="production"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ $ENV_FILE not found. Create it first."
  exit 1
fi

echo "🔐 Applying variables from $ENV_FILE to Vercel ($TARGET_ENV)…"
# Remove CR, ignore comments/blank lines, keep only KEY=VALUE
# Note: preserves values verbatim (incl. URLs, secrets)
while IFS='=' read -r KEY VALUE; do
  # skip empty or comments
  [[ -z "$KEY" ]] && continue
  [[ "$KEY" =~ ^# ]] && continue

  # strip surrounding quotes from VALUE if present
  CLEAN="${VALUE%\"}"
  CLEAN="${CLEAN#\"}"
  CLEAN="${CLEAN%\'}"
  CLEAN="${CLEAN#\'}"

  echo "→ $KEY"
  # Pipe the value into `vercel env add`
  # If the var exists already, Vercel will prompt to overwrite; we auto-confirm.
  printf "%s" "$CLEAN" | vercel env add "$KEY" "$TARGET_ENV" -y >/dev/null
done < <(sed -e 's/\r$//' "$ENV_FILE" | grep -v '^[[:space:]]*$')

echo "✅ Done. Deploy when ready (Vercel will pick up new env on next build)."
