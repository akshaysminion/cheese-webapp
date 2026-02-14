#!/usr/bin/env bash
set -euo pipefail

# Deploy Vite app to Netlify using Netlify CLI via npx.
# Requires:
#   NETLIFY_AUTH_TOKEN
#   NETLIFY_SITE_ID

# Optional: load local env vars if present.
if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

if [[ -z "${NETLIFY_AUTH_TOKEN:-}" ]]; then
  echo "Missing NETLIFY_AUTH_TOKEN" >&2
  exit 1
fi
if [[ -z "${NETLIFY_SITE_ID:-}" ]]; then
  echo "Missing NETLIFY_SITE_ID" >&2
  exit 1
fi

npm ci
npm run build

npx -y netlify-cli@latest deploy --prod --dir dist --site "$NETLIFY_SITE_ID" --auth "$NETLIFY_AUTH_TOKEN"
