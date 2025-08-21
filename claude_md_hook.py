#!/usr/bin/env python3
"""
Hook para detectar cambios en CLAUDE.md y regenerar PDF automáticamente
Se puede usar con watchdog, cron, o integrar con Claude Code hooks
"""

import os
import sys
import json
import hashlib
import subprocess
from pathlib import Path
from datetime import datetime
import time
import argparse

class ClaudeMDWatcher:
    """Observador de cambios en CLAUDE.md"""
    
    def __init__(self, watch_file='CLAUDE.md', state_file='.claude_md_state.json'):
        self.watch_file = Path(watch_file)
        self.state_file = Path(state_file)
        self.subagent_path = Path('./subagent_pdf_generator.py')
        self.state = self.load_state()
        
    def load_state(self):
        """Carga el estado anterior del archivo"""
        if self.state_file.exists():
            try:
                with open(self.state_file, 'r') as f:
                    return json.load(f)
            except:
                pass
        return {
            'last_hash': None,
            'last_modified': None,
            'last_pdf_generated': None,
            'generation_count': 0
        }
    
    def save_state(self):
        """Guarda el estado actual"""
        with open(self.state_file, 'w') as f:
            json.dump(self.state, f, indent=2)
    
    def get_file_hash(self):
        """Calcula el hash SHA256 del archivo"""
        if not self.watch_file.exists():
            return None
            
        with open(self.watch_file, 'rb') as f:
            return hashlib.sha256(f.read()).hexdigest()
    
    def has_changed(self):
        """Detecta si el archivo ha cambiado"""
        current_hash = self.get_file_hash()
        
        if current_hash is None:
            print(f"⚠️ Archivo {self.watch_file} no existe")
            return False
            
        if self.state['last_hash'] != current_hash:
            return True
            
        return False
    
    def invoke_subagent(self, output_file=None):
        """Invoca el subagente para generar el PDF"""
        if output_file is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            output_file = f'CLAUDE_documentation_{timestamp}.pdf'
        
        message = {
            'action': 'generate',
            'source_file': str(self.watch_file),
            'output_file': output_file,
            'enhance': True,
            'model': 'haiku',
            'context': {
                'project_name': 'Taller Claude Code',
                'goal': 'Documentación técnica actualizada',
                'auto_generated': True,
                'trigger': 'file_change_hook'
            }
        }
        
        try:
            print(f"🤖 Invocando subagente para generar PDF...")
            
            result = subprocess.run(
                ['python3', str(self.subagent_path), '--mode', 'single'],
                input=json.dumps(message),
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                response = json.loads(result.stdout)
                if response.get('status') == 'success':
                    print(f"✅ PDF generado: {response['output_file']}")
                    return response
                else:
                    print(f"❌ Error del subagente: {response.get('error')}")
                    return None
            else:
                print(f"❌ Error ejecutando subagente: {result.stderr}")
                return None
                
        except subprocess.TimeoutExpired:
            print("⏱️ Timeout ejecutando el subagente")
            return None
        except Exception as e:
            print(f"❌ Error: {e}")
            return None
    
    def process_change(self):
        """Procesa un cambio detectado en el archivo"""
        print(f"📝 Cambio detectado en {self.watch_file}")
        
        # Actualizar hash
        new_hash = self.get_file_hash()
        self.state['last_hash'] = new_hash
        self.state['last_modified'] = datetime.now().isoformat()
        
        # Generar PDF
        result = self.invoke_subagent()
        
        if result:
            self.state['last_pdf_generated'] = result['output_file']
            self.state['generation_count'] += 1
            
            # Notificación adicional
            self.notify_completion(result)
        
        # Guardar estado
        self.save_state()
        
        return result
    
    def notify_completion(self, result):
        """Notifica que se completó la generación"""
        print("\n" + "="*50)
        print("📋 RESUMEN DE GENERACIÓN")
        print("="*50)
        print(f"Archivo fuente: {self.watch_file}")
        print(f"PDF generado: {result['output_file']}")
        print(f"Mejorado con Claude: {result.get('enhanced', False)}")
        print(f"Total PDFs generados: {self.state['generation_count']}")
        print("="*50 + "\n")
    
    def watch_continuous(self, interval=5):
        """Modo de observación continua"""
        print(f"👁️ Observando cambios en {self.watch_file}")
        print(f"Intervalo de verificación: {interval} segundos")
        print("Presiona Ctrl+C para detener\n")
        
        try:
            while True:
                if self.has_changed():
                    self.process_change()
                time.sleep(interval)
                
        except KeyboardInterrupt:
            print("\n👋 Deteniendo observador")
            self.save_state()
    
    def check_once(self):
        """Verifica una sola vez si hay cambios"""
        if self.has_changed():
            return self.process_change()
        else:
            print(f"✅ {self.watch_file} no ha cambiado")
            return None

class ClaudeCodeHookIntegration:
    """Integración con el sistema de hooks de Claude Code"""
    
    @staticmethod
    def create_hook_script():
        """Crea un script de hook para Claude Code"""
        hook_script = """#!/bin/bash
# Hook de Claude Code para CLAUDE.md

# Detectar si CLAUDE.md fue modificado
if git diff --name-only HEAD^ HEAD | grep -q "CLAUDE.md"; then
    echo "🔄 CLAUDE.md modificado - Regenerando PDF..."
    python3 claude_md_hook.py --once --output CLAUDE_latest.pdf
fi
"""
        
        hook_path = Path('.claude/hooks/post-edit-claude-md.sh')
        hook_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(hook_path, 'w') as f:
            f.write(hook_script)
        
        # Hacer ejecutable
        os.chmod(hook_path, 0o755)
        
        print(f"✅ Hook creado en: {hook_path}")
        return hook_path
    
    @staticmethod
    def create_git_hook():
        """Crea un git hook para post-commit"""
        git_hook = """#!/bin/bash
# Git hook para regenerar PDF cuando CLAUDE.md cambia

# Verificar si CLAUDE.md está en el commit
if git diff-tree --no-commit-id --name-only -r HEAD | grep -q "CLAUDE.md"; then
    echo "🔄 CLAUDE.md committeado - Regenerando PDF..."
    python3 claude_md_hook.py --once --output CLAUDE_latest.pdf
    
    # Opcional: agregar el PDF al commit
    # git add CLAUDE_latest.pdf
    # git commit --amend --no-edit
fi
"""
        
        git_hook_path = Path('.git/hooks/post-commit')
        
        if not git_hook_path.parent.exists():
            print("⚠️ No se encontró directorio .git/hooks")
            return None
        
        with open(git_hook_path, 'w') as f:
            f.write(git_hook)
        
        os.chmod(git_hook_path, 0o755)
        
        print(f"✅ Git hook creado en: {git_hook_path}")
        return git_hook_path

def main():
    """Función principal del hook"""
    parser = argparse.ArgumentParser(
        description='Hook para detectar cambios en CLAUDE.md y regenerar PDF'
    )
    parser.add_argument(
        '--watch', 
        action='store_true',
        help='Modo de observación continua'
    )
    parser.add_argument(
        '--once',
        action='store_true',
        help='Verificar una sola vez'
    )
    parser.add_argument(
        '--interval',
        type=int,
        default=5,
        help='Intervalo de verificación en segundos (default: 5)'
    )
    parser.add_argument(
        '--file',
        default='CLAUDE.md',
        help='Archivo a observar (default: CLAUDE.md)'
    )
    parser.add_argument(
        '--output',
        help='Nombre del archivo PDF de salida'
    )
    parser.add_argument(
        '--install-hooks',
        action='store_true',
        help='Instalar hooks de Claude Code y Git'
    )
    parser.add_argument(
        '--status',
        action='store_true',
        help='Mostrar estado actual'
    )
    
    args = parser.parse_args()
    
    # Instalar hooks
    if args.install_hooks:
        print("📦 Instalando hooks...")
        integration = ClaudeCodeHookIntegration()
        integration.create_hook_script()
        integration.create_git_hook()
        print("✅ Hooks instalados correctamente")
        return
    
    # Crear observador
    watcher = ClaudeMDWatcher(watch_file=args.file)
    
    # Mostrar estado
    if args.status:
        print("📊 Estado actual:")
        print(json.dumps(watcher.state, indent=2))
        return
    
    # Modo de operación
    if args.watch:
        watcher.watch_continuous(interval=args.interval)
    elif args.once:
        result = watcher.check_once()
        if result and args.output:
            # Renombrar al archivo solicitado
            os.rename(result['output_file'], args.output)
            print(f"📄 PDF renombrado a: {args.output}")
    else:
        print("Uso: python3 claude_md_hook.py [--watch | --once | --install-hooks]")
        print("Ejecuta con --help para más opciones")

if __name__ == "__main__":
    main()