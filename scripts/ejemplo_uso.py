#!/usr/bin/env python3
"""
Ejemplo de uso del generador de slides optimizado.
Demuestra cómo el agente ignora frontmatter de Marp y aplica estilos consistentes.
"""

from generate_slides import RevealSlideGenerator
import os

def demo_frontmatter_removal():
    """Demuestra la funcionalidad de remoción de frontmatter"""
    
    print("🔬 Demo: Procesamiento de Frontmatter de Marp")
    print("=" * 50)
    
    # Crear una instancia del generador
    generator = RevealSlideGenerator()
    
    # Ejemplo de contenido con frontmatter de Marp
    markdown_with_frontmatter = """---
marp: true
theme: gaia
paginate: true
backgroundColor: #1e1e2e
color: #cdd6f4
style: |
  section {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 40px 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  h1 {
    color: #89dceb;
    font-size: 1.6em;
    margin: 0.2em 0;
  }
---

# 🚀 Mi Presentación

Contenido real de la presentación con estilos del agente.

---

## 📊 Características

- Ignora completamente el frontmatter
- Aplica estilos optimizados (#f5f5f5 background)
- Usa Reveal.js 5.0.5
- Mantiene consistencia visual

---

## 💻 Código de Ejemplo

```python
# Los bloques de código tienen estilos consistentes
def procesar_markdown():
    return "HTML optimizado"
```

> Los blockquotes también tienen estilos optimizados del agente
"""

    # Demostrar procesamiento paso a paso
    print("1️⃣ Contenido original:")
    print(f"   - Comienza con frontmatter: {markdown_with_frontmatter.strip().startswith('---')}")
    print(f"   - Longitud total: {len(markdown_with_frontmatter)} caracteres")
    
    print("\n2️⃣ Removiendo frontmatter:")
    clean_content = generator.remove_frontmatter(markdown_with_frontmatter)
    print(f"   - Contenido limpio comienza con: '{clean_content[:30]}...'")
    print(f"   - Longitud después de limpieza: {len(clean_content)} caracteres")
    
    print("\n3️⃣ Generando slides:")
    slides = generator.markdown_to_slides(markdown_with_frontmatter)
    print(f"   - Número de slides generados: {len(slides)}")
    
    for i, slide in enumerate(slides, 1):
        print(f"   - Slide {i}: {len(slide)} caracteres HTML")
    
    print("\n4️⃣ Generando archivo HTML:")
    
    # Crear directorio de salida
    output_dir = "/Users/bliss/taller/presentaciones"
    os.makedirs(output_dir, exist_ok=True)
    
    # Generar presentación completa
    output_path = os.path.join(output_dir, "demo-optimizado.html")
    generator.generate_slides("Demo: Estilos Optimizados", slides, output_path)
    
    print(f"   ✅ Archivo generado: {output_path}")
    
    print("\n✨ Resultado Final:")
    print("   - ❌ Sin estilos del frontmatter de Marp")
    print("   - ✅ Con estilos optimizados del agente")
    print("   - ✅ Fondo claro (#f5f5f5)")
    print("   - ✅ Reveal.js 5.0.5")
    print("   - ✅ Colores consistentes para headers")

def demo_comparison():
    """Muestra la diferencia entre contenido con y sin frontmatter"""
    
    print("\n🔍 Demo: Comparación de Procesamiento")
    print("=" * 50)
    
    generator = RevealSlideGenerator()
    
    # Contenido SIN frontmatter
    simple_markdown = """# Mi Presentación Simple

Sin frontmatter, procesamiento directo.

---

## Segunda Slide

Contenido normal."""

    # Contenido CON frontmatter
    complex_markdown = """---
marp: true
backgroundColor: #000000
---

# Mi Presentación Compleja

Con frontmatter que será ignorado.

---

## Segunda Slide

El mismo contenido, pero con frontmatter removido."""

    print("📝 Procesando contenido sin frontmatter:")
    simple_slides = generator.markdown_to_slides(simple_markdown)
    print(f"   - Slides generados: {len(simple_slides)}")
    
    print("\n📝 Procesando contenido con frontmatter:")
    complex_slides = generator.markdown_to_slides(complex_markdown)
    print(f"   - Slides generados: {len(complex_slides)}")
    
    print("\n🎯 Resultado:")
    print("   - Ambos procesamientos generan el mismo tipo de HTML")
    print("   - El frontmatter es completamente ignorado")
    print("   - Los estilos siempre son los del agente")

if __name__ == "__main__":
    demo_frontmatter_removal()
    demo_comparison()
    
    print("\n🎉 Demo completado!")
    print("💡 Para usar con tus archivos:")
    print("   python3 generate_slides.py tu-archivo.md salida.html")