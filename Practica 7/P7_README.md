# Práctica 7: CI/CD con GitHub Actions y Microservicios

[![CI - Build & Test](https://img.shields.io/badge/CI-GitHub%20Actions-blue?logo=github)](https://github.com)
[![Docker](https://img.shields.io/badge/Container-Docker-blue?logo=docker)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-blue?logo=kubernetes)](https://kubernetes.io)

## 📋 Descripción General

Esta práctica implementa un **pipeline completo de CI/CD** basado en **GitHub Actions** para automatizar la integración, testing, containerización y despliegue del sistema de microservicios desarrollado en la Práctica 4.

El pipeline automatiza el flujo empresarial completo:
- ✅ **Validación automática** de cambios (linting, tests)
- ✅ **Construcción de imágenes Docker** de todos los servicios
- ✅ **Publicación en registros** (GitHub Container Registry, Docker Hub)
- ✅ **Despliegue automático** a staging y producción (Kubernetes)
- ✅ **Rollback automático** en caso de fallos
- ✅ **Monitoreo y notificaciones** de estado

## 🎯 Objetivos

- ✓ Configurar workflows automatizados con **GitHub Actions**
- ✓ Implementar pipelines de **CI/CD** mediante archivos YAML
- ✓ Containerizar todos los microservicios con **Docker**
- ✓ Automatizar **testing y validación** de código
- ✓ Desplegar servicios a **Kubernetes** con **Helm**
- ✓ Garantizar **calidad** y **seguridad** en cada commit

## 🚀 Inicio Rápido (15 minutos)

```bash
# 1. Ir a Práctica 7
cd "Practica 7"

# 2. Ver archivos creados
ls -la .github/workflows/

# 3. Configurar secrets en GitHub (ver QUICKSTART.md)

# 4. Hacer primer commit
git add .
git commit -m "ci: activate CI/CD pipeline"
git push origin main

# 5. Ver pipeline ejecutarse
# GitHub → Actions → CI - Build & Test
```

👉 **[Ver QUICKSTART.md para guía de 15 minutos](QUICKSTART.md)**

## 📂 Estructura Completa del Proyecto

```
Practica 7/
│
├── .github/                                # Configuración de GitHub
│   ├── workflows/                          # 🔄 Workflows CI/CD
│   │   ├── ci-build.yml                   # Test, lint, build
│   │   ├── docker-build-push.yml          # Docker images
│   │   ├── deploy.yml                     # Despliegue a k8s
│   │   └── release.yml                    # GitHub releases
│   │
│   ├── pull_request_template.md           # Template para PRs
│   └── dependabot.yml                     # ✨ Actualizaciones automáticas
│
├── k8s/                                    # Kubernetes & Helm
│   ├── Chart.yaml                         # Helm chart metadata
│   ├── values-staging.yaml                # Config staging (2 replicas)
│   └── values-production.yaml             # Config producción (3 replicas)
│
├── scripts/                                # 🛠️ Scripts auxiliares
│   ├── build.sh                           # Build local
│   ├── test.sh                            # Tests local
│   ├── lint.sh                            # Linting local
│   ├── docker-build.sh                    # Docker build local
│   └── k8s-deploy.sh                      # Deploy local k8s
│
├── [Microservicios de Práctica 4]         # Sistema completo de servicios
│   ├── api-gateway/                       # 🚪 API Gateway (NestJS)
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── frontend/                          # 🎨 Frontend (Vue.js)
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── services/                          # 📦 Microservicios
│   │   ├── audit-service/
│   │   ├── authz-service/
│   │   ├── finance-mock/
│   │   ├── notification-service/
│   │   ├── oauth-mock/
│   │   └── payroll-service/
│   │
│   ├── docker-compose.yml                 # Orquestación local
│   └── README.md
│
├── docs/                                   # 📚 Documentación (de Práctica 4)
│   ├── architecture.md
│   ├── approval-flow.md
│   └── er-diagrams.md
│
├── 📖 CICD_DOCUMENTATION.md               # Documentación técnica completa
├── 📖 SETUP_GITHUB.md                     # Guía paso a paso
├── 📖 PIPELINE_DIAGRAM.md                 # Diagramas del pipeline
├── 📖 ENVIRONMENT_VARIABLES.md            # Variables de entorno
├── 📖 QUICKSTART.md                       # Guía rápida (15 min)
└── README.md                              # Este archivo
```

## 🔄 Flujo del Pipeline

### Fase 1️⃣: CI - Validación (5-15 min)

```
Developer Push a main/develop
         ↓
[Lint]       ESLint validation ✓
[Build]      npm run build ✓
[Test]       npm test ✓
[Security]   Trivy scan ✓
[Quality]    SonarCloud ✓
         ↓
✅ Si pasan → Continuar a fase 2
❌ Si falla → Notificar developer, bloquear merge
```

### Fase 2️⃣: Docker Build & Push (10-30 min)

```
CI Successful
         ↓
Build 8 imágenes en paralelo:
  - API Gateway    → ghcr.io/[owner]/api-gateway:sha
  - Frontend       → ghcr.io/[owner]/frontend:sha
  - Audit Service  → ghcr.io/[owner]/audit-service:sha
  - Authz Service  → ghcr.io/[owner]/authz-service:sha
  - Notification   → ghcr.io/[owner]/notification-service:sha
  - Payroll        → ghcr.io/[owner]/payroll-service:sha
  - Finance Mock   → ghcr.io/[owner]/finance-mock:sha
  - OAuth Mock     → ghcr.io/[owner]/oauth-mock:sha
         ↓
Push a registros (GHCR + Docker Hub)
         ↓
✅ Imágenes disponibles → Deploy
```

### Fase 3️⃣: Deploy (10-20 min)

#### En main branch:
```
→ Deploy Automático a STAGING
  ├─ Create namespace microservices-staging
  ├─ Helm upgrade --release microservices-staging
  ├─ Wait rollout status (2-5 min)
  ├─ Health checks
  └─ Notify PR comentario ✓
```

#### En tag de versión (v*.*.*)
```
→ Deploy Automático a PRODUCTION
  ├─ Create namespace microservices
  ├─ Helm upgrade --release microservices
  ├─ Wait rollout status (5-10 min)
  ├─ Verify all pods running
  ├─ Create GitHub Release
  └─ Generate Changelog ✓
```

#### Si falla:
```
→ Rollback Automático
  ├─ helm rollback microservices
  ├─ Notify failure
  └─ Alert team
```

## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito | Versión |
|-----------|----------|---------|
| **GitHub Actions** | Orquestación CI/CD | Integrado |
| **Docker** | Containerización | 24.x |
| **Docker Compose** | Orquestación local | 2.x |
| **Kubernetes** | Orquestación producción | 1.28+ |
| **Helm** | Package manager K8s | 3.x |
| **Node.js** | Runtime | 18 LTS |
| **npm** | Package manager | 9.x |
| **ESLint** | Linting | Latest |
| **Jest** | Testing | Latest |
| **Trivy** | Security scan | 0.45+ |
| **SonarCloud** | Code quality | Cloud |

## 📋 Workflows Detallados

### 1. 🔍 CI - Build & Test (`ci-build.yml`)

**Trigger:** `push` a main/develop, `pull_request`

**Jobs en Paralelo:**
1. **Lint** - ESLint en 3 servicios principales
2. **Build** - Compilar API Gateway, Frontend, 6 Servicios
3. **Test** - Unit tests en todos
4. **Security** - Trivy vulnerability scan
5. **Quality** - SonarCloud analysis

**Artifacts:**
- test-results/ (coverage reports)
- trivy-results.sarif (security report)

**Duración:** 5-15 minutos

### 2. 🐳 Docker Build & Push (`docker-build-push.yml`)

**Trigger:** Push a `main`, tags `v*.*.*`

**Strategy Matrix:**
- 8 servicios construidos en **paralelo**
- Tags automáticos: `latest`, `sha`, `v1.0.0`
- Dual registry: GitHub Container Registry + Docker Hub

**Images:**
```
ghcr.io/[owner]/[repo]/api-gateway:latest
ghcr.io/[owner]/[repo]/frontend:latest
ghcr.io/[owner]/[repo]/audit-service:latest
... (y 5 más)
```

**Duración:** 10-30 minutos

### 3. 🚀 Deploy (`deploy.yml`)

**Trigger:** Push a `main` (staging), tags (production), workflow_dispatch (manual)

**Ambientes:**
- **staging**: Auto-deploy, 2 replicas
- **production**: 3 replicas, health checks

**Features:**
- Deploy con Helm v3
- Automatic rollback on failure
- Health checks
- Notifications
- Manual trigger opción

**Duración:** 10-20 minutos

### 4. 📝 Release (`release.yml`)

**Trigger:** Tags `v*.*.*`

**Funciones:**
- Generar changelog automático
- Crear GitHub Release
- Adjuntar CHANGELOG.md

**Duración:** 2-5 minutos

## 📖 Documentación Completa

| Documento | Propósito | Tiempo |
|-----------|----------|--------|
| **[QUICKSTART.md](QUICKSTART.md)** | Guía rápida para empezar | 15 min |
| **[SETUP_GITHUB.md](SETUP_GITHUB.md)** | Configuración paso a paso | 30 min |
| **[CICD_DOCUMENTATION.md](CICD_DOCUMENTATION.md)** | Documentación técnica completa | 45 min |
| **[PIPELINE_DIAGRAM.md](PIPELINE_DIAGRAM.md)** | Diagramas visuales del pipeline | 20 min |
| **[ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)** | Referencia de variables | 15 min |

## 🔑 Configuración Requerida

### GitHub Secrets (Obligatorios)
```bash
DOCKERHUB_USERNAME      # Tu usuario de Docker Hub
DOCKERHUB_TOKEN         # Token de acceso personal
DOMAIN                  # Tu dominio (ej: example.com)
```

### GitHub Secrets (Opcionales - para Kubernetes)
```bash
KUBE_CONFIG_STAGING     # Kubeconfig en base64 (staging)
KUBE_CONFIG_PRODUCTION  # Kubeconfig en base64 (prod)
HELM_REPO               # URL del repositorio Helm
SONARCLOUD_TOKEN        # Token de SonarCloud (análisis de código)
```

👉 **[Ver instrucciones en SETUP_GITHUB.md](SETUP_GITHUB.md)**

### Branch Protection Rules

```
Settings → Branches → Add rule
├─ Branch name pattern: main
├─ Require PR before merge ✓
├─ Require status checks:
│  ├─ ci / lint ✓
│  ├─ ci / build ✓
│  └─ ci / test ✓
├─ Require branches up to date ✓
└─ Dismiss stale reviews ✓
```

## 💻 Uso Local

### Ejecutar build localmente
```bash
bash scripts/build.sh
```

### Ejecutar tests
```bash
bash scripts/test.sh
```

### Linting
```bash
bash scripts/lint.sh
```

### Docker build
```bash
bash scripts/docker-build.sh latest
```

### Deploy a Kubernetes local
```bash
bash scripts/k8s-deploy.sh microservices staging
```

## 🔍 Monitoreo y Diagnostics

### En GitHub
```
Tu Repositorio → Actions → [Workflow] → [Run]
```

### Con GitHub CLI
```bash
# Ver últimos runs
gh run list

# Ver detalles
gh run view <run-id>

# Ver logs
gh run view --log

# Descargar artifacts
gh run download <run-id> -D ./artifacts
```

### Estados de Ejecución
```
🟡 QUEUED       - En cola esperando ejecutor
🔵 IN_PROGRESS  - Ejecutándose
✅ SUCCESS      - Completado exitosamente
❌ FAILURE      - Error en ejecución
⚠️ WARNING      - Completado con warnings
⏸️ CANCELED     - Cancelado manualmente
🔄 SKIPPED      - Omitido (condición no cumplida)
```

## 📊 Métricas de Tiempo

| Fase | Min | Max | Promedio |
|------|-----|-----|----------|
| CI (lint+build+test) | 5 | 15 | 10 |
| Docker build & push | 10 | 30 | 20 |
| Deploy a Staging | 5 | 15 | 10 |
| Deploy a Production | 10 | 20 | 15 |
| **Total: Feature a Production** | **30** | **80** | **55** |

## ✅ Git Workflow Recomendado

### Desarrollo normalizado
```bash
# 1. Crear feature branch
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios
# ... editar archivos ...

# 3. Commit y push
git add .
git commit -m "feat: describir cambio"
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request
gh pr create --title "Describir cambio"

# 5. Esperar CI ✅ y review

# 6. Merge a main
gh pr merge <numero>

# 7. Delete rama
git checkout main && git pull && git branch -D feature/...
```

### Release a Producción
```bash
# 1. Crear release tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# 2. Push del tag
git push origin v1.0.0

# 3. Ver deployment a producción automáticamente
gh run list
```

## 🐛 Troubleshooting

### ❌ "Workflow not found"
```
✓ Verificar: .github/workflows/ existe y contiene *.yml
ls -la .github/workflows/
```

### ❌ "Linting failed"
```
✓ Ejecutar localmente:
npm run lint

✓ Arreglar errores:
npm run lint -- --fix
```

### ❌ "Docker push authentication failed"
```
✓ Verificar secrets:
gh secret list

✓ Token válido en Docker Hub:
https://hub.docker.com/settings/security
```

### ❌ "Kubernetes deployment timeout"
```
✓ Verificar kubeconfig:
echo $KUBE_CONFIG_PRODUCTION | base64 -d > ~/.kube/config

✓ Test conexión:
kubectl cluster-info
```

👉 **[Ver más troubleshooting en SETUP_GITHUB.md](SETUP_GITHUB.md)**

## 📝 Convenciones

### Ramas de Git
- `main` - Rama de producción (protegida)
- `develop` - Rama de desarrollo
- `feature/*` - Nuevas funcionalidades
- `bugfix/*` - Correcciones de bugs
- `hotfix/*` - Hotfixes urgentes

### Mensajes de Commit (Conventional Commits)
```
feat: agregar nueva funcionalidad
fix: corregir bug identificado
docs: actualizar documentación
style: cambios de formato (sin lógica)
test: agregar o actualizar tests
chore: actualizar dependencias
ci: cambios en CI/CD
perf: mejorar performance
refactor: refactorizar código
```

### Versionamiento (Semantic Versioning)
```
v MAJOR . MINOR . PATCH
v 1     . 2     . 3

1.0.0   - Primera release estable
1.1.0   - Nueva feature (minor)
1.1.1   - Bug fix (patch)
2.0.0   - Breaking change (major)
```

## ✨ Features Principales

✅ **Automatización Completa**
- CI automático en cada push
- Docker build automático
- Deploy automático a staging
- Release management automático

✅ **Seguridad**
- Trivy vulnerability scanning
- SonarCloud code analysis
- Branch protection rules
- Status checks obligatorios

✅ **Escalabilidad**
- Kubernetes deployment
- Helm templating
- Auto-scaling configurado
- Multi-environment support

✅ **Observabilidad**
- Job summaries
- Artifact downloads
- Detailed logs
- GitHub release notes

✅ **Confiabilidad**
- Automatic rollback
- Health checks
- Status notifications
- Error handling

## 🎓 Actividades Sugeridas

1. **Semana 1:** Setup y primer push
   - [ ] Configurar secrets
   - [ ] Hacer primer push
   - [ ] Ver CI ejecutar
   - [ ] Verificar logs

2. **Semana 2:** Docker & Registries
   - [ ] Verificar Docker build
   - [ ] Confirmar push a registry
   - [ ] Pull de imágenes localmente
   - [ ] Probar imágenes

3. **Semana 3:** Kubernetes Deployment
   - [ ] Configurar kubeconfig
   - [ ] Deploy a staging localmente
   - [ ] Verificar health checks
   - [ ] Test scenarios

4. **Semana 4:** Producción & Monitoring
   - [ ] Crear primer tag v1.0.0
   - [ ] Deploy a production
   - [ ] Setup monitoring (opcional)
   - [ ] Documentar lecciones aprendidas

## 📚 Recursos Adicionales

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com)
- [Kubernetes Documentation](https://kubernetes.io/docs)
- [Helm Documentation](https://helm.sh/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ✅ Checklist de Implementación

- [ ] Workflows están en `.github/workflows/`
- [ ] Secrets configurados en GitHub
- [ ] Branch main protegida
- [ ] Docker images buildean correctamente
- [ ] Primer push triggereal CI
- [ ] Tests pasan en CI
- [ ] Docker push a registry exitoso
- [ ] Ambientes staging y production creados
- [ ] Documentación completa
- [ ] Primer tag v1.0.0 creado

## 📞 Soporte

Para problemas:
1. Revisar logs en GitHub Actions
2. Consultar [CICD_DOCUMENTATION.md](CICD_DOCUMENTATION.md)
3. Revisar [Troubleshooting](#-troubleshooting)
4. Leer [SETUP_GITHUB.md](SETUP_GITHUB.md)

---

**Creado:** 2024
**Última actualización:** 2024
**Versión:** 1.0.0
**Estado:** ✅ Producción Ready

Made with ❤️ for DevOps Learning
