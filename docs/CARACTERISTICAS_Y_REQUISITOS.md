# Características, Requisitos Funcionales y No Funcionales
## Sistema de Gestión de Citas SENA Bienestar

---

## 1. Características de la Aplicación

### 1.1 Descripción General

El **Sistema de Gestión de Citas SENA Bienestar** es una plataforma web que gestiona las citas de bienestar (psicología, enfermería, trabajo social) para los aprendices del Servicio Nacional de Aprendizaje (SENA).

### 1.2 Características Principales

| # | Característica | Descripción |
|---|----------------|-------------|
| C1 | **Autenticación segura** | Login/registro con Supabase Auth, JWT, y RBAC |
| C2 | **Gestión de citas** | CRUD completo con estados y validaciones |
| C3 | **Múltiples roles** | 6 roles con permisos diferenciados |
| C4 | **Dashboards por rol** | Interfaces personalizadas según el rol |
| C5 | **Panel de administración** | Gestión de usuarios, configuración, auditoría |
| C6 | **Responsive design** | Adaptado a desktop, tablet y móvil |
| C7 | **Notificaciones** | Toast notifications en tiempo real |
| C8 | **Documentación integrada** | Manuales técnicos y de usuario en el admin |
| C9 | **Validación de datos** | Zod schemas para formularios |
| C10 | **Lazy loading** | Code splitting para mejor performance |

### 1.3 Módulos del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    SISTEMA DE CITAS                      │
├─────────────┬─────────────┬─────────────┬───────────────┤
│  AUTH       │ APPOINTMENTS│  DASHBOARD  │    ADMIN      │
│  - Login    │ - Crear     │  - Aprendiz │  - Usuarios   │
│  - Register │ - Leer      │  - Profes.  │  - Roles      │
│  - Recover  │ - Actualizar│  - Coordin. │  - Config     │
│  - RBAC     │ - Cancelar  │  - Admin    │  - Auditoría  │
│             │ - Reprogram.│  - KPIs     │  - Docs       │
├─────────────┴─────────────┴─────────────┴───────────────┤
│                   SHARED (Componentes)                   │
│  AppLayout, BottomNav, LoadingSpinner, ErrorBoundary     │
├─────────────────────────────────────────────────────────┤
│                  SUPABASE (Backend)                       │
│  Auth + PostgreSQL + RLS + Realtime                      │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Requisitos Funcionales

### 2.1 Módulo de Autenticación (RF-AUTH)

| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-AUTH-01 | El sistema debe permitir el inicio de sesión con email y contraseña | Alta | ✅ Implementado |
| RF-AUTH-02 | El sistema debe permitir el registro de aprendices | Alta | ✅ Implementado |
| RF-AUTH-03 | El sistema debe permitir el registro de profesionales | Alta | ✅ Implementado |
| RF-AUTH-04 | El sistema debe enviar correo de recuperación de contraseña | Media | ✅ Implementado |
| RF-AUTH-05 | El sistema debe confirmar el email antes de permitir login | Media | ✅ Implementado |
| RF-AUTH-06 | El sistema debe cerrar sesión correctamente | Alta | ✅ Implementado |
| RF-AUTH-07 | El sistema debe recordar la sesión activa | Media | ✅ Implementado |
| RF-AUTH-08 | El sistema debe mostrar errores descriptivos en login | Alta | ✅ Implementado |
| RF-AUTH-09 | El sistema debe validar que las contraseñas coincidan en registro | Alta | ✅ Implementado |
| RF-AUTH-10 | El sistema debe requerir contraseña mínima de 8 caracteres | Alta | ✅ Implementado |

### 2.2 Módulo de Citas (RF-CITA)

| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-CITA-01 | El aprendiz debe poder solicitar una nueva cita | Alta | ✅ Implementado |
| RF-CITA-02 | El sistema debe mostrar dependencias disponibles (Psicología, Enfermería, Trabajo Social) | Alta | ✅ Implementado |
| RF-CITA-03 | El sistema debe validar que la fecha no sea en el pasado | Alta | ✅ Implementado |
| RF-CITA-04 | El sistema debe validar que la fecha no sea fin de semana | Alta | ✅ Implementado |
| RF-CITA-05 | El sistema debe validar horario laboral (08:00 - 17:00) | Alta | ✅ Implementado |
| RF-CITA-06 | El sistema debe limitar a máximo 2 citas pendientes por aprendiz | Alta | ✅ Implementado |
| RF-CITA-07 | El sistema debe auto-asignar profesional disponible | Media | ✅ Implementado |
| RF-CITA-08 | El sistema debe mostrar indicador de disponibilidad | Media | ✅ Implementado |
| RF-CITA-09 | El aprendiz debe poder cancelar citas pendientes | Alta | ✅ Implementado |
| RF-CITA-10 | El profesional debe poder confirmar una cita | Alta | ✅ Implementado |
| RF-CITA-11 | El profesional debe poder completar una atención | Alta | ✅ Implementado |
| RF-CITA-12 | El profesional debe poder reprogramar una cita | Media | ✅ Implementado |
| RF-CITA-13 | El profesional debe poder marcar "No asistió" | Media | ✅ Implementado |
| RF-CITA-14 | El profesional debe poder agregar observaciones | Media | ✅ Implementado |
| RF-CITA-15 | El sistema debe enriquecer citas con datos de profiles | Alta | ✅ Implementado |

### 2.3 Módulo de Dashboard (RF-DASH)

| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-DASH-01 | El dashboard de aprendiz debe mostrar sus citas | Alta | ✅ Implementado |
| RF-DASH-02 | El dashboard de aprendiz debe filtrar por estado | Alta | ✅ Implementado |
| RF-DASH-03 | El dashboard profesional debe mostrar KPIs | Alta | ✅ Implementado |
| RF-DASH-04 | El dashboard profesional debe mostrar próxima cita | Media | ✅ Implementado |
| RF-DASH-05 | El dashboard de coordinación debe mostrar gráficas | Alta | ✅ Implementado |
| RF-DASH-06 | El dashboard de coordinación debe filtrar por fechas | Media | ✅ Implementado |
| RF-DASH-07 | El dashboard de coordinación debe exportar reportes | Media | ✅ Implementado |
| RF-DASH-08 | El sistema debe redirigir al dashboard correcto según rol | Alta | ✅ Implementado |

### 2.4 Módulo de Administración (RF-ADMIN)

| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-ADMIN-01 | El admin debe poder listar todos los usuarios | Alta | ✅ Implementado |
| RF-ADMIN-02 | El admin debe poder buscar usuarios | Media | ✅ Implementado |
| RF-ADMIN-03 | El admin debe poder filtrar por rol | Media | ✅ Implementado |
| RF-ADMIN-04 | El admin debe poder crear usuarios | Alta | ✅ Implementado |
| RF-ADMIN-05 | El admin debe poder editar roles y dependencias | Alta | ✅ Implementado |
| RF-ADMIN-06 | El admin debe poder activar/desactivar usuarios | Alta | ✅ Implementado |
| RF-ADMIN-07 | El admin debe poder configurar el sistema | Media | ✅ Implementado |
| RF-ADMIN-08 | El admin debe poder ver logs de auditoría | Media | ✅ Implementado |
| RF-ADMIN-09 | El sistema debe registrar acciones en auditoría | Media | ✅ Implementado |
| RF-ADMIN-10 | El admin debe poder acceder a la documentación | Baja | ✅ Implementado |

### 2.5 Módulo de Notificaciones (RF-NOTIF)

| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-NOTIF-01 | El sistema debe mostrar notificaciones de citas | Media | ✅ Implementado |
| RF-NOTIF-02 | El sistema debe marcar notificaciones como leídas | Baja | ✅ Implementado |
| RF-NOTIF-03 | El sistema debe usar toasts para feedback inmediato | Alta | ✅ Implementado |

### 2.6 Seguridad (RF-SEG)

| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-SEG-01 | El sistema debe implementar RBAC por roles | Alta | ✅ Implementado |
| RF-SEG-02 | El sistema debe usar RLS en Supabase | Alta | ✅ Implementado |
| RF-SEG-03 | El sistema debe proteger rutas según rol | Alta | ✅ Implementado |
| RF-SEG-04 | El sistema debe hashear contraseñas | Alta | ✅ Implementado (Supabase) |
| RF-SEG-05 | El sistema debe validar inputs con Zod | Alta | ✅ Implementado |

---

## 3. Requisitos No Funcionales

### 3.1 Rendimiento (RNF-PERF)

| ID | Requisito | Métrica | Estado |
|----|-----------|---------|--------|
| RNF-PERF-01 | El sistema debe cargar en menos de 3 segundos | TTI < 3s | ✅ Cumplido |
| RNF-PERF-02 | El build debe ser menor a 500KB gzipped | Bundle < 500KB | ✅ Cumplido (113KB) |
| RNF-PERF-03 | El sistema debe usar lazy loading para rutas | Code splitting | ✅ Implementado |
| RNF-PERF-04 | Las imágenes y assets deben estar optimizados | Compresión | ✅ Implementado |

### 3.2 Usabilidad (RNF-USAB)

| ID | Requisito | Métrica | Estado |
|----|-----------|---------|--------|
| RNF-USAB-01 | La interfaz debe ser responsive | Desktop/Tablet/Mobile | ✅ Cumplido |
| RNF-USAB-02 | El sistema debe usar iconografía consistente | Lucide React | ✅ Implementado |
| RNF-USAB-03 | El sistema debe usar colores institucionales SENA | #39A900 | ✅ Implementado |
| RNF-USAB-04 | El sistema debe mostrar feedback en cada acción | Toasts | ✅ Implementado |
| RNF-USAB-05 | El sistema debe tener estados de carga claros | LoadingSpinner | ✅ Implementado |
| RNF-USAB-06 | El sistema debe manejar errores gracefully | ErrorBoundary | ✅ Implementado |

### 3.3 Compatibilidad (RNF-COMP)

| ID | Requisito | Métrica | Estado |
|----|-----------|---------|--------|
| RNF-COMP-01 | Chrome 90+ | Navegador | ✅ Compatible |
| RNF-COMP-02 | Firefox 88+ | Navegador | ✅ Compatible |
| RNF-COMP-03 | Safari 14+ | Navegador | ✅ Compatible |
| RNF-COMP-04 | Edge 90+ | Navegador | ✅ Compatible |
| RNF-COMP-05 | Resolución mínima 1024x768 | Desktop | ✅ Cumplido |
| RNF-COMP-06 | Touch events en móvil | Mobile | ✅ Implementado |

### 3.4 Seguridad (RNF-SEG)

| ID | Requisito | Métrica | Estado |
|----|-----------|---------|--------|
| RNF-SEG-01 | Autenticación JWT con refresh token | Supabase Auth | ✅ Implementado |
| RNF-SEG-02 | Row Level Security en todas las tablas | Supabase RLS | ✅ Implementado |
| RNF-SEG-03 | Variables de entorno fuera del código | .env | ✅ Implementado |
| RNF-SEG-04 | HTTPS en producción | SSL/TLS | ✅ Configurado |
| RNF-SEG-05 | Validación server-side de datos | Zod + Supabase | ✅ Implementado |

### 3.5 Mantenibilidad (RNF-MANT)

| ID | Requisito | Métrica | Estado |
|----|-----------|---------|--------|
| RNF-MANT-01 | Código modular por features | Feature-based | ✅ Implementado |
| RNF-MANT-02 | Naming conventions consistentes | camelCase/PascalCase | ✅ Implementado |
| RNF-MANT-03 | Linting sin errores | ESLint 0 errors | ✅ Cumplido |
| RNF-MANT-04 | Tests con cobertura > 70% | Vitest | ✅ Cumplido |
| RNF-MANT-05 | Documentación integrada | Manuales en admin | ✅ Implementado |

### 3.6 Disponibilidad (RNF-DISP)

| ID | Requisito | Métrica | Estado |
|----|-----------|---------|--------|
| RNF-DISP-01 | Uptime > 99% | Supabase Cloud | ✅ Cumplido |
| RNF-DISP-02 | Backup automático de base de datos | Supabase | ✅ Implementado |
| RNF-DISP-03 | Modo offline con datos cacheados | N/A | ⏸️ Pendiente |

---

## 4. Matriz de Trazabilidad

| Requisito Funcional | Test Asociado | Estado |
|---------------------|---------------|--------|
| RF-AUTH-01 (Login) | Login.test.jsx, auth.integration.test.jsx | ✅ |
| RF-AUTH-02 (Registro Aprendiz) | Register.test.jsx | ✅ |
| RF-AUTH-03 (Registro Profesional) | ProfessionalRegister.test.jsx | ✅ |
| RF-AUTH-09 (Passwords coinciden) | Register.test.jsx | ✅ |
| RF-CITA-01 (Solicitar cita) | AppointmentForm.test.jsx | ✅ |
| RF-CITA-03-06 (Validaciones) | appointment.schema.test.js | ✅ |
| RF-CITA-08 (Disponibilidad) | AppointmentForm.test.jsx | ✅ |
| RF-DASH-01-02 (Dashboard Aprendiz) | Manual testing | ✅ |
| RF-DASH-03-04 (Dashboard Profesional) | Manual testing | ✅ |
| RF-ADMIN-01-06 (Gestión usuarios) | Manual testing | ✅ |

---

## 5. Credenciales de Prueba

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| SUPERADMIN | admin@test.com | Test1234! | Acceso total |
| COORDINACION | coordinacion@test.com | Test1234! | Dashboard, reportes |
| PSICOLOGIA | psicologia@test.com | Test1234! | Citas psicología |
| ENFERMERIA | enfermeria@test.com | Test1234! | Citas enfermería |
| TRABAJO_SOCIAL | trabajosocial@test.com | Test1234! | Citas trabajo social |
| APRENDIZ | aprendiz@test.com | Test1234! | Crear/ver propias citas |

---

*Documento de Características y Requisitos v1.0*
*Sistema de Gestión de Citas SENA Bienestar*
*© 2026 SENA — Servicios de Bienestar*
