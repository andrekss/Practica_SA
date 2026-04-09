# QUICKSTART - Guía Rápida de Configuración CI/CD

**Tiempo estimado: 15 minutos**

## Paso 1: Crear Repositorio en GitHub (2 minutos)

```bash
# Si no tienes repo:
gh repo create Practicas-SA repo-name --public

# Si ya tienes repo, clonar:
git clone https://github.com/tu-usuario/Practicas-SA.git
cd Practicas-SA/Practica\ 7
```

## Paso 2: Agregar Secrets a GitHub (5 minutos)

### Opción A: Usando GitHub Web UI
1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Agregar cada secret:

| Secret Name | Valor |
|---|---|
| `DOCKERHUB_USERNAME` | Tu usuario Docker Hub |
| `DOCKERHUB_TOKEN` | [Generar en Docker Hub](https://hub.docker.com/settings/security) |
| `SONARCLOUD_TOKEN` | [Generar en SonarCloud](https://sonarcloud.io) (opcional) |
| `DOMAIN` | `example.com` (o tu dominio) |

**Secrets opcionales (para producción):**
- `KUBE_CONFIG_STAGING` - base64 ~/.kube/config
- `KUBE_CONFIG_PRODUCTION` - base64 ~/.kube/config prod
- `HELM_REPO` - URL de tu repo Helm

### Opción B: Usando GitHub CLI
```bash
# Asegurate de estar dentro del repo Practica 7
gh auth login
gh secret set DOCKERHUB_USERNAME --body "tu-usuario"
gh secret set DOCKERHUB_TOKEN --body "token-aqui"
gh secret set DOMAIN --body "example.com"
```

## Paso 3: Proteger Branch Main (2 minutos)

1. **Settings** → **Branches**
2. Click **Add rule**
3. **Branch name pattern:** `main`
4. Marcar ✓:
   - Require pull request before merging
   - Require status checks to pass:
     - `ci / lint`
     - `ci / build`
     - `ci / test`

## Paso 4: Verificar Workflows

```bash
# Hacer commit de prueba
git add .
git commit -m "ci: activate GitHub Actions"
git push origin main

# Ver workflows
gh run list --repo tu-usuario/Practicas-SA
```

**Ve a:** GitHub.com → tu repo → **Actions** 

Deberías ver "CI - Build & Test" ejecutándose ✅

## Paso 5: Crear Primera Release (Opcional)

```bash
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0

# Revisar workflows
gh run list
```

---

## ¿Qué Sucede Ahora?

```
Tu push a main
    ↓
[CI] Test, Lint, Build (1-3 min) ✅
    ↓
[Docker] Build & Push (5-10 min) 🐳
    ↓
[Deploy] Staging (5-10 min) 🚀
    ↓
✅ Listo!
```

## Verificar Estado

```bash
# Ver logs del último run
gh run view

# Ver detalles de un workflow
gh run view --log

# Descargar artifacts
gh run download <run-id>
```

## Git Workflow Recomendado

```bash
# 1. Crear feature branch
git checkout -b feature/nueva-feature

# 2. Hacer cambios
# ... editar archivos ...

# 3. Commit y push
git add .
git commit -m "feat: agregar nueva feature"
git push origin feature/nueva-feature

# 4. Crear PR en GitHub (o usar CLI)
gh pr create --title "Agregar nueva feature"

# 5. Esperar a que CI pase ✅
# Ver: GitHub → Actions

# 6. Merge cuando esté listo
gh pr merge <pr-number> --merge

# 7. Borrar rama local
git checkout main
git pull origin main
git branch -D feature/nueva-feature
```

## Troubleshooting Rápido

### ❌ "Workflow file not found"
```
Solución: Verifica que .github/workflows/*.yml existan
ls -la .github/workflows/
```

### ❌ "Linting failed"
```
Solución: Ejecutar localmente
npm run lint --fix
```

### ❌ "Docker push failed"
```
Solución: Verificar secrets
gh secret list
# Asegurar DOCKERHUB_USERNAME y DOCKERHUB_TOKEN están configurados
```

### ❌ "Status check failed"
```
Solución: Ver logs
gh run view <run-id> --log
```

---

## Documentación Completa

- 📖 [CICD_DOCUMENTATION.md](./CICD_DOCUMENTATION.md) - Documentación técnica completa
- 📋 [SETUP_GITHUB.md](./SETUP_GITHUB.md) - Guía detallada paso a paso
- 🔄 [PIPELINE_DIAGRAM.md](./PIPELINE_DIAGRAM.md) - Diagramas del flujo
- 🔧 [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) - Variables de entorno

## Comandos Útiles

```bash
# Ver workflow actual
gh workflow view

# Listar todos los workflows
gh workflow list

# Ejecutar workflow manual
gh workflow run deploy.yml -f environment=staging

# Rerun un workflow fallido
gh run rerun <run-id>

# Ver artifacts
gh run download <run-id> -D ./artifacts

# Ver status de último push
git log --oneline -1 --decorate
```

## Siguientes Pasos

1. ✅ Configurar secrets
2. ✅ Proteger branch main
3. ✅ Hacer primer push → Ver CI ejecutar
4. ✅ Crear primer tag v1.0.0 → Ver despliegue
5. 📋 Configurar Kubernetes (si deseas desplegar)
6. 📊 Configurar SonarCloud (análisis de código)
7. 📞 Configurar notificaciones (Slack, Discord, etc.)

---

**¡Listo para usar CI/CD! 🎉**

Cualquier error, revisar los logs en GitHub Actions tab.
