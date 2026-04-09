#!/bin/bash

# CI/CD Test Script - Local Development

set -e  # Exit on error

echo "🧪 Starting tests..."

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

FAILED_TESTS=0

# Test API Gateway
log_section "Testing API Gateway..."
cd "$PROJECT_ROOT/api-gateway"
npm install --ci
if npm test --if-present 2>/dev/null; then
    log_success "API Gateway tests passed"
else
    log_error "API Gateway tests failed"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

# Test Frontend
log_section "Testing Frontend..."
cd "$PROJECT_ROOT/frontend"
npm install --ci
if npm test --if-present 2>/dev/null; then
    log_success "Frontend tests passed"
else
    log_error "Frontend tests failed"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

# Test Services
log_section "Testing Services..."
for service in "$PROJECT_ROOT/services"/*/; do
    if [ -f "$service/package.json" ]; then
        service_name=$(basename "$service")
        log_section "  Testing $service_name..."
        cd "$service"
        npm install --ci
        if npm test --if-present 2>/dev/null; then
            log_success "$service_name tests passed"
        else
            log_error "$service_name tests failed"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    fi
done

# Summary
echo ""
if [ $FAILED_TESTS -eq 0 ]; then
    log_success "All tests passed!"
    exit 0
else
    log_error "$FAILED_TESTS test suite(s) failed"
    exit 1
fi
