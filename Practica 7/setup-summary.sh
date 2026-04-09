#!/usr/bin/env bash

# CI/CD Setup Summary Script
# Display what has been created

clear

cat << "EOF"
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    🎉 PRÁCTICA 7: CI/CD - SETUP COMPLETO                   ║
║                                                                              ║
║                  ✅ Todos los archivos han sido creados                      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 RESUMEN DE LO CREADO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ WORKFLOWS (4 workflows completamente funcionales)
   ├─ .github/workflows/ci-build.yml              (Validación: lint, build, test)
   ├─ .github/workflows/docker-build-push.yml    (Docker build & push)
   ├─ .github/workflows/deploy.yml                (Deploy a Kubernetes)
   └─ .github/workflows/release.yml               (GitHub releases)

✅ CONFIGURACIÓN (.github)
   ├─ .github/pull_request_template.md           (Template de PRs)
   ├─ .github/dependabot.yml                     (Auto-updates de dependencias)
   └─ .github/workflows/                         (Directorio de workflows)

✅ KUBERNETES & HELM (k8s)
   ├─ k8s/Chart.yaml                            (Helm chart metadata)
   ├─ k8s/values-staging.yaml                   (Config staging - 2 replicas)
   └─ k8s/values-production.yaml                (Config producción - 3 replicas)

✅ SCRIPTS AUXILIARES (scripts)
   ├─ scripts/build.sh                          (Build local)
   ├─ scripts/test.sh                           (Tests local)
   ├─ scripts/lint.sh                           (Linting local)
   ├─ scripts/docker-build.sh                   (Docker build local)
   └─ scripts/k8s-deploy.sh                     (Deploy local a K8s)

✅ DOCUMENTACIÓN (9 archivos markdown)
   ├─ 🌟 COMIENZA_AQUI.md                       (Índice principal)
   ├─ 🌟 QUICKSTART.md                          (Guía rápida 15 min)
   ├─ SETUP_GITHUB.md                           (Configuración paso a paso)
   ├─ CICD_DOCUMENTATION.md                    (Documentación técnica completa)
   ├─ PIPELINE_DIAGRAM.md                       (Diagramas visuales)
   ├─ ENVIRONMENT_VARIABLES.md                  (Variables de entorno)
   ├─ RESUMEN_COMPLETO.md                       (Resumen completo)
   ├─ P7_README.md                              (README principal)
   └─ README.md                                 (README del proyecto)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 PRÓXIMOS PASOS (15 MINUTOS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  LEER DOCUMENTACIÓN
    📖 Abre: COMIENZA_AQUI.md (este archivo es tu guía)

2️⃣  CONFIGURAR SECRETS EN GITHUB (5 min)
    🔑 GitHub → Settings → Secrets and variables → Actions
    
    Agregar 3 secrets OBLIGATORIOS:
    ├─ DOCKERHUB_USERNAME = tu-usuario-dockerhub
    ├─ DOCKERHUB_TOKEN = token-de-dockerhub
    └─ DOMAIN = tu-dominio.com

3️⃣  HACER PRIMER COMMIT (1 min)
    $ cd "Practica 7"
    $ git add .
    $ git commit -m "ci: activate CI/CD pipeline"
    $ git push origin main

4️⃣  VER PIPELINE EJECUTAR (10 min)
    ✅ GitHub → Actions → CI - Build & Test

5️⃣  PROTEGER BRANCH MAIN (2 min)
    ✅ GitHub → Settings → Branches → Add rule → main

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 ORDEN DE LECTURA RECOMENDADO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NIVEL 1: EMPEZAR (15-30 min)
1. 📖 COMIENZA_AQUI.md .................... (5 min)  ← TÚ ESTÁS AQUÍ
2. 🌟 QUICKSTART.md ....................... (15 min) ← LEE ESTO AHORA
3. ⚙️  SETUP_GITHUB.md .................... (30 min)

NIVEL 2: ENTENDER (45-60 min)
4. 📊 CICD_DOCUMENTATION.md .............. (45 min)
5. 🎨 PIPELINE_DIAGRAM.md ............... (15 min)

NIVEL 3: PROFUNDIZAR (según necesidad)
6. 🔧 ENVIRONMENT_VARIABLES.md .......... (15 min)
7. 📋 P7_README.md ....................... (20 min)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 FLUJO AUTOMÁTICO (Una vez configurado):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu código                                  ↓
        ├─ 🔵 CI Build & Test .................. (5-15 min) ✓
        ├─ 🐳 Docker Build & Push ............. (10-30 min) 🐳
        └─ 🚀 Deploy a Staging ................ (10-20 min) 🚀
                       ↓
              ✅ EN PRODUCCIÓN

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 ESTRUCTURA DEL PROYECTO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Practica 7/
├── .github/
│   └── workflows/ ..................... ✅ (4 workflows listos)
│
├── k8s/ ............................... ✅ (Kubernetes config)
│
├── scripts/ ........................... ✅ (5 scripts auxiliares)
│
├── [Microservicios Practica 4] ........ ✅ (Copiados automáticamente)
│
└── 📖 DOCUMENTACIÓN (9 archivos) ...... ✅ (Todos listos)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 HABILIDADES QUE GANARÁS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ GitHub Actions (CI/CD automation)
✓ Docker (containerización)
✓ Kubernetes (orquestación)
✓ Helm (package manager)
✓ Git workflows (features, releases, hotfixes)
✓ DevOps practices (testing, security, monitoring)
✓ Cloud deployment (staging & production)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 RECURSOS ÚTILES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 Documentación:
   https://docs.github.com/en/actions
   https://docs.docker.com
   https://kubernetes.io/docs
   https://helm.sh/docs

🔗 Links rápidos:
   GitHub Container Registry: ghcr.io
   Docker Hub: docker.io
   Kubernetes (local): kind o minikube

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ ESTADO DEL PROYECTO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Workflows creados
✅ Documentación completa
✅ Scripts preparados
✅ Kubernetes config
✅ GitHub templates
❌ Secrets en GitHub (TÚ HACES ESTO)
❌ Primer push (TÚ HACES ESTO)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 CHECKLIST FINAL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] 1. Leer COMIENZA_AQUI.md (este archivo)
[ ] 2. Leer QUICKSTART.md
[ ] 3. Crear 3 secrets en GitHub
[ ] 4. Hacer primer push
[ ] 5. Ver CI ejecutar
[ ] 6. Proteger branch main
[ ] 7. Crear primer tag v1.0.0 (opcional)
[ ] 8. Leer resto de documentación

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 ¡ADELANTE!

Tiempo para empezar: 15 minutos
Tiempo total setup: 1 hora
Impacto: TRANSFORMACIONAL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👉 SIGUIENTE: Abre QUICKSTART.md y comienza (15 minutos)

╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║          Creado con ❤️  para Prácticas SA • 2024 • v1.0.0                  ║
║                       ¡A trabajar se ha dicho!                              ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

EOF

echo ""
echo "📍 Ubicación actual:"
pwd
echo ""
echo "📂 Archivos creados:"
echo "   ├─ .github/workflows/ (4 workflows)"
echo "   ├─ k8s/ (Kubernetes config)"
echo "   ├─ scripts/ (5 scripts)"
echo "   └─ 📖 Documentación (9 archivos)"
echo ""
echo "👉 PRÓXIMO PASO: Lee QUICKSTART.md"
echo ""
