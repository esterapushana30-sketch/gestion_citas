<div align="center">

# 🔧 Manual Técnico

## Sistema de Gestión de Citas SENA Bienestar

---

**Versión:** 2.0  
**Fecha:** Julio 2026  
**Documento interno — Desarrollo de Software**

</div>

---

## 📌 Índice

1. [Arquitectura del Sistema](#1-arquitectura-del-sistema)
2. [Configuración del Entorno](#2-configuración-del-entorno)
3. [Base de Datos](#3-base-de-datos)
4. [API y Endpoints](#4-api-y-endpoints)
5. [Componentes Principales](#5-componentes-principales)
6. [Sistema de Autenticación](#6-sistema-de-autenticación)
7. [Pruebas](#7-pruebas)
8. [Deployment](#8-deployment)
9. [Guía de Desarrollo](#9-guía-de-desarrollo)

---

## 1. Arquitectura del Sistema

### 1.1 Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| **Frontend** | React | 19.2.4 | UI Framework |
| **Bundler** | Vite | 8.0.4 | Build tool y dev server |
| **Router** | React Router DOM | 7.14.0 | Enrutamiento SPA |
| **Backend** | Supabase | - | Backend-as-a-Service |
| **Base de Datos** | PostgreSQL | - | Almacenamiento relacional |
| **Formularios** | React Hook Form | 7.72.1 | Gestión de formularios |
| **Validación** | Zod | 4.3.6 | Schema validation |
| **Estado** | Context API | - | Estado global |
| **UI** | Lucide React | 1.8.0 | Iconos |
| **Estilos** | CSS Custom | - | Variables y responsive |
| **Gráficas** | Recharts | 2.15.4 | Visualización de datos |
| **Notificaciones** | Sonner | 2.0.7 | Toast notifications |
| **Tests** | Vitest | 4.1.10 | Testing framework |
| **Testing UI** | Testing Library | 16.3.2 | Component testing |
| **Linting** | ESLint | 9.39.4 | Code quality |

### 1.2 Arquitectura de Aplicación

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │Dashboard │  │ Appoint- │  │  Admin   │   │
│  │  Pages   │  │  Pages   │  │  ments   │  │  Pages   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
├─────────────────────────────────────────────────────────────┤
│                      BUSINESS LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │Dashboard │  │ Appoint- │  │  Admin   │   │
│  │ Provider │  │  Hooks   │  │  Hooks   │  │  Hooks   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
├─────────────────────────────────────────────────────────────┤
│                       DATA LAYER                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Supabase  │  │Repository│  │ Validat- │  │  Shared  │   │
│  │  Client  │  │ Pattern  │  │  ions    │  │   API    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    EXTERNAL SERVICES                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Supabase (PostgreSQL + Auth)             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Estructura del Proyecto

```
gestion_citas/
├── src/
│   ├── assets/                    # Imágenes y estáticos
│   ├── features/                  # Módulos por dominio
│   │   ├── auth/                  # Autenticación
│   │   │   ├── pages/            # Login, Register, ForgotPassword
│   │   │   └── __tests__/        # Tests de autenticación
│   │   ├── appointments/          # Gestión de citas
│   │   │   ├── api/              # Repository pattern
│   │   │   ├── components/       # Form, Card
│   │   │   ├── config/           # Configuración de dependencias
│   │   │   ├── hooks/            # useAppointments, useProfessional
│   │   │   ├── pages/            # Dashboards por rol
│   │   │   ├── validations/      # Schemas Zod
│   │   │   └── __tests__/        # Tests de citas
│   │   ├── dashboard/             # Dashboard de coordinación
│   │   │   ├── api/              # DashboardRepository
│   │   │   ├── components/       # KPI, Charts, QuickActions
│   │   │   └── __tests__/        # Tests de dashboard
│   │   ├── admin/                 # Panel de administración
│   │   │   ├── api/              # AdminRepository
│   │   │   ├── components/       # UserManagement, etc.
│   │   │   └── hooks/            # useAdmin
│   │   └── notifications/         # Sistema de notificaciones
│   │       ├── pages/
│   │       └── hooks/
│   ├── shared/                    # Código compartido
│   │   ├── components/           # AppLayout, BottomNav, etc.
│   │   ├── hooks/                # useDashboard
│   │   ├── styles/               # CSS (11 archivos)
│   │   ├── utils/                # api.js, formatters.js
│   │   └── __tests__/            # Tests compartidos
│   ├── providers/                 # Context API
│   │   └── AuthProvider.jsx
│   ├── routes/                    # Enrutamiento
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── lib/                       # Configuración
│   │   └── supabase.js
│   └── test/                      # Setup de tests
│       ├── setup.js
│       ├── test-utils.jsx
│       └── mocks/
├── database/                      # Scripts SQL
│   ├── schema.sql
│   ├── fix_orphan_users.sql
│   ├── fix_profile_trigger.sql
│   ├── fix_profiles_columns.sql
│   └── fix_profiles_rls.sql
├── docs/                          # Documentación
└── package.json
```

---

## 2. Configuración del Entorno

### 2.1 Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Service Role Key (solo para scripts/admin)
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### 2.2 Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-org/gestion_citas.git
cd gestion_citas

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servidor de desarrollo
npm run dev
```

### 2.3 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Vite, puerto 5173) |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build de producción |
| `npm run test` | Ejecutar tests en watch mode |
| `npm run test:run` | Ejecutar tests una vez |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run test:ui` | Interfaz web de Vitest |
| `npm run lint` | Linting con ESLint |

---

## 3. Base de Datos

### 3.1 Diagrama ER

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    roles     │       │  profiles    │       │ dependencies │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◄──┐   │ id (PK,UUID) │   ┌──►│ id (PK)      │
│ name         │   └───│ role_id (FK) │   │   │ name         │
│ description  │       │ dependency_id│───┘   │ color        │
│ permissions  │       │ full_name    │       │ description  │
└──────────────┘       │ email        │       └──────────────┘
                       │ document_num │
                       │ phone        │
                       │ profession   │
                       │ specialty    │
                       │ is_active    │
                       │ created_at   │
                       │ updated_at   │
                       └──────┬───────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
              ┌─────▼──────┐     ┌──────▼───────┐
              │ appointments│     │  professional │
              ├────────────┤     │ _availability │
              │ id (PK)    │     ├──────────────┤
              │ user_id FK │     │ id (PK)      │
              │ prof_id FK │     │ prof_id (FK) │
              │ dep_id FK  │     │ day_of_week  │
              │ sched_date │     │ start_time   │
              │ sched_time │     │ end_time     │
              │ status     │     │ is_available │
              │ reason     │     └──────────────┘
              │ notes      │
              │ ficha_num  │
              │ programa   │
              └────────────┘
                    │
              ┌─────▼──────┐
              │ audit_logs │
              ├────────────┤
              │ id (PK)    │
              │ user_id FK │
              │ action     │
              │ entity_type│
              │ entity_id  │
              │ old_data   │
              │ new_data   │
              └────────────┘
```

### 3.2 Tablas Principales

#### profiles — Perfiles de usuario

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | UUID | PK, FK → auth.users | ID del usuario |
| email | TEXT | | Correo electrónico |
| full_name | VARCHAR(100) | NOT NULL | Nombre completo |
| document_number | VARCHAR(20) | | Número de documento |
| phone | VARCHAR(20) | | Teléfono |
| profession | TEXT | | Profesión / Cargo |
| specialty | TEXT | | Especialidad |
| role_id | INT | FK → roles, DEFAULT 6 | Rol del usuario |
| dependency_id | INT | FK → dependencies | Dependencia asignada |
| is_active | BOOLEAN | DEFAULT true | Estado activo/inactivo |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Última actualización |

#### appointments — Citas

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | UUID | PK | ID de la cita |
| user_id | UUID | FK → profiles | Aprendiz que solicita |
| professional_id | UUID | FK → profiles | Profesional asignado |
| dependency_id | INT | FK → dependencies | Dependencia |
| scheduled_date | DATE | NOT NULL | Fecha programada |
| scheduled_time | TIME | NOT NULL | Hora programada |
| status | TEXT | CHECK IN (...) | Estado de la cita |
| reason | TEXT | | Motivo de la consulta |
| notes | TEXT | | Observaciones del profesional |
| ficha_number | TEXT | | Número de ficha |
| programa | TEXT | | Programa de formación |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Última actualización |

**Estados válidos:** `pending`, `confirmed`, `completed`, `cancelled`, `no_show`, `rescheduled`

### 3.3 Índices Recomendados

```sql
-- Performance para queries frecuentes
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_professional_id ON appointments(professional_id);
CREATE INDEX idx_appointments_dependency_id ON appointments(dependency_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date ON appointments(scheduled_date);
CREATE INDEX idx_profiles_role_id ON profiles(role_id);
CREATE INDEX idx_profiles_dependency_id ON profiles(dependency_id);
```

### 3.4 Row Level Security (RLS)

```sql
-- Ejemplo: Aprendices solo ven sus propias citas
CREATE POLICY "Aprendices ven sus citas" ON appointments
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR
    professional_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role_id IN (1, 2) -- SUPERADMIN, COORDINACION
    )
  );
```

---

## 4. API y Endpoints

### 4.1 Supabase PostgREST

El sistema utiliza Supabase como Backend-as-a-Service. Todas las operaciones se realizan a través del cliente Supabase SDK.

#### Endpoints Principales

| Recurso | Método | Descripción |
|---------|--------|-------------|
| `/rest/v1/profiles` | GET/POST/PATCH | Perfiles de usuario |
| `/rest/v1/appointments` | GET/POST/PATCH | Gestión de citas |
| `/rest/v1/dependencies` | GET | Dependencias |
| `/rest/v1/roles` | GET | Roles del sistema |
| `/rest/v1/system_config` | GET/PATCH | Configuración |
| `/rest/v1/audit_logs` | GET | Logs de auditoría |

### 4.2 Ejemplos de Consulta

```javascript
// Obtener citas con dependencia y profiles
const { data, error } = await supabase
  .from('appointments')
  .select(`
    *,
    dependencies (name, color),
    profiles:user_id (full_name, document_number),
    profiles:professional_id (full_name)
  `)
  .eq('status', 'pending')
  .order('scheduled_date', { ascending: true });

// Obtener perfil con rol
const { data, error } = await supabase
  .from('profiles')
  .select(`
    *,
    roles (name, permissions),
    dependencies (name)
  `)
  .eq('id', userId)
  .single();

// RPC: Obtener KPIs del dashboard
const { data, error } = await supabase
  .rpc('get_dashboard_kpis', {
    start_date: '2026-06-01',
    end_date: '2026-06-30'
  });
```

### 4.3 Repository Pattern

```javascript
// Ejemplo: AppointmentRepository
export class AppointmentRepository {
  static async create(appointmentData) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select('*, dependencies (name, color)')
      .single();
    
    if (error) throw new Error(`Error creating appointment: ${error.message}`);
    return data;
  }

  static async fetch({ userId, dependencyId, status }) {
    let query = supabase
      .from('appointments')
      .select('*, dependencies (name, color)');
    
    if (userId) query = query.eq('user_id', userId);
    if (dependencyId) query = query.eq('dependency_id', dependencyId);
    if (status) query = query.eq('status', status);
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}
```

---

## 5. Componentes Principales

### 5.1 Autenticación

| Componente | Ubicación | Descripción |
|-----------|-----------|-------------|
| `AuthProvider` | `src/providers/` | Contexto global de autenticación |
| `ProtectedRoute` | `src/routes/` | Ruta protegida con verificación de roles |
| `useAuth` | `src/providers/` | Hook para acceder al contexto |

### 5.2 Dashboards por Rol

| Dashboard | Ruta | Rol Requerido |
|-----------|------|---------------|
| `AprendizDashboard` | `/dashboard` | APRENDIZ |
| `ProfessionalDashboard` | `/psicologia` | PSICOLOGIA |
| `EnfermeriaDashboard` | `/enfermeria` | ENFERMERIA |
| `TrabajoSocialDashboard` | `/trabajo-social` | TRABAJO_SOCIAL |
| `CoordinationDashboard` | `/coordination` | COORDINACION |
| `AdminDashboard` | `/admin` | SUPERADMIN |

### 5.3 Hooks Personalizados

| Hook | Archivo | Descripción |
|------|---------|-------------|
| `useAppointments` | `features/appointments/hooks/` | CRUD de citas |
| `useProfessional` | `features/appointments/hooks/` | Gestión profesional |
| `useDashboard` | `shared/hooks/` | Datos de dashboard |
| `useAdmin` | `features/admin/hooks/` | Administración |
| `useNotifications` | `features/notifications/hooks/` | Notificaciones |

### 5.4 Repositories

| Repository | Archivo | Descripción |
|-----------|---------|-------------|
| `AppointmentRepository` | `features/appointments/api/` | Acceso a datos de citas |
| `DashboardRepository` | `features/dashboard/api/` | Métricas y KPIs |
| `AdminRepository` | `features/admin/api/` | Gestión de usuarios y config |

---

## 6. Sistema de Autenticación

### 6.1 Flujo de Autenticación

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Login  │────►│ Supabase │────►│  JWT     │────►│ Profile  │
│  Form   │     │  Auth    │     │  Token   │     │  Fetch   │
└─────────┘     └──────────┘     └──────────┘     └──────────┘
                      │                                │
                      ▼                                ▼
              ┌──────────────┐                ┌──────────────┐
              │   Session    │                │   Context    │
              │   Storage    │                │   Provider   │
              └──────────────┘                └──────────────┘
```

### 6.2 Sistema de Roles (RBAC)

| Rol | ID | Permisos |
|-----|----|----------|
| SUPERADMIN | 1 | Acceso total al sistema |
| COORDINACION | 2 | Dashboard, ver todas las citas, reportes |
| PSICOLOGIA | 3 | Gestionar citas de psicología |
| ENFERMERIA | 4 | Gestionar citas de enfermería |
| TRABAJO_SOCIAL | 5 | Gestionar citas de trabajo social |
| APRENDIZ | 6 | Crear y ver sus propias citas |

### 6.3 Helpers de RBAC

```javascript
// En AuthProvider.jsx
const hasRole = (requiredRoles) => {
  if (!profile?.roles?.name) return false;
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(profile.roles.name);
  }
  return profile.roles.name === requiredRoles;
};

const isAdmin = () => hasRole("SUPERADMIN");
const isCoordination = () => hasRole(["COORDINACION", "SUPERADMIN"]);
const isProfessional = () => hasRole(["PSICOLOGIA", "ENFERMERIA", "TRABAJO_SOCIAL"]);
const isAprendiz = () => hasRole("APRENDIZ");
```

---

## 7. Pruebas

### 7.1 Configuración

- **Framework:** Vitest
- **Environment:** jsdom
- **Setup:** `src/test/setup.js`
- **Mocks:** `src/test/mocks/supabase.js`

### 7.2 Cobertura Actual

| Categoría | Archivos | Tests |
|-----------|----------|-------|
| Auth | 4 | Login, Register, AuthProvider, Integration |
| Appointments | 4 | Form, Schema, Integration, Appointments |
| Dashboard | 2 | StatCard, KPICard |
| Shared | 3 | ProtectedRoute, formatters, ErrorBoundary |
| **Total** | **12** | **~90 tests** |

### 7.3 Ejecutar Tests

```bash
# Watch mode (desarrollo)
npm run test

# Una vez
npm run test:run

# Con cobertura
npm run test:coverage

# Interfaz web
npm run test:ui
```

### 7.4 Escribir Tests

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 8. Deployment

### 8.1 Build de Producción

```bash
npm run build
# Genera dist/ con assets optimizados
```

### 8.2 Estructura del Build

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js        # Bundle principal (~384KB)
│   ├── index-[hash].css       # Estilos (~50KB)
│   ├── Login-[hash].js        # Chunk: Login
│   ├── Register-[hash].js     # Chunk: Register
│   ├── AdminDashboard-[hash].js # Chunk: Admin
│   └── ...                    # Otros chunks
└── ...
```

### 8.3 Variables de Producción

Asegurar que las variables de entorno estén configuradas:

```env
VITE_SUPABASE_URL=https://produccion.supabase.co
VITE_SUPABASE_ANON_KEY=clave-produccion
```

### 8.4 Supabase Producción

- [ ] Configurar RLS policies adecuadas
- [ ] Verificar triggers (`on_auth_user_created`)
- [ ] Configurar índices para queries frecuentes
- [ ] Habilitar backups automáticos
- [ ] Configurar monitoreo de rendimiento

### 8.5 Plataformas de Despliegue

| Plataforma | Configuración |
|-----------|---------------|
| **Vercel** | Framework: Vite, Build: `npm run build` |
| **Netlify** | Build: `npm run build`, Publish: `dist` |
| **GitHub Pages** | Configurar `base` en vite.config.js |

---

## 9. Guía de Desarrollo

### 9.1 Convenciones de Código

- **Componentes:** PascalCase (`UserProfile.jsx`)
- **Hooks:** camelCase con prefijo `use` (`useAppointments.js`)
- **Archivos de estilos:** kebab-case (`admin.css`)
- **Funciones:** camelCase (`fetchAppointments`)
- **Constantes:** UPPER_SNAKE_CASE (`API_BASE_URL`)

### 9.2 Agregar Nuevo Componente

1. Crear archivo en la feature correspondiente
2. Exportar como named export
3. Agregar test unitario
4. Importar en el componente padre

### 9.3 Agregar Nuevo Hook

1. Crear archivo en `hooks/` de la feature
2. Usar `useState`, `useCallback` para estado
3. Retornar objeto con estado y funciones
4. Agregar test

### 9.4 Agregar Nuevo Endpoint

1. Agregar método al Repository correspondiente
2. Usar Supabase client para queries
3. Manejar errores con throw
4. Enriquecer datos con `fetchProfiles` si es necesario

### 9.5 Git Workflow

```bash
# Crear feature branch
git checkout -b feature/nueva-funcionalidad

# Hacer cambios
git add .
git commit -m "feat: descripción de la funcionalidad"

# Push y PR
git push origin feature/nueva-funcionalidad
```

### 9.6 Formato de Commits

```
tipo: descripción corta

Tipos:
- feat: nueva funcionalidad
- fix: corrección de bug
- docs: documentación
- style: estilos CSS
- refactor: refactoring de código
- test: agregar/modificar tests
- chore: tareas de mantenimiento
```

---

<div align="center">

**Manual Técnico v2.0**  
**Sistema de Gestión de Citas SENA Bienestar**  
© 2026 SENA — Desarrollo de Software

</div>
