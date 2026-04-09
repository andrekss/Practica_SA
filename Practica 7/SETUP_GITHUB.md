# Guía Paso a Paso: Configurar GitHub para CI/CD

## Pre-requisitos

- ✅ Repositorio en GitHub
- ✅ Cuenta en Docker Hub (opcional pero recomendado)
- ✅ Cuenta en SonarCloud (opcional)
- ✅ Cluster de Kubernetes (para producción)

---

## Paso 1: Crear Secrets en GitHub

### 1.1 Acceder a Secrets

1. Ve a tu repositorio en GitHub
2. Click en **Settings**
3. En la barra izquierda: **Secrets and variables** → **Actions**
4. Click en **New repository secret**

### 1.2 Agregar Secrets Necesarios

#### Secret 1: DOCKERHUB_USERNAME
- **Nombre:** `DOCKERHUB_USERNAME`
- **Valor:** Tu usuario de Docker Hub
- Click **Add secret**

#### Secret 2: DOCKERHUB_TOKEN
1. Ir a https://hub.docker.com/settings/security
2. Click en **New Personal Access Token**
3. Nombre: `github-cicd`
4. Permisos: `Read, Write, Delete`
5. Click **Generate**
6. Copiar el token
7. En GitHub → Nuevo secret
   - **Nombre:** `DOCKERHUB_TOKEN`
   - **Valor:** [pegar token]

#### Secret 3: SONARCLOUD_TOKEN (Opcional)
1. Ir a https://sonarcloud.io
2. Vincular con GitHub si no lo has hecho
3. Click en tu avatar → **My Account** → **Security**
4. Generar nuevo token
5. En GitHub → Nuevo secret
   - **Nombre:** `SONARCLOUD_TOKEN`
   - **Valor:** [pegar token]

#### Secret 4: KUBE_CONFIG_STAGING
```bash
# En tu máquina local
# macOS/Linux:
cat ~/.kube/config | base64 -w 0 | pbcopy

# Windows PowerShell:
$config = Get-Content -Path $env:USERPROFILE\.kube\config -Raw
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($config)) | Set-Clipboard
```

En GitHub:
- **Nombre:** `KUBE_CONFIG_STAGING`
- **Valor:** [pegar kubeconfig en base64]

#### Secret 5: KUBE_CONFIG_PRODUCTION
- **Nombre:** `KUBE_CONFIG_PRODUCTION`
- **Valor:** [pegar kubeconfig en base64 del cluster de producción]

#### Secret 6: HELM_REPO
- **Nombre:** `HELM_REPO`
- **Valor:** `https://[tu-helm-repo-url]`

#### Secret 7: DOMAIN
- **Nombre:** `DOMAIN`
- **Valor:** `tudominio.com`

---

## Paso 2: Configurar Protección de Rama

### 2.1 Ir a Branch Protection Rules

1. **Settings** → **Branches**
2. Click en **Add rule**
3. **Branch name pattern:** `main`
4. Click **Create**

### 2.2 Configurar Reglas

Marcar ✓ los siguientes:

- ✓ **Require a pull request before merging**
  - ✓ Require approvals: 1
  - ✓ Require status checks to pass before merging:
    - `ci / lint`
    - `ci / build`
    - `ci / test`
    - `security / trivy`
  - ✓ Require branches to be up to date before merging
  - ✓ Require linear history
  - ✓ Include administrators

Click **Save changes**

---

## Paso 3: Configurar Ambientes (Environments)

### 3.1 Crear Ambiente Staging

1. **Settings** → **Environments**
2. Click **New environment**
3. **Name:** `staging`
4. Click **Configure environment**
5. Marcar:
   - ✓ Required reviewers: 0 (o 1 si deseas aprobación)
   - ✓ Deployment branches: All branches

Click **Save protection rules**

### 3.2 Crear Ambiente Production

1. Click **New environment**
2. **Name:** `production`
3. Click **Configure environment**
4. Marcar:
   - ✓ Required reviewers: 2
   - ✓ Deployment branches: Protected branches only
5. En **Deployment branches** → Agregar `main` y tags de versión

Click **Save protection rules**

---

## Paso 4: Configurar Webhooks (Opcional)

### 4.1 Para despliegue automático

1. **Settings** → **Webhooks**
2. Click **Add webhook**
3. **Payload URL:** `https://your-webhook-handler.com/github`
4. **Content type:** application/json
5. **Events:** Push events, Release events
6. Click **Add webhook**

---

## Paso 5: Verificar Workflows

### 5.1 Hacer un Push de Prueba

```bash
git add .
git commit -m "test: activate CI/CD pipeline"
git push origin main
```

### 5.2 Ver Ejecución

1. GitHub → Tu repositorio
2. Tab **Actions**
3. Debería ver "CI - Build & Test" ejecutándose

### 5.3 Ver Detalles

Click en el workflow → Ver cada job → Click en los steps para ver logs

---

## Paso 6: Crear Primera Release

### 6.1 Crear Tag Anotado

```bash
git tag -a v1.0.0 -m "First release"
git push origin v1.0.0
```

### 6.2 Ver Despliegue

Action "Deploy to Kubernetes" debería ejecutarse automáticamente

---

## Paso 7: Configuración Local (Desarrollo)

### 7.1 Instalar GitHub CLI (Opcional pero Recomendado)

```bash
# macOS
brew install gh

# Windows
choco install gh

# Linux
curl -fsSL https://cli.github.com/install.sh | sudo bash
```

### 7.2 Autenticar

```bash
gh auth login
# Seleccionar: GitHub.com
# Seleccionar: HTTPS
# Autenticar con navegador
```

### 7.3 Comandos Útiles

```bash
# Ver estado del último workflow
gh workflow view

# Listar todos los workflows
gh workflow list

# Ver un workflow específico
gh run view

# Descargar logs de un run
gh run download <run-id>

# Ver artifacts
gh run list --status completed
```

---

## Paso 8: Actualizar README del Proyecto

Agregar badges y documentación:

```markdown
# Microservices Project

[![CI - Build & Test](https://github.com/[owner]/[repo]/workflows/CI%20-%20Build%20%26%20Test/badge.svg)](https://github.com/[owner]/[repo]/actions/workflows/ci-build.yml)
[![Docker Build & Push](https://github.com/[owner]/[repo]/workflows/Docker%20Build%20%26%20Push/badge.svg)](https://github.com/[owner]/[repo]/actions/workflows/docker-build-push.yml)
[![Deploy to Kubernetes](https://github.com/[owner]/[repo]/workflows/Deploy%20to%20Kubernetes/badge.svg)](https://github.com/[owner]/[repo]/actions/workflows/deploy.yml)

## CI/CD Status

Ver los workflows en la sección [Actions](https://github.com/[owner]/[repo]/actions)

### Últimas Releases

- [v1.0.0](https://github.com/[owner]/[repo]/releases/tag/v1.0.0)
```

---

## Paso 9: Configuración de SonarCloud (Opcional)

### 9.1 Si quieres análisis de código

1. Ir a https://sonarcloud.io/login
2. Click **GitHub**
3. Autorizar
4. Click **Analyze new project**
5. Seleccionar repositorio
6. Seguir el wizard

### 9.2 Agregar sonar-project.properties (Opcional)

```properties
sonar.projectKey=usuario_nombreproyecto
sonar.projectName=Nombre Proyecto
sonar.sourceEncoding=UTF-8
sonar.sources=src
sonar.exclusions=node_modules/**,dist/**
```

---

## Paso 10: Configurar Docker Hub Registry

### 10.1 Verificar Acceso

```bash
docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN
docker push docker.io/$DOCKERHUB_USERNAME/api-gateway:latest
```

### 10.2 Crear Repositorios en Docker Hub

1. Ir a https://hub.docker.com
2. Crear repositorio para cada servicio:
   - `api-gateway`
   - `frontend`
   - `audit-service`
   - `authz-service`
   - `notification-service`
   - `payroll-service`

---

## Verificación Final: Checklist

- [ ] Secrets configurados en GitHub
- [ ] Branch protection rules activas
- [ ] Ambientes (staging, production) creados
- [ ] Docker Hub cuenta creada
- [ ] SonarCloud configurado (opcional)
- [ ] Kubeconfig en base64 guardado
- [ ] Primer workflow ejecutado exitosamente
- [ ] README actualizado con badges
- [ ] Documentación del pipeline completa
- [ ] Team miembros tienen acceso

---

## Troubleshooting

### Los workflows no aparecen

```
Solución: Asegurate que los archivos .yml
están en .github/workflows/ correctamente
```

### Fallo de autenticación Docker

```
Solución: Verificar que el token es válido
y que El secret name es exacto (mayúsculas)
```

### Despliegue falla a Kubernetes

```
Solución: Verificar kubeconfig en base64
kubectl cluster-info debe funcionar
```

---

**¡Listo! Tu CI/CD está configurado** 🚀
