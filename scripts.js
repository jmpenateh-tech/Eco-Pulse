/* ========================================
   ECOALERTA - SCRIPTS
   ======================================== */

const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const body = document.body;

// ========================================
// NAVBAR Y NAVEGACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = $('#navToggle');
    const navMenu = $('#navMenu');
    const navbar = $('#navbar');
    
    // Toggle menu móvil
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    }
    
    // Cerrar menu al hacer click en un link
    $$('.navbar__link').forEach(link => {
        link.addEventListener('click', () => navMenu?.classList.remove('active'));
    });

    const themeToggleBtn = $('#themeToggle');
    const storedTheme = localStorage.getItem('siteTheme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const updateThemeButton = mode => {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('.theme-toggle__icon');
        const text = themeToggleBtn.querySelector('.theme-toggle__text');
        if (mode === 'dark') {
            icon.textContent = '☀️';
            text.textContent = 'Modo claro';
        } else {
            icon.textContent = '🌙';
            text.textContent = 'Modo oscuro';
        }
    };

    const setTheme = mode => {
        if (mode === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        updateThemeButton(mode);
        localStorage.setItem('siteTheme', mode);
        updateMapTileLayer();
    };

    if (themeToggleBtn) {
        const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        themeToggleBtn.addEventListener('click', () => {
            setTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark');
        });
    }
    
    // Cambiar estilo navbar al scroll
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.style.boxShadow = window.scrollY > 50 ? 'var(--shadow-md)' : 'var(--shadow-sm)';
        }
    });
});

// ========================================
// MODALES
// ========================================

const modalIdMap = {
    reportar: 'modalReportar',
    registro: 'modalRegistro'
};

const openModal = key => {
    const modal = $(`#${modalIdMap[key] || key}`);
    if (!modal) return;
    modal.classList.add('active');
    body.style.overflow = 'hidden';
};

const closeModal = id => {
    const modal = $(`#${id}`);
    if (!modal) return;
    modal.classList.remove('active');
    body.style.overflow = 'auto';
};

// Botones que abren modales
document.querySelectorAll('[data-modal]').forEach(button => {
    button.addEventListener('click', () => openModal(button.dataset.modal));
});

// Cerrar modal al hacer click fuera
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// ========================================
// FORMULARIO DE REPORTE
// ========================================

const formReporte = document.getElementById('formReporte');
if (formReporte) {
    formReporte.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            categoria: document.getElementById('categoria').value,
            descripcion: document.getElementById('descripcion').value,
            ubicacion: document.getElementById('ubicacion').value,
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value
        };

        const geocode = await geocodeAddress(formData.ubicacion);
        const lat = geocode?.lat ?? (8.7402 + (Math.random() - 0.5) * 0.05);
        const lng = geocode?.lng ?? (-75.7519 + (Math.random() - 0.5) * 0.05);

        if (!geocode) {
            showNotification('No se encontró la dirección exacta; se ubicó el reporte cerca de Montería.', 'warning');
        }
        
        // Agregar el nuevo reporte al mapa
        const nuevoReporte = {
            id: Date.now(), // ID único basado en timestamp
            lat,
            lng,
            categoria: formData.categoria,
            titulo: `Reporte de ${formData.categoria}`,
            descripcion: formData.descripcion,
            fecha: 'Hoy',
            reportes: 1,
            ubicacion: formData.ubicacion
        };

        // Agregar a los datos y actualizar mapa
        reportesData.push(nuevoReporte);
        addMarkerToMap(nuevoReporte);
        if (map) {
            map.setView([lat, lng], 15);
        }

        console.log('Nuevo reporte agregado:', nuevoReporte);

        // Mostrar mensaje de éxito
        showNotification('¡Reporte enviado correctamente! Se ha agregado al mapa y nuestro equipo lo verificará pronto.', 'success');

        // Limpiar formulario
        formReporte.reset();

        // Cerrar modal
        closeModal('modalReportar');
    });
}

// ========================================
// FORMULARIO DE REGISTRO VOLUNTARIO
// ========================================

const formRegistro = document.getElementById('formRegistro');
if (formRegistro) {
    formRegistro.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            nombre: document.getElementById('nombreVoluntario').value,
            email: document.getElementById('emailVoluntario').value,
            telefono: document.getElementById('telefono').value,
            actividades: Array.from(document.querySelectorAll('input[name="actividades"]:checked')).map(cb => cb.value),
            experiencia: document.getElementById('experiencia').value
        };

        // Validar que al menos una actividad esté seleccionada
        if (formData.actividades.length === 0) {
            showNotification('Por favor selecciona al menos una actividad de voluntariado.', 'error');
            return;
        }

        console.log('Nuevo voluntario registrado:', formData);

        // Mostrar mensaje de éxito
        showNotification('¡Registro exitoso! Te contactaremos pronto para coordinar tu participación en las actividades seleccionadas.', 'success');

        // Limpiar formulario
        formRegistro.reset();

        // Cerrar modal
        closeModal('modalRegistro');
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const backgroundColor = type === 'success'
        ? '#43A047'
        : type === 'warning'
            ? '#FFA726'
            : '#2E7D32';

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${backgroundColor};
        color: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 500;
        z-index: 3000;
        animation: slideInUp 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

async function geocodeAddress(address) {
    if (!address) return null;
    try {
        const normalizedAddress = address.trim().replace(/\s+/g, ' ').toLowerCase();

        const exactAddressMatch = /52\s*A.*6[-\s]*79|6[-\s]*79.*52\s*A/i;
        if (exactAddressMatch.test(normalizedAddress) && /castellana/i.test(normalizedAddress)) {
            return { lat: 8.7660555, lng: -75.8688002 };
        }

        const query = encodeURIComponent(`${normalizedAddress}, Montería, Córdoba, Colombia`);
        const viewbox = '-75.90,8.83,-75.70,8.65';
        const baseUrl = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&accept-language=es&limit=5&q=';

        const fetchResults = async (url) => {
            const response = await fetch(url);
            if (!response.ok) return [];
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        };

        let results = await fetchResults(`${baseUrl}${query}&viewbox=${viewbox}&bounded=1`);
        if (!results.length) {
            results = await fetchResults(`${baseUrl}${query}`);
        }
        if (!results.length) return null;

        const monteriaRegExp = /monter[ií]a/i;
        const candidate = results.find(place => {
            const display = place.display_name || '';
            const addressParts = place.address || {};
            return monteriaRegExp.test(display)
                || monteriaRegExp.test(addressParts.city || '')
                || monteriaRegExp.test(addressParts.town || '')
                || monteriaRegExp.test(addressParts.village || '')
                || monteriaRegExp.test(addressParts.county || '')
                || monteriaRegExp.test(addressParts.state || '');
        }) || results[0];

        const lat = parseFloat(candidate.lat);
        const lng = parseFloat(candidate.lon);

        const isNearMonteria = lat >= 8.62 && lat <= 8.85 && lng >= -75.92 && lng <= -75.68;
        if (!isNearMonteria) {
            console.warn('Geocoding fuera de Montería:', { address, lat, lng, display_name: candidate.display_name });
            return null;
        }

        return { lat, lng };
    } catch (error) {
        console.error('Error en geocodificación:', error);
        return null;
    }
}

// ========================================
// MAPA INTERACTIVO CON LEAFLET
// ========================================

let map;
let tileLayer;
let markers = [];
let currentFilter = 'all';
let reportesData = [];

// Cargar datos desde JSON y fusionar con datos hardcodeados
async function loadReportesData() {
    try {
        console.log('Cargando datos de reportes...');

        // Cargar datos desde JSON
        const response = await fetch('datos-ejemplo.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log(`Datos JSON cargados: ${jsonData.reportes.length} reportes`);

        // Convertir datos del JSON al formato esperado
        const jsonReportes = jsonData.reportes.map(reporte => ({
            id: reporte.id,
            lat: reporte.ubicacion.latitud,
            lng: reporte.ubicacion.longitud,
            categoria: reporte.categoria,
            titulo: reporte.titulo,
            descripcion: reporte.descripcion,
            fecha: formatDate(reporte.fecha_reporte),
            reportes: reporte.reportes_similares,
            ubicacion: reporte.ubicacion.direccion
        }));

        // Datos hardcodeados existentes (ajustados para Córdoba)
        const cordobaReportes = [
            {
                id: 1001,
                lat: 8.7402,
                lng: -75.7519,
                categoria: 'tala',
                titulo: 'Tala ilegal en Yarumales',
                descripcion: 'Se reporta tala ilegal en bosque seco tropical. Zona de importancia ecológica para Córdoba.',
                fecha: '5 días atrás',
                reportes: 12,
                ubicacion: 'Yarumales, Córdoba'
            },
            {
                id: 1002,
                lat: 8.6667,
                lng: -75.8833,
                categoria: 'basura',
                titulo: 'Contaminación Río Sinú',
                descripcion: 'Acumulación de residuos plásticos y domésticos en ribera del Río Sinú. Afecta fauna local.',
                fecha: '2 días atrás',
                reportes: 18,
                ubicacion: 'Montería, Córdoba'
            },
            {
                id: 1003,
                lat: 8.5497,
                lng: -75.7514,
                categoria: 'incendio',
                titulo: 'Incendio forestal en San Bernardo',
                descripcion: 'Incendio en zona boscosa de San Bernardo del Viento. Amenaza fauna y cobertura vegetal.',
                fecha: '1 día atrás',
                reportes: 24,
                ubicacion: 'San Bernardo del Viento, Córdoba'
            },
            {
                id: 1004,
                lat: 8.7604,
                lng: -75.6845,
                categoria: 'fauna',
                titulo: 'Avistamiento Cocodrilo Americano',
                descripcion: 'Especie amenazada avistada en zona de humedales. Requiere protección inmediata.',
                fecha: '3 días atrás',
                reportes: 14,
                ubicacion: 'Humedales San Juan, Córdoba'
            },
            {
                id: 1005,
                lat: 8.8333,
                lng: -76.0333,
                categoria: 'basura',
                titulo: 'Vertimiento ilegal Lorica',
                descripcion: 'Vertimiento de aguas residuales industriales sin tratamiento en el Río Sinú.',
                fecha: '1 semana atrás',
                reportes: 20,
                ubicacion: 'Lorica, Córdoba'
            },
            {
                id: 1006,
                lat: 8.4833,
                lng: -75.5500,
                categoria: 'tala',
                titulo: 'Deforestación Cenicero',
                descripcion: 'Bosque seco tropical siendo transformado. Pérdida de hábitat para especies endémicas.',
                fecha: '4 días atrás',
                reportes: 16,
                ubicacion: 'Cenicero, Córdoba'
            },
            // Más reportes de tala
            {
                id: 1007,
                lat: 8.6500,
                lng: -75.8500,
                categoria: 'tala',
                titulo: 'Tala en zona protegida',
                descripcion: 'Deforestación ilegal en área de reserva forestal. Árboles centenarios siendo talados.',
                fecha: '6 días atrás',
                reportes: 9,
                ubicacion: 'Reserva Forestal, Córdoba'
            },
            {
                id: 1008,
                lat: 8.7200,
                lng: -75.7800,
                categoria: 'tala',
                titulo: 'Expansión agrícola ilegal',
                descripcion: 'Conversión de bosque nativo a cultivos. Pérdida de biodiversidad significativa.',
                fecha: '3 días atrás',
                reportes: 15,
                ubicacion: 'Zona rural, Montería'
            },
            // Más reportes de basura
            {
                id: 1009,
                lat: 8.6800,
                lng: -75.8700,
                categoria: 'basura',
                titulo: 'Basura en río urbano',
                descripcion: 'Acumulación de residuos sólidos en cauce urbano del río. Contaminación visible.',
                fecha: '1 día atrás',
                reportes: 22,
                ubicacion: 'Río urbano, Montería'
            },
            {
                id: 1010,
                lat: 8.7500,
                lng: -75.7200,
                categoria: 'basura',
                titulo: 'Vertedero clandestino',
                descripcion: 'Basura acumulada en terreno baldío. Riesgo sanitario para comunidad cercana.',
                fecha: '4 días atrás',
                reportes: 11,
                ubicacion: 'Barrio periférico, Córdoba'
            },
            {
                id: 1011,
                lat: 8.8000,
                lng: -76.0000,
                categoria: 'basura',
                titulo: 'Plásticos en playa',
                descripcion: 'Gran cantidad de residuos plásticos en zona costera. Afecta ecosistema marino.',
                fecha: '2 días atrás',
                reportes: 19,
                ubicacion: 'Playa, Lorica'
            },
            // Más reportes de incendio
            {
                id: 1012,
                lat: 8.6000,
                lng: -75.7000,
                categoria: 'incendio',
                titulo: 'Incendio en pastizal',
                descripcion: 'Fuego en zona de pastizales. Riesgo de propagación a bosque cercano.',
                fecha: '5 días atrás',
                reportes: 8,
                ubicacion: 'Zona rural, Córdoba'
            },
            {
                id: 1013,
                lat: 8.5500,
                lng: -75.6500,
                categoria: 'incendio',
                titulo: 'Quema agrícola descontrolada',
                descripcion: 'Quema de rastrojos que se salió de control. Amenaza vegetación nativa.',
                fecha: '1 semana atrás',
                reportes: 13,
                ubicacion: 'Área agrícola, Córdoba'
            },
            // Más reportes de fauna
            {
                id: 1014,
                lat: 8.7800,
                lng: -75.6900,
                categoria: 'fauna',
                titulo: 'Tortuga marina en peligro',
                descripcion: 'Tortuga marina varada en zona urbana. Requiere rescate inmediato.',
                fecha: 'Hoy',
                reportes: 6,
                ubicacion: 'Costa, Córdoba'
            },
            {
                id: 1015,
                lat: 8.6200,
                lng: -75.8200,
                categoria: 'fauna',
                titulo: 'Aves migratorias',
                descripcion: 'Grupo numeroso de aves migratorias en humedal urbano. Hábitat temporal.',
                fecha: '2 días atrás',
                reportes: 12,
                ubicacion: 'Humedal urbano, Montería'
            },
            {
                id: 1016,
                lat: 8.5800,
                lng: -75.7300,
                categoria: 'fauna',
                titulo: 'Mamíferos en zona urbana',
                descripcion: 'Avistamiento de mamíferos silvestres en área urbana. Posible conflicto humano-fauna.',
                fecha: '3 días atrás',
                reportes: 7,
                ubicacion: 'Zona urbana, Córdoba'
            },
            // Reportes adicionales variados
            {
                id: 1017,
                lat: 8.7100,
                lng: -75.7600,
                categoria: 'tala',
                titulo: 'Tala selectiva de especies',
                descripcion: 'Extracción selectiva de árboles maderables valiosos. Impacto en ecosistema.',
                fecha: '1 semana atrás',
                reportes: 10,
                ubicacion: 'Bosque secundario, Córdoba'
            },
            {
                id: 1018,
                lat: 8.6900,
                lng: -75.8400,
                categoria: 'basura',
                titulo: 'Contaminación industrial',
                descripcion: 'Vertimiento de residuos industriales en cuerpo de agua. Coloración anormal del agua.',
                fecha: '4 días atrás',
                reportes: 16,
                ubicacion: 'Zona industrial, Montería'
            },
            {
                id: 1019,
                lat: 8.6300,
                lng: -75.7900,
                categoria: 'incendio',
                titulo: 'Fuego en manglar',
                descripcion: 'Incendio en zona de manglar. Ecosistema costero gravemente afectado.',
                fecha: '6 días atrás',
                reportes: 14,
                ubicacion: 'Manglar, Córdoba'
            },
            {
                id: 1020,
                lat: 8.6700,
                lng: -75.8100,
                categoria: 'fauna',
                titulo: 'Peces muertos en río',
                descripcion: 'Mortalidad masiva de peces en tramo urbano del río. Posible contaminación.',
                fecha: '1 día atrás',
                reportes: 21,
                ubicacion: 'Río urbano, Montería'
            }
        ];

        // Agregar algunos reportes recientes de ejemplo
        const reportesRecientes = [
            {
                id: 2001,
                lat: 8.7402,
                lng: -75.7519,
                categoria: 'basura',
                titulo: 'Basura acumulada en parque central',
                descripcion: 'Gran cantidad de residuos plásticos y orgánicos acumulados. Requiere limpieza inmediata.',
                fecha: 'Hoy',
                reportes: 5,
                ubicacion: 'Parque Simón Bolívar, Montería'
            },
            {
                id: 2002,
                lat: 8.6667,
                lng: -75.8833,
                categoria: 'fauna',
                titulo: 'Aves migratorias en peligro',
                descripcion: 'Grupo de aves migratorias avistadas en zona urbana. Posible contaminación afectando su hábitat.',
                fecha: 'Ayer',
                reportes: 3,
                ubicacion: 'Zona urbana, Montería'
            },
            {
                id: 2003,
                lat: 8.5497,
                lng: -75.7514,
                categoria: 'tala',
                titulo: 'Tala reciente en zona rural',
                descripcion: 'Se detectó tala de árboles nativos en las últimas 24 horas. Área de reforestación afectada.',
                fecha: '2 días atrás',
                reportes: 8,
                ubicacion: 'Zona rural, Córdoba'
            }
        ];

        // Fusionar todos los reportes
        reportesData = [...cordobaReportes, ...jsonReportes, ...reportesRecientes];
        console.log(`Total de reportes cargados: ${reportesData.length}`);
        console.log('Reportes Córdoba:', cordobaReportes.length);
        console.log('Reportes JSON:', jsonReportes.length);

    } catch (error) {
        console.error('Error cargando datos de reportes:', error);
        // Usar solo datos hardcodeados como fallback
        const cordobaReportes = [
            {
                id: 1001,
                lat: 8.7402,
                lng: -75.7519,
                categoria: 'tala',
                titulo: 'Tala ilegal en Yarumales',
                descripcion: 'Se reporta tala ilegal en bosque seco tropical. Zona de importancia ecológica para Córdoba.',
                fecha: '5 días atrás',
                reportes: 12,
                ubicacion: 'Yarumales, Córdoba'
            },
            {
                id: 1002,
                lat: 8.6667,
                lng: -75.8833,
                categoria: 'basura',
                titulo: 'Contaminación Río Sinú',
                descripcion: 'Acumulación de residuos plásticos y domésticos en ribera del Río Sinú. Afecta fauna local.',
                fecha: '2 días atrás',
                reportes: 18,
                ubicacion: 'Montería, Córdoba'
            },
            {
                id: 1003,
                lat: 8.5497,
                lng: -75.7514,
                categoria: 'incendio',
                titulo: 'Incendio forestal en San Bernardo',
                descripcion: 'Incendio en zona boscosa de San Bernardo del Viento. Amenaza fauna y cobertura vegetal.',
                fecha: '1 día atrás',
                reportes: 24,
                ubicacion: 'San Bernardo del Viento, Córdoba'
            },
            {
                id: 1004,
                lat: 8.7604,
                lng: -75.6845,
                categoria: 'fauna',
                titulo: 'Avistamiento Cocodrilo Americano',
                descripcion: 'Especie amenazada avistada en zona de humedales. Requiere protección inmediata.',
                fecha: '3 días atrás',
                reportes: 14,
                ubicacion: 'Humedales San Juan, Córdoba'
            },
            {
                id: 1005,
                lat: 8.8333,
                lng: -76.0333,
                categoria: 'basura',
                titulo: 'Vertimiento ilegal Lorica',
                descripcion: 'Vertimiento de aguas residuales industriales sin tratamiento en el Río Sinú.',
                fecha: '1 semana atrás',
                reportes: 20,
                ubicacion: 'Lorica, Córdoba'
            },
            {
                id: 1006,
                lat: 8.4833,
                lng: -75.5500,
                categoria: 'tala',
                titulo: 'Deforestación Cenicero',
                descripcion: 'Bosque seco tropical siendo transformado. Pérdida de hábitat para especies endémicas.',
                fecha: '4 días atrás',
                reportes: 16,
                ubicacion: 'Cenicero, Córdoba'
            },
            {
                id: 1007,
                lat: 8.6500,
                lng: -75.8500,
                categoria: 'tala',
                titulo: 'Tala en zona protegida',
                descripcion: 'Deforestación ilegal en área de reserva forestal. Árboles centenarios siendo talados.',
                fecha: '6 días atrás',
                reportes: 9,
                ubicacion: 'Reserva Forestal, Córdoba'
            },
            {
                id: 1008,
                lat: 8.7200,
                lng: -75.7800,
                categoria: 'tala',
                titulo: 'Expansión agrícola ilegal',
                descripcion: 'Conversión de bosque nativo a cultivos. Pérdida de biodiversidad significativa.',
                fecha: '3 días atrás',
                reportes: 15,
                ubicacion: 'Zona rural, Montería'
            },
            {
                id: 1009,
                lat: 8.6800,
                lng: -75.8700,
                categoria: 'basura',
                titulo: 'Basura en río urbano',
                descripcion: 'Acumulación de residuos sólidos en cauce urbano del río. Contaminación visible.',
                fecha: '1 día atrás',
                reportes: 22,
                ubicacion: 'Río urbano, Montería'
            },
            {
                id: 1010,
                lat: 8.7500,
                lng: -75.7200,
                categoria: 'basura',
                titulo: 'Vertedero clandestino',
                descripcion: 'Basura acumulada en terreno baldío. Riesgo sanitario para comunidad cercana.',
                fecha: '4 días atrás',
                reportes: 11,
                ubicacion: 'Barrio periférico, Córdoba'
            },
            {
                id: 1011,
                lat: 8.8000,
                lng: -76.0000,
                categoria: 'basura',
                titulo: 'Plásticos en playa',
                descripcion: 'Gran cantidad de residuos plásticos en zona costera. Afecta ecosistema marino.',
                fecha: '2 días atrás',
                reportes: 19,
                ubicacion: 'Playa, Lorica'
            },
            {
                id: 1012,
                lat: 8.6000,
                lng: -75.7000,
                categoria: 'incendio',
                titulo: 'Incendio en pastizal',
                descripcion: 'Fuego en zona de pastizales. Riesgo de propagación a bosque cercano.',
                fecha: '5 días atrás',
                reportes: 8,
                ubicacion: 'Zona rural, Córdoba'
            },
            {
                id: 1013,
                lat: 8.5500,
                lng: -75.6500,
                categoria: 'incendio',
                titulo: 'Quema agrícola descontrolada',
                descripcion: 'Quema de rastrojos que se salió de control. Amenaza vegetación nativa.',
                fecha: '1 semana atrás',
                reportes: 13,
                ubicacion: 'Área agrícola, Córdoba'
            },
            {
                id: 1014,
                lat: 8.7800,
                lng: -75.6900,
                categoria: 'fauna',
                titulo: 'Tortuga marina en peligro',
                descripcion: 'Tortuga marina varada en zona urbana. Requiere rescate inmediato.',
                fecha: 'Hoy',
                reportes: 6,
                ubicacion: 'Costa, Córdoba'
            },
            {
                id: 1015,
                lat: 8.6200,
                lng: -75.8200,
                categoria: 'fauna',
                titulo: 'Aves migratorias',
                descripcion: 'Grupo numeroso de aves migratorias en humedal urbano. Hábitat temporal.',
                fecha: '2 días atrás',
                reportes: 12,
                ubicacion: 'Humedal urbano, Montería'
            },
            {
                id: 1016,
                lat: 8.5800,
                lng: -75.7300,
                categoria: 'fauna',
                titulo: 'Mamíferos en zona urbana',
                descripcion: 'Avistamiento de mamíferos silvestres en área urbana. Posible conflicto humano-fauna.',
                fecha: '3 días atrás',
                reportes: 7,
                ubicacion: 'Zona urbana, Córdoba'
            },
            {
                id: 1017,
                lat: 8.7100,
                lng: -75.7600,
                categoria: 'tala',
                titulo: 'Tala selectiva de especies',
                descripcion: 'Extracción selectiva de árboles maderables valiosos. Impacto en ecosistema.',
                fecha: '1 semana atrás',
                reportes: 10,
                ubicacion: 'Bosque secundario, Córdoba'
            },
            {
                id: 1018,
                lat: 8.6900,
                lng: -75.8400,
                categoria: 'basura',
                titulo: 'Contaminación industrial',
                descripcion: 'Vertimiento de residuos industriales en cuerpo de agua. Coloración anormal del agua.',
                fecha: '4 días atrás',
                reportes: 16,
                ubicacion: 'Zona industrial, Montería'
            },
            {
                id: 1019,
                lat: 8.6300,
                lng: -75.7900,
                categoria: 'incendio',
                titulo: 'Fuego en manglar',
                descripcion: 'Incendio en zona de manglar. Ecosistema costero gravemente afectado.',
                fecha: '6 días atrás',
                reportes: 14,
                ubicacion: 'Manglar, Córdoba'
            },
            {
                id: 1020,
                lat: 8.6700,
                lng: -75.8100,
                categoria: 'fauna',
                titulo: 'Peces muertos en río',
                descripcion: 'Mortalidad masiva de peces en tramo urbano del río. Posible contaminación.',
                fecha: '1 día atrás',
                reportes: 21,
                ubicacion: 'Río urbano, Montería'
            }
        ];

        const reportesRecientes = [
            {
                id: 2001,
                lat: 8.7402,
                lng: -75.7519,
                categoria: 'basura',
                titulo: 'Basura acumulada en parque central',
                descripcion: 'Gran cantidad de residuos plásticos y orgánicos acumulados. Requiere limpieza inmediata.',
                fecha: 'Hoy',
                reportes: 5,
                ubicacion: 'Parque Simón Bolívar, Montería'
            },
            {
                id: 2002,
                lat: 8.6667,
                lng: -75.8833,
                categoria: 'fauna',
                titulo: 'Aves migratorias en peligro',
                descripcion: 'Grupo de aves migratorias avistadas en zona urbana. Posible contaminación afectando su hábitat.',
                fecha: 'Ayer',
                reportes: 3,
                ubicacion: 'Zona urbana, Montería'
            },
            {
                id: 2003,
                lat: 8.5497,
                lng: -75.7514,
                categoria: 'tala',
                titulo: 'Tala reciente en zona rural',
                descripcion: 'Se detectó tala de árboles nativos en las últimas 24 horas. Área de reforestación afectada.',
                fecha: '2 días atrás',
                reportes: 8,
                ubicacion: 'Zona rural, Córdoba'
            }
        ];

        reportesData = [...cordobaReportes, ...reportesRecientes];
        console.log(`Fallback: ${reportesData.length} reportes hardcodeados cargados`);
    }
}

// Función auxiliar para formatear fechas
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 día atrás';
    if (diffDays < 7) return `${diffDays} días atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''} atrás`;
    return date.toLocaleDateString('es-ES');
}

function getTileLayer() {
    return L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });
}

function updateMapTileLayer() {
    if (!map) return;
    if (tileLayer) {
        map.removeLayer(tileLayer);
    }
    tileLayer = getTileLayer();
    tileLayer.addTo(map);
}

function initMap() {
    // Crear mapa centrado inicialmente en Córdoba, Colombia
    map = L.map('map').setView([8.7402, -75.7519], 9);

    updateMapTileLayer();

    // Cargar datos y luego agregar marcadores
    loadReportesData().then(() => {
        addMarkersToMap();
        // Centrar el mapa en Córdoba independientemente de los marcadores
        map.setView([8.7402, -75.7519], 9);
        console.log(`Mapa inicializado con ${markers.length} marcadores`);
    }).catch(error => {
        console.error('Error inicializando mapa:', error);
    });

    // Event listeners para los filtros
    document.querySelectorAll('.filter__btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Actualizar botón activo
            document.querySelectorAll('.filter__btn').forEach(b => {
                b.classList.remove('filter__btn--active');
            });
            this.classList.add('filter__btn--active');

            currentFilter = this.getAttribute('data-filter');
            filterMarkers();
        });
    });
}

function addMarkerToMap(reporte, updateFilter = true) {
    const customIcon = L.divIcon({
        html: getMarkerHTML(reporte.categoria),
        iconSize: [40, 40],
        className: 'custom-marker'
    });

    const marker = L.marker([reporte.lat, reporte.lng], { icon: customIcon })
        .addTo(map)
        .on('click', function() {
            showReportInfo(reporte);
        });

    marker.data = reporte;
    markers.push(marker);

    if (updateFilter) {
        filterMarkers();
    }
}

function addMarkersToMap() {
    if (!map) return;

    // Limpiar marcadores anteriores para evitar duplicados o inconsistencias
    markers.forEach(marker => marker.remove());
    markers = [];

    reportesData.forEach(reporte => addMarkerToMap(reporte, false));
    filterMarkers();
}

function getMarkerHTML(categoria) {
    const colors = {
        'tala': '#D32F2F',
        'basura': '#9C27B0',
        'incendio': '#FF9800',
        'fauna': '#4CAF50'
    };
    
    const color = colors[categoria] || '#2E7D32';
    
    return `
        <div style="
            width: 100%;
            height: 100%;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            font-size: 20px;
        ">
            ${getMarkerEmoji(categoria)}
        </div>
    `;
}

function getMarkerEmoji(categoria) {
    const emojis = {
        'tala': '🪵',
        'basura': '🗑️',
        'incendio': '🔥',
        'fauna': '🦋'
    };
    return emojis[categoria] || '📍';
}

function showReportInfo(reporte) {
    const infoCard = document.getElementById('mapInfoCard');
    document.getElementById('mapInfoCategory').textContent = reporte.categoria.toUpperCase();
    document.getElementById('mapInfoCategory').className = `badge badge--${reporte.categoria}`;
    document.getElementById('mapInfoTitle').textContent = reporte.titulo;
    document.getElementById('mapInfoDescription').textContent = reporte.descripcion;
    document.getElementById('mapInfoDate').textContent = `📅 ${reporte.fecha}`;
    document.getElementById('mapInfoReports').textContent = `👥 ${reporte.reportes} reportes`;
    
    infoCard.style.display = 'block';
}

function filterMarkers() {
    markers.forEach(marker => {
        if (currentFilter === 'all' || marker.data.categoria === currentFilter) {
            marker.setOpacity(1);
        } else {
            marker.setOpacity(0.3);
        }
    });
}

// Inicializar mapa cuando DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        initMap();
    }
});

// ========================================
// ANIMACIÓN DE NÚMEROS (COUNTER)
// ========================================

function animateCounters() {
    const counters = document.querySelectorAll('.metric-card__number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const targetNumber = parseInt(entry.target.getAttribute('data-count'));
                animateNumber(entry.target, targetNumber);
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateNumber(element, targetNumber) {
    let currentNumber = 0;
    const increment = Math.ceil(targetNumber / 50);
    const duration = 1500;
    const steps = duration / 50;
    let currentStep = 0;
    
    const interval = setInterval(() => {
        currentNumber += increment;
        
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(interval);
        }
        
        currentStep++;
        element.textContent = currentNumber.toLocaleString('es-ES');
    }, duration / steps);
}

// Inicializar contadores cuando DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(animateCounters, 500);
});

// ========================================
// INTERACCIONES CON EVENTOS
// ========================================

document.querySelectorAll('.event-card .btn--primary.btn--small').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const eventCard = this.closest('.event-card');
        const eventTitle = eventCard?.querySelector('.event-card__title')?.textContent;
        if (eventTitle) {
            showNotification(`¡Te has unido a "${eventTitle}"! Pronto recibirás más detalles.`);
        }
    });
});

// ========================================
// EFECTOS Y MICROINTERACCIONES
// ========================================

// Agregar efecto ripple a botones
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            top: ${y}px;
            left: ${x}px;
            animation: ripple 0.6s ease-out;
        `;
        
        if (!this.style.position || this.style.position === 'static') {
            this.style.position = 'relative';
        }
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Agregar animación ripple al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// VALIDACIÓN DE FORMULARIOS
// ========================================

const inputs = document.querySelectorAll('.form__input');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

// ========================================
// OBSERVADOR DE INTERSECCIÓN PARA ANIMACIONES
// ======================================== 

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.step-card, .event-card, .metric-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ========================================
// SOPORTE PARA TEMAS CLAROS Y OSCUROS
// ======================================== 

function initThemeToggle() {
    // Detectar preferencia del sistema
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDark) {
        document.documentElement.style.colorScheme = 'dark';
    }
}

document.addEventListener('DOMContentLoaded', initThemeToggle);

// ========================================
// LAZY LOADING DE IMÁGENES
// ======================================== 

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

console.log('🌱 Eco-pulse loaded successfully - ODS 15: Vida de Ecosistemas Terrestres');