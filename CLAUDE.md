# 📚 Nuevo y extensa Documentation Generator - Tutorial Educativo

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

## 📖 Cómo Funciona (Explicación Simple)

### Paso 1: Escanear Archivos

```javascript
// El script busca todos los archivos .js y .jsx
async function getJavaScriptFiles() {
  // Recorre carpetas
  // Ignora node_modules
  // Devuelve lista de archivos
}
```

### Paso 2: Generar Documentación

```javascript
// Para cada archivo:
async function generateDocumentation(filePath) {
  // 1. Lee el archivo
  const code = await readFile(filePath);

  // 2. Crea un prompt para Claude
  const prompt = "Documenta este código...";

  // 3. Envía a Claude
  const docs = await claude(prompt);

  // 4. Devuelve la documentación
  return docs;
}
```

### Paso 3: Guardar Resultados

```javascript
// Guarda cada documentación
async function saveDocumentation(file, docs) {
  // Crea archivo .md
  // Agrega metadata
  // Guarda en carpeta docs/
}
```

## 🎓 Ejercicios de Aprendizaje

### Ejercicio 1: Personaliza los Tipos de Archivo

Modifica `CONFIG.fileTypes` para documentar archivos Python:

```javascript
fileTypes: [".py"];
```

### Ejercicio 2: Cambia el Prompt

Experimenta con diferentes prompts para Claude:

```javascript
const prompt = `
Explica este código como si fuera para un niño de 10 años...
`;
```

### Ejercicio 3: Agrega Estadísticas

Añade un contador de líneas de código:

```javascript
const lines = code.split("\n").length;
console.log(`Archivo tiene ${lines} líneas`);
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

### 1. Empieza Pequeño

Prueba con un proyecto de 2-3 archivos primero.

### 2. Lee los Errores

Si algo falla, el script te dirá qué pasó:

```bash
❌ Error documentando archivo.js: API key no configurada
```

### 3. Revisa la Documentación Generada

Claude no es perfecto. Siempre revisa y ajusta si es necesario.

### 4. Experimenta con Prompts

El prompt determina la calidad de la documentación:

```javascript
// Prompt básico
"Documenta este código"

// Prompt detallado (mejor)
"Genera documentación técnica incluyendo:
 - Propósito del archivo
 - Funciones con parámetros
 - Ejemplos de uso"
```

## 🔧 Personalización Fácil

### Cambiar la Carpeta de Salida

```javascript
const CONFIG = {
  outputDir: "./mi-documentacion", // Cambia aquí
};
```

### Ignorar Más Carpetas

```javascript
const CONFIG = {
  ignoreFolders: ["node_modules", ".git", "tests", "temp"],
};
```

### Agregar Más Tipos de Archivo

```javascript
const CONFIG = {
  fileTypes: [".js", ".jsx", ".ts", ".tsx", ".mjs"],
};
```

## 📊 Ejemplo de Salida

### Archivo Original (ejemplo.js):

```javascript
function saludar(nombre) {
  return `Hola, ${nombre}!`;
}

function sumar(a, b) {
  return a + b;
}
```

### Documentación Generada (ejemplo.md):

````markdown
# ejemplo.js

## Descripción

Este archivo contiene funciones utilitarias básicas.

## Funciones

### `saludar(nombre)`

Genera un saludo personalizado.

**Parámetros:**

- `nombre` (string): El nombre de la persona

**Retorna:** String con el saludo

**Ejemplo:**

```javascript
saludar("María"); // "Hola, María!"
```
````

### `sumar(a, b)`

Suma dos números.

**Parámetros:**

- `a` (number): Primer número
- `b` (number): Segundo número

**Retorna:** La suma de a + b

**Ejemplo:**

```javascript
sumar(5, 3); // 8
```

````

## 🐛 Solución de Problemas

### Error: "claude-code: command not found"
```bash
# Instala Claude Code CLI
npm install -g @anthropic-ai/claude-code
````

### Error: "API key not configured"

```bash
# Configura tu API key
export ANTHROPIC_API_KEY="sk-ant-..."
```

### Error: "No files found"

Verifica que:

- Estés en la carpeta correcta
- Tengas archivos .js o .jsx
- No todos estén en carpetas ignoradas

## 🚀 Siguiente Nivel

Una vez que domines este script básico, puedes:

1. **Agregar Caché**: Para no re-documentar archivos sin cambios
2. **Soporte Multi-idioma**: Documentar en diferentes lenguajes
3. **Integración con Git**: Documentar solo archivos modificados
4. **UI Web**: Crear una interfaz para ver la documentación
5. **Tests**: Agregar pruebas unitarias al generador

## 🤝 Ejercicio Final

Crea tu propia versión que:

1. Documente archivos CSS
2. Genere un resumen de estilos usados
3. Cree una guía de componentes visuales

**Pista inicial:**

```javascript
const CONFIG = {
  fileTypes: [".css", ".scss"],
  // Tu código aquí...
};
```

## 📚 Recursos para Aprender Más

- [Documentación de Claude SDK](https://docs.anthropic.com)
- [Node.js File System](https://nodejs.org/api/fs.html)
- [Async/Await Tutorial](https://javascript.info/async-await)
- [Markdown Guide](https://www.markdownguide.org)

## 🎉 ¡Felicidades!

Si llegaste hasta aquí y el script funciona, ya sabes:

- ✅ Automatizar tareas con Claude Code
- ✅ Trabajar con archivos en Node.js
- ✅ Integrar IA en tus proyectos
- ✅ Crear herramientas útiles

**Siguiente paso:** Modifica el script para tus propias necesidades y comparte lo que creaste.

---

_Creado con ❤️ para el Taller de Claude Code Power Users por [@blissito](https://twitter.com/blissito)_

<!-- Test hook trigger -->
