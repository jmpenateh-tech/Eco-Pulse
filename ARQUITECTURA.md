# 📚 Guía de Arquitectura y Buenas Prácticas - Eco-pulse

## 🏗️ Estructura Arquitectónica

### Patrón Actual: Vanilla + CDN

```
Eco-pulse
├── HTML Semántico
│   └── Estructura clara y accesible
├── CSS Modular
│   ├── Variables globales (:root)
│   ├── Componentes reutilizables
│   └── Breakpoints responsivos
└── JavaScript Vanilla
    ├── Inicialización del DOM
    ├── Gestión de eventos
    ├── Animaciones
    └── Integración con Leaflet
```

### Evolución Futura Recomendada

Para proyectos más grandes, considera:

1. **Frontend Framework**
   - React, Vue 3, o Svelte
   - Gestión de estado (Redux, Pinia, Zustand)
   - Componentes reutilizables

2. **Build Tool**
   - Vite para desarrollo rápido
   - Webpack si requiere más complejidad
   - esbuild para bundling

3. **Backend**
   - Node.js + Express
   - Python + Django/FastAPI
   - Firebase para MVP rápido

## 🎯 Principios de Diseño

### 1. Mobile-First
```css
/* Primero los estilos para móvil */
.elemento {
    display: block;
    width: 100%;
}

/* Luego mejorar para escritorio */
@media (min-width: 768px) {
    .elemento {
        display: grid;
        width: 50%;
    }
}
```

### 2. Componentes Reutilizables
```html
<!-- Usar clases BEM para componentes -->
<button class="btn btn--primary btn--large">
    Acción
</button>
```

### 3. Variables CSS (DRY)
```css
:root {
    --color-primary: #2E7D32;
    --spacing-lg: 2rem;
}

.elemento {
    color: var(--color-primary);
    padding: var(--spacing-lg);
}
```

## 🔧 Gestión de Eventos

### Pattern: Event Delegation
```javascript
// ❌ Evitar múltiples listeners
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', handleClick);
});

// ✅ Preferir delegación
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn')) {
        handleClick(e);
    }
});
```

### Pattern: Separación de Responsabilidades
```javascript
// ❌ Mezcla lógica y presentación
button.addEventListener('click', () => {
    element.style.color = 'red';
    element.style.fontSize = '20px';
    // ... más estilos
});

// ✅ Usar clases CSS
button.addEventListener('click', () => {
    element.classList.toggle('active');
});
```

## 🎨 Sistema de Colores

### Definición en CSS
```css
:root {
    /* Colores de marca */
    --color-primary: #2E7D32;
    --color-secondary: #0277BD;
    
    /* Estados */
    --color-success: #43A047;
    --color-warning: #FFA726;
    --color-danger: #EF5350;
    
    /* Escala de grises */
    --color-gray-100: #F5F5F5;
    --color-gray-700: #616161;
}
```

### Uso en Componentes
```css
.btn--primary {
    background: var(--color-primary);
    transition: background 300ms ease;
}

.btn--primary:hover {
    background: color-mix(in srgb, var(--color-primary) 85%, black);
}
```

## 📱 Responsive Design

### Estrategia de Breakpoints
```css
/* Mobile First */
@media (min-width: 640px) { /* Small devices */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Small desktop */ }
@media (min-width: 1280px) { /* Desktop */ }
@media (min-width: 1536px) { /* Large desktop */ }
```

### Container Queries (Futuro)
```css
@container (min-width: 300px) {
    .card {
        padding: 1rem;
    }
}
```

## ♿ Accesibilidad

### Checklist A11y
- ✅ Semántica HTML correcta
- ✅ Contrast ratio ≥ 4.5:1 para texto
- ✅ Focus visible con outline
- ✅ Labels en formularios
- ✅ ARIA labels cuando sea necesario
- ✅ Navegación por teclado funcional
- ✅ Soporte para prefers-reduced-motion

### Implementación
```javascript
// Soportar reducción de movimiento
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Desactivar animaciones
}
```

## 🚀 Performance

### Optimizaciones Actuales
- CDN para librerías externas
- SVG inline para iconos
- CSS minificado
- JavaScript vanilla (sin overhead de framework)

### Mejoras Futuras
```javascript
// Lazy Loading
<img src="placeholder.jpg" data-src="actual.jpg" loading="lazy">

// Code Splitting
const mapModule = import('./map.js');

// Resource Hints
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://api.example.com">
```

## 🔐 Seguridad

### Prácticas Recomendadas
```javascript
// ❌ Evitar XSS
element.innerHTML = userInput;

// ✅ Usar métodos seguros
element.textContent = userInput;
element.appendChild(document.createTextNode(userInput));

// ❌ Evitar eval
eval(userInput);

// ✅ Usar JSON.parse
const data = JSON.parse(jsonString);
```

### CSRF Protection
```html
<form>
    <input type="hidden" name="csrf_token" value="token_aqui">
</form>
```

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'">
```

## 📊 State Management (Futuro)

### Simple Object Store
```javascript
const state = {
    reports: [],
    filters: { category: 'all' },
    user: null
};

function updateState(updates) {
    Object.assign(state, updates);
    render();
}
```

### Con Patrón Observer
```javascript
class Store {
    constructor(initialState) {
        this.state = initialState;
        this.observers = [];
    }
    
    subscribe(observer) {
        this.observers.push(observer);
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.observers.forEach(o => o(this.state));
    }
}
```

## 🧪 Testing

### Unit Testing con Vitest
```javascript
import { describe, it, expect } from 'vitest';

describe('Utilidades', () => {
    it('debe filtrar reportes por categoría', () => {
        const reportes = [
            { categoria: 'tala' },
            { categoria: 'basura' }
        ];
        
        const filtrados = reportes.filter(r => r.categoria === 'tala');
        expect(filtrados).toHaveLength(1);
    });
});
```

### E2E Testing con Cypress
```javascript
describe('Landing Page', () => {
    it('debe mostrar el hero section', () => {
        cy.visit('/');
        cy.get('h1').should('contain', 'Protege los ecosistemas');
    });
    
    it('debe abrir modal al reportar', () => {
        cy.get('[data-modal="reportar"]').click();
        cy.get('#modalReportar').should('have.class', 'active');
    });
});
```

## 📝 Convenciones de Código

### Naming Conventions
```javascript
// Constantes
const MAX_REPORTES_POR_PAGINA = 10;

// Funciones
function initializeMap() { }
function validateReportForm() { }

// Booleanos
const isOpen = false;
const hasError = true;
const shouldRender = true;

// Privados (con underscore)
function _internalHelper() { }
```

### Comentarios
```javascript
// ✅ Comentarios útiles
// Validar que el email no exista en la base de datos
const isUnique = !existingEmails.includes(email);

// ❌ Comentarios obvios
// Incrementar contador
count++;
```

## 📦 Dependencias y Librerías

### Actuales
- **Leaflet** - Mapas interactivos
- **Feather Icons** - Iconografía
- **Google Fonts** - Tipografía

### Alternativas Recomendadas
```javascript
// Mapas
// - Mapbox GL
// - OpenLayers
// - Deck.gl para datos grandes

// UI Components
// - shadcn/ui (React)
// - Headless UI
// - Radix UI

// Iconos
// - Heroicons
// - Tabler Icons
// - Phosphor Icons
```

## 🔄 Control de Versiones

### Git Workflow Recomendado
```bash
# Main branch - Producción
main

# Development branch
develop

# Feature branches
feature/nueva-seccion
feature/mapa-mejorado

# Bug fixes
bugfix/error-modal

# Hotfixes críticos
hotfix/seguridad-critica
```

### Commits Semánticos
```bash
feat: agregar sección de comentarios
fix: corregir animación de navbar
docs: actualizar README
style: formatos de código
refactor: mejorar estructura del mapa
test: agregar tests para filtros
perf: optimizar carga de reportes
```

## 🚀 Deployment

### Opciones Hosting
1. **Vercel** - Óptimo para static + serverless
2. **Netlify** - Similar a Vercel
3. **GitHub Pages** - Gratis para static
4. **AWS S3 + CloudFront** - Profesional
5. **DigitalOcean** - Flexible y económico

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: npm run deploy
```

## 📚 Recursos Educativos

### Referencia Técnica
- [MDN Web Docs](https://developer.mozilla.org)
- [CSS-Tricks](https://css-tricks.com)
- [JavaScript.info](https://javascript.info)

### Herramientas
- [Can I Use](https://caniuse.com) - Soporte de navegadores
- [WebPageTest](https://webpagetest.org) - Performance
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## ✅ Checklist Pre-Producción

- [ ] Tests funcionales completados
- [ ] Validación de accesibilidad (WCAG 2.1 AA)
- [ ] Performance audit (Lighthouse >90)
- [ ] SEO optimizado
- [ ] Mobile friendly check
- [ ] Cross-browser testing
- [ ] Backup y disaster recovery plan
- [ ] Documentación completada
- [ ] Monitoreo configurado
- [ ] SSL/HTTPS enabled

---

**Mantén buenas prácticas para un código limpio, seguro y mantenible.** ✨
