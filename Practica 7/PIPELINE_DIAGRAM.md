# Diagrama del Pipeline CI/CD

## 🔄 Flujo Visual Simplificado

```
┌──────────────────┐
│ Developer Push   │
│      Code        │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│  GitHub Repository       │
│  (Recibe el push)        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ GitHub Actions Trigger   │
│ (Inicia workflows)       │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│ Build  │ │ Test   │ 
│ Stage  │ │ Stage  │
└────┬───┘ └───┬────┘
     │         │
     └────┬────┘
          ▼
┌──────────────────────────┐
│  Docker Build Images     │
│  (8 imágenes en paralelo)│
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Push Images to Registry │
│  (ghcr.io, Docker Hub)   │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│   Deploy Stage           │
│  (Staging → Production)  │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│   K8S Environment        │
│  (Kubernetes Cluster)    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Microservices Running    │
│ (Todos los servicios)    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ API Gateway Available    │
│ ✅ Listo para usar       │
└──────────────────────────┘
```

---

## Flujo Completo del Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DEVELOPER WORKFLOW                          │
│                                                                       │
│  Feature Branch  →  Commit  →  Push  →  Pull Request  →  Review    │
│       (feat/)                                                         │
└────────────────────────────────┬──────────────────────────────────────┘
                                 │
                    GitHub detects Push/PR
                                 │
        ┌────────────────────────────────────────────┐
        │   ✓ Workflow Triggered: ci-build.yml       │
        └────────────────────────────────────────────┘
                                 │
                ┌────────────────┴────────────────┐
                ▼                                 ▼
        ┌─────────────────┐         ┌─────────────────────┐
        │  1. LINTING     │         │  3. SECURITY SCAN   │
        │  ESLint Check   │         │  Trivy Analysis     │
        │  ✓ API Gateway  │         │  ✓ File system      │
        │  ✓ Frontend     │         │  ✓ Dependencies     │
        │  ✓ Services     │         │  ↓ SARIF Report     │
        └────────┬────────┘         └────────┬────────────┘
                 │                          │
        ┌────────┴───────┐                  │
        ▼                ▼                  │
   ✅ Pass?         2. BUILD              │
        │           ├─ API Gateway        │
        │           ├─ Frontend           │
        │           ├─ Services (6)       │
        │           └─ Check artifacts    │
        │                ▼                │
        │          4. TEST                │
        │           ├─ Unit tests         │
        │           ├─ Integration tests  │
        │           └─ Coverage reports   │
        │                ▼                │
        │           5. CODE QUALITY       │
        │           └─ SonarCloud         │
        │                ▼                │
        └────────┬──────────┬──────┬──────┘
                 │          │      │
            ✅ PASS    ⚠️ WARN   ❌ FAIL
                 │          │      │
                 ▼          ▼      ▼
        ┌──────────────┐   │   ┌─────────┐
        │ Merge Ready  │   │   │ Notify  │
        └──────┬───────┘   │   │ Developer
               │           │   └─────────┘
        Main Branch        │
        New Code           │
               │           │
               │         (Continue)
               │
               ▼
        ┌────────────────────────────────────────┐
        │ ✓ Workflow Triggered: docker-build-push.yml
        └────────────────────────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
   ┌─────────────────────────┐
   │  BUILD DOCKER IMAGES    │
   │                         │
   │  🐳 api-gateway         │
   │     └─ ghcr.io/[img]    │
   │                         │
   │  🐳 frontend            │
   │     └─ ghcr.io/[img]    │
   │                         │
   │  🐳 audit-service       │
   │  🐳 authz-service       │
   │  🐳 notification-service│
   │  🐳 payroll-service     │
   │                         │
   │  (Parallel builds)      │
   └──────────┬──────────────┘
              │
        ┌─────┴─────┐
        ▼           ▼
   ┌──────────────────────┐
   │  PUSH TO REGISTRIES  │
   │                      │
   │  → GitHub Container  │
   │    Registry          │
   │  → Docker Hub        │
   │    (si configured)   │
   │                      │
   │  Tag: sha/latest/v*  │
   └──────────┬───────────┘
              │
        ✅ Success
              │
              ▼
   ┌─────────────────────────────┐
   │ ✓ Workflow Triggered: deploy.yml
   └─────────────────────────────┘
        │
        └──────────────┬──────────────┐
                       │              │
                       ▼              ▼
            ┌────────────────────┐  ┌──────────────┐
            │  DEPLOY STAGING    │  │   RELEASE    │
            │  (Auto on main)    │  │   (on tags)  │
            │                    │  │              │
            │ - Get kubeconfig   │  │ - Generate   │
            │ - Create namespace │  │   changelog  │
            │ - helm upgrade     │  │ - Create     │
            │ - Wait rollout ok  │  │   GitHub     │
            │ - Health checks    │  │   Release    │
            │ - Notify PRs       │  │              │
            │                    │  │              │
            └────────┬───────────┘  └──────────────┘
                     │
             ┌───────┴────────┐
             ▼                ▼
         ✅ Success     ❌ Failed
             │                │
             │          Auto Rollback
             │          (revert helm)
             │
        ┌────┴──────────────────────────┐
        ▼                               ▼
   ┌──────────────┐          ┌──────────────────┐
   │  Staging OK  │          │ Production       │
   │              │          │ Deployment       │
   │ Endpoint:    │          │                  │
   │ staging.app  │          │ (On Version Tag) │
   │              │          │                  │
   │ Next: Manual │          │ - Get kubeconfig │
   │ promotion or │          │ - helm upgrade   │
   │ auto deploy  │          │ - Verify rollout │
   │              │          │ - Health checks  │
   │              │          │ - Notification   │
   └──────────────┘          └──────────────────┘
                                     │
                            ┌────────┴────────┐
                            ▼                 ▼
                        ✅ Success      ❌ Failed
                            │                 │
                            │            Rollback
                            │
                    ┌────────┴──────────┐
                    ▼                   ▼
              ┌──────────┐       ┌─────────────┐
              │Prod Ready│       │  Monitoring │
              │          │       │  Dashboard  │
              │ Endpoint:│       │             │
              │ app.com  │       │ - Metrics   │
              │          │       │ - Logs      │
              │          │       │ - Alerts    │
              └──────────┘       └─────────────┘
                                        │
                                   Running 24/7
```

## Estados del Pipeline

```
┌──────────────────────────────────────────────┐
│          WORKFLOW EXECUTION STATES           │
└──────────────────────────────────────────────┘

🟡 QUEUED      - Esperando ejecución
🔵 IN_PROGRESS - Ejecutándose
✅ SUCCESS     - Completado exitosamente
❌ FAILURE     - Error en ejecución
⚠️ WARNING     - Completado con advertencias
⏸️ CANCELED    - Cancelado manualmente
🔄 SKIPPED     - No ejecutado (condición no cumplida)
```

## Matriz de Decisiones

```
Push a main?
├─ SÍ → Ejecutar CI (lint, build, test)
│       ├─ ✅ PASS → Docker build & push
│       │          └─ Deploy Staging
│       │
│       └─ ❌ FAIL → Notificar desarrollador
│                     (No desplegar)
│
└─ NO (rama de feature)
   └─ En PR → Ejecutar CI (lint, build, test)
             ├─ ✅ PASS → Merge allowed
             └─ ❌ FAIL → Merge blocked


Push de tag v*.*.*?
├─ SÍ → Ejecutar todos los workflows
│       ├─ CI (lint, build, test)
│       ├─ Docker build & push
│       ├─ Deploy Production
│       └─ Release (changelog)
│
└─ NO → Ignorar tag
```

## Detalle de Fases

### Fase 1: CI Build & Test (5-15 min)
```
┌─ Setup
├─ Lint            (1-2 min)   → ESLint analysis
├─ Build           (3-5 min)   → npm build
├─ Test            (2-5 min)   → npm test
├─ Security        (1-3 min)   → Trivy scan
└─ Quality         (1-2 min)   → SonarCloud
```

### Fase 2: Docker Build & Push (10-30 min)
```
┌─ Setup (login to registries)
├─ API Gateway build            (3-10 min)
├─ Frontend build               (3-10 min)
├─ Services build (parallel)    (5-15 min)
└─ Push to registries           (1-3 min)
```

### Fase 3: Deploy Staging (5-15 min)
```
┌─ Setup kubectl
├─ Create namespace
├─ Deploy with Helm             (2-5 min)
├─ Wait rollout status          (2-5 min)
├─ Health checks                (30 sec)
└─ Notification
```

### Fase 4: Deploy Production (10-20 min)
```
┌─ Setup kubectl
├─ Create namespace
├─ Deploy with Helm             (5-10 min)
├─ Wait rollout status          (5-10 min)
├─ Health checks                (1-2 min)
├─ Create Release
└─ Notification
```

---

**Tiempo Total Estimado:**
- Feature → Staging: 30-60 minutos
- Tag → Production: 40-90 minutos
