#!/bin/bash

# Docker build script for local development

set -e

echo "🐳 Building Docker images..."

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
REGISTRY="ghcr.io"
USERNAME="${DOCKER_USERNAME:-localhost}"
TAG="${1:-latest}"

echo "🏷️  Using tag: $TAG"

# API Gateway
echo "Building API Gateway..."
docker build \
  -t $REGISTRY/$USERNAME/api-gateway:$TAG \
  -f $PROJECT_ROOT/api-gateway/Dockerfile \
  $PROJECT_ROOT/api-gateway

# Frontend
echo "Building Frontend..."
docker build \
  -t $REGISTRY/$USERNAME/frontend:$TAG \
  -f $PROJECT_ROOT/frontend/Dockerfile \
  $PROJECT_ROOT/frontend

# Services
for service in $PROJECT_ROOT/services/*/; do
    service_name=$(basename "$service")
    if [ -f "$service/Dockerfile" ]; then
        echo "Building $service_name..."
        docker build \
          -t $REGISTRY/$USERNAME/$service_name:$TAG \
          -f "$service/Dockerfile" \
          "$service"
    fi
done

echo "✅ All Docker images built successfully!"
docker images | grep $REGISTRY | grep -E "(api-gateway|frontend|service)"
