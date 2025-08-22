# 🔐 Configurar ANTHROPIC_API_KEY de Forma Segura

## ⚠️ NUNCA hagas esto:
- ❌ NO incluyas la API key en tu código
- ❌ NO la compartas en mensajes
- ❌ NO la subas a GitHub sin encriptar

## ✅ Configuración Segura en GitHub Actions

### Opción 1: Desde la Web de GitHub (Recomendado)

1. **Ve a tu repositorio en GitHub**
   ```
   https://github.com/TU_USUARIO/taller
   ```

2. **Accede a Settings**
   - Click en `Settings` (configuración del repo)

3. **Ve a Secrets**
   - En el menú lateral: `Secrets and variables` → `Actions`

4. **Crea el Secret**
   - Click en `New repository secret`
   - **Name:** `ANTHROPIC_API_KEY`
   - **Secret:** `sk-ant-api03-TU_CLAVE_AQUI`
   - Click en `Add secret`

### Opción 2: Usando GitHub CLI

```bash
# NO ejecutes esto con tu clave real en la terminal
# Mejor usa este método interactivo:

gh secret set ANTHROPIC_API_KEY

# Te pedirá la clave de forma segura sin mostrarla
```

### Opción 3: Desde un archivo temporal

```bash
# Crea un archivo temporal con la clave
echo "sk-ant-api03-TU_CLAVE" > /tmp/anthropic_key.txt

# Configura el secret desde el archivo
gh secret set ANTHROPIC_API_KEY < /tmp/anthropic_key.txt

# IMPORTANTE: Elimina el archivo inmediatamente
rm /tmp/anthropic_key.txt
```

## 🔍 Verificar que está configurado

```bash
# Lista los secrets (no muestra valores)
gh secret list
```

Deberías ver:
```
ANTHROPIC_API_KEY  Updated 2024-08-21
```

## 📝 Usar el Secret en tu Workflow

En tu workflow `.github/workflows/update-kids-readme.yml`:

```yaml
- name: Run script with API Key
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: |
    python3 generate_kids_readme.py
```

## 🛡️ Mejores Prácticas de Seguridad

1. **Rotación de Keys**
   - Cambia tus API keys regularmente
   - Si sospechas que se comprometió, revócala inmediatamente

2. **Principio de Menor Privilegio**
   - Usa API keys con los permisos mínimos necesarios
   - Crea keys separadas para diferentes proyectos

3. **Monitoreo**
   - Revisa regularmente el uso de tus API keys
   - Configura alertas de uso anormal

4. **En Desarrollo Local**
   ```bash
   # Usa un archivo .env (NUNCA lo subas a git)
   echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
   
   # Agrega .env a .gitignore
   echo ".env" >> .gitignore
   ```

## 🚨 Si tu Key fue Comprometida

1. **Revoca inmediatamente** en console.anthropic.com
2. **Genera una nueva key**
3. **Actualiza** todos los lugares donde la usabas
4. **Revisa** los logs de uso para detectar acceso no autorizado

## 📚 Recursos

- [Documentación de GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Anthropic Console](https://console.anthropic.com)
- [Mejores prácticas de seguridad](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

⚠️ **Recordatorio**: NUNCA compartas tu API key real en ningún lugar público o sin encriptar.