/**
 * =============================================================================
 * CERTIFICACIÓN API - JAVASCRIPT PRINCIPAL
 * Funcionalidades para el checklist de certificación
 * =============================================================================
 */

// =============================================================================
// CONSTANTES Y CONFIGURACIÓN
// =============================================================================
const ITEMS_PER_PAGE = 2;

// Esquemas de certificación disponibles
const CERTIFICATION_TYPES = {
  'pse-basico': {
    name: 'PSE Básico',
    description: 'Certificación estándar',
    items: [
      { id: 1, texto: "Autenticación OAuth 2.0/OpenID Connect implementada", esperado: "El sistema debe autenticar usando OAuth 2.0 o OpenID Connect, siguiendo los estándares de seguridad." },
      { id: 2, texto: "Uso de tokens JWT válidos", esperado: "Las peticiones deben incluir tokens JWT válidos y no expirados." },
      { id: 3, texto: "Comunicación solo por HTTPS", esperado: "Todas las comunicaciones con la API deben realizarse exclusivamente por HTTPS." },
      { id: 4, texto: "Gestión de expiración y refresh de tokens", esperado: "El sistema debe manejar la expiración de tokens y usar refresh tokens cuando corresponda." },
      { id: 5, texto: "Almacenamiento seguro de credenciales", esperado: "Las credenciales y secretos deben almacenarse de forma segura y nunca exponerse públicamente." }
    ]
  },
  'pse-avanzado': {
    name: 'PSE Avanzado',
    description: 'Certificación completa',
    items: [
      { id: 1, texto: "Autenticación OAuth 2.0/OpenID Connect implementada", esperado: "El sistema debe autenticar usando OAuth 2.0 o OpenID Connect, siguiendo los estándares de seguridad." },
      { id: 2, texto: "Uso de tokens JWT válidos", esperado: "Las peticiones deben incluir tokens JWT válidos y no expirados." },
      { id: 3, texto: "Comunicación solo por HTTPS", esperado: "Todas las comunicaciones con la API deben realizarse exclusivamente por HTTPS." },
      { id: 4, texto: "Gestión de expiración y refresh de tokens", esperado: "El sistema debe manejar la expiración de tokens y usar refresh tokens cuando corresponda." },
      { id: 5, texto: "Almacenamiento seguro de credenciales", esperado: "Las credenciales y secretos deben almacenarse de forma segura y nunca exponerse públicamente." },
      { id: 6, texto: "Solicita solo los permisos necesarios", esperado: "El sistema debe solicitar únicamente los permisos (scopes) estrictamente necesarios." },
      { id: 7, texto: "Respeta restricciones de acceso", esperado: "El sistema debe respetar las restricciones de acceso según los permisos otorgados." },
      { id: 8, texto: "Manejo de errores y límites de uso", esperado: "El sistema debe manejar correctamente errores y límites de uso (rate limiting)." }
    ]
  },
  'pse-empresarial': {
    name: 'PSE Empresarial',
    description: 'Certificación corporativa',
    items: [
      { id: 1, texto: "Autenticación OAuth 2.0/OpenID Connect implementada", esperado: "El sistema debe autenticar usando OAuth 2.0 o OpenID Connect, siguiendo los estándares de seguridad." },
      { id: 2, texto: "Uso de tokens JWT válidos", esperado: "Las peticiones deben incluir tokens JWT válidos y no expirados." },
      { id: 3, texto: "Comunicación solo por HTTPS", esperado: "Todas las comunicaciones con la API deben realizarse exclusivamente por HTTPS." },
      { id: 4, texto: "Gestión de expiración y refresh de tokens", esperado: "El sistema debe manejar la expiración de tokens y usar refresh tokens cuando corresponda." },
      { id: 5, texto: "Almacenamiento seguro de credenciales", esperado: "Las credenciales y secretos deben almacenarse de forma segura y nunca exponerse públicamente." },
      { id: 6, texto: "Solicita solo los permisos necesarios", esperado: "El sistema debe solicitar únicamente los permisos (scopes) estrictamente necesarios." },
      { id: 7, texto: "Respeta restricciones de acceso", esperado: "El sistema debe respetar las restricciones de acceso según los permisos otorgados." },
      { id: 8, texto: "Manejo de errores y límites de uso", esperado: "El sistema debe manejar correctamente errores y límites de uso (rate limiting)." },
      { id: 9, texto: "Pruebas de integración y seguridad realizadas", esperado: "Se deben realizar pruebas de integración y seguridad con la API." },
      { id: 10, texto: "Documentación revisada y comprendida", esperado: "El equipo debe haber revisado y comprendido la documentación de autenticación y autorización." },
      { id: 11, texto: "Implementación de auditoría y logging", esperado: "El sistema debe registrar todas las transacciones y eventos de seguridad relevantes." },
      { id: 12, texto: "Configuración de alta disponibilidad", esperado: "El sistema debe estar configurado para garantizar alta disponibilidad y recuperación ante desastres." }
    ]
  }
};

// Checklist por defecto (mantenido para compatibilidad)
let checklistItems = [
  { id: 1, texto: "Autenticación OAuth 2.0/OpenID Connect implementada", esperado: "El sistema debe autenticar usando OAuth 2.0 o OpenID Connect, siguiendo los estándares de seguridad." },
  { id: 2, texto: "Uso de tokens JWT válidos", esperado: "Las peticiones deben incluir tokens JWT válidos y no expirados." },
  { id: 3, texto: "Comunicación solo por HTTPS", esperado: "Todas las comunicaciones con la API deben realizarse exclusivamente por HTTPS." },
  { id: 4, texto: "Gestión de expiración y refresh de tokens", esperado: "El sistema debe manejar la expiración de tokens y usar refresh tokens cuando corresponda." },
  { id: 5, texto: "Almacenamiento seguro de credenciales", esperado: "Las credenciales y secretos deben almacenarse de forma segura y nunca exponerse públicamente." },
  { id: 6, texto: "Solicita solo los permisos necesarios", esperado: "El sistema debe solicitar únicamente los permisos (scopes) estrictamente necesarios." },
  { id: 7, texto: "Respeta restricciones de acceso", esperado: "El sistema debe respetar las restricciones de acceso según los permisos otorgados." },
  { id: 8, texto: "Manejo de errores y límites de uso", esperado: "El sistema debe manejar correctamente errores y límites de uso (rate limiting)." },
  { id: 9, texto: "Pruebas de integración y seguridad realizadas", esperado: "Se deben realizar pruebas de integración y seguridad con la API." },
  { id: 10, texto: "Documentación revisada y comprendida", esperado: "El equipo debe haber revisado y comprendido la documentación de autenticación y autorización." }
];

// =============================================================================
// VARIABLES GLOBALES
// =============================================================================
let currentPage = 1;
let camposEstado = {};
let numeroCliente = null;
let clienteSha = null; // Para GitHub API
let clienteActual = null; // Información completa del cliente actual
let tipoChecklistActual = checklistItems; // Items del checklist actual

// =============================================================================
// INICIALIZACIÓN
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
  console.clear();
  console.log('🎯 Portal de Certificación iniciando...');
  
  // Solo inicializamos lo necesario para la página de bienvenida
  initializeCleanButton();
  initializeColorPalettes();
  initializeWelcomePage();
  initializeNewUXFeatures();
  
  // Ocultar la barra lateral inicialmente
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.style.display = 'none';
  }
  
  // Mostrar página de bienvenida por defecto
  showWelcomePage();
});

function initializeWelcomePage() {
  const searchInput = document.getElementById('searchClientInput');
  const searchBtn = document.getElementById('searchBtn');
  const createBtn = document.getElementById('createBtn');
  const backBtn = document.getElementById('backToWelcomeBtn');
  const backBtn2 = document.getElementById('backToWelcomeBtn2');
  
  // Modal elements
  const modal = document.getElementById('createClientModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelCreateBtn = document.getElementById('cancelCreateBtn');
  const confirmCreateBtn = document.getElementById('confirmCreateBtn');
  const clientNitInput = document.getElementById('clientNit');
  const clientNameInput = document.getElementById('clientName');
  const certificationTypeSelect = document.getElementById('certificationType');
  
  // Validar solo números en el input
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        buscarCliente();
      }
    });
  }
  
  // Event listeners para botones principales
  if (searchBtn) searchBtn.onclick = buscarCliente;
  if (createBtn) createBtn.onclick = abrirModalCreacion;
  if (backBtn) backBtn.onclick = showWelcomePage;
  
  // Event listeners del modal
  if (closeModalBtn) closeModalBtn.onclick = cerrarModal;
  if (cancelCreateBtn) cancelCreateBtn.onclick = cerrarModal;
  if (confirmCreateBtn) confirmCreateBtn.onclick = confirmarCreacion;
  
  // Validar campos del modal para habilitar botón
  if (clientNameInput && certificationTypeSelect) {
    const validarCampos = () => {
      const nombreValido = clientNameInput.value.trim().length > 0;
      const tipoValido = certificationTypeSelect.value !== '';
      confirmCreateBtn.disabled = !nombreValido || !tipoValido;
    };
    
    clientNameInput.addEventListener('input', validarCampos);
    certificationTypeSelect.addEventListener('change', validarCampos);
  }
  
  // Cerrar modal con Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      cerrarModal();
    }
  });
}

function showWelcomePage() {
  document.getElementById('welcomePage').style.display = 'block';
  document.getElementById('checklistPage').style.display = 'none';
  
  // Ocultar la barra lateral
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.style.display = 'none';
  }
  
  // Agregar clase para ocultar elementos del checklist
  document.body.classList.add('welcome-active');
  
  // Limpiar campos y estados
  numeroCliente = null;
  clienteActual = null;
  camposEstado = {};
  
  // Limpiar input de búsqueda
  const searchInput = document.getElementById('searchClientInput');
  if (searchInput) searchInput.value = '';
  
  // Limpiar mensaje de búsqueda
  showSearchMessage('', 'info');
}

function buscarCliente() {
  const input = document.getElementById('searchClientInput');
  const clientNumber = input.value.trim();
  
  if (!clientNumber) {
    showSearchMessage('Por favor ingresa el NIT del comercio', 'error');
    return;
  }
  
  if (!/^\d{10}$/.test(clientNumber)) {
    showSearchMessage('El NIT debe tener exactamente 10 dígitos', 'error');
    return;
  }
  
  try {
    // Verificar si existe en localStorage
    const datosCliente = localStorage.getItem(`cliente_${clientNumber}`);
    const avancesGuardados = localStorage.getItem(`avances_${clientNumber}`);
    
    if (datosCliente) {
      // Cliente existe - cargar datos completos
      clienteActual = JSON.parse(datosCliente);
      numeroCliente = clientNumber;
      
      // Cargar checklist específico del tipo de certificación
      if (clienteActual.certificationType && CERTIFICATION_TYPES[clienteActual.certificationType]) {
        tipoChecklistActual = CERTIFICATION_TYPES[clienteActual.certificationType].items;
      } else {
        tipoChecklistActual = checklistItems; // Fallback al checklist por defecto
      }
      
      // Cargar avances si existen
      if (avancesGuardados) {
        camposEstado = JSON.parse(avancesGuardados);
      } else {
        camposEstado = {};
      }
      
      showSearchMessage(`✅ Cliente encontrado: ${clienteActual.name}`, 'success');
      
      // Mostrar el checklist después de un breve delay
      setTimeout(() => {
        document.body.classList.remove('welcome-active');
        document.getElementById('welcomePage').style.display = 'none';
        document.getElementById('checklistPage').style.display = 'block';
        
        // Inicializar y mostrar sidebar
        initializeSidebar();
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
          sidebar.style.display = 'block';
        }
        
        showChecklistPage(clientNumber);
        mostrarMensaje(`Datos cargados para ${clienteActual.name} (${CERTIFICATION_TYPES[clienteActual.certificationType]?.name || 'Certificación estándar'})`, 'success');
      }, 1000);
    } else {
      // Cliente no existe
      showSearchMessage(`❌ Comercio ${clientNumber} no encontrado. Use el botón "Crear" para crear uno nuevo.`, 'warning');
    }
  } catch (error) {
    console.error('Error al buscar cliente:', error);
    showSearchMessage('Error al cargar datos del cliente', 'error');
  }
}

function abrirModalCreacion() {
  const input = document.getElementById('searchClientInput');
  const clientNumber = input.value.trim();
  
  if (!clientNumber) {
    showSearchMessage('Por favor ingresa el NIT del comercio', 'error');
    return;
  }
  
  if (!/^\d{10}$/.test(clientNumber)) {
    showSearchMessage('El NIT debe tener exactamente 10 dígitos', 'error');
    return;
  }
  
  // Verificar que el cliente no exista ya
  const datosCliente = localStorage.getItem(`cliente_${clientNumber}`);
  if (datosCliente) {
    showSearchMessage(`⚠️ Cliente ${clientNumber} ya existe. Use "Buscar" para cargar progreso.`, 'warning');
    return;
  }
  
  // Abrir modal y llenar NIT
  const modal = document.getElementById('createClientModal');
  const clientNitInput = document.getElementById('clientNit');
  const clientNameInput = document.getElementById('clientName');
  const certificationTypeSelect = document.getElementById('certificationType');
  const confirmCreateBtn = document.getElementById('confirmCreateBtn');
  
  clientNitInput.value = clientNumber;
  clientNameInput.value = '';
  certificationTypeSelect.value = '';
  confirmCreateBtn.disabled = true;
  
  modal.style.display = 'flex';
  clientNameInput.focus();
}

function cerrarModal() {
  const modal = document.getElementById('createClientModal');
  modal.style.display = 'none';
}

function confirmarCreacion() {
  const clientNit = document.getElementById('clientNit').value;
  const clientName = document.getElementById('clientName').value.trim();
  const certificationType = document.getElementById('certificationType').value;
  
  if (!clientName || !certificationType) {
    return;
  }
  
  // Crear objeto del cliente
  clienteActual = {
    nit: clientNit,
    name: clientName,
    certificationType: certificationType,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
  
  // Guardar en localStorage
  localStorage.setItem(`cliente_${clientNit}`, JSON.stringify(clienteActual));
  
  // Configurar checklist según el tipo
  tipoChecklistActual = CERTIFICATION_TYPES[certificationType].items;
  
  // Inicializar variables
  numeroCliente = clientNit;
  camposEstado = {};
  
  // Cerrar modal y mostrar mensaje
  cerrarModal();
  showSearchMessage(`📋 Creando certificación ${CERTIFICATION_TYPES[certificationType].name}...`, 'success');
  
  setTimeout(() => {
    showChecklistPage(clientNit);
    mostrarMensaje(`Nueva certificación ${CERTIFICATION_TYPES[certificationType].name} creada para ${clientName}`, 'success');
  }, 1000);
}

function showChecklistPage(clientNumber) {
  const welcomePage = document.getElementById('welcomePage');
  const checklistPage = document.getElementById('checklistPage');
  const sidebar = document.getElementById('sidebar');
  
  // Ocultar página de bienvenida y mostrar checklist
  if (welcomePage) welcomePage.style.display = 'none';
  if (checklistPage) checklistPage.style.display = 'block';
  
  // Asegurar que la barra lateral esté visible
  if (sidebar) sidebar.style.display = 'block';
  // Quitar clase para mostrar sidebar y botones
  document.body.classList.remove('welcome-active');
  
  // Actualizar información del cliente en el header (legacy)
  const clientInfo = document.getElementById('currentClientNumber');
  const clientNameInfo = document.getElementById('currentClientName');
  const certificationTypeInfo = document.getElementById('currentCertificationType');
  
  if (clientInfo) clientInfo.textContent = clientNumber;
  
  if (clienteActual) {
    if (clientNameInfo) clientNameInfo.textContent = `(${clienteActual.name})`;
    if (certificationTypeInfo && clienteActual.certificationType) {
      const certType = CERTIFICATION_TYPES[clienteActual.certificationType];
      if (certType) {
        certificationTypeInfo.textContent = certType.name.toUpperCase();
        certificationTypeInfo.title = certType.description;
      }
    }
  } else {
    // Fallback para clientes antiguos sin información completa
    if (clientNameInfo) clientNameInfo.textContent = '';
    if (certificationTypeInfo) certificationTypeInfo.textContent = 'ESTÁNDAR';
  }
  
  // Actualizar nuevo diseño UX
  actualizarClienteCard();
  actualizarEstadisticasProgreso();
  
  // Renderizar checklist
  renderChecklist();
}

function showSearchMessage(message, type) {
  const messageDiv = document.getElementById('searchMessage');
  if (!messageDiv) return;
  
  messageDiv.textContent = message;
  messageDiv.className = 'message-area';
  
  if (type && type !== 'info') {
    messageDiv.classList.add(type);
  }
  
  // Auto-limpiar mensajes después de cierto tiempo
  if (message && type !== 'error') {
    setTimeout(() => {
      if (messageDiv.textContent === message) {
        messageDiv.textContent = '';
        messageDiv.className = 'message-area';
      }
    }, 5000);
  }
}

// =============================================================================
// RENDERIZADO DEL CHECKLIST
// =============================================================================
function renderChecklist() {
  const container = document.getElementById('checklist');
  container.innerHTML = '';
  
  // Usar el checklist actual según el tipo de certificación
  const itemsActuales = tipoChecklistActual || checklistItems;
  
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, itemsActuales.length);
  
  itemsActuales.slice(startIdx, endIdx).forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'checklist-item';
    div.setAttribute('id', `item_${item.id}`);
    div.innerHTML = createChecklistItemHTML(item, startIdx + idx + 1);
    container.appendChild(div);
  });
  
  cargarCambios();
  renderSidebar();
  renderPagination();
  inicializarEvidenciasEditables();
  actualizarClasesVisuales(); // Nueva función para estados visuales
}

function createChecklistItemHTML(item, numero) {
  return `
    <label>
      <span class="numero-punto">${numero}.</span>
      <span id="alerta_${item.id}" class="punto-faltante" style="display:none;" title="Falta completar este punto">&#9888;</span>
      ${item.texto}
    </label>
    <div class="campo-espera"><strong>¿Qué se Espera?</strong><br>${item.esperado}</div>
    <div contenteditable="true" class="evidencias-editable" id="evidencias_${item.id}" name="observaciones_${item.id}" data-id="${item.id}" spellcheck="true" aria-label="Evidencias (puede pegar imágenes y texto)" style="min-height: 100px;"></div>
    <div style="display:flex;align-items:center;gap:18px;margin-top:8px;">
      <select name="aprobado_${item.id}" required onchange="guardarEstadoCampo(${item.id})" style="margin-right:18px;">
        <option value="">Selecciona...</option>
        <option value="Aprobado">Aprobado</option>
        <option value="No aprobado">No aprobado</option>
        <option value="No aplica">No aplica</option>
      </select>
      <span style="margin-right: 10px;"></span>
      <div class="toolbar-evidencias" data-target="evidencias_${item.id}">
        <button type="button" onclick="formatoEvidencia('bold', 'evidencias_${item.id}')" title="Negrita" class="btn-bold">B</button>
        <button type="button" onclick="formatoEvidencia('italic', 'evidencias_${item.id}')" title="Cursiva" class="btn-italic">I</button>
        <button type="button" onclick="formatoEvidencia('underline', 'evidencias_${item.id}')" title="Subrayado" class="btn-underline">U</button>
        <button type="button" onclick="formatoEvidencia('justifyLeft', 'evidencias_${item.id}')" title="Alinear a la izquierda" class="btn-align">⚌</button>
        <button type="button" onclick="formatoEvidencia('justifyCenter', 'evidencias_${item.id}')" title="Centrar" class="btn-align">⚍</button>
        <button type="button" onclick="formatoEvidencia('justifyRight', 'evidencias_${item.id}')" title="Alinear a la derecha" class="btn-align">⚎</button>
        <button type="button" onclick="formatoEvidencia('insertOrderedList', 'evidencias_${item.id}')" title="Lista numerada" class="btn-list">1. ⎯</button>
        <button type="button" onclick="formatoEvidencia('insertUnorderedList', 'evidencias_${item.id}')" title="Lista con viñetas" class="btn-list">• ⎯</button>
        <div class="color-selector" style="position: relative;">
          <button type="button" onclick="event.stopPropagation(); toggleColorPalette('palette_${item.id}')" title="Color de texto" class="color-btn">🅐</button>
          <div id="palette_${item.id}" class="color-palette">
            <div class="color-option" style="background: #000000;" onclick="aplicarColor('#000000', 'evidencias_${item.id}')" title="Negro"></div>
            <div class="color-option" style="background: #ff0000;" onclick="aplicarColor('#ff0000', 'evidencias_${item.id}')" title="Rojo"></div>
            <div class="color-option" style="background: #00aa00;" onclick="aplicarColor('#00aa00', 'evidencias_${item.id}')" title="Verde"></div>
            <div class="color-option" style="background: #0000ff;" onclick="aplicarColor('#0000ff', 'evidencias_${item.id}')" title="Azul"></div>
            <div class="color-option" style="background: #ff6600;" onclick="aplicarColor('#ff6600', 'evidencias_${item.id}')" title="Naranja"></div>
            <div class="color-option" style="background: #9900cc;" onclick="aplicarColor('#9900cc', 'evidencias_${item.id}')" title="Morado"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSidebar() {
  const sidebarMenu = document.getElementById('sidebarMenu');
  if (!sidebarMenu) {
    console.log('❌ sidebarMenu no encontrado');
    return;
  }
  
  // Usar el checklist actual según el tipo de certificación
  const itemsActuales = tipoChecklistActual || checklistItems;
  console.log('📊 Renderizando sidebar con', itemsActuales.length, 'items');
  
  // Variables globales para controlar el estado
  if (typeof window.sidebarMostrandoFaltantes === 'undefined') {
    window.sidebarMostrandoFaltantes = false;
  }
  
  // Calcular cuántos puntos caben visualmente
  const puntosVisibles = calcularPuntosVisibles();
  let puntosAMostrar;
  let textoFlecha;
  let funcionFlecha;
  
  if (!window.sidebarMostrandoFaltantes) {
    // Mostrar los primeros puntos que caben
    puntosAMostrar = itemsActuales.slice(0, puntosVisibles);
    
    // Si hay más puntos, preparar para mostrar los faltantes
    const puntosRestantes = itemsActuales.length - puntosVisibles;
    if (puntosRestantes > 0) {
      textoFlecha = `Ver ${puntosRestantes} puntos más`;
      funcionFlecha = 'mostrarPuntosFaltantes()';
    }
  } else {
    // Mostrar solo los puntos faltantes
    puntosAMostrar = itemsActuales.slice(puntosVisibles);
    
    textoFlecha = `Ver primeros ${puntosVisibles} puntos`;
    funcionFlecha = 'mostrarPrimerosPuntos()';
  }
  
  // Construir HTML de forma segura
  let htmlContent = '';
  
  // Renderizar los puntos
  for (let i = 0; i < puntosAMostrar.length; i++) {
    const item = puntosAMostrar[i];
    // Calcular el índice real según qué puntos estamos mostrando
    const idx = window.sidebarMostrandoFaltantes ? puntosVisibles + i : i;
    
    // Determinar estado del item
    const aprobacionState = camposEstado[`aprobado_${item.id}`];
    const evidencias = camposEstado[`evidencias_${item.id}`] || camposEstado[`observaciones_${item.id}`];
    const tieneEvidencias = evidencias && evidencias.trim() !== '';
    
    let statusClass = '';
    
    if (aprobacionState && tieneEvidencias) {
      if (aprobacionState === 'Aprobado') {
        statusClass = 'completo';
      } else if (aprobacionState === 'No aprobado') {
        statusClass = 'incompleto';
      } else if (aprobacionState === 'No aplica') {
        statusClass = 'no-aplica';
      }
    }
    
    // Determinar si está en la página actual
    const pageNumber = Math.floor(idx / ITEMS_PER_PAGE) + 1;
    const isActive = currentPage === pageNumber;
    
    htmlContent += `
      <button class="nav-punto ${isActive ? 'active' : ''} ${statusClass}" 
              onclick="scrollToItem(${idx})" 
              title="Ir al punto ${idx + 1}: ${item.texto}">
        <span class="nav-punto-texto">${idx + 1}. ${item.texto}</span>
      </button>
    `;
  }
  
  // Agregar flecha si hay puntos para alternar
  if (itemsActuales.length > puntosVisibles) {
    const iconoFlecha = window.sidebarMostrandoFaltantes ? '▲' : '▼';
    const claseFlecha = window.sidebarMostrandoFaltantes ? 'arrow-up' : 'arrow-down';
    
    htmlContent += `
      <button class="nav-punto-arrow" onclick="${funcionFlecha}" title="Alternar vista de puntos">
        <div class="arrow-container">
          <div class="arrow-icon ${claseFlecha}">${iconoFlecha}</div>
          <div class="arrow-text">${textoFlecha}</div>
        </div>
      </button>
    `;
  }
  
  // Asignar todo el HTML de una sola vez
  sidebarMenu.innerHTML = htmlContent;
  
  console.log('🎯 Sidebar renderizado - Mostrando faltantes:', window.sidebarMostrandoFaltantes);
}

function calcularPuntosVisibles() {
  const sidebarMenu = document.getElementById('sidebarMenu');
  const sidebarContent = document.getElementById('sidebarContent');
  
  if (!sidebarMenu || !sidebarContent) {
    console.log('📏 Usando valor por defecto: 6 puntos');
    return 6; // Valor por defecto
  }
  
  // Obtener las alturas reales
  const sidebarContentHeight = sidebarContent.clientHeight;
  const sidebarHeader = document.querySelector('.sidebar-header');
  const headerHeight = sidebarHeader ? sidebarHeader.offsetHeight : 80;
  
  // Altura disponible para el menú
  const alturaDisponible = sidebarContentHeight - headerHeight - 20; // 20px margen
  
  // Altura estimada por punto basada en CSS real
  const alturaPorPunto = 65; // padding: 12px + texto + margin: 8px ≈ 65px
  
  // Altura reservada para la flecha
  const alturaFlecha = 80;
  
  // Calcular cuántos puntos caben sin la flecha
  const alturaParaPuntos = alturaDisponible - alturaFlecha;
  const puntosQueCaben = Math.floor(alturaParaPuntos / alturaPorPunto);
  
  // Establecer límites razonables: mínimo 3, máximo 15
  const puntosVisibles = Math.max(3, Math.min(puntosQueCaben, 15));
  
  console.log('📏 Cálculo adaptativo:', {
    alturaDisponible,
    alturaPorPunto,
    puntosQueCaben,
    puntosVisibles,
    headerHeight
  });
  
  return puntosVisibles;
}

function renderPagination() {
  // Usar el checklist actual según el tipo de certificación
  const itemsActuales = tipoChecklistActual || checklistItems;
  const totalPages = Math.ceil(itemsActuales.length / ITEMS_PER_PAGE);
  const pagDiv = document.getElementById('pagination');
  
  // Construir HTML de forma segura
  let htmlContent = '';
  
  htmlContent += `<button onclick="prevPage()" ${currentPage === 1 ? 'disabled' : ''}>&lt; Anterior</button>`;
  
  for (let i = 1; i <= totalPages; i++) {
    htmlContent += `<button onclick="goToPage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
  }
  
  htmlContent += `<button onclick="nextPage()" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente &gt;</button>`;
  
  // Asignar todo el HTML de una sola vez
  pagDiv.innerHTML = htmlContent;
}

function goToPage(page) {
  guardarCamposPaginaActual();
  currentPage = page;
  renderChecklist();
}

function prevPage() {
  guardarCamposPaginaActual();
  if (currentPage > 1) {
    currentPage--;
    renderChecklist();
  }
}

function nextPage() {
  guardarCamposPaginaActual();
  // Usar el checklist actual según el tipo de certificación
  const itemsActuales = tipoChecklistActual || checklistItems;
  const totalPages = Math.ceil(itemsActuales.length / ITEMS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    renderChecklist();
  }
}

// =============================================================================
// MANEJO DE ESTADO
// =============================================================================
function guardarCamposPaginaActual() {
  // Usar el checklist actual según el tipo de certificación
  const itemsActuales = tipoChecklistActual || checklistItems;
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, itemsActuales.length);
  
  itemsActuales.slice(startIdx, endIdx).forEach(item => {
    guardarEstadoCampo(item.id);
  });
}

function guardarCambios() {
  guardarCamposPaginaActual();
  guardarEnStorage();
  
  // Actualizar fecha de modificación del cliente
  if (clienteActual && numeroCliente) {
    clienteActual.lastModified = new Date().toISOString();
    localStorage.setItem(`cliente_${numeroCliente}`, JSON.stringify(clienteActual));
  }
}

function cargarCambios() {
  // Usar el checklist actual según el tipo de certificación
  const itemsActuales = tipoChecklistActual || checklistItems;
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, itemsActuales.length);
  
  itemsActuales.slice(startIdx, endIdx).forEach(item => {
    if (camposEstado[`aprobado_${item.id}`]) {
      const selectElement = document.querySelector(`[name="aprobado_${item.id}"]`);
      if (selectElement) {
        selectElement.value = camposEstado[`aprobado_${item.id}`];
      }
    }
    
    if (camposEstado[`evidencias_${item.id}`]) {
      const obsDiv = document.querySelector(`.evidencias-editable[name="observaciones_${item.id}"]`);
      if (obsDiv) {
        // Limpiar el contenido antes de asignarlo
        const contenidoLimpio = limpiarContenidoHTML(camposEstado[`evidencias_${item.id}`]);
        obsDiv.innerHTML = contenidoLimpio;
      }
    }
  });
}

// Función para limpiar contenido HTML de caracteres residuales
function limpiarContenidoHTML(contenido) {
  if (!contenido || typeof contenido !== 'string') {
    return '';
  }
  
  // Eliminar caracteres de control y espacios extraños
  let contenidoLimpio = contenido
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Caracteres de control
    .replace(/\u00A0/g, ' ') // Espacios no separables
    .replace(/\s+/g, ' ') // Múltiples espacios
    .trim();
  
  // Si el contenido está vacío después de la limpieza, devolver cadena vacía
  if (contenidoLimpio === '' || contenidoLimpio === '<br>' || contenidoLimpio === '<div><br></div>') {
    return '';
  }
  
  return contenidoLimpio;
}

function guardarEstadoCampo(itemId) {
  const select = document.querySelector(`[name="aprobado_${itemId}"]`);
  const evidencias = document.querySelector(`.evidencias-editable[data-id="${itemId}"]`);
  const checklistItem = document.getElementById(`item_${itemId}`);
  
  if (select) camposEstado[`aprobado_${itemId}`] = select.value;
  if (evidencias) {
    // Limpiar el contenido antes de guardarlo
    const contenidoLimpio = limpiarContenidoHTML(evidencias.innerHTML);
    camposEstado[`evidencias_${itemId}`] = contenidoLimpio;
  }
  
  // Actualizar clases visuales del elemento
  if (checklistItem) {
    // Limpiar clases anteriores
    checklistItem.classList.remove('completo', 'incompleto', 'no-aplica');
    
    const tieneEvidencias = evidencias && limpiarContenidoHTML(evidencias.innerHTML).trim() !== '';
    const estado = select ? select.value : '';
    
    if (estado && tieneEvidencias) {
      if (estado === 'Aprobado') {
        checklistItem.classList.add('completo');
      } else if (estado === 'No aprobado') {
        checklistItem.classList.add('incompleto');
      } else if (estado === 'No aplica') {
        checklistItem.classList.add('no-aplica');
      }
    }
  }
  
  // Actualizar estadísticas y sidebar en tiempo real
  actualizarEstadisticasProgreso();
  renderSidebar();
  
  debouncedSave();
}

let saveTimeout;
/**
 * Actualiza las clases visuales de todos los elementos de validación
 */
function actualizarClasesVisuales() {
  const itemsActuales = tipoChecklistActual || checklistItems;
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, itemsActuales.length);
  
  itemsActuales.slice(startIdx, endIdx).forEach((item) => {
    const checklistItem = document.getElementById(`item_${item.id}`);
    const evidencias = document.querySelector(`.evidencias-editable[data-id="${item.id}"]`);
    const select = document.querySelector(`[name="aprobado_${item.id}"]`);
    
    if (checklistItem) {
      // Limpiar clases anteriores
      checklistItem.classList.remove('completo', 'incompleto', 'no-aplica');
      
      const tieneEvidencias = evidencias && evidencias.innerHTML.trim() !== '';
      const estado = camposEstado[`aprobado_${item.id}`] || '';
      
      if (estado && tieneEvidencias) {
        if (estado === 'Aprobado') {
          checklistItem.classList.add('completo');
        } else if (estado === 'No aprobado') {
          checklistItem.classList.add('incompleto');
        } else if (estado === 'No aplica') {
          checklistItem.classList.add('no-aplica');
        }
      }
    }
  });
}

function debouncedSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    guardarEnStorage();
    mostrarIndicadorAutoGuardadoDiscreto();
  }, 300000); // 5 minutos = 300000ms
}

function guardarEnStorage() {
  if (numeroCliente) {
    localStorage.setItem(`avances_${numeroCliente}`, JSON.stringify(camposEstado));
    console.log('✅ Avances guardados automáticamente');
  }
}

function mostrarMensaje(texto, tipo = 'info') {
  const msgDiv = document.getElementById('formMsg');
  if (msgDiv) {
    msgDiv.textContent = texto;
    msgDiv.className = tipo;
    setTimeout(() => {
      msgDiv.textContent = '';
      msgDiv.className = '';
    }, 3000);
  }
}

// =============================================================================
// FUNCIONES ADICIONALES
// =============================================================================
function initializeSidebar() {
  // Implementación del nuevo sidebar marino moderno
  const sidebarToggle = document.getElementById('sidebarMuesca');
  const sidebarFab = document.getElementById('sidebarFab');
  const cleanFab = document.getElementById('cleanFab');
  const sidebar = document.getElementById('sidebar');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      
      // Mostrar/ocultar FAB según estado del sidebar
      if (sidebar.classList.contains('collapsed')) {
        sidebarFab.style.display = 'flex';
      } else {
        sidebarFab.style.display = 'none';
      }
    });
  }
  
  if (sidebarFab && sidebar) {
    sidebarFab.addEventListener('click', function() {
      sidebar.classList.remove('collapsed');
      sidebarFab.style.display = 'none';
    });
  }
  
  // Mostrar el botón de limpiar evidencias cuando estemos en la página de certificación
  function toggleCleanFab() {
    const checklistPage = document.getElementById('checklistPage');
    if (cleanFab) {
      if (checklistPage && checklistPage.style.display !== 'none') {
        cleanFab.style.display = 'flex';
      } else {
        cleanFab.style.display = 'none';
      }
    }
  }
  
  // Observar cambios en la página actual
  const observer = new MutationObserver(toggleCleanFab);
  observer.observe(document.body, { 
    attributes: true, 
    childList: true, 
    subtree: true 
  });
  
  // Verificar estado inicial
  toggleCleanFab();
}

function initializeCleanButton() {
  // Implementación básica del botón de limpiar
  const cleanBtn = document.getElementById('btnLimpiarEvidenciasDiscreto');
  if (cleanBtn) {
    cleanBtn.addEventListener('click', function() {
      if (confirm('¿Desea limpiar todas las evidencias?')) {
        // Limpiar evidencias
        const evidencias = document.querySelectorAll('.evidencias-editable');
        evidencias.forEach(div => {
          div.innerHTML = '';
        });
      }
    });
  }
  
  // Conectar botón volver del panel inferior
  const backBtn2 = document.getElementById('backToWelcomeBtn2');
  if (backBtn2) {
    backBtn2.addEventListener('click', function() {
      showWelcomePage();
    });
  }
  
  // Conectar botón modo compacto
  const compactBtn = document.getElementById('sidebarCompact');
  if (compactBtn) {
    compactBtn.addEventListener('click', function() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('compact');
      
      // Cambiar el icono del botón
      const icon = compactBtn.querySelector('svg path');
      if (sidebar.classList.contains('compact')) {
        icon.setAttribute('d', 'M3,4H7V8H3V4M9,5V7H21V5H9M3,10H7V14H3V10M9,11V13H21V11H9M3,16H7V20H3V16M9,17V19H21V17H9');
        compactBtn.setAttribute('title', 'Modo normal');
      } else {
        icon.setAttribute('d', 'M3,3H21V5H3V3M3,7H21V9H3V7M3,11H21V13H3V11M3,15H21V17H3V15M3,19H21V21H3V19Z');
        compactBtn.setAttribute('title', 'Modo compacto');
      }
    });
  }
}

function initializeColorPalettes() {
  // Cerrar paletas al hacer clic fuera de ellas
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.color-selector')) {
      document.querySelectorAll('.color-palette').forEach(palette => {
        palette.style.display = 'none';
      });
    }
  });
  
  // Evitar que los clics en la paleta cierren el menú
  document.querySelectorAll('.color-palette').forEach(palette => {
    palette.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
}

function inicializarEvidenciasEditables() {
  const editables = document.querySelectorAll('.evidencias-editable');
  editables.forEach(editable => {
    const itemId = editable.getAttribute('data-id');
    
    // Configurar el elemento para edición enriquecida
    editable.contentEditable = 'true';
    editable.designMode = 'on';
    
    // Habilitar formato CSS al enfocar
    editable.addEventListener('focus', () => {
      document.execCommand('defaultParagraphSeparator', false, 'p');
      document.execCommand('styleWithCSS', false, true);
      
      // Asegurar que el cursor está dentro del elemento
      if (window.getSelection().toString().length === 0) {
        const range = document.createRange();
        range.selectNodeContents(editable);
        range.collapse(true);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
    
    editable.addEventListener('input', function() {
      guardarEstadoCampo(itemId);
    });
    
    // Manejar el comportamiento de escritura cuando hay imágenes seleccionadas
    editable.addEventListener('keydown', function(e) {
      // Solo procesar teclas de caracteres imprimibles
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const selection = window.getSelection();
        
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer;
          
          // Verificar si hay una imagen seleccionada o si el cursor está dentro de una imagen
          let imagenContainer = null;
          
          if (container.nodeType === 3) { // Text node
            imagenContainer = container.parentElement?.closest('.imagen-evidencia-container');
          } else if (container.nodeType === 1) { // Element node
            imagenContainer = container.closest?.('.imagen-evidencia-container');
          }
          
          // Si el cursor está dentro o junto a una imagen
          if (imagenContainer) {
            e.preventDefault();
            
            // Crear un nuevo nodo de texto con el carácter escrito
            const textNode = document.createTextNode(e.key);
            
            // Insertar el texto después de la imagen
            const spaceNode = document.createTextNode(' '); // Agregar un espacio para mejor formato
            imagenContainer.parentNode.insertBefore(spaceNode, imagenContainer.nextSibling);
            imagenContainer.parentNode.insertBefore(textNode, spaceNode.nextSibling);
            
            // Mover el cursor después del texto insertado
            const newRange = document.createRange();
            newRange.setStartAfter(textNode);
            newRange.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(newRange);
            
            // Disparar evento input para guardar cambios
            editable.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      }
    });
    
    // Manejar el pegado para asegurar posicionamiento correcto
    editable.addEventListener('paste', function(e) {
      // Pequeño delay para procesar después del pegado
      setTimeout(() => {
        // Asegurar que las imágenes pegadas tengan el comportamiento correcto
        const imagenes = editable.querySelectorAll('img:not(.imagen-evidencia)');
        imagenes.forEach(img => {
          // Crear contenedor para la imagen si no existe
          if (!img.closest('.imagen-evidencia-container')) {
            const container = document.createElement('div');
            container.className = 'imagen-evidencia-container';
            img.className = 'imagen-evidencia';
            
            // Insertar un espacio antes y después para mejor formato
            const spaceBeforeNode = document.createTextNode(' ');
            const spaceAfterNode = document.createTextNode(' ');
            
            img.parentNode.insertBefore(spaceBeforeNode, img);
            img.parentNode.insertBefore(container, img);
            container.appendChild(img);
            img.parentNode.insertBefore(spaceAfterNode, container.nextSibling);
            
            // Inicializar redimensionamiento para la nueva imagen
            inicializarImagenEvidencia(container);
          }
        });
        
        // Guardar cambios
        guardarEstadoCampo(itemId);
      }, 100);
    });
  });
}

// Función de exportación PDF - usa la implementación de pdf-export.js
// La función exportarPDF() real está definida en pdf-export.js

// =============================================================================
// FUNCIONES PARA EL NUEVO DISEÑO UX
// =============================================================================

/**
 * Limpia todas las evidencias del checklist actual
 */
function limpiarEvidencias() {
  // Mostrar confirmación con diseño mejorado
  const confirmacion = confirm('¿Está seguro de que desea limpiar todas las evidencias?\n\nEsta acción no se puede deshacer.');
  
  if (!confirmacion) {
    return;
  }
  
  try {
    // Limpiar evidencias en la interfaz actual (si está visible)
    const evidenciasEditables = document.querySelectorAll('.evidencias-editable');
    evidenciasEditables.forEach(div => {
      div.innerHTML = '';
    });
    
    // Limpiar del estado global
    const itemsActuales = tipoChecklistActual || checklistItems;
    itemsActuales.forEach(item => {
      delete camposEstado[`evidencias_${item.id}`];
      delete camposEstado[`observaciones_${item.id}`];
    });
    
    // Guardar cambios en localStorage
    if (numeroCliente) {
      localStorage.setItem(`avances_${numeroCliente}`, JSON.stringify(camposEstado));
    }
    
    // Actualizar estadísticas de progreso
    actualizarEstadisticasProgreso();
    
    // Mostrar mensaje de confirmación
    mostrarMensaje('✅ Todas las evidencias han sido limpiadas', 'success');
    
    console.log('🧹 Evidencias limpiadas exitosamente');
    
  } catch (error) {
    console.error('Error al limpiar evidencias:', error);
    mostrarMensaje('❌ Error al limpiar evidencias', 'error');
  }
}

/**
 * Actualiza las estadísticas de progreso en el panel
 */
function actualizarEstadisticasProgreso() {
  try {
    const itemsActuales = tipoChecklistActual || checklistItems;
    const totalItems = itemsActuales.length;
    
    // Contar items completados
    let completados = 0;
    let aprobados = 0;
    let rechazados = 0;
    let pendientes = 0;
    
    itemsActuales.forEach(item => {
      const estadoAprobacion = camposEstado[`aprobado_${item.id}`];
      const tieneEvidencias = camposEstado[`evidencias_${item.id}`] || camposEstado[`observaciones_${item.id}`];
      
      if (estadoAprobacion && tieneEvidencias) {
        completados++;
        if (estadoAprobacion === 'si') {
          aprobados++;
        } else if (estadoAprobacion === 'no') {
          rechazados++;
        }
      } else {
        pendientes++;
      }
    });
    
    // Actualizar elementos del DOM con nuevos IDs
    const totalElement = document.getElementById('totalItems');
    const completadosElement = document.getElementById('completedItems');
    const progressElement = document.getElementById('progressPercentage');
    
    if (totalElement) totalElement.textContent = totalItems;
    if (completadosElement) completadosElement.textContent = completados;
    if (progressElement) {
      const porcentaje = totalItems > 0 ? Math.round((completados / totalItems) * 100) : 0;
      progressElement.textContent = `${porcentaje}%`;
    }
    
    // Actualizar barra de progreso
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      const porcentaje = totalItems > 0 ? (completados / totalItems) * 100 : 0;
      progressBar.style.width = `${porcentaje}%`;
    }
    
    console.log(`📊 Estadísticas actualizadas: ${completados}/${totalItems} items completados`);
    
  } catch (error) {
    console.error('Error actualizando estadísticas:', error);
  }
}

/**
 * Mejora la función guardarCambios para trabajar con el nuevo diseño
 */
function guardarCambiosEnLocal() {
  try {
    // Guardar campos de la página actual
    guardarCamposPaginaActual();
    
    // Guardar en localStorage
    guardarEnStorage();
    
    // Actualizar fecha de modificación del cliente
    if (clienteActual && numeroCliente) {
      clienteActual.lastModified = new Date().toISOString();
      localStorage.setItem(`cliente_${numeroCliente}`, JSON.stringify(clienteActual));
    }
    
    // Actualizar estadísticas
    actualizarEstadisticasProgreso();
    
    // Mostrar indicador de auto-guardado
    mostrarIndicadorAutoGuardado();
    
    console.log('💾 Cambios guardados en localStorage');
    
  } catch (error) {
    console.error('Error guardando cambios:', error);
    mostrarMensaje('❌ Error al guardar cambios', 'error');
  }
}

/**
 * Muestra un indicador temporal de guardado muy discreto
 */
function mostrarIndicadorAutoGuardado() {
  // Buscar o crear indicador
  let indicador = document.getElementById('auto-save-indicator');
  
  if (!indicador) {
    indicador = document.createElement('div');
    indicador.id = 'auto-save-indicator';
    indicador.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(71, 85, 105, 0.85);
      color: rgba(241, 245, 249, 0.95);
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 10px;
      font-weight: 400;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(6px);
      border: 1px solid rgba(148, 163, 184, 0.2);
    `;
    indicador.innerHTML = '💾 Guardado';
    document.body.appendChild(indicador);
  }
  
  // Mostrar indicador muy brevemente
  indicador.style.opacity = '1';
  
  // Ocultar después de 1.5 segundos
  setTimeout(() => {
    indicador.style.opacity = '0';
  }, 1500);
}

/**
 * Muestra un indicador discreto de auto-guardado cada 5 minutos
 */
function mostrarIndicadorAutoGuardadoDiscreto() {
  // Buscar o crear indicador discreto
  let indicador = document.getElementById('auto-save-indicator-discrete');
  
  if (!indicador) {
    indicador = document.createElement('div');
    indicador.id = 'auto-save-indicator-discrete';
    indicador.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(100, 116, 139, 0.9);
      color: rgba(241, 245, 249, 0.95);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 400;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.4s ease;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(148, 163, 184, 0.3);
    `;
    indicador.innerHTML = '💾 Auto-guardado';
    document.body.appendChild(indicador);
  }
  
  // Mostrar indicador discreto
  indicador.style.opacity = '1';
  
  // Ocultar después de 3 segundos
  setTimeout(() => {
    indicador.style.opacity = '0';
  }, 3000);
  
  console.log('💾 Auto-guardado discreto ejecutado cada 5 minutos');
}

/**
 * Actualiza la información del cliente en el card
 */
function actualizarClienteCard() {
  if (!clienteActual) return;
  
  try {
    // Actualizar nombre del cliente
    const clientNameElement = document.querySelector('.client-name');
    if (clientNameElement) {
      clientNameElement.textContent = clienteActual.name;
    }
    
    // Actualizar NIT
    const clientNitElement = document.querySelector('.client-nit');
    if (clientNitElement) {
      clientNitElement.textContent = `NIT: ${numeroCliente}`;
    }
    
    // Actualizar tipo de certificación
    const certTypeElement = document.querySelector('.cert-type');
    if (certTypeElement && clienteActual.certificationType) {
      const certInfo = CERTIFICATION_TYPES[clienteActual.certificationType];
      if (certInfo) {
        certTypeElement.textContent = certInfo.name;
      }
    }
    
    // Actualizar fecha de última modificación
    const lastModElement = document.querySelector('.last-modified');
    if (lastModElement && clienteActual.lastModified) {
      const fecha = new Date(clienteActual.lastModified);
      lastModElement.textContent = `Última modificación: ${fecha.toLocaleDateString()}`;
    }
    
  } catch (error) {
    console.error('Error actualizando cliente card:', error);
  }
}

// Actualizar función existente de guardarCambios para compatibilidad
function guardarCambios() {
  guardarCambiosEnLocal();
}

/**
 * Inicializa las nuevas características UX
 */
function initializeNewUXFeatures() {
  console.log('🎨 Inicializando características UX...');
  
  // Configurar auto-guardado mejorado
  setupAutoSave();
  
  // Configurar tooltips si es necesario
  setupTooltips();
  
  console.log('✅ Características UX inicializadas');
}

/**
 * Configura el sistema de auto-guardado mejorado
 */
function setupAutoSave() {
  // Interceptar cambios en todos los campos de evidencias
  document.addEventListener('input', function(e) {
    if (e.target.classList.contains('evidencias-editable')) {
      const itemId = e.target.getAttribute('data-id');
      if (itemId) {
        // Guardar con debounce más agresivo para mejor UX
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          guardarEstadoCampo(itemId);
        }, 1000);
      }
    }
  });
  
  // Interceptar cambios en selectors de aprobación
  document.addEventListener('change', function(e) {
    if (e.target.name && e.target.name.startsWith('aprobado_')) {
      const itemId = e.target.name.replace('aprobado_', '');
      setTimeout(() => {
        actualizarEstadisticasProgreso();
      }, 100);
    }
  });
}

/**
 * Configura tooltips para elementos con título
 */
function setupTooltips() {
  // Los tooltips se manejan nativamente con el atributo title
  // Aquí se pueden agregar tooltips personalizados si es necesario
}

/**
 * Exporta el gráfico de progreso como imagen PNG
 */
async function exportarGraficoProgreso() {
  try {
    if (!clienteActual || !numeroCliente) {
      mostrarMensaje('❌ No hay información de cliente disponible', 'error');
      return;
    }

    // Obtener datos actuales
    const itemsActuales = tipoChecklistActual || checklistItems;
    const totalItems = itemsActuales.length;
    
    let completados = 0;
    let aprobados = 0;
    let rechazados = 0;

    itemsActuales.forEach(item => {
      const estadoAprobacion = camposEstado[`aprobado_${item.id}`];
      const tieneEvidencias = camposEstado[`evidencias_${item.id}`] || camposEstado[`observaciones_${item.id}`];
      
      if (estadoAprobacion && tieneEvidencias) {
        completados++;
        if (estadoAprobacion === 'si') {
          aprobados++;
        } else if (estadoAprobacion === 'no') {
          rechazados++;
        }
      }
    });

    const pendientes = totalItems - completados;
    const porcentaje = totalItems > 0 ? Math.round((completados / totalItems) * 100) : 0;

    // Crear canvas para el gráfico
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Fondo
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Título
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Progreso de Certificación', canvas.width / 2, 50);

    // Información de la empresa
    ctx.fillStyle = '#475569';
    ctx.font = '24px Arial';
    ctx.fillText(`${clienteActual.name}`, canvas.width / 2, 85);
    
    ctx.font = '18px Arial';
    ctx.fillText(`NIT: ${numeroCliente}`, canvas.width / 2, 110);

    // Tipo de certificación
    const certType = CERTIFICATION_TYPES[clienteActual.certificationType];
    if (certType) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`${certType.name}`, canvas.width / 2, 140);
    }

    // Gráfico circular
    const centerX = canvas.width / 2;
    const centerY = 300;
    const radius = 120;

    // Fondo del círculo
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();

    // Progreso
    if (porcentaje > 0) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * porcentaje / 100));
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
    }

    // Texto del porcentaje
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${porcentaje}%`, centerX, centerY + 15);

    // Estadísticas detalladas
    const statsY = 480;
    const statsSpacing = 200;
    const statsStartX = (canvas.width - (statsSpacing * 2)) / 2;

    // Completados
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(completados.toString(), statsStartX, statsY);
    ctx.fillStyle = '#64748b';
    ctx.font = '16px Arial';
    ctx.fillText('Completados', statsStartX, statsY + 25);

    // Total
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(totalItems.toString(), statsStartX + statsSpacing, statsY);
    ctx.fillStyle = '#64748b';
    ctx.font = '16px Arial';
    ctx.fillText('Total', statsStartX + statsSpacing, statsY + 25);

    // Pendientes
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(pendientes.toString(), statsStartX + (statsSpacing * 2), statsY);
    ctx.fillStyle = '#64748b';
    ctx.font = '16px Arial';
    ctx.fillText('Pendientes', statsStartX + (statsSpacing * 2), statsY + 25);

    // Fecha
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    const fecha = new Date().toLocaleDateString('es-CO');
    ctx.fillText(`Generado el ${fecha}`, canvas.width - 20, canvas.height - 20);

    // Descargar imagen
    const link = document.createElement('a');
    link.download = `progreso_certificacion_${clienteActual.name.replace(/\s+/g, '_')}_${numeroCliente}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    mostrarMensaje('📊 Gráfico de progreso exportado exitosamente', 'success');
    console.log('📊 Gráfico de progreso exportado');

  } catch (error) {
    console.error('Error exportando gráfico:', error);
    mostrarMensaje('❌ Error al exportar gráfico de progreso', 'error');
  }
}

// =============================================================================
// FINALIZAR CERTIFICACIÓN
// =============================================================================
function finalizarCertificacion() {
  // Verificar que estamos en la página de certificación
  const checklistPage = document.getElementById('checklistPage');
  const welcomePage = document.getElementById('welcomePage');
  
  if (!checklistPage || checklistPage.style.display === 'none' || 
      !welcomePage || welcomePage.style.display !== 'none') {
    mostrarMensaje('❌ Debe estar en una certificación activa para poder finalizarla', 'error');
    return;
  }

  // Intentar obtener datos del cliente desde el DOM si clienteActual no está disponible
  let clienteParaFinalizar = clienteActual;
  
  if (!clienteParaFinalizar || !clienteParaFinalizar.nit) {
    const currentClientName = document.getElementById('currentClientName');
    const currentClientNumber = document.getElementById('currentClientNumber');
    const currentCertificationType = document.getElementById('currentCertificationType');
    
    if (currentClientName && currentClientNumber && 
        currentClientName.textContent !== '-' && currentClientNumber.textContent !== '-') {
      
      clienteParaFinalizar = {
        nombre: currentClientName.textContent,
        nit: currentClientNumber.textContent,
        certificationType: currentCertificationType ? currentCertificationType.textContent : 'No definido'
      };
    }
  }
  
  // Verificar que tenemos datos del cliente
  if (!clienteParaFinalizar || !clienteParaFinalizar.nit || clienteParaFinalizar.nit === '-') {
    mostrarMensaje('❌ No se pueden obtener los datos del cliente para finalizar la certificación', 'error');
    return;
  }

  // Mostrar confirmación única más amigable
  const confirmar = confirm(
    `🗑️ Finalizar Certificación\n\n` +
    `Cliente: ${clienteParaFinalizar.nombre || 'Sin nombre'}\n` +
    `NIT: ${clienteParaFinalizar.nit}\n\n` +
    `Esta acción eliminará todos los datos de esta certificación incluyendo evidencias y avances.\n\n` +
    `¿Desea continuar?`
  );

  if (!confirmar) {
    return;
  }

  try {
    // Guardar el NIT antes de limpiar clienteActual
    const nitAEliminar = clienteParaFinalizar.nit;
    
    // Usar función auxiliar para limpiar completamente el cliente
    limpiarClienteCompleto(nitAEliminar);
    
    // Limpiar variables globales
    clienteActual = null;
    checklistItems = [];
    currentPage = 1;
    
    // Limpiar sidebar
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (sidebarMenu) {
      sidebarMenu.innerHTML = '';
    }
    
    // Ocultar FABs si están visibles
    const cleanFab = document.getElementById('cleanFab');
    const sidebarFab = document.getElementById('sidebarFab');
    if (cleanFab) cleanFab.style.display = 'none';
    if (sidebarFab) sidebarFab.style.display = 'none';
    
    // Mostrar mensaje de éxito amigable
    mostrarMensaje('✅ Certificación cerrada correctamente', 'success');
    
    // Regresar a la página de bienvenida después de un breve delay
    setTimeout(() => {
      showWelcomePage();
      
      // Limpiar campos del formulario de búsqueda
      const searchInput = document.getElementById('searchClientInput');
      if (searchInput) {
        searchInput.value = '';
      }
      
      const searchMessage = document.getElementById('searchMessage');
      if (searchMessage) {
        searchMessage.innerHTML = '';
      }
    }, 2000);
    
  } catch (error) {
    console.error('Error al finalizar certificación:', error);
    mostrarMensaje('❌ Error al finalizar la certificación. Intente nuevamente.', 'error');
  }
}

// =============================================================================
// FUNCIÓN AUXILIAR: LIMPIAR COMPLETAMENTE UN CLIENTE
// =============================================================================
function limpiarClienteCompleto(nitCliente) {
  if (!nitCliente) return;
  
  try {
    // Lista de todas las claves posibles relacionadas con el cliente
    const clavesAEliminar = [
      `cliente_${nitCliente}`,
      `avances_${nitCliente}`,
      `evidencias_${nitCliente}`,
      `progreso_${nitCliente}`,
      `checklist_${nitCliente}`,
      `datos_${nitCliente}`,
      `autosave_${nitCliente}`
    ];
    
    // Eliminar todas las claves relacionadas
    clavesAEliminar.forEach(clave => {
      localStorage.removeItem(clave);
    });
    
    console.log(`✅ Cliente ${nitCliente} eliminado completamente de localStorage`);
    
  } catch (error) {
    console.error('Error al limpiar cliente:', error);
  }
}

// =============================================================================
// FUNCIONES PARA BARRA DE HERRAMIENTAS DE EVIDENCIAS
// =============================================================================

function formatoEvidencia(comando, elementId) {
  const elemento = document.getElementById(elementId);
  if (!elemento) return;
  
  elemento.focus();
  try {
    // Habilitar el formato CSS
    document.execCommand('styleWithCSS', false, true);
    document.execCommand(comando, false, null);
    
    // Asegurar que el elemento mantenga el foco
    elemento.focus();
  } catch (error) {
    console.error('Error al aplicar formato:', error);
  }
}

function toggleColorPalette(paletteId) {
  // Cerrar todas las otras paletas primero
  document.querySelectorAll('.color-palette').forEach(p => {
    if (p.id !== paletteId) {
      p.style.display = 'none';
    }
  });

  const palette = document.getElementById(paletteId);
  if (!palette) return;

  if (palette.style.display === 'grid') {
    palette.style.display = 'none';
  } else {
    const colorBtn = palette.previousElementSibling;
    if (colorBtn) {
      const rect = colorBtn.getBoundingClientRect();
      const toolbar = colorBtn.closest('.toolbar-evidencias');
      const toolbarRect = toolbar.getBoundingClientRect();
      
      // Calcular posición óptima
      let left = rect.left;
      if (left + 150 > window.innerWidth) {
        left = window.innerWidth - 160;
      }
      
      palette.style.position = 'fixed';
      palette.style.top = `${rect.bottom + 5}px`;
      palette.style.left = `${left}px`;
      palette.style.display = 'grid';
      palette.style.zIndex = '10000';
    }
  }
  
  // Evitar que el evento se propague
  event.preventDefault();
  event.stopPropagation();
}

function aplicarColor(color, elementId) {
    const elemento = document.getElementById(elementId);
    if (!elemento) return;

    // Asegurar que el elemento tiene el foco y está listo para edición
    elemento.focus();

    try {
        // Habilitar el formato CSS
        document.execCommand('styleWithCSS', false, true);
        
        // Aplicar el color
        document.execCommand('foreColor', false, color);
        
        // Si no hay texto seleccionado, insertar un espacio
        if (window.getSelection().toString().length === 0) {
            const tempSpan = document.createElement('span');
            tempSpan.style.color = color;
            tempSpan.innerHTML = '&nbsp;';
            
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            range.insertNode(tempSpan);
            
            // Mover el cursor después del espacio
            range.setStartAfter(tempSpan);
            range.setEndAfter(tempSpan);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        // Guardar cambios
        elemento.dispatchEvent(new Event('input', { bubbles: true }));

        // Cerrar la paleta
        const palette = document.getElementById(`palette_${elementId.split('_')[1]}`);
        if (palette) {
            palette.style.display = 'none';
        }
    } catch (error) {
        console.error('Error al aplicar color:', error);
    }
}

// =============================================================================
// FUNCIONES PARA ALTERNANCIA DE PUNTOS EN SIDEBAR
// =============================================================================

function mostrarPuntosFaltantes() {
  window.sidebarMostrandoFaltantes = true;
  renderSidebar();
  
  // Scroll hacia arriba del sidebar
  const sidebarMenu = document.getElementById('sidebarMenu');
  if (sidebarMenu) {
    sidebarMenu.scrollTop = 0;
  }
  
  console.log('👁️ Mostrando puntos faltantes');
}

function mostrarPrimerosPuntos() {
  window.sidebarMostrandoFaltantes = false;
  renderSidebar();
  
  // Scroll hacia arriba del sidebar
  const sidebarMenu = document.getElementById('sidebarMenu');
  if (sidebarMenu) {
    sidebarMenu.scrollTop = 0;
  }
  
  console.log('👁️ Mostrando primeros puntos');
}

// Funciones legacy para compatibilidad
function expandirTodosLosPuntos() {
  mostrarPuntosFaltantes();
}

function contraerPuntos() {
  mostrarPrimerosPuntos();
}

function scrollToItem(itemIndex) {
  const itemsActuales = tipoChecklistActual || checklistItems;
  
  // Si el punto no está en la página actual, navegar a su página
  const pageNumber = Math.floor(itemIndex / ITEMS_PER_PAGE) + 1;
  if (pageNumber !== currentPage) {
    currentPage = pageNumber;
    renderChecklist();
    
    // Esperar a que se renderice y luego hacer scroll
    setTimeout(() => {
      scrollToItemElement(itemIndex);
    }, 100);
  } else {
    scrollToItemElement(itemIndex);
  }
}

function scrollToItemElement(itemIndex) {
  const itemsActuales = tipoChecklistActual || checklistItems;
  const item = itemsActuales[itemIndex];
  
  if (item) {
    const itemElement = document.getElementById(`item_${item.id}`);
    if (itemElement) {
      itemElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Agregar efecto visual temporal
      itemElement.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
      itemElement.style.transition = 'box-shadow 0.3s ease';
      setTimeout(() => {
        itemElement.style.boxShadow = '';
        setTimeout(() => {
          itemElement.style.transition = '';
        }, 300);
      }, 2000);
    }
  }
}

// Función legacy mantenida para compatibilidad
function expandirPuntosSiguientes() {
  expandirTodosLosPuntos();
}

// =============================================================================
// SIDEBAR ADAPTATIVO - RESPONSIVE
// =============================================================================

// Recalcular puntos visibles cuando cambie el tamaño de ventana
function initSidebarAdaptativo() {
  let resizeTimeout;
  
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      // Recalcular siempre, manteniendo el estado actual
      console.log('📐 Recalculando sidebar por cambio de tamaño');
      renderSidebar();
    }, 250);
  });
  
  // También recalcular cuando se carga la página
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      renderSidebar();
    }, 500);
  });
}

// Inicializar el sistema adaptativo
initSidebarAdaptativo();

// =============================================================================
// FUNCIÓN PARA MENÚ CONTEXTUAL DEL CLIENTE
// =============================================================================
function toggleClientMenu() {
  const dropdown = document.getElementById('clientDropdown');
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  }
}

// Cerrar menú al hacer clic fuera
document.addEventListener('click', function(e) {
  const menu = document.querySelector('.client-options-menu');
  const dropdown = document.getElementById('clientDropdown');
  
  if (menu && dropdown && !menu.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});

// =============================================================================
// MANEJO DE IMÁGENES EN EVIDENCIAS
// =============================================================================

// Variables globales para el editor de imágenes
let imagenActual = null;
let datosImagenOriginal = null;

// Interceptar pegado de imágenes en evidencias
function initImagenHandler() {
  const evidenciasEditables = document.querySelectorAll('.evidencias-editable');
  
  evidenciasEditables.forEach(evidencia => {
    evidencia.addEventListener('paste', manejarPegadoImagen);
    evidencia.addEventListener('drop', manejarArrastrarImagen);
    evidencia.addEventListener('dragover', (e) => e.preventDefault());
  });
}

// Manejar pegado de imágenes
function manejarPegadoImagen(e) {
  const items = e.clipboardData.items;
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      e.preventDefault();
      const file = items[i].getAsFile();
      procesarImagen(file, e.target);
      break;
    }
  }
}

// Manejar arrastrar y soltar imágenes
function manejarArrastrarImagen(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  
  for (let file of files) {
    if (file.type.indexOf('image') !== -1) {
      procesarImagen(file, e.target);
      break;
    }
  }
}

// Procesar imagen y crear contenedor con controles
function procesarImagen(file, contenedor) {
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const imagenData = e.target.result;
    const imagenId = 'img_' + Date.now();
    
    // Crear una imagen temporal para obtener dimensiones originales
    const tempImg = new Image();
    tempImg.onload = function() {
      // Usar la imagen original sin procesamiento de canvas para mantener máxima calidad
      let imagenFinal = imagenData;
      
      // Solo aplicar mejoras si la imagen es muy pequeña o de baja calidad
      const needsEnhancement = tempImg.width < 200 || tempImg.height < 200;
      
      if (needsEnhancement) {
        // Solo para imágenes muy pequeñas, aplicar mejora mínima
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Mantener tamaño original
        canvas.width = tempImg.width;
        canvas.height = tempImg.height;
        
        // Configurar ctx para máxima calidad
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Dibujar imagen original
        ctx.drawImage(tempImg, 0, 0);
        
        // Aplicar mejora muy sutil solo al contraste
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Contraste muy sutil (factor 1.05) sin cambio de brillo
        const contrast = 1.05;
        
        for (let i = 0; i < data.length; i += 4) {
          // Aplicar contraste muy sutil solo a RGB
          data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128));     // R
          data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128)); // G
          data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128)); // B
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Usar máxima calidad de compresión
        imagenFinal = canvas.toDataURL('image/png'); // PNG para máxima calidad
      }
      
      // Crear contenedor de imagen con controles integrados
      const imagenContainer = document.createElement('div');
      imagenContainer.className = 'imagen-evidencia-container';
      imagenContainer.innerHTML = `
        <div class="imagen-wrapper">
          <img src="${imagenFinal}" class="imagen-evidencia" id="${imagenId}" alt="Evidencia" style="max-width: 100%; height: auto;">
          <div class="resize-handles">
            <div class="resize-handle nw" data-direction="nw"></div>
            <div class="resize-handle n" data-direction="n"></div>
            <div class="resize-handle ne" data-direction="ne"></div>
            <div class="resize-handle w" data-direction="w"></div>
            <div class="resize-handle e" data-direction="e"></div>
            <div class="resize-handle sw" data-direction="sw"></div>
            <div class="resize-handle s" data-direction="s"></div>
            <div class="resize-handle se" data-direction="se"></div>
          </div>
        </div>
      `;
      
      // Insertar la imagen en el contenedor
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(imagenContainer);
        range.collapse(false);
      } else {
        contenedor.appendChild(imagenContainer);
      }
      
      // Agregar un salto de línea después de la imagen
      const br = document.createElement('br');
      imagenContainer.parentNode.insertBefore(br, imagenContainer.nextSibling);
    };
    
    tempImg.src = imagenData;
  };
  
  reader.readAsDataURL(file);
}

// Redimensionar imagen directamente en línea
function redimensionarImagenInline(imagenId, nuevoTamaño) {
  const imagen = document.getElementById(imagenId);
  const sizeDisplay = imagen.closest('.imagen-wrapper').querySelector('.size-display');
  
  if (imagen && sizeDisplay) {
    imagen.style.maxWidth = nuevoTamaño + 'px';
    sizeDisplay.textContent = nuevoTamaño + 'px';
  }
}

// Rotar imagen 90 grados
function rotarImagenInline(imagenId) {
  const imagen = document.getElementById(imagenId);
  if (!imagen) return;
  
  let rotacionActual = imagen.dataset.rotacion || 0;
  rotacionActual = (parseInt(rotacionActual) + 90) % 360;
  
  imagen.style.transform = `rotate(${rotacionActual}deg)`;
  imagen.dataset.rotacion = rotacionActual;
}

// Inicializar manejadores de imagen cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
  initImagenHandler();
  
  // También reinicializar cuando se carguen nuevos checkpoints
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && node.querySelector && node.querySelector('.evidencias-editable')) {
            initImagenHandler();
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

// === FUNCIONES PARA CONTROLES INLINE DE IMAGEN ===

let isDragging = false;
let currentHandle = null;
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let aspectRatioLocked = false; // Por defecto libre

// Inicializar eventos de redimensionamiento
function inicializarRedimensionamiento() {
  document.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('resize-handle')) {
      isDragging = true;
      currentHandle = e.target;
      startX = e.clientX;
      startY = e.clientY;
      
      const container = currentHandle.closest('.imagen-evidencia-container');
      const img = container.querySelector('.imagen-evidencia');
      
      // Obtener dimensiones reales actuales
      const computedStyle = window.getComputedStyle(img);
      startWidth = parseFloat(computedStyle.width);
      startHeight = parseFloat(computedStyle.height);
      
      e.preventDefault();
      document.body.style.cursor = getResizeCursor(currentHandle.dataset.direction);
      container.classList.add('resizing');
    }
  });
  
  document.addEventListener('mousemove', function(e) {
    if (isDragging && currentHandle) {
      e.preventDefault();
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const container = currentHandle.closest('.imagen-evidencia-container');
      const img = container.querySelector('.imagen-evidencia');
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      switch (currentHandle.dataset.direction) {
        case 'nw':
          newWidth = startWidth - deltaX;
          if (aspectRatioLocked) {
            newHeight = newWidth * (startHeight / startWidth);
          } else {
            newHeight = startHeight - deltaY;
          }
          break;
      }
      
      // Aplicar límites mínimos
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);
      
      // Aplicar nuevas dimensiones
      img.style.width = newWidth + 'px';
      img.style.height = newHeight + 'px';
      
      // Actualizar posición de handles
      actualizarHandles(container);
    }
  });
  
  document.addEventListener('mouseup', function(e) {
    if (isDragging) {
      isDragging = false;
      if (currentHandle) {
        const container = currentHandle.closest('.imagen-evidencia-container');
        container.classList.remove('resizing');
      }
      currentHandle = null;
      document.body.style.cursor = 'default';
    }
  });
}

// Actualizar posición de handles
function actualizarHandles(container) {
  const img = container.querySelector('.imagen-evidencia');
  const handles = container.querySelector('.resize-handles');
  
  if (img && handles) {
    // Los handles se posicionan automáticamente con CSS relativo al contenedor
    // No necesita cálculos especiales sin rotación
  }
}

// Obtener cursor apropiado para la dirección
function getResizeCursor(direction) {
  const cursors = {
    'n': 'n-resize',
    's': 's-resize',
    'e': 'e-resize',
    'w': 'w-resize',
    'nw': 'nw-resize',
    'ne': 'ne-resize',
    'sw': 'sw-resize',
    'se': 'se-resize'
  };
  return cursors[direction] || 'default';
}

// Función optimizada para eliminar imagen completa
function eliminarImagenCompleta(container) {
    if (!container || !container.classList.contains('imagen-evidencia-container')) {
        return;
    }
    
    // Limpiar elementos hermanos que puedan ser residuos
    const parent = container.parentNode;
    
    // Eliminar <br> antes del contenedor
    const prevSibling = container.previousSibling;
    if (prevSibling && prevSibling.nodeName === 'BR') {
        prevSibling.remove();
    }
    
    // Eliminar <br> después del contenedor
    const nextSibling = container.nextSibling;
    if (nextSibling && nextSibling.nodeName === 'BR') {
        nextSibling.remove();
    }
    
    // Eliminar nodos de texto vacíos adyacentes
    let node = container.previousSibling;
    while (node && node.nodeType === 3 && node.textContent.trim() === '') {
        const toRemove = node;
        node = node.previousSibling;
        toRemove.remove();
    }
    
    node = container.nextSibling;
    while (node && node.nodeType === 3 && node.textContent.trim() === '') {
        const toRemove = node;
        node = node.nextSibling;
        toRemove.remove();
    }
    
    // Finalmente eliminar el contenedor
    container.remove();
    
    // Normalizar el contenedor padre para limpiar espacios
    if (parent && parent.normalize) {
        parent.normalize();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  inicializarRedimensionamiento();
  
  // Agregar event listener para tecla Delete
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Verificar si hay una imagen seleccionada
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        
        // Buscar el contenedor de imagen más cercano
        let imagenContainer = null;
        
        if (container.nodeType === 3) { // Text node
          imagenContainer = container.parentElement?.closest('.imagen-evidencia-container');
        } else if (container.nodeType === 1) { // Element node
          imagenContainer = container.closest?.('.imagen-evidencia-container') || 
                           container.querySelector?.('.imagen-evidencia-container');
        }
        
        // Si se encontró un contenedor de imagen, eliminarlo
        if (imagenContainer) {
          e.preventDefault();
          eliminarImagenCompleta(imagenContainer);
        }
      }
      
      // También verificar si el elemento activo es una imagen
      const activeElement = document.activeElement;
      if (activeElement && activeElement.closest('.imagen-evidencia-container')) {
        e.preventDefault();
        const container = activeElement.closest('.imagen-evidencia-container');
        eliminarImagenCompleta(container);
      }
    }
  });
  
  // Hacer las imágenes seleccionables y focusables
  document.addEventListener('click', function(e) {
    // Limpiar selecciones previas
    document.querySelectorAll('.imagen-evidencia-container.selected').forEach(container => {
      container.classList.remove('selected');
    });
    
    if (e.target.classList.contains('imagen-evidencia') || e.target.closest('.imagen-evidencia-container')) {
      const container = e.target.closest('.imagen-evidencia-container');
      const imagen = container.querySelector('.imagen-evidencia');
      
      if (container && imagen) {
        e.preventDefault();
        
        // Marcar como seleccionada
        container.classList.add('selected');
        imagen.focus();
        imagen.tabIndex = 0;
        
        // Seleccionar toda la imagen para que sea reemplazable
        const selection = window.getSelection();
        const range = document.createRange();
        
        try {
          range.selectNode(container);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (error) {
          // Si hay error, simplemente enfocar la imagen
          imagen.focus();
        }
      }
    }
  });
  
  // Limpiar selección cuando se hace clic fuera de las imágenes
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.imagen-evidencia-container')) {
      document.querySelectorAll('.imagen-evidencia-container.selected').forEach(container => {
        container.classList.remove('selected');
      });
    }
  });
  
  // Observer para nuevas imágenes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1 && node.classList && node.classList.contains('imagen-evidencia-container')) {
          // Las nuevas imágenes funcionarán automáticamente con el sistema de handles
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
