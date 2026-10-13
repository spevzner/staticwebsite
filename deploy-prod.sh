#!/usr/bin/env bash
# Pull the latest pushed image and restart it on the production host (AWS).
# Prereq: verify the change on staging first, then run ./deploy.sh so :latest
# in GHCR is what you want deployed.
set -euo pipefail

HOST="ec2-user@44.199.165.106"   # Elastic IP (eipalloc-00fc52a44e61eb23d)
KEY="$HOME/.ssh/linguaglobe-deploy.pem"

# Compose + Caddy config live in the repo; push them so the host matches.
scp -i "$KEY" docker-compose.yml Caddyfile "$HOST":~/
ssh -i "$KEY" "$HOST" 'docker compose pull && docker compose up -d --remove-orphans'
ssh -i "$KEY" "$HOST" 'curl -sI http://localhost/' | head -1

echo "Production deployed: https://linguaglobe.org/"
