#!/usr/bin/env python3
import os
import re
import markdown
from jinja2 import Template

class RevealSlideGenerator:
    def __init__(self):
        self.template = Template('''
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.5/reset.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.5/reveal.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.5/theme/white.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            /* Paleta Brand de Fixter */
            --brand-700: #37ab93;  /* Verde principal para H1 */
            --brand-500: #85ddcb;  /* Verde claro/aqua para acentos */
            --brand-800: #186656;  /* Verde oscuro para H2 */
            --brand-900: #19262a;  /* Casi negro para H3 y texto */
            --brand-100: #dae8e5;  /* Gris verdoso claro para fondos */
        }

        /* Tipografía Brand - Space Grotesk principal */
        .reveal {
            font-family: 'Space Grotesk', 'Inter', sans-serif;
            background-color: #f8fffe; /* Fondo claro con toque verdoso */
            color: var(--brand-900);
            line-height: 1.4;
        }

        .reveal .slides { 
            padding: 20px; 
        }

        .reveal section { 
            padding: 40px; /* Padding optimizado */
            max-height: 100%;
            overflow: auto; /* Overflow automático */
        }

        /* Tamaños de texto mejorados */
        .reveal h1 { 
            color: var(--brand-700);
            font-size: 1.6em;
            font-weight: 700;
        }
        
        .reveal h2 { 
            color: var(--brand-800);
            font-size: 1.3em;
            font-weight: 600;
        }
        
        .reveal h3 { 
            color: var(--brand-900);
            font-size: 1.1em;
            font-weight: 600;
        }

        .reveal p, .reveal li {
            font-size: 0.9em; /* Legibilidad mejorada */
            color: var(--brand-900);
        }

        .reveal strong {
            color: var(--brand-700);
            font-weight: 600;
        }

        .reveal em {
            color: var(--brand-800);
        }

        .reveal pre code {
            background: var(--brand-100) !important;
            color: var(--brand-800) !important;
            padding: 10px;
            border-radius: 5px;
            font-family: 'Inter', monospace;
        }

        .reveal code {
            background: var(--brand-100);
            color: var(--brand-800);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Inter', monospace;
        }

        .reveal blockquote {
            border-left: 5px solid var(--brand-500);
            color: var(--brand-900);
            padding: 10px 20px;
            font-style: italic;
            background: rgba(218, 232, 229, 0.3); /* brand-100 con transparencia */
        }

        /* Enlaces con colores brand */
        .reveal a {
            color: var(--brand-700);
        }

        .reveal a:hover {
            color: var(--brand-800);
        }

        /* Listas con mejor spacing */
        .reveal ul, .reveal ol {
            margin-left: 1em;
        }

        .reveal li {
            margin-bottom: 0.3em;
        }
    </style>
</head>
<body>
    <div class="reveal">
        <div class="slides">
            {% for slide in slides %}
            <section>
                {{ slide | safe }}
            </section>
            {% endfor %}
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.5/reveal.min.js"></script>
    <script>
        Reveal.initialize({
            width: 1280,
            height: 720,
            margin: 0.1,
            minScale: 0.2,
            maxScale: 1.5,
            // Navegación táctil y teclado
            touch: true,
            keyboard: true,
            controls: true,
            progress: true,
            center: true,
            hash: true,
            // Responsivo
            respondToHashChanges: true
        });
    </script>
</body>
</html>
        ''')

    def remove_frontmatter(self, content):
        """
        Detecta y remueve el frontmatter de Marp del contenido markdown.
        Retorna solo el contenido markdown después del frontmatter.
        """
        # Verificar si el contenido comienza con frontmatter
        if content.strip().startswith('---'):
            # Dividir el contenido en partes usando '---' como delimitador
            parts = content.split('---', 2)
            if len(parts) >= 3:
                # Retornar solo el contenido después del segundo '---'
                return parts[2].strip()
        
        # Si no hay frontmatter, retornar el contenido original
        return content.strip()

    def markdown_to_slides(self, markdown_content):
        """
        Convierte contenido markdown a slides HTML individuales.
        Separa por slide separators y convierte cada uno a HTML.
        """
        # Remover frontmatter si está presente
        clean_markdown = self.remove_frontmatter(markdown_content)
        
        # Separar por slide separators (--- que no sean parte del frontmatter)
        slides_md = re.split(r'\n---\n|\n---$|^---\n', clean_markdown)
        
        # Filtrar slides vacíos y convertir a HTML
        slides_html = []
        for slide_md in slides_md:
            slide_md = slide_md.strip()
            if slide_md:
                # Convertir markdown a HTML
                html_content = markdown.markdown(
                    slide_md, 
                    extensions=['fenced_code', 'tables', 'nl2br', 'codehilite']
                )
                slides_html.append(html_content)
        
        return slides_html

    def generate_slides_from_markdown(self, markdown_file_path, output_path=None, title=None):
        """
        Genera slides HTML desde un archivo markdown, ignorando completamente
        el frontmatter de Marp y aplicando siempre los estilos optimizados del agente.
        """
        # Leer el archivo markdown
        with open(markdown_file_path, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
        
        # Extraer título del primer h1 si no se proporciona
        if not title:
            clean_content = self.remove_frontmatter(markdown_content)
            title_match = re.search(r'^#\s+(.+)$', clean_content, re.MULTILINE)
            title = title_match.group(1) if title_match else "Presentación"
        
        # Convertir markdown a slides HTML
        slides = self.markdown_to_slides(markdown_content)
        
        # Generar nombre de archivo de salida si no se proporciona
        if not output_path:
            base_name = os.path.splitext(os.path.basename(markdown_file_path))[0]
            output_dir = os.path.dirname(markdown_file_path)
            output_path = os.path.join(output_dir, f"{base_name}-slides.html")
        
        # Generar la presentación
        self.generate_slides(title, slides, output_path)
        return output_path

    def generate_slides(self, title, slides, output_path):
        """
        Genera una presentación HTML con Reveal.js v5.0.5
        
        :param title: Título de la presentación
        :param slides: Lista de secciones HTML para las diapositivas
        :param output_path: Ruta de salida del archivo HTML
        """
        rendered_html = self.template.render(title=title, slides=slides)
        
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(rendered_html)
        
        print(f"Presentación generada en: {output_path}")

def main():
    """
    Función principal que demuestra el uso del generador de slides
    con procesamiento automático de frontmatter de Marp.
    """
    import sys
    
    generator = RevealSlideGenerator()
    
    # Si se pasa un archivo markdown como argumento
    if len(sys.argv) > 1:
        markdown_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else None
        
        if os.path.exists(markdown_file):
            print(f"Procesando archivo markdown: {markdown_file}")
            print("🔄 Removiendo frontmatter de Marp...")
            print("🎨 Aplicando paleta brand Fixter y tipografía Space Grotesk...")
            print("📊 Generando slides con Reveal.js 5.0.5...")
            
            output_path = generator.generate_slides_from_markdown(
                markdown_file, 
                output_file
            )
            print(f"✅ Presentación generada exitosamente: {output_path}")
        else:
            print(f"❌ Error: No se encontró el archivo {markdown_file}")
            sys.exit(1)
    else:
        # Ejemplo de uso con datos de prueba
        print("📋 Ejemplo de uso con datos de prueba:")
        title = "Presentación Fixter Brand"
        slides = [
            "<h1>Introducción</h1><p>Primera diapositiva con <strong>paleta brand Fixter</strong></p>",
            "<h2>Tipografía</h2><p>Usando <em>Space Grotesk</em> como fuente principal</p><pre><code>print('Hola mundo')</code></pre>",
            "<h3>Características</h3><ul><li>Paleta brand: #37ab93, #186656, #19262a</li><li>Tipografía Space Grotesk</li><li>Ignora frontmatter de Marp</li><li>Navegación táctil y teclado</li><li>Reveal.js 5.0.5</li></ul>"
        ]
        
        os.makedirs("/Users/bliss/taller/presentaciones", exist_ok=True)
        output_path = "/Users/bliss/taller/presentaciones/ejemplo.html"
        generator.generate_slides(title, slides, output_path)
        print(f"✅ Ejemplo generado en: {output_path}")
        
        # Demostrar funcionalidad de procesamiento de frontmatter
        print("\n🔧 Demostrando procesamiento de frontmatter:")
        test_content = '''---
marp: true
theme: gaia
backgroundColor: #1e1e2e
---

# Título de Prueba

Este contenido no tiene estilos del frontmatter.

---

## Segunda Diapositiva

- Item 1
- Item 2
'''
        
        clean_content = generator.remove_frontmatter(test_content)
        print("Contenido original tenía frontmatter:", test_content.strip().startswith('---'))
        print("Contenido limpio:", clean_content[:50] + "...")
        
        slides_from_md = generator.markdown_to_slides(test_content)
        print(f"Slides generados: {len(slides_from_md)}")
        
        print("\n💡 Para usar con archivo markdown:")
        print("python3 generate_slides.py archivo.md [salida.html]")

if __name__ == "__main__":
    main()