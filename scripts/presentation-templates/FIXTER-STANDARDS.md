# ESTÁNDARES FIXTER PARA PRESENTACIONES HTML
**VERSIÓN DEFINITIVA - OBLIGATORIO PERMANENTE**

## FORMATO OBLIGATORIO
**Cards flotantes sobre gradiente - ÚNICO FORMATO PERMITIDO**

### Características NO NEGOCIABLES:

1. **Framework:** Reveal.js versión 5.0.5 EXACTA
2. **Tipografía:** Space Grotesk OBLIGATORIA
3. **Estructura:** Cards blancas flotantes sobre gradiente morado
4. **Paleta:** Brand Fixter (#37ab93, #186656, #85ddcb)
5. **Tamaños:** Fuentes pequeñas para máximo contenido
6. **Comportamiento:** Overflow visible, sin scroll
7. **Responsive:** Centrado y adaptativo

### Variables CSS FIJAS:
```css
:root {
    --bg-color: #1e1e2e;
    --text-color: #f8f8f2;
    --brand-700: #37ab93;
    --brand-800: #186656;
    --brand-500: #85ddcb;
    --accent-color: #bd93f9;
    --code-bg: #2e2e3e;
}
```

### CDN Links OBLIGATORIOS:
```html
<!-- Reveal.js 5.0.5 FIJO -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.5/reveal.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.5/theme/black.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.5/plugin/highlight/monokai.min.css">

<!-- Space Grotesk OBLIGATORIO -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Configuración Reveal.js ESTÁNDAR:
```javascript
Reveal.initialize({
    hash: true,
    controls: true,
    progress: true,
    center: true,
    transition: "slide",
    backgroundTransition: "fade",
    plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
});
```

## REGLAS DE IMPLEMENTACIÓN:

### ✅ SIEMPRE HACER:
- Usar template base en `/presentation-templates/fixter-reveal-template.html`
- Mantener estructura de cards flotantes
- Aplicar paleta de colores Fixter
- Usar tipografía Space Grotesk
- Implementar gradiente de fondo morado
- Configurar overflow visible
- Asegurar responsive design

### ❌ NUNCA HACER:
- Cambiar versión de Reveal.js
- Usar otras tipografías
- Modificar paleta de colores
- Crear otros estilos de layout
- Ignorar frontmatter de Marp
- Implementar scroll interno
- Usar colores fuera de la paleta

## ESTRUCTURA DE ARCHIVOS:

```
presentation-templates/
├── fixter-reveal-template.html    # Template base OBLIGATORIO
├── FIXTER-STANDARDS.md           # Este documento
└── examples/                     # Ejemplos de implementación
```

## PROCESO DE CREACIÓN:

1. **COPIAR** template base
2. **REEMPLAZAR** placeholders:
   - `[TÍTULO DE LA PRESENTACIÓN]`
   - `[DESCRIPCIÓN]`
   - `[TÍTULO PRINCIPAL]`
   - `[Subtítulo descriptivo]`
   - `[Fecha de presentación]`
3. **AGREGAR** contenido específico
4. **VERIFICAR** cumplimiento de estándares
5. **CONFIRMAR** funcionamiento correcto

## VERIFICACIÓN DE CALIDAD:

### Checklist obligatorio:
- [ ] Cards blancas sobre gradiente morado
- [ ] Tipografía Space Grotesk cargada
- [ ] Paleta Fixter implementada
- [ ] Reveal.js 5.0.5 funcionando
- [ ] Responsive design activo
- [ ] Overflow visible configurado
- [ ] Transiciones suaves
- [ ] Contenido legible

### Puntos de falla comunes:
- Cambiar colores de marca
- Usar tipografías diferentes
- Modificar estructura de cards
- Implementar scroll interno
- Alterar configuración Reveal.js

## MANTENIMIENTO:

- **Frecuencia:** Revisar cada 6 meses
- **Responsable:** Héctor Bliss
- **Criterio:** Mantener coherencia visual absoluta
- **Actualizaciones:** Solo por necesidad técnica crítica

---

**ÚLTIMA ACTUALIZACIÓN:** 2025-08-13  
**ESTADO:** DEFINITIVO Y PERMANENTE  
**APROBADO POR:** Héctor Bliss - FixterGeek  

**NOTA CRÍTICA:** Estos estándares NO son sugerencias. Son requisitos absolutos para todas las presentaciones HTML de FixterGeek. Cualquier desviación debe ser aprobada explícitamente por el responsable del proyecto.