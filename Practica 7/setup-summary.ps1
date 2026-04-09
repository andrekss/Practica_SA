#!/usr/bin/env powershell

# CI/CD Setup Summary Script for Windows/PowerShell

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                            ║" -ForegroundColor Cyan
Write-Host "║                  🎉 PRÁCTICA 7: CI/CD - SETUP COMPLETO                   ║" -ForegroundColor Green
Write-Host "║                                                                            ║" -ForegroundColor Cyan
Write-Host "║               ✅ Todos los archivos han sido creados                       ║" -ForegroundColor Green
Write-Host "║                                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 RESUMEN DE LO CREADO:" -ForegroundColor Yellow
Write-Host ("━" * 80)
Write-Host ""

Write-Host "✅ WORKFLOWS (4 workflows completamente funcionales)" -ForegroundColor Green
Write-Host "   ├─ .github/workflows/ci-build.yml              (Validación)"
Write-Host "   ├─ .github/workflows/docker-build-push.yml    (Docker)"
Write-Host "   ├─ .github/workflows/deploy.yml                (Deploy)"
Write-Host "   └─ .github/workflows/release.yml               (Releases)"
Write-Host ""

Write-Host "✅ CONFIGURACIÓN (.github)" -ForegroundColor Green
Write-Host "   ├─ .github/pull_request_template.md           (Template PRs)"
Write-Host "   ├─ .github/dependabot.yml                     (Auto-updates)"
Write-Host "   └─ .github/workflows/                         (Workflows)"
Write-Host ""

Write-Host "✅ KUBERNETES & HELM (k8s)" -ForegroundColor Green
Write-Host "   ├─ k8s/Chart.yaml                            (Helm metadata)"
Write-Host "   ├─ k8s/values-staging.yaml                   (Config staging)"
Write-Host "   └─ k8s/values-production.yaml                (Config prod)"
Write-Host ""

Write-Host "✅ SCRIPTS AUXILIARES (scripts)" -ForegroundColor Green
Write-Host "   ├─ scripts/build.sh                          (Build local)"
Write-Host "   ├─ scripts/test.sh                           (Tests local)"
Write-Host "   ├─ scripts/lint.sh                           (Linting local)"
Write-Host "   ├─ scripts/docker-build.sh                   (Docker local)"
Write-Host "   └─ scripts/k8s-deploy.sh                     (Deploy local)"
Write-Host ""

Write-Host "✅ DOCUMENTACIÓN (9 archivos markdown)" -ForegroundColor Green
Write-Host "   ├─ 🌟 COMIENZA_AQUI.md                       (Índice principal)"
Write-Host "   ├─ 🌟 QUICKSTART.md                          (Guía 15 min)"
Write-Host "   ├─ SETUP_GITHUB.md                           (Setup paso a paso)"
Write-Host "   ├─ CICD_DOCUMENTATION.md                    (Técnica)"
Write-Host "   ├─ PIPELINE_DIAGRAM.md                       (Diagramas)"
Write-Host "   ├─ ENVIRONMENT_VARIABLES.md                  (Variables)"
Write-Host "   ├─ RESUMEN_COMPLETO.md                       (Resumen)"
Write-Host "   ├─ P7_README.md                              (README)"
Write-Host "   └─ README.md                                 (Proyecto)"
Write-Host ""

Write-Host "━" * 80 -ForegroundColor Yellow
Write-Host ""

Write-Host "🚀 PRÓXIMOS PASOS (15 MINUTOS):" -ForegroundColor Yellow
Write-Host ("━" * 80)
Write-Host ""

Write-Host "1️⃣  LEER DOCUMENTACIÓN" -ForegroundColor Cyan
Write-Host "    📖 archivo: COMIENZA_AQUI.md"
Write-Host ""

Write-Host "2️⃣  CONFIGURAR SECRETS EN GITHUB (5 min)" -ForegroundColor Cyan
Write-Host "    🔑 GitHub → Settings → Secrets and variables → Actions"
Write-Host "    "
Write-Host "    Agregar 3 secrets:"
Write-Host "    ├─ DOCKERHUB_USERNAME"
Write-Host "    ├─ DOCKERHUB_TOKEN (generar en Docker Hub)"
Write-Host "    └─ DOMAIN"
Write-Host ""

Write-Host "3️⃣  HACER PRIMER COMMIT (1 min)" -ForegroundColor Cyan
Write-Host "    PS> cd 'Practica 7'"
Write-Host "    PS> git add ."
Write-Host "    PS> git commit -m 'ci: activate CI/CD'"
Write-Host "    PS> git push origin main"
Write-Host ""

Write-Host "4️⃣  VER PIPELINE EJECUTAR (10 min)" -ForegroundColor Cyan
Write-Host "    ✅ GitHub → Actions → CI - Build & Test"
Write-Host ""

Write-Host "5️⃣  PROTEGER BRANCH MAIN (2 min)" -ForegroundColor Cyan
Write-Host "    ✅ GitHub → Settings → Branches"
Write-Host ""

Write-Host "━" * 80 -ForegroundColor Yellow
Write-Host ""

Write-Host "📚 ORDEN DE LECTURA:" -ForegroundColor Yellow
Write-Host ("━" * 80)
Write-Host ""

Write-Host "NIVEL 1: EMPEZAR (15-30 min)" -ForegroundColor Cyan
Write-Host "1. COMIENZA_AQUI.md ............... (5 min)   ← TÚ ESTÁS AQUÍ"
Write-Host "2. QUICKSTART.md .................. (15 min)  ← LEE ESTO AHORA"
Write-Host "3. SETUP_GITHUB.md ............... (30 min)"
Write-Host ""

Write-Host "NIVEL 2: ENTENDER (45-60 min)" -ForegroundColor Cyan
Write-Host "4. CICD_DOCUMENTATION.md ......... (45 min)"
Write-Host "5. PIPELINE_DIAGRAM.md .......... (15 min)"
Write-Host ""

Write-Host "NIVEL 3: PROFUNDIZAR (según necesidad)" -ForegroundColor Cyan
Write-Host "6. ENVIRONMENT_VARIABLES.md ..... (15 min)"
Write-Host "7. P7_README.md .................. (20 min)"
Write-Host ""

Write-Host "━" * 80 -ForegroundColor Yellow
Write-Host ""

Write-Host "✨ ESTADO DEL PROYECTO:" -ForegroundColor Yellow
Write-Host ("━" * 80)
Write-Host ""

Write-Host -NoNewline "✅ Workflows creados               "
Write-Host "[ LISTO ]" -ForegroundColor Green
Write-Host -NoNewline "✅ Documentación completa          "
Write-Host "[ LISTO ]" -ForegroundColor Green
Write-Host -NoNewline "✅ Scripts preparados              "
Write-Host "[ LISTO ]" -ForegroundColor Green
Write-Host -NoNewline "✅ Kubernetes config              "
Write-Host "[ LISTO ]" -ForegroundColor Green
Write-Host -NoNewline "❌ Secrets en GitHub              "
Write-Host "[ TÚ HACES ]" -ForegroundColor Yellow
Write-Host -NoNewline "❌ Primer push                     "
Write-Host "[ TÚ HACES ]" -ForegroundColor Yellow
Write-Host ""

Write-Host "━" * 80 -ForegroundColor Yellow
Write-Host ""

Write-Host "📁 UBICACIÓN:" -ForegroundColor Yellow
Write-Host "   $(Get-Location)"
Write-Host ""

Write-Host "📂 ARCHIVOS CREADOS:" -ForegroundColor Yellow
Write-Host "   ├─ .github/workflows/ (4 workflows)"
Write-Host "   ├─ k8s/ (Kubernetes config)"
Write-Host "   ├─ scripts/ (5 scripts auxiliares)"
Write-Host "   └─ 📖 Documentación (9 archivos)"
Write-Host ""

Write-Host "━" * 80 -ForegroundColor Yellow
Write-Host ""

Write-Host "╔════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                            ║" -ForegroundColor Cyan
Write-Host "║  👉 PRÓXIMO PASO: Lee QUICKSTART.md (15 minutos)                         ║" -ForegroundColor Green
Write-Host "║                                                                            ║" -ForegroundColor Cyan
Write-Host "║  Creado con ❤️ para Prácticas SA • 2024                                  ║" -ForegroundColor Cyan
Write-Host "║                                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
