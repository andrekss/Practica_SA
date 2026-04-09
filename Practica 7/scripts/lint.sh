#!/bin/bash

# CI/CD Lint Script - Local Development

set -e

echo "🔍 Starting linting..."

# Helper functions
log_section() {
    echo -e "\033[1;33m$1\033[0m"
}

log_success() {
    echo -e "\033[0;32m✓ $1\033[0m"
}

log_error() {
    echo -e "\033[0;31m❌ $1\033[0m"
}

# Directories
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

FAILED_LINTS=0

# Lint API Gateway
log_section "Linting API Gateway..."
cd "$PROJECT_ROOT/api-gateway"
npm install --ci
if npm run lint --if-present 2>/dev/null; then
    log_success "API Gateway lint passed"
else
    log_error "API Gateway lint failed"
    FAILED_LINTS=$((FAILED_LINTS + 1))
fi

# Lint Frontend
log_section "Linting Frontend..."
cd "$PROJECT_ROOT/frontend"
npm install --ci
if npm run lint --if-present 2>/dev/null; then
    log_success "Frontend lint passed"
else
    log_error "Frontend lint failed"
    FAILED_LINTS=$((FAILED_LINTS + 1))
fi

# Lint Services
log_section "Linting Services..."
for service in "$PROJECT_ROOT/services"/*/; do
    if [ -f "$service/package.json" ]; then
        service_name=$(basename "$service")
        log_section "  Linting $service_name..."
        cd "$service"
        npm install --ci
        if npm run lint --if-present 2>/dev/null; then
            log_success "$service_name lint passed"
        else
            log_error "$service_name lint failed"
            FAILED_LINTS=$((FAILED_LINTS + 1))
        fi
    fi
done

# Summary
echo ""
if [ $FAILED_LINTS -eq 0 ]; then
    log_success "All lints passed!"
    exit 0
else
    log_error "$FAILED_LINTS linting check(s) failed"
    exit 1
fi
