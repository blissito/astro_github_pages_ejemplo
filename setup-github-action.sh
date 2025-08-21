#!/bin/bash
# 🚀 Script para configurar GitHub Action automáticamente

set -e

echo "🚀 Configurando GitHub Action para README Generator"
echo "=================================================="

# 1. Verificar que tenemos gh CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) no encontrado"
    echo "🔧 Instala con: brew install gh"
    exit 1
fi

# 2. Verificar autenticación
echo "🔍 Verificando autenticación con GitHub..."
if ! gh auth status &> /dev/null; then
    echo "❌ No estás autenticado con GitHub"
    echo "🔧 Ejecuta: gh auth login"
    exit 1
fi

# 3. Solicitar API key de Anthropic
echo ""
echo "🔑 Configuración de API Key de Anthropic"
echo "-----------------------------------------"
echo "Necesitamos tu API key de Anthropic para que el Action funcione."
echo "Puedes obtenerla en: https://console.anthropic.com/settings/keys"
echo ""
read -s -p "📝 Ingresa tu API key de Anthropic (sk-ant-...): " ANTHROPIC_API_KEY
echo ""

# 4. Validar que la API key tiene el formato correcto
if [[ ! $ANTHROPIC_API_KEY =~ ^sk-ant- ]]; then
    echo "❌ La API key debe empezar con 'sk-ant-'"
    exit 1
fi

# 5. Crear repositorio en GitHub si no existe
echo "🔍 Verificando si el repositorio existe en GitHub..."
REPO_NAME=$(basename $(pwd))

if ! gh repo view &> /dev/null; then
    echo "📁 Creando repositorio en GitHub: $REPO_NAME"
    read -p "¿Es un repositorio público? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gh repo create "$REPO_NAME" --public --source=. --description="Tutorial educativo de Claude Code con generación automática de README"
    else
        gh repo create "$REPO_NAME" --private --source=. --description="Tutorial educativo de Claude Code con generación automática de README"
    fi
    
    # Configurar remote
    git remote add origin "https://github.com/$(gh api user --jq .login)/$REPO_NAME.git"
else
    echo "✅ Repositorio ya existe en GitHub"
fi

# 6. Configurar el secret
echo "🔐 Configurando secret ANTHROPIC_API_KEY..."
echo "$ANTHROPIC_API_KEY" | gh secret set ANTHROPIC_API_KEY

# 7. Verificar que el secret se configuró
echo "🔍 Verificando configuración del secret..."
if gh secret list | grep -q "ANTHROPIC_API_KEY"; then
    echo "✅ Secret ANTHROPIC_API_KEY configurado correctamente"
else
    echo "❌ Error configurando el secret"
    exit 1
fi

# 8. Hacer commit inicial y push
echo "📤 Haciendo commit inicial y push..."
git add .
git commit -m "🚀 Configuración inicial con GitHub Action para README generator

- ✅ GitHub Action configurada
- ✅ Secret ANTHROPIC_API_KEY añadido
- ✅ Workflow automático para generar README desde CLAUDE.md"

git push -u origin main

# 9. Resumen final
echo ""
echo "🎉 ¡Configuración completada!"
echo "=========================="
echo "✅ Repositorio creado/configurado en GitHub"
echo "✅ Secret ANTHROPIC_API_KEY configurado"
echo "✅ GitHub Action configurada"
echo "✅ Código enviado al repositorio"
echo ""
echo "🔗 Enlaces útiles:"
echo "   • Repositorio: $(gh repo view --web --json url --jq .url)"
echo "   • Actions: $(gh repo view --web --json url --jq .url)/actions"
echo "   • Settings: $(gh repo view --web --json url --jq .url)/settings"
echo ""
echo "🚀 Próximos pasos:"
echo "   1. El Action se ejecutará automáticamente cuando modifiques CLAUDE.md"
echo "   2. Puedes ejecutarlo manualmente desde la pestaña Actions"
echo "   3. Verifica que los permisos de escritura están habilitados en Settings → Actions"
echo ""
echo "📝 Para probar:"
echo "   • Modifica CLAUDE.md y haz push"
echo "   • O ejecuta: gh workflow run 'Auto-Generate README from CLAUDE.md'"