#!/bin/bash

# CI/CD Build Script - Local Development

set -e  # Exit on error

echo "🚀 Starting local build..."

# Check prerequisites
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directories
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Build API Gateway
echo -e "${YELLOW}Building API Gateway...${NC}"
cd "$PROJECT_ROOT/api-gateway"
npm install --ci
npm run build --if-present
echo -e "${GREEN}✓ API Gateway built${NC}"

# Build Frontend
echo -e "${YELLOW}Building Frontend...${NC}"
cd "$PROJECT_ROOT/frontend"
npm install --ci
npm run build --if-present
echo -e "${GREEN}✓ Frontend built${NC}"

# Build Services
echo -e "${YELLOW}Building Services...${NC}"
for service in "$PROJECT_ROOT/services"/*/; do
    if [ -f "$service/package.json" ]; then
        service_name=$(basename "$service")
        echo -e "${YELLOW}  → Building $service_name...${NC}"
        cd "$service"
        npm install --ci
        npm run build --if-present
        echo -e "${GREEN}  ✓ $service_name built${NC}"
    fi
done

echo -e "${GREEN}✅ Build complete!${NC}"
