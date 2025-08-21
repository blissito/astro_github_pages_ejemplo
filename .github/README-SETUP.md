# 🤖 GitHub Action: README Generator

Este repositorio incluye una GitHub Action que automáticamente genera `README.md` desde `CLAUDE.md`.

## 🔧 Configuración inicial (solo una vez)

### 1. Configurar API Key de Anthropic

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Clic en "New repository secret"
4. Nombre: `ANTHROPIC_API_KEY`
5. Valor: Tu API key de Anthropic (sk-ant-...)
6. Clic en "Add secret"

### 2. Habilitar permisos de escritura

1. Ve a Settings → Actions → General
2. En "Workflow permissions" selecciona:
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"
3. Clic en "Save"

## 🚀 ¿Cómo funciona?

### Trigger automático:
- Cada vez que hagas push con cambios en `CLAUDE.md`
- El action se ejecuta automáticamente
- Genera `README.md` y `README.pdf`
- Hace commit de los archivos generados

### Trigger manual:
- Ve a Actions → "Auto-Generate README from CLAUDE.md"
- Clic en "Run workflow"

## 📝 Workflow completo:

1. **Detecta cambios** en `CLAUDE.md`
2. **Instala dependencias** (Python, Claude CLI)
3. **Ejecuta el script** Python
4. **Genera README.md** usando Claude AI
5. **Genera README.pdf** 
6. **Hace commit** automático de los archivos
7. **Push** al repositorio

## 🎯 Beneficios:

- ✅ **Automático**: Sin intervención manual
- ✅ **Consistente**: Mismo proceso siempre
- ✅ **Colaborativo**: Funciona para todos los contribuidores
- ✅ **Historial**: Todos los cambios quedan registrados
- ✅ **Sin dependencias locales**: Todo en la nube

## 🔍 Troubleshooting:

Si el action falla:

1. **Verifica la API key** en Settings → Secrets
2. **Revisa los logs** en la pestaña Actions
3. **Verifica permisos** en Settings → Actions → General

## 📊 Monitoreo:

Puedes ver el estado del action en:
- **Badge de estado** (si agregas uno al README)
- **Pestaña Actions** del repositorio
- **Commits automáticos** con el mensaje "🤖 Auto-update README..."