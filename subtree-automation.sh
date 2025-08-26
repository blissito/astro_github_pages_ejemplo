#!/bin/bash

# 🌳 Git Subtrees Automation Script
# Uso: ./subtree-automation.sh [add|pull|push|sync] [nombre-subtree]

set -e

# Configuración de subtrees (agregar aquí tus repositorios)
# Función para obtener configuración de subtree
get_subtree_config() {
    case $1 in
        components) echo "src/components https://github.com/ejemplo/ui-components.git main" ;;
        utils) echo "lib/utils https://github.com/ejemplo/shared-utils.git main" ;;
        docs) echo "documentation https://github.com/ejemplo/docs-template.git main" ;;
        *) echo "" ;;
    esac
}

# Lista de subtrees disponibles
SUBTREE_NAMES="components utils docs"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_help() {
    echo -e "${BLUE}🌳 Git Subtrees Manager${NC}"
    echo ""
    echo "Uso: $0 [comando] [subtree-name]"
    echo ""
    echo "Comandos disponibles:"
    echo "  add [name]    - Agregar un nuevo subtree"
    echo "  pull [name]   - Actualizar subtree desde remoto"
    echo "  push [name]   - Enviar cambios al repositorio remoto"
    echo "  sync [name]   - Pull + Push en un solo comando"
    echo "  list          - Mostrar subtrees configurados"
    echo "  help          - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 add components"
    echo "  $0 pull utils"
    echo "  $0 sync components"
    echo "  $0 list"
}

list_subtrees() {
    echo -e "${BLUE}📦 Subtrees Configurados:${NC}"
    echo ""
    for name in $SUBTREE_NAMES; do
        config=$(get_subtree_config "$name")
        if [[ -n "$config" ]]; then
            IFS=' ' read -r prefix repo branch <<< "$config"
            echo -e "  ${GREEN}$name${NC}"
            echo -e "    📁 Directorio: $prefix"
            echo -e "    🔗 Repositorio: $repo"
            echo -e "    🌿 Rama: $branch"
            echo ""
        fi
    done
}

execute_subtree_command() {
    local cmd=$1
    local name=$2
    
    config=$(get_subtree_config "$name")
    if [[ -z "$config" ]]; then
        echo -e "${RED}❌ Error: Subtree '$name' no encontrado${NC}"
        echo -e "${YELLOW}Subtrees disponibles:${NC} $SUBTREE_NAMES"
        exit 1
    fi
    
    IFS=' ' read -r prefix repo branch <<< "$config"
    
    echo -e "${BLUE}🚀 Ejecutando: $cmd para '$name'${NC}"
    echo -e "${YELLOW}📁 Directorio: $prefix${NC}"
    echo -e "${YELLOW}🔗 Repo: $repo${NC}"
    echo ""
    
    case $cmd in
        add)
            if [[ -d "$prefix" ]]; then
                echo -e "${RED}❌ Error: El directorio $prefix ya existe${NC}"
                exit 1
            fi
            echo -e "${GREEN}➕ Agregando subtree...${NC}"
            git subtree add --prefix="$prefix" "$repo" "$branch" --squash
            echo -e "${GREEN}✅ Subtree agregado exitosamente${NC}"
            ;;
        pull)
            if [[ ! -d "$prefix" ]]; then
                echo -e "${RED}❌ Error: El directorio $prefix no existe. Usa 'add' primero.${NC}"
                exit 1
            fi
            echo -e "${GREEN}⬇️ Actualizando desde remoto...${NC}"
            git subtree pull --prefix="$prefix" "$repo" "$branch" --squash
            echo -e "${GREEN}✅ Subtree actualizado exitosamente${NC}"
            ;;
        push)
            if [[ ! -d "$prefix" ]]; then
                echo -e "${RED}❌ Error: El directorio $prefix no existe${NC}"
                exit 1
            fi
            echo -e "${GREEN}⬆️ Enviando cambios al remoto...${NC}"
            git subtree push --prefix="$prefix" "$repo" "$branch"
            echo -e "${GREEN}✅ Cambios enviados exitosamente${NC}"
            ;;
        sync)
            if [[ ! -d "$prefix" ]]; then
                echo -e "${RED}❌ Error: El directorio $prefix no existe. Usa 'add' primero.${NC}"
                exit 1
            fi
            echo -e "${GREEN}🔄 Sincronizando (pull + push)...${NC}"
            git subtree pull --prefix="$prefix" "$repo" "$branch" --squash
            echo -e "${GREEN}⬇️ Pull completado${NC}"
            git subtree push --prefix="$prefix" "$repo" "$branch"
            echo -e "${GREEN}✅ Sincronización completada${NC}"
            ;;
        *)
            echo -e "${RED}❌ Comando desconocido: $cmd${NC}"
            print_help
            exit 1
            ;;
    esac
}

# Función para sincronizar todos los subtrees
sync_all() {
    echo -e "${BLUE}🔄 Sincronizando todos los subtrees...${NC}"
    echo ""
    
    for name in $SUBTREE_NAMES; do
        config=$(get_subtree_config "$name")
        if [[ -n "$config" ]]; then
            IFS=' ' read -r prefix repo branch <<< "$config"
            
            if [[ -d "$prefix" ]]; then
                echo -e "${GREEN}🔄 Sincronizando: $name${NC}"
                git subtree pull --prefix="$prefix" "$repo" "$branch" --squash
            else
                echo -e "${YELLOW}⚠️ Saltando $name (no existe localmente)${NC}"
            fi
        fi
    done
    
    echo -e "${GREEN}✅ Sincronización completa${NC}"
}

# Procesamiento de argumentos
case "${1:-help}" in
    add|pull|push|sync)
        if [[ -z "$2" ]]; then
            echo -e "${RED}❌ Error: Especifica el nombre del subtree${NC}"
            echo -e "${YELLOW}Ejemplo:${NC} $0 $1 components"
            list_subtrees
            exit 1
        fi
        execute_subtree_command "$1" "$2"
        ;;
    list)
        list_subtrees
        ;;
    sync-all)
        sync_all
        ;;
    help|--help|-h)
        print_help
        ;;
    *)
        echo -e "${RED}❌ Comando desconocido: $1${NC}"
        print_help
        exit 1
        ;;
esac