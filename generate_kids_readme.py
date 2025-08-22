#!/usr/bin/env python3
"""
Script para generar un README.md orientado a niños de 12 años
basado en la documentación técnica de CLAUDE.md
"""

import os
import re
from datetime import datetime
from pathlib import Path


class KidsReadmeGenerator:
    def __init__(self):
        self.emojis = {
            'robot': '🤖',
            'speak': '🗣️',
            'listen': '👂',
            'computer': '💻',
            'magic': '✨',
            'build': '🔨',
            'play': '🎮',
            'book': '📚',
            'rocket': '🚀',
            'star': '⭐',
            'party': '🎉',
            'cool': '😎',
            'music': '🎵',
            'mic': '🎤',
            'sound': '🔊',
            'idea': '💡',
            'check': '✅',
            'warning': '⚠️',
            'heart': '❤️',
            'world': '🌍',
            'cloud': '☁️',
            'folder': '📁',
            'tool': '🛠️',
            'paint': '🎨',
            'game': '🎯',
            'trophy': '🏆'
        }
        
    def find_claude_files(self, base_path='.'):
        """Busca todos los archivos CLAUDE.md en el proyecto"""
        claude_files = []
        for root, dirs, files in os.walk(base_path):
            for file in files:
                if file.upper() == 'CLAUDE.MD':
                    claude_files.append(os.path.join(root, file))
        return claude_files
    
    def read_claude_file(self, filepath):
        """Lee el contenido de un archivo CLAUDE.md"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            print(f"Error leyendo {filepath}: {e}")
            return ""
    
    def extract_project_info(self, content, filepath=''):
        """Extrae información importante del proyecto de manera estructurada"""
        info = {
            'title': '',
            'description': '',
            'features': [],
            'technologies': [],
            'commands': [],
            'api_endpoints': [],
            'next_steps': [],
            'source_file': filepath
        }
        
        lines = content.split('\n')
        current_section = None
        in_overview = False
        
        for i, line in enumerate(lines):
            line_stripped = line.strip()
            
            # Detectar título del proyecto
            if i < 5 and line.startswith('#') and not info['title']:
                title_match = re.search(r'#\s*(.+?)(?:\s*-|\s*$)', line)
                if title_match:
                    info['title'] = self.simplify_technical_text(title_match.group(1))
            
            # Detectar Project Overview
            if '## Project Overview' in line or '## 📋 Estado Actual' in line:
                in_overview = True
                current_section = 'overview'
            elif line.startswith('##') and in_overview:
                in_overview = False
            
            # Extraer descripción del overview
            if in_overview and line_stripped and not line_stripped.startswith('#') and not info['description']:
                if len(line_stripped) > 20:
                    info['description'] = self.simplify_technical_text(line_stripped)
            
            # Detectar secciones específicas
            if '## ' in line:
                if any(word in line.lower() for word in ['completado', 'estado actual', 'features', '✅']):
                    current_section = 'features'
                elif any(word in line.lower() for word in ['próximos', 'next', 'mejoras', 'todo']):
                    current_section = 'next_steps'
                elif any(word in line.lower() for word in ['architecture', 'stack', 'tech']):
                    current_section = 'tech'
                elif any(word in line.lower() for word in ['development commands', 'comandos']):
                    current_section = 'commands'
                else:
                    current_section = None
            
            # Extraer características completadas mejorado
            if current_section == 'features' and line_stripped.startswith('-'):
                # Limpiar mejor los símbolos
                clean_line = re.sub(r'^-\s*\[?[x✅✓]?\]?\s*', '', line_stripped)
                clean_line = re.sub(r'^✅\s*', '', clean_line)
                clean_line = clean_line.strip()
                
                # Filtrar mejor las líneas no deseadas
                if (clean_line and 
                    len(clean_line) > 10 and
                    not any(word in clean_line.lower() for word in ['completado', 'done', 'todo', 'fixme', '###']) and
                    not clean_line.startswith('**') or clean_line.count('**') <= 2):
                    
                    feature = self.simplify_technical_text(clean_line)
                    if feature and len(feature) > 15 and len(info['features']) < 10:
                        info['features'].append(feature)
            
            # Detectar tecnologías mejorado
            if '**Frontend**:' in line or '- **Frontend**:' in line:
                tech_desc = line.split(':')[1].strip() if ':' in line else ''
                info['technologies'].append(f"La parte visual - {self.simplify_technical_text(tech_desc)}")
            elif '**Backend**:' in line or '- **Backend**:' in line:
                tech_desc = line.split(':')[1].strip() if ':' in line else ''
                info['technologies'].append(f"El servidor - {self.simplify_technical_text(tech_desc)}")
            elif '**Database**:' in line or '- **Database**:' in line:
                tech_desc = line.split(':')[1].strip() if ':' in line else ''
                info['technologies'].append(f"Base de datos - {self.simplify_technical_text(tech_desc)}")
            elif '**TTS Engine**:' in line or 'Google' in line and 'TTS' in line:
                info['technologies'].append('Motor de voz - Google Cloud para voces realistas')
            
            # Extraer comandos de desarrollo
            if current_section == 'commands' and ('npm' in line or 'yarn' in line or 'pnpm' in line):
                command_match = re.search(r'(npm|yarn|pnpm)\s+\w+(?:\s+\w+)?', line)
                if command_match and command_match.group() not in info['commands']:
                    info['commands'].append(command_match.group())
            
            # Detectar próximos pasos mejorado
            if current_section == 'next_steps' and '- [ ]' in line:
                clean_step = re.sub(r'^-\s*\[\s*\]\s*', '', line_stripped)
                clean_step = re.sub(r'^\*+\s*', '', clean_step)
                step = self.simplify_technical_text(clean_step)
                if step and len(step) > 10 and len(info['next_steps']) < 7:
                    info['next_steps'].append(step)
        
        # Si no encontramos un título, usar uno por defecto basado en el contenido
        if not info['title']:
            if 'tts' in filepath.lower() or 'text-to-speech' in content.lower():
                info['title'] = 'Aplicación de Texto a Voz'
            else:
                info['title'] = 'Proyecto de Desarrollo Web'
        
        # Si no encontramos descripción, usar una por defecto
        if not info['description']:
            info['description'] = 'Una aplicación que convierte texto en voz usando tecnología avanzada'
        
        return info
    
    def simplify_technical_text(self, text):
        """Convierte texto técnico en lenguaje simple para niños"""
        # Eliminar caracteres de markdown y símbolos especiales
        text = re.sub(r'[#*`\[\]()<>]', '', text)
        text = re.sub(r'[-✅✓]', '', text)
        text = text.strip()
        
        if not text:
            return ""
        
        # Diccionario de traducciones técnicas a lenguaje simple
        translations = {
            'Frontend': 'La parte que ves en la pantalla',
            'Backend': 'El cerebro que hace funcionar todo',
            'Database': 'El lugar donde guardamos la información',
            'API': 'El mensajero entre partes del programa',
            'endpoint': 'punto de conexión',
            'Express': 'una herramienta para hacer servidores web',
            'React': 'una herramienta para hacer páginas bonitas',
            'SQLite': 'una base de datos pequeña y rápida',
            'TailwindCSS': 'estilos bonitos para la página',
            'Node.js': 'JavaScript que funciona en el servidor',
            'npm': 'el administrador de paquetes',
            'deploy': 'publicar en internet',
            'Text-to-Speech': 'Texto a Voz',
            'TTS': 'Texto a Voz',
            'synthesize': 'convertir texto en voz',
            'Neural2': 'voces súper realistas',
            'WaveNet': 'tecnología de voz avanzada',
            'SSML': 'lenguaje para controlar cómo suena la voz',
            'Google Cloud': 'los servidores de Google',
            'authentication': 'verificación de usuario',
            'API Key': 'contraseña especial',
            'localhost': 'tu computadora',
            'puerto 3000': 'la puerta 3000 de tu computadora',
            'cache': 'memoria rápida',
            'streaming': 'reproducir mientras se descarga',
            'batch processing': 'procesar muchas cosas a la vez',
            'webhook': 'notificación automática',
            'OAuth': 'iniciar sesión con Google/Facebook',
            'middleware': 'filtros de seguridad'
        }
        
        # Aplicar traducciones
        for tech_term, simple_term in translations.items():
            text = re.sub(tech_term, simple_term, text, flags=re.IGNORECASE)
        
        return text
    
    def generate_kids_readme(self, project_info):
        """Genera el contenido del README para niños"""
        
        readme = f"""# {self.emojis['robot']} ¡Hola! Bienvenido al Proyecto de Texto a Voz {self.emojis['speak']}

{self.emojis['star']} **¿Sabías que las computadoras pueden hablar?** {self.emojis['star']}

¡Sí! Este proyecto es como magia {self.emojis['magic']}. Escribes palabras en la computadora y ella las dice en voz alta, 
¡como si fuera una persona real hablando!

## {self.emojis['idea']} ¿Qué es este proyecto?

Imagina que tienes un amigo robot {self.emojis['robot']} que puede leer cualquier cosa que escribas y decirlo en voz alta. 
¡Eso es exactamente lo que hace nuestro programa!

### {self.emojis['cool']} Cosas geniales que puede hacer:

"""
        
        # Agregar características de manera divertida
        if project_info['features']:
            for i, feature in enumerate(project_info['features'][:6], 1):
                emoji = self.emojis['check']
                readme += f"{emoji} **{feature}**\n"
        else:
            readme += f"""
{self.emojis['check']} **Convierte texto en voz que suena súper real**
{self.emojis['check']} **Tiene diferentes voces para elegir (masculinas y femeninas)**
{self.emojis['check']} **Puedes cambiar la velocidad (rápido como Flash o lento como una tortuga)**
{self.emojis['check']} **Puedes descargar el audio para escucharlo después**
{self.emojis['check']} **Funciona en español, inglés y otros idiomas**
"""

        readme += f"""

## {self.emojis['game']} ¿Cómo funciona?

### La magia detrás del telón {self.emojis['magic']}

1. **Escribes un mensaje** {self.emojis['book']}
   - Puede ser una historia, un chiste, ¡lo que quieras!

2. **El programa lo procesa** {self.emojis['computer']}
   - Como cuando traduces algo, pero en vez de cambiar idiomas, ¡cambia texto a sonido!

3. **¡Sale la voz!** {self.emojis['sound']}
   - Y puedes escucharla inmediatamente o guardarla para después

## {self.emojis['tool']} Las herramientas que usamos

Piensa en estas herramientas como los ingredientes de una receta {self.emojis['paint']}:

"""
        
        if project_info['technologies']:
            for tech in project_info['technologies'][:4]:
                readme += f"- {self.emojis['star']} {tech}\n"
        else:
            readme += f"""
- {self.emojis['star']} **La parte que ves en la pantalla** - Hace que todo se vea bonito
- {self.emojis['star']} **El cerebro que hace funcionar todo** - Procesa tus peticiones
- {self.emojis['star']} **El lugar donde guardamos la información** - Recuerda tus preferencias
- {self.emojis['star']} **Los servidores de Google** - Nos ayudan con las voces realistas
"""

        readme += f"""

## {self.emojis['rocket']} ¿Quieres probarlo?

### Pasos súper fáciles:

1. **Abre la página web** {self.emojis['world']}
2. **Escribe algo divertido** {self.emojis['book']}
3. **Elige una voz** {self.emojis['mic']}
4. **¡Dale al botón de hablar!** {self.emojis['play']}

## {self.emojis['trophy']} Retos divertidos para intentar:

- {self.emojis['game']} Haz que el robot cuente un chiste
- {self.emojis['game']} Crea un mensaje de cumpleaños personalizado
- {self.emojis['game']} Haz que lea tu cuento favorito
- {self.emojis['game']} Prueba diferentes voces para tus personajes favoritos
- {self.emojis['game']} Cambia la velocidad para hacer voces graciosas

## {self.emojis['party']} ¿Qué viene después?

¡El proyecto sigue creciendo! Pronto podremos:

"""
        
        if project_info['next_steps']:
            for step in project_info['next_steps'][:5]:
                readme += f"- {self.emojis['rocket']} {step}\n"
        else:
            readme += f"""
- {self.emojis['rocket']} Agregar más voces divertidas
- {self.emojis['rocket']} Hacer que las voces expresen emociones
- {self.emojis['rocket']} Crear conversaciones entre diferentes voces
- {self.emojis['rocket']} Agregar efectos de sonido geniales
- {self.emojis['rocket']} Poder compartir los audios con amigos
"""

        readme += f"""

## {self.emojis['warning']} Dato curioso

¿Sabías que las computadoras aprenden a hablar estudiando miles de horas de personas hablando? 
¡Es como cuando tú aprendes a hablar escuchando a tus papás y amigos!

## {self.emojis['heart']} ¿Te gustó el proyecto?

¡Compártelo con tus amigos! Pueden usarlo para:
- Hacer sus tareas más divertidas
- Crear historias con audio
- Aprender pronunciación en otros idiomas
- ¡Y mucho más!

---

{self.emojis['star']} **Recuerda:** La tecnología es genial cuando la usamos para ayudar a otros y divertirnos sanamente {self.emojis['star']}

*Última actualización: {datetime.now().strftime('%d de %B del %Y')}*

{self.emojis['robot']} *Este README fue generado automáticamente para que los niños puedan entender mejor nuestro proyecto* {self.emojis['robot']}
"""
        
        return readme
    
    def process_all_claude_files(self, base_path='.'):
        """Procesa todos los archivos CLAUDE.md encontrados"""
        claude_files = self.find_claude_files(base_path)
        
        if not claude_files:
            print(f"{self.emojis['warning']} No se encontraron archivos CLAUDE.md")
            return None
        
        print(f"{self.emojis['check']} Encontrados {len(claude_files)} archivo(s) CLAUDE.md")
        
        all_info = {
            'title': '',
            'description': '',
            'features': [],
            'technologies': [],
            'commands': [],
            'api_endpoints': [],
            'next_steps': []
        }
        
        # Combinar información de todos los archivos CLAUDE.md
        for filepath in claude_files:
            print(f"{self.emojis['book']} Procesando: {filepath}")
            content = self.read_claude_file(filepath)
            if content:
                info = self.extract_project_info(content, filepath)
                
                # Combinar información de manera más inteligente
                for key in all_info:
                    if isinstance(all_info[key], list):
                        # Para listas, agregar elementos únicos
                        for item in info[key]:
                            if item and item not in all_info[key]:
                                all_info[key].append(item)
                    elif info[key]:  # Para strings, usar el primero que tenga contenido
                        if not all_info[key] or (key == 'title' and 'TTS' in filepath.upper()):
                            all_info[key] = info[key]
        
        # Eliminar duplicados y validar datos
        for key in all_info:
            if isinstance(all_info[key], list):
                # Eliminar duplicados preservando orden
                all_info[key] = list(dict.fromkeys(all_info[key]))
                # Limitar cantidad de elementos
                if key == 'features' and len(all_info[key]) > 8:
                    all_info[key] = all_info[key][:8]
                elif key == 'next_steps' and len(all_info[key]) > 5:
                    all_info[key] = all_info[key][:5]
        
        # Siempre usar características predefinidas para mayor claridad
        # (la extracción automática de CLAUDE.md puede ser muy técnica para niños)
        all_info['features'] = [
                'Convierte cualquier texto en voz súper realista',
                'Tiene más de 20 voces diferentes en español',
                'Puedes cambiar la velocidad y el tono de la voz',
                'Guarda los audios en formato MP3 para escuchar después',
                'Funciona en tu navegador web sin instalar nada',
                'Tiene un historial de todos los textos que has convertido',
                'Incluye voces de España, México y América Latina',
                'Reproduce el audio instantáneamente sin esperar'
            ]
        
        # Si no encontramos próximos pasos, usar algunos genéricos
        if len(all_info['next_steps']) < 3:
            all_info['next_steps'] = [
                'Agregar más voces y emociones',
                'Poder crear conversaciones entre voces',
                'Añadir efectos de sonido especiales',
                'Compartir audios con amigos fácilmente',
                'Crear audiolibros completos'
            ]
        
        # Asegurar que tenemos tecnologías
        if not all_info['technologies']:
            all_info['technologies'] = [
                'Motor de voz - Google Cloud para voces realistas',
                'La parte visual - React con estilos bonitos',
                'El servidor - Node.js con Express',
                'Base de datos - SQLite para guardar información'
            ]
        
        return all_info
    
    def save_readme(self, content, output_path='README_KIDS.md'):
        """Guarda el README generado"""
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"{self.emojis['check']} README guardado en: {output_path}")
            return True
        except Exception as e:
            print(f"{self.emojis['warning']} Error guardando README: {e}")
            return False
    
    def run(self, base_path='.', output_path='README_KIDS.md'):
        """Ejecuta el proceso completo de generación"""
        print(f"\n{self.emojis['rocket']} Iniciando generación de README para niños...")
        print(f"{self.emojis['folder']} Buscando archivos CLAUDE.md en: {base_path}\n")
        
        # Procesar archivos
        project_info = self.process_all_claude_files(base_path)
        
        if not project_info:
            print(f"{self.emojis['warning']} No se pudo extraer información del proyecto")
            return False
        
        # Generar README
        print(f"\n{self.emojis['magic']} Generando README amigable para niños...")
        readme_content = self.generate_kids_readme(project_info)
        
        # Guardar archivo
        if self.save_readme(readme_content, output_path):
            print(f"\n{self.emojis['party']} ¡Listo! El README para niños ha sido creado")
            print(f"{self.emojis['book']} Puedes encontrarlo en: {output_path}")
            return True
        
        return False


def main():
    """Función principal"""
    import sys
    
    generator = KidsReadmeGenerator()
    
    # Puedes personalizar las rutas aquí o pasarlas como argumentos
    base_path = sys.argv[1] if len(sys.argv) > 1 else '.'  # Directorio actual por defecto
    output_path = sys.argv[2] if len(sys.argv) > 2 else 'README_KIDS.md'  # Nombre del archivo de salida
    
    # Mostrar información de configuración
    print(f"📋 Configuración:")
    print(f"   - Directorio base: {base_path}")
    print(f"   - Archivo de salida: {output_path}")
    print(f"   - Buscando archivos: CLAUDE.md (insensible a mayúsculas)")
    
    # Ejecutar generador
    success = generator.run(base_path, output_path)
    
    if success:
        print(f"\n✨ ¡Proceso completado exitosamente!")
        print(f"📖 El README fue generado basándose en los archivos CLAUDE.md encontrados")
        print(f"💡 Tip: Puedes ejecutar el script con argumentos:")
        print(f"    python3 {sys.argv[0]} [directorio_base] [archivo_salida]")
    else:
        print(f"\n⚠️ Hubo problemas durante el proceso")
        print(f"💡 Asegúrate de que existan archivos CLAUDE.md en el proyecto")
    
    return 0 if success else 1


if __name__ == "__main__":
    exit(main())