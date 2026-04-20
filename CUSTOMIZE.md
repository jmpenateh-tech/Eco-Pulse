# 🎨 Guía de Customización - Eco-pulse

Documento completo para personalizar EcoAlerta según tus necesidades.

## 🎯 Personalización Rápida

### 1. Cambiar Colores Principales

Edita en `styles.css` las variables en `:root`:

```css
:root {
    /* Cambiar color principal */
    --color-primary: #2E7D32;              /* Verde actual */
    --color-primary-light: #43A047;        /* Verde claro */
    --color-primary-lighter: #66BB6A;      /* Verde más claro */
    --color-primary-lightest: #C8E6C9;     /* Verde muy claro */
    
    /* Ejemplo: Cambiar a azul */
    --color-primary: #1976D2;
    --color-primary-light: #1E88E5;
    --color-primary-lighter: #42A5F5;
    --color-primary-lightest: #BBDEFB;
}
```

### 2. Cambiar Tipografía

```css
:root {
    --font-primary: 'Inter', sans-serif;        /* Body text */
    --font-display: 'Poppins', sans-serif;      /* Títulos */
    
    /* Alternativas:
       - Body: 'Roboto', 'Lato', 'Open Sans'
       - Display: 'Raleway', 'Montserrat', 'Playfair Display'
    */
}
```

En `index.html`, dentro de `<head>`:

```html
<!-- Cambiar fuentes de Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
```

Luego actualizar las variables CSS.

### 3. Cambiar Espaciado

```css
:root {
    --spacing-xs: 0.5rem;     /* 8px */
    --spacing-sm: 1rem;       /* 16px */
    --spacing-md: 1.5rem;     /* 24px */
    --spacing-lg: 2rem;       /* 32px */
    --spacing-xl: 3rem;       /* 48px */
    --spacing-2xl: 4rem;      /* 64px */
}
```

### 4. Cambiar Tamaños de Fuente

```css
:root {
    --font-size-h1: 3.5rem;   /* 56px */
    --font-size-h2: 2.5rem;   /* 40px */
    --font-size-h3: 1.75rem;  /* 28px */
    --font-size-base: 1rem;   /* 16px */
    --font-size-sm: 0.875rem; /* 14px */
    --font-size-xs: 0.75rem;  /* 12px */
}
```

## 🗺️ Manipular el Mapa

### Cambiar Centro del Mapa

En `scripts.js`, función `initMap()`:

```javascript
function initMap() {
    // Cambiar [lat, lng] y zoom
    // Bogotá actual: [4.7110, -74.0721], zoom: 11
    
    // Ejemplos:
    // Medellín: [6.2442, -75.5898], zoom: 11
    // Cali: [3.4372, -76.5069], zoom: 11
    // Cartagena: [10.3910, -75.5134], zoom: 12
    
    map = L.map('map').setView([6.2442, -75.5898], 11);
    
    // ... resto del código
}
```

### Agregar Nuevos Reportes

En `scripts.js`, array `reportesData`:

```javascript
const reportesData = [
    {
        id: 6,
        lat: 4.5000,
        lng: -74.1500,
        categoria: 'tala',              // tala, basura, incendio, fauna
        titulo: 'Mi nuevo reporte',
        descripcion: 'Descripción detallada',
        fecha: '1 día atrás',
        reportes: 24
    },
    // ... agregar más
];
```

### Cambiar Estilo de Marcadores

En `scripts.js`, función `getMarkerHTML()`:

```javascript
function getMarkerHTML(categoria) {
    const colors = {
        'tala': '#D32F2F',      // Rojo
        'basura': '#9C27B0',    // Púrpura
        'incendio': '#FF9800',  // Naranja
        'fauna': '#4CAF50'      // Verde
    };
    
    // Personalizar HTML del marcador aquí
    return `<div style="...">Contenido personalizado</div>`;
}
```

## 📝 Agregar Nuevas Secciones

### Plantilla de Nueva Sección

```html
<!-- En index.html, dentro del main -->
<section class="nueva-seccion" id="seccion-id">
    <div class="container">
        <div class="section__header">
            <h2 class="section__title">Título de Sección</h2>
            <p class="section__subtitle">Subtítulo descriptivo</p>
        </div>
        
        <!-- Contenido aquí -->
    </div>
</section>
```

### CSS para Nueva Sección

```css
.nueva-seccion {
    padding: var(--spacing-2xl) var(--spacing-lg);
    background: var(--color-white);
}

.nueva-seccion__elemento {
    /* Estilos personalizados */
}
```

## 🎨 Cambiar Categorías de Reportes

### 1. Agregar Nueva Categoría

En `scripts.js`:

```javascript
// En reportesData
{
    categoria: 'contaminacion-agua',  // Nueva categoría
    // ...
}

// En getMarkerHTML()
const colors = {
    'contaminacion-agua': '#0277BD',  // Azul
    // ...
}

// En getMarkerEmoji()
const emojis = {
    'contaminacion-agua': '💧',
    // ...
}
```

En `index.html`, filtros del mapa:

```html
<button class="filter__btn" data-filter="contaminacion-agua">Agua</button>
```

En `styles.css`:

```css
.badge--contaminacion-agua {
    background: rgba(2, 119, 189, 0.15);
    color: #0277BD;
}

.event-card__badge.badge--contaminacion-agua {
    /* estilo específico */
}
```

## 📊 Agregar Nuevas Métricas

En `index.html`, sección "PANEL DE IMPACTO":

```html
<div class="metric-card">
    <div class="metric-card__icon">🌊</div>
    <div class="metric-card__number" data-count="1250">0</div>
    <div class="metric-card__label">Litros de Agua Conservada</div>
    <div class="metric-card__progress">
        <div class="progress-bar" style="width: 60%"></div>
    </div>
    <span class="metric-card__target">Meta: 5k litros</span>
</div>
```

## 🎪 Agregar Evento Ecológico

En `index.html`, sección "JORNADAS ECOLÓGICAS":

```html
<div class="event-card">
    <div class="event-card__image">
        <div class="event-card__badge badge badge--planting">Reforestación</div>
        <!-- SVG o imagen aquí -->
    </div>
    <div class="event-card__content">
        <h3 class="event-card__title">Nombre del Evento</h3>
        <div class="event-card__info">
            <div class="info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <!-- SVG del calendario -->
                </svg>
                <span>Fecha del evento</span>
            </div>
            <div class="info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <!-- SVG de ubicación -->
                </svg>
                <span>Ubicación</span>
            </div>
        </div>
        <div class="event-card__quota">Voluntarios / <strong>Total</strong></div>
        <button class="btn btn--primary btn--small">Unirme</button>
    </div>
</div>
```

## 🌐 Cambiar Logo y Branding

### Logo en Navbar

En `index.html`:

```html
<div class="navbar__logo">
    <div class="logo__icon">🌱</div>  <!-- Cambiar emoji o agregar imagen -->
    <span class="logo__text">EcoAlerta</span>  <!-- Cambiar nombre -->
</div>
```

Para usar imagen:

```html
<div class="navbar__logo">
    <img src="tu-logo.svg" alt="EcoAlerta" width="32" height="32">
    <span class="logo__text">Tu Logo</span>
</div>
```

Agregar CSS:

```css
.navbar__logo img {
    width: 32px;
    height: 32px;
}
```

## 📱 Cambiar Puntos de Quiebre (Breakpoints)

En `styles.css`:

```css
/* Tablet modificado */
@media (max-width: 1024px) {
    /* Estilos para tablets grandes */
}

/* Tablet pequeño */
@media (max-width: 768px) {
    /* Estilos actuales */
}

/* Móvil */
@media (max-width: 480px) {
    /* Estilos actuales */
}
```

## 🔊 Agregar Sonidos (Opcional)

En `scripts.js`:

```javascript
function playSound(soundId) {
    const audio = new Audio(`sounds/${soundId}.mp3`);
    audio.play();
}

// Usar en eventos
button.addEventListener('click', () => {
    playSound('click');
    // ... otra lógica
});
```

## 🌙 Completar Modo Oscuro

En `styles.css`, actualizar:

```css
@media (prefers-color-scheme: dark) {
    :root {
        --color-white: #1A1A1A;
        --color-gray-50: #262626;
        --color-gray-100: #333333;
        --color-gray-600: #B0BEC5;
        --color-gray-700: #CCCCCC;
        /* Agregar más variables según sea necesario */
    }
    
    /* Agregar estilos específicos del tema oscuro */
    .hero {
        background: linear-gradient(135deg, #1B5E20 0%, #0D3817 100%);
    }
    
    .navbar {
        background: #1A1A1A;
        border-bottom: 1px solid #333333;
    }
}
```

## 🚀 Integración con Servicios Externos

### Formulario con Envío

En `scripts.js`:

```javascript
formReporte.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    try {
        const response = await fetch('/api/reportes', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showNotification('¡Reporte enviado exitosamente!', 'success');
        }
    } catch (error) {
        showNotification('Error al enviar', 'error');
    }
});
```

### Cargar Datos Dinámicos del Mapa

```javascript
async function loadReports() {
    try {
        const response = await fetch('/api/reportes');
        const data = await response.json();
        reportesData = data;
        addMarkersToMap();
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

// Llamar en initMap()
loadReports();
```

## 🔍 SEO Básico

En `index.html`, mejorar `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Descripción clara y concisa...">
<meta name="keywords" content="ecosistemas, ODS15, reportes, voluntariado">
<meta name="author" content="Tu Organizacion">
<meta name="theme-color" content="#2E7D32">

<!-- Open Graph para redes sociales -->
<meta property="og:title" content="EcoAlerta">
<meta property="og:description" content="...">
<meta property="og:image" content="imagen-preview.jpg">
<meta property="og:url" content="https://ecoalerta.com">
```

## 📈 Analytics

En `scripts.js`, al final:

```javascript
// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_ID');

// Tracking custom
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn--primary')) {
        gtag('event', 'reporte_iniciado');
    }
});
```

---

**¡Customiza Eco-pulse según tus necesidades locales!** 🌍✨
