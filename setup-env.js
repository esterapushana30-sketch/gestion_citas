#!/usr/bin/env bash

# ============================================================================
# SCRIPT DE CONFIGURACIÓN PROFESIONAL - GESTIÓN DE CITAS SENA
# ============================================================================

# Función para verificar si una variable de entorno está definida
define_env_var() {
    local var_name=$1
    local default_value=$2
    
    if [ -z "${!var_name}" ]; then
        if [ -n "$default_value" ]; then
            export $var_name="$default_value"
            echo "✅ Usando valor por defecto para $var_name: $default_value"
        else
            echo "❌ Error: $var_name no está definida y no se proporcionó valor por defecto"
            exit 1
        fi
    fi
}

# Función para crear el archivo .env
create_env_file() {
    local project_dir="$(pwd)"
    local env_file="$project_dir/.env"
    
    echo "🔧 Creando archivo de configuración profesional..."
    echo "============================================================"
    
    # Backup del archivo .env actual si existe
    if [ -f "$env_file" ]; then
        mv "$env_file" "$env_file.backup.$(date +%Y%m%d_%H%M%S)"
        echo "📁 Archivo .env anterior respaldado"
    fi
    
    # Escribir la nueva configuración
    cat > "$env_file" << 'EOF'
# ============================================================================
# CONFIGURACIÓN DEL SISTEMA - SENA BIENESTAR GESTIÓN DE CITAS
# ============================================================================

# ============================================================================
# REQUERIDO: Configuración de Supabase
# ============================================================================
# ⚠️ DEBES REEMPLAZAR ESTOS VALORES CON LOS DE TU PROYECTO SUPABASE REAL
VITE_SUPABASE_URL=https://gestion-citas-sena.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInBhc3MiOiJ3ZSBlbmFibGVkLXNlcnZpY2UtdXNlciIsImlhdCI6MTcyNDcwODQwMCwiZXhwIjoyNzMzMzcxNzQwMH0.example-service-role-key-for-admin-operations
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInBhc3MiOiJ3ZSBlbmFibGVkLXNlcnZpY2UtdXNlciIsImlhdCI6MTcyNDcwODQwMCwiZXhwIjoyNzMzMzcxNzQwMH0.example-service-role-key-for-admin-operations

# ============================================================================
# AUTENTICACIÓN Y SEGURIDAD
# ============================================================================
JWT_SECRET=cambiar-por-un-secreto-jwt-real-y-seguro
delete_env_var JWT_SECRET "tu-super-secreto-jwt-key-aqui-replace-with-secure-random-string"
JWT_EXPIRE_IN=7d
delete_env_var SESSION_TIMEOUT "24h"
BCRYPT_ROUNDS=12

# ============================================================================
# CONFIGURACIÓN DEL SISTEMA
# ============================================================================
delete_env_var NODE_ENV "development"
delete_env_var PORT "3000"
delete_env_var CORS_ORIGIN "http://localhost:3000"

# ============================================================================
# CONFIGURACIÓN INSTITUCIONAL SENA
# ============================================================================
delete_env_var APP_NAME "SENA Bienestar - Gestión de Citas"
delete_env_var APP_VERSION "1.0.0"
delete_env_var TIMEZONE "America/Bogota"
delete_env_var CURRENCY "COP"
delete_env_var ADMIN_EMAIL "admin@sena.edu.co"
delete_env_var SUPPORT_EMAIL "support@sena.edu.co"

# ============================================================================
# CONFIGURACIÓN DE EMAIL (Opcional - para recuperación de contraseña)
# ============================================================================
delete_env_var EMAIL_SERVICE "smtp.gmail.com"
delete_env_var EMAIL_USER "noreply@sena.edu.co"
delete_env_var EMAIL_PASS "tu-contraseña-app-gmail-aqui"

# ============================================================================
# CARACTERÍSTICAS DEL SISTEMA
# ============================================================================
delete_env_var MAX_APPOINTMENTS_PER_USER "3"
delete_env_var APPOINTMENT_DURATION_MINUTES "60"
delete_env_var CANCELLATION_DEADLINE_HOURS "24"

# ============================================================================
# CONFIGURACIÓN DE ANÁLISIS Y REPORTES
# ============================================================================
delete_env_var ANALYTICS_ENABLED "true"
delete_env_var REPORTS_RETENTION_DAYS "365"

# ============================================================================
# CONFIGURACIÓN DE NOTIFICACIONES
# ============================================================================
delete_env_var PUSH_NOTIFICATION_ENABLED "true"

# ============================================================================
# CONFIGURACIÓN DE SEGURIDAD AVANZADA
# ============================================================================
delete_env_var CSRF_PROTECTION_ENABLED "true"
delete_env_var RATE_LIMITING_ENABLED "true"
delete_env_var MAX_LOGIN_ATTEMPTS "5"

# ============================================================================
# CONFIGURACIÓN DE UI/UX
# ============================================================================
delete_env_var DEFAULT_LANGUAGE "es"
delete_env_var TIME_FORMAT "24"
delete_env_var DATE_FORMAT "DD/MM/YYYY"

# ============================================================================
# CONFIGURACIÓN DEL DESARROLLADOR
# ============================================================================
delete_env_var DEVELOPER_EMAIL "tu-email@desarrollador.com"

# ============================================================================
# URLs DE DESARROLLO (OPCIONAL)
# ============================================================================
delete_env_var DEV_DATABASE_URL "postgresql://postgres:password@localhost:5432/gestion_citas_dev"
delete_env_var TEST_DATABASE_URL "postgresql://postgres:password@localhost:5432/gestion_citas_test"

# ============================================================================
# INFORMACIÓN DEL SISTEMA
# ============================================================================
# ================================================
# RESUMEN DE CONFIGURACIÓN
# ================================================
echo ""
echo "🎯 SISTEMA COMPLETAMENTE CONFIGURADO"
echo "========================================="
echo ""
echo "📋 Servicios principales:"
echo "   ✅ Autenticación y autorización RBAC"
echo "   ✅ Gestión profesional de citas"
echo "   ✅ Panel de estadísticas por especialidad"
echo "   ✅ Administración de disponibilidad de profesionales"
echo "   ✅ Sistema de notificaciones multi-canal"
echo "   ✅ Panel de control administrativo"
echo "   ✅ Gestión de usuarios aprendices"
echo "   ✅ Sistema de tickets de soporte"
echo "   ✅ Análisis y reportes"
echo "   ✅ Configuración multi-institucional SENA"
echo ""
echo "🔧 Para comenzar:"
echo "   1. npm install              # Instalar dependencias"
echo "    قدرة2. npm run dev              # Ejecutar aplicación"
echo ""
echo "🌐 Accesar en:"
echo "   http://localhost:3000"
echo ""
echo "📚 Documentación:"
echo "   Consulte README.md para detalles completos"
echo ""
echo "============================================================"
echo "✅ ¡Listo para desarrollo profesional!"
EOF
    
    echo "✅ Archivo de configuración profesional creado exitosamente: $env_file"
    echo ""
}

# Función para validar el archivo .env
validate_env_file() {
    local env_file="$1"
    local required_vars=("VITE_SUPABASE_URL" "VITE_SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY")
    
    echo "🔍 Validando archivo de configuración..."
    echo "========================================="
    
    local validation_passed=true
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" "$env_file"; then
            echo "❌ ERROR: $var no está configurado en .env"
            echo "   Set it with: export $var=tu_valor_real"
            validation_passed=false
        fi
    done
    
    if [ "$validation_passed" = true ]; then
        echo "✅ Validación completada - todos los requeridos presentes"
    else
        echo "❌ Validación fallida - complete las variables requeridas"
        exit 1
    fi
    
    echo ""
}

# Función para verificar si Supabase está accesible
check_supabase_access() {
    local url=$1
    local key=$2
    
    echo "🔌 Verificando conectividad con Supabase..."
    echo "========================================="
    
    if [[ "$url" == "https://gestion-citas-sena.supabase.co" ]]; then
        echo "⚠️  ADVERTENCIA: Usando URL de placeholder"
        echo "   Por favor, actualice VITE_SUPABASE_URL con su proyecto Supabase real"
        echo ""
        echo "Para obtener su URL y clave:"
        echo "   1. Visite https://supabase.com"
        echo "   2. Cree un proyecto (ejemplo: gestion-citas-sena)"
        echo "   3. Vaya a Settings → API"
        echo "   4. Copie el 'Project URL' y 'anon key'"
        echo ""
        echo "🔗 Tutorial: https://supabase.com/docs/guides/getting-started/quickstart"
        echo ""
    fi
}

# Función para obtener ayuda
print_help() {
    cat << 'EOF'
============================================================
AJUDA - Script de Configuración Profesional
============================================================

Este script ayuda a configurar el entorno .env para el Sistema de Gestión de Citas.

USO:
    ./setup-env.js                    # Configurar automáticamente
    ./setup-env.js --help             # Mostrar esta ayuda

CONFIGURACIÓN AUTOMÁTICA:
    El script creará un .env completo con valores por defecto
    y verificará los requisitos mínimos.

CONFIGURACIÓN MANUAL:
    Editar manualmente el archivo .env con tus propias credenciales.

REQUERIDOS MÍNIMOS:
    VITE_SUPABASE_URL        URL del proyecto Supabase
    VITE_SUPABASE_ANON_KEY   Clave anónima de Supabase  
    SUPABASE_SERVICE_ROLE_KEY  Clave de rol de servicio de Supabase

EJEMPLOS DE .env REAL:

VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInBhc3MiOiJ3ZSBlbmFibGVkLXNlcnZpY2UtdXNlciIsImlhdCI6MTcyNDcwODQwMCwiZXhwIjoyNzMzMzcxNzQwMH0.secreto-real-aqui
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInBhc3MiOiJ3ZSBlbmFibGVkLXNlcnZpY2UtdXNlciIsImlhdCI6MTcyNDcwODQwMCwiZXhwIjoyNzMzMzcxNzQwMH0.otro-secreto-real-aqui

PARA AYUDA:
    Consulta README.md en el directorio raíz
    Visite https://supabase.com/docs
    Contacte al soporte de SENA

============================================================
EOF
}

# Función principal
main() {
    echo "========================================"
    echo "🚀 Sistema de Configuración - SENA Bienestar"
    echo "========================================"
    
    if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
        create_env_file
        validate_env_file ".env"
        check_supabase_access "$VITE_SUPABASE_URL" "$VITE_SUPABASE_ANON_KEY"
    fi
}

# Procesar argumentos
if [[ "${1}" == "--help" ]]; then
    print_help
else
    main
fi
