#!/usr/bin/env bash
# Pull the latest pushed image and restart it on the production host (AWS).
# Prereq: verify the change on staging first, then run ./deploy.sh so :latest
# in GHCR is what you want deployed.
set -euo pipefail

HOST="ec2-user@3.95.6.145"
KEY="$HOME/.ssh/linguaglobe-deploy.pem"

ssh -i "$KEY" "$HOST" 'docker compose pull && docker compose up -d'
ssh -i "$KEY" "$HOST" 'curl -sI http://localhost/' | head -1

echo "Production deployed: http://linguaglobe.org/"
