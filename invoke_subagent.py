#!/usr/bin/env python3
"""
Script para demostrar cómo Claude Code puede invocar al subagente PDF
"""

import json
import subprocess
import sys
from pathlib import Path

class SubagentOrchestrator:
    """Orquestador para comunicarse con subagentes"""
    
    def __init__(self):
        self.subagents = {
            'pdf_generator': './subagent_pdf_generator.py'
        }
        
    def invoke_subagent(self, agent_name, message):
        """Invoca un subagente y retorna su respuesta"""
        if agent_name not in self.subagents:
            return {'status': 'error', 'error': f'Subagente {agent_name} no encontrado'}
        
        agent_path = self.subagents[agent_name]
        
        try:
            # Invocar subagente pasando mensaje por stdin
            result = subprocess.run(
                ['python3', agent_path, '--mode', 'single'],
                input=json.dumps(message),
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                return json.loads(result.stdout)
            else:
                return {
                    'status': 'error',
                    'error': result.stderr or 'Error desconocido'
                }
                
        except subprocess.TimeoutExpired:
            return {'status': 'error', 'error': 'Timeout en subagente'}
        except json.JSONDecodeError as e:
            return {'status': 'error', 'error': f'Error parseando respuesta: {e}'}
        except Exception as e:
            return {'status': 'error', 'error': str(e)}
    
    def delegate_task(self, task_description):
        """Delega una tarea al subagente apropiado basándose en la descripción"""
        
        # Análisis simple de la tarea para decidir qué subagente usar
        if 'pdf' in task_description.lower() or 'documento' in task_description.lower():
            return self.process_pdf_task(task_description)
        else:
            return {'status': 'error', 'error': 'No hay subagente para esta tarea'}
    
    def process_pdf_task(self, task):
        """Procesa tareas relacionadas con PDFs"""
        # Extraer parámetros de la tarea (en un caso real, Claude analizaría esto)
        message = {
            'action': 'generate',
            'source_file': 'fase1-resumen.md',
            'output_file': 'fase1-documentacion.pdf',
            'enhance': True,
            'context': {
                'project_name': 'Taller Claude Code',
                'goal': 'Documentación técnica del taller'
            }
        }
        
        return self.invoke_subagent('pdf_generator', message)

def demonstrate_subagent_communication():
    """Demuestra diferentes formas de comunicación con el subagente"""
    
    orchestrator = SubagentOrchestrator()
    
    print("🚀 Demostración de Comunicación con Subagente PDF\n")
    print("=" * 50)
    
    # Ejemplo 1: Generar PDF simple
    print("\n📝 Ejemplo 1: Generación simple de PDF")
    message1 = {
        'action': 'generate',
        'source_file': 'fase1-resumen.md',
        'output_file': 'ejemplo1.pdf',
        'enhance': False
    }
    result1 = orchestrator.invoke_subagent('pdf_generator', message1)
    print(f"Resultado: {json.dumps(result1, indent=2)}")
    
    # Ejemplo 2: Generar PDF con mejora de Claude
    print("\n✨ Ejemplo 2: PDF mejorado con Claude")
    message2 = {
        'action': 'generate',
        'source_file': 'fase1-resumen.md',
        'output_file': 'ejemplo2_mejorado.pdf',
        'enhance': True,
        'model': 'haiku',
        'context': {
            'project_name': 'Taller de Automatización',
            'goal': 'Crear documentación profesional'
        }
    }
    result2 = orchestrator.invoke_subagent('pdf_generator', message2)
    print(f"Resultado: {json.dumps(result2, indent=2)}")
    
    # Ejemplo 3: Procesamiento en lote
    print("\n📚 Ejemplo 3: Procesamiento en lote")
    message3 = {
        'action': 'batch',
        'files': [
            {
                'source_file': 'fase1-resumen.md',
                'output_file': 'batch1.pdf',
                'enhance': True
            },
            {
                'source_file': 'CLAUDE.md',
                'output_file': 'batch2.pdf',
                'enhance': False
            }
        ]
    }
    result3 = orchestrator.invoke_subagent('pdf_generator', message3)
    print(f"Resultado: {json.dumps(result3, indent=2)}")
    
    # Ejemplo 4: Consultar estado del subagente
    print("\n📊 Ejemplo 4: Estado del subagente")
    message4 = {'action': 'status'}
    result4 = orchestrator.invoke_subagent('pdf_generator', message4)
    print(f"Estado: {json.dumps(result4, indent=2)}")
    
    # Ejemplo 5: Delegación inteligente
    print("\n🤖 Ejemplo 5: Delegación inteligente de tareas")
    task = "Necesito generar un PDF profesional del resumen de la fase 1"
    result5 = orchestrator.delegate_task(task)
    print(f"Tarea: '{task}'")
    print(f"Resultado: {json.dumps(result5, indent=2)}")

def main():
    """Función principal"""
    if len(sys.argv) > 1 and sys.argv[1] == '--demo':
        demonstrate_subagent_communication()
    else:
        # Modo normal: actuar como intermediario
        print("🔗 Orquestador de Subagentes activo")
        print("Uso: python3 invoke_subagent.py --demo")
        print("\nO envía un mensaje JSON por stdin para procesar")
        
        try:
            # Leer mensaje desde stdin
            message = json.loads(sys.stdin.read())
            orchestrator = SubagentOrchestrator()
            
            # Determinar subagente basado en el mensaje
            agent = message.get('subagent', 'pdf_generator')
            result = orchestrator.invoke_subagent(agent, message)
            
            # Retornar resultado
            print(json.dumps(result, indent=2))
            
        except json.JSONDecodeError:
            print(json.dumps({
                'status': 'error',
                'error': 'Mensaje JSON inválido'
            }))
        except Exception as e:
            print(json.dumps({
                'status': 'error',
                'error': str(e)
            }))

if __name__ == "__main__":
    main()