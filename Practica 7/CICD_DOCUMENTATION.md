# CI/CD Pipeline - Documentación Técnica Completa

## 1. Descripción General del Pipeline

El pipeline CI/CD automatiza el proceso completo de integración, pruebas, construcción y despliegue del sistema de microservicios. Utiliza **GitHub Actions** como orquestador principal y se divide en 4 fases principales:

1. **Validación (CI)** - Linting, Build, Tests
2. **Construcción (Docker)** - Construir y publicar imágenes
3. **Despliegue (CD)** - Desplegar a staging/producción
4. **Monitoreo** - Salud y rollback automático

## 2. Flujo del Pipeline

```
GitHub Push/PR
    ↓
[1] CI - Build & Test (ci-build.yml)
    ├─ Lint (Code quality)
    ├─ Build (Compile all services)
    ├─ Test (Unit & Integration tests)
    ├─ Security Scan (Trivy)
    └─ Code Quality (SonarCloud)
    ↓
[2] Docker Build & Push (docker-build-push.yml)
    ├─ Build API Gateway image
    ├─ Build Frontend image
    ├─ Build all services
    └─ Push to GitHub Container Registry & Docker Hub
    ↓
[3] Deploy (deploy.yml)
    ├─ Deploy to Staging (on main branch)
    ├─ Deploy to Production (on version tags v*.*.*)
    └─ Automatic rollback on failure
    ↓
[4] Release (release.yml)
    └─ Create GitHub Release with changelog
```

## 3. Workflows Disponibles

### 3.1 CI Build & Test (`ci-build.yml`)

**Trigger:** Push a `main`/`develop`, Pull Requests

**Jobs:**
- ✅ **Lint** - ESLint para código TypeScript/JavaScript
- ✅ **Build** - Compilar todo el proyecto
- ✅ **Test** - Ejecutar test suites
- ✅ **Security** - Análisis de vulnerabilidades con Trivy
- ✅ **Quality** - Análisis con SonarCloud

**Salida:** Job summary visible en GitHub

### 3.2 Docker Build & Push (`docker-build-push.yml`)

**Trigger:** Push a `main`, tags de versión

**Jobs:**
- 🐳 Build API Gateway → ghcr.io/[user]/api-gateway:[tag]
- 🐳 Build Frontend → ghcr.io/[user]/frontend:[tag]
- 🐳 Build Servicios (6 servicios en paralelo)

**Registros:**
- GitHub Container Registry: `ghcr.io/[owner]/[repo]/[service]`
- Docker Hub: `docker.io/[username]/[service]` (opcional)

### 3.3 Deploy (`deploy.yml`)

**Trigger:** Push a `main` (staging), tags de versión (producción), manual

**Environments:**
- **Staging** - Despliegue automático en cada push a main
- **Production** - Despliegue manual o automático en tags

**Características:**
- Despliegue con Helm
- Health checks automáticos
- Rollback automático en caso de fallo
- Notificaciones en PRs

### 3.4 Release (`release.yml`)

**Trigger:** Push de tags `v*.*.*`

**Funciones:**
- Generar changelog automático
- Crear GitHub Release
- Adjuntar artefactos

## 4. Requisitos para Configurar

### 4.1 Configuración Manual Inicial

#### 1. **Secrets de GitHub**

Ve a: **Settings → Secrets and variables → Actions**

Agrega estos secrets:

```yaml
GITHUB_TOKEN              # Auto-incluido (puede ser usado)
DOCKERHUB_USERNAME        # Tu usuario de Docker Hub
DOCKERHUB_TOKEN           # Tu token de Docker Hub (Personal Access Token)
SONARCLOUD_TOKEN          # Token de SonarCloud para análisis
KUBE_CONFIG_STAGING       # Base64 del kubeconfig para staging (base64 ~/.kube/config)
KUBE_CONFIG_PRODUCTION    # Base64 del kubeconfig para producción
HELM_REPO                 # URL del repositorio Helm
DOMAIN                    # Dominio de la aplicación
```

#### 2. **Obtener Docker Hub Token**

1. Ir a https://hub.docker.com/settings/security
2. Crear nuevo Personal Access Token
3. Copiar el token en GitHub Secrets

#### 3. **Obtener Kubeconfig en Base64**

```bash
# Para macOS/Linux
cat ~/.kube/config | base64 -w 0

# Para Windows PowerShell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("$env:USERPROFILE\.kube\config"))
```

#### 4. **Configurar SonarCloud**

1. Ir a https://sonarcloud.io
2. Vincular con GitHub
3. Organizar proyecto
4. Obtener token en perfil
5. Guardar en GitHub Secrets

### 4.2 Protección de Rama (Settings → Branches)

```yaml
Require a pull request before merging:
  ✓ Require status checks to pass: 
    - ci / lint
    - ci / build
    - ci / test
  ✓ Require branches to be up to date
  ✓ Require conversation resolution
```

## 5. Cómo Usar el Pipeline

### 5.1 Desarrollo Local → Staging

```bash
# 1. Clonar el repositorio
git clone https://github.com/[usuario]/repositorio.git
cd repositorio

# 2. Crear rama de feature
git checkout -b feature/nueva-feature

# 3. Realizar cambios
# ... editar archivos ...

# 4. Commit y push
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-feature

# 5. Crear Pull Request en GitHub
# - El pipeline CI se ejecutará automáticamente
# - Revisar los resultados
# - Hacer merge a main

# 6. Push a main dispara:
#    - CI (lint, build, test)
#    - Docker build & push
#    - Deploy a Staging
```

### 5.2 Staging → Producción (Release)

```bash
# 1. Crear tag de versión
git tag -a v1.0.0 -m "Release version 1.0.0"

# 2. Push del tag
git push origin v1.0.0

# 3. El pipeline ejecutará:
#    - CI (validación)
#    - Docker build & push
#    - Deploy a Production
#    - Create GitHub Release
```

### 5.3 Despliegue Manual

```bash
# Ir a GitHub → Actions → Deploy to Kubernetes
# Click "Run workflow"
# Seleccionar environment (staging o production)
# Click "Run workflow"
```

## 6. Monitoreo y Logs

### 6.1 Ver Ejecución del Pipeline

1. GitHub.com → Tu repositorio
2. **Actions** tab
3. Seleccionar workflow

### 6.2 Acceder a Logs

```
Actions → [Workflow Name] → [Run] → [Job] → [Step]
```

### 6.3 Descargar Artefactos

```
Actions → [Run] → [Artifacts]
```

Archivos disponibles:
- `test-results/` - Resultados de tests y coverage
- `trivy-results.sarif` - Reporte de seguridad

## 7. Estructura de Archivos

```
.github/
├── workflows/
│   ├── ci-build.yml           # Test, lint, build
│   ├── docker-build-push.yml  # Construir imágenes Docker
│   ├── deploy.yml             # Despliegue a k8s
│   └── release.yml            # Crear releases
├── pull_request_template.md   # Template para PRs
└── dependabot.yml            # Actualizaciones automáticas

k8s/                          # (Crear si usas Helm)
├── values-staging.yaml       # Config Helm staging
├── values-production.yaml    # Config Helm producción
└── Chart.yaml               # Helm chart

scripts/
├── build.sh                 # Build local
├── test.sh                  # Tests local
└── deploy.sh               # Deploy local
```

## 8. Variables de Entorno

### Por Workflow

**ci-build.yml:**
```yaml
REGISTRY: ghcr.io
GITHUB_OWNER: ${{ github.repository_owner }}
```

**docker-build-push.yml:**
```yaml
REGISTRY: ghcr.io
REGISTRY_DOCKER_HUB: docker.io
```

**deploy.yml:**
```yaml
REGISTRY: ghcr.io
```

## 9. Troubleshooting

### 9.1 El workflow falla en "Lint"

**Problema:** ESLint encuentra errores
```bash
# Localmente, ejecuta:
npm run lint

# Arreglar automáticamente:
npm run lint -- --fix
```

### 9.2 Falla de autenticación a Docker Hub

```bash
# Verificar que el token sea válido:
echo $DOCKERHUB_TOKEN | docker login --username $DOCKERHUB_USERNAME --password-stdin

# Si falla, generar nuevo token en Docker Hub
```

### 9.3 Despliegue a Kubernetes falla

```bash
# Verificar kubeconfig:
echo $KUBE_CONFIG_PRODUCTION | base64 -d > ~/.kube/config

# Test conexión:
kubectl cluster-info
```

### 9.4 Tests fallan solo en CI

**Problema:** Funcionan localmente pero fallan en GitHub Actions

```bash
# Usar misma Node version:
# Local: node --version
# Workflow: node-version: 18

# O instalar dependencias con --ci:
npm install --ci
```

## 10. Best Practices

✅ **DO:**
- Usar semantic versioning para tags: `v1.2.3`
- Escribir mensajes de commit descriptivos
- Crear PRs antes de hacer merge a main
- Revisar logs de fallo antes de pushear código
- Mantener secrets seguros, nunca commitar

❌ **DON'T:**
- Pushear directamente a main (usar PRs)
- Cambiar workflows en producción
- Exponer secrets en logs
- Ignorar fallos de tests o linting
- Usar imágenes sin versión en reproducción

## 11. Comandos Útiles - CLI

```bash
# Ver estado del último workflow
gh workflow view

# Rerun un workflow fallido
gh run rerun <run-id>

# Descargar logs
gh run download <run-id>

# Listar workflows
gh workflow list

# Ver un workflow específico
gh workflow view <workflow-id> -v
```

## 12. Costos Estimados

**GitHub Actions - Incluido gratis:**
- 2,000 minutos/mes para repositorio privado
- Ilimitado para repositorio público

**Docker Hub:**
- 1 repositorio privado gratis
- Pulls limitados (100/6h)

**SonarCloud:**
- Gratis para proyectos públicos
- Pago para privados

---

**Última actualización:** 2024
**Versión del Pipeline:** 1.0.0
