# 🔐 Configuración de Secrets en GitHub

Este documento explica cómo configurar los secrets necesarios para que el workflow de GitHub Actions funcione correctamente.

## 📋 Secrets Requeridos

### 1. ANTHROPIC_API_KEY (Opcional)
Si tu script necesita usar la API de Anthropic para algún procesamiento adicional.

## 🚀 Cómo Configurar los Secrets

### Método 1: Desde la Interfaz Web de GitHub

1. **Ve a tu repositorio en GitHub**
   - URL: `https://github.com/TU_USUARIO/TU_REPOSITORIO`

2. **Accede a Settings (Configuración)**
   - Click en la pestaña `Settings` en la parte superior del repositorio

3. **Ve a Secrets and variables**
   - En el menú lateral izquierdo, busca `Secrets and variables`
   - Click en `Actions`

4. **Agrega un nuevo secret**
   - Click en el botón verde `New repository secret`

5. **Configura ANTHROPIC_API_KEY** (si lo necesitas)
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-...` (tu clave API de Anthropic)
   - Click en `Add secret`

### Método 2: Usando GitHub CLI

Si tienes GitHub CLI instalado (`gh`), puedes configurar los secrets desde la terminal:

```bash
# Instalar GitHub CLI si no lo tienes
# Mac:
brew install gh

# Linux/WSL:
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Autenticarte
gh auth login

# Configurar el secret (reemplaza con tu clave real)
gh secret set ANTHROPIC_API_KEY --body "sk-ant-api03-tu-clave-aqui"
```

## 🔍 Verificar que los Secrets están Configurados

### Desde la Web:
1. Ve a `Settings` > `Secrets and variables` > `Actions`
2. Deberías ver los secrets listados (el valor estará oculto)

### Desde GitHub CLI:
```bash
gh secret list
```

## 📝 Notas Importantes

### Sobre GITHUB_TOKEN:
- **NO necesitas configurar `GITHUB_TOKEN`** como secret
- GitHub lo proporciona automáticamente en cada workflow
- Tiene permisos para leer el repo y hacer push (con los permisos correctos)

### Sobre la Seguridad:
- Los secrets son **encriptados** y solo están disponibles durante la ejecución del workflow
- **NUNCA** se muestran en los logs
- **NUNCA** commits directamente las claves en el código
- Los secrets no están disponibles para pull requests de forks externos

### Si NO necesitas Anthropic API:
Si tu script `generate_kids_readme.py` no necesita la API de Anthropic (que parece ser el caso), puedes:
1. No configurar el secret `ANTHROPIC_API_KEY`
2. El workflow funcionará perfectamente sin él

## 🧪 Probar el Workflow

### Ejecución Manual:
1. Ve a la pestaña `Actions` en tu repositorio
2. Selecciona el workflow `Update Kids README`
3. Click en `Run workflow`
4. Selecciona la branch (main/master)
5. Click en el botón verde `Run workflow`

### Ejecución Automática:
El workflow se ejecutará automáticamente cuando:
- Hagas cambios a cualquier archivo `CLAUDE.md`
- Modifiques el script `generate_kids_readme.py`
- Diariamente a las 8:00 AM UTC

## 🐛 Troubleshooting

### El workflow falla con "Permission denied"
- Verifica que en `Settings` > `Actions` > `General`
- En "Workflow permissions" selecciona: `Read and write permissions`

### No se genera el README_KIDS.md
- Verifica que el script `generate_kids_readme.py` esté en la raíz del repositorio
- Revisa los logs del workflow en la pestaña Actions

### Los cambios no se pushean
- Asegúrate de que la branch tiene protección que permite GitHub Actions
- Verifica los permisos del workflow

## 📚 Recursos Adicionales

- [Documentación de GitHub Actions](https://docs.github.com/en/actions)
- [Documentación de Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub CLI](https://cli.github.com/)

---

💡 **Tip:** Si solo necesitas generar el README basándose en los archivos CLAUDE.md y no necesitas hacer llamadas a APIs externas, no necesitas configurar ningún secret adicional. El workflow funcionará con los permisos por defecto de GitHub.