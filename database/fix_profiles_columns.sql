-- ============================================
-- FIX: Agregar columnas faltantes a profiles
-- ============================================
-- Ejecuta este script en el SQL Editor de Supabase Dashboard

-- Agregar columnas que faltan (ignora errores si ya existen)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profession TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialty TEXT;

-- Verificar estructura actual de la tabla
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
