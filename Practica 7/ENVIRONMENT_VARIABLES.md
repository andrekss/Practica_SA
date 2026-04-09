# Environment Variables Reference

## GitHub Secrets Required

```
GITHUB_TOKEN              (auto-generated, no action needed)
DOCKERHUB_USERNAME        (your Docker Hub username)
DOCKERHUB_TOKEN           (Docker Hub PAT - Personal Access Token)
KUBE_CONFIG_STAGING       (base64 of ~/.kube/config for staging)
KUBE_CONFIG_PRODUCTION    (base64 of ~/.kube/config for production)
SONARCLOUD_TOKEN          (SonarCloud token, optional)
HELM_REPO                 (URL to your Helm repository)
DOMAIN                    (Your domain, e.g., myapp.com)
```

## How to Generate Each Secret

### 1. DOCKERHUB_USERNAME
```bash
# Your Docker Hub username (e.g., "myusername")
echo "myusername"
```

### 2. DOCKERHUB_TOKEN
1. Go to https://hub.docker.com/settings/security
2. Click "New Personal Access Token"
3. Name it: `github-actions`
4. Permissions: Read, Write, Delete
5. Generate and copy the token

### 3. KUBE_CONFIG_STAGING
```bash
# macOS/Linux
cat ~/.kube/config | base64 -w 0 | pbcopy

# Windows PowerShell
$config = Get-Content -Path $env:USERPROFILE\.kube\config -Raw
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($config)) | Set-Clipboard
```

### 4. KUBE_CONFIG_PRODUCTION
Same as STAGING but for production cluster

### 5. SONARCLOUD_TOKEN (Optional)
1. Visit https://sonarcloud.io
2. Click your profile → Account
3. Security tab
4. Generate token
5. Copy it

### 6. HELM_REPO
```
https://your-helm-repository-url.com/
```

### 7. DOMAIN
```
example.com
```

## Local Environment Variables

Create a `.env` file (DO NOT COMMIT):

```bash
# Docker
DOCKER_USERNAME=myusername
DOCKER_PASSWORD=mytoken
REGISTRY=ghcr.io

# Kubernetes
KUBECONFIG=~/.kube/config
K8S_NAMESPACE=microservices

# SonarCloud
SONAR_TOKEN=sonartoken
SONAR_ORGANIZATION=myorg

# Node
NODE_ENV=development
LOG_LEVEL=debug
```

## Environment-Specific Variables

### Staging
```yaml
ENVIRONMENT: staging
LOG_LEVEL: info
DEBUG: false
API_URL: https://staging.example.com
DATABASE_POOL_SIZE: 10
```

### Production
```yaml
ENVIRONMENT: production
LOG_LEVEL: warn
DEBUG: false
API_URL: https://example.com
DATABASE_POOL_SIZE: 20
```

## Service-Specific Variables

### API Gateway
```
PORT=3000
LOG_LEVEL=info
CORS_ENABLED=true
RATE_LIMIT=100
```

### Frontend
```
VITE_API_URL=https://api.example.com
VITE_ENV=production
```

### Databases
```
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres (change in prod!)
DB_NAME=microservices
```

## CI/CD Workflow Variables

These are set automatically in workflows:

```yaml
# Build info
GITHUB_ACTOR        # GitHub username
GITHUB_SHA          # Commit SHA
GITHUB_REF          # Branch/tag reference
GITHUB_REPOSITORY   # Owner/repo
GITHUB_WORKSPACE    # Workspace path

# Docker
IMAGE_TAG           # Set from branch/tag
REGISTRY            # ghcr.io
DOCKER_BUILDKIT=1   # Enable BuildKit

# Kubernetes
K8S_NAMESPACE       # microservices-staging/microservices
DEPLOY_ENV          # staging/production
```

## Matrix Strategy Variables

For parallel builds in workflows:

```yaml
matrix:
  service:
    - audit-service
    - authz-service
    - notification-service
    - payroll-service
    - finance-mock
    - oauth-mock

  node-version:
    - 18
    - 20

  os:
    - ubuntu-latest
```

---

## Reference: How to Use in Workflows

### Accessing Secrets
```yaml
env:
  DOCKER_USER: ${{ secrets.DOCKERHUB_USERNAME }}
  DOCKER_PASS: ${{ secrets.DOCKERHUB_TOKEN }}
```

### Accessing Context Variables
```yaml
env:
  IMAGE_TAG: ${{ github.sha }}
  BRANCH: ${{ github.ref }}
```

### Accessing Secrets in Scripts
```bash
#!/bin/bash
echo ${{ secrets.DOCKERHUB_TOKEN }} | docker login -u ${{ secrets.DOCKERHUB_USERNAME }} --password-stdin
```

---

**Last updated:** 2024
**Version:** 1.0
