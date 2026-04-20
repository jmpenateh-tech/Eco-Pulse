# 🌱 Eco-pulse - Plataforma Ambiental ODS 15

Plataforma moderna y responsiva para reportar daños ambientales y participar en acciones ecológicas reales, alineada con el **Objetivo de Desarrollo Sostenible 15: Vida de Ecosistemas Terrestres**.

## 📋 Contenidos

- [Características](#características)
- [Estructura](#estructura)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Componentes](#componentes)
- [Guía de Uso](#guía-de-uso)
- [Responsividad](#responsividad)
- [Accesibilidad](#accesibilidad)

## ✨ Características

### 🎨 Diseño
- **Minimalista y ecológico** con paleta verde (#2E7D32)
- **Tipografía moderna**: Inter (body) y Poppins (display)
- **Mobile-first responsive** - Optimizado para todos los dispositivos
- **Microinteracciones suaves** - Transiciones y animaciones fluidas
- **Modo claro preparado** - Estructura lista para tema oscuro

### 🧩 Secciones
1. **Hero Section** - Título impactante con CTA principal y secundaria
2. **Mapa Interactivo** - Visualización de reportes en tiempo real con Leaflet
3. **Cómo Funciona** - 3 pasos claros del proceso (Reportar → Verificar → Actuar)
4. **Jornadas Ecológicas** - Cards de eventos con cupos y detalles
5. **Panel de Impacto** - Métricas visuales con animación de contadores
6. **CTA Final** - Llamado a la acción motivador
7. **Footer** - Links rápidos y redes sociales

### 📱 Componentes Requeridos
- ✅ Navbar sticky con navegación responsiva
- ✅ Botones primarios y secundarios con hover states
- ✅ Cards reutilizables (eventos, reportes, métricas)
- ✅ Sistema de badges con categorías coloreadas
- ✅ Formulario de reporte con validación
- ✅ Mapa interactivo con filtros
- ✅ Modales para acciones principales

## 📁 Estructura

```
ODS_15/
├── index.html          # Página principal (HTML semántico)
├── styles.css          # Estilos CSS (variables, componentes, responsive)
├── scripts.js          # JavaScript (interactividad, mapa, animaciones)
└── README.md          # Este archivo
```

## 🛠️ Tecnologías

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Grid, Flexbox, Custom Properties, Animaciones
- **JavaScript Vanilla** - Sin dependencias (excepto librerías externas)

### Librerías Externas
- **Leaflet** (CDN) - Mapas interactivos
- **Feather Icons** (CDN) - Iconografía outline
- **Google Fonts** - Tipografía (Inter, Poppins)

### Servidor
- Servir con cualquier servidor HTTP (Live Server, Python, Node.js, etc.)

## 📦 Instalación

### 1. Clonar o descargar los archivos
```bash
# Los tres archivos deben estar en la misma carpeta:
- index.html
- styles.css
- scripts.js
```

### 2. Servir localmente
```bash
# Opción 1: Python 3
python -m http.server 8000

# Opción 2: Node.js (http-server)
npx http-server

# Opción 3: Live Server en VS Code
# Instalar extensión y click derecho > "Open with Live Server"
```

### 3. Abrir en navegador
```
http://localhost:8000 (o el puerto que uses)
```

## 🧩 Componentes

### Botones
```html
<!-- Primario -->
<button class="btn btn--primary">Reportar daño</button>

<!-- Secundario -->
<button class="btn btn--secondary">Ver mapa</button>

<!-- Tamaños -->
<button class="btn btn--primary btn--small">Pequeño</button>
<button class="btn btn--primary btn--large">Grande</button>
```

### Badges
```html
<div class="badge badge--tala">Tala Ilegal</div>
<div class="badge badge--basura">Basura</div>
<div class="badge badge--incendio">Incendio</div>
<div class="badge badge--fauna">Fauna Amenazada</div>
```

### Cards
```html
<!-- Event Card -->
<div class="event-card">
    <div class="event-card__image">Imagen</div>
    <div class="event-card__content">Contenido</div>
</div>

<!-- Step Card -->
<div class="step-card">
    <div class="step-card__number">1</div>
    <div class="step-card__icon">Icono</div>
    <h3 class="step-card__title">Título</h3>
    <p class="step-card__description">Descripción</p>
</div>

<!-- Metric Card -->
<div class="metric-card">
    <div class="metric-card__number" data-count="25847">0</div>
    <div class="metric-card__label">Árboles Plantados</div>
</div>
```

### Formulario
```html
<form class="form">
    <div class="form__group">
        <label class="form__label">Label</label>
        <input class="form__input" type="text">
    </div>
    <button class="btn btn--primary">Enviar</button>
</form>
```

## 📖 Guía de Uso

### Para Usuarios
1. **Reportar Daño**: Haz click en "Reportar daño ambiental" → Completa el formulario
2. **Ver Mapa**: Visualiza todos los reportes y filtra por categoría
3. **Unirme a Jornada**: Selecciona un evento y haz click en "Unirme"
4. **Seguir Impacto**: Ve las métricas en tiempo real en el panel de impacto

### Para Desarrolladores
1. **Agregar Reportes**: Edita el array `reportesData` en `scripts.js`
2. **Cambiar Colores**: Modifica las variables en `:root` en `styles.css`
3. **Agregar Secciones**: Usa la estructura de componentes existente
4. **Customizar Mapa**: Modifica `initMap()` en `scripts.js`

### Variables CSS Principales
```css
--color-primary: #2E7D32;           /* Verde principal */
--color-primary-light: #43A047;     /* Verde claro */
--font-primary: 'Inter', sans-serif;
--spacing-lg: 2rem;                 /* Espaciado */
--radius-lg: 16px;                  /* Bordes redondeados */
```

## 📱 Responsividad

### Breakpoints
- **Desktop**: 1200px+ (vista completa)
- **Tablet**: 769px - 1199px (ajustes de grid)
- **Mobile**: 320px - 768px (stack vertical)
- **Extra pequeño**: < 480px (optimizaciones específicas)

### Características Responsive
- ✅ Grid automático que se adapta
- ✅ Tipografía escalable
- ✅ Navbar colapsable con hamburger menu
- ✅ Imágenes y SVGs adaptables
- ✅ Touch-friendly en móviles (botones más grandes)
- ✅ Mapas ajustables en altura

## ♿ Accesibilidad

### Implementado
- ✅ Semántica HTML5 correcta
- ✅ Contrast de colores WCAG AA
- ✅ Etiquetas `aria-label` en botones
- ✅ Navegación por teclado completa
- ✅ Focus states visibles
- ✅ Alt text en imágenes (SVG inline)
- ✅ Soporte para `prefers-reduced-motion`

### Mejoras Futuras
- [ ] Agregar ARIA landmarks más específicos
- [ ] Textos alternativos en SVG dinámicos
- [ ] Subtítulos en video (si aplica)
- [ ] Testing con NVDA/JAWS

## 🎯 ODS 15 - Vida de Ecosistemas Terrestres

Esta plataforma contribuye a los objetivos del ODS 15:
- 🌳 **Restauración de ecosistemas** - Acciones de reforestación
- 🦋 **Protección de biodiversidad** - Monitoreo de fauna
- 🌍 **Uso sostenible de recursos** - Limpieza y recuperación
- 👥 **Participación ciudadana** - Empoderamiento comunitario

## 🚀 Próximas Mejoras

- [ ] Integración con base de datos real
- [ ] Sistema de autenticación usuarios
- [ ] Dashboard de verificadores
- [ ] API para datos dinámicos
- [ ] Certificados virtuales para voluntarios
- [ ] Integración con redes sociales
- [ ] Notificaciones push
- [ ] Exportación de reportes

## 📞 Soporte

Para reportes de bugs o sugerencias, contacta a: info@ecoalerta.com

---

**Eco-pulse 🌱 | Protegiendo los Ecosistemas Terrestres | ODS 15 2026**
