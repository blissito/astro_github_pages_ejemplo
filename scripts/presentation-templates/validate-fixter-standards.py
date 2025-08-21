#!/usr/bin/env python3
"""
FIXTER PRESENTATION STANDARDS VALIDATOR
Valida que las presentaciones HTML cumplan con los estándares obligatorios de FixterGeek
"""

import re
import sys
from pathlib import Path

def validate_fixter_presentation(html_file_path):
    """Valida que una presentación HTML cumpla con los estándares Fixter"""
    
    if not Path(html_file_path).exists():
        return False, ["Archivo no encontrado"]
    
    with open(html_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    errors = []
    warnings = []
    
    # 1. Verificar Reveal.js 5.0.5
    if "reveal.js/5.0.5" not in content:
        errors.append("❌ CRÍTICO: Debe usar Reveal.js versión 5.0.5 EXACTA")
    
    # 2. Verificar Space Grotesk
    if "Space+Grotesk" not in content:
        errors.append("❌ CRÍTICO: Debe usar tipografía Space Grotesk")
    
    # 3. Verificar paleta de colores Fixter
    brand_colors = ["#37ab93", "#186656", "#85ddcb"]
    found_colors = 0
    for color in brand_colors:
        if color in content:
            found_colors += 1
    
    if found_colors < 2:
        errors.append("❌ CRÍTICO: Debe usar paleta de colores Fixter (#37ab93, #186656, #85ddcb)")
    
    # 4. Verificar gradiente de fondo
    if "linear-gradient" not in content or "#1e1e2e" not in content:
        errors.append("❌ CRÍTICO: Debe usar gradiente de fondo morado especificado")
    
    # 5. Verificar estructura de cards
    if "background: white" not in content or "border-radius" not in content:
        errors.append("❌ CRÍTICO: Debe usar estructura de cards flotantes blancas")
    
    # 6. Verificar overflow visible
    if "overflow: visible" not in content:
        warnings.append("⚠️  ADVERTENCIA: Se recomienda overflow: visible")
    
    # 7. Verificar meta author
    if 'name="author" content="Héctor Bliss"' not in content:
        warnings.append("⚠️  ADVERTENCIA: Autor debería ser 'Héctor Bliss'")
    
    # 8. Verificar configuración Reveal.js
    required_config = ["hash: true", "controls: true", "transition: \"slide\""]
    missing_config = []
    for config in required_config:
        if config not in content:
            missing_config.append(config)
    
    if missing_config:
        warnings.append(f"⚠️  ADVERTENCIA: Configuración Reveal.js incompleta: {missing_config}")
    
    # 9. Verificar responsive design
    if "@media" not in content:
        warnings.append("⚠️  ADVERTENCIA: No se detectó configuración responsive")
    
    return len(errors) == 0, errors + warnings

def main():
    if len(sys.argv) != 2:
        print("Uso: python validate-fixter-standards.py <archivo.html>")
        sys.exit(1)
    
    html_file = sys.argv[1]
    is_valid, messages = validate_fixter_presentation(html_file)
    
    print(f"\n🔍 VALIDACIÓN ESTÁNDARES FIXTER")
    print(f"📄 Archivo: {html_file}")
    print("=" * 50)
    
    if is_valid:
        print("✅ PRESENTACIÓN VÁLIDA - Cumple estándares Fixter")
    else:
        print("❌ PRESENTACIÓN INVÁLIDA - No cumple estándares")
    
    print()
    for message in messages:
        print(message)
    
    print("\n" + "=" * 50)
    print("📋 CHECKLIST RÁPIDO:")
    print("  ✓ Reveal.js 5.0.5")
    print("  ✓ Space Grotesk")
    print("  ✓ Cards blancas flotantes")
    print("  ✓ Gradiente morado")
    print("  ✓ Paleta Fixter")
    print("  ✓ Overflow visible")
    print("  ✓ Responsive design")
    
    sys.exit(0 if is_valid else 1)

if __name__ == "__main__":
    main()