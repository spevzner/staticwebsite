#!/usr/bin/env bash
# Pull the latest pushed image and restart it on the staging host (LAN).
# Prereq: run ./deploy.sh first so :latest in GHCR is what you want deployed.
set -euo pipefail

# Static IP configured on the VM itself (outside the router's DHCP pool, which
# starts at .6), so it doesn't depend on DHCP reservations or LAN name resolution.
HOST="prodhost@192.168.1.4"

ssh "$HOST" 'docker compose pull && docker compose up -d'
ssh "$HOST" 'curl -sI http://localhost/' | head -1

echo "Staging deployed: http://192.168.1.4/"
