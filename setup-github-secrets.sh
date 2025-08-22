#!/bin/bash

# Script para configurar GitHub Secrets de forma segura
# NO EJECUTES ESTE SCRIPT TAL CUAL - Primero edítalo con tu información

echo "🔐 Configuración de GitHub Secrets"
echo "=================================="
echo ""

# Verificar si gh está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI no está instalado"
    echo ""
    echo "Instálalo con:"
    echo "  Mac: brew install gh"
    echo "  Linux: sudo apt install gh"
    echo "  Windows: winget install GitHub.cli"
    exit 1
fi

# Verificar autenticación
if ! gh auth status &> /dev/null; then
    echo "📝 Necesitas autenticarte en GitHub CLI"
    gh auth login
fi

echo "✅ GitHub CLI configurado"
echo ""

# Obtener información del repositorio
REPO=$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')
echo "📦 Repositorio detectado: $REPO"
echo ""

# Función para configurar un secret
configure_secret() {
    local SECRET_NAME=$1
    local SECRET_DESC=$2
    
    echo "🔧 Configurando $SECRET_NAME"
    echo "   $SECRET_DESC"
    echo ""
    
    # Verificar si el secret ya existe
    if gh secret list | grep -q "^$SECRET_NAME"; then
        echo "   ⚠️  El secret $SECRET_NAME ya existe"
        read -p "   ¿Deseas actualizarlo? (s/n): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Ss]$ ]]; then
            echo "   ⏭️  Saltando $SECRET_NAME"
            return
        fi
    fi
    
    # Pedir el valor del secret
    echo "   📝 Ingresa el valor para $SECRET_NAME:"
    echo "   (El valor no se mostrará por seguridad)"
    read -s SECRET_VALUE
    echo ""
    
    # Configurar el secret
    echo "$SECRET_VALUE" | gh secret set "$SECRET_NAME"
    
    if [ $? -eq 0 ]; then
        echo "   ✅ $SECRET_NAME configurado exitosamente"
    else
        echo "   ❌ Error configurando $SECRET_NAME"
    fi
    echo ""
}

# Menú principal
echo "¿Qué secrets deseas configurar?"
echo ""
echo "1) ANTHROPIC_API_KEY - Para usar la API de Claude"
echo "2) Todos los secrets"
echo "3) Salir"
echo ""
read -p "Selecciona una opción (1-3): " option

case $option in
    1)
        configure_secret "ANTHROPIC_API_KEY" "API Key de Anthropic para Claude"
        ;;
    2)
        configure_secret "ANTHROPIC_API_KEY" "API Key de Anthropic para Claude"
        # Agregar más secrets aquí si los necesitas en el futuro
        ;;
    3)
        echo "👋 Saliendo..."
        exit 0
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "🎉 Configuración completada"
echo ""
echo "📋 Secrets configurados:"
gh secret list
echo ""
echo "✅ Tu workflow de GitHub Actions está listo para usar"
echo ""
echo "🚀 Próximos pasos:"
echo "   1. Haz commit de los archivos .github/"
echo "   2. Push a GitHub"
echo "   3. El workflow se ejecutará automáticamente"
echo ""
echo "💡 Tip: Puedes ejecutar el workflow manualmente desde:"
echo "   https://github.com/$REPO/actions"