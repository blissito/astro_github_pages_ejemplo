#!/bin/bash

# Script de prueba para el subagente PDF
# Demuestra diferentes modos de uso

echo "🧪 Pruebas del Subagente PDF Generator"
echo "======================================"

# Hacer ejecutables los scripts
chmod +x subagent_pdf_generator.py
chmod +x invoke_subagent.py

# Test 1: Generar PDF simple sin mejoras
echo -e "\n📝 Test 1: PDF simple (sin Claude)"
echo '{
  "action": "generate",
  "source_file": "fase1-resumen.md",
  "output_file": "test1_simple.pdf",
  "enhance": false
}' | python3 subagent_pdf_generator.py --mode single

# Test 2: Generar PDF con mejoras de Claude
echo -e "\n✨ Test 2: PDF mejorado con Claude"
echo '{
  "action": "generate",
  "source_file": "fase1-resumen.md",
  "output_file": "test2_enhanced.pdf",
  "enhance": true,
  "model": "haiku",
  "context": {
    "project_name": "Taller Claude Code",
    "goal": "Documentación profesional"
  }
}' | python3 subagent_pdf_generator.py --mode single

# Test 3: Consultar estado del subagente
echo -e "\n📊 Test 3: Estado del subagente"
echo '{"action": "status"}' | python3 subagent_pdf_generator.py --mode single

# Test 4: Procesamiento en lote
echo -e "\n📚 Test 4: Procesamiento en lote"
echo '{
  "action": "batch",
  "files": [
    {
      "source_file": "fase1-resumen.md",
      "output_file": "batch_test1.pdf",
      "enhance": false
    },
    {
      "source_file": "CLAUDE.md",
      "output_file": "batch_test2.pdf",
      "enhance": false
    }
  ]
}' | python3 subagent_pdf_generator.py --mode single

# Test 5: Usar el orquestador
echo -e "\n🔗 Test 5: Usando el orquestador"
python3 invoke_subagent.py --demo

echo -e "\n✅ Pruebas completadas"
echo "Archivos PDF generados:"
ls -la *.pdf 2>/dev/null || echo "No se encontraron PDFs"