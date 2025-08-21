# Generador de Slides Optimizado

Este generador de slides convierte archivos markdown a presentaciones HTML con Reveal.js, **ignorando completamente el frontmatter de Marp** y aplicando siempre estilos optimizados.

## 🎯 Características Principales

### ✅ **Ignora Frontmatter de Marp**
- Detecta automáticamente frontmatter entre `---`
- Remueve toda configuración de Marp (theme, backgroundColor, style, etc.)
- Extrae solo el contenido markdown puro

### 🎨 **Estilos Optimizados del Agente**
- **Fondo claro**: `#f5f5f5` (no el del frontmatter)
- **Reveal.js 5.0.5**: Versión estable y optimizada
- **Colores consistentes**:
  - H1: `#e74c3c` (rojo)
  - H2: `#3498db` (azul)  
  - H3: `#2c3e50` (gris oscuro)
- **Código**: Fondo `#ecf0f1` con texto `#e74c3c`
- **Blockquotes**: Borde `#3498db` con texto `#7f8c8d`

### 📱 **Responsive y Accesible**
- Padding y espaciado optimizados
- Overflow automático para contenido largo
- Navegación táctil y de teclado

## 🚀 Uso

### Línea de Comandos
```bash
# Convertir archivo con frontmatter de Marp
python3 generate_slides.py presentacion.md salida.html

# Solo especificar archivo (genera nombre automático)
python3 generate_slides.py mi-presentacion.md
```

### Programáticamente
```python
from generate_slides import RevealSlideGenerator

generator = RevealSlideGenerator()

# Desde archivo markdown
output_path = generator.generate_slides_from_markdown(
    "mi-archivo.md", 
    "salida.html", 
    "Mi Título"
)

# Desde contenido markdown en memoria
markdown_content = """---
marp: true
theme: gaia
---

# Mi Slide
Contenido aquí
"""

slides = generator.markdown_to_slides(markdown_content)
generator.generate_slides("Mi Presentación", slides, "output.html")
```

## 📋 Ejemplo de Procesamiento

### Entrada (con frontmatter)
```markdown
---
marp: true
theme: gaia
backgroundColor: #1e1e2e
color: #cdd6f4
style: |
  section { padding: 40px; }
---

# Mi Presentación
Contenido real aquí
```

### Procesamiento
1. ✅ **Detecta frontmatter** entre `---`
2. ✅ **Remueve completamente** toda configuración de Marp
3. ✅ **Extrae contenido** markdown puro
4. ✅ **Aplica estilos** optimizados del agente
5. ✅ **Genera HTML** con Reveal.js 5.0.5

### Salida HTML
- ❌ **Sin estilos** del frontmatter
- ✅ **Con fondo claro** (#f5f5f5)
- ✅ **Estilos consistentes** y optimizados
- ✅ **Funcionalidad completa** de Reveal.js

## 🔧 Métodos Principales

### `remove_frontmatter(content)`
Detecta y remueve frontmatter YAML del contenido markdown.

### `markdown_to_slides(markdown_content)`
Convierte markdown a lista de slides HTML individuales.

### `generate_slides_from_markdown(file_path, output_path, title)`
Procesa archivo markdown completo y genera presentación HTML.

## 💡 Beneficios

1. **Consistencia Visual**: Todos los slides tienen el mismo aspecto optimizado
2. **Sin Conflictos**: No hay interferencia entre estilos de Marp y del agente
3. **Flexibilidad**: El usuario puede mantener su markdown con frontmatter
4. **Automatización**: Procesamiento completamente automático
5. **Calidad**: Estilos probados y optimizados para legibilidad

## 🎯 Casos de Uso

- **Migrar** de Marp a Reveal.js manteniendo el contenido
- **Estandarizar** presentaciones con estilos corporativos
- **Automatizar** generación de slides desde markdown
- **Mantener** consistencia visual en múltiples presentaciones

---

✨ **El agente siempre genera HTML con estilos optimizados, sin importar el frontmatter de Marp.**