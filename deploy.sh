#!/usr/bin/env bash
# Build the production image and push it to GHCR.
# Prereq: `docker login ghcr.io -u spevzner` with a PAT that has write:packages.
set -euo pipefail

IMAGE="ghcr.io/spevzner/english-with-americans"
TAG="${1:-$(git rev-parse --short HEAD)}"

docker build -t "$IMAGE:$TAG" -t "$IMAGE:latest" .
docker push "$IMAGE:$TAG"
docker push "$IMAGE:latest"

echo "Pushed $IMAGE:$TAG and $IMAGE:latest"
