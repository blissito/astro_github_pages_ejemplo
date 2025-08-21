#!/usr/bin/env python3
"""
Script para generar README.pdf desde CLAUDE.md usando Claude Code CLI
1. Lee CLAUDE.md con claude -p y genera un README.md mejorado
2. Convierte README.md a PDF
"""

import subprocess
import sys
import os
from pathlib import Path

def check_dependencies():
    """Verifica que las dependencias estén instaladas"""
    dependencies = []
    
    # Verificar claude-code
    try:
        subprocess.run(['claude', '--version'], capture_output=True, check=True)
        print("✅ Claude Code CLI encontrado")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Claude Code CLI no encontrado")
        print("   Instala con: npm install -g @anthropic-ai/claude-code")
        return False
    
    # Verificar markdown2
    try:
        import markdown2
        print("✅ markdown2 encontrado")
    except ImportError:
        dependencies.append('markdown2')
    
    # Verificar reportlab
    try:
        from reportlab.lib.pagesizes import letter
        print("✅ reportlab encontrado")
    except ImportError:
        dependencies.append('reportlab')
    
    if dependencies:
        print(f"\n❌ Dependencias faltantes: {', '.join(dependencies)}")
        print(f"   Instala con: pip install {' '.join(dependencies)}")
        return False
    
    return True

def generate_readme_with_claude():
    """Usa Claude para generar README.md desde CLAUDE.md"""
    print("\n📝 Generando README.md con Claude...")
    
    # Leer el contenido de CLAUDE.md
    try:
        with open('CLAUDE.md', 'r', encoding='utf-8') as f:
            claude_content = f.read()
    except Exception as e:
        print(f"❌ Error al leer CLAUDE.md: {e}")
        return False
    
    # Prompt más específico para obtener solo markdown
    prompt = f"Genera SOLO el contenido markdown (sin explicaciones) de un README.md basado en esto: {claude_content[:1000]}. Empieza directamente con # Simple Documentation Generator"
    
    try:
        print("   Enviando a Claude (modelo Haiku para mayor velocidad)...")
        
        # Ejecutar claude con prompt directo como argumento
        result = subprocess.run(
            ['claude', '-p', '--dangerously-skip-permissions', '--model', 'haiku', prompt],
            capture_output=True,
            text=True,
            timeout=30  # Timeout reducido a 30 segundos
        )
        
        # Verificar si hay salida
        if result.stdout:
            # Guardar el resultado en README.md
            with open('README.md', 'w', encoding='utf-8') as f:
                f.write(result.stdout)
            
            print("✅ README.md generado exitosamente")
            return True
        else:
            print("❌ Claude no generó ninguna salida")
            if result.stderr:
                print(f"   Error: {result.stderr}")
            return False
        
    except subprocess.TimeoutExpired:
        print("❌ El comando Claude tardó demasiado tiempo (más de 30 segundos)")
        return False
    except FileNotFoundError:
        print("❌ El comando 'claude' no se encontró")
        print("   Asegúrate de tener Claude Code CLI instalado")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def convert_markdown_to_pdf():
    """Convierte README.md a PDF usando reportlab"""
    print("\n📄 Convirtiendo README.md a PDF...")
    
    try:
        import markdown2
        from reportlab.lib.pagesizes import letter, A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
        from reportlab.platypus import Preformatted
        from reportlab.lib.enums import TA_LEFT, TA_CENTER
        from reportlab.lib import colors
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
        import html
        import re
        
        # Leer README.md
        with open('README.md', 'r', encoding='utf-8') as f:
            markdown_content = f.read()
        
        # Crear el PDF
        pdf_filename = "README.pdf"
        doc = SimpleDocTemplate(
            pdf_filename,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        # Estilos
        styles = getSampleStyleSheet()
        
        # Personalizar estilos
        styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a1a1a'),
            spaceAfter=30,
            alignment=TA_CENTER
        ))
        
        styles.add(ParagraphStyle(
            name='CustomHeading2',
            parent=styles['Heading2'],
            fontSize=18,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=12,
            spaceBefore=12
        ))
        
        styles.add(ParagraphStyle(
            name='CustomHeading3',
            parent=styles['Heading3'],
            fontSize=14,
            textColor=colors.HexColor('#34495e'),
            spaceAfter=10,
            spaceBefore=10
        ))
        
        styles.add(ParagraphStyle(
            name='CodeBlock',
            parent=styles['Code'],
            fontSize=9,
            fontName='Courier',
            backColor=colors.HexColor('#f5f5f5'),
            borderColor=colors.HexColor('#dddddd'),
            borderWidth=1,
            borderPadding=10,
            leftIndent=20,
            rightIndent=20
        ))
        
        # Elementos del PDF
        story = []
        
        # Procesar el markdown línea por línea
        lines = markdown_content.split('\n')
        in_code_block = False
        code_block_content = []
        
        for line in lines:
            # Detectar bloques de código
            if line.strip().startswith('```'):
                if in_code_block:
                    # Fin del bloque de código
                    if code_block_content:
                        code_text = '\n'.join(code_block_content)
                        # Escapar caracteres especiales para XML
                        code_text = html.escape(code_text)
                        story.append(Preformatted(code_text, styles['Code']))
                        story.append(Spacer(1, 12))
                    code_block_content = []
                    in_code_block = False
                else:
                    # Inicio del bloque de código
                    in_code_block = True
                continue
            
            if in_code_block:
                code_block_content.append(line)
                continue
            
            # Procesar encabezados
            if line.startswith('# '):
                text = line[2:].strip()
                text = html.escape(text)
                story.append(Paragraph(text, styles['CustomTitle']))
                story.append(Spacer(1, 12))
            elif line.startswith('## '):
                text = line[3:].strip()
                text = html.escape(text)
                story.append(Paragraph(text, styles['CustomHeading2']))
            elif line.startswith('### '):
                text = line[4:].strip()
                text = html.escape(text)
                story.append(Paragraph(text, styles['CustomHeading3']))
            elif line.strip():
                # Párrafo normal
                # Procesar markdown inline (negrita, cursiva, código inline)
                text = line.strip()
                
                # Convertir markdown a HTML básico
                text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)  # Negrita
                text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)  # Cursiva
                text = re.sub(r'`(.+?)`', r'<font name="Courier">\1</font>', text)  # Código inline
                
                # Escapar otros caracteres especiales
                text = text.replace('&', '&amp;')
                text = text.replace('<', '&lt;').replace('>', '&gt;')
                # Restaurar las etiquetas HTML que agregamos
                text = text.replace('&lt;b&gt;', '<b>').replace('&lt;/b&gt;', '</b>')
                text = text.replace('&lt;i&gt;', '<i>').replace('&lt;/i&gt;', '</i>')
                text = text.replace('&lt;font name="Courier"&gt;', '<font name="Courier">')
                text = text.replace('&lt;/font&gt;', '</font>')
                
                story.append(Paragraph(text, styles['BodyText']))
                story.append(Spacer(1, 6))
            elif not line.strip() and story and not isinstance(story[-1], Spacer):
                # Línea vacía - agregar espacio
                story.append(Spacer(1, 12))
        
        # Construir el PDF
        doc.build(story)
        print(f"✅ PDF generado exitosamente: {pdf_filename}")
        return True
        
    except ImportError as e:
        print(f"❌ Error de importación: {e}")
        print("   Instala las dependencias con: pip install markdown2 reportlab")
        return False
    except Exception as e:
        print(f"❌ Error al generar PDF: {e}")
        return False

def main():
    """Función principal"""
    print("🚀 Generador de README.pdf desde CLAUDE.md")
    print("=" * 50)
    
    # Verificar que CLAUDE.md existe
    if not Path('CLAUDE.md').exists():
        print("❌ Error: CLAUDE.md no encontrado en el directorio actual")
        return 1
    
    # Verificar dependencias
    if not check_dependencies():
        return 1
    
    # Generar README.md con Claude
    if not generate_readme_with_claude():
        print("\n❌ No se pudo generar README.md")
        return 1
    
    # Convertir a PDF
    if not convert_markdown_to_pdf():
        print("\n❌ No se pudo generar el PDF")
        return 1
    
    print("\n✨ ¡Proceso completado exitosamente!")
    print(f"   📄 README.md generado")
    print(f"   📄 README.pdf generado")
    
    # Mostrar preview del README.md generado
    print("\n📋 Preview del README.md generado (primeras 10 líneas):")
    print("-" * 50)
    with open('README.md', 'r', encoding='utf-8') as f:
        lines = f.readlines()[:10]
        for line in lines:
            print(line.rstrip())
    if len(lines) == 10:
        print("...")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())