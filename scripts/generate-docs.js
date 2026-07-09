import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsDir = path.join(__dirname, '..', 'docs');

// Crear directorio de docs si no existe
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// Colores institucionales SENA
const colors = {
  primary: '#39a900',
  secondary: '#1a1a1a',
  text: '#333333',
  light: '#f5f5f5',
  white: '#ffffff',
};

// Función para crear portada
function createCoverPage(doc, title, subtitle) {
  // Fondo verde SENA
  doc.rect(0, 0, doc.page.width, 200).fill(colors.primary);

  // Título blanco
  doc
    .fill(colors.white)
    .fontSize(28)
    .font('Helvetica-Bold')
    .text(title, 50, 80, { align: 'center' });

  // Subtítulo
  doc
    .fontSize(14)
    .font('Helvetica')
    .text(subtitle, 50, 120, { align: 'center' });

  // Línea decorativa
  doc
    .moveTo(50, 220)
    .lineTo(doc.page.width - 50, 220)
    .lineWidth(2)
    .strokeColor(colors.primary)
    .stroke();

  // Información del documento
  doc
    .fill(colors.text)
    .fontSize(12)
    .text('Sistema de Gestión de Citas', 50, 250)
    .text('SENA Bienestar', 50, 270)
    .text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 50, 290)
    .text('Versión: 1.0', 50, 310);
}

// Función para crear encabezado de sección
function addSectionHeader(doc, title) {
  doc
    .fill(colors.primary)
    .fontSize(18)
    .font('Helvetica-Bold')
    .text(title, 50, doc.y + 20)
    .moveDown(0.5);

  doc
    .moveTo(50, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .lineWidth(1)
    .strokeColor(colors.primary)
    .stroke();

  doc.moveDown(0.5);
}

// Función para agregar contenido
function addContent(doc, text) {
  doc
    .fill(colors.text)
    .fontSize(11)
    .font('Helvetica')
    .text(text, 50, doc.y, {
      width: doc.page.width - 100,
      align: 'justify',
    })
    .moveDown(0.5);
}

// Función para agregar lista
function addList(doc, items) {
  items.forEach((item) => {
    doc
      .fill(colors.text)
      .fontSize(11)
      .font('Helvetica')
      .text(`• ${item}`, 70, doc.y, {
        width: doc.page.width - 120,
      })
      .moveDown(0.3);
  });
  doc.moveDown(0.5);
}

// Función para agregar tabla
function addTable(doc, headers, rows) {
  const tableWidth = doc.page.width - 100;
  const colWidth = tableWidth / headers.length;
  const startX = 50;
  let startY = doc.y;

  // Encabezados
  doc
    .fill(colors.primary)
    .rect(startX, startY, tableWidth, 25)
    .fill();

  headers.forEach((header, i) => {
    doc
      .fill(colors.white)
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(header, startX + i * colWidth + 5, startY + 7, {
        width: colWidth - 10,
      });
  });

  startY += 25;

  // Filas
  rows.forEach((row, rowIndex) => {
    const rowHeight = 20;
    const bgColor = rowIndex % 2 === 0 ? colors.light : colors.white;

    doc
      .fill(bgColor)
      .rect(startX, startY, tableWidth, rowHeight)
      .fill();

    row.forEach((cell, i) => {
      doc
        .fill(colors.text)
        .fontSize(9)
        .font('Helvetica')
        .text(cell, startX + i * colWidth + 5, startY + 5, {
          width: colWidth - 10,
        });
    });

    startY += rowHeight;
  });

  doc.y = startY + 10;
}

// ========================
// DOCUMENTO 1: FEATURES
// ========================
function generateFeaturesPDF() {
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(path.join(docsDir, 'FEATURES.pdf'));
  doc.pipe(stream);

  createCoverPage(doc, 'Características de la Aplicación', 'Documento de Especificación de Funcionalidades');

  doc.addPage();

  addSectionHeader(doc, '1. Visión General');
  addContent(doc, 'El Sistema de Gestión de Citas SENA Bienestar es una plataforma web diseñada para la gestión eficiente de citas de servicios de bienestar institucional. El sistema permite a los aprendices agendar citas con profesionales de psicología, enfermería y trabajo social, mientras que los profesionales y coordinadores pueden gestionar y supervisar las citas.');

  addSectionHeader(doc, '2. Módulos del Sistema');
  addContent(doc, 'El sistema está compuesto por los siguientes módulos principales:');

  addTable(doc, ['Módulo', 'Descripción', 'Usuarios'],
    [
      ['Autenticación', 'Gestión de usuarios, login, registro y recuperación de contraseña', 'Todos'],
      ['Gestión de Citas', 'Creación, confirmación, reprogramación y cancelación de citas', 'Aprendices, Profesionales, Coordinación'],
      ['Dashboard', 'Visualización de estadísticas, KPIs y gráficas de actividad', 'Coordinación, Admin'],
      ['Administración', 'Gestión de usuarios, roles, dependencias y configuración del sistema', 'Superadmin'],
      ['Notificaciones', 'Sistema de notificaciones push, email y SMS', 'Todos'],
    ]
  );

  addSectionHeader(doc, '3. Módulo de Autenticación');
  addContent(doc, 'El módulo de autenticación proporciona las siguientes funcionalidades:');
  addList(doc, [
    'Inicio de sesión con email y contraseña',
    'Registro de nuevos usuarios con validación de documento',
    'Recuperación de contraseña por email',
    'Gestión de sesiones con JWT',
    'Control de acceso basado en roles (RBAC)',
  ]);

  addSectionHeader(doc, '4. Módulo de Gestión de Citas');
  addContent(doc, 'El módulo core del sistema permite:');
  addList(doc, [
    'Selección de dependencia (Psicología, Enfermería, Trabajo Social)',
    'Selección de fecha y hora disponible',
    'Verificación de disponibilidad profesional en tiempo real',
    'Validación de horario laboral (8:00 AM - 5:00 PM)',
    'Exclusión de fines de semana',
    'Mínimo 24 horas de anticipación para agendar',
    'Estado de la cita: Pendiente, Confirmada, Completada, Cancelada',
    'Historial de citas por usuario',
  ]);

  addSectionHeader(doc, '5. Módulo de Dashboard');
  addContent(doc, 'Proporciona visualización de datos y estadísticas:');
  addList(doc, [
    'KPIs: Total de citas, citas pendientes, tasa de ocupación',
    'Gráficas de tendencia mensual',
    'Distribución por dependencia',
    'Tabla de profesionales con su actividad',
    'Acciones rápidas para gestión de citas',
  ]);

  addSectionHeader(doc, '6. Módulo de Administración');
  addContent(doc, 'Gestión del sistema para administradores:');
  addList(doc, [
    'Gestión de usuarios (crear, editar, desactivar)',
    'Asignación de roles y permisos',
    'Gestión de dependencias',
    'Configuración del sistema',
    'Registro de auditoría (logs)',
  ]);

  addSectionHeader(doc, '7. Roles del Sistema');
  addTable(doc, ['Rol', 'Permisos'],
    [
      ['SUPERADMIN', 'Acceso completo a todo el sistema'],
      ['COORDINACION', 'Gestión de citas y usuarios de su dependencia'],
      ['PSICOLOGIA', 'Gestión de citas de psicología'],
      ['ENFERMERIA', 'Gestión de citas de enfermería'],
      ['TRABAJO_SOCIAL', 'Gestión de citas de trabajo social'],
      ['APRENDIZ', 'Gestión de sus propias citas'],
    ]
  );

  doc.end();
  console.log('✓ FEATURES.pdf generado exitosamente');
}

// ========================
// DOCUMENTO 2: REQUISITOS
// ========================
function generateRequirementsPDF() {
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(path.join(docsDir, 'REQUISITOS.pdf'));
  doc.pipe(stream);

  createCoverPage(doc, 'Requisitos Funcionales', 'Documento de Especificación de Requisitos');

  doc.addPage();

  addSectionHeader(doc, '1. Requisitos de Autenticación (RF-001)');

  addContent(doc, 'RF-001.1: Inicio de Sesión');
  addList(doc, [
    'Criterio de aceptación: El usuario puede iniciar sesión con email y contraseña válidos',
    'Criterio de aceptación: Se muestra error con credenciales inválidas',
    'Criterio de aceptación: Se redirige al dashboard correspondiente según el rol',
  ]);

  addContent(doc, 'RF-001.2: Registro de Usuario');
  addList(doc, [
    'Criterio de aceptación: El usuario puede registrarse con nombre, documento, email y contraseña',
    'Criterio de aceptación: Las contraseñas deben coincidir y tener mínimo 6 caracteres',
    'Criterio de aceptación: Se valida que el número de documento no esté duplicado',
    'Criterio de aceptación: Se envía email de confirmación después del registro',
  ]);

  addContent(doc, 'RF-001.3: Recuperación de Contraseña');
  addList(doc, [
    'Criterio de aceptación: El usuario puede solicitar recuperación de contraseña por email',
    'Criterio de aceptación: Se recibe email con enlace para restablecer contraseña',
    'Criterio de aceptación: El enlace expira después de un tiempo configurable',
  ]);

  addSectionHeader(doc, '2. Requisitos de Gestión de Citas (RF-002)');

  addContent(doc, 'RF-002.1: Crear Cita');
  addList(doc, [
    'Criterio de aceptación: El aprendiz puede seleccionar dependencia, fecha y hora',
    'Criterio de aceptación: Solo se muestran fechas hábiles (lunes a viernes)',
    'Criterio de aceptación: Solo se muestran horas en horario laboral (8:00 AM - 5:00 PM)',
    'Criterio de aceptación: Se verifica disponibilidad profesional antes de confirmar',
    'Criterio de aceptación: La cita se crea con estado "Pendiente"',
  ]);

  addContent(doc, 'RF-002.2: Confirmar Cita');
  addList(doc, [
    'Criterio de aceptación: El profesional puede confirmar citas pendientes',
    'Criterio de aceptación: Se notifica al aprendiz la confirmación',
    'Criterio de aceptación: El estado cambia a "Confirmada"',
  ]);

  addContent(doc, 'RF-002.3: Reprogramar Cita');
  addList(doc, [
    'Criterio de aceptación: Se puede cambiar fecha y hora de una cita existente',
    'Criterio de aceptación: Se verifica disponibilidad en el nuevo horario',
    'Criterio de aceptación: Se notifica a las partes del cambio',
  ]);

  addContent(doc, 'RF-002.4: Cancelar Cita');
  addList(doc, [
    'Criterio de aceptación: Se puede cancelar una cita con motivo',
    'Criterio de aceptación: Se notifica la cancelación a las partes',
    'Criterio de aceptación: El estado cambia a "Cancelada"',
  ]);

  addSectionHeader(doc, '3. Requisitos de Dashboard (RF-003)');

  addContent(doc, 'RF-003.1: Visualización de KPIs');
  addList(doc, [
    'Criterio de aceptación: Se muestra total de citas del período',
    'Criterio de aceptación: Se muestra tasa de ocupación',
    'Criterio de aceptación: Se muestra tendencia comparativa',
  ]);

  addContent(doc, 'RF-003.2: Gráficas');
  addList(doc, [
    'Criterio de aceptación: Se muestra gráfica de tendencia mensual',
    'Criterio de aceptación: Se muestra distribución por dependencia',
    'Criterio de aceptación: Las gráficas son interactivas',
  ]);

  addSectionHeader(doc, '4. Requisitos de Administración (RF-004)');

  addContent(doc, 'RF-004.1: Gestión de Usuarios');
  addList(doc, [
    'Criterio de aceptación: El admin puede crear, editar y desactivar usuarios',
    'Criterio de aceptación: Se puede asignar roles a usuarios',
    'Criterio de aceptación: Se muestra lista de usuarios con filtros',
  ]);

  addContent(doc, 'RF-004.2: Gestión de Dependencias');
  addList(doc, [
    'Criterio de aceptación: El admin puede crear, editar y eliminar dependencias',
    'Criterio de acceptación: Cada dependencia tiene nombre, descripción y estado',
  ]);

  addSectionHeader(doc, '5. Requisitos de Notificaciones (RF-005)');

  addContent(doc, 'RF-005.1: Notificaciones');
  addList(doc, [
    'Criterio de aceptación: Se envían notificaciones de cambio de estado de cita',
    'Criterio de aceptación: Se pueden configurar notificaciones por email',
    'Criterio de aceptación: Se muestran notificaciones in-app en tiempo real',
  ]);

  doc.end();
  console.log('✓ REQUISITOS.pdf generado exitosamente');
}

// ========================
// DOCUMENTO 3: REQUISITOS NO FUNCIONALES
// ========================
function generateNonFunctionalRequirementsPDF() {
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(path.join(docsDir, 'REQUISITOS_NO_FUNCIONALES.pdf'));
  doc.pipe(stream);

  createCoverPage(doc, 'Requisitos No Funcionales', 'Documento de Especificación de Requisitos No Funcionales');

  doc.addPage();

  addSectionHeader(doc, '1. Seguridad (RNF-001)');

  addContent(doc, 'RNF-001.1: Autenticación y Autorización');
  addList(doc, [
    'Uso de JWT tokens con expiración configurable',
    'Supabase Auth para gestión centralizada de usuarios',
    'Row Level Security (RLS) en todas las tablas de base de datos',
    'CORS configurado con orígenes permitidos',
  ]);

  addContent(doc, 'RNF-001.2: Protección de Datos');
  addList(doc, [
    'Contraseñas encriptadas con bcrypt (12 rondas)',
    'Datos sensibles de salud protegidos según normatividad',
    'Logs de auditoría para acciones críticas',
    'Sesiones con timeout configurable (24h por defecto)',
  ]);

  addSectionHeader(doc, '2. Rendimiento (RNF-002)');

  addContent(doc, 'RNF-002.1: Tiempos de Respuesta');
  addList(doc, [
    'Carga inicial de la aplicación: < 3 segundos',
    'Respuesta de API: < 500ms',
    'Consultas a base de datos: < 200ms',
    'Renderizado de componentes: < 100ms',
  ]);

  addContent(doc, 'RNF-002.2: Optimización');
  addList(doc, [
    'Code splitting con React.lazy() para carga perezosa',
    'Imágenes optimizadas y lazy loading',
    'Cache de datos estáticos',
    'Compresión de assets en producción',
  ]);

  addSectionHeader(doc, '3. Disponibilidad (RNF-003)');

  addList(doc, [
    'Disponibilidad del 99.5% (máximo 44 horas de downtime al año)',
    'Backup automático de base de datos',
    'Recuperación ante desastres con RTO < 4 horas',
    'Monitoreo de salud del sistema',
  ]);

  addSectionHeader(doc, '4. Escalabilidad (RNF-004)');

  addList(doc, [
    'Arquitectura horizontal escalable',
    'Base de datos PostgreSQL escalable',
    'Soporte para múltiples dependencias y profesionales',
    'Capacidad de manejar 1000+ usuarios concurrentes',
  ]);

  addSectionHeader(doc, '5. Mantenibilidad (RNF-005)');

  addList(doc, [
    'Código modular y bien documentado',
    'Pruebas automatizadas con cobertura mínima del 70%',
    'Linting y formateo de código automatizado',
    'CI/CD para despliegue continuo',
    'Documentación técnica actualizada',
  ]);

  addSectionHeader(doc, '6. Compatibilidad (RNF-006)');

  addContent(doc, 'RNF-006.1: Navegadores Soportados');
  addTable(doc, ['Navegador', 'Versión Mínima'],
    [
      ['Chrome', '90+'],
      ['Firefox', '88+'],
      ['Safari', '14+'],
      ['Edge', '90+'],
      ['Safari iOS', '14+'],
      ['Chrome Mobile', '90+'],
    ]
  );

  addContent(doc, 'RNF-006.2: Responsive Design');
  addList(doc, [
    'Diseño adaptable a móvil, tableta y escritorio',
    'Breakpoints: 320px, 768px, 1024px, 1280px',
    'Navegación adaptativa (bottom nav en móvil)',
  ]);

  addSectionHeader(doc, '7. Usabilidad (RNF-007)');

  addList(doc, [
    'Interfaz intuitiva y fácil de usar',
    'Navegación consistente en toda la aplicación',
    'Mensajes de error claros y accionables',
    'Feedback visual en todas las interacciones',
    'Accesibilidad básica (WCAG 2.1 nivel A)',
  ]);

  addSectionHeader(doc, '8. Cumplimiento Normativo (RNF-008)');

  addList(doc, [
    'Cumplimiento con normativa de protección de datos personales',
    'Cumplimiento con estándares de salud (HTI-1 si aplica)',
    'Términos y condiciones de uso',
    'Política de privacidad',
  ]);

  doc.end();
  console.log('✓ REQUISITOS_NO_FUNCIONALES.pdf generado exitosamente');
}

// Ejecutar generación de documentos
console.log('Generando documentación PDF...\n');

generateFeaturesPDF();
generateRequirementsPDF();
generateNonFunctionalRequirementsPDF();

console.log('\n✓ Todos los documentos PDF generados exitosamente en la carpeta docs/');
