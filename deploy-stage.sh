#!/usr/bin/env bash
# Pull the latest pushed image and restart it on the staging host (LAN).
# Prereq: run ./deploy.sh first so :latest in GHCR is what you want deployed.
set -euo pipefail

HOST="prodhost@192.168.1.23"

ssh "$HOST" 'docker compose pull && docker compose up -d'
ssh "$HOST" 'curl -sI http://localhost/' | head -1

echo "Staging deployed: http://192.168.1.23/"
