# SISTEMA DE GESTIÓN DE CITAS SENA - SOLUCIÓN DE CONECTIVIDAD SUPABASE

## Problema: Conectividad Supabase Fallida

El error "ERR_NAME_NOT_RESOLVED" indica que el frontend JavaScript no puede conectar a su proyecto Supabase.

## Solución Inmediata: Modo Demo / Desarrollo

El sistema ahora incluye un **modo de desarrollo/autenticación simulado** que te permite probar la interfaz mientras configuras Supabase real. La aplicación mostrará mensajes informativos de que estás en modo demo.

## Solución a Largo Plazo: Proyecto Real de Supabase

### 🎯 PARES DE PASOS PARA CONFIGURAR SUPABASE REAL

#### 1. Crear Proyecto Supabase
```
1. Ve a https://supabase.com
2. Haz clic en "Start your journey"
3. Elige un plan (gratis está bien para empezar)
4. Elige un región cercana a tu audiencia (ejemplo: São Paulo, São Paulo)
5. Da un nombre a tu proyecto (ejemplo: gestion-citas-sena)
6. Crea tu cuenta
```

#### 2. Obtener Credenciales de Autenticación
```
🔑 PASO 1: Obtener URL del Proyecto
   - Ve a tu proyecto Supabase
   - Haz clic en "Settings" (icono de engranaje)
   - Ve a "API"
   - Copia el "Project URL"
     Ejemplo: `https://tu-proyecto-supabase.repli.co`

🔑 PASO 2: Obtener Clave Anónima (Anon Key)
   - ¡Misma página, debajo del "Project URL"
   - Copia el "anon key" (tienes "public" y "service_role")
   - Copia el "public" anon key:
     `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1zdGF0aW9uLXNlcnZlciIsImF1ZCI6ImFhdXRoZW4tc3VicyIsImlhdCI6MTcyNDcwODQwMCwiZXhwIjoyNzMzMzc3MDQwMH0.ejemplo-anon-key-real"

🔑 PASO 3: Obtener Clave de Rol de Servicio
   - ¡Misma página, debajo del "anon key"
   - Copia el "service_role key"
     `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1zdGF0aW9uLXNlcnZlciIsImF1ZCI6ImF1dGhlbnRpY2F0ciIsImlhdCI6MTcyNDcwODQwMCwiZXhwIjoyNzMzMzc1NDAwMH0.ejemplo-service-role-key-real"
```

#### 3. Configurar Archivo .env
```bash
# Editar archivo .env en la raíz del proyecto

cat .env
```

Reemplaza las variables placeholder con tus credenciales reales de Supabase:

```env
# =========================================
# REQUERIDO: Credenciales SUPABASE REALES
# =========================================

# ⚠️ REEMPLAZA ESTOS VALORES CON LOS DE TU PROYECTO SUPABASE REAL
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1zdGF0aW9uLXNlcnZlciIsImF1ZCI6ImF1dGhlbnRpY2F0ciIsImlhdCI6MTcyNDcwODQwMCwiZXhwIjoyNzMzMzc1NDAwMH0.tu-anon-key-real-aqui
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1zdGF0aW9uLXNlcnZlciIsImF1ZCI6ImF1dGhlbnRpY2F0ciIsImlhdCI6MTcyNDcwODQwMCwiZXhwIjoyNzMzMzc1NDAwMH0.tu-service-role-key-real-aqui

# =========================================
# CONFIGURACIÓN SEGURA (COMPLETAMENTE OPCIONAL)
# =========================================
JWT_SECRET=tu-super-secreto-jwt-key-aqui-replace-with-secure-random-string
JWT_EXPIRE_IN=7d

NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3000

APP_NAME=SENA Bienestar - Gestión de Citas
TIMEZONE=America/Bogota
CURRENCY=COP

EMAIL_SERVICE=smtp.gmail.com
EMAIL_USER=noreply@sena.edu.co
EMAIL_PASS=tu-contraseña-app-gmail-aqui
```

### 4. Generador de Configuración Rápido

Si estás atascado, ejecuta nuestro script de configuración:

```bash
# Desde la raíz del proyecto
cd gestion-citas

# Ejecutar script (crea el archivo .env)
chmod +x setup-env.js
./setup-env.js

# ¡Luego edita el .env resultante con valores reales!
```

### 5. Validar Configuración

Después de actualizar .env, valida con:

```bash
cd gestion-citas
node ./setup-env.js
```

## 🚨 DETECCIÓN DE PROBLEMAS

### Problema: "ERR_NAME_NOT_RESOLVED"
✅ **SOLUCIÓN:** El sistema ahora detecta automáticamente URLs placeholder y muestra advertencias informativas.

### Problema: Usando Claves Placeholder
✅ **SOLUCIÓN:** El mock client muestra mensajes claros sobre cómo configurar Supabase real.

### Problema: No Conectar
✅ **SOLUCIÓN:** Sistema de diagnóstico integrado que guía hacia el diagnóstico paso a paso.

## 🎛️ QUE ERES MODO DEMO / MODO DESARROLLO

Cuando usas placeholders, la aplicación muestra:

```
⚠️  MODO DESARROLLO DETECTADO
Usando cliente Supabase simulado.
Para producción, configura tu proyecto Supabase real.

Para configurar Supabase real:
  1. Ve a https://supabase.com
  2. Crea un proyecto (ejemplo: gestion-citas-proyecto)
  3. Obtén Project URL y ANON KEY
  4. Agrega VITE_SUPABASE_URL=tu-url-real
  5. Agrega VITE_SUPABASE_ANON_KEY=tu-anon-key-real
```

## Configurar Supabase Real

### Opción 1: Proyecto Gratuito de Supabase
```
1. Regístrate en https://supabase.com
2. Crea un nuevo proyecto:
   - Nombre: gestion-citas-sena
   - Región: São Paulo (más cercano)
   - Plan: Gratuito ($0)
3. Obtén credenciales de `/settings/api`
4. Configura .env con URL real y claves
```

### Opción 2: Supabase Local (Test)
```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar proyecto local
supabase init

# Añadir pgAdmin u otra herramienta de bd local
# Editar scripts de migración en supabase/ folder
# Ejecutar migraciones
```

## Función: Estado de Conectividad

Visita `/health` para verificar el estado:

```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "timestamp": "2026-06-30T10:24:00.000Z",
  "supabase": "connected",
  "database": "connected",
  "version": "1.0.0",
  "environment": "development"
}
```

## 🎯 PRÓXIMOS PASOS

1. **Obtén Proyecto Supabase Real** de supabase.com
2. **Actualiza .env** con credenciales reales
3. **Verifica** con `node ./setup-env.js`
4. **Reinicia servidor** `npm run dev`
5. **¡Empieza a trabajar!** 🎉

## Enlaces Importantes

- **Guía de Inicio Rápido Supabase:** https://supabase.com/docs/guides/getting-started/quickstart
- **Documentación API:** https://supabase.com/docs/api
- **Soporte Supabase:** https://community.supabase.com
- **GitHub del Proyecto:** https://github.com/SENA-Digital/gestion-citas

## Estado del Sistema

### ✅ COMPLETADO
- 🤖 Sistema de interfaz de usuario profesional completo
- 📊 Dashboard de profesionales con gestión de citas
- 🔐 Sistema RBAC con verificación de roles
- 🎨 Diseño responsivo moderno
- 📱 Optimizado para móvil
- 🌙 Modo oscuro automático
- 📊 Paneles de estadísticas profesionales
- ⚡ Configuración profesional por especialidad
- 🛡️ Manejo robusto de errores
- 🧪 Tratamiento mejorado de errores

### ⏳ CONFIGURACIÓN REQUERIDA
- 🔑 Credenciales reales de Supabase (autenticación y base de datos)
- 🔐 JWT secret (para firma de tokens)
- 🌐 Configuración del servidor (puerto, CORS)

## 🎯 SIGUIENTE LÍNEA DE ACCIÓN

```bash
cd gestion-citas
git status
# Agregar cambios a setup-env.js
# Validar con node ./setup-env.js
# Ejecutar npm install
# Ejecutar npm run dev
```

La aplicación ahora funciona con un sistema de simulación completo mientras configuras Supabase real, permitiéndote probar toda la funcionalidad del profesional dashboard sin necesidad de acceder a una base de datos real inicialmente.

**¡Importante! Configura Supabase real tan pronto como sea posible para el funcionamiento completo del sistema, especialmente para la creación de citas, gestión de usuarios y operaciones en tiempo real!**