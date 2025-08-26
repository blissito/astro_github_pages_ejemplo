# Git Subtrees - Ejemplo Práctico Simple

## ¿Qué son los Git Subtrees?

Los Git Subtrees permiten incluir un repositorio como subdirectorio de otro repositorio, manteniendo la capacidad de hacer cambios y sincronizar con el repositorio original.

## Caso de Uso del Ejemplo

Imaginemos que tenemos:
- **Repositorio principal**: `mi-app` (nuestra aplicación principal)
- **Repositorio externo**: `shared-components` (componentes reutilizables)

Queremos incluir `shared-components` dentro de `mi-app` para usar los componentes, pero también poder contribuir cambios de vuelta.

## Comandos Esenciales (en orden de uso)

### 1. Agregar un Subtree (Primera vez)

```bash
# Sintaxis básica:
git subtree add --prefix=carpeta-destino URL-repositorio rama --squash

# Ejemplo práctico:
git subtree add --prefix=src/shared-components https://github.com/usuario/shared-components.git main --squash
```

**¿Qué hace?**
- `--prefix`: Especifica dónde se ubicará el subtree en tu repo
- `--squash`: Comprime toda la historia en un solo commit (recomendado)
- `main`: La rama del repositorio externo que quieres incluir

### 2. Actualizar el Subtree (Pull)

```bash
# Sintaxis básica:
git subtree pull --prefix=carpeta-destino URL-repositorio rama --squash

# Ejemplo práctico:
git subtree pull --prefix=src/shared-components https://github.com/usuario/shared-components.git main --squash
```

**¿Cuándo usar?**
- Cuando el repositorio externo tiene cambios nuevos
- Para sincronizar tu copia local con la versión más reciente

### 3. Enviar cambios al Subtree (Push)

```bash
# Sintaxis básica:
git subtree push --prefix=carpeta-destino URL-repositorio rama

# Ejemplo práctico:
git subtree push --prefix=src/shared-components https://github.com/usuario/shared-components.git main
```

**¿Cuándo usar?**
- Cuando haces cambios en el subtree y quieres contribuir de vuelta
- Para compartir mejoras con el repositorio original

## Flujo de Trabajo Típico

### Setup Inicial (Solo una vez)
1. **Agregar el subtree**: `git subtree add...`
2. **Commit**: Los cambios se agregan automáticamente

### Trabajo Diario
1. **Actualizar desde remoto**: `git subtree pull...`
2. **Hacer cambios** en los archivos del subtree
3. **Commit local**: `git add . && git commit -m "..."` 
4. **Push a tu repo**: `git push origin main`
5. **Contribuir de vuelta**: `git subtree push...` (opcional)

## Ventajas vs Submodules

| Git Subtrees | Git Submodules |
|--------------|----------------|
| ✅ Archivos están directamente en el repo | ❌ Referencias externas complejas |
| ✅ Un solo `git clone` incluye todo | ❌ Requiere `git submodule init/update` |
| ✅ Workflows más simples | ❌ Más comandos para recordar |
| ❌ Historia del repo más grande | ✅ Historia limpia |

## Tips para Usar con Claude Code

### 1. Guardar comandos en CLAUDE.md
```markdown
# Git Subtrees Commands
- Add: `git subtree add --prefix=src/components git@github.com:mi-org/components.git main --squash`
- Pull: `git subtree pull --prefix=src/components git@github.com:mi-org/components.git main --squash`  
- Push: `git subtree push --prefix=src/components git@github.com:mi-org/components.git main`
```

### 2. Crear alias útiles
```bash
# En tu ~/.gitconfig
[alias]
    sbt-add = !git subtree add --prefix=$1 $2 main --squash
    sbt-pull = !git subtree pull --prefix=$1 $2 main --squash  
    sbt-push = !git subtree push --prefix=$1 $2 main
```

### 3. Usar scripts automatizados
```bash
#!/bin/bash
# sync-subtrees.sh
echo "Actualizando shared-components..."
git subtree pull --prefix=src/shared-components https://github.com/usuario/shared-components.git main --squash

echo "Actualizando utils..."
git subtree pull --prefix=src/utils https://github.com/usuario/utils.git main --squash
```

## Ejemplo Práctico Paso a Paso

### Paso 1: Setup inicial
```bash
# En tu repositorio principal
cd mi-app

# Agregar el subtree
git subtree add --prefix=components https://github.com/ejemplo/ui-components.git main --squash

# Ya tienes los archivos en /components/
```

### Paso 2: Hacer cambios locales
```bash
# Editar archivos en components/
vim components/Button.js

# Commit normal
git add .
git commit -m "Mejorar componente Button"
git push origin main
```

### Paso 3: Contribuir de vuelta
```bash
# Enviar cambios al repositorio original
git subtree push --prefix=components https://github.com/ejemplo/ui-components.git main
```

### Paso 4: Mantenerse actualizado
```bash
# Obtener cambios del repositorio externo
git subtree pull --prefix=components https://github.com/ejemplo/ui-components.git main --squash
```

## ¿Cuándo usar Subtrees?

**✅ Ideal para:**
- Librerías propias que quieres reutilizar
- Componentes compartidos entre proyectos
- Código que modificas frecuentemente
- Equipos pequeños con control total

**❌ No ideal para:**
- Dependencias de terceros (usa npm/pip/etc.)
- Repositorios que cambias muy poco
- Equipos grandes con permisos complejos

## Comandos de Memoria Rápida

```bash
# Los 3 comandos esenciales (memorizar estos)
git subtree add --prefix=CARPETA REPO RAMA --squash     # Primera vez
git subtree pull --prefix=CARPETA REPO RAMA --squash    # Actualizar
git subtree push --prefix=CARPETA REPO RAMA             # Contribuir
```

¡Con estos 3 comandos puedes hacer el 90% del trabajo con subtrees!