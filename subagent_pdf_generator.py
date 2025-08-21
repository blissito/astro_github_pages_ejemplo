#!/usr/bin/env python3
"""
Fase 2: Subagente Generador de PDFs
Un subagente especializado que puede ser invocado por Claude Code
para generar documentación PDF de manera autónoma.
"""

import json
import sys
import os
import subprocess
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from datetime import datetime
import argparse
import tempfile

class PDFSubagent:
    """Subagente especializado en generación de PDFs desde markdown"""
    
    def __init__(self):
        self.state = {
            'status': 'ready',
            'files_processed': [],
            'errors': [],
            'start_time': datetime.now().isoformat()
        }
        self.context = {}
        
    def receive_message(self, message):
        """Recibe mensajes del agente principal"""
        try:
            if isinstance(message, str):
                data = json.loads(message)
            else:
                data = message
                
            self.context = data.get('context', {})
            action = data.get('action', 'generate')
            
            if action == 'generate':
                return self.generate_pdf(data)
            elif action == 'status':
                return self.get_status()
            elif action == 'batch':
                return self.batch_process(data)
            else:
                return self.error_response(f"Acción desconocida: {action}")
                
        except Exception as e:
            return self.error_response(str(e))
    
    def generate_pdf(self, data):
        """Genera un PDF desde contenido markdown"""
        try:
            source_file = data.get('source_file')
            output_file = data.get('output_file', 'output.pdf')
            enhance = data.get('enhance', True)
            model = data.get('model', 'haiku')
            
            if not source_file:
                return self.error_response("No se especificó archivo fuente")
            
            # Leer archivo fuente
            with open(source_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Si enhance=True, mejorar con Claude
            if enhance:
                content = self.enhance_with_claude(content, model)
            
            # Convertir a PDF
            pdf_path = self.markdown_to_pdf(content, output_file)
            
            # Actualizar estado
            self.state['files_processed'].append(source_file)
            
            return {
                'status': 'success',
                'output_file': pdf_path,
                'source_file': source_file,
                'enhanced': enhance,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            self.state['errors'].append(str(e))
            return self.error_response(str(e))
    
    def enhance_with_claude(self, content, model='haiku'):
        """Mejora el contenido usando Claude CLI"""
        try:
            # Preparar prompt contextual
            prompt = f"""Mejora este documento markdown para hacerlo más profesional.
Contexto del proyecto: {self.context.get('project_name', 'Proyecto')}
Objetivo: {self.context.get('goal', 'Documentación técnica')}

Contenido original:
{content[:1500]}

Genera SOLO el markdown mejorado, sin explicaciones."""

            # Invocar Claude CLI
            result = subprocess.run(
                ['claude', '-p', '--dangerously-skip-permissions', '--model', model, prompt],
                capture_output=True,
                text=True,
                timeout=45
            )
            
            if result.returncode == 0:
                return result.stdout.strip()
            else:
                print(f"⚠️ Error en Claude: {result.stderr}")
                return content  # Retornar original si falla
                
        except subprocess.TimeoutExpired:
            print("⚠️ Claude timeout - usando contenido original")
            return content
        except Exception as e:
            print(f"⚠️ Error mejorando contenido: {e}")
            return content
    
    def markdown_to_pdf(self, markdown_content, output_file):
        """Convierte markdown a PDF"""
        try:
            doc = SimpleDocTemplate(output_file, pagesize=letter)
            styles = getSampleStyleSheet()
            story = []
            
            # Procesar líneas de markdown
            lines = markdown_content.split('\n')
            for line in lines:
                if line.startswith('# '):
                    story.append(Paragraph(line[2:], styles['Title']))
                    story.append(Spacer(1, 0.3*inch))
                elif line.startswith('## '):
                    story.append(Paragraph(line[3:], styles['Heading1']))
                    story.append(Spacer(1, 0.2*inch))
                elif line.startswith('### '):
                    story.append(Paragraph(line[4:], styles['Heading2']))
                    story.append(Spacer(1, 0.1*inch))
                elif line.strip():
                    story.append(Paragraph(line, styles['Normal']))
                    story.append(Spacer(1, 0.1*inch))
            
            doc.build(story)
            return output_file
            
        except Exception as e:
            raise Exception(f"Error generando PDF: {e}")
    
    def batch_process(self, data):
        """Procesa múltiples archivos en lote"""
        files = data.get('files', [])
        results = []
        
        for file_config in files:
            result = self.generate_pdf(file_config)
            results.append(result)
            
        return {
            'status': 'success',
            'batch_results': results,
            'total_processed': len(results),
            'successful': sum(1 for r in results if r['status'] == 'success')
        }
    
    def get_status(self):
        """Retorna el estado actual del subagente"""
        return {
            'status': 'success',
            'agent_state': self.state,
            'capabilities': [
                'generate_pdf',
                'enhance_content',
                'batch_processing'
            ],
            'context': self.context
        }
    
    def error_response(self, error_message):
        """Genera respuesta de error estructurada"""
        return {
            'status': 'error',
            'error': error_message,
            'timestamp': datetime.now().isoformat()
        }

def main():
    """Punto de entrada principal para el subagente"""
    parser = argparse.ArgumentParser(description='Subagente Generador de PDFs')
    parser.add_argument('--mode', choices=['interactive', 'daemon', 'single'], 
                       default='single', help='Modo de operación')
    parser.add_argument('--input', help='Archivo JSON con instrucciones')
    parser.add_argument('--socket', help='Socket para comunicación con agente principal')
    
    args = parser.parse_args()
    
    # Crear instancia del subagente
    agent = PDFSubagent()
    
    if args.mode == 'single':
        # Modo single: procesar una solicitud desde stdin o archivo
        if args.input:
            with open(args.input, 'r') as f:
                message = json.load(f)
        else:
            # Leer desde stdin (comunicación con Claude principal)
            message = json.loads(sys.stdin.read())
        
        result = agent.receive_message(message)
        print(json.dumps(result, indent=2))
        
    elif args.mode == 'interactive':
        # Modo interactivo para pruebas
        print("🤖 Subagente PDF activo - Modo interactivo")
        print("Comandos: generate, status, exit")
        
        while True:
            try:
                cmd = input("\n> ").strip()
                if cmd == 'exit':
                    break
                elif cmd == 'status':
                    print(json.dumps(agent.get_status(), indent=2))
                elif cmd == 'generate':
                    source = input("Archivo fuente: ")
                    output = input("Archivo salida [output.pdf]: ") or "output.pdf"
                    enhance = input("Mejorar con Claude? [s/n]: ").lower() == 's'
                    
                    message = {
                        'action': 'generate',
                        'source_file': source,
                        'output_file': output,
                        'enhance': enhance
                    }
                    result = agent.receive_message(message)
                    print(json.dumps(result, indent=2))
                else:
                    print("Comando no reconocido")
                    
            except KeyboardInterrupt:
                print("\n👋 Saliendo...")
                break
            except Exception as e:
                print(f"Error: {e}")
                
    elif args.mode == 'daemon':
        # Modo daemon: escuchar continuamente por mensajes
        print("🤖 Subagente PDF en modo daemon")
        # TODO: Implementar comunicación por socket o pipe
        pass

if __name__ == "__main__":
    main()