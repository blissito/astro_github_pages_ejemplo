# 📚 Simple Documentation Generator - Tutorial Educativo

Un script educativo para aprender a automatizar la documentación con Claude Code. Perfecto para principiantes que quieren entender cómo funciona el scripting con IA.

## 🎯 ¿Qué Aprenderás?

Este proyecto te enseña:

- ✅ Cómo escanear archivos en un proyecto
- ✅ Integración básica con Claude Code CLI
- ✅ Manejo de archivos con Node.js
- ✅ Async/await y promesas
- ✅ Generación de documentación con IA

## 🚀 Inicio Rápido

### 1. Preparación

```bash
# Clona o crea el archivo
touch simple-doc-generator.js

# Hazlo ejecutable
chmod +x simple-doc-generator.js

# Instala Claude Code CLI (si no lo tienes)
npm install -g @anthropic-ai/claude-code
```

### 2. Configuración de API Key

```bash
# Configura tu API key de Anthropic
export ANTHROPIC_API_KEY="tu-api-key-aqui"
```

### 3. Uso Básico

```bash
# Ver ayuda
node simple-doc-generator.js --help

# Modo educativo (explica el proceso)
node simple-doc-generator.js --learn

# Generar documentación
node simple-doc-generator.js
```

## 🏗️ Estructura del Proyecto

```
mi-proyecto/
├── simple-doc-generator.js   # El script principal
├── docs/                      # Carpeta de salida
│   ├── README.md             # Índice generado
│   ├── archivo1.md           # Doc de archivo1.js
│   └── archivo2.md           # Doc de archivo2.js
└── src/                      # Tu código fuente
    ├── archivo1.js
    └── archivo2.js
```

## 💡 Tips para Principiantes

- Empieza con un proyecto pequeño de 2-3 archivos
- Lee los errores con atención
- Revisa y ajusta la documentación generada
- Experimenta con diferentes prompts para mejorar los resultados

## 🚀 Próximos Pasos

1. Personalizar tipos de archivo
2. Modificar prompts de documentación
3. Agregar estadísticas de código
4. Integrar con flujos de trabajo de Git

---

_Creado con ❤️ para el Taller de Claude Code Power Users_
