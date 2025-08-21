# QUICK START - PRESENTACIONES FIXTER

## 🚀 Creación Rápida

### 1. Copia el template base:
```bash
cp /Users/bliss/taller/scripts/presentation-templates/fixter-reveal-template.html mi-presentacion.html
```

### 2. Reemplaza los placeholders:
- `[TÍTULO DE LA PRESENTACIÓN]` → Tu título
- `[DESCRIPCIÓN]` → Descripción breve
- `[TÍTULO PRINCIPAL]` → Título del slide principal
- `[Subtítulo descriptivo]` → Subtítulo explicativo
- `[Fecha de presentación]` → Fecha actual

### 3. Agrega tus slides:
```html
<section>
    <h1>🎯 Tu Título</h1>
    <h2>Subtítulo explicativo</h2>
    <ul>
        <li><strong>Punto clave:</strong> Descripción</li>
    </ul>
</section>
```

### 4. Valida cumplimiento:
```bash
python3 /Users/bliss/taller/scripts/presentation-templates/validate-fixter-standards.py mi-presentacion.html
```

## 🎨 Elementos Comunes

### Headers jerárquicos:
```html
<h1>🎯 Título Principal</h1>     <!-- Verde #37ab93 -->
<h2>Subtítulo</h2>               <!-- Verde oscuro #186656 -->
<h3>Detalles</h3>                <!-- Verde claro #85ddcb -->
```

### Listas con énfasis:
```html
<ul>
    <li><strong>Concepto:</strong> Explicación detallada</li>
    <li><strong>Beneficio:</strong> Ventaja específica</li>
</ul>
```

### Citas destacadas:
```html
<blockquote>
    "Reflexión importante que refuerza el mensaje principal."
</blockquote>
```

### Precios y ofertas:
```html
<h2>Precio: <span class="price-strike">$999</span></h2>
<h3><b style="color: #bd93f9">$2,490 MXN</b></h3>
```

### Centrado especial:
```html
<section class="center">
    <h1>🚀 Call to Action</h1>
    <h2><a href="https://fixtergeek.com">fixtergeek.com</a></h2>
</section>
```

## ✅ Checklist Final

Antes de publicar, verifica:
- [ ] Template base utilizado
- [ ] Placeholders reemplazados
- [ ] Validación pasada sin errores críticos
- [ ] Colores Fixter aplicados
- [ ] Tipografía Space Grotesk cargada
- [ ] Links funcionando correctamente
- [ ] Responsive design probado

## 🛠️ Comandos Útiles

```bash
# Validar presentación
python3 validate-fixter-standards.py presentacion.html

# Servidor local para probar
python3 -m http.server 8000

# Ver en navegador
open http://localhost:8000/presentacion.html
```

## 📞 Soporte

- **Estándares:** Definidos en `FIXTER-STANDARDS.md`
- **Template:** `fixter-reveal-template.html`
- **Validador:** `validate-fixter-standards.py`
- **Contacto:** Héctor Bliss - FixterGeek