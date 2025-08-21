#!/bin/bash

# Script de instalación de hooks para el sistema de generación automática de PDFs
# Instala hooks para Claude Code, Git y sistema de archivos

echo "🚀 Instalador de Hooks para Generación Automática de PDFs"
echo "========================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar dependencias
check_dependency() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 no está instalado${NC}"
        return 1
    else
        echo -e "${GREEN}✅ $1 encontrado${NC}"
        return 0
    fi
}

echo -e "\n📋 Verificando dependencias..."
check_dependency python3
check_dependency git

# Hacer ejecutables los scripts
echo -e "\n🔧 Configurando permisos..."
chmod +x claude_md_hook.py
chmod +x subagent_pdf_generator.py
chmod +x invoke_subagent.py
echo -e "${GREEN}✅ Permisos configurados${NC}"

# 1. Instalar hook de Claude Code
echo -e "\n📦 Instalando hook de Claude Code..."
mkdir -p .claude/hooks

cat > .claude/hooks/post-edit.sh << 'EOF'
#!/bin/bash
# Hook de Claude Code - Se ejecuta después de editar archivos

# Verificar si CLAUDE.md fue modificado
if [[ "$1" == *"CLAUDE.md"* ]]; then
    echo "🔄 CLAUDE.md modificado - Regenerando PDF..."
    python3 claude_md_hook.py --once --output docs/CLAUDE_latest.pdf &
fi
EOF

chmod +x .claude/hooks/post-edit.sh
echo -e "${GREEN}✅ Hook de Claude Code instalado${NC}"

# 2. Instalar Git hooks
echo -e "\n📦 Instalando Git hooks..."
if [ -d ".git" ]; then
    # Post-commit hook
    cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
# Git post-commit hook - Regenera PDF si CLAUDE.md cambió

# Verificar si CLAUDE.md está en el commit
if git diff-tree --no-commit-id --name-only -r HEAD | grep -q "CLAUDE.md"; then
    echo "🔄 CLAUDE.md committeado - Regenerando PDF..."
    python3 claude_md_hook.py --once --output docs/CLAUDE_latest.pdf
    
    # Notificar al usuario
    echo "📄 PDF actualizado en docs/CLAUDE_latest.pdf"
fi
EOF
    
    chmod +x .git/hooks/post-commit
    
    # Pre-push hook (opcional)
    cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash
# Git pre-push hook - Asegura que el PDF esté actualizado antes de push

# Verificar si CLAUDE.md ha cambiado desde el último PDF
if python3 claude_md_hook.py --status | grep -q "has_changed"; then
    echo "⚠️ CLAUDE.md ha cambiado. Regenerando PDF antes del push..."
    python3 claude_md_hook.py --once --output docs/CLAUDE_latest.pdf
    git add docs/CLAUDE_latest.pdf
    git commit -m "🤖 Auto-update PDF documentation"
fi
EOF
    
    chmod +x .git/hooks/pre-push
    echo -e "${GREEN}✅ Git hooks instalados${NC}"
else
    echo -e "${YELLOW}⚠️ No se encontró repositorio Git${NC}"
fi

# 3. Crear directorio para PDFs generados
echo -e "\n📁 Creando estructura de directorios..."
mkdir -p docs/generated
echo -e "${GREEN}✅ Directorio docs/generated creado${NC}"

# 4. Configurar cron job (opcional)
echo -e "\n⏰ ¿Deseas configurar un cron job para verificación periódica? (s/n)"
read -r response
if [[ "$response" == "s" ]]; then
    # Agregar entrada a crontab
    CRON_CMD="*/30 * * * * cd $(pwd) && python3 claude_md_hook.py --once --output docs/CLAUDE_scheduled.pdf"
    
    # Verificar si ya existe
    if crontab -l 2>/dev/null | grep -q "claude_md_hook.py"; then
        echo -e "${YELLOW}⚠️ Ya existe un cron job para claude_md_hook.py${NC}"
    else
        (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
        echo -e "${GREEN}✅ Cron job configurado (cada 30 minutos)${NC}"
    fi
fi

# 5. Crear script de systemd (opcional para Linux)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo -e "\n🐧 ¿Deseas crear un servicio systemd? (s/n)"
    read -r response
    if [[ "$response" == "s" ]]; then
        cat > claude-md-watcher.service << EOF
[Unit]
Description=Claude MD Watcher - Auto PDF Generator
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/python3 $(pwd)/claude_md_hook.py --watch --interval 10
Restart=always

[Install]
WantedBy=multi-user.target
EOF
        
        echo -e "${YELLOW}Para instalar el servicio, ejecuta:${NC}"
        echo "sudo cp claude-md-watcher.service /etc/systemd/system/"
        echo "sudo systemctl enable claude-md-watcher"
        echo "sudo systemctl start claude-md-watcher"
    fi
fi

# 6. Crear configuración de VS Code (opcional)
echo -e "\n💻 ¿Deseas configurar VS Code para auto-generar PDFs? (s/n)"
read -r response
if [[ "$response" == "s" ]]; then
    mkdir -p .vscode
    cat > .vscode/tasks.json << 'EOF'
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Generate PDF from CLAUDE.md",
            "type": "shell",
            "command": "python3",
            "args": [
                "claude_md_hook.py",
                "--once",
                "--output",
                "docs/CLAUDE_vscode.pdf"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "presentation": {
                "reveal": "always",
                "panel": "new"
            },
            "problemMatcher": []
        }
    ]
}
EOF
    
    # Agregar keybinding
    cat > .vscode/keybindings.json << 'EOF'
[
    {
        "key": "ctrl+shift+p",
        "command": "workbench.action.tasks.runTask",
        "args": "Generate PDF from CLAUDE.md"
    }
]
EOF
    
    echo -e "${GREEN}✅ VS Code configurado (Ctrl+Shift+P para generar PDF)${NC}"
fi

# 7. Test inicial
echo -e "\n🧪 Ejecutando test inicial..."
python3 claude_md_hook.py --once --output test_initial.pdf

if [ -f "test_initial.pdf" ]; then
    echo -e "${GREEN}✅ Test exitoso - PDF generado correctamente${NC}"
    rm test_initial.pdf
else
    echo -e "${RED}❌ Error en el test inicial${NC}"
fi

# Resumen final
echo -e "\n${GREEN}===============================================${NC}"
echo -e "${GREEN}🎉 Instalación completada exitosamente${NC}"
echo -e "${GREEN}===============================================${NC}"
echo ""
echo "📋 Hooks instalados:"
echo "  • Claude Code: .claude/hooks/post-edit.sh"
[ -d ".git" ] && echo "  • Git post-commit: .git/hooks/post-commit"
[ -d ".git" ] && echo "  • Git pre-push: .git/hooks/pre-push"
echo ""
echo "🎮 Comandos disponibles:"
echo "  • Verificar una vez: python3 claude_md_hook.py --once"
echo "  • Modo observador: python3 claude_md_hook.py --watch"
echo "  • Ver estado: python3 claude_md_hook.py --status"
echo "  • Generar PDF manual: python3 subagent_pdf_generator.py --mode interactive"
echo ""
echo "📝 Próximos pasos:"
echo "  1. Edita CLAUDE.md para probar la generación automática"
echo "  2. Haz commit para probar el Git hook"
echo "  3. Usa 'python3 claude_md_hook.py --watch' para monitoreo continuo"
echo ""
echo "¡Happy coding! 🚀"