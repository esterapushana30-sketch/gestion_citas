# Configuración del Sistema

Este archivo contiene la configuración profesional para el Dashboard de Profesionales en el Sistema de Gestión de Citas SENA Bienestar.

## Uso

### 1. Configurar Variables de Entorno

Cree un archivo `.env` con las siguientes variables (ejemplo):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-value
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-value

# JWT Configuration (Required)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE_IN=7d

# Database Configuration (Optional)
DATABASE_URL=postgresql://postgres:password@localhost:5432/gestion_citas

# Application Configuration
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3000

# Security
BCRYPT_ROUNDS=12
SESSION_TIMEOUT=24h
```

### 2. Instalación de Dependencias

```bash
# Desde el directorio raíz del proyecto
cd gestion_citas

# Instalar dependencias
npm install
```

### 3. Ejecutar la Aplicación

```bash
# Iniciar el servidor de desarrollo
npm run dev
```

### 4. Ejecutar Scripts de Configuración

```bash
# Ejecutar script de configuración profesional
node ./setup-env.js

# Script de configuración alternativo (fácil de usar)
cd gestion_citas
chmod +x setup-env.js
./setup-env.js
```

## Variables de Entorno Requeridas

| Variable | Valor Por Defecto | Descripción |
|----------|-------------------|-------------|
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key-value` | Clave anónima de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key-value` | Clave de rol de servicio de Supabase |
| `JWT_SECRET` | `your-super-secret-jwt-key-here` | Secreto para firmar tokens JWT |
| `JWT_EXPIRE_IN` | `7d` | Tiempo de expiración de tokens JWT |
| `DATABASE_URL` | `postgresql://postgres:password@localhost:5432/gestion_citas` | URL de conexión a base de datos PostgreSQL |
| `NODE_ENV` | `development` | Entorno de ejecución (development/production) |
| `PORT` | `3000` | Puerto del servidor |
| `CORS_ORIGIN` | `http://localhost:3000` | Origen permitido para CORS |
| `BCRYPT_ROUNDS` | `12` | Rondas para bcrypt hashing |
| `SESSION_TIMEOUT` | `24h` | Tiempo de expiración de sesión |

## Características Principales

### Dashboard de Profesionales

El dashboard de profesionales proporciona:

- **Gestión de Citas**: Confirmar, reprogramar, completar y cancelar citas
- **Disponibilidad**: Gestionar horarios de disponibilidad diaria
- **Estadísticas**: Resúmenes en tiempo real de actividad profesional
- **Filtrado**: Filtrar citas por especialidad y estado
- **Historial**: Ver historial completo de atención

### Especialidades Profesionales

- **Psicología** (`/psicologia`): Servicios de salud mental y apoyo psicológico
- **Enfermería** (`/enfermeria`): Servicios de enfermería y primeros auxilios
- **Trabajo Social** (`/trabajo-social`): Servicios de apoyo social y acompañamiento

### Control de Acceso Basado en Roles

- **SUPERADMIN**: Acceso completo a todo el sistema
- **COORDINACION**: Gestión de citas y usuarios
- **PSICOLOGIA/ENFERMERIA/TRABAJO_SOCIAL**: Solo sus propias especialidades
- **APRENDIZ**: Gestión de sus propias citas

### Configuración Profesional

- **Colores Institucionales SENA**: Gradient verde (#39a900), gris oscuro (#1a1a1a)
- **Pantallas Responsive**: Adaptable a móvil, tableta y escritorio
- **Modo Oscuro**: Soportado automáticamente por el sistema
- **Notificaciones**: Push, email y SMS integrados
- **Análisis**: Panel estadístico para supervisores

## Scripts de Base de Datos

### migraciones/

Directorio de scripts de migración de base de datos Supabase.

### database/query-examples.sql

Ejemplos de consultas SQL comunes para el sistema.

## Análisis y Supervisión

### Métricas

- **Citas por Profesional**: Seguimiento de carga de trabajo individual
- **Tasas de Ocupación**: Porcentaje de citas programadas vs disponibles
- **Tiempo de Respuesta**: Medición de velocidad de atención
- **Satisfacción**: Formularios de retroalimentación por cita

### Alertas

- **Citas pendientes críticas**: Más de X pendientes en una hora
- **Profesionales sobrecargados**: Más de Y citas en un turno
- **Horario no disponible**: Profesional sin cobertura en horario pico

## Información del Desarrollador

### Estructura del Proyecto

```
src/
├── features/
│   ├── auth/              # Autenticación y gestión de usuarios
│   ├── appointments/      # Módulo principal de gestión de citas
│   ├── dashboard/        # Dashboards por rol
│   └── admin/            # Panel de administración
├── shared/               # Componentes reutilizables
│   ├── components/      # UI components
│   ├── styles/          # Estilos globales (CSS/SCSS)
│   └── utils/           # Funciones utilitarias
├── lib/                  # Librerías de terceros
├── providers/            # Contextos de React
└── routes/              # Configuración de enrutamiento
```

### Tecnologías

- **Frontend**: React 19, TypeScript, Vite, React Router Dom v7
- **Estado**: React Hooks + Context API
- **API**: Supabase (PostgreSQL + Auth)
- **Estilo**: Tailwind CSS + Componentes CSS
- **Iconografía**: Lucide React
- **Notificaciones**: Sonner
- **Formateo de Fechas**: Date-fns
- **Seguridad**: JWT + Supabase RLS

### Librerías Clave

```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@supabase/supabase-js": "^2.103.0",
    "date-fns": "^4.1.0",
    "lucide-react": "^1.8.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-hook-form": "^7.72.1",
    "react-router-dom": "^7.14.0",
    "recharts": "^2.15.4",
    "sonner": "^2.0.7",
    "zod": "^4.3.6"
  }
}
```

### Principios SOLID

- **Single Responsibility**: Componentes con un solo propósito
- **Open/Closed**: Extensible sin modificar código existente
- **Liskov Substitution**: Componentes reemplazables sin efecto en tipo
- **Interface Segregation**: Interfaces específicas frente a generalistas
- **Dependency Inversion**: Dependencia en abstracciones, no en concretos

## Seguridad

### Autenticación

- **JWT**: Tokens con expiración de 7 días
- **Supabase Auth**: Gestión centralizada de usuarios
- **CORS**: Origenes restringidos y personalizados

### Autorización

- **RBAC**: Roles con permisos específicos
- **RLS**: Row Level Security en Supabase
- **Profiles**: Roles asociados a perfiles de usuario

### Configuración del Supervisor

```yaml
security:
  jwt_secret: "cambiar_a_jwt_secret_seguro"
  jwt_expire_in: "7d"
  bcrypt_rounds: 12
  session_timeout: "24h"
  csrf_enabled: true

supabase:
  url: "https://tu-proyecto.supabase.co"
  anon_key: "tu-clave-anon"
  service_role_key: "tu-clave-servicio"

database:
  url: "postgresql://postgres:password@localhost:5432/gestion_citas"
  ssl_mode: "require"

email:
  smtp_server: "smtp.gmail.com"
  smtp_port: "587"
  smtp_user: "noreply@sena.edu.co"
  smtp_pass: "tu_contraseña_app"
```

## Escenario de Despliegue

### Desarrollo Local

```bash
# 1. Clonar repositorio
cd /path/to/gestion_citas

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales reales

# 4. Ejecutar la aplicación
npm run dev
```

### Despliegue en Producción

```bash
# 1. Preparar servidor
# - Instalar Node.js 18+
# - Configurar PostgreSQL 14+
# - Ajustar variables de entorno del sistema

# 2. Clonar y desplegar
cd gestion_citas
npm install
# Configurar .env con secrets de producción
npm run build  # Si está disponible
# Iniciar servidor (node dist/index.js o similar)
```

## Mantenimiento

### Comandos de Rutina

```bash
# Validar configuración
node ./setup-env.js

# Limpiar caché de nodo
npm cache clean --force

# Verificar dependencias desactualizadas
npm outdated

# Ejecutar linter (si está configurado)
npm run lint

# Ejecutar tests (si están disponibles)
npm test
```

### Respaldo y Recuperación

```bash
# Asegurarse de que las configuraciones de backup estén activas en Supabase Console
# Programar backups diarios usando cron o soluciones gestionadas
# Probar restauración de backup periódicamente
```

## Compatibilidad de Navegadores

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Safari iOS** 14+
- **Chrome Mobile** 90+

## Agradecimientos

- SENA Bienestar por la confianza y especificación del proyecto
- La comunidad open-source por librerías y herramientas excepcionales
- Colaboradores por contribuciones y mejoras continuas

---

*Sistema de Gestión de Citas - Profesional Dashboard v2.0.0*
*Creado para SENA Bienestar - Servicios de Bienestar*
*© 2026 Todos los derechos reservados*

---

> **Nota del Desarrollador**: Este sistema está diseñado para ser una solución profesional de gestión de citas con enfoque en la experiencia del usuario, la escalabilidad y la calidad del código. Siga las instrucciones de configuración cuidadosamente para una implementación exitosa.
