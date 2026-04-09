#!/bin/bash

# Deploy to Kubernetes locally (Kind or Minikube)

set -e

echo "🚀 Deploying to local Kubernetes..."

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
NAMESPACE="${1:-microservices}"
ENV="${2:-staging}"

echo "📍 Namespace: $NAMESPACE"
echo "📍 Environment: $ENV"

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found"
    exit 1
fi

# Create namespace
echo "Creating namespace..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Check if helm is available
if command -v helm &> /dev/null; then
    echo "Deploying with Helm..."
    
    VALUES_FILE="$PROJECT_ROOT/k8s/values-${ENV}.yaml"
    if [ ! -f "$VALUES_FILE" ]; then
        echo "❌ Values file not found: $VALUES_FILE"
        exit 1
    fi
    
    helm upgrade --install microservices-$ENV \
      $PROJECT_ROOT/k8s \
      --namespace $NAMESPACE \
      --values $VALUES_FILE \
      --wait \
      --timeout 5m
else
    echo "⚠️  Helm not installed. Applying Kubernetes manifests manually..."
    kubectl apply -f $PROJECT_ROOT/k8s -n $NAMESPACE
fi

echo "✅ Deployment complete!"
echo "📊 Checking deployment status..."
kubectl get deployments -n $NAMESPACE
kubectl get services -n $NAMESPACE
